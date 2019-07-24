import { Router } from "@angular/router";
import { FBUSer } from "./../../models/fbUser";
import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-fb-login",
  templateUrl: "./fb-login.page.html",
  styleUrls: ["./fb-login.page.scss"]
})
export class FbLoginPage implements OnInit {
  fbUser = {} as FBUSer;
  email: string;
  password: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("login init", (this.authService.authenticated = false));
  }

  fbLogin() {
    console.log("why you no work!!!");
    console.log(this.email, this.password);

    //this.authService.fbLogin(this.fbUser.email, this.fbUser.password);
    this.authService.fbLogin("ss@ss.com", "ss123456").then(res => {
      if (res == true) {
        this.router.navigate(["tmdb-login"]);
        console.log("to tmdblogin");
        //this.router.navigate(["members", "dashboard"]);
      }
    });
  }
}
