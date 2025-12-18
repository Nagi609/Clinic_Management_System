"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (!usernameOrEmail) newErrors.push("Username or Email is required")
    if (!password) newErrors.push("Password is required")

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors([data.error || 'Login failed'])
        return
      }

      // Success
      sessionStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (error) {
      console.error('Login error:', error)
      setErrors(['An unexpected error occurred. Please try again.'])
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <img src="/cliniclogo.png" alt="Clinic Logo" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#8B3A3A] mb-2">Clinic Management</h1>
            <p className="text-gray-500">Welcome back</p>
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Username or Email</label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter your username or email"
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
            </div>

            <button
              type="submit"
              className="w-full bg-[#8B3A3A] text-white py-3 rounded-lg font-semibold hover:bg-[#6D2E2E] transition-colors"
            >
              Login
            </button>
          </form>

          <div className="text-center">
            <Link href="/signup" className="text-[#8B3A3A] hover:underline font-medium">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
