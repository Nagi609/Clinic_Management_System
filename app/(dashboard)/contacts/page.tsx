"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Mail, Phone, Facebook, Plus, Edit2, Trash2, X, ExternalLink, Globe, MapPin, MessageCircle, AlertCircle, Home, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/constants"

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

  const isAdmin = user?.role === "admin"

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
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  const handleAddClinicContact = async () => {
    if (!newClinicContact.name?.trim() || !newClinicContact.icon?.trim() || !newClinicContact.link?.trim() || isClinicSubmitting) return

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
        setNewClinicContact({
          name: "",
          icon: "",
          link: "",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error adding clinic contact:", error)
    } finally {
      setIsClinicSubmitting(false)
    }
  }

  const handleEditClinicContact = async () => {
    if (!editClinicData) return

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Icon *</label>
                  <select
                    value={newClinicContact.icon || ""}
                    onChange={(e) => setNewClinicContact({ ...newClinicContact, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                  >
                    <option value="">Select an icon</option>
                    {Object.keys(ICON_MAP).map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Link *</label>
                <input
                  type="text"
                  value={newClinicContact.link || ""}
                  onChange={(e) => setNewClinicContact({ ...newClinicContact, link: e.target.value })}
                  placeholder="e.g., tel:+1234567890, mailto:info@clinic.com, https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                />
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
                return (
                  <div key={contact.id}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col hover:shadow-md transition-shadow">
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
                            <button
                              onClick={() => handleDeleteClinicContact(contact.id)}
                              className="bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
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

                    {editingClinicId === contact.id && isAdmin && editClinicData && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 mt-4">
                        <h2 className="text-xl font-bold text-[#8B3A3A]">Edit Clinic Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Contact Name</label>
                            <input
                              type="text"
                              value={editClinicData.name}
                              onChange={(e) => setEditClinicData({ ...editClinicData, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Icon</label>
                            <select
                              value={editClinicData.icon}
                              onChange={(e) => setEditClinicData({ ...editClinicData, icon: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                            >
                              <option value="">Select an icon</option>
                              {Object.keys(ICON_MAP).map((iconName) => (
                                <option key={iconName} value={iconName}>
                                  {iconName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Link</label>
                          <input
                            type="text"
                            value={editClinicData.link}
                            onChange={(e) => setEditClinicData({ ...editClinicData, link: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                          />
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
                    )}
                  </div>
                )
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
