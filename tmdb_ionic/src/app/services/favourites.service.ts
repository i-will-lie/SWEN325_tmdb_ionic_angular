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
  result;

  constructor(
    private userDbService: UserDatabaseService,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {}

  getFavourites(targetUsername: string, type: string) {
    const sessionID = this.auth.getSessionID();
    const accID = this.auth.getAccID();
    console.log(
      sessionID,
      accID,
      type,
      "url",
      `${tmdb.tmdbAPI.url}account/${accID}/favorite/${type}?api_key=${
        tmdb.tmdbAPI.apiKey
      }&session_id=${sessionID}`
    );

    this.result = this.http
      .get(
        `${tmdb.tmdbAPI.url}account/${accID}/favorite/${type}?api_key=${
          tmdb.tmdbAPI.apiKey
        }&session_id=${sessionID}`
      )
      .pipe(
        map(results => {
          console.log("raw", results["results"]);
          return results["results"];
        })
      );

    return this.result;
  }

  addFriend() {}
}
