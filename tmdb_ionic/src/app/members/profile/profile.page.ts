import { AuthenticationService } from "./../../services/authentication.service";
import { FriendsService } from "./../../services/friends.service";
import { Component, OnInit } from "@angular/core";
import { UserDatabaseService } from "./../../services/user-database.service";
import { AlertController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
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
    private authServ: AuthenticationService
  ) {}

  dbUserInfo;
  userName;
  email;
  tmdbUser;
  tmdbAccId;
  friends;

  profile;
  ngOnInit() {
    let email = this.activatedRoute.snapshot.paramMap.get("email");

    this.friendsServ.getProfile(email).subscribe(result => {
      this.profile = result;
      console.log("new deatil", result);
    });

    this.dbUserInfo = this.friendsServ.getProfile(email).subscribe(res => {
      this.userName = res["username"];
      this.email = res["fbUser"]["email"];
      this.tmdbUser = res["tmdbUser"]["username"];
      this.tmdbAccId = res["tmdbUser"]["accountID"];
      console.log("email", this.email);
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

  editName() {
    console.log("edit pressed");
    {
      this.showEditForm();
    }
    //
  }
  async showEditForm() {
    const alert = await this.alert.create({
      header: "Prompt!",
      inputs: [
        {
          name: "name",
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
          handler: newName => {
            console.log("nw", newName.name);
            this.userDbService.updateUsername(this.email, newName.name);
            console.log("Confirm Ok");
          }
        }
      ]
    });

    await alert.present();
  }

  getCurrentEmail() {
    return this.authServ.getEmail();
  }
}
