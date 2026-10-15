'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import HeroSection from '@/components/sections/hero'
import AboutIntroSection from '@/components/sections/about-intro'
import IndustriesSection from '@/components/sections/industries'
import CraftSection from '@/components/sections/craft'
import PrecisionSection from '@/components/sections/precision'
import SecuritySection from '@/components/sections/security'
import AboutSection from '@/components/sections/about'
import ContactSection from '@/components/sections/contact'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        setVisible(window.scrollY > 600)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="返回顶部"
      style={{
        position: 'fixed',
        right: 32,
        bottom: 32,
        width: 44,
        height: 44,
        border: '1px solid var(--line)',
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-soft)',
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity .4s ease, transform .4s ease, background .3s, border-color .3s',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className="back-to-top"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 12V4M4 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <style>{`.back-to-top:hover { background: var(--ink) !important; color: var(--bg) !important; border-color: var(--ink) !important; }`}</style>
    </button>
  )
}

export default function Home() {
  const { lang } = useLang()

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh' : 'en'
  }, [lang])

  // 导航主题跟随当前 section — IntersectionObserver，零 scroll 事件
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('section[data-theme], footer[data-theme]')
    )
    if (!sections.length) return

    // intersecting set：跟踪哪些 section 目前穿过导航栏底边（y=64）
    const active = new Set<HTMLElement>()

    const update = () => {
      // 取 DOM 顺序最后一个穿越导航线的 section
      let theme = sections[0]?.dataset.theme ?? 'light'
      for (const s of sections) {
        if (active.has(s)) theme = s.dataset.theme ?? 'light'
      }
      document.body.setAttribute('data-nav-theme', theme)
    }

    // rootMargin '-64px 0px -85% 0px'：
    //   有效观测带 = 导航底边 (y=64) 到视口 15% 处
    //   section 进入该带 → 它的顶部已越过导航 → 成为"当前"
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) active.add(e.target as HTMLElement)
          else active.delete(e.target as HTMLElement)
        })
        update()
      },
      { rootMargin: '-64px 0px -85% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    // 初始同步一次（IO 初始回调已含第一帧，但 body 属性需预设）
    document.body.setAttribute('data-nav-theme', sections[0]?.dataset.theme ?? 'light')

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutIntroSection />
        <IndustriesSection />
        <CraftSection />
        <PrecisionSection />
        <SecuritySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
