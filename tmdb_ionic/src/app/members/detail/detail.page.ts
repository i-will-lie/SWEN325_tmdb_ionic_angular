import { HttpClient } from "@angular/common/http";

import { SearchType, SearchService } from "./../../search.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { getListeners } from "@angular/core/src/render3/discovery_utils";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"]
})
export class DetailPage implements OnInit {
  itemDetails = null;
  list = null;
  // url = "https://image.tmdb.org/t/p/original/f2R11Ys1asseqyp5fnIMFC6ytE4.jpg";
  constructor(
    private activatedRoute: ActivatedRoute,
    private searchServ: SearchService,
    private http: HttpClient
  ) {
    //console.log("hi", service.result);
  }
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("new deatil");
    this.searchServ.getDetails(id).subscribe(result => {
      this.itemDetails = result;
    });
    //this.getAccount();

    // // Get the information from the API
    // await this.movieService.getDetails(id).then(result => {
    //   console.log("res ", result);
    //   this.itemDetails = result;
    // });
  }

  getImage() {
    //return this.service.getImage(this.itemDetails);
    // var p = "/f2R11Ys1asseqyp5fnIMFC6ytE4.jpg";
    // //return this.searchService.getImage(path);
    // console.log("posterpath", this.itemDetails["poster_path"]);
    return (
      "https://image.tmdb.org/t/p/original" + this.itemDetails["poster_path"]
    );
    // return "https://image.tmdb.org/t/p/original/f2R11Ys1asseqyp5fnIMFC6ytE4.jpg";
  }

  // getAccount() {
  //   console.log("getting account");
  //   this.list = this.http
  //     .get(
  //       `https://api.themoviedb.org/3/account?api_key=${
  //         this.movieService.apiKey
  //       }`,
  //       {
  //         params: {
  //           api_key: "79ad210fe32318cf14cfeb7de2cb26fa",
  //           session_id: this.auth.tmdbUser.sessionID
  //         }
  //       }
  //     )
  //     .subscribe(res => console.log(res));
  // }
}
