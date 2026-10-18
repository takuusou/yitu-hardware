'use client'

import { useEffect, useRef } from 'react'
import { useLang } from '@/hooks/useLang'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin)

const SECONDS_PER_IMAGE = 4
const PHOTO_HEIGHT = 190
const PHOTO_GAP = 8

const IMGS = [
  { id: 'p5', src: '/p5.webp', width: 1400, height: 788, w: '33%', x: { left: '-1%'  } },
  { id: 'p3', src: '/p3.webp', width: 1400, height: 933, w: '21%', x: { right: '2%'  } },
  { id: 'p1', src: '/p1.webp', width: 1400, height: 788, w: '27%', x: { left: '4%'   } },
  { id: 'p4', src: '/p4.webp', width: 1400, height: 788, w: '24%', x: { right: '6%'  } },
  { id: 'p6', src: '/p6.webp', width: 1400, height: 788, w: '26%', x: { left: '25%'  } },
  { id: 'p2', src: '/p2.webp', width: 1400, height: 788, w: '22%', x: { right: '1%'  } },
  { id: 'p7', src: '/p7.webp', width: 1400, height: 788, w: '18%', x: { left: '8%'   } },
  { id: 'p8', src: '/p8.webp', width: 1400, height: 788, w: '17%', x: { right: '20%' } },
  { id: 'p9', src: '/p9.webp', width: 1400, height: 788, w: '23%', x: { left: '38%'  } },
]

const ORDER = ['p5','p3','p1','p4','p6','p2','p7','p8','p9']

// Adapted from GSAP's draggable horizontalLoop helper; navigation/snapping are not needed here.
// https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop/
function horizontalLoop(items: HTMLImageElement[], config: { speed: number; onRest: () => void }) {
  const timeline = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } })
  const proxy = document.createElement('div')
  const wrap = gsap.utils.wrap(0, 1)
  let totalWidth = 0
  let startProgress = 0
  let ratio = 0

  const refresh = () => {
    const progress = timeline.progress()
    timeline.progress(0, true).clear()
    gsap.set(items, { x: 0, xPercent: 0 })
    const firstLeft = items[0].getBoundingClientRect().left
    const widths = items.map(item => item.getBoundingClientRect().width)
    const starts = items.map(item => item.getBoundingClientRect().left - firstLeft)
    totalWidth = starts[items.length - 1] + widths[items.length - 1] + PHOTO_GAP
    const pixelsPerSecond = config.speed * 100

    items.forEach((item, index) => {
      const distanceToLoop = starts[index] + widths[index]
      timeline.to(item, {
        xPercent: -distanceToLoop / widths[index] * 100,
        duration: distanceToLoop / pixelsPerSecond,
      }, 0).fromTo(item, {
        xPercent: (totalWidth - distanceToLoop) / widths[index] * 100,
      }, {
        xPercent: 0,
        duration: (totalWidth - distanceToLoop) / pixelsPerSecond,
        immediateRender: false,
      }, distanceToLoop / pixelsPerSecond)
    })
    timeline.progress(1, true).progress(progress, true)
  }

  refresh()
  const align = () => timeline.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio))
  const draggable = Draggable.create(proxy, {
    trigger: items[0].parentElement,
    type: 'x',
    inertia: true,
    minDuration: 0.2,
    maxDuration: 1.2,
    overshootTolerance: 0,
    onPressInit() {
      gsap.killTweensOf(timeline)
      timeline.pause()
      startProgress = timeline.progress()
      ratio = 1 / totalWidth
      gsap.set(proxy, { x: -startProgress / ratio })
    },
    onDrag: align,
    onThrowUpdate: align,
    onRelease() {
      if (!this.isThrowing) config.onRest()
    },
    onThrowComplete: config.onRest,
  })[0]

  return { timeline, draggable, refresh }
}

export default function AboutIntroSection() {
  const { lang } = useLang()
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = document.getElementById('about-intro')
    if (!section) return

    const media = gsap.matchMedia()
    media.add('(max-width: 768px), (prefers-reduced-motion: reduce)', () => {
      // Keep the existing immediate text/CTA presentation on mobile and reduced motion.
      const aiSub = document.getElementById('ai-sub')
      if (aiSub) aiSub.style.opacity = '1'
      const aiCta = document.getElementById('ai-cta')
      if (aiCta) aiCta.style.opacity = '1'

      return () => {
        if (aiSub) aiSub.style.opacity = ''
        if (aiCta) aiCta.style.opacity = ''
      }
    })

    media.add('(max-width: 768px)', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      const track = section.querySelector<HTMLElement>('.ai-mobile-marquee')!
      const items = Array.from(track.querySelectorAll('img'))
      const averageStep = items.reduce((sum, item) => sum + PHOTO_HEIGHT * Number(item.getAttribute('width')) / Number(item.getAttribute('height')) + PHOTO_GAP, 0) / items.length
      let inViewport = false
      const canMove = () => inViewport && !document.hidden
      const resume = () => {
        if (!canMove() || reducedMotion.matches || loop.draggable.isPressed || loop.draggable.isThrowing) return
        gsap.killTweensOf(loop.timeline)
        loop.timeline.timeScale(0).play()
        gsap.to(loop.timeline, { timeScale: 1, duration: 0.6, ease: 'power2.out', overwrite: true })
      }
      const loop = horizontalLoop(items, { speed: averageStep / SECONDS_PER_IMAGE / 100, onRest: resume })
      const updateVisibility = () => {
        if (!canMove()) {
          gsap.killTweensOf(loop.timeline)
          loop.timeline.pause()
          if (loop.draggable.isPressed) loop.draggable.endDrag(loop.draggable.pointerEvent)
          loop.draggable.tween?.pause()
        } else if (loop.draggable.isThrowing) {
          loop.draggable.tween?.resume()
        } else {
          resume()
        }
      }
      const observer = new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting && entry.intersectionRatio > 0
        updateVisibility()
      }, { threshold: 0.001 })
      let lastWidth = window.innerWidth
      let resizeTimer: ReturnType<typeof setTimeout> | undefined
      const onResize = () => {
        if (window.innerWidth === lastWidth) return
        lastWidth = window.innerWidth
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          if (loop.draggable.isPressed) loop.draggable.endDrag(loop.draggable.pointerEvent)
          loop.draggable.tween?.kill()
          gsap.killTweensOf(loop.timeline)
          loop.timeline.pause()
          loop.refresh()
          loop.draggable.update()
          resume()
        }, 150)
      }
      const onMotionChange = () => {
        loop.draggable.tween?.kill()
        gsap.killTweensOf(loop.timeline)
        loop.timeline.pause()
        if (!reducedMotion.matches) updateVisibility()
      }
      observer.observe(section)
      document.addEventListener('visibilitychange', updateVisibility)
      window.addEventListener('resize', onResize)
      reducedMotion.addEventListener('change', onMotionChange)
      return () => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', updateVisibility)
        window.removeEventListener('resize', onResize)
        clearTimeout(resizeTimer)
        reducedMotion.removeEventListener('change', onMotionChange)
        loop.draggable.tween?.kill()
        loop.draggable.kill()
        gsap.killTweensOf(loop.timeline)
        loop.timeline.kill()
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

      {/* Center text + independent mobile photo marquee */}
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

        {/* Independent mobile images keep the desktop flying-photo DOM untouched. */}
        <div className="ai-mobile-marquee" aria-hidden="true">
          {IMGS.map(img => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.src} alt="" width={img.width} height={img.height}
              loading="lazy" draggable={false} />
          ))}
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

        /* Mobile-only marquee: hidden on desktop. */
        .ai-mobile-marquee { display: none; }

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

          /* Keep the former 170px layout slot while displaying 190px photos. */
          .ai-mobile-marquee {
            display: flex;
            gap: 8px;
            width: calc(100% + 48px);
            height: 190px;
            margin: -10px -24px 18px;
            overflow: hidden;
            touch-action: pan-y;
          }
          .ai-mobile-marquee img {
            flex: none;
            height: 190px;
            width: auto;
            max-width: none;
            display: block;
            user-select: none;
            touch-action: pan-y;
          }

          /* CTA */
          #ai-cta { opacity: 1 !important; }
          #ai-cta a { padding: 13px 28px !important; font-size: 12px !important; }
        }
      `}</style>
    </section>
  )
}
