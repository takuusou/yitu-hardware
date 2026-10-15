import { create } from 'zustand'

type Lang = 'zh' | 'en'

interface LangStore {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLang = create<LangStore>((set) => ({
  lang: 'zh',
  setLang: (lang) => {
    set({ lang })
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'zh' ? 'zh' : 'en'
    }
  },
}))
