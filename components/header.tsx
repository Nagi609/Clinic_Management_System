"use client"

import { User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("patients")
    localStorage.removeItem("visits")
    localStorage.removeItem("clinicContacts")
    router.push("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 bg-[#8B3A3A] rounded-full flex items-center justify-center text-white font-bold hover:bg-[#6D2E2E]"
          >
            <User size={20} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-48">
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50 border-b">
                My Profile
              </Link>
              <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
