import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { RestrictedPage } from "./RestrictedPage";

interface RouteGuardProps {
  path: string;
  moduleName?: string;
  children: ReactNode;
}

export function RouteGuard({ path, moduleName, children }: RouteGuardProps) {
  const { canAccess } = useAuth();

  if (!canAccess(path)) {
    return <RestrictedPage moduleName={moduleName} />;
  }

  return <>{children}</>;
}
