import { TmdbUser } from "./tmdbUser";
import { FbUser } from "./fbUser";
export interface User {
  username: string;
  fbUser: FbUser;
  tmdbUser: TmdbUser;
  sessionID: number;
  friends: [{ username: string; accounrID: number }];
}
