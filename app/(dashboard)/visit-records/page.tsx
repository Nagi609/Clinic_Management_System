"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Plus, Search, Calendar, User, FileText, X, Edit2, Trash2 } from "lucide-react"
import { getCurrentUser, checkPermission } from "@/lib/constants"
import { logActivity, formatDateTime } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

interface Patient {
  id: number
  name: string
}

interface VisitRecord {
  id: number
  patientId?: number
  patientName: string
  visitDate: string
  reason: string
  symptoms: string
  treatment: string
  notes?: string
}

export default function VisitRecordsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientSuggestions, setPatientSuggestions] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newVisit, setNewVisit] = useState<Partial<VisitRecord>>({
    patientName: "",
    reason: "",
    symptoms: "",
    treatment: "",
    notes: "",
  })
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const suggestionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) {
      fetchVisits()
    }
  }, [user])

  // ------------------- FETCH VISITS -------------------
  const fetchVisits = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch("/api/visits", {
        headers: { "x-user-id": String(user.id) },
      })
      if (response.ok) {
        const data = await response.json()
        setVisits(
          data.visits?.map((v: any) => ({
            id: v.id,
            patientId: v.patientId,
            patientName: v.Patient
              ? `${v.Patient.firstName} ${v.Patient.middleName ?? ""} ${v.Patient.lastName}${v.Patient.suffix ? " " + v.Patient.suffix : ""}`.trim()
              : v.visitorName || "Unknown Patient",
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

  // ------------------- PATIENT AUTOCOMPLETE -------------------
  useEffect(() => {
    if (!newVisit.patientName) {
      setPatientSuggestions([])
      return
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/patients?search=${encodeURIComponent(newVisit.patientName || '')}`, {
          headers: { "x-user-id": String(user.id) },
        })
        if (res.ok) {
          const data = await res.json()
          const suggestions: Patient[] = data.patients.map((p: any) => ({
            id: p.id,
            name: `${p.firstName} ${p.middleName ?? ""} ${p.lastName}${p.suffix ? " " + p.suffix : ""}`.trim(),
          }))
          setPatientSuggestions(suggestions)
        }
      } catch (err) {
        console.error("Error fetching patient suggestions:", err)
      }
    }, 300) // debounce 300ms
    return () => clearTimeout(delayDebounce)
  }, [newVisit.patientName])

  const handleSelectPatient = (patient: Patient) => {
    setNewVisit({ ...newVisit, patientId: patient.id, patientName: patient.name })
    setPatientSuggestions([])
  }

  // ------------------- ADD / UPDATE VISIT -------------------
  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManageVisits || isSubmitting) return

    setIsSubmitting(true)
    const errors: string[] = []

    if (!newVisit.patientId) errors.push("Patient selection is required")
    if (!newVisit.reason?.trim()) errors.push("Reason for visit is required")
    if (!newVisit.symptoms?.trim()) errors.push("Symptoms description is required")
    if (!newVisit.treatment?.trim()) errors.push("Treatment information is required")

    if (errors.length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch("/api/visits", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-user-id": String(user.id) },
          body: JSON.stringify({
            id: editingId,
            patientId: newVisit.patientId,
            reason: newVisit.reason || "",
            symptoms: newVisit.symptoms || "",
            treatment: newVisit.treatment || "",
            notes: newVisit.notes || "",
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          setFormErrors([err.error || "Failed to update visit"])
          return
        }
        // show success toast for update
        toast({ title: "Success", description: "Visit updated.", variant: "success" })
        // Log activity for update
        const updatedData = await res.json()
        const updatedVisit = updatedData.visit
        const updatedPatientName = updatedVisit.Patient
          ? `${updatedVisit.Patient.firstName} ${updatedVisit.Patient.lastName}`
          : 'Unknown Patient'
        await logActivity("visit", `Visit record updated for ${updatedPatientName}`)
      } else {
        // Create
        const res = await fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-id": String(user.id) },
          body: JSON.stringify({
            patientId: newVisit.patientId,
            reason: newVisit.reason || "",
            symptoms: newVisit.symptoms || "",
            treatment: newVisit.treatment || "",
            notes: newVisit.notes || "",
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          setFormErrors([err.error || "Failed to save visit"])
          return
        }
        // show success toast for create
        const createData = await res.json()
        const createVisit = createData.visit
        const createPatientName = createVisit.Patient
          ? `${createVisit.Patient.firstName} ${createVisit.Patient.lastName}`
          : 'Unknown Patient'
        toast({ title: "Success", description: `Added new visit for ${createPatientName}`, variant: "success" })
        // Log activity for create
        await logActivity("visit", `Visit record added for ${createPatientName}`)
      }

      await fetchVisits()
      setShowAddForm(false)
      setEditingId(null)
      setNewVisit({
        patientName: "",
        reason: "",
        symptoms: "",
        treatment: "",
        notes: "",
      })
      setFormErrors([])
    } catch (err) {
      console.error("Error saving visit:", err)
      setFormErrors(["Failed to save visit."])
    } finally {
      setIsSubmitting(false)
    }
  }

  // ------------------- EDIT / DELETE -------------------
  const handleEditVisit = (visit: VisitRecord) => {
    if (!canManageVisits) return
    setEditingId(visit.id)
    setNewVisit({ ...visit })
    setShowAddForm(true)
  }

  const handleDeleteVisit = async (id: number) => {
    try {
      const res = await fetch("/api/visits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": String(user.id) },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        await fetchVisits()
        toast({ title: "Deleted", description: "Visit record deleted.", variant: "destructive" })
      }
    } catch (err) {
      console.error("Error deleting visit:", err)
    }
  }

  // ------------------- FILTER / SORT -------------------
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

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header & Add Button */}
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
                  patientName: "",
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

        {/* Add Form */}
        {showAddForm && canManageVisits && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
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
                  {formErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleAddVisit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={newVisit.patientName || ""}
                  onChange={(e) => {
                    const v = e.target.value
                    // allow only letters and spaces
                    if (!/^[A-Za-z\s]*$/.test(v)) return
                    setNewVisit({ ...newVisit, patientName: v, patientId: undefined })
                  }}
                  placeholder="Enter patient name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
                {/* Suggestions */}
                {patientSuggestions.length > 0 && (
                  <div
                    ref={suggestionRef}
                    className="absolute z-50 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-md max-h-60 overflow-y-auto"
                  >
                    {patientSuggestions.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="px-3 py-2 hover:bg-[#8B3A3A] hover:text-white cursor-pointer"
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>



              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  value={newVisit.reason || ""}
                  onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })}
                  placeholder="e.g., Check-up, Follow-up, Emergency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms *
                </label>
                <textarea
                  value={newVisit.symptoms || ""}
                  onChange={(e) => setNewVisit({ ...newVisit, symptoms: e.target.value })}
                  rows={3}
                  placeholder="Describe the patient's symptoms..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              {/* Treatment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment *
                </label>
                <textarea
                  value={newVisit.treatment || ""}
                  onChange={(e) => setNewVisit({ ...newVisit, treatment: e.target.value })}
                  rows={3}
                  placeholder="Describe the treatment provided..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newVisit.notes || ""}
                  onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>

              {/* Buttons */}
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

        {/* Visit List */}
        <div className="space-y-4">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-[#8B3A3A] text-white p-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{visit.patientName}</h3>
                    <p className="text-sm">{formatDateTime(visit.visitDate)}</p>
                  </div>
                  {canManageVisits && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEditVisit(visit)}>
                        <Edit2 size={18} className="hover:text-gray-200" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button>
                            <Trash2 size={18} className="hover:text-gray-200" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Visit Record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this visit record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVisit(visit.id)} className="bg-red-500 hover:bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-2">
                  <p>
                    <span className="font-semibold">Reason:</span> {visit.reason}
                  </p>
                  <p>
                    <span className="font-semibold">Symptoms:</span> {visit.symptoms}
                  </p>
                  <p>
                    <span className="font-semibold">Treatment:</span> {visit.treatment}
                  </p>
                  {visit.notes && (
                    <p>
                      <span className="font-semibold">Notes:</span> {visit.notes}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-6">No visit records found.</p>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
