
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import type { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // wait for user to load

    if (!allowedRoles.includes(user.role)) {
      router.push("/no-access");
    }
  }, [user, router, allowedRoles]);

  if (!user || !allowedRoles.includes(user.role)) return <p>Loading...</p>;

  return <>{children}</>;
}
