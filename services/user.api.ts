
// }
import http from "./http";
import type { User } from "../types/user";

// Fetch users
export async function fetchUsers(role?: string): Promise<User[]> {
  const params: { role?: string } = {};
  if (role && role !== "all") params.role = role;

  const res = await http.get("/users", { params });
  return res.data.users;
}

// Create user
export async function createUser(data: {
  fullname: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> {
  const res = await http.post("/users", data);
  return res.data.user;
}

// Update user
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await http.put(`/users/${id}`, data);
  return res.data.user;
}

// Update user role only (fixed to use existing /users/:id route)
export async function updateUserRole(id: string, role: string): Promise<User> {
  const res = await http.put(`/users/${id}`, { role }); 
  return res.data.user;
}

// Delete user
export async function deleteUser(id: string): Promise<void> {
  await http.delete(`/users/${id}`);
}
