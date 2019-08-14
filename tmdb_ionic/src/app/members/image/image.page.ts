import { MenusService } from "./../../services/menus.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-image",
  templateUrl: "./image.page.html",
  styleUrls: ["./image.page.scss"]
})
/**
 * Displays poster image.
 */
export class ImagePage implements OnInit {
  posterPath; //url path for image to be displayed
  actionSheet; //ActionSheet referecne to allow menus to function.

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public menu: MenusService
  ) {}

  /**
   * On init user arugment as url path.
   */
  async ngOnInit() {
    this.posterPath = await this.activatedRoute.snapshot.paramMap.get(
      "poster_path"
    );
  }

  /**
   * Navigate back to previous Details page.
   */
  goBack() {
    this.navCtrl.pop();
  }
}
