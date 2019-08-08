import { AuthenticationService } from "./services/authentication.service";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,

    private router: Router,
    private afs: AngularFirestore
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log("init app");

    // this.platform.ready().then(() => {
    //   console.log("ready");
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    //   this.authService.authenticationState.subscribe(state => {
    //     console.log("AUTH CHANGE", state);
    //     if (state) {
    //       console.log("state true");
    //       this.router.navigate(["members", "dashboard"]);
    //     } else {
    //       console.log("state false");
    //       this.router.navigate(["fb-login"]);
    //     }
    //   });
    // });
  }
}
