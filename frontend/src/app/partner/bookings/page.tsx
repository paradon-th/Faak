"use client"
import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Briefcase, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function PartnerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchApi('/Booking/partner-bookings')
        setBookings(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/Booking/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      })
      toast.success(`อัปเดตสถานะเป็น ${newStatus} สำเร็จ`)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">รายการจองกระเป๋า</h1>

      {bookings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-lg">ยังไม่มีรายการจองเข้ามาในขณะนี้</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="flex flex-col sm:flex-row justify-between items-center p-6 gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">รหัส: {booking.id.split('-')[0].toUpperCase()}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium
                    ${booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                      booking.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'CheckedIn' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> รับ: {new Date(booking.dropoffTime).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> เล็ก {booking.smallBags} | ใหญ่ {booking.largeBags}
                  </div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    ฿{booking.totalPrice}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {booking.status === 'Paid' && (
                  <Button 
                    onClick={() => updateStatus(booking.id, 'CheckedIn')}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> รับกระเป๋าเข้าฝาก
                  </Button>
                )}
                {booking.status === 'CheckedIn' && (
                  <Button 
                    onClick={() => updateStatus(booking.id, 'Completed')}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> ลูกค้ารับคืนแล้ว
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
