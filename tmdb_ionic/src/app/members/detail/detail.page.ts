import { MenusService } from "./../../services/menus.service";
import { AuthenticationService } from "./../../services/authentication.service";
import {
  AlertController,
  ActionSheetController,
  NavController
} from "@ionic/angular";
import { SessionService } from "./../../services/session.service";
import { filter } from "rxjs/operators";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { SearchType, SearchService } from "./../../search.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { getListeners } from "@angular/core/src/render3/discovery_utils";
import { FavouritesService } from "../../services/favourites.service";
import { tmdb } from "../../../environments/environment";
import { Alert } from "selenium-webdriver";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"]
})
export class DetailPage implements OnInit {
  itemDetails = null;
  itemGenres = null;
  list = null;
  userRating;
  ratingSub;
  itemID;
  itemType;
  actionSheet;
  alert;
  posterPath;
  // url = "https://image.tmdb.org/t/p/original/f2R11Ys1asseqyp5fnIMFC6ytE4.jpg";
  constructor(
    private activatedRoute: ActivatedRoute,
    private searchServ: SearchService,
    private http: HttpClient,
    private favouriteServ: FavouritesService,
    private sessionServ: SessionService,
    private alertCtrl: AlertController,
    private asCtrl: ActionSheetController,
    private router: Router,
    private navCtrl: NavController,
    private authServ: AuthenticationService,
    public menu: MenusService
  ) {
    //console.log("hi", service.result);
  }

  ngOnInit() {
    this.itemID = this.activatedRoute.snapshot.paramMap.get("id");
    this.itemType = this.activatedRoute.snapshot.paramMap.get("type");
    console.log("new deatil", this.itemType, this.itemType, this.itemType);
    this.searchServ.getDetails(this.itemType, this.itemID).subscribe(result => {
      this.itemGenres = result["genres"];
      this.posterPath = result["poster_path"];
      this.itemDetails = result;
      this.getUserRatings();
      //this.getRating();
    });
    //this.getAccount();

    // // Get the information from the API
    // await this.movieService.getDetails(id).then(result => {
    //   console.log("res ", result);
    //   this.itemDetails = result;
    // });
  }
  getGenres() {
    console.log(this.itemGenres);
  }

  async getUserRatings() {
    const result =
      this.itemType == "tv"
        ? await this.favouriteServ.getTVRatings()
        : await this.favouriteServ.getMovieRatings();

    this.getItemRating(result);
  }

  async getItemRating(ratings) {
    //var res = this.favouriteServ.ratedMovies;
    if (ratings != []) {
      var item = await ratings.filter(
        res => res["id"] == parseInt(this.itemID)
      );

      console.log("ITEM[0]", item, item[0]);

      if (item[0]) {
        this.userRating = await item[0]["rating"];
      } else {
        //this.userRating = -1;
        this.userRating = "Not Voted";
      }
    } else {
      this.userRating = "Not Voted";
    }
  }

  getImage() {
    return (
      "https://image.tmdb.org/t/p/original" + this.itemDetails["poster_path"]
    );
    // return "https://image.tmdb.org/t/p/original/f2R11Ys1asseqyp5fnIMFC6ytE4.jpg";
  }

  /**
   * ActionSheet managing rating and favourites.
   */
  async showActions() {
    const actionSheet = await this.asCtrl
      .create({
        header: "Actions",
        buttons: [
          {
            text: "Rate",
            role: "destructive",
            icon: "star-half",
            handler: () => {
              this.alert = this.alertCtrl
                .create({
                  header: "Rate",
                  inputs: [
                    {
                      name: "10",
                      type: "radio",
                      label: "10",
                      value: "10"
                    },
                    {
                      name: "9",
                      type: "radio",
                      label: "9",
                      value: "9"
                    },
                    {
                      name: "8",
                      type: "radio",
                      label: "8",
                      value: "8"
                    },
                    {
                      name: "7",
                      type: "radio",
                      label: "7",
                      value: "7"
                    },
                    {
                      name: "6",
                      type: "radio",
                      label: "6",
                      value: "6",
                      checked: true
                    },
                    {
                      name: "5",
                      type: "radio",
                      label: "5",
                      value: "5"
                    },
                    {
                      name: "4",
                      type: "radio",
                      label: "4",
                      value: "4"
                    },
                    {
                      name: "3",
                      type: "radio",
                      label: "3",
                      value: "3"
                    },
                    {
                      name: "2",
                      type: "radio",
                      label: "2",
                      value: "2"
                    },
                    {
                      name: "1",
                      type: "radio",
                      label: "1",
                      value: "1"
                    }
                  ],
                  buttons: [
                    {
                      text: "Cancel",
                      role: "cancel",
                      cssClass: "secondary"
                    },
                    {
                      text: "Ok",
                      handler: data => {
                        console.log(data);
                        this.favouriteServ
                          .rateItem(this.itemType, this.itemID, data)
                          .then(res => {
                            this.ngOnInit();
                          });
                      }
                    }
                  ]
                })
                .then(alert => alert.present());
            }
          },
          {
            text: "Add To Favourites",
            icon: "heart",
            handler: () => {
              this.favouriteServ.addToFavourites(this.itemID).then(res => {
                this.menu.presentToast("Added Title");
                this.ngOnInit();
              });
            }
          },
          {
            text: "Remove Rating",
            icon: "remove",
            handler: async () => {
              this.alert = await this.alertCtrl.create({
                message: "Do you wish to Remove?",
                buttons: [
                  {
                    text: "Remove",
                    handler: () => {
                      this.favouriteServ
                        .removeRating(this.itemType, this.itemID)
                        .then(res => {
                          this.menu.presentToast("Rating Removed");
                          this.ngOnInit();
                        });
                    }
                  },
                  { text: "Keep", role: "cancel" }
                ]
              });
              this.alert.present();
            }
          },
          {
            text: "Remove From Favourites",
            icon: "heart-dislike",
            handler: async () => {
              this.alert = await this.alertCtrl.create({
                message: "Do you wish to Remove?",
                buttons: [
                  {
                    text: "Remove",
                    handler: () => {
                      this.favouriteServ
                        .removeFromFavourites(
                          this.favouriteServ.tmdbFavId,
                          this.itemID
                        )
                        .then(res => {
                          this.menu.presentToast("Item Removed");
                          this.ngOnInit();
                        });
                    }
                  },
                  { text: "Keep", role: "cancel" }
                ]
              });
              this.alert.present();
            }
          },
          { text: "" },
          {
            text: "Cancel",
            icon: "close",
            role: "cancel"
          }
        ]
      })
      .then(actionsheet => {
        actionsheet.present();
      });
  }

  viewImage() {
    this.router.navigate(["/", "members", "image", this.posterPath]);
  }

  goBack() {
    this.navCtrl.pop();
  }
}
