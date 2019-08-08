// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  fbAPI: {
    apiKey: "AIzaSyCH5M7qED0v8T2xzgkVAZIGb-PFjTiqSHM",
    authDomain: "swen325a1login.firebaseapp.com",
    databaseURL: "https://swen325a1login.firebaseio.com",
    projectId: "swen325a1login",
    storageBucket: "swen325a1login.appspot.com",
    messagingSenderId: "850520098087",
    appId: "1:850520098087:web:eb23db3b0fc4cea2"
  }
};
export const tmdb = {
  tmdbAPI: {
    apiKey: "79ad210fe32318cf14cfeb7de2cb26fa",
    url: "https://api.themoviedb.org/3/"
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
