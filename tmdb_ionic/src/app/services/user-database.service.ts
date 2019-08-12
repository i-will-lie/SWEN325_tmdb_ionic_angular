import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tmdb } from "./../../environments/environment";
import { map } from "rxjs/operators";
import { SessionService } from "./session.service";
import { Observable } from "rxjs";
import { User } from "./../models/user";
import { Injectable, Type } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class UserDatabaseService {
  dbUser: Observable<any>;
  dbInfo;
  favSub;
  favouriteListID;

  constructor(
    private firestore: AngularFirestore,
    private sessionServ: SessionService,
    private http: HttpClient
  ) {}

  OnInit() {}

  createNewUser(user: User) {
    return this.firestore
      .collection("UserInfo")
      .doc(user.fbUser.email)
      .set(user);
  }

  addFriendCollection(email) {
    this.firestore
      .collection("UserInfo")
      .doc(email)
      .collection("friends")
      .doc(email)
      .set(-1);
  }

  // test() {
  //   console.log(
  //     "BLABJFD",
  //     this.firestore
  //       .collection("UserInfo")
  //       .doc(this.sessionServ.email)
  //       .snapshotChanges()
  //       .map()
  //   );
  // }

  addTmdbUser(fbUserEmail, tmdbUser) {
    //console.log("fb", fbUserEmail, "tmdb", tmdbUser);
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ tmdbUser: tmdbUser });
  }

  addTmdbSession(fbUserEmail, sessionID) {
    //console.log("updatessid", fbUserEmail, sessionID);
    console.log("lo", this.getIDFromEmail(fbUserEmail));
    this.sessionServ.sessionID = sessionID;
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ sessionID: sessionID });
  }

  dbLogout(fbUserEmail) {
    console.log("logginout", fbUserEmail);
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ sessionID: -1 });

    // this.firestore
    //   .collection("UserInfo")
    //   .doc(fbUserEmail)
    //   .update({ tmdbUser: -1 });
  }

  tmdbLoggedOn(fbUserEmail) {
    console.log("getting");
    console.log(this.dbUser);
    //return res;
  }

  async connectToDb(fbUserEmail) {
    console.log("subscribing");
    this.dbUser = await this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .valueChanges();
    // .subscribe(res => {
    //   this.dbInfo = res;
    // });
    await console.log("db ___Uder", this.dbUser);
  }

  updateUsername(fbUserEmail, newName) {
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ username: newName });
  }
  getDbInfo() {
    return this.dbInfo;
  }

  getDbUser() {
    var user;
    this.dbUser;
  }

  async getIDFromEmail(email: string) {
    var id;
    await this.firestore
      .collection("UserInfo")
      .doc(email)
      .valueChanges()
      .subscribe(res => {
        id = res["accountID"];
      });

    return id;
  }

  // async setUpFav() {
  //   let favList = await this.firestore
  //     .collection("UserInfo")
  //     .doc(this.sessionServ.email)
  //     .valueChanges()
  //     .subscribe(res => {
  //       favList = res["favorites"];
  //     });
  //   console.log("faavLI", favList);
  //   //vreate new list
  //   let favID = await this.http.post(
  //     `${tmdb.tmdbAPI.url}list?api_key=${tmdb.tmdbAPI.apiKey}&session_id=${
  //       this.sessionServ.sessionID
  //     }`,
  //     { name: "favourites", description: "", language: "" },
  //     { headers: { "Content-Type": "application/json;charset=utf-8" } }
  //   );
  //   //118788
  //   await console.log("favID", favID);
  //   return favID.toPromise();
  //   //{ headers: { "Content-Type": "application/json;charset=utf-8" } }
  // }

  async getListId() {
    console.log(
      "FSDFDSF",
      `${tmdb.tmdbAPI.url}account/${this.sessionServ.accountID}/lists?api_key=${
        tmdb.tmdbAPI.apiKey
      }&session_id=${this.sessionServ.sessionID}`
    );
    //get lists of movies
    let list = await this.http
      .get(
        `${tmdb.tmdbAPI.url}account/${
          this.sessionServ.accountID
        }/lists?api_key=${tmdb.tmdbAPI.apiKey}&session_id=${
          this.sessionServ.sessionID
        }`
      )
      .toPromise();

    console.log("ResSSS", list);
    const id = list["results"][0]["id"];

    console.log("result", id);
    console.log("LIST id ", id);

    this.firestore
      .collection("UserInfo")
      .doc(this.sessionServ.email)
      .update({ favourites: id });
    console.log("init fav222222222222222222222");
  }

  setFavListID() {
    this.favSub = this.firestore
      .collection("UserInfo")
      .doc()
      .valueChanges()
      .subscribe(res => {
        console.log("FAV res", res["favourites"]);
        this.favouriteListID = res["favourites"];
      });
  }
  logout() {
    //this.dbUser.unsubscribe();
  }
}
