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
  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: SearchService,
    private http: HttpClient
  ) {
    //console.log("hi", service.result);
  }
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("new deatil");
    this.movieService.getDetails(id).subscribe(result => {
      this.itemDetails = result;
    });
    //this.getAccount();

    // // Get the information from the API
    // await this.movieService.getDetails(id).then(result => {
    //   console.log("res ", result);
    //   this.itemDetails = result;
    // });
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
