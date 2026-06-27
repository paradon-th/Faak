"use client"

import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Clock, Luggage } from "lucide-react"
import dynamic from 'next/dynamic'
import { useLanguage } from "@/lib/i18n/LanguageContext"

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), { 
  ssr: false,
  loading: () => <div className="h-full w-full min-h-[400px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl flex items-center justify-center text-slate-500">กำลังโหลดแผนที่...</div>
})

interface Location {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  capacitySmall: number
  capacityLarge: number
  partnerId: string
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await fetchApi('/Location')
        setLocations(data)
      } catch (error) {
        console.error("Failed to load locations", error)
      } finally {
        setLoading(false)
      }
    }
    loadLocations()
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-12 bg-transparent">
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-3 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white drop-shadow-sm py-2 leading-normal">
            {t('locations.title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium">
            {t('locations.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-7 xl:col-span-8 h-[500px] lg:h-[700px] p-2 bg-white/30 dark:bg-black/30 backdrop-blur-3xl rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <MapDisplay locations={locations} activeLocationId={activeLocationId} />
          </div>

          {/* List Section */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 overflow-y-auto lg:h-[700px] px-4 py-4 -mx-4 custom-scrollbar">
            {locations.length === 0 ? (
              <p className="text-center text-slate-500 p-8">{t('locations.empty')}</p>
            ) : (
              locations.map((loc) => (
                <Card 
                  key={loc.id} 
                  className={`flex flex-col overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-1 backdrop-blur-2xl border rounded-[2rem] ${
                    activeLocationId === loc.id 
                      ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 ring-4 ring-blue-400/30 scale-[1.02] shadow-[0_8px_40px_rgba(59,130,246,0.3)]' 
                      : 'bg-white/40 dark:bg-black/40 border-white/60 dark:border-white/10 shadow-lg'
                  }`}
                  onClick={() => setActiveLocationId(loc.id)}
                >
                  <CardHeader className="bg-white/30 dark:bg-black/20 pb-4 border-b border-white/20 dark:border-white/5">
                    <CardTitle className="flex items-start gap-2 text-xl text-blue-900 dark:text-blue-100">
                      <MapPin className="h-6 w-6 shrink-0 text-blue-600" />
                      {loc.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{loc.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Luggage className="h-5 w-5 text-slate-400" />
                      <span>{t('locations.capacity')}: <strong>{(loc.capacitySmall || 0) + (loc.capacityLarge || 0)} {t('locations.bags')}</strong> ({t('locations.small')} {loc.capacitySmall}, {t('locations.large')} {loc.capacityLarge})</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Clock className="h-5 w-5 text-slate-400" />
                      <span>{t('locations.open24h')}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-6 px-6">
                    <Link href={`/book/${loc.id}`} className="w-full group">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-lg py-7 rounded-2xl shadow-[0_8px_20px_rgba(79,70,229,0.3)] group-hover:shadow-[0_8px_30px_rgba(79,70,229,0.5)] transition-all group-hover:-translate-y-1">
                        {t('locations.bookBtn')}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
