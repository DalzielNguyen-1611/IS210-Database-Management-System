import { Navigate } from "react-router";
import { useAuth, roleConfig } from "../context/AuthContext";
import { Dashboard } from "./Dashboard";

/**
 * RoleHome — renders the correct default page based on the logged-in user's role.
 *   Admin     → Dashboard (/)
 *   Manager   → Dashboard (/)
 *   Sales     → POS (/pos) via redirect
 *   Warehouse → Inventory (/inventory) via redirect
 */
export function RoleHome() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const config = roleConfig[user.role];

  // Sales and Warehouse staff have a different default path — redirect there
  if (config.defaultPath !== "/") {
    return <Navigate to={config.defaultPath} replace />;
  }

  // Admin and Manager land on the Dashboard
  return <Dashboard />;
}
