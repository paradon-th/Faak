"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await fetchApi('/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }))
      
      toast.success(t('auth.loginSuccess'))
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 text-center bg-white/30 dark:bg-black/20 pb-6 border-b border-white/20 dark:border-white/5">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('auth.loginTitle')}</CardTitle>
          <CardDescription>
            {t('auth.loginDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('auth.email')}</label>
              <Input 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-6 rounded-xl bg-white/60 dark:bg-black/50 border-white/50 dark:border-white/10"
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
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-2xl shadow-lg mt-6" disabled={loading}>
              {loading ? "..." : t('auth.loginBtn')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('auth.noAccount')} <Link href="/register" className="text-blue-600 hover:underline">{t('auth.registerLink')}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
