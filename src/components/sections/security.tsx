'use client'

import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'
import { SectionHead } from '@/components/ui/SectionHead'
import { useReveal } from '@/hooks/useReveal'
import type { ReactElement } from 'react'

const cards = [
  {
    num: '01',
    titleZh: '图纸保密', titleEn: 'Confidentiality',
    subZh: 'NDA 协议 · 内部访问控制', subEn: 'NDA Available · Controlled Internal Access',
    keywordZh: '图纸不外传', keywordEn: 'Drawings Stay In-House',
    descZh: '客户图纸与工艺资料仅在生产现场流转，不向外部传递或转交。如需正式保密协议，可在合作前签署。所有图纸由黄三红统一接收和分发，对接人员单一，信息流向可控。',
    descEn: 'Client drawings and process documentation circulate only on the production floor — never transferred or forwarded externally. A formal NDA can be signed prior to engagement. All drawings are received and distributed by Huang Sanhong, ensuring a single point of contact and a traceable information flow.',
    noteZh: '默认按 NDA 标准处理',
    noteEn: 'NDA standards applied by default.',
    icon: 'shield',
  },
  {
    num: '02',
    titleZh: '质量把控', titleEn: 'Quality Assurance',
    subZh: '专业检测 · 全程留档', subEn: 'Professional Inspection · Full Documentation',
    keywordZh: '每件都检验', keywordEn: 'Every Part Inspected',
    descZh: '所有零件经专业测量设备检测后出货，关键尺寸记录归档保存。批次、机台、操作人员信息可追溯，便于客户后续核查与复刻。',
    descEn: 'All components are inspected with professional measuring equipment before shipment, with critical dimensions recorded and archived. Batch, machine, and operator data remain traceable, supporting future verification or reproduction.',
    noteZh: '数据归档保存',
    noteEn: 'Inspection data archived for reference.',
    icon: 'certificate',
  },
  {
    num: '03',
    titleZh: '交期管理', titleEn: 'Delivery',
    subZh: '报期前评估 · 进度可查询', subEn: 'Pre-Quote Assessment · Trackable Progress',
    keywordZh: '交期不浮动', keywordEn: 'Dates Hold',
    descZh: '接单前根据当前产能与工艺评估交期，仅承诺可执行的时间。生产期间进度可随时查询。如出现客观延期，提前同步原因与新交期。',
    descEn: 'Delivery dates are assessed against current capacity and process requirements before quoting — we only commit to dates we can meet. Progress can be checked at any time during production. In case of objective delays, the reason and revised date are communicated proactively.',
    noteZh: '不接做不到的订单',
    noteEn: "We don't accept work we can't deliver.",
    icon: 'delivery',
  },
]

const icons: Record<string, ReactElement> = {
  shield: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 4L6 10v10c0 9 6.4 17.4 15 19 8.6-1.6 15-10 15-19V10L21 4z"/>
      <path d="M14 21l5 5 9-9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  certificate: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="5" width="32" height="24" rx="1"/>
      <path d="M13 14h16M13 19h10"/>
      <circle cx="21" cy="34" r="5"/>
      <path d="M16 34l-3 4M26 34l3 4" strokeLinecap="round"/>
    </svg>
  ),
  delivery: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="12" width="24" height="18" rx="1"/>
      <path d="M27 18h8l4 6v6h-12V18z"/>
      <circle cx="10" cy="33" r="3"/><circle cx="31" cy="33" r="3"/>
      <path d="M10 12V7h18" strokeLinecap="round"/>
    </svg>
  ),
}

const delays = ['d-0', 'd-160', 'd-320'] as const

export default function SecuritySection() {
  const { lang } = useLang()
  const ref = useReveal()

  return (
    <section id="security" data-theme="light" ref={ref as React.RefObject<HTMLElement>} style={{ background:'var(--bg)', padding:'160px 0' }}>
      <div style={{ maxWidth:'var(--maxw)', margin:'0 auto', padding:'0 40px' }}>
        <SectionHead
          tag="04" label="COOPERATION"
          titleZh="合作保障"
          titleEn="Working With <em style='font-style:italic;color:var(--ink-soft)'>Us</em>"
          ledeZh="怡途的合作流程围绕三件事建立：信息保密、加工质量、交付确定性。"
          ledeEn="YITU's process is built around three commitments: confidentiality, quality, and delivery reliability."
        />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:1, background:'var(--line)', border:'1px solid var(--line)' }}>
          {cards.map((card, i) => (
            <div
              key={card.num}
              className={`sec-card reveal ${delays[i]}`}
              style={{ background:'var(--bg)', padding:'48px 36px 40px', minHeight:400, display:'flex', flexDirection:'column', transition:'background .4s, opacity 0.85s ease, transform 0.85s cubic-bezier(0.16,1,0.3,1)', position:'relative' }}
            >
              {/* 编号 */}
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.24em', color:'var(--ink-mute)', marginBottom:32 }}>({card.num})</span>

              {/* 图标 */}
              <div style={{ width:42, height:42, marginBottom:32, color:'var(--ink)' }}>
                {icons[card.icon]}
              </div>

              {/* 主标题 */}
              <h4 style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight: lang==='en' ? 400 : 300, fontSize:22, margin:'0 0 8px', letterSpacing: lang==='en' ? 0 : '0.04em' }}>
                <LangText zh={card.titleZh} en={card.titleEn} />
              </h4>

              {/* 副标题 */}
              <p style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontStyle: lang==='en' ? 'italic' : 'normal', fontWeight:300, fontSize:13, color:'var(--ink-mute)', letterSpacing: lang==='en' ? 0 : '0.06em', margin:'0 0 28px' }}>
                <LangText zh={card.subZh} en={card.subEn} />
              </p>

              {/* 视觉主词 */}
              <p style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight: lang==='en' ? 400 : 300, fontSize: lang==='en' ? 20 : 22, color:'var(--ink)', letterSpacing: lang==='en' ? '-0.01em' : '0.06em', margin:'0 0 20px', lineHeight:1.3 }}>
                <LangText zh={card.keywordZh} en={card.keywordEn} />
              </p>

              {/* 正文 */}
              <p style={{ fontSize:13, lineHeight:2, color:'var(--ink-soft)', margin:0, flex:1 }}>
                <LangText zh={card.descZh} en={card.descEn} />
              </p>

              {/* 底部小字 */}
              <p style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, letterSpacing:'0.06em', color:'var(--ink-mute)', margin:'24px 0 0', paddingTop:16, borderTop:'1px solid var(--line)' }}>
                <LangText zh={card.noteZh} en={card.noteEn} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .sec-card:hover { background: #F2F3EE !important; }
        @media (max-width:980px) {
          #security { padding:80px 0; }
          #security [style*="repeat(3"] { grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  )
}
