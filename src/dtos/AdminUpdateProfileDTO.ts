export interface AdminUpdateProfileDTO {
  // Profile fields
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string | null;
  birth_date?: string;
  points?: number;

  // User fields
  email?: string;
  password?: string;
  role?: "user" | "admin";
}
