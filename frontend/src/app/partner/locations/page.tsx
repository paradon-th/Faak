"use client"
import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function PartnerLocationsPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchApi('/Location/my-locations')
        setLocations(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadLocations()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('partner.locationsTitle')}</h1>
        <Link href="/partner/locations/add">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">
            <Plus className="mr-2 h-4 w-4" /> {t('partner.addLocation')}
          </Button>
        </Link>
      </div>

      {locations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-slate-500">
            <MapPin className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-lg">{t('partner.emptyLocations')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <Card key={loc.id}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  {loc.name}
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{loc.status}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">{loc.address}</p>
                <div className="flex gap-4 text-sm font-medium">
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                    <span className="text-slate-500 block text-xs">{t('partner.locSmall')}</span>
                    {loc.capacitySmall}
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                    <span className="text-slate-500 block text-xs">{t('partner.locLarge')}</span>
                    {loc.capacityLarge}
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="w-full rounded-xl">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
