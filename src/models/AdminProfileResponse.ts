import { Profile } from "./Profile";
import { User } from "./User";

export class AdminProfileResponse {
  profile: Profile;
  user: User;

  constructor(data: { profile: any; user: any }) {
    this.profile = new Profile(data.profile);
    this.user = new User(data.user);
  }
}
