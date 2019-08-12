import { MenusService } from "./../../services/menus.service";
import { MenuController } from "@ionic/angular";
import { MenuController } from "@ionic/angular";
import { UserDatabaseService } from "./../../services/user-database.service";
import { SessionService } from "./../../services/session.service";
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
    private fbAuth: AuthenticationService,
    private router: Router,
    private sessionServ: SessionService,
    private userDbServ: UserDatabaseService,
    private menu: MenusService
  ) {}

  ngOnInit() {
    this.email = "ss@ss.com"; //this.fbAuth.fbEmail;
    this.password = "ss1234"; //this.fbAuth.fbPassword;
    console.log(this.email, this.password);
    this.fbLogin();
  }

  fbLogin() {
    //console.log(this.email, this.password);

    //this.fbAuthice.fbLogin(this.fbUser.email, this.fbUser.password);
    // this.email = "ss@ss.com";
    // this.password = "ss1234";
    const load = this.menu.presentLoading().then(res => {
      this.fbAuth.fbLogin(this.email, this.password).then(res => {
        if (res == true) {
          this.router.navigate(["tmdb-login"]);
          this.userDbServ.connectToDb(this.email);
          console.log("to tmdblogin");
          this.fbAuth.fbEmail = this.email;
          this.fbAuth.fbPassword = this.password;

          //this.router.navigate(["members", "dashboard"]);

          //on successful login set session email to the user email
          this.sessionServ.email = this.email;
        }
      });

      load.dismiss();
    });
  }

  setInputEmail() {
    this.fbAuth.setForgotEmail(this.email);
  }
}
