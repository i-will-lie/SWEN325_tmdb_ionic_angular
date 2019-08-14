import { MenusService } from "./../../services/menus.service";
import { FavouritesService } from "./../../services/favourites.service";
import { FriendsService } from "./../../services/friends.service";
import { Component, OnInit } from "@angular/core";
import { UserDatabaseService } from "./../../services/user-database.service";
import {
  AlertController,
  ActionSheetController,
  NavController
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
/**
 * Displays profile of the currentlyh selected user. Provides functionality
 */
export class ProfilePage implements OnInit {
  constructor(
    private userDbService: UserDatabaseService,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    private friendsServ: FriendsService,
    public friendServ: FriendsService,
    private router: Router,
    private favouriteServ: FavouritesService,
    public menu: MenusService,
    private asCtrl: ActionSheetController,
    private navCtrl: NavController,
    private sessionServ: SessionService
  ) {}

  dbUserInfo; //currently displayed user
  currentEmail; //email of current user
  currentTmdbUser; //username of current user
  currentTmdbAccId; //account id of current user
  currentTmdbFavId; //favourite list id of current user
  currentFriends; //friends of current user
  currentMessage; //message written on profile

  alert; //for presenting alerts

  /**
   * On Init subscribe to database to get profile details of current user.
   */ async ngOnInit() {
    let email = await this.activatedRoute.snapshot.paramMap.get("email");

    //subscribe set set fields
    this.favouriteServ.setCurrentUser(email);
    this.dbUserInfo = await this.friendsServ
      .getProfile(email)
      .subscribe(res => {
        this.currentEmail = res["fbUser"]["email"];
        this.currentTmdbUser = res["tmdbUser"]["username"];
        this.currentTmdbAccId = res["tmdbUser"]["accountID"];
        this.currentTmdbFavId = res["favourites"];
        this.currentMessage = res["message"];
        console.log(
          "email",
          this.currentEmail,
          this.currentTmdbUser,
          res["favourites"],
          this.currentTmdbFavId
        );
      });
  }

  /**
   * Display the form to edit profile message.
   * Only available if current user is app user.
   */
  async showEditForm() {
    console.log("fsdfsd");
    const alert = await this.alertCtrl.create({
      header: "Edit your message",
      inputs: [
        {
          name: "message",
          type: "text",
          placeholder: this.currentMessage
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Ok",
          handler: data => {
            console.log("nw", data);
            this.userDbService
              .updateMessage(this.currentEmail, data.message)
              .then(() => this.ngOnInit());
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Add user using provided details
   * as friend if not already one or is self.
   * Present a toast if successful or alert if fail.
   *
   * @param email :string
   * @param username :string
   * @param accountID :String
   * @param favouriteID :string
   */
  addFriend(
    email: string,
    username: string,
    accountID: string | number,
    favouriteID: string | number
  ) {
    if (this.sessionServ.email == email) {
      this.menu.presentAlert("You can't friend YOURSELF!!!");
      return;
    }

    if (this.friendServ.addFriend(email, username, accountID, favouriteID)) {
      this.menu.presentToast("Added friend " + this.currentEmail);
    } else {
      this.menu.presentAlert(username + " is already a friend");
    }
  }
  /**
   * Remove user of provided email as friend
   * if not already removed or is self.
   * Present a toast if successful or alert if fail.
   * @param email
   */
  removeFriend(email) {
    if (this.sessionServ.email == email) {
      this.menu.presentAlert("You can't remove YOURSELF!!!");
      return;
    }

    if (this.friendServ.removeFriend(email)) {
      this.menu.presentToast("Removed friend " + this.currentEmail);
    } else {
      this.menu.presentAlert(this.currentTmdbUser + " is not a friend");
    }
  }

  /**
   * Get the email of app user.
   */
  getCurrentEmail() {
    return this.sessionServ.email;
  }

  /**
   * Navigate to favourites page of current profile user.
   */
  gotoFavourites() {
    let fav = this.favouriteServ.currentTmdbFavId;
    this.router.navigate([
      "members",
      "favourites",
      this.favouriteServ.currentTmdbAccId,
      this.favouriteServ.currentTmdbUser,
      fav
    ]);
  }

  /**
   * Show current actions available on page
   * to manage friends.
   */
  async showActions() {
    const actionSheet = await this.asCtrl.create({
      header: "Manage your friend",
      buttons: [
        {
          text: "View Favourites",
          icon: "heart",
          handler: () => {
            this.gotoFavourites();
          }
        },
        {
          text: "Add Friend",
          icon: "add",
          handler: () => {
            this.addFriend(
              this.currentEmail,
              this.currentTmdbUser,
              this.currentTmdbAccId,
              this.currentTmdbFavId
            );
          }
        },
        {
          text: "Remove Friend",
          icon: "remove",
          handler: async () => {
            this.alert = await this.alertCtrl.create({
              message: "Do you wish to remove " + this.currentTmdbUser + "?",
              buttons: [
                {
                  text: "Remove",
                  handler: () => {
                    this.removeFriend(this.currentEmail);
                  }
                },
                { text: "Keep", role: "cancel" }
              ]
            });
            this.alert.present();
          }
        },
        {},
        {
          text: "Cancel",
          icon: "close"
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Go back to previous page.
   */
  goBack() {
    this.navCtrl.pop();
  }
}
