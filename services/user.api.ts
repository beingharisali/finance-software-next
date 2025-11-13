
import http from "./http";
import type { User } from "../types/user";

export async function fetchUsers(role?: string, createdBy?: string): Promise<User[]> {
  const params: { role?: string; createdBy?: string } = {};
  if (role) params.role = role;
  if (createdBy) params.createdBy = createdBy;

  const res = await http.get("/users", { params });
  return res.data.users;
}
