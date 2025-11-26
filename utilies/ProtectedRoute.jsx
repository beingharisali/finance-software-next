"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

/**
 * props:
 * - children: page/component
 * - allowedRoles: array of roles that can access this page
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // wait for user to load
    if (!allowedRoles.includes(user.role)) {
      router.push("/no-access"); // redirect if not allowed
    }
  }, [user, router, allowedRoles]);

  // prevent rendering while checking
  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthContext } from "@/context/AuthContext";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles?: string[];
//   redirectPath?: string; // optional, default "/no-access"
// }

// export default function ProtectedRoute({
//   children,
//   allowedRoles = [],
//   redirectPath = "/no-access",
// }: ProtectedRouteProps) {
//   const { user, loading } = useAuthContext();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && user && !allowedRoles.includes(user.role)) {
//       router.push(redirectPath);
//     }
//   }, [user, loading, allowedRoles, router, redirectPath]);

//   if (loading) {
//     // show loading state while fetching user
//     return <p>Loading...</p>;
//   }

//   if (!user) {
//     // optional: redirect or blank
//     return null;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     // unauthorized: prevent rendering
//     return null;
//   }

//   return <>{children}</>;
// }
