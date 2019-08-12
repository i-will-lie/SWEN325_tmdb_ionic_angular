import { FormBuilder, Validators } from "@angular/forms";
import { MenusService } from "./../../services/menus.service";
import { MenuController, LoadingController } from "@ionic/angular";
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
  loginForm;
  loading;

  submitAttempt: boolean = false;
  constructor(
    private fbAuth: AuthenticationService,
    private router: Router,
    private sessionServ: SessionService,
    private userDbServ: UserDatabaseService,
    private menu: MenusService,
    private formBuilder: FormBuilder,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(
            "^(\\D)+(\\w)*((\\.(\\w)+)?)+@(\\D)+(\\w)*((\\.(D)+(\\w)*)+)?(\\.)[a-z]{3,30}$"
          ),
          Validators.required
        ])
      ],
      password: [
        "",
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,20}$"),
          Validators.required
        ])
      ]
    });
  }

  async fbLogin() {
    //console.log(this.email, this.password);

    //this.fbAuthice.fbLogin(this.fbUser.email, this.fbUser.password);
    // this.email = "ss@ss.com";
    // this.password = "ss1234";
    //const load = this.menu.presentLoading().then(res => {
    this.loading = await this.menu.createLoading();
    await this.loading.present();
    this.fbAuth
      .fbLogin(this.loginForm.value.email, this.loginForm.value.password)
      .then(res => {
        this.loading.dismiss();
        if (res == true) {
          this.router.navigate(["tmdb-login"]);
          this.userDbServ.connectToDb(this.loginForm.value.email);
          console.log("to tmdblogin");
          this.fbAuth.fbEmail = this.loginForm.value.email;
          this.fbAuth.fbPassword = this.loginForm.value.password;

          //this.router.navigate(["members", "dashboard"]);

          //on successful login set session email to the user email
          this.sessionServ.email = this.loginForm.value.email;
        }
      });

    //load.dismiss();
    //});
  }
  async fbRegister() {
    await console.log(
      "DETAIL",
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.fbAuth
      .fbRegister(this.loginForm.value.email, this.loginForm.value.password)
      .then(res => {
        if (res == true) {
          this.menu.presentToast("Successful Register");
        }
      })
      .catch(error => {
        this.menu.presentAlert(error.message);
      });
  }

  requestPasswordReset() {
    this.fbAuth.resetPassword(this.loginForm.value.email);
  }
}
