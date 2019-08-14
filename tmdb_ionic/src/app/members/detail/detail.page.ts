import { MenusService } from "./../../services/menus.service";
import {
  AlertController,
  ActionSheetController,
  NavController
} from "@ionic/angular";

import { SearchService } from "./../../search.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FavouritesService } from "../../services/favourites.service";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"]
})
export class DetailPage implements OnInit {
  itemDetails = null; //item to display o the page
  itemGenres = null; //genres of this title
  posterPath; //url address of img
  itemID; //id of this item
  itemType; // type of this item, movie or tv

  userRating; //app user's rating for this title

  actionSheet; //acitionsheet for user actions
  alert; //to present alerts

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchServ: SearchService,
    private favouriteServ: FavouritesService,
    private alertCtrl: AlertController,
    private asCtrl: ActionSheetController,
    private router: Router,
    private navCtrl: NavController,
    public menu: MenusService
  ) {}

  /**
   * Initialise the fields of the item to display.
   */
  ngOnInit() {
    //uses route path to set fields
    this.itemID = this.activatedRoute.snapshot.paramMap.get("id");
    this.itemType = this.activatedRoute.snapshot.paramMap.get("type");

    //subscribe from database to retrieve the item
    this.searchServ.getDetails(this.itemType, this.itemID).subscribe(result => {
      this.itemGenres = result["genres"];
      this.posterPath = result["poster_path"];
      this.itemDetails = result;
      this.getUserRatings();
    });
  }

  /**
   * Get the user rating of this title.
   */
  async getUserRatings() {
    //get item appropriate from list of appropriate type
    const result =
      this.itemType == "tv"
        ? await this.favouriteServ.getTVRatings()
        : await this.favouriteServ.getMovieRatings();

    //get rating from result
    this.setItemRating(result);
  }

  /**
   * Set the user rating from the given list of item.
   *
   * @param ratingsItem
   */
  async setItemRating(ratingsItem) {
    //continue if the not empty
    if (ratingsItem != []) {
      //attempt to retrieve current item from list
      var item = await ratingsItem.filter(
        res => res["id"] == parseInt(this.itemID)
      );

      //if item found update rating otherwise item hasn't been voted on.
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

  /**
   * Return the url path of image of this item.
   */
  getImage(): string {
    return (
      "https://image.tmdb.org/t/p/original" + this.itemDetails["poster_path"]
    );
  }

  /**
   * ActionSheet managing rating and favourites.
   * Options to add/remove to favourites/ratings
   * with confirmations for removals
   * Has nested alert for rating.
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
              //prompt to select rating
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
                if (res) {
                  this.menu.presentToast("Added Title");
                  this.ngOnInit();
                }
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
                          this.menu.presentToast("Favourite Removed");
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

  /**
   * Navigate to image page of this item.
   */
  viewImage() {
    this.router.navigate(["/", "members", "image", this.posterPath]);
  }

  /**
   * Go back to previous page
   */
  goBack() {
    this.navCtrl.pop();
  }
}
