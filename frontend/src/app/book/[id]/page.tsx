"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Briefcase } from "lucide-react"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { toast } from "sonner"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function BookLocationPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useLanguage()
  const locationId = params.id as string

  const [location, setLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [dropoffTime, setDropoffTime] = useState<Date>()
  const [pickupTime, setPickupTime] = useState<Date>()
  const [smallBags, setSmallBags] = useState(0)
  const [largeBags, setLargeBags] = useState(0)

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const data = await fetchApi(`/Location/${locationId}`)
        setLocation(data)
      } catch (err: any) {
        setError(err.message || "Failed to load location")
      } finally {
        setLoading(false)
      }
    }
    loadLocation()
  }, [locationId])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dropoffTime || !pickupTime || (smallBags === 0 && largeBags === 0)) {
      toast.warning(t('book.warningIncomplete'))
      return
    }

    try {
      await fetchApi('/Booking', {
        method: 'POST',
        body: JSON.stringify({
          locationId,
          dropoffTime: dropoffTime.toISOString(),
          pickupTime: pickupTime.toISOString(),
          smallBags,
          largeBags
        })
      })
      toast.success(t('book.success'))
      router.push('/my-bookings')
    } catch (err: any) {
      toast.error(t('book.error') + err.message)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">{t('book.loading')}</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <main className="min-h-screen p-6 flex justify-center py-12">
      <Card className="w-full max-w-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-black/20">
          <CardTitle className="text-3xl text-slate-900 dark:text-white">{t('book.title')}</CardTitle>
          <CardDescription className="text-lg flex items-center gap-2 mt-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            {location?.name} - {location?.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBooking} className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('book.dropoffTime')}</label>
                <DateTimePicker 
                  date={dropoffTime}
                  setDate={setDropoffTime}
                  label={t('book.dropoffTime')}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('book.pickupTime')}</label>
                <DateTimePicker 
                  date={pickupTime}
                  setDate={setPickupTime}
                  label={t('book.pickupTime')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {t('book.smallBagTitle')}
                </label>
                <Input 
                  type="number" 
                  min="0"
                  max={location?.capacitySmall}
                  value={smallBags}
                  onChange={(e) => setSmallBags(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-slate-500">{t('book.available')}: {location?.capacitySmall} {t('locations.bags')}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {t('book.largeBagTitle')}
                </label>
                <Input 
                  type="number" 
                  min="0"
                  max={location?.capacityLarge}
                  value={largeBags}
                  onChange={(e) => setLargeBags(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-slate-500">{t('book.available')}: {location?.capacityLarge} {t('locations.bags')}</p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 py-7 text-lg mt-8 rounded-2xl shadow-lg transition-all hover:shadow-xl">
              {t('book.confirmBtn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
