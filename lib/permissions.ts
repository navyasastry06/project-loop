export type UserRole = "ADMIN" | "ANALYST" | "VIEWER";

export function canManageUsers(role: UserRole) {
  return role === "ADMIN";
}

export function canManageFeedback(role: UserRole) {
  return role === "ADMIN" || role === "ANALYST";
}

export function canAnalyzeFeedback(role: UserRole) {
  return role === "ADMIN" || role === "ANALYST";
}

export function canManageReports(role: UserRole) {
  return role === "ADMIN" || role === "ANALYST";
}

export function canManageThemes(role: UserRole) {
  return role === "ADMIN" || role === "ANALYST";
}

export function canViewDashboard(role: UserRole) {
  return true;
}

export function canExportReports(role: UserRole) {
  return true;
}