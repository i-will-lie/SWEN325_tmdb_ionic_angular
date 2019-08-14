import { MenusService } from "./../../services/menus.service";
import { SearchType, SearchService } from "./../../search.service";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { NavController } from "@ionic/angular";

export enum FavouriteType {
  movie = "movie",
  series = "series",
  episode = "episode"
}
@Component({
  selector: "app-movies",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"]
})
/**
 * Page to search for movies or tv titles by name.
 */
export class SearchPage implements OnInit {
  searchResults: Observable<any>;
  searchTerm: string = "";
  type: SearchType = SearchType.movie;
  selecteditem = null;
  constructor(
    private searchService: SearchService,
    private navCtrl: NavController,
    public menu: MenusService
  ) {}

  ngOnInit() {}

  /**
   * Search for title when input field has been changed.
   * Update field with results.
   */
  searchChanged() {
    this.searchResults = this.searchService.searchData(
      this.searchTerm,
      this.type
    );
  }

  /**
   * Go back to previous page.
   */
  goBack() {
    this.navCtrl.pop();
  }
}
