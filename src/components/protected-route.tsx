import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@/app/auth/api/hooks";

interface ProtectedRouteProps {
  requiredScopes?: string[];
}

export function ProtectedRoute({ requiredScopes = [] }: ProtectedRouteProps) {
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) return <div>Loading...</div>; // or a spinner

  if (isError || !user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const hasScopes = requiredScopes.every((scope) =>
    user.scopes.includes(scope),
  );

  if (!hasScopes) {
    return <Navigate to="/errors/forbidden" replace />;
  }

  return <Outlet />;
}
