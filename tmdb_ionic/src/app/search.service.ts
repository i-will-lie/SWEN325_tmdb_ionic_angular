import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router, NavigationExtras } from "@angular/router";

export enum SearchType {
  all = "",
  movie = "movie",
  series = "series",
  episode = "episode"
}

@Injectable({
  providedIn: "root"
})
export class SearchService {
  //url = "http://www.omdbapi.com/";
  url = "https://api.themoviedb.org/3/";
  apiKey = "79ad210fe32318cf14cfeb7de2cb26fa";

  result = null;
  item = null;
  constructor(private http: HttpClient) {}
  searchData(title: string, type: SearchType): Observable<any> {
    this.result = this.http
      .get(
        `${this.url}search/${type}?api_key=${
          this.apiKey
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

  getDetails(id) {
    console.log("gettting details");
    console.log(
      "gett details",
      `${this.url}movie/${id}?api_key=${this.apiKey}&language=en-US`
    );
    return this.http.get(
      `${this.url}movie/${id}?api_key=${this.apiKey}&language=en-US`
    );
  }

  // getImage(itemDetails) {
  //   var p = "/f2R11Ys1asseqyp5fnIMFC6ytE4.jpg";
  //   //return this.searchService.getImage(path);
  //   console.log("posterpath", itemDetails["poster_path"]);
  //   return (
  //     "https://image.tmdb.org/t/p/original" + p //this.itemDetails["poster_path"]
  //   );
  // }

  // getImage(path) {
  //   //console.log(`https://image.tmdb.org/t/p/original${path}`);
  //   return `https://image.tmdb.org/t/p/original${path}`;
  // }
}
