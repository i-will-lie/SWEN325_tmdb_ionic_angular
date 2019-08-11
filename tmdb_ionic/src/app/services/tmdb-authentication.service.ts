import { AngularFirestore } from "@angular/fire/firestore";
import { HttpClient } from "@angular/common/http";
import { SessionService } from "./session.service";
import { Injectable } from "@angular/core";
import { tmdb } from "./../../environments/environment";
import { UserDatabaseService } from "./user-database.service";

@Injectable({
  providedIn: "root"
})
export class TmdbAuthenticationService {
  tmdbAuthSub;
  tmdbSessID = -1;
  constructor(
    private sessionServ: SessionService,
    private http: HttpClient,
    private userDbServ: UserDatabaseService,
    private afStore: AngularFirestore
  ) {}

  async tmdbRequestToken() {
    try {
      return await this.http
        .get(
          `${tmdb.tmdbAPI.url}authentication/token/new?api_key=${
            tmdb.tmdbAPI.apiKey
          }`
        )
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
      // username: "joewill", //username,
      // password: "abc123456", //password,
      username: username,
      password: password,
      request_token: token
    };

    const res = await this.http
      .post(
        `${tmdb.tmdbAPI.url}authentication/token/validate_with_login?api_key=${
          tmdb.tmdbAPI.apiKey
        }`,
        loginData
      )
      .toPromise();
    return res;
    console.log("login res", res);
  }
  async tmdbRequestSession(token: string) {
    const session = await this.http
      .post(
        `${tmdb.tmdbAPI.url}authentication/session/new?api_key=${
          tmdb.tmdbAPI.apiKey
        }`,
        {
          request_token: token
        }
      )
      .toPromise();
    // if (session["success"]) {
    //   this.sessionServ.sessionID = session["session_id"];
    //   //console.log("sid", this.sessionServ.sessionID);
    // }
    return session;
  }

  async tmdbGetAccountID(sessionID: string) {
    const tmdbAccID = await this.http
      .get(
        `${tmdb.tmdbAPI.url}account?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${sessionID}`
      )
      .toPromise();
    return tmdbAccID;
  }

  setAuthSub() {
    this.tmdbAuthSub = this.userDbServ.dbUser.subscribe(res => {
      console.log("got db sub");
      if (res["tmdbUser"]["sessionID"]) {
        console.log("pass");
        this.tmdbSessID = res["tmdbUser"]["sessionID"];
      } else {
        console.log("fail");
        this.tmdbSessID = -1;
      }
    });
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
    this.sessionServ.accountID = tmdbAccountID;
    this.sessionServ.username = tmdbUsername;

    console.log("adding user", this.sessionServ.email, newTmdbUser);
    this.userDbServ.addTmdbUser(this.sessionServ.email, newTmdbUser);
  }

  tmdbIsAuthenticated() {
    var b: boolean = this.sessionServ.sessionID != -1;

    console.log(this.sessionServ.sessionID, "sid", b);
    return b;
  }
  //
}
