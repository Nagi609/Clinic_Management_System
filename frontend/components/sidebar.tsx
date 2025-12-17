"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Grid3x3, Users, FileText, Phone } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Grid3x3 },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/visit-records", label: "Visit Records", icon: FileText },
    { href: "/contacts", label: "Contacts", icon: Phone },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#8B3A3A] rounded-lg flex items-center justify-center text-white font-bold">
            +
          </div>
          <div>
            <h1 className="font-bold text-[#8B3A3A] text-lg">SorSU Clinic</h1>
            <p className="text-xs text-gray-500">BULAN CAMPUS</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        <p className="text-sm font-medium text-gray-400 px-4 mb-4">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-[#8B3A3A] text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
