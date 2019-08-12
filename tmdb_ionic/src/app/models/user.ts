import { TmdbUser } from "./tmdbUser";
import { FbUser } from "./fbUser";
export interface User {
  fbUser: FbUser;
  tmdbUser: TmdbUser;
  sessionID: number;
  friends: [];
  favourites: [];
  message: string;
}
