// typscript code

export type UserRole = "admin" | "manager" | "broker" | "assistant";
export interface User {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}
