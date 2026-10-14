'use client'

import { useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'
import { useReveal } from '@/hooks/useReveal'

const items = [
  { num:'01', titleZh:'尺寸精度', titleEn:'Dimensional Accuracy', descZh:'提供常规、精密到超精密的多级公差加工能力，可根据图纸要求定制，满足高端精密仪器与航空零件需求。', descEn:'Multi-tier tolerance capability from standard to ultra-precision, customized to drawing requirements. Suitable for high-end instruments and aerospace components.', value:'Custom' },
  { num:'02', titleZh:'表面粗糙度', titleEn:'Surface Roughness', descZh:'提供从标准精加工到镜面抛光的多种表面处理能力，满足医疗、光学等对表面质量敏感的应用场景。', descEn:'Surface finishing from standard precision to mirror polishing. Ideal for medical and optical applications.', value:'Finish' },
  { num:'03', titleZh:'同轴度与圆度', titleEn:'Concentricity & Roundness', descZh:'严格控制同轴度与圆度等形位公差，按图纸要求保证一致性，适用于高速轴承座、电机壳体等零件。', descEn:'Strict control of geometric tolerances such as concentricity and roundness, to drawing requirements, for high-speed bearing seats and motor housings.', value:'Stable' },
  { num:'04', titleZh:'加工范围', titleEn:'Machining Range', descZh:'加工范围覆盖小型到大型零件，单件打样与批量生产均可承接。', descEn:'Machining range covers small to large parts. Both prototype and mass production welcome.', value:'Flexible' },
]

export default function PrecisionSection() {
  const { lang } = useLang()
  const [open, setOpen] = useState(0)
  const ref = useReveal()

  return (
    <section id="precision" data-theme="dark" ref={ref as React.RefObject<HTMLElement>} style={{ background:'var(--steel)', color:'#E6E8E2', padding:'160px 0', position:'relative', overflow:'hidden' }}>
      {/* 背景图 */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/precision-bg.webp" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', opacity:0.52 }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(15,17,19,0.92) 0%, rgba(15,17,19,0.82) 30%, rgba(15,17,19,0.55) 60%, rgba(15,17,19,0.28) 100%)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(15,17,19,0.5) 0%, transparent 20%, transparent 80%, rgba(15,17,19,0.5) 100%)' }} />
      </div>

      <div style={{ maxWidth:'var(--maxw)', margin:'0 auto', padding:'0 40px', position:'relative', zIndex:1 }}>

        {/* 板块头 */}
        <div className="prec-head-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
            <div className="reveal d-0" style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.28em', color:'rgba(255,255,255,0.45)' }}>(03)</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.22em', color:'rgba(255,255,255,0.45)', textTransform:'uppercase' }}>PRECISION</span>
            </div>
            <h2 className="reveal d-80" style={{ margin:0, fontSize:'clamp(32px, 3.4vw, 44px)', fontWeight:500, lineHeight:1.2, color:'#ffffff', fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", letterSpacing: lang==='en' ? '-0.015em' : '0.02em' }}>
              <LangText zh="精度参数" en={<><em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.7)' }}>Precision</em> Specs</>} />
            </h2>
          </div>
          <div className="reveal d-160 prec-lede" style={{ fontSize:15, lineHeight:2, color:'rgba(255,255,255,0.90)', fontWeight:400, alignSelf:'end' }}>
            <LangText zh="怡途五金具备从标准公差到超精密定制的完整加工能力，以可量化的指标为每个零件的品质背书。" en="YITU Hardware delivers measurable precision from standard tolerances to ultra-precision custom specifications, backing every part with quantifiable quality metrics." />
          </div>
        </div>

        {/* Accordion */}
        <div style={{ borderTop:'1px solid var(--steel-line)' }}>
          {items.map((item, i) => (
            <div key={item.num} className={`reveal d-${i * 80}`} style={{ borderBottom:'1px solid var(--steel-line)' }}>

              {/* 触发行 */}
              <button
                type="button"
                className="prec-trigger-row"
                aria-expanded={open === i}
                aria-controls={`precision-content-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{ cursor:'pointer', transition:'padding .4s', width:'100%', background:'none', border:0, color:'inherit', textAlign:'left' }}
              >
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.24em', color:'rgba(255,255,255,0.4)', flexShrink:0 }}>({item.num})</span>
                <span className="prec-item-title" style={{ margin:0, fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight:500, fontSize:20, color:'#ffffff', letterSpacing: lang==='en' ? '-0.005em' : '0.02em' }}>
                  <LangText zh={item.titleZh} en={item.titleEn} />
                </span>
                <div style={{ width:18, height:18, position:'relative', color:'rgba(255,255,255,0.6)', flexShrink:0 }}>
                  <span style={{ position:'absolute', left:'50%', top:'50%', width:14, height:1, background:'currentColor', transform:'translate(-50%,-50%)', display:'block' }} />
                  <span style={{ position:'absolute', left:'50%', top:'50%', width:1, height:14, background:'currentColor', transform:`translate(-50%,-50%) scaleY(${open===i ? 0 : 1})`, transition:'transform .4s ease', display:'block' }} />
                </div>
              </button>

              {/* 展开内容 */}
              <div
                id={`precision-content-${i}`}
                aria-hidden={open !== i}
                className="prec-content-row"
                style={{ maxHeight: open===i ? 200 : 0, overflow:'hidden', opacity: open===i ? 1 : 0, transition:'max-height .55s ease, opacity .4s ease, padding .4s', padding: open===i ? '0 0 32px' : 0 }}
              >
                <span className="prec-content-num" style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.24em', visibility:'hidden', flexShrink:0 }}>({item.num})</span>
                <p style={{ fontFamily:"'Noto Sans SC', sans-serif", fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.88)', fontWeight:400, margin:0 }}>
                  <LangText zh={item.descZh} en={item.descEn} />
                </p>
                <div className="prec-content-value" style={{ alignSelf:'flex-start', whiteSpace:'nowrap' }}>
                  <span style={{ fontFamily:"'Fraunces', serif", fontWeight:400, fontSize:'clamp(24px, 2.4vw, 32px)', lineHeight:1, color:'#ffffff', letterSpacing:'-0.02em' }}>
                    {item.value}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* 桌面：头部两列，accordion 三列 */
        .prec-head-grid {
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(0,1.3fr);
          gap: 80px;
          margin-bottom: 120px;
          align-items: end;
        }
        .prec-trigger-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 32px;
          align-items: center;
          padding: 28px 0;
        }
        .prec-content-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 32px;
        }

        /* 平板 */
        @media (max-width: 980px) {
          #precision { padding: 80px 0; }
          .prec-head-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 60px;
          }
        }

        /* 手机 */
        @media (max-width: 768px) {
          #precision { padding: 60px 0; }
          #precision > div { padding: 0 20px !important; }

          .prec-head-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 40px;
          }
          .prec-lede { font-size: 14px !important; line-height: 1.8 !important; }

          .prec-trigger-row {
            gap: 14px;
            padding: 22px 0;
          }
          #precision h2 { font-size: 28px !important; }
          #precision .prec-item-title { font-size: 17px !important; }

          /* 内容行：隐藏右侧数值，缩短间距 */
          .prec-content-row {
            grid-template-columns: auto 1fr;
            gap: 14px;
          }
          .prec-content-num { display: none; }
          .prec-content-value { display: none; }
        }
      `}</style>
    </section>
  )
}
