import { TmdbAuthGuard } from "./guards/tmdb-auth.guard";
import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";

const routes: Routes = [
  { path: "", redirectTo: "fb-login", pathMatch: "full" },
  {
    path: "fb-login",
    loadChildren: "./public/fb-login/fb-login.module#FbLoginPageModule"
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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
