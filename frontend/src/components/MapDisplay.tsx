"use client"
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

// Fix for default marker icons in Next.js
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface Location {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  capacitySmall: number
  capacityLarge: number
}

interface MapDisplayProps {
  locations: Location[]
  activeLocationId?: string | null
}

function MapController({ activeLocationId, locations }: { activeLocationId?: string | null, locations: Location[] }) {
  const map = useMap()

  useEffect(() => {
    if (activeLocationId) {
      const loc = locations.find(l => l.id === activeLocationId)
      if (loc) {
        map.flyTo([loc.latitude, loc.longitude], 15, {
          duration: 1.5
        })
      }
    }
  }, [activeLocationId, locations, map])

  return null
}

export default function MapDisplay({ locations, activeLocationId }: MapDisplayProps) {
  const [mounted, setMounted] = useState(false)
  const popupRefs = useRef<Record<string, L.Popup | null>>({})
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    // Fix leaflet marker icon issues in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  if (!mounted) {
    return <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />
  }

  const defaultCenter = [13.7563, 100.5018] as [number, number] // Bangkok
  const center = locations.length > 0 ? [locations[0].latitude, locations[0].longitude] as [number, number] : defaultCenter

  return (
    <div className="h-full w-full relative rounded-[2rem] overflow-hidden group">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full z-0 transition-opacity duration-700 ease-in-out"
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController activeLocationId={activeLocationId} locations={locations} />

        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.latitude, loc.longitude]}
            ref={(ref) => {
              if (ref) {
                // @ts-ignore - accessing internal popup property
                popupRefs.current[loc.id] = ref.getPopup()
              }
            }}
          >
            <Popup className="custom-popup rounded-2xl overflow-hidden shadow-2xl border-0">
              <div className="p-1 space-y-3 min-w-[200px]">
                <h3 className="font-bold text-lg text-slate-900 border-b pb-2">{loc.name}</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="line-clamp-2">{loc.address}</p>
                  <p className="font-semibold text-blue-600 bg-blue-50 p-2 rounded-lg mt-2 inline-block">
                    {t('locations.capacity')}: {(loc.capacitySmall || 0) + (loc.capacityLarge || 0)} {t('locations.bags')}
                  </p>
                </div>
                <Link href={`/book/${loc.id}`} className="block mt-4">
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md">
                    {t('locations.bookThisSpace')}
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
