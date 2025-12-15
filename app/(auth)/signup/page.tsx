"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Link from "next/link"
import { Eye, EyeOff, ChevronDown, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { validateEmail, validatePassword } from "@/lib/auth"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userRole, setUserRole] = useState("admin")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check username availability with debounce
  const checkUsernameAvailability = useCallback(async (user: string) => {
    if (!user || user.length < 3) {
      setUsernameAvailable(null)
      setUsernameError("")
      return
    }

    setUsernameChecking(true)
    try {
      const response = await fetch("/api/auth/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user }),
      })
      const data = await response.json()
      if (data.available) {
        setUsernameAvailable(true)
        setUsernameError("")
      } else {
        setUsernameAvailable(false)
        setUsernameError("Username is already taken")
      }
    } catch (error) {
      console.error("Error checking username:", error)
      setUsernameError("Error checking username availability")
    } finally {
      setUsernameChecking(false)
    }
  }, [])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)

    if (value && value.length < 3) {
      setUsernameError("Username must be at least 3 characters")
      setUsernameAvailable(null)
    } else if (value && !/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError("Username can only contain letters, numbers, underscore, and dash")
      setUsernameAvailable(null)
    } else {
      setUsernameError("")
      const timer = setTimeout(() => {
        checkUsernameAvailability(value)
      }, 500)
      return () => clearTimeout(timer)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)

    const newErrors: string[] = []

    if (!username.trim()) newErrors.push("Username is required")
    else if (username.length < 3) newErrors.push("Username must be at least 3 characters")
    else if (!/^[a-zA-Z0-9_-]+$/.test(username))
      newErrors.push("Username can only contain letters, numbers, underscore, and dash")
    else if (!usernameAvailable) newErrors.push("Username is not available")

    if (!fullName.trim()) newErrors.push("Full name is required")
    if (!email.trim()) newErrors.push("Email is required")
    else if (!validateEmail(email)) newErrors.push("Email must contain @ symbol")
    if (!password) newErrors.push("Password is required")
    else {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) newErrors.push(...passwordValidation.errors)
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, email, password, role: userRole }),
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors([data.error || "Signup failed"])
        setIsLoading(false)
        return
      }
      router.push("/login")
    } catch (error) {
      console.error("Signup error:", error)
      setErrors(["An error occurred. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#8B3A3A] mb-2">Clinic Management</h1>
            <p className="text-gray-500">Create your account</p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-red-700 text-sm">• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Choose a unique username"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 pr-10 ${
                    usernameError
                      ? "border-red-300 focus:ring-red-500"
                      : usernameAvailable
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-[#8B3A3A]"
                  }`}
                />
                {usernameChecking && (
                  <div className="absolute right-4 top-3">
                    <div className="animate-spin h-5 w-5 border-2 border-[#8B3A3A] border-t-transparent rounded-full"></div>
                  </div>
                )}
                {!usernameChecking && usernameAvailable && <Check className="absolute right-4 top-3 text-green-500" size={20} />}
                {!usernameChecking && usernameError && <X className="absolute right-4 top-3 text-red-500" size={20} />}
              </div>
              {usernameError && <p className="text-red-600 text-xs mt-1">{usernameError}</p>}
              {usernameAvailable && <p className="text-green-600 text-xs mt-1">✓ Username is available</p>}
              <p className="text-gray-500 text-xs mt-1">3+ characters, letters, numbers, underscore, dash only</p>
            </div>

            {/* Full Name Input */}
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

            {/* Email Input */}
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

            {/* Password Input */}
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-gray-400">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* User Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">User Role</label>
              <div className="relative">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#8B3A3A] rounded-lg focus:outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <ChevronDown className="absolute right-4 top-3 text-[#8B3A3A] pointer-events-none" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !usernameAvailable}
              className="w-full bg-[#8B3A3A] text-white py-3 rounded-lg font-semibold hover:bg-[#6D2E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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
