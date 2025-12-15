"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Plus, Search, Calendar, User, FileText, X, Edit2, Trash2 } from "lucide-react"
import { getCurrentUser, checkPermission } from "@/lib/constants"
import { logActivity } from "@/lib/utils"

interface VisitRecord {
  id: string
  patientId: string
  patientName: string
  visitDate: string
  reason: string
  symptoms: string
  treatment: string
  notes?: string
}

interface Patient {
  id: string
  name: string
}

export default function VisitRecordsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newVisit, setNewVisit] = useState<Partial<VisitRecord>>({
    patientId: "",
    visitDate: new Date().toISOString().split("T")[0],
    reason: "",
    symptoms: "",
    treatment: "",
    notes: "",
  })
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) {
      fetchPatients()
      fetchVisits()
    }
  }, [user])

  const fetchPatients = async () => {
    if (!user) return
    try {
      const response = await fetch("/api/patients", {
        headers: { "x-user-id": user.id },
      })
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients || [])
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const fetchVisits = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch("/api/visits", {
        headers: { "x-user-id": user.id },
      })
      if (response.ok) {
        const data = await response.json()
        setVisits(
          data.visits?.map((v: any) => ({
            id: v.id,
            patientId: v.patientId,
            patientName: v.patient?.name || "Unknown Patient",
            visitDate: v.visitDate,
            reason: v.reason,
            symptoms: v.symptoms,
            treatment: v.treatment,
            notes: v.notes || "",
          })) || []
        )
      }
    } catch (error) {
      console.error("Error fetching visits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const canManageVisits = user && checkPermission(user.role, "canManagePatients")

  const filteredVisits = visits
    .filter(
      (v) =>
        v.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.reason.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
      if (sortBy === "patient") return a.patientName.localeCompare(b.patientName)
      if (sortBy === "reason") return a.reason.localeCompare(b.reason)
      return 0
    })

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManageVisits || isSubmitting) return

    setIsSubmitting(true)

    const errors: string[] = []
    if (!newVisit.patientId?.trim()) errors.push("Patient selection is required")
    if (!newVisit.visitDate) errors.push("Visit date is required")
    if (!newVisit.reason?.trim()) errors.push("Reason for visit is required")
    if (!newVisit.symptoms?.trim()) errors.push("Symptoms description is required")
    if (!newVisit.treatment?.trim()) errors.push("Treatment information is required")

    // Validate date format
    if (newVisit.visitDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(newVisit.visitDate)) {
        errors.push("Invalid date format")
      }
    }

    if (errors.length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      if (editingId) {
        const response = await fetch("/api/visits", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-user-id": user.id },
          body: JSON.stringify({ id: editingId, ...newVisit }),
        })
        if (response.ok) {
          logActivity("visit", `Updated visit record`)
          await fetchVisits()
          setEditingId(null)
        } else {
          const errorData = await response.json()
          setFormErrors([errorData.error || "Failed to update visit"])
        }
      } else {
        const selectedPatient = patients.find((p) => p.id === newVisit.patientId)
        const response = await fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-id": user.id },
          body: JSON.stringify(newVisit),
        })
        if (response.ok) {
          logActivity("visit", `Added new visit for ${selectedPatient?.name}`)
          await fetchVisits()
        } else {
          const errorData = await response.json()
          setFormErrors([errorData.error || "Failed to save visit"])
        }
      }

      setNewVisit({
        patientId: "",
        visitDate: new Date().toISOString().split("T")[0],
        reason: "",
        symptoms: "",
        treatment: "",
        notes: "",
      })
      setShowAddForm(false)
      setFormErrors([])
    } catch (error) {
      console.error("Error saving visit:", error)
      setFormErrors(["Failed to save visit. Please try again."])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditVisit = (visit: VisitRecord) => {
    if (!canManageVisits) return
    setEditingId(visit.id)
    setNewVisit({ ...visit })
    setShowAddForm(true)
  }

  const handleDeleteVisit = async (id: string) => {
    if (!confirm("Are you sure you want to delete this visit record?")) return
    try {
      const response = await fetch("/api/visits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ id }),
      })
      if (response.ok) await fetchVisits()
    } catch (error) {
      console.error("Error deleting visit:", error)
    }
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#8B3A3A]">Visit Records</h1>
            <p className="text-gray-600">Log and manage clinic visits</p>
          </div>
          {canManageVisits && (
            <button
              onClick={() => {
                setShowAddForm(true)
                setEditingId(null)
                setNewVisit({
                  patientId: "",
                  visitDate: new Date().toISOString().split("T")[0],
                  reason: "",
                  symptoms: "",
                  treatment: "",
                  notes: "",
                })
              }}
              className="bg-[#8B3A3A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6D2E2E] transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> New Visit
            </button>
          )}
        </div>

        {/* Add Visit Form */}
        {showAddForm && canManageVisits && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#8B3A3A]">
                {editingId ? "Edit Visit Record" : "New Visit Record"}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormErrors([])
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <ul className="list-disc list-inside text-red-600">
                  {formErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleAddVisit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient *
                  </label>
                  <select
                    value={newVisit.patientId || ""}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, patientId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    value={newVisit.visitDate || ""}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, visitDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  value={newVisit.reason || ""}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, reason: e.target.value })
                  }
                  placeholder="e.g., Check-up, Follow-up, Emergency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms *
                </label>
                <textarea
                  value={newVisit.symptoms || ""}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, symptoms: e.target.value })
                  }
                  placeholder="Describe the patient's symptoms..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment *
                </label>
                <textarea
                  value={newVisit.treatment || ""}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, treatment: e.target.value })
                  }
                  placeholder="Describe the treatment provided..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newVisit.notes || ""}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, notes: e.target.value })
                  }
                  placeholder="Any additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingId(null)
                    setFormErrors([])
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#8B3A3A] text-white rounded-lg font-semibold hover:bg-[#6D2E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Visit" : "Save Visit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Sort */}
        <div className="bg-[#8B3A3A] rounded-xl p-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-white opacity-60" size={20} />
            <input
              type="text"
              placeholder="Search by patient name or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white/20 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white text-[#8B3A3A] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white font-medium cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="patient">Sort by Patient</option>
            <option value="reason">Sort by Reason</option>
          </select>
        </div>

        {/* Visit Records List */}
        <div className="space-y-4">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
              <div key={visit.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-[#8B3A3A] text-white p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User size={18} />
                        <p className="text-sm font-semibold opacity-90">Patient</p>
                      </div>
                      <p className="text-xl font-bold">{visit.patientName}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} />
                        <p className="text-sm font-semibold opacity-90">Visit Date</p>
                      </div>
                      <p className="text-xl font-bold">{new Date(visit.visitDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold opacity-90 mb-1">Reason</p>
                    <p className="text-lg">{visit.reason}</p>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2">Symptoms</p>
                      <p className="text-gray-700">{visit.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2">Treatment</p>
                      <p className="text-gray-700">{visit.treatment}</p>
                    </div>
                  </div>
                  {visit.notes && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Notes</p>
                      <p className="text-gray-700">{visit.notes}</p>
                    </div>
                  )}
                  {canManageVisits && (
                    <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEditVisit(visit)}
                        className="bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteVisit(visit.id)}
                        className="bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No visit records found</p>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
