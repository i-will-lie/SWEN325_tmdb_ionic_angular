import { UserDatabaseService } from "./user-database.service";
import { User } from "../models/user";

import { TmdbUser } from "./../models/tmdbUser";
import { environment } from "./../../environments/environment.prod";
import { Platform, ToastController } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import "../models/fbUser";
import { FbUser } from "../models/fbUser";
import { HttpClient } from "@angular/common/http";
import { resolve } from "q";
import { AngularFireDatabase } from "angularfire2/database";

var fbLog = "auth-token";
//var currentSessionID = null;

const tmdbURL = "https://api.themoviedb.org/3/";
const tmdbAPI = "79ad210fe32318cf14cfeb7de2cb26fa";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  fbUser: FbUser;
  tmdbUser: TmdbUser;
  fbUserID: string;
  fbUserToken: string;
  //authenticationState = new BehaviorSubject(false);
  //authenticated: boolean = false;
  tmdbToken: string;
  currentUser: string;
  // currentSessionID: string;
  // currentTmdbAccID: string;

  fbPassword = "";
  fbEmail = "";

  private forgotEmail;
  tmdbAuthenticated = false;
  constructor(
    private storage: Storage,
    private plt: Platform,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private http: HttpClient,
    private afDatabase: AngularFireDatabase,
    private userDbService: UserDatabaseService
  ) {
    // this.plt.ready().then(() => {
    //   console.log("platform ready");
    //   this.checkToken();
    // });
  }

  async fbLogin(email: string, password: string) {
    try {
      console.log(email, password);
      const result = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.fbUser = { email: email, password: password };
      return true;
      // console.log(result);
      // console.log(result["user"]["W"]["O"]);
      // console.log(result["user"]["l"]);
      // this.fbUserID = result["user"]["W"]["O"];
      //this.fbUserToken = result["user"]["l"];
      //this.authenticationState.next(true);
      // return this.storage.set(this.fbUserID, this.fbUserToken).then(res => {
      //   //this.authenticationState = true;
      //   this.fbuser = { email: email, password: password };
      //   return true;
      // });
    } catch (e) {
      this.toast
        .create({ message: `${e.message}`, duration: 3000 })
        .then(obj => obj.present());
    }
  }

  async fbRegister(email: string, password: string) {
    try {
      console.log("reg1 ", email, password);
      this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      console.log("reg ", email, password);

      this.fbAddUser({ email: email, password: password });

      return true;
    } catch (e) {
      this.toast
        .create({ message: `${e.message}`, duration: 3000 })
        .then(obj => obj.present());
      return false;
    }
  }

  fbAddUser(fbUser: FbUser) {
    const newUser = {
      fbUser: fbUser,
      tmdbUser: null,
      sessionID: -1,
      friends: [],
      favourites: null
    } as User;

    //add user to data base
    this.userDbService.createNewUser(newUser);
    // .then(res => {
    //   this.userDbService.addFriendCollection(fbUser.email);
    // });
    console.log("start");
  }

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
    //this.currentTmdbAccID = tmdbAccountID;

    console.log("adding user", this.fbUser.email, newTmdbUser);
    this.userDbService.addTmdbUser(this.fbUser.email, newTmdbUser);
  }

  // tmdbAddSession() {
  //   console.log("+s", this.fbUser.email, this.currentSessionID);
  //   this.userDbService.addTmdbSession(this.fbUser.email, this.currentSessionID);
  //   console.log("subscribe next");
  //   //this.userDbService.connectToDb(this.fbUser.email);
  // }

  // async tmdbRequestToken() {
  //   try {
  //     return await this.http
  //       .get(`${tmdbURL}authentication/token/new?api_key=${tmdbAPI}`)
  //       .toPromise();
  //   } catch (e) {}
  //   return null;
  // }

  // async tmdbAuthenticateLoginWithToken(
  //   username: string,
  //   password: string,
  //   token: string
  // ) {
  //   console.log(username, password);

  //   const loginData = {
  //     username: "joewill", //username,
  //     password: "abc123456", //password,
  //     //username: username,
  //     //password: password,
  //     request_token: token
  //   };

  //   const res = await this.http
  //     .post(
  //       `${tmdbURL}authentication/token/validate_with_login?api_key=${tmdbAPI}`,
  //       loginData
  //     )
  //     .toPromise();
  //   return res;
  //   console.log("login res", res);
  // }
  // async tmdbRequestSession(token: string) {
  //   const session = await this.http
  //     .post(`${tmdbURL}authentication/session/new?api_key=${tmdbAPI}`, {
  //       request_token: token
  //     })
  //     .toPromise();
  //   if (session["success"]) {
  //     this.currentSessionID = session["session_id"];
  //     console.log("sid", this.currentSessionID);
  //   }
  //   return session;
  // }

  // async tmdbGetAccountID(sessionID: string) {
  //   const tmdbAccID = await this.http
  //     .get(`${tmdbURL}account?api_key=${tmdbAPI}&session_id=${sessionID}`)
  //     .toPromise();
  //   return tmdbAccID;
  // }

  // async tmdbIsAuthenticated() {
  //   console.log("tmdbaut", this.tmdbAuthenticated);
  //   //return await this.afDatabase.tmdbLoggedOn();
  //   return this.tmdbAuthenticated;
  // }
  // requestTmdbToken() {
  //   const getURL = "authentication/token/new?api_key=";
  //   return this.http.get(`${tmdbURL}${getURL}${tmdbAPI}`).subscribe(res => {
  //     console.log("token", res);
  //     return res;
  //   });
  // }

  // addUser(newUser) {
  //   this.currentUser = newUser;
  // }
  // addAccID(newID) {
  //   this.currentTmdbAccID = newID;
  // }

  getCurrentUser() {
    return this.currentUser;
  }
  async fbLogut() {
    const res = await this.userDbService.tmdbLoggedOn(this.fbUser.email);

    this.userDbService.dbLogout(this.fbUser.email);
    this.afAuth.auth.signOut();
    console.log("logged on", res);
    // this.afAuth.auth.signOut();
    // const res = await this.storage.remove(this.fbUserID);
    // //this.authenticationState.next(false);
    // console.log("fblogout");
    // await this.userDbService.logout(this.fbUser.email);
    // this.tmdbAuthenticated = false;
    // return res;
  }
  // getAccID() {
  //   return this.currentTmdbAccID;
  // }
  // getSessionID() {
  //   return this.currentSessionID;
  // }
  getEmail() {
    return this.fbUser.email;
  }

  setForgotEmail(forgotEmail: string) {
    this.forgotEmail = forgotEmail;
  }

  getForgotEmail() {
    return this.forgotEmail;
  }

  resetPassword(email: string) {
    this.afAuth.auth
      .sendPasswordResetEmail(email)
      .then()
      .catch(error => console.log(error));
  }

  logout() {}
}
