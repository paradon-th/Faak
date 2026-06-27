"use client"
import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, Calendar, Briefcase, CheckCircle2, QrCode } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchApi('/Booking/my-bookings')
        setBookings(data)
      } catch (err: any) {
        setError(err.message || "Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  const handlePayment = async (bookingId: string) => {
    try {
      await fetchApi(`/Booking/${bookingId}/pay`, { method: 'POST' })
      toast.success("Payment successful!")
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Paid' } : b))
    } catch (err: any) {
      toast.error(err.message || "Payment failed")
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">{t('myBookings.loading')}</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
      <div className="flex min-h-[calc(100vh-5rem)] flex-col p-6 py-12">
      <div className="max-w-4xl mx-auto space-y-6 w-full">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
          {t('myBookings.title')}
        </h1>

        {bookings.length === 0 ? (
          <Card className="shadow-sm border-dashed">
            <CardContent className="p-12 text-center text-slate-500">
              {t('myBookings.empty')}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking: any) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center justify-between">
                    {t('myBookings.bookingId')} {booking.id.split('-')[0].toUpperCase()}
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {booking.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <div>
                      <p><strong>{t('myBookings.dropoff')}</strong> {new Date(booking.dropoffTime).toLocaleString()}</p>
                      <p><strong>{t('myBookings.pickup')}</strong> {new Date(booking.pickupTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                    <p>{t('myBookings.small')} {booking.smallBags} | {t('myBookings.large')} {booking.largeBags}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center font-medium">
                    <span>Total:</span>
                    <span className="text-lg text-blue-600">฿{booking.totalPrice}</span>
                  </div>
                  
                  {booking.status === "Pending" && (
                    <div className="pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
                            Pay Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Scan QR Code</DialogTitle>
                            <DialogDescription>
                              Scan this code using your banking app
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="flex flex-col items-center justify-center p-6 space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center h-48 w-48 text-slate-300">
                              <QrCode className="h-32 w-32 mb-2 text-slate-800" />
                            </div>
                            <p className="text-lg font-bold text-blue-600">Total: ฿{booking.totalPrice}</p>
                          </div>
                          
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="rounded-xl">Cancel</Button>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => handlePayment(booking.id)} 
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                              >
                                Simulate Payment
                              </Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  )
}
