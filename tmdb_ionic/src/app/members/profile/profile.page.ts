import { MenusService } from "./../../services/menus.service";
import { FavouritesService } from "./../../services/favourites.service";
import { AuthenticationService } from "./../../services/authentication.service";
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
 * Displays profile of the currentlyh selected user
 */
export class ProfilePage implements OnInit {
  constructor(
    private userDbService: UserDatabaseService,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    private friendsServ: FriendsService,
    private authServ: AuthenticationService,
    public friendServ: FriendsService,
    private router: Router,
    private favouriteServ: FavouritesService,
    public menu: MenusService,
    private asCtrl: ActionSheetController,
    private navCtrl: NavController,
    private sessionServ: SessionService
  ) {}

  dbUserInfo;
  //username;
  email;
  tmdbUser;
  tmdbAccId;
  tmdbFavId;
  friends;
  alert;
  message;

  profile;
  async ngOnInit() {
    let email = await this.activatedRoute.snapshot.paramMap.get("email");
    let username = await this.activatedRoute.snapshot.paramMap.get("username");
    console.log("EMFDSF", email);
    // this.friendsServ.getProfile(email).subscribe(result => {
    //   this.profile = result;
    //   console.log("new deatil", result);
    // });

    this.favouriteServ.setCurrentUser(email);
    this.dbUserInfo = await this.friendsServ
      .getProfile(email)
      .subscribe(res => {
        console.log("pppppppppppp,", res);
        //this.username = res["username"];
        this.email = res["fbUser"]["email"];
        this.tmdbUser = res["tmdbUser"]["username"];
        this.tmdbAccId = res["tmdbUser"]["accountID"];
        this.tmdbFavId = res["favourites"];
        this.message = res["message"];
        console.log(
          "email",
          this.email,
          this.tmdbUser,
          res["favourites"],
          this.tmdbFavId
        );
        console.log(this.userDbService.dbInfo);
      });

    // console.log("un", dbUserInfo["username"]);
    // this.userName = dbUserInfo["username"];
    // this.email = dbUserInfo["fbUser"]["email"];
    // this.tmdbUser = dbUserInfo["tmdbUser"]["username"];
    // this.tmdbAccId = dbUserInfo["tmdbUser"]["accountID"];
    // console.log("email", this.email);
    // console.log(this.userDbService.dbInfo);
  }

  checkdb() {
    console.log("click pro button");
    // console.log(
    //   "dbservice",
    //   this.userDbService.dbInfo,
    //   this.userDbService.dbUser
    // );
  }
  // getDbUser() {
  //   return this.userDbService.getDbUser();
  // }

  // editText() {
  //   console.log("edit pressed");
  //   {
  //     if (this.editingText) {
  //       this.editingText = false;
  //     }
  //     {
  //       this.editingText = true;
  //     }
  //   }

  //   //
  // }
  async showEditForm() {
    const alert = await this.alert.create({
      header: "Edit your message",
      inputs: [
        {
          name: "message",
          type: "text",
          placeholder: this.tmdbUser
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
              .updateMessage(this.email, data.message)
              .then(() => this.ngOnInit());
          }
        }
      ]
    });

    await alert.present();
  }

  addFriend(email, username, accountID, favouriteID) {
    if (this.sessionServ.email == email) {
      this.menu.presentAlert("You can't friend YOURSELF!!!");
      return;
    }
    console.log("profile page add friend", email, username, accountID);
    if (this.friendServ.addFriend(email, username, accountID, favouriteID)) {
      this.menu.presentToast("Added friend " + this.email);
    } else {
      this.menu.presentAlert(username + " is already a friend");
    }
  }

  removeFriend(email) {
    if (this.sessionServ.email == email) {
      this.menu.presentAlert("You can't remove YOURSELF!!!");
      return;
    }

    if (this.friendServ.removeFriend(email)) {
      this.menu.presentToast("Removed friend " + this.email);
    } else {
      this.menu.presentAlert(this.tmdbUser + " is not a friend");
    }
  }

  getCurrentEmail() {
    return this.sessionServ.email;
  }

  gotoFavourites() {
    let fav = this.favouriteServ.tmdbFavId;
    console.log("p ro f", "members", "favourites", this.tmdbAccId, fav);
    this.router
      .navigate([
        "members",
        "favourites",
        this.favouriteServ.tmdbAccId,
        this.favouriteServ.tmdbUser,
        fav
      ])
      .then(res => console.log(res));
  }

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
              this.email,
              this.tmdbUser,
              this.tmdbAccId,
              this.tmdbFavId
            );
          }
        },
        {
          text: "Remove Friend",
          icon: "remove",
          handler: async () => {
            this.alert = await this.alertCtrl.create({
              message: "Do you wish to remove " + this.tmdbUser + "?",
              buttons: [
                {
                  text: "Remove",
                  handler: () => {
                    this.removeFriend(this.email);
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
  goBack() {
    this.navCtrl.pop();
  }
  async confrimRemove() {}
}
