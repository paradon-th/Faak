"use client"
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapPickerProps {
  position: { lat: number; lng: number } | null
  setPosition: (pos: { lat: number; lng: number }) => void
}

function LocationMarker({ position, setPosition }: MapPickerProps) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  return position === null ? null : (
    <Marker position={position}></Marker>
  )
}

export default function MapPicker({ position, setPosition }: MapPickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fixLeafletIcons()
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
  }

  // Default center (Bangkok)
  const defaultCenter: [number, number] = [13.7563, 100.5018]
  const zoom = 12

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-white/50 dark:border-white/10 shadow-inner relative z-0">
      <MapContainer 
        center={position ? [position.lat, position.lng] : defaultCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  )
}
