import { map } from "rxjs/operators";
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
export class TmdbLoginPage implements OnInit {
  tmdbUsername: string;
  tmdbPassword: string;
  loginSub;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private sessionServ: SessionService,
    private userDbServ: UserDatabaseService,
    private tmdbAuthServ: TmdbAuthenticationService,
    private friendServ: FriendsService
  ) {}

  async ngOnInit() {
    this.tmdbUsername = "";
    this.tmdbPassword = "";
    this.checkIfHaveDetails();
  }

  async checkIfHaveDetails() {
    this.loginSub = await this.userDbServ.dbUser.subscribe(res => {
      console.log("CHECKING DETAILS");
      //console.log("tUSRER", res["tmdbUser"]);
      if (res["tmdbUser"] != null) {
        (this.tmdbUsername = res["tmdbUser"]["username"]),
          (this.tmdbPassword = res["tmdbUser"]["password"]);
        this.tmdbLogin();
      }
    });
  }

  async tmdbLogin() {
    console.log("setting auth sub");
    await this.tmdbAuthServ.setAuthSub();

    // this.tmdbUsername = "joewill";
    // this.tmdbPassword = "abc123456";
    // console.log("aaa", this.tmdbUsername, this.tmdbPassword);
    var tmdbSessionId;

    const tokenReqRes = await this.tmdbAuthServ.tmdbRequestToken();

    if (tokenReqRes["request_token"]) {
      // console.log("token", tokenReqRes["request_token"]);
      var token = tokenReqRes["request_token"];
    } else {
      // console.log("ERROR Token");
      return;
    }
    // console.log("www", this.tmdbUsername, this.tmdbPassword);
    const loginRes = await this.tmdbAuthServ.tmdbAuthenticateLoginWithToken(
      this.tmdbUsername,
      this.tmdbPassword,
      token
    );
    // console.log("login done");

    if (loginRes["success"]) {
      console.log("loginRes", loginRes["success"]);
    } else {
      console.log("ERROR Login");
      return;
    }

    const sessionRes = await this.tmdbAuthServ.tmdbRequestSession(token);
    if (sessionRes["success"]) {
      // console.log("loginRes", sessionRes["session_id"]);
      tmdbSessionId = sessionRes["session_id"];
    } else {
      // console.log("ERROR session");
      return;
    }

    // /*const loginRes = await */ const res = await this.authService.tmdbLogin(
    //   this.username,
    //   this.password
    // );
    console.log("END");
    this.authService.tmdbAuthenticated = true;

    const tmdbAccID = await this.tmdbAuthServ.tmdbGetAccountID(tmdbSessionId);
    console.log("id", tmdbAccID["id"]);
    console.log(
      "adding tmdbuser",
      tmdbAccID["id"],
      this.tmdbUsername,
      this.tmdbPassword
    );

    this.tmdbAuthServ.tmdbAddUser(
      this.tmdbUsername,
      this.tmdbPassword,
      tmdbAccID["id"]
    );
    console.log("adding tmdbsession");
    this.sessionServ.sessionID = tmdbSessionId;
    this.userDbServ.addTmdbSession(
      this.sessionServ.email,
      this.sessionServ.sessionID
    );

    //console.log("lo", this.userDbServ.getIDFromEmail(this.sessionServ.email));
    //this.tmdbAuthServ.addUser(this.tmdbUsername);
    //this.tmdbAuthServ.addAccID(tmdbAccID["id"]);
    console.log("todash", this.tmdbUsername, this.tmdbPassword);
    this.loginSub.unsubscribe();
    this.friendServ.initFriends();
    this.userDbServ.getListId();

    this.router.navigate(["members", "dashboard"]);
  }
}
