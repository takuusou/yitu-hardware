'use client'

import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'
import { SectionHead } from '@/components/ui/SectionHead'
import { useReveal } from '@/hooks/useReveal'

const industryImages = [
  '/images/industry-nev.webp',
  '/images/industry-medical.webp',
  '/images/industry-robot.webp',
  '/images/industry-uav.webp',
]

const industries = [
  { num:'01', catZh:'应用领域', catEn:'Application', titleZh:'新能源汽车', titleEn:'New Energy<br/>Vehicles', descZh:'为新能源整车及核心系统供应商提供电池包结构件、电驱壳体、热管理精密部件等高精度铝合金及钢制零件，满足严苛的轻量化与密封性要求。', descEn:'Supplying high-precision aluminum and steel components for NEV manufacturers, including battery pack structures, e-drive housings, and thermal management parts.', metaLeft:'NEV · POWERTRAIN', metaRight:'AL-6061 / SUS304', bg:'#1a2830' },
  { num:'02', catZh:'应用领域', catEn:'Application', titleZh:'医疗器械', titleEn:'Medical<br/>Devices', descZh:'面向医疗器械行业的质量管理要求，从原材料到交付注重全程可追溯。', descEn:'Aligned with medical-device quality requirements. Full traceability from raw material to delivery.', metaLeft:'MEDICAL · ROBOTICS', metaRight:'Ti-6AL-4V / 316L', bg:'#1a2426' },
  { num:'03', catZh:'应用领域', catEn:'Application', titleZh:'智能机器人', titleEn:'Intelligent<br/>Robotics', descZh:'为工业机器人、协作机器人、服务机器人本体及末端执行器制造商提供高精度关节结构件、减速器壳体及传动零件。', descEn:'Precision joint structures and transmission components for industrial and collaborative robots, including reducer housings and end-effector parts.', metaLeft:'ROBOTICS · COBOT', metaRight:'AL-7075 / SCM440', bg:'#1e2428' },
  { num:'04', catZh:'应用领域', catEn:'Application', titleZh:'无人机', titleEn:'Unmanned<br/>Aerial Vehicles', descZh:'为消费级与工业级无人机提供机架结构件、云台精密件、动力系统部件，严格控制公差与重量，确保飞行稳定性。', descEn:'Frame structures and precision gimbal components for consumer and industrial UAVs. Strict tolerance and weight control for flight stability.', metaLeft:'UAV · DRONE', metaRight:'AL-2024 / CF', bg:'#1c2228' },
]

export default function IndustriesSection() {
  const { lang } = useLang()
  const ref = useReveal()

  return (
    <section id="industries" data-theme="light" ref={ref as React.RefObject<HTMLElement>} style={{ padding:'160px 0', background:'var(--bg)' }}>
      <div style={{ maxWidth:'var(--maxw)', margin:'0 auto', padding:'0 40px' }}>
        <SectionHead
          tag="01" label="INDUSTRIES"
          titleZh="服务领域"
          titleEn="Industries<br/><em style='font-style:italic;color:var(--ink-soft)'>We Serve</em>"
          ledeZh="深耕精密制造八年，怡途五金为新能源、医疗、机器人等高技术门槛行业提供稳定可靠的精密金属零件。"
          ledeEn="Eight years in precision manufacturing. YITU Hardware supplies reliable precision metal components for high-barrier industries including NEV, medical, and robotics."
        />
        <div style={{ borderBottom:'1px solid var(--line)' }}>
          {industries.map((item, i) => {
            const isAlt = i % 2 === 1
            return (
              <div
                key={item.num}
                className="ind-row"
                style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', padding:'90px 0', borderTop:'1px solid var(--line)', direction: isAlt ? 'rtl' : 'ltr' }}
              >
                {/* 图片区 */}
                <div
                  className="ind-img-hover reveal d-0"
                  style={{ aspectRatio:'4/3', background:item.bg, overflow:'hidden', position:'relative' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={industryImages[i]}
                    alt={lang === 'zh' ? item.titleZh : item.titleEn.replace(/<br\s*\/?\s*>/g, ' ')}
                    loading="lazy"
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  />
                  <div style={{ position:'absolute', inset:0, background:'radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(0,0,0,.5) 100%)', pointerEvents:'none', zIndex:1 }} />
                  <div style={{ position:'absolute', left:24, bottom:22, right:24, display:'flex', justifyContent:'space-between', alignItems:'flex-end', fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'0.22em', color:'#9aa1a6', zIndex:2, direction:'ltr' }}>
                    <span><span style={{ display:'inline-block', width:6, height:6, background:'var(--accent)', borderRadius:'50%', marginRight:10, verticalAlign:'middle' }} />{item.metaLeft}</span>
                    <span style={{ fontSize:10, color:'#6a7075' }}>{item.metaRight}</span>
                  </div>
                </div>
                {/* 文字区 */}
                <div
                  className="reveal d-160"
                  style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:440, margin:'0 auto', padding:'0 32px', direction:'ltr' }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:24 }}>
                    <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.28em', color:'var(--ink-mute)' }}>({item.num})</span>
                    <div style={{ width:24, height:1, background:'var(--ink-mute)', flexShrink:0 }} />
                    <span style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontStyle: lang==='en' ? 'italic' : 'normal', fontSize:13, letterSpacing: lang==='en' ? 0 : '0.16em', color:'var(--ink-mute)', fontWeight:300 }}>
                      <LangText zh={item.catZh} en={item.catEn} />
                    </span>
                  </div>
                  <h3 style={{ fontSize:'clamp(28px, 2.6vw, 40px)', margin:0, fontWeight:300, lineHeight:1.15, fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", letterSpacing: lang==='en' ? '-0.015em' : '0.04em' }} dangerouslySetInnerHTML={{ __html: lang==='zh' ? item.titleZh : item.titleEn }} />
                  <div style={{ height:1, background:'var(--line)', maxWidth:60 }} />
                  <p style={{ fontSize:14, lineHeight:2, color:'var(--ink-soft)', margin:0 }}>
                    <LangText zh={item.descZh} en={item.descEn} />
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`
        .ind-img-hover { transition: transform .8s cubic-bezier(.2,.7,.2,1); }
        .ind-img-hover:hover { transform: translateY(-4px); }
        @media (max-width:980px) {
          #industries { padding:80px 0; }
          .ind-row { grid-template-columns:1fr !important; direction:ltr !important; gap:24px !important; padding:48px 0 !important; }
        }
      `}</style>
    </section>
  )
}
