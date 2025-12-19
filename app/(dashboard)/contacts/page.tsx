"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Mail, Phone, Facebook, Plus, Edit2, Trash2, X, ExternalLink, Globe, MapPin, MessageCircle, AlertCircle, Home, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/constants"
import { toast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

// Icon mapping for clinic contacts
const ICON_MAP: { [key: string]: React.ComponentType<any> } = {
  Phone,
  Mail,
  Facebook,
  Globe,
  MapPin,
  MessageCircle,
  AlertCircle,
  Home,
  Heart,
}

interface Contact {
  id: string
  name: string
  phone: string
  email: string
  relationship?: string
}

interface ClinicContact {
  id: string
  name: string
  icon: string
  link: string
  notes?: string
}

export default function ContactsPage() {
  const [user, setUser] = useState<any>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [clinicContacts, setClinicContacts] = useState<ClinicContact[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Contact | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddClinicForm, setShowAddClinicForm] = useState(false)
  const [editingClinicId, setEditingClinicId] = useState<string | null>(null)
  const [editClinicData, setEditClinicData] = useState<ClinicContact | null>(null)
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    phone: "",
    email: "",
    relationship: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClinicSubmitting, setIsClinicSubmitting] = useState(false)
  const [newClinicContact, setNewClinicContact] = useState<Partial<ClinicContact>>({
    name: "",
    icon: "",
    link: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<{ name: string; icon: string; link: string }>({ name: '', icon: '', link: '' })
  const [editErrors, setEditErrors] = useState<{ name: string; icon: string; link: string }>({ name: '', icon: '', link: '' })

  const validateClinicContact = (data: Partial<ClinicContact>) => {
    const errs = { name: '', icon: '', link: '' }
    if (!data.name?.trim()) errs.name = 'Contact name is required'
    if (!data.icon) errs.icon = 'Icon is required'
    else if (!['Phone', 'Mail', 'Facebook'].includes(data.icon)) errs.icon = 'Invalid icon selected'
    if (!data.link?.trim()) errs.link = 'Link or number is required'
    else {
      if (data.icon === 'Phone') {
        if (!/^09\d{9}$/.test(data.link)) errs.link = 'Phone number must start with 09 and be 11 digits'
      } else if (data.icon === 'Mail') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.link)) errs.link = 'Invalid email format'
      }
    }
    return errs
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) {
      fetchContacts()
      fetchClinicContacts()
    }
  }, [user])

  const fetchContacts = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch("/api/contacts", {
        headers: { "x-user-id": user.id },
      })
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClinicContacts = async () => {
    if (!user) return
    try {
      const response = await fetch("/api/clinic-contacts", {
        headers: { "x-user-id": user.id },
      })
      if (response.ok) {
        const data = await response.json()
        setClinicContacts(data.clinicContacts || [])
      }
    } catch (error) {
      console.error("Error fetching clinic contacts:", error)
    }
  }

  const isAdmin = typeof user?.role === 'string' && user.role.toLowerCase() === 'admin'

  const handleAddContact = async () => {
    if (!newContact.name?.trim() || !newContact.phone?.trim() || !newContact.email?.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify(newContact),
      })

      if (response.ok) {
        await fetchContacts()
        setShowAddForm(false)
        toast({ title: "Success", description: "Contact added successfully.", variant: "success" })
        setNewContact({
          name: "",
          phone: "",
          email: "",
          relationship: "",
        })
      }
    } catch (error) {
      console.error("Error adding contact:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditContact = async () => {
    if (!editData) return

    try {
      const response = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        await fetchContacts()
        setEditingId(null)
        setEditData(null)
        toast({ title: "Success", description: "Contact updated successfully.", variant: "success" })
      }
    } catch (error) {
      console.error("Error updating contact:", error)
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await fetchContacts()
        toast({ title: "Deleted", description: "Contact has been deleted.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  const handleAddClinicContact = async () => {
    const validationErrors = validateClinicContact(newClinicContact)
    setErrors(validationErrors)
    if (Object.values(validationErrors).some(err => err)) return

    setIsClinicSubmitting(true)

    try {
      const response = await fetch("/api/clinic-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify(newClinicContact),
      })

      if (response.ok) {
        await fetchClinicContacts()
        setShowAddClinicForm(false)
        toast({ title: "Success", description: "Clinic contact added successfully.", variant: "success" })
        setNewClinicContact({
          name: "",
          icon: "",
          link: "",
          notes: "",
        })
        setErrors({ name: '', icon: '', link: '' })
      }
    } catch (error) {
      console.error("Error adding clinic contact:", error)
    } finally {
      setIsClinicSubmitting(false)
    }
  }

  const handleEditClinicContact = async () => {
    if (!editClinicData) return

    const validationErrors = validateClinicContact(editClinicData)
    setEditErrors(validationErrors)
    if (Object.values(validationErrors).some(err => err)) return

    try {
      const response = await fetch("/api/clinic-contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify(editClinicData),
      })

      if (response.ok) {
        await fetchClinicContacts()
        setEditingClinicId(null)
        setEditClinicData(null)
        setEditErrors({ name: '', icon: '', link: '' })
        toast({ title: "Success", description: "Clinic contact updated successfully.", variant: "success" })
      }
    } catch (error) {
      console.error("Error updating clinic contact:", error)
    }
  }

  const handleDeleteClinicContact = async (id: string) => {
    try {
      const response = await fetch("/api/clinic-contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await fetchClinicContacts()
        toast({ title: "Deleted", description: "Clinic contact has been deleted.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error deleting clinic contact:", error)
    }
  }

  return (
    <LayoutWrapper>
      <div className="space-y-12">
        {/* CLINIC CONTACTS SECTION */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#8B3A3A] mb-2">Clinic Contacts</h1>
              <p className="text-gray-600">Manage clinic contact information and links</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddClinicForm(!showAddClinicForm)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[#8B3A3A] text-white hover:bg-[#6D2E2E] transition-colors"
              >
                <Plus size={20} />
                Add Clinic Contact
              </button>
            )}
          </div>

          {/* Add Clinic Contact Form */}
          {showAddClinicForm && isAdmin && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#8B3A3A]">Add Clinic Contact</h2>
                <button
                  onClick={() => setShowAddClinicForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Contact Name *</label>
                  <input
                    type="text"
                    value={newClinicContact.name || ""}
                    onChange={(e) => setNewClinicContact({ ...newClinicContact, name: e.target.value })}
                    placeholder="e.g., Main Office, Lab Services"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Icon *</label>
                  <select
                    value={newClinicContact.icon || ""}
                    onChange={(e) => setNewClinicContact({ ...newClinicContact, icon: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] ${errors.icon ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select an icon</option>
                    {['Phone', 'Mail', 'Facebook'].map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                  {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Link or number *</label>
                <input
                  type="text"
                  value={newClinicContact.link || ""}
                  onChange={(e) => setNewClinicContact({ ...newClinicContact, link: e.target.value })}
                  placeholder="e.g., 09123456789, info@clinic.com, https://..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] ${errors.link ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
                <textarea
                  value={newClinicContact.notes || ""}
                  onChange={(e) => setNewClinicContact({ ...newClinicContact, notes: e.target.value })}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddClinicForm(false)}
                  className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClinicContact}
                  disabled={isClinicSubmitting}
                  className="bg-[#8B3A3A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6D2E2E] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClinicSubmitting ? "Adding..." : "Add Contact"}
                </button>
              </div>
            </div>
          )}

          {/* Clinic Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {clinicContacts.length > 0 ? (
              clinicContacts.map((contact) => {
                const IconComponent = ICON_MAP[contact.icon] || Phone
                if (editingClinicId === contact.id && isAdmin && editClinicData) {
                  return (
                    <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                      <h2 className="text-xl font-bold text-[#8B3A3A]">Edit Clinic Contact</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Contact Name *</label>
                          <input
                            type="text"
                            value={editClinicData.name}
                            onChange={(e) => setEditClinicData({ ...editClinicData, name: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] ${editErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {editErrors.name && <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Icon *</label>
                          <select
                            value={editClinicData.icon}
                            onChange={(e) => setEditClinicData({ ...editClinicData, icon: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] ${editErrors.icon ? 'border-red-500' : 'border-gray-300'}`}
                          >
                            <option value="">Select an icon</option>
                            {['Phone', 'Mail', 'Facebook'].map((iconName) => (
                              <option key={iconName} value={iconName}>
                                {iconName}
                              </option>
                            ))}
                          </select>
                          {editErrors.icon && <p className="text-red-500 text-sm mt-1">{editErrors.icon}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Link or number *</label>
                        <input
                          type="text"
                          value={editClinicData.link}
                          onChange={(e) => setEditClinicData({ ...editClinicData, link: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] ${editErrors.link ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {editErrors.link && <p className="text-red-500 text-sm mt-1">{editErrors.link}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
                        <textarea
                          value={editClinicData.notes || ""}
                          onChange={(e) => setEditClinicData({ ...editClinicData, notes: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingClinicId(null)
                            setEditClinicData(null)
                            setEditErrors({ name: '', icon: '', link: '' })
                          }}
                          className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditClinicContact}
                          className="bg-[#8B3A3A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6D2E2E]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent size={28} className="text-[#8B3A3A]" />
                            <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2 ml-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingClinicId(contact.id)
                                setEditClinicData({ ...contact })
                              }}
                              className="bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  className="bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Clinic Contact</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {contact.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteClinicContact(contact.id)} className="bg-red-500 hover:bg-red-600">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <a
                          href={contact.link}
                          target={contact.link.startsWith("http") ? "_blank" : undefined}
                          rel={contact.link.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-[#8B3A3A] font-semibold hover:underline flex items-center gap-2 mb-3 break-all"
                        >
                          {contact.link}
                          {contact.link.startsWith("http") && <ExternalLink size={16} />}
                        </a>

                        {contact.notes && (
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{contact.notes}</p>
                        )}
                      </div>
                    </div>
                  )
                }
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No clinic contacts yet</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </LayoutWrapper>
  )
}
