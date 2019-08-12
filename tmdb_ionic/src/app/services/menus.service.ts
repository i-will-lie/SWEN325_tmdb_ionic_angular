import { FavouritesService } from "./favourites.service";
import { SessionService } from "./session.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  ActionSheetController,
  ToastController,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root"
})
export class MenusService {
  loading;
  toast;
  alert;

  constructor(
    private router: Router,
    private asCtrl: ActionSheetController,
    private sessionServ: SessionService,
    private favouriteServ: FavouritesService,
    private authServ: AuthenticationService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController
  ) {}
  /**
   * ActionSheet used as main navigation menu in app.
   * When selected navigates to the selected page.
   */
  showMenu() {
    const actionSheet = this.asCtrl
      .create({
        header: "Menu",
        buttons: [
          {
            text: "Dashboard",
            role: "destructive",
            icon: "home",
            handler: () => {
              this.router.navigate(["members", "dashboard"]);
            }
          },
          {
            text: "Profile",
            icon: "person",
            handler: () => {
              this.router.navigate(["members", "profile"]);
            }
          },
          {
            text: "Search",
            icon: "search",
            handler: () => {
              this.router.navigate(["members", "search"]);
            }
          },
          {
            text: "Favourites",
            icon: "heart",
            handler: () => {
              this.router.navigate([
                "members",
                "favourites",
                this.sessionServ.accountID,
                this.sessionServ.username,
                this.favouriteServ.tmdbFavId
              ]);
            }
          },
          {
            text: "Friends",
            icon: "contacts",
            handler: () => {
              this.router.navigate(["members", "friends"]);
            }
          },
          { text: "" },
          {
            text: "Cancel",
            icon: "close",
            role: "cancel"
          },
          { text: "" },
          {
            text: "Logout",
            icon: "exit",
            handler: () => {
              this.authServ.logout();
            }
          }
        ]
      })
      .then(actionsheet => {
        actionsheet.present();
      });
  }

  async presentLoading() {
    const loading = await this.loadCtrl.create({
      message: "Please Wait"
    });
    return this.loading.present();
  }

  async presentToast(message) {
    this.toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "top",
      showCloseButton: true,
      translucent: true
    });
    this.toast.present();
  }

  presentAlert() {
    this.alert = this.alertCtrl.create({});
  }
}
