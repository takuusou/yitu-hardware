'use client'

import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'
import { SectionHead } from '@/components/ui/SectionHead'
import { useReveal } from '@/hooks/useReveal'

const parasZh = [
  '怡途五金成立于 2016 年。最初只有两台机床，订单是一单一单接出来的。',
  '八年下来，机器陆续添置到现在的规模，工人十几位，客户也从国内做到海外。',
  '黄三红负责工厂的日常运作，也亲自处理大部分图纸。客户来询价时，她通常会自己看一遍图，确认尺寸、公差、材料和加工方式，再回复报价和交期。',
  '怡途规模不大，但每一批货的工艺、检测、出货，都由固定的几个人盯着。这种方式让我们能控制好质量，也能在客户提出修改时反应得快一些。',
  '我们目前服务的领域包括新能源汽车、医疗器械、机器人和无人机零件加工。如果您有图纸需要报价，欢迎联系我们。',
]

const parasEn = [
  'YITU Hardware was founded in 2016. We started with two machines, taking orders one at a time.',
  'Over the past eight years, we have gradually expanded our equipment, grown to a team of around a dozen workers, and extended our client base from domestic to overseas markets.',
  'Huang Sanhong manages the day-to-day operations of the workshop and personally handles most drawings. When a client sends an inquiry, she typically reviews the drawing herself — checking dimensions, tolerances, materials, and machining processes — before responding with pricing and lead time.',
  'We are a small operation, but every batch goes through the same small group of people from process planning to final inspection. This keeps quality consistent, and lets us respond quickly when clients request changes.',
  'We currently serve clients in new-energy vehicles, medical devices, robotics, and drone component manufacturing. If you have a drawing you\'d like a quote on, please get in touch.',
]

export default function AboutSection() {
  const { lang } = useLang()
  const ref = useReveal()
  const paras = lang === 'zh' ? parasZh : parasEn

  const paraStyle: React.CSSProperties = lang === 'zh'
    ? { fontFamily:"'Noto Serif SC', serif", fontWeight:300, fontSize:15, lineHeight:2, color:'var(--ink-soft)', letterSpacing:'0.04em', margin:0 }
    : { fontFamily:"'Fraunces', serif", fontWeight:300, fontSize:16, lineHeight:1.75, color:'var(--ink-soft)', letterSpacing:0, margin:0 }

  return (
    <section id="about" data-theme="light" ref={ref as React.RefObject<HTMLElement>} style={{ background:'var(--bg-2)', padding:'160px 0' }}>
      <div style={{ maxWidth:'var(--maxw)', margin:'0 auto', padding:'0 40px' }}>
        <SectionHead
          tag="05" label="ABOUT"
          titleZh="关于怡途"
          titleEn="About <em style='font-style:italic;color:var(--ink-soft)'>YITU</em>"
          ledeZh="怡途五金，一家从 2016 年开始做精密机械加工的工厂。"
          ledeEn="YITU Hardware is a precision machining workshop, founded in 2016."
        />

        <div className="founder-grid" style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.3fr)', gap:80, alignItems:'stretch' }}>

          {/* 创始人照片 */}
          <div className="reveal d-0" style={{ maxWidth:420, minHeight:480, background:'#1a1c1f', overflow:'hidden', position:'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/founder-huang-sanhong.webp"
              alt="黄三红"
              loading="lazy"
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block', position:'absolute', inset:0 }}
            />
            <div style={{ position:'absolute', bottom:20, left:20, right:20, color:'rgba(255,255,255,0.5)', fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'0.22em', display:'flex', justifyContent:'space-between' }}>
              <span><LangText zh="黄三红" en="Huang Sanhong" /></span>
              <span style={{ color:'var(--accent)' }}>●</span>
            </div>
          </div>

          {/* 文字 */}
          <div className="reveal d-160" style={{ display:'flex', flexDirection:'column' }}>

            {/* 姓名 + 职务 */}
            <div style={{ marginBottom:40 }}>
              <h2 style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight:300, fontSize:'clamp(34px, 3.6vw, 50px)', lineHeight:1.15, letterSpacing: lang==='en' ? '-0.015em' : '0.02em', margin:'0 0 10px' }}>
                <LangText zh="黄三红" en="Huang Sanhong" />
              </h2>
              <p style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.22em', color:'var(--ink-mute)', margin:0 }}>
                <LangText zh="怡途五金 创办人" en="Founder, YITU Hardware" />
              </p>
            </div>

            {/* 五段正文 — 均匀撑满剩余高度 */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              {paras.map((text, i) => (
                <p key={i} style={paraStyle}>{text}</p>
              ))}
            </div>

          </div>
        </div>
      </div>
      <style>{`
        @media (max-width:980px) {
          #about { padding:80px 0; }
          #about .founder-grid { grid-template-columns:1fr !important; align-items:start !important; }
          #about .founder-grid > div:first-child { min-height:320px !important; aspect-ratio:3/4; }
          #about .founder-grid > div:last-child { flex:none !important; }
        }
      `}</style>
    </section>
  )
}
