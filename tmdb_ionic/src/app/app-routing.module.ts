import { TmdbAuthGuard } from "./guards/tmdb-auth.guard";
import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { redirectUnauthorizedTo, canActivate } from "@angular/fire/auth-guard";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
const redirectUnauthorizedFb = redirectUnauthorizedTo(["fb-login"]);

const routes: Routes = [
  { path: "", redirectTo: "fb-login", pathMatch: "full" },
  {
    path: "fb-login",
    loadChildren: "./public/fb-login/fb-login.module#FbLoginPageModule"
  },
  {
    path: "fb-register",
    loadChildren: "./public/fb-register/fb-register.module#FbRegisterPageModule"
  },

  {
    path: "tmdb-login",
    canActivate: [AngularFireAuthGuard],
    loadChildren: "./public/tmdb-login/tmdb-login.module#TmdbLoginPageModule"
  },
  {
    path: "members",
    canActivate: [AngularFireAuthGuard, TmdbAuthGuard],
    loadChildren: "./members/member-routing.module#MemberRoutingModule"
  },
  {
    path: "**",
    redirectTo: "fb-login"
  },
  {
    path: "reset-password",
    loadChildren:
      "./public/reset-password/reset-password.module#ResetPasswordPageModule"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
