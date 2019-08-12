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

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  constructor(
    private userDbService: UserDatabaseService,
    private alert: AlertController,
    private activatedRoute: ActivatedRoute,
    private friendsServ: FriendsService,
    private authServ: AuthenticationService,
    public friendServ: FriendsService,
    private router: Router,
    private favouriteServ: FavouritesService,
    public menu: MenusService,
    private asCtrl: ActionSheetController,
    private navCtrl: NavController
  ) {}

  dbUserInfo;
  userName;
  email;
  tmdbUser;
  tmdbAccId;
  tmdbFavId;
  friends;

  message;

  profile;
  async ngOnInit() {
    let email = await this.activatedRoute.snapshot.paramMap.get("email");
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
        this.userName = res["username"];
        this.email = res["fbUser"]["email"];
        this.tmdbUser = res["tmdbUser"]["username"];
        this.tmdbAccId = res["tmdbUser"]["accountID"];
        this.tmdbFavId = res["favourites"];
        this.message = res["message"];
        console.log(
          "email",
          this.email,
          this.userName,
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
  getDbUser() {
    return this.userDbService.getDbUser();
  }

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
          placeholder: this.userName
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
    console.log("profile page add friend", email, username, accountID);
    this.friendServ.addFriend(email, username, accountID, favouriteID);
  }

  removeFriend(email) {
    this.friendServ.removeFriend(email);
  }

  getCurrentEmail() {
    return this.authServ.getEmail();
  }

  haveFriend() {
    return this.friendServ.haveFriend(this.email);
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
              this.userName,
              this.tmdbAccId,
              this.tmdbFavId
            );
            this.menu.presentToast("Added friend " + this.email);
          }
        },
        {
          text: "Remove Friend",
          icon: "remove",
          handler: () => {
            this.removeFriend(this.email);
            this.menu.presentToast("Removed friend " + this.email);
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
}
