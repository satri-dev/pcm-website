// src/types/user.ts
// Base user — used for authentication.
// Better Auth manages its own user/session collections.
// We extend with role so the session carries permission context.

export interface User {
  _id?: string;
  name: string;
  email: string;
  username: string;
  password: string;

  // Role name matching a document in the "roles" collection
  // e.g. "admin" | "viewer" | "editor" 
  role: string;

  // Reference to the role-specific profile document
  // e.g. for a viewer/editor this points to a document in the "viewers"/"editors" collection
  profileId?: string;

  createdAt: Date;
  updatedAt: Date;
}
