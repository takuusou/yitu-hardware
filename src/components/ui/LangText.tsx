'use client'

import { ReactNode } from 'react'
import { useLang } from '@/hooks/useLang'

interface LangTextProps {
  zh: ReactNode
  en: ReactNode
}

export function LangText({ zh, en }: LangTextProps) {
  const { lang } = useLang()
  return <>{lang === 'zh' ? zh : en}</>
}
