"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const isPartner = searchParams.get('role') === 'partner'
  const role = isPartner ? 'Partner' : 'Customer'
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await fetchApi('/Auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone, role })
      })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }))
      
      toast.success(t('auth.registerSuccess'))
      if (isPartner) {
        router.push('/partner/dashboard')
      } else {
        router.push('/')
      }
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก")
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 text-center bg-white/30 dark:bg-black/20 pb-6 border-b border-white/20 dark:border-white/5">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isPartner ? t('landing.partnerRegisterBtn') : t('auth.registerTitle')}
          </CardTitle>
          <CardDescription>
            {isPartner ? "Faak Partner Program" : t('auth.registerDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.name')}</label>
              <Input 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.phone')}</label>
              <Input 
                type="tel" 
                placeholder="08x-xxx-xxxx" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.email')}</label>
              <Input 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.password')}</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-6 rounded-xl bg-white/60 dark:bg-black/50 border-white/50 dark:border-white/10"
              />
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-2xl shadow-lg mt-6" type="submit" disabled={loading}>
              {loading ? "..." : t('auth.registerBtn')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('auth.hasAccount')} <Link href="/login" className="text-blue-600 hover:underline">{t('auth.loginLink')}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
