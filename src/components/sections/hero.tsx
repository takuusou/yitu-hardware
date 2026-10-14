'use client'

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { RotateCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Application as SplineApp } from '@splinetool/runtime'
import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'

const SPLINE_SCENE_URL = 'https://prod.spline.design/d0dVBGtxNJWHD7g1/scene.splinecode'

// Lazy-loaded only on desktop — mobile never downloads this 615KB chunk
const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
})

class SplineErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function HeroSceneFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(to bottom, #070808 0%, #0B0D0E 45%, #050606 100%)',
      }}
    />
  )
}

function HeroMobileBg() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/hero-mobile.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
      }}
    />
  )
}

function HeroLoadingIndicator({ hidden }: { hidden: boolean }) {
  const { lang } = useLang()
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        opacity: hidden ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(244,244,242,0.7)',
          animation: 'hero-loading-pulse 1.4s ease-in-out infinite',
        }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: '0.4em',
          color: 'rgba(244,244,242,0.55)',
        }}
      >
        {lang === 'zh' ? '加载中' : 'Loading'}
      </span>
      <style>{`
        @keyframes hero-loading-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

function HeroSplineScene({ onApp }: { onApp: (app: SplineApp | null) => void }) {
  const { lang } = useLang()
  // 'init' → shows fallback during SSR; useEffect resolves to 'mobile' | 'spline' | 'fallback'
  const [status, setStatus] = useState<'init' | 'mobile' | 'spline' | 'fallback'>('init')
  // 3D 场景是否已就绪 —— 控制淡入 + "加载中" 指示
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const staticView = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)')
    const update = () => {
      onApp(null)
      setLoaded(false)
      setStatus(staticView.matches ? 'mobile' : canCreateWebGLContext() ? 'spline' : 'fallback')
    }
    const id = window.setTimeout(update, 0)
    staticView.addEventListener('change', update)
    return () => {
      window.clearTimeout(id)
      staticView.removeEventListener('change', update)
      onApp(null)
    }
  }, [onApp])

  if (status === 'mobile') return <HeroMobileBg />
  if (status === 'spline') {
    return (
      <SplineErrorBoundary key={attempt} fallback={
        <>
          <HeroMobileBg />
          <div role="alert" style={{ position:'absolute', top:'35%', width:'100%', zIndex:3, display:'flex', alignItems:'center', justifyContent:'center', gap:12, color:'#EFEFEC', fontSize:13 }}>
            <span>{lang === 'zh' ? '3D 场景加载失败' : '3D scene could not load'}</span>
            <button type="button" title={lang === 'zh' ? '重新加载' : 'Retry'} aria-label={lang === 'zh' ? '重新加载 3D 场景' : 'Retry 3D scene'} onClick={() => { onApp(null); setLoaded(false); setAttempt(value => value + 1) }} style={{ background:'transparent', border:0, color:'inherit', cursor:'pointer', padding:8 }}>
              <RotateCw size={18} />
            </button>
          </div>
        </>
      }>
        {/* 始终垫底的深色背景，3D 未就绪时可见 */}
        <HeroSceneFallback />
        {/* 3D 场景：onLoad 后从透明淡入，避免"啪"地蹦出来 */}
        <SplineComponent
          scene={SPLINE_SCENE_URL}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1.1s ease',
          }}
          onLoad={(app) => {
            app.setZoom(1)
            onApp(app)
            setLoaded(true)
          }}
        />
        {/* 加载中指示，3D 就绪后淡出 */}
        <HeroLoadingIndicator hidden={loaded} />
      </SplineErrorBoundary>
    )
  }
  // 'init' or 'fallback'
  return status === 'fallback' ? <HeroMobileBg /> : <HeroSceneFallback />
}

export default function HeroSection() {
  const { lang } = useLang()
  const sectionRef = useRef<HTMLElement | null>(null)
  const splineWrapperRef = useRef<HTMLDivElement | null>(null)
  const maskRef = useRef<HTMLDivElement | null>(null)
  const stackRef = useRef<HTMLDivElement | null>(null)
  const splineAppRef = useRef<SplineApp | null>(null)
  // 期望的渲染状态：Hero 在视口内才让 Spline 渲染。app 晚于 observer 就绪时用它补一次。
  const splineShouldRenderRef = useRef(true)
  const handleSplineApp = useCallback((app: SplineApp | null) => {
    splineAppRef.current = app
    if (!app) return
    if (splineShouldRenderRef.current) app.play()
    else app.stop()
  }, [])

  // 滚动驱动文字退场：直接写 DOM 样式，不经过 React 状态 → 不触发每帧重渲染
  useEffect(() => {
    let frame = 0

    const updateTextExit = () => {
      frame = 0
      const mask = maskRef.current
      const stack = stackRef.current
      if (!mask || !stack) return
      if (window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) {
        mask.style.clipPath = 'none'
        mask.style.opacity = '1'
        stack.style.transform = 'none'
        return
      }

      const fadeDistance = window.innerHeight * 0.58
      const progress = Math.min(1, Math.max(0, window.scrollY / fadeDistance))
      const ease = progress * progress * (3 - 2 * progress)
      const clipBottom = Math.min(100, ease * 112)
      const lift = ease * 86
      const tailFade = Math.min(1, Math.max(0, (progress - 0.82) / 0.18))

      mask.style.clipPath = `inset(0 0 ${clipBottom}% 0)`
      mask.style.opacity = String(1 - tailFade)
      stack.style.transform = `translate3d(0, ${lift * -1}px, 0)`
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateTextExit)
    }

    updateTextExit()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  // Hero 滚出视口时暂停 Spline 渲染循环，滚回来再恢复 —— 避免 3D 引擎在后台空转吃 GPU
  useEffect(() => {
    const target = sectionRef.current
    if (!target) return
    let inViewport = true
    const update = () => {
      const visible = inViewport && document.visibilityState === 'visible'
      splineShouldRenderRef.current = visible
      const app = splineAppRef.current
      if (!app) return
      if (visible) app.play()
      else app.stop()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting
        update()
      },
      { threshold: 0 }
    )

    observer.observe(target)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  useEffect(() => {
    const wrapper = splineWrapperRef.current
    if (!wrapper) return

    const stopSplineWheel = (event: WheelEvent) => {
      event.stopPropagation()
      if (event.ctrlKey) event.preventDefault()
    }

    let touchStartX = 0
    let touchStartY = 0
    let touchIntent: 'page' | 'spline' | null = null

    const resetTouchIntent = () => {
      touchIntent = null
    }

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        resetTouchIntent()
        return
      }
      const touch = event.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      touchIntent = null
    }

    const stopSplinePinchOrVerticalPan = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (event.touches.length !== 1) return

      const touch = event.touches[0]
      const deltaX = touch.clientX - touchStartX
      const deltaY = touch.clientY - touchStartY

      if (!touchIntent && Math.hypot(deltaX, deltaY) > 8) {
        touchIntent = Math.abs(deltaY) > Math.abs(deltaX) ? 'page' : 'spline'
      }

      if (touchIntent === 'page') {
        event.stopPropagation()
      }
    }

    wrapper.addEventListener('wheel', stopSplineWheel, { capture: true, passive: false })
    wrapper.addEventListener('touchstart', onTouchStart, { capture: true, passive: true })
    wrapper.addEventListener('touchmove', stopSplinePinchOrVerticalPan, {
      capture: true,
      passive: false,
    })
    wrapper.addEventListener('touchend', resetTouchIntent, { capture: true })
    wrapper.addEventListener('touchcancel', resetTouchIntent, { capture: true })

    return () => {
      wrapper.removeEventListener('wheel', stopSplineWheel, { capture: true })
      wrapper.removeEventListener('touchstart', onTouchStart, { capture: true })
      wrapper.removeEventListener('touchmove', stopSplinePinchOrVerticalPan, { capture: true })
      wrapper.removeEventListener('touchend', resetTouchIntent, { capture: true })
      wrapper.removeEventListener('touchcancel', resetTouchIntent, { capture: true })
    }
  }, [])

  return (
    <section
      id="hero"
      data-theme="dark"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#08090A',
      }}
    >
      {/* Background: Spline 3D (desktop) or static image (mobile) */}
      <div
        className="hero-spline-bg"
        ref={splineWrapperRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'auto',
        }}
      >
        <HeroSplineScene onApp={handleSplineApp} />
      </div>

      {/* Gradient overlay for text readability */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(8,9,10,0.30) 0%, rgba(8,9,10,0.12) 38%, rgba(8,9,10,0.78) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Hero text stack */}
      <div
        className="hero-bottom-group"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 16,
          textAlign: 'center',
          padding: '0 40px 20px',
          pointerEvents: 'none',
        }}
      >
        <div
          data-hero="copy-mask"
          ref={maskRef}
          style={{
            overflow: 'hidden',
            clipPath: 'inset(0 0 0% 0)',
            opacity: 1,
            pointerEvents: 'none',
            willChange: 'clip-path, opacity',
          }}
        >
          <div
            data-hero="copy-stack"
            ref={stackRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              transform: 'translate3d(0, 0, 0)',
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          >
            <h1
              data-hero="title"
              style={{
                display: 'block',
                margin: 0,
                fontFamily: lang === 'en' ? "'Fraunces', serif" : "'Noto Serif SC', serif",
                fontWeight: 300,
                fontSize: 'clamp(26px, 3vw, 48px)',
                lineHeight: 1.25,
                letterSpacing: lang === 'en' ? '-0.01em' : '0.12em',
                color: '#F4F4F2',
                textShadow: '0 18px 55px rgba(0,0,0,0.55)',
                animation: 'hero-text-enter 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                pointerEvents: 'none',
              }}
            >
              <LangText zh="精微所向　质坚如一" en="MICRO-PRECISION. ABSOLUTE INTEGRITY." />
            </h1>

            <p
              data-hero="body"
              style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                margin: 0,
                fontSize: 'clamp(13px, 1.1vw, 16px)',
                color: 'rgba(244,244,242,0.72)',
                lineHeight: 2.0,
                maxWidth: 600,
                fontWeight: 400,
                letterSpacing: lang === 'zh' ? '0.04em' : 0,
                textShadow: '0 10px 36px rgba(0,0,0,0.45)',
                animation: 'hero-text-enter 0.9s cubic-bezier(0.16,1,0.3,1) 0.34s both',
                pointerEvents: 'none',
              }}
            >
              <LangText
                zh="怡途五金，深耕精密 CNC 加工领域逾十年。以严苛工序与持续创新，为新能源、医疗、机器人等高端制造提供可靠的精密零件方案。"
                en="YITU Hardware, dedicated to precision CNC machining for over ten years. Serving new energy, medical, and robotics industries with rigorous process control and sustained innovation."
              />
            </p>

            <div
              data-hero="scroll"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                animation: 'hero-text-enter 0.9s cubic-bezier(0.16,1,0.3,1) 0.48s both',
                pointerEvents: 'none',
              }}
            >
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.4em',
                color: 'rgba(244,244,242,0.55)',
                pointerEvents: 'none',
              }}>
                {lang === 'zh' ? '向 下' : 'SCROLL'}
              </span>
              <div style={{
                width: 1,
                height: 38,
                background: 'linear-gradient(to bottom, rgba(244,244,242,0.55), rgba(244,244,242,0))',
                animation: 'scroll-line 2.2s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-text-enter {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes scroll-line {
          0%, 100% { transform: scaleY(1);    transform-origin: top;    opacity: 0.5; }
          50%       { transform: scaleY(0.35); transform-origin: bottom; opacity: 0.9; }
        }
        #hero .hero-spline-bg > div,
        #hero .hero-spline-bg canvas {
          width: 100% !important;
          height: 100% !important;
        }
        #hero .hero-spline-bg {
          pointer-events: auto;
          transform: translate3d(0, var(--hero-spline-y, -1.5vh), 0) scale(var(--hero-spline-scale, 1.02));
          transform-origin: center var(--hero-spline-origin-y, 48%);
          will-change: transform;
        }
        #hero .hero-spline-bg canvas {
          display: block;
        }
        #hero .hero-bottom-group {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        #hero [data-hero="title"],
        #hero [data-hero="body"],
        #hero [data-hero="copy-mask"],
        #hero [data-hero="copy-stack"],
        #hero [data-hero="scroll"],
        #hero [data-hero="scroll"] * {
          box-sizing: border-box;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          #hero { min-height: 100svh; }
          #hero .hero-spline-bg {
            inset: 0;
            transform: none !important;
            will-change: auto;
          }
          #hero .hero-bottom-group {
            gap: 20px !important;
            min-height: 100svh !important;
            padding: 0 22px 22px !important;
            overflow: hidden;
          }
          #hero [data-hero="title"] {
            width: min(100%, 260px) !important;
            font-size: clamp(20px, 5.2vw, 24px) !important;
            line-height: 1.45 !important;
            letter-spacing: 0.04em !important;
            white-space: normal !important;
            overflow-wrap: anywhere !important;
            text-wrap: balance;
          }
          #hero [data-hero="body"] {
            width: min(100%, 270px) !important;
            font-size: 12px !important;
            line-height: 1.8 !important;
            letter-spacing: 0.01em !important;
            max-width: 100% !important;
            overflow-wrap: break-word !important;
            text-wrap: pretty;
          }
        }
      `}</style>
    </section>
  )
}
