import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";

const TOKEN_KEY = "auth-token";
@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  fbLogin() {
    return this.storage.set(TOKEN_KEY, "bearer 123").then(res => {
      this.authenticationState.next(true);
    });
  }

  fbLogut() {
    return this.storage.remove(TOKEN_KEY).then(res => {
      this.authenticationState.next(false);
    });
  }
  fbIsAuthenticated() {
    return this.authenticationState.value;
  }

  checkToken() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }
}
