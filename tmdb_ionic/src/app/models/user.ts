import { TmdbUser } from "./tmdbUser";
import { FbUser } from "./fbUser";

/**
 * Represent the App user stored on the database.
 */
export interface User {
  fbUser: FbUser;
  tmdbUser: TmdbUser;
  sessionID: number;
  friends: [];
  favourites: [];
  message: string;
}
