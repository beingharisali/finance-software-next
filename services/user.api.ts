import http from "./http";
import type { User } from "../types/user";

export async function fetchUsers(role?: string): Promise<User[]> {
  const res = await http.get("/users", { params: { role } });
  return res.data.users;
}
