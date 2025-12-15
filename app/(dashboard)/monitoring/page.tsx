"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { RotateCcw, Heart, Activity } from "lucide-react"
import { useState } from "react"

export default function MonitoringPage() {
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null)

  const monitoringStats = [
    { label: "Active Monitors", value: "3", icon: Activity, color: "text-blue-600" },
    { label: "Critical Alerts", value: "1", color: "text-red-600", alertColor: true },
    { label: "Stable Patients", value: "2", color: "text-green-600" },
    { label: "Avg Response", value: "2.3m", color: "text-purple-600" },
  ]

  const patients = [
    {
      id: 1,
      name: "Justin Gojar",
      age: 20,
      status: "Critical",
      lastUpdate: "10:48:13 PM",
      heartRate: 95,
      bloodPressure: "120/87",
    },
    {
      id: 2,
      name: "Jecel Garbin",
      age: 21,
      status: "Stable",
      lastUpdate: "10:45:00 PM",
      heartRate: 72,
      bloodPressure: "118/76",
    },
  ]

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#8B3A3A]">Monitoring</h1>
          <button className="bg-[#8B3A3A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6D2E2E] transition-colors flex items-center gap-2">
            <RotateCcw size={18} />
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {monitoringStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-gray-600 text-sm mb-3">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                {stat.alertColor && (
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚠</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Patient Monitoring Cards - Expandable */}
        <div className="space-y-4">
          {patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() =>
                setExpandedPatient(expandedPatient === patient.id.toString() ? null : patient.id.toString())
              }
              className="w-full text-left"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-[#8B3A3A] text-white p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center font-bold text-lg">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{patient.name}</h3>
                      <p className="text-sm opacity-90">
                        Age {patient.age} • Last update: {patient.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      patient.status === "Critical" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>

                {expandedPatient === patient.id.toString() && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 max-h-96 overflow-y-auto">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="text-red-500" size={24} />
                        <span className="text-gray-600 font-medium">Heart Rate</span>
                      </div>
                      <p className="text-4xl font-bold text-[#8B3A3A]">
                        {patient.heartRate} <span className="text-lg text-gray-600">BPM</span>
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="text-purple-600" size={24} />
                        <span className="text-gray-600 font-medium">Blood Pressure</span>
                      </div>
                      <p className="text-4xl font-bold text-[#8B3A3A]">{patient.bloodPressure}</p>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </LayoutWrapper>
  )
}
