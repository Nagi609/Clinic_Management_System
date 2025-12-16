"use client"

import React, { useState, useEffect, useRef } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Search, Plus, Edit2, X, Paperclip } from "lucide-react"
import { getCurrentUser, checkPermission } from "@/lib/constants"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

type PatientRole = "student" | "teaching_staff" | "non_teaching_staff"
type Program = "CICT" | "CBME"
type StudentCourse = "BSIT" | "BSCS" | "BSIS" | "BTVTED"
type CBMECourse = "BSA" | "BSAIS" | "BPA" | "BSE"
type NonTeachingCategory = "Administration" | "Accounting" | "Human Resources" | "Student Service" | "Library" | "Maintenance" | "Security" | "Supply" | "Clinic"

interface Patient {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  dateOfBirth: string
  gender: "Male" | "Female"
  phone: string
  email?: string
  address?: string
  role: PatientRole
  idNumber: string
  program?: Program
  course?: StudentCourse | CBMECourse
  yearLevel?: number
  block?: number
  department?: Program
  staffCategory?: NonTeachingCategory
  pastIllnesses?: string
  surgeries?: string
  currentMedication?: string
  allergies?: string
  medicalNotes?: string
  primaryContactName?: string
  primaryContactRelationship?: string
  primaryContactPhone?: string
  primaryContactAddress?: string
  secondaryContactName?: string
  secondaryContactRelationship?: string
  secondaryContactPhone?: string
  secondaryContactAddress?: string
  attachments?: string
}

interface FormData {
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  dateOfBirth: string
  gender: "Male" | "Female"
  phone: string
  email: string
  address: string
  role: PatientRole
  idNumber: string
  program: Program | ""
  course: string
  yearLevel: number | ""
  block: number | ""
  department: Program | ""
  staffCategory: NonTeachingCategory | ""
  pastIllnesses: string
  surgeries: string
  currentMedication: string
  allergies: string
  medicalNotes: string
  primaryContactName: string
  primaryContactRelationship: string
  primaryContactPhone: string
  primaryContactAddress: string
  secondaryContactName: string
  secondaryContactRelationship: string
  secondaryContactPhone: string
  secondaryContactAddress: string
  attachments?: string
}

const COURSE_OPTIONS: Record<Program, string[]> = {
  CICT: ["BSIT", "BSCS", "BSIS", "BTVTED"],
  CBME: ["BSA", "BSAIS", "BPA", "BSE"],
}

const initialFormData: FormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  dateOfBirth: "",
  gender: "Male",
  phone: "",
  email: "",
  address: "",
  role: "student",
  idNumber: "",
  program: "",
  course: "",
  yearLevel: "",
  block: "",
  department: "",
  staffCategory: "",
  pastIllnesses: "",
  surgeries: "",
  currentMedication: "",
  allergies: "",
  medicalNotes: "",
  primaryContactName: "",
  primaryContactRelationship: "",
  primaryContactPhone: "",
  primaryContactAddress: "",
  secondaryContactName: "",
  secondaryContactRelationship: "",
  secondaryContactPhone: "",
  secondaryContactAddress: "",
  attachments: "",
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortOption, setSortOption] = useState("name_az")
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    role: "student",
    idNumber: "",
    program: "",
    course: "",
    yearLevel: "",
    block: "",
    department: "",
    staffCategory: "",
    pastIllnesses: "",
    surgeries: "",
    currentMedication: "",
    allergies: "",
    medicalNotes: "",
    primaryContactName: "",
    primaryContactRelationship: "",
    primaryContactPhone: "",
    primaryContactAddress: "",
    secondaryContactName: "",
    secondaryContactRelationship: "",
    secondaryContactPhone: "",
    secondaryContactAddress: "",
    attachments: "",
  })
  const [availableCourses, setAvailableCourses] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDateOfBirth, setSelectedDateOfBirth] = useState<Date | undefined>()
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  // Refs for validation scrolling
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const dateOfBirthRef = useRef<HTMLButtonElement>(null)
  const genderRef = useRef<HTMLSelectElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const programRef = useRef<HTMLSelectElement>(null)
  const courseRef = useRef<HTMLSelectElement>(null)
  const yearLevelRef = useRef<HTMLSelectElement>(null)
  const departmentRef = useRef<HTMLSelectElement>(null)
  const staffCategoryRef = useRef<HTMLSelectElement>(null)
  const primaryContactNameRef = useRef<HTMLInputElement>(null)
  const primaryContactRelationshipRef = useRef<HTMLInputElement>(null)
  const primaryContactPhoneRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) fetchPatients()
  }, [user])

  useEffect(() => {
    if (formData.program && formData.program in COURSE_OPTIONS) {
      setAvailableCourses(COURSE_OPTIONS[formData.program])
      if (!COURSE_OPTIONS[formData.program].includes(formData.course)) {
        setFormData((prev) => ({ ...prev, course: "" }))
      }
    } else {
      setAvailableCourses([])
    }
  }, [formData.program])

  const fetchPatients = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch("/api/patients", { headers: { "x-user-id": user.id } })
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const canManagePatients = user && checkPermission(user.role, "canManagePatients")
  const canEditPatients = user && checkPermission(user.role, "canEditPatients")

  const createActivity = async (type: string, message: string) => {
    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ type, message }),
      })
    } catch (error) {
      console.error("Failed to create activity:", error)
    }
  }

  const getFullName = (p: Patient) =>
    `${p.firstName} ${p.middleName ? p.middleName + " " : ""}${p.lastName}${p.suffix ? " " + p.suffix : ""}`

  // Input change handler (phone inputs fixed: allow typing 0-9 only)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Letters only for names
    if (['firstName', 'middleName', 'lastName', 'suffix', 'primaryContactName', 'primaryContactRelationship', 'secondaryContactName', 'secondaryContactRelationship'].includes(name)) {
      if (!/^[a-zA-Z\s]*$/.test(value)) return
    }

    // Phone number inputs (allow 0-9, max 11 digits)
    if (['phone', 'primaryContactPhone', 'secondaryContactPhone'].includes(name)) {
      if (!/^\d{0,11}$/.test(value)) return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: false }))
  }

  // Form validation
  const validateForm = () => {
    const errors: Record<string, boolean> = {}

    if (!formData.firstName.trim()) errors.firstName = true
    if (!formData.lastName.trim()) errors.lastName = true
    if (!selectedDateOfBirth) errors.dateOfBirth = true
    if (!formData.gender) errors.gender = true
    if (!/^09\d{9}$/.test(formData.phone)) errors.phone = true

    if (formData.role === "student") {
      if (!formData.program) errors.program = true
      if (!formData.course) errors.course = true
      if (!formData.yearLevel) errors.yearLevel = true
    } else if (formData.role === "teaching_staff") {
      if (!formData.department) errors.department = true
    } else if (formData.role === "non_teaching_staff") {
      if (!formData.staffCategory) errors.staffCategory = true
    }

    if (!formData.primaryContactName.trim()) errors.primaryContactName = true
    if (!formData.primaryContactRelationship.trim()) errors.primaryContactRelationship = true
    if (!/^09\d{9}$/.test(formData.primaryContactPhone)) errors.primaryContactPhone = true

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddOrEdit = async () => {
    if (!validateForm()) return

    try {
      const method = editingPatient ? "PUT" : "POST"
      const body = editingPatient ? { ...formData, id: editingPatient.id } : formData
      const response = await fetch("/api/patients", {
        method,
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        const patientName = `${formData.firstName} ${formData.lastName}`
        const action = editingPatient ? "updated" : "added"
        await createActivity("patient", `Patient ${patientName} was ${action}`)
        toast({ title: "Success", description: `Patient ${patientName} has been ${action} successfully.` })

        if (!editingPatient) {
          setShowForm(false)
          setFormData(initialFormData)
          setSelectedDateOfBirth(undefined)
          setAvailableCourses([])
          setFormErrors({})
        } else {
          setShowForm(false)
          setEditingPatient(null)
        }
        fetchPatients()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error("Failed to save patient:", response.status, errorData)
        toast({
          title: "Error",
          description: `Failed to save patient: ${errorData.error || errorData.errors?.join(', ') || 'Unknown error'}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditClick = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      firstName: patient.firstName,
      middleName: patient.middleName || "",
      lastName: patient.lastName,
      suffix: patient.suffix || "",
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || "",
      address: patient.address || "",
      role: patient.role,
      idNumber: patient.idNumber,
      program: patient.program || "",
      course: patient.course || "",
      yearLevel: patient.yearLevel || "",
      block: patient.block || "",
      department: patient.department || "",
      staffCategory: patient.staffCategory || "",
      pastIllnesses: patient.pastIllnesses || "",
      surgeries: patient.surgeries || "",
      currentMedication: patient.currentMedication || "",
      allergies: patient.allergies || "",
      medicalNotes: patient.medicalNotes || "",
      primaryContactName: patient.primaryContactName || "",
      primaryContactRelationship: patient.primaryContactRelationship || "",
      primaryContactPhone: patient.primaryContactPhone || "",
      primaryContactAddress: patient.primaryContactAddress || "",
      secondaryContactName: patient.secondaryContactName || "",
      secondaryContactRelationship: patient.secondaryContactRelationship || "",
      secondaryContactPhone: patient.secondaryContactPhone || "",
      secondaryContactAddress: patient.secondaryContactAddress || "",
      attachments: patient.attachments || "",
    })
    setSelectedDateOfBirth(new Date(patient.dateOfBirth))
    setAvailableCourses(patient.program ? COURSE_OPTIONS[patient.program] : [])
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const patient = patients.find(p => p.id === id)
      const response = await fetch("/api/patients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        if (patient) {
          const patientName = `${patient.firstName} ${patient.lastName}`
          await createActivity("patient", `Patient ${patientName} was deleted`)
          toast({ title: "Success", description: `Patient ${patientName} has been deleted successfully.` })
        }
        fetchPatients()
      } else {
        const errorData = await response.json()
        toast({ title: "Error", description: `Failed to delete patient: ${errorData.error || 'Unknown error'}`, variant: "destructive" })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast({ title: "Error", description: "An error occurred while deleting the patient. Please try again.", variant: "destructive" })
    }
  }

  const filteredPatients = patients
    .filter((p) =>
      getFullName(p).toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) => roleFilter === "all" || p.role === roleFilter)
    .sort((a, b) => {
      if (sortOption === "name_az") return getFullName(a).localeCompare(getFullName(b))
      if (sortOption === "name_za") return getFullName(b).localeCompare(getFullName(a))
      if (sortOption === "id_asc") return a.idNumber.localeCompare(b.idNumber)
      if (sortOption === "id_desc") return b.idNumber.localeCompare(a.idNumber)
      return 0
    })

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Patient Management</h1>
          {canManagePatients && (
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teaching_staff">Teaching Staff</option>
            <option value="non_teaching_staff">Non-Teaching Staff</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name_az">Name (A-Z)</option>
            <option value="name_za">Name (Z-A)</option>
            <option value="id_asc">ID (Ascending)</option>
            <option value="id_desc">ID (Descending)</option>
          </select>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{editingPatient ? "Edit Patient" : "Add New Patient"}</h2>
              <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingPatient(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-4 text-gray-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      placeholder="Enter middle name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      ref={lastNameRef}
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                    <input
                      type="text"
                      name="suffix"
                      value={formData.suffix}
                      onChange={handleInputChange}
                      placeholder="e.g., Jr., Sr."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select
                      ref={genderRef}
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.gender ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {formErrors.gender && <p className="text-red-500 text-xs mt-1">Gender is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          ref={dateOfBirthRef}
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${formErrors.dateOfBirth ? 'border-red-500' : ''}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDateOfBirth ? format(selectedDateOfBirth, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDateOfBirth}
                          onSelect={(date) => {
                            setSelectedDateOfBirth(date)
                            if (date) {
                              setFormData((prev) => ({ ...prev, dateOfBirth: date.toISOString().split('T')[0] }))
                            }
                            if (formErrors.dateOfBirth) setFormErrors((prev) => ({ ...prev, dateOfBirth: false }))
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">Date of birth is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                    <input
                      ref={phoneRef}
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">Valid contact number is required</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Role Information Section */}
                <div className="border-b pb-4 mt-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Role Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="student">Student</option>
                        <option value="teaching_staff">Teaching Staff</option>
                        <option value="non_teaching_staff">Non-Teaching Staff</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder="Enter ID number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {formData.role === 'student' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                        <select
                          ref={programRef}
                          name="program"
                          value={formData.program}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.program ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select program</option>
                          <option value="CICT">CICT</option>
                          <option value="CBME">CBME</option>
                        </select>
                        {formErrors.program && <p className="text-red-500 text-xs mt-1">Program is required</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                        <select
                          ref={courseRef}
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.course ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select course</option>
                          {availableCourses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                        {formErrors.course && <p className="text-red-500 text-xs mt-1">Course is required</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Level *</label>
                        <select
                          ref={yearLevelRef}
                          name="yearLevel"
                          value={formData.yearLevel}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.yearLevel ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select year level</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                        {formErrors.yearLevel && <p className="text-red-500 text-xs mt-1">Year level is required</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                        <select
                          name="block"
                          value={formData.block}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select block (optional)</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {formData.role === 'teaching_staff' && (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                        <select
                          ref={departmentRef}
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.department ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select department</option>
                          <option value="CICT">CICT</option>
                          <option value="CBME">CBME</option>
                        </select>
                        {formErrors.department && <p className="text-red-500 text-xs mt-1">Department is required</p>}
                      </div>
                    </div>
                  )}
                  {formData.role === 'non_teaching_staff' && (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Staff Category *</label>
                        <select
                          ref={staffCategoryRef}
                          name="staffCategory"
                          value={formData.staffCategory}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.staffCategory ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select category</option>
                          <option value="Administration">Administration</option>
                          <option value="Accounting">Accounting</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Student Service">Student Service</option>
                          <option value="Library">Library</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Security">Security</option>
                          <option value="Supply">Supply</option>
                          <option value="Clinic">Clinic</option>
                        </select>
                        {formErrors.staffCategory && <p className="text-red-500 text-xs mt-1">Staff category is required</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Medical Information Section */}
                <div className="border-b pb-4 mt-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Medical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Past Illnesses</label>
                      <textarea
                        name="pastIllnesses"
                        value={formData.pastIllnesses}
                        onChange={handleInputChange}
                        placeholder="Enter past illnesses"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Surgeries</label>
                      <textarea
                        name="surgeries"
                        value={formData.surgeries}
                        onChange={handleInputChange}
                        placeholder="Enter surgeries"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Medication</label>
                      <textarea
                        name="currentMedication"
                        value={formData.currentMedication}
                        onChange={handleInputChange}
                        placeholder="Enter current medication"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        placeholder="Enter allergies"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
                      <textarea
                        name="medicalNotes"
                        value={formData.medicalNotes}
                        onChange={handleInputChange}
                        placeholder="Enter medical notes"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts Section */}
                <div className="border-b pb-4 mt-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Emergency Contacts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name *</label>
                      <input
                        ref={primaryContactNameRef}
                        type="text"
                        name="primaryContactName"
                        value={formData.primaryContactName}
                        onChange={handleInputChange}
                        placeholder="Enter primary contact name"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.primaryContactName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.primaryContactName && <p className="text-red-500 text-xs mt-1">Primary contact name is required</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Relationship *</label>
                      <input
                        ref={primaryContactRelationshipRef}
                        type="text"
                        name="primaryContactRelationship"
                        value={formData.primaryContactRelationship}
                        onChange={handleInputChange}
                        placeholder="e.g., Parent, Guardian"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.primaryContactRelationship ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.primaryContactRelationship && <p className="text-red-500 text-xs mt-1">Primary contact relationship is required</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Phone *</label>
                      <input
                        ref={primaryContactPhoneRef}
                        type="text"
                        name="primaryContactPhone"
                        value={formData.primaryContactPhone}
                        onChange={handleInputChange}
                        placeholder="09XXXXXXXXX"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.primaryContactPhone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.primaryContactPhone && <p className="text-red-500 text-xs mt-1">Valid primary contact phone is required</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Address</label>
                      <input
                        type="text"
                        name="primaryContactAddress"
                        value={formData.primaryContactAddress}
                        onChange={handleInputChange}
                        placeholder="Enter primary contact address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact Name</label>
                      <input
                        type="text"
                        name="secondaryContactName"
                        value={formData.secondaryContactName}
                        onChange={handleInputChange}
                        placeholder="Enter secondary contact name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact Relationship</label>
                      <input
                        type="text"
                        name="secondaryContactRelationship"
                        value={formData.secondaryContactRelationship}
                        onChange={handleInputChange}
                        placeholder="e.g., Parent, Sibling"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact Phone</label>
                      <input
                        type="text"
                        name="secondaryContactPhone"
                        value={formData.secondaryContactPhone}
                        onChange={handleInputChange}
                        placeholder="09XXXXXXXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact Address</label>
                      <input
                        type="text"
                        name="secondaryContactAddress"
                        value={formData.secondaryContactAddress}
                        onChange={handleInputChange}
                        placeholder="Enter secondary contact address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                  <input
                    type="file"
                    name="attachments"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // Handle file upload
                        setFormData((prev) => ({ ...prev, attachments: file.name }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={() => { setShowForm(false); setEditingPatient(null); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddOrEdit}>
                    {editingPatient ? "Update Patient" : "Add Patient"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient List */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Patient List</h2>
          {filteredPatients.length === 0 ? (
            <p className="text-gray-500 text-center">No patients found</p>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{getFullName(patient)}</h3>
                      <p className="text-sm text-gray-600">ID: {patient.idNumber} | Role: {patient.role.replace('_', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setExpandedId(expandedId === patient.id ? null : patient.id)}>
                        {expandedId === patient.id ? "Hide Details" : "Show Details"}
                      </Button>
                      {canEditPatients && (
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(patient)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {canManagePatients && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {getFullName(patient)}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(patient.id)} className="bg-red-500 hover:bg-red-600">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                  {expandedId === patient.id && (
                    <div className="mt-4 space-y-2">
                      <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {patient.phone}</p>
                      <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                      <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                      {patient.role === 'student' && (
                        <>
                          <p><strong>Program:</strong> {patient.program}</p>
                          <p><strong>Course:</strong> {patient.course}</p>
                          <p><strong>Year Level:</strong> {patient.yearLevel}</p>
                          <p><strong>Block:</strong> {patient.block || 'N/A'}</p>
                        </>
                      )}
                      {patient.role === 'teaching_staff' && (
                        <p><strong>Department:</strong> {patient.department}</p>
                      )}
                      {patient.role === 'non_teaching_staff' && (
                        <p><strong>Category:</strong> {patient.staffCategory}</p>
                      )}
                      <p><strong>Past Illnesses:</strong> {patient.pastIllnesses || 'N/A'}</p>
                      <p><strong>Surgeries:</strong> {patient.surgeries || 'N/A'}</p>
                      <p><strong>Current Medication:</strong> {patient.currentMedication || 'N/A'}</p>
                      <p><strong>Allergies:</strong> {patient.allergies || 'N/A'}</p>
                      <p><strong>Medical Notes:</strong> {patient.medicalNotes || 'N/A'}</p>
                      <p><strong>Primary Contact:</strong> {patient.primaryContactName} ({patient.primaryContactRelationship}) - {patient.primaryContactPhone}</p>
                      {patient.secondaryContactName && (
                        <p><strong>Secondary Contact:</strong> {patient.secondaryContactName} ({patient.secondaryContactRelationship}) - {patient.secondaryContactPhone}</p>
                      )}
                      {patient.attachments && (
                        <p><strong>Attachments:</strong> <a href={patient.attachments} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"><Paperclip className="inline h-4 w-4 mr-1" />View</a></p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </LayoutWrapper>
    )
}
