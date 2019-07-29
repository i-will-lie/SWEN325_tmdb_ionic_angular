import { Router } from "@angular/router";
import { FbUser } from "./../../models/fbUser";
import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-fb-login",
  templateUrl: "./fb-login.page.html",
  styleUrls: ["./fb-login.page.scss"]
})
export class FbLoginPage implements OnInit {
  fbUser = {} as FbUser;
  email: string;
  password: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  fbLogin() {
    //console.log(this.email, this.password);

    //this.authService.fbLogin(this.fbUser.email, this.fbUser.password);
    this.authService.fbLogin("ss@ss.com", "ss1234").then(res => {
      if (res == true) {
        this.router.navigate(["tmdb-login"]);
        console.log("to tmdblogin");
        //this.router.navigate(["members", "dashboard"]);
      }
    });
  }
}
