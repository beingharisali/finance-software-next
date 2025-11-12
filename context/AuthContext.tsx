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
    role: UserRole,
isSelfRegister?: boolean
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
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "manager":
        return "/dashboard/manager";
      case "agent":
        return "/dashboard/agent";
      case "broker":
        return "/dashboard/brokers";
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
    role: UserRole,
isSelfRegister = true
  ) => {
    const res = await registerApi(fullname, email, password, role as string);

    if (isSelfRegister && res.token) {
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

    if (res.token) {
      localStorage.setItem("token", res.token);
      setUser(res.user);
  
      router.replace(getRedirectPath(res.user.role));
    };
    }


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
