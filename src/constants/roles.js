/** Roles from blueprint Phase 1 (authentication and roles). */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OWNER: 'owner',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

/** Roles allowed into the admin area at all. */
export const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.STAFF];

/**
 * Coarse capability map. Fine-grained permissions live server side
 * (spatie/laravel-permission); this only decides what the UI renders.
 */
export const ROLE_CAPABILITIES = {
  [ROLES.SUPER_ADMIN]: ['*'],
  [ROLES.OWNER]: [
    'bookings.manage',
    'services.manage',
    'staff.manage',
    'customers.manage',
    'reports.view',
    'settings.manage',
  ],
  [ROLES.STAFF]: ['bookings.manage', 'customers.manage'],
  [ROLES.CUSTOMER]: [],
};

export function hasCapability(role, capability) {
  const caps = ROLE_CAPABILITIES[role] ?? [];
  return caps.includes('*') || caps.includes(capability);
}

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}
