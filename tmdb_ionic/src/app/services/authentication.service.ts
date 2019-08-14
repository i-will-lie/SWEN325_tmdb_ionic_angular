import { tmdb } from "./../../environments/environment";
import { UserDatabaseService } from "./user-database.service";
import { User } from "../models/user";
import { TmdbUser } from "./../models/tmdbUser";
import { ToastController, AlertController } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import "../models/fbUser";
import { FbUser } from "../models/fbUser";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

const tmdbURL = tmdb.tmdbAPI.url;
const tmdbAPI = tmdb.tmdbAPI.apiKey;

@Injectable({
  providedIn: "root"
})
/**
 * Provides authenticating services for the user.
 */
export class AuthenticationService {
  fbUser: FbUser; //current fb user object
  tmdbUser: TmdbUser; //current tmdb user object

  currentSessionID: string; //tracker for tmdb session id
  currentTmdbAccID: string; //tacker for tmdb account id

  //used for presenting toasts and alerts
  toast;
  alert;

  tmdbAuthenticated = false; //flag to track state of tmdb authentication

  constructor(
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private userDbService: UserDatabaseService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  /**
   * Attempt to login in to firebase server with given credentials
   * and return true is successful
   * @param email:string
   * @param password:string
   */
  async fbLogin(email: string, password: string): Promise<boolean> {
    console.log(email, password);

    let success = false; //flag for succcess of login attempt

    //sign in to firebase and set success to true if successful
    await this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log("LOG", res);

        this.fbUser = { email: email, password: password };
        success = true;
      })
      .catch(error => this.presentAlert(error.message));

    return success;
  }

  /**
   * Attempt to register to firebase server with given credentials
   * and return true is successful
   *
   * @param email:string
   * @param password:string
   */
  async fbRegister(email: string, password: string): Promise<boolean> {
    try {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.fbAddUser({ email: email, password: password });

      return true;
    } catch (e) {
      this.presentAlert(e.message);
      return false;
    }
  }

  /**
   * Present a Toast with the given message.
   *
   * @param message :string
   */
  async presentToast(message) {
    this.toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "top",
      showCloseButton: true,
      translucent: true
    });
    await this.toast.present();
  }

  /**
   * Present an Alert with the given message.
   * @param message: string
   */
  async presentAlert(message) {
    this.alert = await this.alertCtrl.create({
      message: message,
      buttons: ["OK"]
    });
    await this.alert.present();
  }

  /**
   * Add a user to the database.
   * Creates a User with the given FbUser.
   *
   * @param fbUser :firebase user
   */
  fbAddUser(fbUser: FbUser) {
    const newUser = {
      fbUser: fbUser,
      tmdbUser: null,
      sessionID: -1,
      friends: [],
      favourites: null,
      message: ""
    } as User;

    //add user to data base
    this.userDbService.createNewUser(newUser);
  }

  /**
   *Add
   *
   * @param tmdbUsername
   * @param tmdbPassword
   * @param tmdbAccountID
   */
  tmdbAddUser(
    tmdbUsername: string,
    tmdbPassword: string,
    tmdbAccountID: string
  ) {
    const newTmdbUser = {
      username: tmdbUsername,
      password: tmdbPassword,
      accountID: tmdbAccountID
    };

    this.userDbService.addTmdbUser(this.fbUser.email, newTmdbUser);
  }

  tmdbAddSession() {
    console.log("+s", this.fbUser.email, this.currentSessionID);
    this.userDbService.addTmdbSession(this.fbUser.email, this.currentSessionID);
  }

  async tmdbRequestToken() {
    try {
      return await this.http
        .get(`${tmdbURL}authentication/token/new?api_key=${tmdbAPI}`)
        .toPromise();
    } catch (e) {}
    return null;
  }

  async tmdbAuthenticateLoginWithToken(
    username: string,
    password: string,
    token: string
  ) {
    console.log(username, password);

    const loginData = {
      username: "joewill", //username,
      password: "abc123456", //password,
      //username: username,
      //password: password,
      request_token: token
    };

    const res = await this.http
      .post(
        `${tmdbURL}authentication/token/validate_with_login?api_key=${tmdbAPI}`,
        loginData
      )
      .toPromise();
    return res;
    console.log("login res", res);
  }
  async tmdbRequestSession(token: string) {
    const session = await this.http
      .post(`${tmdbURL}authentication/session/new?api_key=${tmdbAPI}`, {
        request_token: token
      })
      .toPromise();
    if (session["success"]) {
      this.currentSessionID = session["session_id"];
      console.log("sid", this.currentSessionID);
    }
    return session;
  }

  async tmdbGetAccountID(sessionID: string) {
    const tmdbAccID = await this.http
      .get(`${tmdbURL}account?api_key=${tmdbAPI}&session_id=${sessionID}`)
      .toPromise();
    return tmdbAccID;
  }

  async tmdbIsAuthenticated() {
    console.log("tmdbaut", this.tmdbAuthenticated);
    //return await this.afDatabase.tmdbLoggedOn();
    return this.tmdbAuthenticated;
  }
  requestTmdbToken() {
    const getURL = "authentication/token/new?api_key=";
    return this.http.get(`${tmdbURL}${getURL}${tmdbAPI}`).subscribe(res => {
      console.log("token", res);
      return res;
    });
  }

  // addUser(newUser) {
  //   this.currentUser = newUser;
  // }
  // addAccID(newID) {
  //   this.currentTmdbAccID = newID;
  // }

  // getCurrentUser() {
  //   return this.currentUser;
  // }
  async logout() {
    this.alert = await this.alertCtrl.create({
      message: "Do you wish to leave?",
      buttons: [
        {
          text: "Leave",
          handler: () => {
            this.userDbService.dbLogout(this.fbUser.email);
            this.afAuth.auth.signOut();
            this.router.navigate([""]);
          }
        },
        { text: "Stay", role: "cancel" }
      ]
    });
    await this.alert.present();
  }
  // /**

  // getAccID() {
  //   return this.currentTmdbAccID;
  // }
  // getSessionID() {
  //   return this.currentSessionID;
  // }

  /**
   * Get email of current user being accessed.
   */
  // getCurrentEmail() {
  //   return this.fbUser.email;
  // }

  /**
   * Firebase password reset request.
   *
   * @param email:string
   */
  resetPassword(email: string) {
    this.afAuth.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.presentToast("Password Reset sent: " + email);
      })
      .catch(error => this.presentAlert(error));
  }
}
