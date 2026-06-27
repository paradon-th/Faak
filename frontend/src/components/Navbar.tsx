"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function Navbar() {
  const router = useRouter()
  const { t, locale, setLocale } = useLanguage()
  const [user, setUser] = useState<{name: string, role: string} | null>(null)

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    }
    
    loadUser()
    const interval = setInterval(loadUser, 1000) // Keep state synced across tabs and route changes
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-2xl shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-600">Faak</Link>
        <div className="flex items-center gap-4">
          <Link href="/locations" className="text-sm font-medium hover:text-blue-600 transition-colors">{t('nav.locations')}</Link>
          {user ? (
            <>
              {user.role === 'Partner' || user.role === 'Admin' ? (
                <Link href="/partner/dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors">{t('nav.partnerPortal')}</Link>
              ) : (
                <Link href="/my-bookings" className="text-sm font-medium hover:text-blue-600 transition-colors">{t('nav.myBookings')}</Link>
              )}
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-4 border-l border-slate-300 dark:border-slate-700 pl-4">
                {t('nav.greeting')}, {user.name}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>{t('nav.logout')}</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
              <Link href="/register">
                <Button size="sm" variant="outline" className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  {t('nav.register')}
                </Button>
              </Link>
              <Link href="/register?role=partner">
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md border-0">
                  {t('landing.partnerRegisterBtn')}
                </Button>
              </Link>
            </>
          )}

          {/* Language Switcher */}
          <div className="ml-2 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setLocale('th')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${locale === 'th' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              TH
            </button>
            <button 
              onClick={() => setLocale('en')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${locale === 'en' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
