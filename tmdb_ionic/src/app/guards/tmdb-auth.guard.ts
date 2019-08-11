import { TmdbAuthenticationService } from "./../services/tmdb-authentication.service";
import { AuthenticationService } from "./../services/authentication.service";
import { Injectable } from "@angular/core";

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TmdbAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tmdbAuthServ: TmdbAuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (this.tmdbAuthServ.tmdbIsAuthenticated()) {
      console.log("can activate tmdbll \n\n\n\n\n\n");
      return true;
    }
    console.log("cant activate tmdbn\n\n\n\n\n\n\n");
    this.router.navigate(["tmdb-login"]);
    return false;
    //return true;
  }
}
