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
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!usernameOrEmail || !password) {
      setError("Username/Email and password are required")
      setIsLoading(false)
      return
    }

    if (password.length < 1) {
      setError("Please enter your password")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      })

      let data
      const contentType = response.headers.get("content-type")

      try {
        data = await response.json()
      } catch (jsonError) {
        console.error(`Failed to parse response as JSON. Status: ${response.status}, Content-Type: ${contentType}, Error: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`)
        const responseText = await response.text()
        console.error("Response text:", responseText)
        setError("Server error: Invalid response format. Check console for details.")
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        setError(data.error || "Login failed")
        setIsLoading(false)
        return
      }

      // Store user data and redirect to dashboard
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#8B3A3A] mb-2">Clinic Management</h1>
            <p className="text-gray-500">Welcome back</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
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

            <div className="text-right">
              <Link href="#" className="text-sm text-[#8B3A3A] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B3A3A] text-white py-3 rounded-lg font-semibold hover:bg-[#6D2E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
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
