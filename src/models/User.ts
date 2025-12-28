import { Profile } from "./Profile";

export class User {
  id: number;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;

  constructor(data: {
    id: number;
    email: string;
    email_verified_at: string | null;
    role: string;
    created_at: string;
    updated_at: string;
    profile?: any;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.email_verified_at = data.email_verified_at;
    this.role = data.role;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.profile = data.profile ? new Profile(data.profile) : undefined;
  }
}
