"use client"

import type React from "react"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { getCurrentUser } from "@/lib/constants"

interface ProfileData {
  id?: string
  fullName: string
  email: string
  role: string
  phone: string
  address: string
  avatar?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    email: "",
    role: "",
    phone: "",
    address: "",
  })
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch("/api/users/profile", {
        headers: { "x-user-id": user.id },
      })
      if (response.ok) {
        const data = await response.json()
        setProfile({
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          role: data.user.role,
          phone: data.user.phone || "",
          address: data.user.address || "",
          avatar: data.user.avatar || undefined,
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfile({ ...profile, avatar: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          avatar: profile.avatar,
        }),
      })
      if (response.ok) {
        setEditing(false)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  return (
    <LayoutWrapper>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">My Profile</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b">
              <div className="relative">
                <div className="w-24 h-24 bg-[#8B3A3A] rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile.fullName.charAt(0)
                  )}
                </div>
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-[#8B3A3A] text-white p-2 rounded-full cursor-pointer hover:bg-[#6D2E2E]">
                    <Camera size={18} />
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
                <p className="text-gray-600 capitalize">{profile.role}</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-[#8B3A3A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6D2E2E]"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#8B3A3A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6D2E2E]"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
