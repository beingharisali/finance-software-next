
// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   register as registerApi,
//   login as loginApi,
//   getProfile,
//   logoutApi,
// } from "../services/auth.api";
// import type { User } from "../types/user";

// export type UserRole = "admin" | "manager" | "broker" | "assistant";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   registerUser: (
//     fullname: string,
//     email: string,
//     password: string,
//     role: UserRole,
//     isSelfRegister?: boolean
//   ) => Promise<void>;
//   loginUser: (email: string, password: string) => Promise<void>;
//   logoutUser: () => Promise<void>;
//   refreshProfile: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function useAuthContext() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
//   return ctx;
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const getRedirectPath = (role?: UserRole) => {
//     switch (role) {
//       case "admin":
//         return "/dashboard/admin";
//       case "manager":
//         return "/dashboard/managers";
//       case "broker":
//         return "/dashboard/broker"; // agent dashboard for broker (old agent)
//       case "assistant":
//         return "/dashboard/assistant"; // assistant dashboard for broker
//       default:
//         return "/";
//     }
//   };

//   const refreshProfile = async (): Promise<void> => {
//     try {
//       const res = await getProfile();
//       if (res?.user) {
//         setUser(res.user);
//       } else {
//         setUser(null);
//       }
//     } catch {
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (token) await refreshProfile();
//       setLoading(false);
//     })();
//   }, []);

//   const registerUser = async (
//     fullname: string,
//     email: string,
//     password: string,
//     role: UserRole,
//     isSelfRegister = true
//   ) => {
//     const res = await registerApi(fullname, email, password, role as string);
//     if (isSelfRegister) {
//       setUser(res.user);
//       if (res.token) {
//         localStorage.setItem("token", res.token);
//         router.replace(getRedirectPath(res.user.role as UserRole));
//       }
//     }
//   };

//   const loginUser = async (email: string, password: string) => {
//     const res = await loginApi(email, password);
//     if (!res || !res.user) {
//       alert("Invalid credentials!");
//       return;
//     }
//     if (res.token) {
//       localStorage.setItem("token", res.token);
//       setUser(res.user);
//       router.replace(getRedirectPath(res.user.role as UserRole));
//     }
//   };

//   const logoutUser = async () => {
//     await logoutApi();
//     setUser(null);
//     localStorage.removeItem("token");
//     router.replace("/");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, registerUser, loginUser, logoutUser, refreshProfile }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register as registerApi, login as loginApi, getProfile, logoutApi } from "../services/auth.api";
import type { User } from "../types/user";

export type UserRole = "admin" | "manager" | "broker" | "assistant";

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

  const getRedirectPath = (role?: UserRole) => {
    switch (role) {
      case "admin": return "/dashboard/admin";
      case "manager": return "/dashboard/managers";
      case "broker": return "/dashboard/broker";
      case "assistant": return "/dashboard/assistant";
      default: return "/";
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const res = await getProfile();
      if (res?.user) setUser(res.user);
      else setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) await refreshProfile();
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
      setUser(res.user);
      router.replace(getRedirectPath(res.user.role as UserRole));
    }
  };

  const loginUser = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    if (!res || !res.user) return alert("Invalid credentials!");
    if (res.token) {
      localStorage.setItem("token", res.token);
      setUser(res.user);
      router.replace(getRedirectPath(res.user.role as UserRole));
    }
  };

  const logoutUser = async () => {
    await logoutApi();
    setUser(null);
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logoutUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
