import { MenusService } from "./../../services/menus.service";
import { FavouritesService } from "./../../services/favourites.service";
import { TmdbAuthenticationService } from "./../../services/tmdb-authentication.service";
import { UserDatabaseService } from "./../../services/user-database.service";
import { SessionService } from "./../../services/session.service";
import { AuthenticationService } from "./../../services/authentication.service";

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FriendsService } from "../../services/friends.service";

@Component({
  selector: "app-tmdb-login",
  templateUrl: "./tmdb-login.page.html",
  styleUrls: ["./tmdb-login.page.scss"]
})

/**
 * Facilatats tthe authentication with TMDB.
 */
export class TmdbLoginPage implements OnInit {
  tmdbUsername: string; //tmdb username provided by user
  tmdbPassword: string; //tmdb password provided by user

  loginSub; //subscription to fb database to crossrefernce credentials
  load; //agent for load controller
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private sessionServ: SessionService,
    private userDbServ: UserDatabaseService,
    private tmdbAuthServ: TmdbAuthenticationService,
    private friendServ: FriendsService,
    private favouriteServ: FavouritesService,
    private menu: MenusService
  ) {}

  async ngOnInit() {
    this.checkIfHaveDetails();
  }
  /**
   * Check if there are existing TMDB login details in the firebase database.
   * Attempt to automatically login.
   */
  async checkIfHaveDetails() {
    this.load = await this.menu.createLoading();
    await this.load.present();

    this.menu.presentToast("Checking For Existing Credentials");

    //subscribe to the firebase database to check if there are existing credentials.
    this.loginSub = this.userDbServ.dbUser.subscribe(res => {
      //if credentials exist login using credentials from firebase.
      this.load.dismiss();
      if (res["tmdbUser"] != null) {
        console.log("YES");
        this.menu.presentToast("Logging in with Existing Details");
        (this.tmdbUsername = res["tmdbUser"]["username"]),
          (this.tmdbPassword = res["tmdbUser"]["password"]);

        this.tmdbLogin();
      } else {
        console.log("NONE");
        this.menu.presentToast("Please Login with TMDB Account");
      }
    });
    console.log("done");
  }
  /**
   * Attempt to authenticate with TMDB API by handshaking with tokens.
   */
  async tmdbLogin() {
    console.log("LOGIN");
    this.load = await this.menu.createLoading();
    await this.load.present();

    await this.tmdbAuthServ.setAuthSub();

    var tmdbSessionId; //to hold the session ID

    //Request a authentication token
    const tokenReqRes = await this.tmdbAuthServ.tmdbRequestToken();

    //request token and continued if received
    if (tokenReqRes["request_token"]) {
      var token = tokenReqRes["request_token"];
    } else {
      this.menu.presentAlert("Failured to generate Login Token");
      this.load.dismiss();
      return;
    }
    //login with token to validate it.
    const loginRes = await this.tmdbAuthServ.tmdbAuthenticateLoginWithToken(
      this.tmdbUsername,
      this.tmdbPassword,
      token
    );

    if (!loginRes["success"]) {
      this.menu.presentAlert("Incorrect Login Details");
      this.load.dismiss();
      return;
    }

    //authenticate the token to get session ID
    const sessionRes = await this.tmdbAuthServ.tmdbRequestSession(token);
    if (sessionRes["success"]) {
      tmdbSessionId = sessionRes["session_id"];
    } else {
      this.menu.presentAlert("Unable to create session");
      this.load.dismiss();
      return;
    }

    //set authenticated flag to true for auth guard
    this.authService.tmdbAuthenticated = true;

    //get the account id of current user
    const tmdbAccID = await this.tmdbAuthServ.tmdbGetAccountID(tmdbSessionId);
    console.log("id", tmdbAccID["id"]);
    console.log(
      "adding tmdbuser",
      tmdbAccID["id"],
      this.tmdbUsername,
      this.tmdbPassword
    );

    //collect information of current user to later use
    this.tmdbAuthServ.tmdbAddUser(
      this.tmdbUsername,
      this.tmdbPassword,
      tmdbAccID["id"]
    );

    //collection information regardarding the session
    //into a service where they can be shared
    this.sessionServ.sessionID = tmdbSessionId;
    this.userDbServ.addTmdbSession(
      this.sessionServ.email,
      this.sessionServ.sessionID
    );

    this.authComplete();
  }

  /**
   * Initalise/end various services adn subscription
   * so they will be ready when needed.
   */
  authComplete() {
    this.load.dismiss();
    this.loginSub.unsubscribe();
    this.friendServ.initFriends();
    this.userDbServ.getListId();
    this.favouriteServ.setRatedMovies();
    this.favouriteServ.setRatedTV();

    this.router.navigate(["members", "dashboard"]);
  }

  /**
   * Cancel the login and return to login page.
   */
  cancel() {
    this.authService.logout();
  }
}
