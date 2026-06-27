"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MapPin, Briefcase, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: "/partner/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
    { href: "/partner/locations", label: "จัดการสถานที่", icon: MapPin },
    { href: "/partner/bookings", label: "รายการจองกระเป๋า", icon: Briefcase },
  ]

  return (
    <ProtectedRoute allowedRoles={['Partner', 'Admin']}>
      <div className="flex h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-r border-white/50 dark:border-white/10 flex flex-col p-4 shadow-xl z-10">
        <div className="mb-8 px-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Partner Portal
          </h2>
          <p className="text-sm text-slate-500">จัดการพื้นที่รับฝากของคุณ</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                    : "text-slate-600 hover:bg-white/50 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
