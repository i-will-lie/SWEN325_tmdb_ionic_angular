import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-tmdb-login",
  templateUrl: "./tmdb-login.page.html",
  styleUrls: ["./tmdb-login.page.scss"]
})
export class TmdbLoginPage implements OnInit {
  tmdbUsername: string;
  tmdbPassword: string;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  async tmdbLogin() {
    console.log("aaa", this.tmdbUsername, this.tmdbPassword);
    var tmdbSessionId;
    console.log("ress");

    const tokenReqRes = await this.authService.tmdbRequestToken();

    if (tokenReqRes["request_token"]) {
      console.log("token", tokenReqRes["request_token"]);
      var token = tokenReqRes["request_token"];
    } else {
      console.log("ERROR Token");
      return;
    }
    console.log("www", this.tmdbUsername, this.tmdbPassword);
    const loginRes = await this.authService.tmdbAuthenticateLoginWithToken(
      this.tmdbUsername,
      this.tmdbPassword,
      token
    );
    console.log("login done");

    if (loginRes["success"]) {
      console.log("loginRes", loginRes["success"]);
    } else {
      console.log("ERROR Login");
      return;
    }

    const sessionRes = await this.authService.tmdbRequestSession(token);
    if (sessionRes["success"]) {
      console.log("loginRes", sessionRes["session_id"]);
      tmdbSessionId = sessionRes["session_id"];
    } else {
      console.log("ERROR session");
      return;
    }

    // /*const loginRes = await */ const res = await this.authService.tmdbLogin(
    //   this.username,
    //   this.password
    // );
    console.log("END");
    this.authService.number = 10;
    this.authService.tmdbAuthenticated = true;

    const tmdbAccID = await this.authService.tmdbGetAccountID(tmdbSessionId);
    console.log("id", tmdbAccID["id"]);
    console.log(
      "adding tmdbuser",
      tmdbAccID["id"],
      this.tmdbUsername,
      this.tmdbPassword
    );

    this.authService.tmdbAddUser(
      this.tmdbUsername,
      this.tmdbPassword,
      tmdbAccID["id"]
    );
    console.log("adding tmdbsession");
    this.authService.tmdbAddSession();
    this.router.navigate(["members", "dashboard"]);
  }
}
