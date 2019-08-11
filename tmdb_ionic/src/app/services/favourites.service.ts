import { List } from "./../models/list";
import { SessionService } from "./session.service";
import { FavouriteType } from "./../members/favourites/favourites.page";
import { HttpClient } from "@angular/common/http";
import { tmdb } from "./../../environments/environment";
import { OnInit } from "@angular/core";
import { UserDatabaseService } from "./user-database.service";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthenticationService } from "../services/authentication.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class FavouritesService {
  userDb;
  resultSub;
  result;
  personalListID;

  constructor(
    private userDbServ: UserDatabaseService,
    private afStore: AngularFirestore,
    private http: HttpClient,
    private auth: AuthenticationService,
    private sessionServ: SessionService
  ) {}

  ngOnInit() {}

  dbUserInfo;
  //userName;
  email;
  tmdbUser;
  tmdbAccId;
  tmdbFavId;

  setCurrentUser(email) {
    console.log("SETTING EMAIL", email);
    this.dbUserInfo = this.afStore
      .collection("UserInfo")
      .doc(email)
      .valueChanges()
      .subscribe(res => {
        //this.userName = res["username"];
        this.email = res["fbUser"]["email"];
        this.tmdbUser = res["tmdbUser"]["username"];
        this.tmdbAccId = res["tmdbUser"]["accountID"];
        this.tmdbFavId = res["favourites"];
        console.log(
          "emailllllllllllll",
          this.email,
          this.tmdbUser,
          this.tmdbAccId,
          this.tmdbFavId
        );
        // console.log(this.userDbService.dbInfo);
      });
  }

  initFavServ() {
    // this.afStore
    //   .collection("UserInfo")
    //   .doc(this.sessionServ.email)
    //   .valueChanges()
    //   .subscribe(res => {
    //     this.personalListID = res["favourites"];
    //     if (res["favourites"] == null) {
    //       console.log("IS NULL");
    //       //this.initFavourites("favourites");
    //     }
    //   });
  }

  async getFavourites(listID: string) {
    const sessionID = this.sessionServ.sessionID;
    // const accID = this.sessionServ.accountID;
    // console.log(
    //   sessionID,
    //   accID,
    //   type,
    //   "url",
    //   `${tmdb.tmdbAPI.url}account/${accID}/favorite/${type}?api_key=${
    //     tmdb.tmdbAPI.apiKey
    //   }&session_id=${sessionID}`
    // );

    // return this.http
    //   .get(
    //     `${tmdb.tmdbAPI.url}account/${accID}/favorite/${type}?api_key=${
    //       tmdb.tmdbAPI.apiKey
    //     }&session_id=${sessionID}`
    //   )
    //   .pipe(
    //     map(results => {
    //       console.log("raw", results["results"]);
    //       return results["results"];
    //     })
    //   );

    console.log(
      sessionID,
      listID,

      "url",
      `${tmdb.tmdbAPI.url}list/${listID}?api_key=${
        tmdb.tmdbAPI.apiKey
      }&session_id=${sessionID}&language=en-US&page=1`
    );

    //api.themoviedb.org/3/account/{account_id}/lists?api_key=<<api_key>>&language=en-US&page=1

    this.result = await this.http
      .get(
        `${tmdb.tmdbAPI.url}list/${listID}?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${sessionID}`
      )
      .toPromise();

    console.log("RES", this.result["items"]);
    // .pipe(
    //   map(results => {
    //     console.log("raw", results["items"]);
    //     return results["results"];
    //   })
    // );

    return this.result["items"];
  }
  getLists() {}

  addFriend() {}
}
