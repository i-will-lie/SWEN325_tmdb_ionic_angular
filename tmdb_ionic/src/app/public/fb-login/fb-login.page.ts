import { FormBuilder, Validators } from "@angular/forms";
import { MenusService } from "./../../services/menus.service";
import { UserDatabaseService } from "./../../services/user-database.service";
import { SessionService } from "./../../services/session.service";
import { Router } from "@angular/router";
import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-fb-login",
  templateUrl: "./fb-login.page.html",
  styleUrls: ["./fb-login.page.scss"]
})

/**
 * Start page of the App. Allows use to login, register and request password request.
 */
export class FbLoginPage implements OnInit {
  loginForm; //form containing login details
  loading; //LoadController for loading icon

  submitAttempt: boolean = false;
  constructor(
    private fbAuth: AuthenticationService,
    private router: Router,
    private sessionServ: SessionService,
    private userDbServ: UserDatabaseService,
    private menu: MenusService,
    private formBuilder: FormBuilder
  ) {}

  /**
   * initiliased the loginform with input validations.
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
          Validators.required
        ])
      ],
      password: [
        "",
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/),
          Validators.required
        ])
      ]
    });

    //this.fbLogin(); //auto login for testing
  }

  /**
   * Attempt to authentivate with firebase server.
   */
  async fbLogin() {
    //login to firebase, if successful continue to tmdb login page

    this.loading = await this.menu.createLoading();
    await this.loading.present();
    this.fbAuth
      .fbLogin(this.loginForm.value.email, this.loginForm.value.password)
      .then(res => {
        this.fbAuth.fbUser = {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        };
        this.router.navigate(["tmdb-login"]);

        //setup subscribtion to the firebase with user to have it available later.
        this.userDbServ.connectToDb(this.loginForm.value.email);

        //record email to session
        this.sessionServ.email = this.loginForm.value.email;
      })
      .catch(error => this.menu.presentAlert(error.message))
      .finally(this.loading.dismiss());

    //code for logining auto matically when testing
    // let email = "joewill@orcon.net.nz";
    // let password = "aaaa123";

    // this.loading = await this.menu.createLoading();
    // await this.loading.present();
    // this.fbAuth
    //   .fbLogin(email, password)
    //   //.fbLogin(this.loginForm.value.email, this.loginForm.value.password)
    //   .then(res => {
    //     this.loading.dismiss();
    //     if (res == true) {
    //       this.router.navigate(["tmdb-login"]);
    //       this.userDbServ.connectToDb(email);
    //       console.log("to tmdblogin");
    //       // this.fbAuth.fbEmail = email;
    //       // this.fbAuth.fbPassword = password;

    //       //this.router.navigate(["members", "dashboard"]);

    //       //on successful login set session email to the user email
    //       this.sessionServ.email = email;
    //     }
    //   });
  }

  /**
   * Register user to the App and present apporiate message for the attempt.
   */
  async fbRegister() {
    this.fbAuth
      .fbRegister(this.loginForm.value.email, this.loginForm.value.password)
      .then(res => {
        this.menu.presentToast("Successful Register");
        this.fbAuth.fbAddUser({
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        });
      })
      .catch(error => {
        this.menu.presentAlert(error.message);
      });
  }

  /**
   * Request reset password.
   */
  requestPasswordReset() {
    this.fbAuth.resetPassword(this.loginForm.value.email);
  }
}
