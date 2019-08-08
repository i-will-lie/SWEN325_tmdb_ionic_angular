import { AuthenticationService } from "./../../services/authentication.service";
import { FavouritesService } from "./../../services/favourites.service";
import { Component, OnInit } from "@angular/core";

export enum FavouriteType {
  movie = "movies",
  series = "tv",
  episode = "tv/episodes"
}
@Component({
  selector: "app-favourites",
  templateUrl: "./favourites.page.html",
  styleUrls: ["./favourites.page.scss"]
})
export class FavouritesPage implements OnInit {
  result;
  favType = "movies";

  constructor(
    private authService: AuthenticationService,
    private favService: FavouritesService
  ) {}

  ngOnInit() {
    this.getFavourites();
  }

  getFavourites() {
    console.log("fave", this.favType);
    this.result = this.favService.getFavourites(
      this.authService.currentUser,
      this.favType
    );
  }
}
