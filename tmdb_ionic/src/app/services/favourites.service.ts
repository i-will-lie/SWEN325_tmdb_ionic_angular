import { SessionService } from "./session.service";
import { HttpClient } from "@angular/common/http";
import { tmdb } from "./../../environments/environment";
import { UserDatabaseService } from "./user-database.service";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class FavouritesService {
  userDb;
  resultSub;
  result;
  personalListID;
  ratedMovies: any;
  ratedTV: any;

  ratingsTV;

  ratingsMovies;
  constructor(
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

  async getFavourites(listID: string) {
    const sessionID = this.sessionServ.sessionID;

    //api.themoviedb.org/3/account/{account_id}/lists?api_key=<<api_key>>&language=en-US&page=1

    this.result = await this.http
      .get(
        `${tmdb.tmdbAPI.url}list/${listID}?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${sessionID}`
      )
      .toPromise();

    console.log("RES", this.result["items"]);

    return this.result["items"];
  }

  checkFavStatus(listID, movieID) {
    return this.http
      .get(
        `${tmdb.tmdbAPI.url}list/${listID}/item_status?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${
          this.sessionServ.sessionID
        }&movie_id=${movieID}&language=en-US&page=1`
      )
      .toPromise();
  }

  addToFavourites(itemID) {
    console.log(
      "ADD TO FAV",
      `${tmdb.tmdbAPI.url}list/${this.tmdbFavId}/add_item?api_key=${
        tmdb.tmdbAPI.apiKey
      }&session_id=${this.sessionServ.sessionID}&language=en-US&page=1`
    );
    return this.http
      .post(
        `${tmdb.tmdbAPI.url}list/${this.tmdbFavId}/add_item?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${this.sessionServ.sessionID}&language=en-US&page=1`,
        { media_id: parseInt(itemID) },
        { headers: { "Content-Type": "application/json;charset=utf-8" } }
      )
      .toPromise()
      .catch(error => {
        this.auth.presentAlert(error["error"]["status_message"]);
        console.log("ERROR", error["error"]["status_message"]);
      });
  }

  removeFromFavourites(listID, itemID) {
    return this.http
      .post(
        `${tmdb.tmdbAPI.url}list/${listID}/remove_item?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${this.sessionServ.sessionID}&language=en-US&page=1`,
        { media_id: parseInt(itemID) },
        { headers: { "Content-Type": "application/json;charset=utf-8" } }
      )
      .toPromise();
  }

  async getMovieRatings() {
    const result = await this.http
      .get(
        `${tmdb.tmdbAPI.url}account/${
          this.sessionServ.accountID
        }/rated/movies?api_key=${tmdb.tmdbAPI.apiKey}&session_id=${
          this.sessionServ.sessionID
        }&language=en-US&page=1`
      )
      .toPromise();

    return result["results"];
  }

  async getTVRatings() {
    const result = await this.http
      .get(
        `${tmdb.tmdbAPI.url}account/${
          this.sessionServ.accountID
        }/rated/tv?api_key=${tmdb.tmdbAPI.apiKey}&session_id=${
          this.sessionServ.sessionID
        }&language=en-US&page=1`
      )
      .toPromise();

    return result["results"];
  }

  subToMovieRatings() {}

  async setRatedMovies() {
    console.log(
      "SET RATE",
      `${tmdb.tmdbAPI.url}account/${
        this.sessionServ.accountID
      }/rated/movies?api_key=${tmdb.tmdbAPI.apiKey}&session_id=${
        this.sessionServ.sessionID
      }&language=en-US&page=1`
    );
    //   .toPromise();
    // this.ratedMovies = res["results"];
    // console.log(res["results"]);
  }

  async setRatedTV() {
    //   .toPromise();
    // this.ratedTV = res["results"];
  }

  async getMovieRating(itemID) {
    return await this.http
      .get(
        `${tmdb.tmdbAPI.url}account/${
          this.sessionServ.accountID
        }/rated/tv?api_key=${tmdb.tmdbAPI.apiKey}&session_id=${
          this.sessionServ.sessionID
        }&language=en-US&page=1`
      )
      .toPromise()
      .then(res => {
        if (res["result"]) {
          let item = res["result"].filter(res => res["id"] == parseInt(itemID));
          if (item[0]) {
            console.log("RATING IS", item[0]["rating"]);
            return item[0]["rating"];
          }
        }
      });
  }
  //https://api.themoviedb.org/3/movie/{movie_id}/rating?api_key=<<api_key>>
  async rateItem(type, id, rating) {
    console.log(
      "rateItem",
      type,
      id,
      rating,
      `${tmdb.tmdbAPI.url}${type}/${id}/rating?api_key=${
        tmdb.tmdbAPI.apiKey
      }&session_id=${this.sessionServ.sessionID}&language=en-US&page=1`
    );
    return await this.http
      .post(
        `${tmdb.tmdbAPI.url}${type}/${id}/rating?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${this.sessionServ.sessionID}&language=en-US&page=1`,
        { value: parseInt(rating) },
        { headers: { "Content-Type": "application/json;charset=utf-8" } }
      )
      .toPromise();

    // https://api.themoviedb.org/3/tv/506574/rating?api_key=79ad210fe32318cf14cfeb7de2cb26fa&session_id=b17ae82ff5430a67c16fd06cb934f317ab23c5c3&language=en-US&page=1

    // if (type == "tv") {
    //   this.setRatedTV();
    // } else {
    //   this.setRatedMovies();
    // }
    // https://api.themoviedb.org/3/movie/{movie_id}/rating?api_key=<<api_key>>
  }

  removeRating(itemType, itemID) {
    return this.http
      .delete(
        `${tmdb.tmdbAPI.url}${itemType}/${itemID}/rating?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${this.sessionServ.sessionID}&language=en-US&page=1`,

        { headers: { "Content-Type": "application/json;charset=utf-8" } }
      )
      .toPromise();
  }
  getLists() {}

  addFriend() {}
}
