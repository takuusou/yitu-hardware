'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'
import { useReveal } from '@/hooks/useReveal'

const steps = [
  { idx:'01', titleZh:'原材料管控', titleEn:'Material Control', descZh:'严格筛选合格供应商，每批来料进行光谱分析与硬度检测，确保原材料成分与力学性能达标。', descEn:'Qualified suppliers only. Spectral analysis and hardness testing on every incoming batch to ensure material composition and mechanical properties.', metaZh:'原材料', metaEn:'Material', sub:'INCOMING INSPECTION', image:'/images/craft-material.webp', darkLabel:true },
  { idx:'02', titleZh:'精密加工', titleEn:'Precision Machining', descZh:'配备多轴联动数控加工中心，具备高转速、高定位精度的加工能力，适用于复杂曲面与深孔零件。', descEn:'Multi-axis CNC machining centers with high-speed, high-precision capability for complex surfaces and deep-hole components.', metaZh:'精密加工', metaEn:'Machining', sub:'MACHINING CENTER', image:'/images/craft-cnc.webp', darkLabel:false },
  { idx:'03', titleZh:'尺寸检验', titleEn:'Dimension Inspection', descZh:'每批零件加工完成后进行尺寸检验，关键尺寸逐件测量。', descEn:'Dimensional inspection after each batch. Critical dimensions measured part by part.', metaZh:'尺寸检验', metaEn:'Inspection', sub:'QUALITY ASSURANCE', image:'/images/craft-cmm.webp', darkLabel:false },
  { idx:'04', titleZh:'表面处理', titleEn:'Surface Treatment', descZh:'阳极氧化、喷砂、电镀、钝化等多种表面处理工艺，满足不同行业的外观与防护需求。', descEn:'Anodizing, sandblasting, electroplating, and passivation to meet appearance and protection specifications across industries.', metaZh:'表面处理', metaEn:'Surface', sub:'FINISHING', image:'/images/craft-surface.webp', darkLabel:false },
]

export default function CraftSection() {
  const { lang } = useLang()
  const [active, setActive] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef   = useReveal()
  const activeRef    = useRef(0)

  const goToStep = useCallback((i: number) => {
    if (i === activeRef.current) return
    setActive(i)
    activeRef.current = i
  }, [])

  const selectStep = (i: number) => {
    goToStep(i)
    const el = containerRef.current
    if (!el || !window.matchMedia('(min-width: 981px) and (prefers-reduced-motion: no-preference)').matches) return
    const range = el.offsetHeight - window.innerHeight
    const sectionTop = el.getBoundingClientRect().top + window.scrollY
    // Place the scroll position inside the selected segment, so scrolling continues from it.
    window.scrollTo({ top: sectionTop + range * ((i + 0.1) / steps.length), behavior: 'instant' })
  }

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 981px) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    const measure = () => {
      frame = 0
      if (!desktop.matches) return
      const el = containerRef.current
      if (!el) return
      const rect     = el.getBoundingClientRect()
      const progress = -rect.top / (rect.height - window.innerHeight)
      goToStep(Math.min(3, Math.max(0, Math.floor(progress * 4))))
    }

    // rAF 节流：每帧最多读一次布局，避免滚动时同步 reflow 抖动
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [goToStep])

  const metaLabel = (s: typeof steps[0]) => (
    <div style={{ position:'absolute', left:24, bottom:24, color: s.darkLabel ? '#555860' : '#9aa1a6', fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'0.22em' }}>
      <strong style={{ display:'block', color: s.darkLabel ? '#15171a' : '#e6e8e2', fontWeight:400, fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontSize:14, letterSpacing:'0.12em', marginBottom:6 }}>
        <LangText zh={s.metaZh} en={s.metaEn} />
      </strong>
      {s.sub}
    </div>
  )

  return (
    <section id="craft" data-theme="light" ref={sectionRef as React.RefObject<HTMLElement>} style={{ background:'var(--bg-2)', position:'relative' }}>
      <div ref={containerRef} className="craft-scroll-wrap" style={{ height:'400vh', position:'relative' }}>
        <div className="craft-sticky" style={{ position:'sticky', top:0, height:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
          <div className="craft-grid" style={{ width:'100%', maxWidth:'var(--maxw)', margin:'0 auto', padding:'90px 40px 60px', display:'grid', gridTemplateColumns:'1fr 1.05fr', gap:80, alignItems:'stretch', height:'min(720px, 84vh)' }}>

            {/* ── 左侧：标题 + 步骤列表 ── */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%' }}>
              <div style={{ marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.28em', color:'var(--ink-mute)' }}>(02)</span>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.22em', color:'var(--ink-mute)', textTransform:'uppercase' }}>CRAFT</span>
                </div>
                <h2 style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight:500, fontSize:'clamp(32px, 3.4vw, 44px)', lineHeight:1.2, margin:'0 0 20px', letterSpacing: lang==='en' ? '-0.015em' : '0.02em' }}>
                  <LangText zh="工艺流程" en={<><em style={{ fontStyle:'italic', color:'var(--ink-soft)' }}>Craft</em> &amp; Process</>} />
                </h2>
                <p style={{ fontFamily:"'Noto Sans SC', sans-serif", fontSize:15, lineHeight:1.8, color:'var(--ink-soft)', maxWidth:380, margin:0, fontWeight:400 }}>
                  <LangText zh="从原材料入厂到成品交付，每一道工序都有严格的质量控制节点，确保每个零件达到设计规格。" en="From incoming material to final delivery, every step has strict quality checkpoints to ensure each part meets design specifications." />
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', borderTop:'1px solid var(--line)' }}>
                {steps.map((s, i) => (
                  <button type="button" key={s.idx} aria-pressed={active === i} onClick={() => selectStep(i)} style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:24, width:'100%', background:'none', border:0, color:'inherit', textAlign:'left', padding: active===i ? '22px 0 18px' : '18px 0 16px', borderBottom:'1px solid var(--line)', transition:'padding .5s ease', cursor:'pointer' }}>
                    <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.24em', color:'var(--ink-mute)', paddingTop:4 }}>({s.idx})</span>
                    <div>
                      <h4 style={{ margin:0, fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight: active===i ? 500 : 400, fontSize:20, letterSpacing: lang==='en' ? 0 : '0.02em', color: active===i ? 'var(--ink)' : 'var(--ink-mute)', transition:'color .4s' }}>
                        <LangText zh={s.titleZh} en={s.titleEn} />
                      </h4>
                      <div style={{ fontFamily:"'Noto Sans SC', sans-serif", fontSize:15, lineHeight:1.8, color:'var(--ink-mute)', maxHeight: active===i ? 140 : 0, overflow:'hidden', opacity: active===i ? 1 : 0, transition:'max-height .55s ease, opacity .45s ease, margin .5s ease', marginTop: active===i ? 10 : 0, fontWeight:400 }}>
                        <LangText zh={s.descZh} en={s.descEn} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 图片保持挂载，仅切换透明度，快速操作时也不会丢失目标步骤。 */}
            <div className="craft-img-panel" style={{ position:'relative', height:'100%', overflow:'hidden', background:'#17191B' }}>

              {steps.map((step, i) => (
              <div key={step.idx} aria-hidden={active !== i} style={{
                position: 'absolute', inset: 0, opacity: active === i ? 1 : 0,
                transition: 'opacity 0.45s ease',
                pointerEvents: 'none',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.image} alt={lang === 'zh' ? step.titleZh : step.titleEn} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }} loading="lazy" />
                {metaLabel(step)}
              </div>
              ))}

              {/* 右侧进度条 */}
              <div style={{ position:'absolute', right:0, top:0, bottom:0, width:2, zIndex:2 }}>
                <div style={{ position:'absolute', right:0, top:0, left:0, background:'var(--accent)', transition:'height .4s ease', height:`${(active+1)*25}%` }} />
              </div>
            </div>

          </div>
        </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .craft-scroll-wrap { height: auto !important; }
          .craft-sticky { position: relative !important; height: auto !important; padding: 60px 0; }
        }
        @media (max-width: 980px) {
          .craft-scroll-wrap { height: auto !important; }
          .craft-sticky      { position: relative !important; height: auto !important; padding: 60px 0 !important; overflow: visible !important; }
          .craft-grid        { grid-template-columns: 1fr !important; gap: 32px !important; height: auto !important; padding: 0 20px !important; }
          .craft-img-panel   { height: 56vw !important; min-height: 240px; }
        }
        @media (max-width: 768px) {
          .craft-scroll-wrap { height: auto !important; }
          .craft-sticky      { position: relative !important; height: auto !important; padding: 40px 0 !important; overflow: visible !important; }
          .craft-grid        { grid-template-columns: 1fr !important; gap: 20px !important; height: auto !important; padding: 0 16px !important; }
          .craft-img-panel   { height: 64vw !important; min-height: 200px; }
          #craft h2          { font-size: 26px !important; }
          #craft h4          { font-size: 15px !important; }
          #craft p           { font-size: 14px !important; }
          #craft [style*="cursor: pointer"] { -webkit-tap-highlight-color: rgba(0,0,0,0.06); }
        }
      `}</style>
    </section>
  )
}
