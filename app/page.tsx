"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Clear all localStorage data on page load to start fresh
    localStorage.clear()
    
    router.push("/login")
  }, [router])

  return null
}
