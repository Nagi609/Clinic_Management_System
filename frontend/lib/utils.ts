import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getCurrentUser } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Activity {
  id: number
  type: "visit" | "patient"
  message: string
  createdAt: string
}

export async function logActivity(type: "visit" | "patient", message: string) {
  if (typeof window === "undefined") return

  try {
    const user = getCurrentUser()
    if (!user?.id) return

    // Send activity to database via API
    await fetch("/api/activities", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({ type, message }),
    })
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}
