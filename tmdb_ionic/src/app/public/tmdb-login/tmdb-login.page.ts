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

  existingLogin = false; //flag for if there is existing tmdb login details
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
        this.existingLogin = true;
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
    console.log("LOGIN", this.userDbServ.dbUser);
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
      this.menu.presentAlert(tokenReqRes["error"]["status_message"]);
      this.load.dismiss();
      return;
    }
    //login with token to validate it.
    const loginRes = await this.tmdbAuthServ.tmdbAuthenticateLoginWithToken(
      this.tmdbUsername,
      this.tmdbPassword,
      token
    );

    if (loginRes["success"]) {
    } else {
      this.menu.presentAlert(loginRes["error"]["status_message"]);
      this.load.dismiss();
      return;
    }

    //authenticate the token to get session ID
    await this.tmdbAuthServ
      .tmdbRequestSession(token)
      .then(res => {
        tmdbSessionId = res["session_id"];
      })
      .catch(err => {
        this.menu.presentAlert("Unable to create session");
        return;
      })
      .finally(this.load.dismiss());

    //set authenticated flag to true for auth guard
    this.authService.tmdbAuthenticated = true;

    //get the account id of current user
    const tmdbAccID = await this.tmdbAuthServ.tmdbGetAccountID(tmdbSessionId);

    if (!tmdbAccID["id"]) {
      this.menu.presentAlert(tmdbAccID["error"]["status_message"]);
      this.load.dismiss();
    }

    //update database with tmdb detasl if they don't exist

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
    if (this.existingLogin) {
      this.loginSub.unsubscribe();
    }
    this.friendServ.initFriends();
    this.userDbServ.getListId();

    this.router.navigate(["members", "dashboard"]);
  }

  /**
   * Cancel the login and return to login page.
   */
  cancel() {
    this.authService.logout();
  }
}
