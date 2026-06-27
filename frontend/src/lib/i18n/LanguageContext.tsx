"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import th from './locales/th.json'
import en from './locales/en.json'

type Locale = 'th' | 'en'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const dictionaries: Record<Locale, any> = {
  th,
  en,
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('th')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale
    if (saved && (saved === 'th' || saved === 'en')) {
      setLocaleState(saved)
    }
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value = dictionaries[locale]
    
    for (const k of keys) {
      if (value === undefined) break
      value = value[k]
    }
    
    return typeof value === 'string' ? value : key
  }

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ locale: 'th', setLocale, t }}>
        <div className="opacity-0 transition-opacity duration-300">{children}</div>
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      <div className="opacity-100 transition-opacity duration-300">{children}</div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
