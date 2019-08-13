import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router, NavigationExtras } from "@angular/router";
import { tmdb } from "../environments/environment";

export enum SearchType {
  all = "",
  movie = "movie",
  tv = "tv",
  episode = "episode"
}

@Injectable({
  providedIn: "root"
})
export class SearchService {
  //url = "http://www.omdbapi.com/";
  // url = "https://api.themoviedb.org/3/";
  // apiKey = "79ad210fe32318cf14cfeb7de2cb26fa";

  result = null;
  item = null;
  popular;
  constructor(private http: HttpClient) {}
  searchData(title: string, type: SearchType): Observable<any> {
    console.log(
      "serach:",
      `${tmdb.tmdbAPI.url}search/${type}?api_key=${
        tmdb.tmdbAPI.apiKey
      }&language=en-US&page=1&include_adult=false&query=${encodeURI(title)}`
    );
    this.result = this.http
      .get(
        `${tmdb.tmdbAPI.url}search/${type}?api_key=${
          tmdb.tmdbAPI.apiKey
        }&language=en-US&page=1&include_adult=false&query=${encodeURI(title)}`
      )
      .pipe(
        map(results => {
          console.log("raw", results["results"]);
          return results["results"];
        })
      );

    return this.result;
  }
  getDetails(type, id) {
    console.log("gettting details");
    console.log(
      "GETTTT details",
      `${tmdb.tmdbAPI.url}${type}/${id}?api_key=${
        tmdb.tmdbAPI.apiKey
      }&language=en-US`
    );
    return this.http.get(
      `${tmdb.tmdbAPI.url}${type}/${id}?api_key=${
        tmdb.tmdbAPI.apiKey
      }&language=en-US`
    );
  }
  getRandomMovie() {
    const index = this.generateNumber(this.popular.length);
    const item = this.popular[index]["id"];
    return this.getDetails("movie", item).toPromise();
  }
  async getPopular() {
    console.log(
      `${tmdb.tmdbAPI.url}movie/popular?api_key=${
        tmdb.tmdbAPI.apiKey
      }&language=en-US&page=1`
    );
    return await this.http
      .get(
        `${tmdb.tmdbAPI.url}movie/popular?api_key=${
          tmdb.tmdbAPI.apiKey
        }&language=en-US&page=1`
      )
      .toPromise();
  }

  generateNumber(length) {
    console.log("get random");
    return Math.floor(Math.random() * length);
  }
}
