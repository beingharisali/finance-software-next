"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  register as registerApi,
  login as loginApi,
  getProfile,
  logoutApi,
} from "../services/auth.api";
import type { User, UserRole } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  registerUser: (
    fullname: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getRedirectPath = (role?: string) => {
    // switch (role) {
    //   case "admin":
    //     return "/admin/dashboard";
    //   case "manager":
    //     return "/manager/dashboard";
    //   case "agent":
    //     return "/agent/dashboard";
    //   default:
    //     return "/";
    // }
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "manager":
        return "/dashboard/manager";
      case "agent":
        return "/dashboard/agent";
      default:
        return "/";
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const res = await getProfile();
      if (res?.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        await refreshProfile();
      }
      setLoading(false);
    })();
  }, []);

  const registerUser = async (
    fullname: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const res = await registerApi(fullname, email, password, role as string);

    if (res.token) {
      localStorage.setItem("token", res.token);
    }

    setUser(res.user);

    router.replace(getRedirectPath(res.user.role));
  };
  const loginUser = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    if (!res || !res.user) {
      alert("Invalid credentials!");
      return;
    }

    //   // //sir ye mein ne additional role add kiya ha. Check if the selected role matches the user's real role
    //   if (res.user.role !== role) {
    //     alert(`This is not your role! Please select your correct role (${res.user.role}).`);
    //     return; // Stop here (don’t login or redirect)
    //   }
    // // //
    if (res.token) {
      localStorage.setItem("token", res.token);
    }

    setUser(res.user);

    router.replace(getRedirectPath(res.user.role));
  };

  const logoutUser = async () => {
    await logoutApi();
    setUser(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
