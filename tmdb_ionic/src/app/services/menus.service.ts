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
/**
 * MenusService provides notification related services.
 */
export class MenusService {
  toast; //agent toast controll
  alert; //agent for alert controll

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
              this.favouriteServ.setCurrentUser(this.sessionServ.email);
              this.router.navigate([
                "members",
                "favourites",
                this.sessionServ.accountID,
                this.sessionServ.username,
                this.favouriteServ.currentTmdbFavId
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
            icon: "close"
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

  /**
   * Create a LoadController with a 60 sec timeout duration.
   */
  async createLoading() {
    return await this.loadCtrl.create({
      message: "Please Wait",
      duration: 60000,
      spinner: "lines-small"
    });
  }
  /**
   * Present an toast using the provided message.
   * Used for notices that can be ignored.
   * @param message :string message to display.
   */
  async presentToast(message: string) {
    this.toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: "top",
      showCloseButton: true,
      translucent: true
    });
    await this.toast.present();
  }

  /**
   * Present an alert using the provided message.
   * Used for noticed that requies attention.
   *
   * @param message :string message to display.
   */
  async presentAlert(message: string) {
    this.alert = await this.alertCtrl.create({
      message: message,
      buttons: ["OK"]
    });
    await this.alert.present();
  }
}
