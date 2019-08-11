import { AuthenticationService } from "./../../services/authentication.service";

import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.page.html",
  styleUrls: ["./reset-password.page.scss"]
})
export class ResetPasswordPage implements OnInit {
  resetEmail: string;
  constructor(private authServ: AuthenticationService) {}

  ngOnInit() {
    this.resetEmail = this.authServ.getForgotEmail();
  }

  resetPassword() {
    this.authServ.resetPassword(this.resetEmail);
  }
}
