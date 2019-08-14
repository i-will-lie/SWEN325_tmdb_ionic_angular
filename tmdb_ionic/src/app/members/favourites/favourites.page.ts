import { MenusService } from "./../../services/menus.service";
import { SessionService } from "./../../services/session.service";
import { FavouritesService } from "./../../services/favourites.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { NavController } from "@ionic/angular";

/**
 * object to repesents the type of items.
 */
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
/**
 * Page to provide function ality regarding Favourites.
 * Shows the favourites list and allow navaigation to the individual items.
 */
export class FavouritesPage implements OnInit {
  favouritesResult: Observable<any>; //favourites of currently selected user
  favType = "movie"; //type of item, default to "movie"
  currentUsername; //username of currently dusplayed list
  currentUserID; //username of currently dusplayed list
  favouriteListID; //ID of favourites list of current user

  constructor(
    private favouriteServ: FavouritesService,
    private sessionServ: SessionService,
    private activatedRoute: ActivatedRoute,
    public menu: MenusService,
    private navCtrl: NavController
  ) {}

  /**
   * On init sets the current user using private path arguments.
   */
  async ngOnInit() {
    this.currentUserID = await parseInt(
      this.activatedRoute.snapshot.paramMap.get("accId")
    );
    this.favouriteListID = parseInt(
      this.activatedRoute.snapshot.paramMap.get("listId")
    );
    if (this.currentUserID == this.sessionServ.accountID) {
      this.currentUsername = "Your";
    } else {
      this.currentUsername = await this.activatedRoute.snapshot.paramMap.get(
        "username"
      );
    }
    this.setFavourites();
  }

  /**
   * Get then assign the favourites list of current user to field.
   */
  async setFavourites() {
    this.favouritesResult = await this.favouriteServ.getFavourites(
      this.favouriteServ.tmdbFavId
    );
  }
  /**
   * Check if item of given itemID is already in favourite list.
   *
   * @param itemID: number|string
   * @return Promise with boolean indicating if item is in list or not.
   */
  checkIfFavourite(itemID: number | string): Promise<boolean> {
    return this.favouriteServ
      .checkFavStatus(this.favouriteServ.tmdbFavId, itemID)
      .then(res => {
        return res["item_present"];
      });
  }
  /**
   * Remove title of given ID from favourites list.
   *
   * @param itemID
   */
  removeFromFavourites(itemID) {
    this.favouriteServ
      .removeFromFavourites(this.favouriteServ.tmdbFavId, itemID)
      .then(res => {
        this.setFavourites();
      });
  }
  /**
   * Check if the current favourites list is the app user.
   */
  isOwner(): boolean {
    return this.sessionServ.accountID == this.favouriteServ.tmdbAccId;
  }
  /**
   * Go back to previous page.
   */
  goBack() {
    this.navCtrl.pop();
  }
}
