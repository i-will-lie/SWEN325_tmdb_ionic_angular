import { MenusService } from "./../../services/menus.service";
import { FavouritesService } from "./../../services/favourites.service";
import { AuthenticationService } from "./../../services/authentication.service";
import { SessionService } from "./../../services/session.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { NavController, ActionSheetController } from "@ionic/angular";

@Component({
  selector: "app-image",
  templateUrl: "./image.page.html",
  styleUrls: ["./image.page.scss"]
})
export class ImagePage implements OnInit {
  posterPath; //url path for image to be displayed
  actionSheet; //ActionSheet referecne to allow menus to function.
  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private asCtrl: ActionSheetController,
    private router: Router,
    private sessionServ: SessionService,
    private authServ: AuthenticationService,
    private favouriteServ: FavouritesService,
    public menu: MenusService
  ) {}

  async ngOnInit() {
    this.posterPath = await this.activatedRoute.snapshot.paramMap.get(
      "poster_path"
    );

    console.log("https://image.tmdb.org/t/p/original" + this.posterPath);
  }

  /**
   * Navigate back to previous Details page.
   */
  goBack() {
    this.navCtrl.pop();
  }
}
