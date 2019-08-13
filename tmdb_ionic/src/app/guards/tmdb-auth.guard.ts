import { TmdbAuthenticationService } from "./../services/tmdb-authentication.service";
import { AuthenticationService } from "./../services/authentication.service";
import { Injectable } from "@angular/core";

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
/**
 * Guard for tmdb authentication.
 */
export class TmdbAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tmdbAuthServ: TmdbAuthenticationService
  ) {}

  /**
   * Returns user to tmdb login page is authentication is lost.
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (this.tmdbAuthServ.tmdbIsAuthenticated()) {
      return true;
    }
    this.router.navigate(["tmdb-login"]);
    return false;
    //return true;
  }
}
