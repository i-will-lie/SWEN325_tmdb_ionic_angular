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
    return await this.http
      .get(
        `${tmdb.tmdbAPI.url}authentication/token/new?api_key=${
          tmdb.tmdbAPI.apiKey
        }`
      )
      .toPromise()
      .catch(e => {
        return e;
      });
    // } catch (e) {
    //   return e; //this.menu.presentAlert(e);
    // }
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

    return await this.http
      .post(
        `${tmdb.tmdbAPI.url}authentication/token/validate_with_login?api_key=${
          tmdb.tmdbAPI.apiKey
        }`,
        loginData
      )
      .toPromise()
      .catch(error => {
        //this.menu.presentAlert(error);
        return error;
      });
    // return res;
  }
  /**
   * Use use Authenticated token to generate a session.
   *
   * @param token :string authenticated token to be used for get session ID.
   */
  async tmdbRequestSession(token: string) {
    return await this.http
      .post(
        `${tmdb.tmdbAPI.url}authentication/session/new?api_key=${
          tmdb.tmdbAPI.apiKey
        }`,
        {
          request_token: token
        }
      )
      .toPromise();
  }
  /**
   * Retrieve user
   *
   * @param sessionID
   */
  async tmdbGetAccountID(sessionID: string) {
    return await this.http
      .get(
        `${tmdb.tmdbAPI.url}account?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${sessionID}`
      )
      .toPromise()
      .catch(error => {
        return error;
      });
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

  /**
   * Create record of a tmdb user and add to the database.
   *
   * @param tmdbUsername :string
   * @param tmdbPassword :string
   * @param tmdbAccountID :string
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

    //assign the user information to the session serve
    this.sessionServ.accountID = tmdbAccountID;
    this.sessionServ.username = tmdbUsername;

    //add tmdb user details to the fb database.
    this.userDbServ.addTmdbUser(this.sessionServ.email, newTmdbUser);
  }

  /**
   * Check if user is authenticated for tmdb.
   * The session is autthen in sessino ig isn't -1.
   */
  tmdbIsAuthenticated() {
    return this.sessionServ.sessionID != -1;
  }
}
