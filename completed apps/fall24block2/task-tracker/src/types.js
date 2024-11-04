// types.js
export const ROLES = {
    ADMIN: 'admin',    // Full access to all features
    USER: 'user',      // Standard user access
    VIEWER: 'viewer'   // Read-only access
  };

  export const VISIBILITY_LEVELS = {
    PRIVATE: 'private',   // Only creator can see
    FAMILY: 'family'      // All users can see
  };
  
  export const PERMISSIONS = {
    [ROLES.ADMIN]: ['create', 'read', 'update', 'delete', 'manage_users', 'create_family_tasks'],
    [ROLES.USER]: ['create', 'read', 'update', 'delete'],
    [ROLES.VIEWER]: ['read']
  };