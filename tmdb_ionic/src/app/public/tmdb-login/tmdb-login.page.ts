import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-tmdb-login",
  templateUrl: "./tmdb-login.page.html",
  styleUrls: ["./tmdb-login.page.scss"]
})
export class TmdbLoginPage implements OnInit {
  username: string;
  password: string;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  async tmdbLogin() {
    console.log("ress");

    const tokenReqRes = await this.authService.tmdbRequestToken();

    if (tokenReqRes["request_token"]) {
      console.log("token", tokenReqRes["request_token"]);
      var token = tokenReqRes["request_token"];
    } else {
      console.log("ERROR Token");
      return;
    }
    const loginRes = await this.authService.tmdbAuthenticateLoginWithToken(
      this.username,
      this.password,
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
    this.router.navigate(["members", "dashboard"]);
    //console.log("res2", res);
    //     .then(result => {
    //       //if true change pages
    //       console.log(result);
    //       //console.log("waiting login");
    //       if (result) {
    //         console.log("success tmdblogin");
    //         this.router.navigate(["members", "dashboard"]);
    //       } else {
    //         console.log("fail tmdblogin");
    //       }

    //       console.log("LOGIN done");
    //     });
  }
}
