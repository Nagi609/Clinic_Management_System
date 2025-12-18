"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Users, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/constants"

interface Activity {
  id: number
  type: "visit" | "patient" | "action"
  message: string
  createdAt: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  address?: string
}

interface VisitRecord {
  id: string
  patientId: string
  patient?: { name: string }
  visitDate: string
  reason: string
  symptoms: string
  treatment: string
  notes?: string
}

export default function DashboardPage() {
  const [totalPatients, setTotalPatients] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [teachingStaffCount, setTeachingStaffCount] = useState(0)
  const [nonTeachingStaffCount, setNonTeachingStaffCount] = useState(0)
  const [totalVisits, setTotalVisits] = useState(0)
  const [visitsToday, setVisitsToday] = useState(0)
  const [visitsThisWeek, setVisitsThisWeek] = useState(0)
  const [visitsThisMonth, setVisitsThisMonth] = useState(0)
  const [activities, setActivities] = useState<Activity[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) {
      fetchData()
      // Refresh data every 5 seconds
      const interval = setInterval(fetchData, 5000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchData = async () => {
    if (!user?.id) return

    try {
      // Fetch patients
      const patientsResponse = await fetch("/api/patients", {
        headers: {
          "x-user-id": user.id,
        },
      })
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json()
        const patientList = patientsData.patients || []
        setTotalPatients(patientList.length)
        
        // Count by role
        const students = patientList.filter((p: any) => p.role === "student").length
        const teachingStaff = patientList.filter((p: any) => p.role === "teaching_staff").length
        const nonTeachingStaff = patientList.filter((p: any) => p.role === "non_teaching_staff").length
        
        setStudentCount(students)
        setTeachingStaffCount(teachingStaff)
        setNonTeachingStaffCount(nonTeachingStaff)
      }

      // Fetch visits
      const visitsResponse = await fetch("/api/visits", {
        headers: {
          "x-user-id": user.id,
        },
      })
      if (visitsResponse.ok) {
        const visitsData = await visitsResponse.json()
        const today = new Date()
        const todayStr = today.toISOString().split("T")[0]
        
        // Calculate date ranges
        const weekAgo = new Date(today)
        weekAgo.setDate(today.getDate() - 7)
        const weekAgoStr = weekAgo.toISOString().split("T")[0]
        
        const monthAgo = new Date(today)
        monthAgo.setMonth(today.getMonth() - 1)
        const monthAgoStr = monthAgo.toISOString().split("T")[0]
        
        const allVisits = visitsData.visits || []
        
        // Set total visits
        setTotalVisits(allVisits.length)
        
        // Count today's visits
        const todayVisits = allVisits.filter(
          (v: VisitRecord) => new Date(v.visitDate).toISOString().split("T")[0] === todayStr
        )
        setVisitsToday(todayVisits.length)

        // Count this week's visits
        const weekVisits = allVisits.filter(
          (v: VisitRecord) => {
            const visitDate = new Date(v.visitDate).toISOString().split("T")[0]
            return visitDate >= weekAgoStr && visitDate <= todayStr
          }
        )
        setVisitsThisWeek(weekVisits.length)

        // Count this month's visits
        const monthVisits = allVisits.filter(
          (v: VisitRecord) => {
            const visitDate = new Date(v.visitDate).toISOString().split("T")[0]
            return visitDate >= monthAgoStr && visitDate <= todayStr
          }
        )
        setVisitsThisMonth(monthVisits.length)
      }

      // Fetch activities from database
      const activitiesResponse = await fetch("/api/activities", {
        headers: {
          "x-user-id": user.id,
        },
      })
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setActivities(activitiesData.activities || [])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#8B3A3A] text-white rounded-2xl p-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to SorSU Medical Clinic</h1>
          <p className="text-lg opacity-90">Bulan Campus - Patient Monitoring & Management System</p>
        </div>

        {/* Statistics Cards - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Students</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{studentCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Teaching Staff</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{teachingStaffCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Non-Teaching Staff</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{nonTeachingStaffCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Visits</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{totalVisits}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Visits Today</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{visitsToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Visits This Week</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{visitsThisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Visits This Month</p>
                <p className="text-3xl font-bold text-[#8B3A3A] mt-2">{visitsThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg p-4 border border-gray-200 flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === "visit" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  {activity.type === "visit" && <FileText size={20} className="text-blue-600" />}
                  {activity.type === "patient" && <Users size={20} className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
