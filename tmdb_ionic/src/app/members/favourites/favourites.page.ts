import { MenusService } from "./../../services/menus.service";
import { HttpClient } from "@angular/common/http";
import { FriendsService } from "./../../services/friends.service";
import { SessionService } from "./../../services/session.service";
import { AuthenticationService } from "./../../services/authentication.service";
import { FavouritesService } from "./../../services/favourites.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { NavController } from "@ionic/angular";

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
  result: Observable<any>;
  favType = "movie";
  currentUsername;
  currentID;
  listID;
  list;

  ratings;
  constructor(
    private authService: AuthenticationService,
    private favouriteServ: FavouritesService,
    private sessionServ: SessionService,
    private activatedRoute: ActivatedRoute,
    private friendServ: FriendsService,
    public menu: MenusService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.currentID = await parseInt(
      this.activatedRoute.snapshot.paramMap.get("accId")
    );
    this.listID = parseInt(this.activatedRoute.snapshot.paramMap.get("listId"));
    if (this.currentID == this.sessionServ.accountID) {
      this.currentUsername = "Your";
    } else {
      this.currentUsername =
        (await this.activatedRoute.snapshot.paramMap.get("username")) + "'s";
    }

    this.getFavourites();
    //this.result.subscribe(res => (this.list = res));
  }
  // async setCurrentName() {
  //   console.log(this.sessionServ.accountID, this.currentID);
  //   this.currentUser =
  //     this.sessionServ.accountID == this.currentID
  //       ? "Your"
  //       : this.friendServ.getUsernameFromID(this.currentID) + "'s";
  //   console.log("your name", this.currentUser);

  // }

  async getFavourites() {
    this.result = await this.favouriteServ.getFavourites(
      this.favouriteServ.tmdbFavId
    );
    console.log("fave", this.favType, this.currentID, this.result);
  }

  checkIfFavourite(itemID) {
    //let status;
    return this.favouriteServ
      .checkFavStatus(this.favouriteServ.tmdbFavId, itemID)
      .then(res => {
        console.log("STATUS", itemID, res["item_present"]);
        return res["item_present"];
      });
  }
  removeFromFavourites(itemID) {
    this.favouriteServ
      .removeFromFavourites(this.favouriteServ.tmdbFavId, itemID)
      .then(res => {
        console.log("removed", res);
        this.getFavourites();
      });
  }

  isOwner() {
    return this.sessionServ.accountID == this.favouriteServ.tmdbAccId;
  }
  goBack() {
    this.navCtrl.pop();
  }
}
