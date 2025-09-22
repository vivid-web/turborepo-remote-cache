type TeamPermission =
	| "teams:create"
	| "teams:delete"
	| "teams:read"
	| "teams:update";

type UserPermission =
	| "users:create"
	| "users:delete"
	| "users:read"
	| "users:update";

type Permission = TeamPermission | UserPermission;

type Role = "admin" | "user";

const PERMISSIONS: Record<Role, Array<Permission>> = {
	admin: [
		"teams:create",
		"teams:delete",
		"teams:read",
		"teams:update",
		"users:create",
		"users:delete",
		"users:read",
		"users:update",
	],
	user: [],
};

export function hasPermissions(
  role: Role,
  permissions: Array<Permission>,
) {
  return permissions.every((permission) =>
    PERMISSIONS[role].includes(permission),
  )
}

export type { Permission };
