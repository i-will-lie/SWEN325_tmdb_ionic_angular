import { SessionService } from "./session.service";
import { HttpClient } from "@angular/common/http";
import { tmdb } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root"
})
/**
 * Provides service for managing favourites titles.
 */
export class FavouritesService {
  dbUserInfo; //subscribe to current user
  currentEmail; //email of current user
  currentTmdbUser; //username of current user
  currentTmdbAccId; //friends of current user
  currentTmdbFavId; //favourite list id of current user

  currentfavourites; //favorites
  constructor(
    private afStore: AngularFirestore,
    private http: HttpClient,
    private auth: AuthenticationService,
    private sessionServ: SessionService
  ) {}

  ngOnInit() {}

  /**
   *set the details of the currently selected user.

   * @param email: string
   */
  setCurrentUser(email: string) {
    this.dbUserInfo = this.afStore
      .collection("UserInfo")
      .doc(email)
      .valueChanges()
      .subscribe(res => {
        this.currentEmail = res["fbUser"]["email"];
        this.currentTmdbUser = res["tmdbUser"]["username"];
        this.currentTmdbAccId = res["tmdbUser"]["accountID"];
        this.currentTmdbFavId = res["favourites"];
        console.log();
      });
  }

  /**
   * Get the favourites list of the given ID.
   *
   * @param listID
   */
  async getFavourites(listID) {
    const sessionID = this.sessionServ.sessionID;
    this.currentfavourites = await this.http
      .get(
        `${tmdb.tmdbAPI.url}list/${listID}?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${sessionID}`
      )
      .toPromise();
    return this.currentfavourites["items"];
  }

  /**
   * Add Item to favourites.
   * NOTE: current API doesn't support lsit of different types.
   * trying to add a tv item will instead add a movei with the same id.
   * @param itemID
   */
  addToFavourites(itemID) {
    return this.http
      .post(
        `${tmdb.tmdbAPI.url}list/${this.currentTmdbFavId}/add_item?api_key=${
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
  /**
   * Remove item from the given list.
   * @param listID
   * @param itemID
   */
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

  /**
   * Get all movies that have been rated.
   */
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

  /**
   * Get all tv shows that have been rated.
   */
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

  /**
   * Set the rating of the given item.
   *
   * @param type
   * @param id
   * @param rating
   */
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
  }
  /**
   * Remove rating of given item.
   *
   * @param itemType
   * @param itemID
   */
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
