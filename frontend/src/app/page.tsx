"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  
  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center p-6 bg-transparent">
      <div className="w-full max-w-4xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        <h1 className="text-6xl font-extrabold tracking-tight lg:text-8xl text-slate-900 dark:text-white drop-shadow-sm">
          {t('landing.heroTitle1')} <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-pulse">
            Faak
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('landing.heroDesc')}
        </p>

        <Card className="mx-auto max-w-2xl mt-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.2)] bg-white/40 backdrop-blur-3xl border border-white/60 dark:bg-black/40 dark:border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500">
          <CardHeader className="pb-4 pt-8">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">{t('landing.searchTitle')}</CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-400">{t('landing.searchDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 px-2" onSubmit={(e) => { e.preventDefault(); router.push('/locations'); }}>
              <div className="relative flex-1 group">
                <MapPin className="absolute left-5 top-5 h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  placeholder={t('landing.searchPlaceholder')}
                  className="pl-14 text-xl py-8 rounded-2xl bg-white/60 dark:bg-black/50 border-2 border-white/50 focus:border-blue-400 dark:border-white/10 dark:focus:border-blue-500 shadow-inner transition-all group-focus-within:bg-white dark:group-focus-within:bg-slate-900"
                />
              </div>
              <Button type="submit" size="lg" className="py-8 px-10 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <Search className="mr-2 h-6 w-6" />
                {t('landing.searchBtn')}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="pt-16 text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {t('landing.partnerPromo')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-2xl border-2 border-white/50 backdrop-blur-md bg-white/30 dark:bg-black/30 shadow-lg hover:bg-white/50 text-slate-700 dark:text-slate-300 transition-all" 
              onClick={() => router.push('/register')}
            >
              {t('landing.userRegisterBtn')}
            </Button>
            <Button 
              size="lg" 
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-600/20 border-0 transition-all hover:scale-105" 
              onClick={() => router.push('/register?role=partner')}
            >
              {t('landing.partnerRegisterBtn')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
