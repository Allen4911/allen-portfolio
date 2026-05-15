'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Locale } from '@/i18n'

interface LanguageContextValue {
  locale: Locale
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const toggleLanguage = () => setLocale((prev) => (prev === 'en' ? 'ko' : 'en'))
  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
