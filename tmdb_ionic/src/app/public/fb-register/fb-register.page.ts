import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-fb-register",
  templateUrl: "./fb-register.page.html",
  styleUrls: ["./fb-register.page.scss"]
})
export class FbRegisterPage implements OnInit {
  email: string;
  password: string;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async register() {
    this.authService.fbRegister(this.email, this.password).then(res => {
      if (res == true) {
        this.router.navigate(["fb-login"]);
      }
    });
  }
  ngOnInit() {}
}
