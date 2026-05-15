import { createContext, useContext } from 'react'

interface LangContextValue { lang: string; setLang: (l: string) => void; t?: (key: string) => string }
export const LanguageContext = createContext<LangContextValue>({ lang: 'ko', setLang: () => {} })
export function useLanguage() { return useContext(LanguageContext) }
export const useLang = useLanguage
