"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import dynamic from 'next/dynamic'
import { useLanguage } from "@/lib/i18n/LanguageContext"

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-slate-500">Loading map...</div>
})

export default function AddLocationPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [capacitySmall, setCapacitySmall] = useState(10)
  const [capacityLarge, setCapacityLarge] = useState(5)
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!position) {
      toast.error("Please pin location on map")
      return
    }

    setLoading(true)
    try {
      await fetchApi('/Location', {
        method: 'POST',
        body: JSON.stringify({
          name,
          address,
          latitude: position.lat,
          longitude: position.lng,
          capacitySmall,
          capacityLarge,
          isActive: true
        })
      })
      
      toast.success(t('partner.addSuccess'))
      router.push('/partner/locations')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error saving location")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('partner.addLocationTitle')}</h1>
          <p className="text-slate-500 mt-1">{t('partner.addLocationDesc')}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Back</Button>
      </div>

      <Card className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-white/30 dark:bg-black/20 pb-4 border-b border-white/20 dark:border-white/5">
          <CardTitle>Location Details</CardTitle>
          <CardDescription>This information will be visible to customers</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('partner.locName')}</label>
                <Input 
                  placeholder={t('partner.locNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="bg-white/60 dark:bg-black/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('partner.locAddress')}</label>
                <Textarea 
                  placeholder="Address..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="bg-white/60 dark:bg-black/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('partner.locSmall')}</label>
                <Input 
                  type="number" 
                  min="0"
                  value={capacitySmall}
                  onChange={(e) => setCapacitySmall(parseInt(e.target.value) || 0)}
                  required
                  className="bg-white/60 dark:bg-black/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('partner.locLarge')}</label>
                <Input 
                  type="number" 
                  min="0"
                  value={capacityLarge}
                  onChange={(e) => setCapacityLarge(parseInt(e.target.value) || 0)}
                  required
                  className="bg-white/60 dark:bg-black/50"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <label className="text-sm font-semibold flex items-center justify-between">
                <span>{t('partner.locMap')}</span>
                {position && (
                  <span className="text-xs text-blue-600 font-normal">
                    {t('partner.locLat')}: {position.lat.toFixed(4)}, {t('partner.locLng')}: {position.lng.toFixed(4)}
                  </span>
                )}
              </label>
              <MapPicker position={position} setPosition={setPosition} />
            </div>

            <div className="pt-6">
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all">
                {loading ? "..." : t('partner.saveBtn')}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
