export interface User {
  id: string
  fullName: string
  email: string
  role: "student" | "admin" | "clinic_staff"
  age?: number
  address?: string
  phone?: string
  avatar?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female"
  phone: string
  email: string
  address?: string
  attachments?: string[]
}

// Password validation: min 1 uppercase, 1 number, 1 special char
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  if (password.length < 8) errors.push("Password must be at least 8 characters")
  if (!/[A-Z]/.test(password)) errors.push("Password must contain uppercase letter")
  if (!/[0-9]/.test(password)) errors.push("Password must contain a number")
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) errors.push("Password must contain special character")
  return { valid: errors.length === 0, errors }
}

// Email validation
export const validateEmail = (email: string): boolean => {
  return email.includes("@") && email.includes(".")
}

// Phone validation - numbers only
export const validatePhone = (phone: string): boolean => {
  return /^[0-9+\s\-()]*$/.test(phone) && phone.replace(/\D/g, "").length >= 10
}
