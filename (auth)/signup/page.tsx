"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { validateEmail, validatePassword } from "@/lib/auth"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userRole, setUserRole] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (!fullName.trim()) newErrors.push("Full name is required")
    if (!validateEmail(email)) newErrors.push("Email must contain @ symbol")

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      newErrors.push(...passwordValidation.errors)
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // Store user in session
    sessionStorage.setItem("user", JSON.stringify({ fullName, email, role: userRole, id: Date.now() }))
    router.push("/dashboard")
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/1764341742670.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#8B3A3A] mb-2">Clinic Management</h1>
            <p className="text-gray-500">Create your account</p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.map((error, i) => (
                <p key={i} className="text-red-600 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Min 8 chars, 1 uppercase, 1 number, 1 special char</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">User Role</label>
              <div className="relative">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#8B3A3A] rounded-lg focus:outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="clinic_staff">Clinic Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-3 text-[#8B3A3A] pointer-events-none" size={20} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8B3A3A] text-white py-3 rounded-lg font-semibold hover:bg-[#6D2E2E] transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-[#8B3A3A] hover:underline font-medium">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
