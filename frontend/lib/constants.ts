export const ROLE_PERMISSIONS = {
  student: {
    canManagePatients: false,
    canEditPatients: false,
    canViewMonitoring: true,
    canEditProfile: true,
  },
  clinic_staff: {
    canManagePatients: true,
    canEditPatients: true,
    canViewMonitoring: true,
    canEditProfile: true,
  },
  admin: {
    canManagePatients: true,
    canEditPatients: true,
    canViewMonitoring: true,
    canEditProfile: true,
  },
}

/**
 * Get the currently logged-in user from localStorage
 * Returns null if no user is logged in
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error)
    return null
  }
}

/**
 * Save user to localStorage securely
 */
export const setCurrentUser = (user: { id: string; role: string }) => {
  if (typeof window === "undefined") return
  localStorage.setItem("user", JSON.stringify(user))
}

/**
 * Remove user from localStorage (logout)
 */
export const removeCurrentUser = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("user")
}

/**
 * Check if the user's role has a specific permission
 */
export const checkPermission = (
  role: string,
  permission: keyof typeof ROLE_PERMISSIONS.student
): boolean => {
  if (!role) return false
  const key = role.toLowerCase() as keyof typeof ROLE_PERMISSIONS
  return ROLE_PERMISSIONS[key]?.[permission] ?? false
}
