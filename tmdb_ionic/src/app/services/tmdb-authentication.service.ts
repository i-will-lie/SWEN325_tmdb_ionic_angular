import { MenusService } from "./menus.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { HttpClient } from "@angular/common/http";
import { SessionService } from "./session.service";
import { Injectable } from "@angular/core";
import { tmdb } from "./../../environments/environment";
import { UserDatabaseService } from "./user-database.service";

@Injectable({
  providedIn: "root"
})
/**
 * Provide services for TmdbAuthentication to login.
 */
export class TmdbAuthenticationService {
  tmdbAuthSub; //holds subscription to the fb database for crossreferencing
  tmdbSessID = -1; // default value to signify no current seesion ID
  constructor(
    private sessionServ: SessionService,
    private http: HttpClient,
    private userDbServ: UserDatabaseService,
    private menu: MenusService
  ) {}

  /**
   * Request token from TMDB.
   */
  async tmdbRequestToken() {
    try {
      return await this.http
        .get(
          `${tmdb.tmdbAPI.url}authentication/token/new?api_key=${
            tmdb.tmdbAPI.apiKey
          }`
        )
        .toPromise();
    } catch (e) {
      this.menu.presentAlert(e);
    }
    return null;
  }

  /**
   * Authenticate otken with a user.
   *
   * @param username :string user username
   * @param password :string user password
   * @param token :string toeknn to be authenticated.
   */
  async tmdbAuthenticateLoginWithToken(
    username: string,
    password: string,
    token: string
  ) {
    //HTTP request data
    const loginData = {
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
      .toPromise()
      .catch(error => {
        this.menu.presentAlert(error);
      });
    return res;
  }
  /**
   * Use use Authenticated token to generate a session.
   *
   * @param token :string authenticated token to be used for get session ID.
   */
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
      .toPromise()
      .catch(error => {
        this.menu.presentAlert(error);
      });
    return session;
  }

  /**
   * Retrieve user
   *
   * @param sessionID
   */
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

  /**
   * Subscribe to the sessionID stored and the database.
   * -1 indicates it's there is no current session.
   */
  setAuthSub() {
    this.tmdbAuthSub = this.userDbServ.dbUser.subscribe(res => {
      if (res["tmdbUser"]["sessionID"]) {
        this.tmdbSessID = res["tmdbUser"]["sessionID"];
      } else {
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
