"use client"
import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Briefcase, MapPin, Users } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function PartnerDashboard() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    activeLocations: 0,
    pendingBookings: 0
  })
  const { t } = useLanguage()

  useEffect(() => {
    // In a real app we would have a /stats endpoint, 
    // for now we aggregate from locations and bookings
    const loadStats = async () => {
      try {
        const bookings = await fetchApi('/Booking/partner-bookings')
        const locations = await fetchApi('/Location/my-locations')
        
        let earnings = 0
        let pending = 0
        
        bookings.forEach((b: any) => {
          if (b.status === 'Completed' || b.status === 'CheckedIn' || b.status === 'Paid') {
            earnings += b.totalPrice
          }
          if (b.status === 'Paid' || b.status === 'Pending') {
            pending++
          }
        })

        setStats({
          totalEarnings: earnings,
          totalBookings: bookings.length,
          activeLocations: locations.length,
          pendingBookings: pending
        })
      } catch (err) {
        console.error(err)
      }
    }
    
    loadStats()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('partner.dashboardTitle')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-400 text-white border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent border-0">
            <CardTitle className="text-sm font-medium text-blue-100">{t('partner.totalIncome')}</CardTitle>
            <Wallet className="h-5 w-5 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">฿{stats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('partner.totalBookings')}</CardTitle>
            <Briefcase className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
            <Users className="h-5 w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{stats.pendingBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('partner.activeLocations')}</CardTitle>
            <MapPin className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeLocations}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="min-h-[300px] flex items-center justify-center">
          <p className="text-slate-400">Chart (Coming Soon)</p>
        </Card>
        <Card className="min-h-[300px] flex items-center justify-center">
          <p className="text-slate-400">Activity (Coming Soon)</p>
        </Card>
      </div>
    </div>
  )
}
