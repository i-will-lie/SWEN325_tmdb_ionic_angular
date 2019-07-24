import { SearchType, SearchService } from "./../../search.service";
import { Component, OnInit, inject } from "@angular/core";
import { Observable } from "rxjs";

import { Router } from "@angular/router";
@Component({
  selector: "app-movies",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"]
})
export class SearchPage implements OnInit {
  results: Observable<any>;
  searchTerm: string = "";
  type: SearchType = SearchType.movie;
  selecteditem = null;
  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit() {}

  searchChanged() {
    this.results = this.searchService.searchData(this.searchTerm, this.type);

    //this.results.subscribe(res => {    })
  }

  getImage(path: string) {
    this.searchService.getImage(path);
  }
}
