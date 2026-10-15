'use client'

import { useEffect, useRef } from 'react'
import { useLang } from '@/hooks/useLang'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const IMGS = [
  { id: 'p5', src: '/p5.webp', w: '33%', x: { left: '-1%'  } },
  { id: 'p3', src: '/p3.webp', w: '21%', x: { right: '2%'  } },
  { id: 'p1', src: '/p1.webp', w: '27%', x: { left: '4%'   } },
  { id: 'p4', src: '/p4.webp', w: '24%', x: { right: '6%'  } },
  { id: 'p6', src: '/p6.webp', w: '26%', x: { left: '25%'  } },
  { id: 'p2', src: '/p2.webp', w: '22%', x: { right: '1%'  } },
  { id: 'p7', src: '/p7.webp', w: '18%', x: { left: '8%'   } },
  { id: 'p8', src: '/p8.webp', w: '17%', x: { right: '20%' } },
  { id: 'p9', src: '/p9.webp', w: '23%', x: { left: '38%'  } },
]

const ORDER = ['p5','p3','p1','p4','p6','p2','p7','p8','p9']

export default function AboutIntroSection() {
  const { lang } = useLang()
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = document.getElementById('about-intro')
    if (!section) return

    const media = gsap.matchMedia()
    media.add('(max-width: 768px), (prefers-reduced-motion: reduce)', () => {
      // Mobile: show sub + cta immediately, trigger photo fade when section enters view
      const aiSub = document.getElementById('ai-sub')
      if (aiSub) aiSub.style.opacity = '1'
      const aiCta = document.getElementById('ai-cta')
      if (aiCta) aiCta.style.opacity = '1'

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            section.classList.add('ai-mobile-in')
            io.disconnect()
          }
        },
        { threshold: 0.15 }
      )
      io.observe(section)
      return () => {
        io.disconnect()
        section.classList.remove('ai-mobile-in')
        if (aiSub) aiSub.style.opacity = ''
        if (aiCta) aiCta.style.opacity = ''
      }
    })

    // Desktop: full GSAP scroll timeline
    media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 7}`,
          invalidateOnRefresh: true,
          scrub: 2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo('#ai-line-1', { yPercent: 105 }, { yPercent: 0, duration: 0.65, ease: 'none' }, 0)
      tl.fromTo('#ai-sub',    { opacity: 0 },    { opacity: 1, duration: 0.4,  ease: 'none' }, 0.7)
      tl.fromTo('#ai-cta',    { opacity: 0 },    { opacity: 1, duration: 0.4,  ease: 'none' }, 0.9)

      ORDER.forEach((id, i) => {
        const start = 1.3 + i * 0.65
        tl.fromTo(`#${id}`, { y: '110vh' }, { y: '-110vh', duration: 3.5, ease: 'none' }, start)
        tl.fromTo(`#${id}`,
          { opacity: 0, scale: 1.02 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'none' },
          start
        )
      })

      const fadeStart = 1.3 + 8 * 0.65 + 3.5 - 1.2
      tl.to('#ai-cta',    { opacity: 0,     duration: 0.3, ease: 'none' }, fadeStart)
      tl.to('#ai-sub',    { opacity: 0,     duration: 0.3, ease: 'none' }, fadeStart + 0.1)
      tl.to('#ai-line-1', { yPercent: -105, duration: 0.5, ease: 'none' }, fadeStart + 0.3)
    }, section)

    let wasGlass = false
    let rafId: number | null = null
    const checkGlass = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        const sectionRect = section.getBoundingClientRect()
        if (sectionRect.bottom <= 0 || sectionRect.top >= window.innerHeight) return
        const btn = ctaRef.current
        if (!btn) return
        const btnRect = btn.getBoundingClientRect()

        let isGlass = false
        for (const id of ORDER) {
          const el = document.getElementById(id)
          if (!el) continue
          const r = el.getBoundingClientRect()
          if (r.bottom > btnRect.top && r.top < btnRect.bottom &&
              r.right > btnRect.left && r.left < btnRect.right) {
            isGlass = true
            break
          }
        }

        if (isGlass === wasGlass) return
        wasGlass = isGlass

        if (isGlass) {
          btn.setAttribute('data-glass', 'true')
          btn.style.background = 'rgba(255,255,255,0.08)'
          btn.style.backdropFilter = 'blur(14px) saturate(140%)'
          btn.style.setProperty('-webkit-backdrop-filter', 'blur(14px) saturate(140%)')
          btn.style.borderColor = 'rgba(255,255,255,0.22)'
          btn.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.18)'
        } else {
          btn.removeAttribute('data-glass')
          btn.style.background = 'transparent'
          btn.style.backdropFilter = 'none'
          btn.style.setProperty('-webkit-backdrop-filter', 'none')
          btn.style.borderColor = 'rgba(255,255,255,0.4)'
          btn.style.boxShadow = 'none'
        }
      })
    }

    window.addEventListener('scroll', checkGlass, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', checkGlass)
      if (rafId !== null) window.cancelAnimationFrame(rafId)
    }
    })
    return () => media.revert()
  }, [])

  return (
    <section
      id="about-intro"
      data-theme="dark"
      style={{
        background: '#17191B',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 9 flying images — desktop GSAP animation, hidden on mobile */}
      {IMGS.map((img) => (
        <div
          key={img.id}
          id={img.id}
          style={{ position: 'absolute', top: 0, zIndex: 1, width: img.w, ...img.x } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt="" loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      ))}

      {/* Center text + mobile photo grid */}
      <div
        className="ai-text-center"
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 40px' }}
      >
        <h2 style={{
          fontFamily: lang === 'en' ? "'Fraunces', serif" : "'Noto Serif SC', serif",
          fontWeight: 300,
          fontSize: 'clamp(40px, 4.6vw, 76px)',
          lineHeight: 1.45,
          letterSpacing: 0,
          color: '#FFFFFF',
          margin: '0 0 60px',
        }}>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span id="ai-line-1" style={{
              display: 'block',
              letterSpacing: lang === 'zh' ? '0.38em' : '0.12em',
              paddingLeft:   lang === 'zh' ? '0.38em' : '0.12em',
              whiteSpace: lang === 'zh' ? 'nowrap' : 'normal',
              textAlign: 'center',
            }}>
              {lang === 'zh' ? '一件事　深入做' : (<>ONE THING —<br />DONE DEEPLY</>)}
            </span>
          </span>
        </h2>

        <p id="ai-sub" style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 13,
          letterSpacing: '0.22em',
          paddingLeft: '0.22em',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.55)',
          margin: '0 0 52px',
          opacity: 0,
        }}>
          {lang === 'zh' ? '从 2016 年至今的努力' : 'Our commitment since 2016'}
        </p>

        {/* Mobile-only: 2 photos displayed between sub and CTA */}
        <div className="ai-mobile-photos" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/p5.webp" alt="" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/p1.webp" alt="" loading="lazy" />
        </div>

        <div id="ai-cta" style={{ display: 'flex', justifyContent: 'center', opacity: 0 }}>
          <a
            ref={ctaRef}
            href="#industries"
            className="ai-cta-btn"
            onClick={(e) => { e.preventDefault(); document.querySelector('#industries')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '16px 36px',
              background: 'transparent',
              backdropFilter: 'none',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 0,
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: 13, letterSpacing: '0.18em',
              textDecoration: 'none',
              transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            {lang === 'zh' ? '查看服务领域' : 'Explore Industries'}
            <span style={{ fontSize: 14 }}>→</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #about-intro { height: auto !important; min-height: 70svh; padding: 80px 0; }
          #p1, #p2, #p3, #p4, #p5, #p6, #p7, #p8, #p9 { display: none !important; }
          #ai-line-1 { transform: none !important; }
        }
        .ai-cta-btn:hover {
          background: #FFFFFF !important;
          color: #17191B !important;
          border-color: #FFFFFF !important;
        }
        .ai-cta-btn[data-glass="true"]:hover {
          background: rgba(255,255,255,0.22) !important;
          color: #FFFFFF !important;
          border-color: rgba(255,255,255,0.55) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.28) !important;
        }

        /* Mobile-only photo grid: hidden on desktop */
        .ai-mobile-photos { display: none; }

        @media (max-width: 768px) {
          /* Section: natural height, vertically centered column */
          #about-intro {
            height: auto !important;
            min-height: 100svh !important;
            overflow: visible !important;
            flex-direction: column !important;
            justify-content: center !important;
            padding: 80px 0 64px !important;
          }

          /* Hide all 9 absolute flying images */
          #p1, #p2, #p3, #p4, #p5, #p6, #p7, #p8, #p9 { display: none !important; }

          /* Text block */
          #about-intro .ai-text-center {
            padding: 0 24px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          #ai-line-1 {
            font-size: clamp(22px, 6vw, 30px) !important;
            letter-spacing: 0.18em !important;
            padding-left: 0.18em !important;
            white-space: normal !important;
          }
          .ai-text-center h2 { margin: 0 0 16px !important; font-size: clamp(22px, 6vw, 30px) !important; }
          #ai-sub {
            font-size: 11px !important;
            letter-spacing: 0.18em !important;
            margin: 0 0 24px !important;
          }

          /* Mobile photo grid: 2 images side by side */
          .ai-mobile-photos {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            margin: 0 0 28px !important;
            height: 170px !important;
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 0.65s ease, transform 0.65s ease;
          }
          .ai-mobile-photos img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
            display: block !important;
          }
          .ai-mobile-photos img:nth-child(2) {
            transition-delay: 0.1s;
          }

          /* IntersectionObserver adds this class to trigger fade-in */
          #about-intro.ai-mobile-in .ai-mobile-photos {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          /* CTA */
          #ai-cta { opacity: 1 !important; }
          #ai-cta a { padding: 13px 28px !important; font-size: 12px !important; }
        }
      `}</style>
    </section>
  )
}
