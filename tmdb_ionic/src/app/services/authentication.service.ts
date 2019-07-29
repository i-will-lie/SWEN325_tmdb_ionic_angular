import { UserDatabaseService } from "./user-database.service";
import { User } from "../models/user";
import { SessionService } from "./session.service";
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
var tmdbSessionID = null;

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
  tmdbSessionID: string;
  number = 5;

  tmdbAuthenticated = false;
  constructor(
    private storage: Storage,
    private plt: Platform,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private http: HttpClient,
    private sessionService: SessionService,
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
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
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
      sessionID: -1
    } as User;

    //add user to data base
    this.userDbService.createNewUser(newUser).then(res => {});
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
    console.log("adding user", this.fbUser.email, newTmdbUser);
    this.userDbService.addTmdbUser(this.fbUser.email, newTmdbUser);
  }

  tmdbAddSession() {
    console.log("+s", this.fbUser.email, this.tmdbSessionID);
    this.userDbService.addTmdbSession(this.fbUser.email, this.tmdbSessionID);
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
      this.tmdbSessionID = session["session_id"];
      console.log("sid", this.tmdbSessionID);
    }
    return session;
  }

  async tmdbGetAccountID(sessionID: string) {
    const tmdbAccID = await this.http
      .get(`${tmdbURL}account?api_key=${tmdbAPI}&session_id=${sessionID}`)
      .toPromise();
    return tmdbAccID;
  }

  // async tmdbLogin(username: string, password: string) {
  //   return this.http
  //     .get(`${tmdbURL}authentication/token/new?api_key=${tmdbAPI}`)
  //     .toPromise();

  //   var id: string;
  //   var loginSuccess = false;
  //   try {
  //     this.http
  //       .get(`${tmdbURL}authentication/token/new?api_key=${tmdbAPI}`)
  //       .toPromise()
  //       .then(tokenRes => {
  //         if (!tokenRes["request_token"]) {
  //           console.log("breaking");
  //           return; //return tokenRes;
  //         } else {
  //           console.log("success");
  //         }

  //         let loginData = {
  //           username: "joewill", //username,
  //           password: "abc123456", //password,
  //           request_token: tokenRes["request_token"]
  //         };
  //         console.log("got token", tokenRes["request_token"]);
  //         this.http
  //           .post(
  //             `${tmdbURL}authentication/token/validate_with_login?api_key=${tmdbAPI}`,
  //             loginData
  //           )
  //           .toPromise()
  //           .then(loginRes => {
  //             if (loginRes["success"]) {
  //               console.log("success login", loginRes);
  //             } else {
  //               console.log("failed login", loginRes);
  //               return; //loginRes;
  //             }
  //             // console.log(
  //             //   `${tmdbURL}authentication/token/validate_with_login?api_key=${tmdbAPI}`,
  //             //   data
  //             // );
  //             console.log("login response", loginRes["request_token"]);

  //             this.http
  //               .post(
  //                 `${tmdbURL}authentication/session/new?api_key=${tmdbAPI}`,
  //                 {
  //                   request_token: loginRes["request_token"]
  //                 }
  //               )
  //               .toPromise()
  //               .then(sessionRes => {
  //                 console.log("sess id", sessionRes, sessionRes["session_id"]);
  //                 id = sessionRes["session_id"];
  //                 this.authenticated = true;
  //                 this.authenticationState.next(true);
  //                 loginSuccess = true;

  //                 return sessionRes;
  //               });
  //           });
  //       });
  //     console.log("login success?", loginSuccess);
  //     return loginSuccess;
  //     this.authenticationState.next(true);
  //   } catch (e) {
  //     console.log("ERRORRRR", e.message);
  //     return false;
  //   }
  // }

  async tmdbIsAuthenticated() {
    console.log("tmdbaut", this.tmdbAuthenticated);
    //return await
    return this.tmdbAuthenticated;
  }
  // requestTmdbToken() {
  //   const getURL = "authentication/token/new?api_key=";
  //   return this.http.get(`${tmdbURL}${getURL}${tmdbAPI}`).subscribe(res => {
  //     console.log("token", res);
  //     return res;
  //   });
  // }

  async fbLogut() {
    this.afAuth.auth.signOut();
    const res = await this.storage.remove(this.fbUserID);
    //this.authenticationState.next(false);
    console.log("fblogout");
    await this.userDbService.logout(this.fbUser.email);
    this.tmdbAuthenticated = false;
    return res;
  }
  // fbIsAuthenticated() {
  //   console.log("checking auth state", this.authenticationState);
  //   return this.authenticationState.value;
  // }

  // checkToken() {
  //   console.log("checking token", this.authenticationState);
  //   console.log("ck", this.storage.get(this.fbUserID));

  //   this.storage.get(this.fbUserID).then(res => {
  //     if (res) {
  //       console.log("set to true");
  //       //this.authenticationState = true;
  //       //this.authenticationState.next(false);
  //     }
  //   });
  // }
}
