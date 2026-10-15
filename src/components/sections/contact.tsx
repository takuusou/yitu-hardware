'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'
import { SectionHead } from '@/components/ui/SectionHead'
import { useReveal } from '@/hooks/useReveal'

const contactInfo = [
  {
    labelZh:'地址', labelEn:'ADDRESS',
    valueZh:'广东省东莞市大朗镇大冚墟二街7号102室',
    valueEn:'Room 102, No.7 Dakeng St, Dalang, Dongguan, Guangdong, China',
    subZh:'邮编 523770', subEn:'523770',
    copyable: false,
  },
  {
    labelZh:'电话', labelEn:'PHONE',
    valueZh:'+86 186 8863 3958', valueEn:'+86 186 8863 3958',
    subZh:'周一至周六 9:00–18:00', subEn:'MON–SAT 9:00–18:00 CST',
    copyValue: '18688633958',
    copyable: true,
  },
  {
    labelZh:'邮箱', labelEn:'EMAIL',
    valueZh:'rockkeatssss@gmail.com', valueEn:'rockkeatssss@gmail.com',
    subZh:'24 小时内回复', subEn:'Response within 24 hours',
    copyValue: 'rockkeatssss@gmail.com',
    copyable: true,
  },
]

const fieldsZh = [
  { id:'name',     labelZh:'姓名',     labelEn:'Name',     placeholderZh:'您的姓名',   placeholderEn:'Your name',     req:true },
  { id:'company',  labelZh:'公司名称', labelEn:'Company',  placeholderZh:'公司名称',   placeholderEn:'Company name',  req:true },
  { id:'email',    labelZh:'联系邮箱', labelEn:'Email',    placeholderZh:'邮箱地址',   placeholderEn:'Email address', req:true, type:'email' },
  { id:'phone',    labelZh:'联系电话', labelEn:'Phone',    placeholderZh:'手机 / 座机', placeholderEn:'Phone number',  req:false },
  { id:'material', labelZh:'材料要求', labelEn:'Material', placeholderZh:'如：铝合金 6061-T6', placeholderEn:'e.g. Aluminium 6061-T6', req:false },
  { id:'quantity', labelZh:'数量需求', labelEn:'Quantity', placeholderZh:'件数或批次', placeholderEn:'Pieces or batches', req:false },
]

const CONTACT_EMAIL = 'rockkeatssss@gmail.com'

export default function ContactSection() {
  const { lang } = useLang()
  const [mailPrepared, setMailPrepared] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copyFailed, setCopyFailed] = useState(false)
  const ref = useReveal()

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = async (text: string, key: string) => {
    setCopyFailed(false)
    try {
      await navigator.clipboard.writeText(text)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      setCopiedKey(key)
      copyTimerRef.current = setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      setCopyFailed(true)
    }
  }

  useEffect(() => {
    return () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current) }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const getField = (name: string) => String(fd.get(name) ?? '').trim()

    const name = getField('name')
    const company = getField('company')
    const email = getField('email')
    const phone = getField('phone')
    const material = getField('material')
    const quantity = getField('quantity')
    const description = getField('description')
    const subjectBase = lang === 'zh' ? '怡途五金询价' : 'YITU Hardware Quote Request'
    const customer = [company, name].filter(Boolean).join(' / ')
    const subject = customer ? `${subjectBase} - ${customer}` : subjectBase
    const empty = lang === 'zh' ? '未填写' : 'Not provided'
    const body =
      lang === 'zh'
        ? [
            '您好，怡途五金：',
            '',
            '我想咨询以下精密零件加工项目，请协助评估报价。',
            '',
            `姓名：${name || empty}`,
            `公司名称：${company || empty}`,
            `联系邮箱：${email || empty}`,
            `联系电话：${phone || empty}`,
            `材料要求：${material || empty}`,
            `数量需求：${quantity || empty}`,
            '',
            '需求描述：',
            description || empty,
            '',
            '图纸附件：请在发送前添加 PDF / STEP / DXF / CAD 图纸或相关资料。',
            '',
            '谢谢。',
          ].join('\n')
        : [
            'Hello YITU Hardware,',
            '',
            'I would like to request a quotation for the following precision machining project.',
            '',
            `Name: ${name || empty}`,
            `Company: ${company || empty}`,
            `Email: ${email || empty}`,
            `Phone: ${phone || empty}`,
            `Material: ${material || empty}`,
            `Quantity: ${quantity || empty}`,
            '',
            'Project description:',
            description || empty,
            '',
            'Drawing attachments: Please attach PDF / STEP / DXF / CAD files or related documents before sending.',
            '',
            'Thank you.',
          ].join('\n')

    setMailPrepared(true)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: lang === 'zh' ? "'Noto Sans SC', sans-serif" : "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--ink)',
    letterSpacing: lang === 'zh' ? 0 : '0.08em',
    textTransform: lang === 'en' ? 'uppercase' : 'none',
    marginBottom: 12,
    display: 'block',
  }

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid #C5C2BA',
    padding: '12px 0',
    color: 'var(--ink)',
    fontFamily: "'Noto Sans SC', sans-serif",
    fontSize: 15,
    fontWeight: 400,
    outline: 'none',
    width: '100%',
    transition: 'border-color .3s',
  }

  return (
    <section id="contact" data-theme="light" ref={ref as React.RefObject<HTMLElement>} style={{ background:'var(--bg)', color:'var(--ink)', padding:'160px 0 120px' }}>
      <div style={{ maxWidth:'var(--maxw)', margin:'0 auto', padding:'0 40px' }}>
        <SectionHead
          tag="06" label="CONTACT"
          titleZh="联系我们"
          titleEn={`Get in <em style='font-style:italic;color:var(--ink-soft)'>Touch</em>`}
        />

        <p className="reveal d-80 contact-lede" style={{ fontSize:18, fontWeight:400, lineHeight:1.7, color:'#2A2A2A', margin:'-96px 0 100px', maxWidth:720 }}>
          <LangText
            zh="无论是询价、技术咨询还是合作洽谈，我们的团队将在 24 小时内回复您的消息。"
            en="Whether it's a quote request, technical consultation, or partnership inquiry — our team will respond within 24 hours."
          />
        </p>

        {/* 主体：左右两列 */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.05fr)', gap:120, alignItems:'start' }}>

          {/* 左：联系信息列 */}
          <div className="reveal d-0">
            <h3 style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight:500, fontSize:28, margin:'0 0 16px', letterSpacing: lang==='en' ? '-0.005em' : '0.02em', lineHeight:1.3, color:'#0A0A0A' }}>
              <LangText zh="与我们沟通" en="Let's Talk" />
            </h3>
            <p style={{ fontSize:17, fontWeight:400, color:'#2A2A2A', marginBottom:48, lineHeight:1.8 }}>
              <LangText
                zh="怡途五金期待与您建立长期合作关系。请通过以下方式联系我们，或直接填写右侧报价表单。"
                en="YITU Hardware looks forward to building a long-term partnership with you. Reach us through any of the channels below, or fill out the quote form directly."
              />
            </p>

            {/* 地址 / 电话 / 邮箱 */}
            {contactInfo.map((info) => (
              <div key={info.labelEn} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:24, padding:'40px 0', borderTop:'1px solid var(--line)', alignItems:'start' }}>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:12, fontWeight:500, letterSpacing:'0.08em', color:'#888888', textTransform:'uppercase', paddingTop:4 }}>
                  {lang === 'zh' ? info.labelZh : info.labelEn}
                </span>
                <div>
                  <button
                    type="button"
                    disabled={!info.copyable}
                    onClick={info.copyable ? () => handleCopy(info.copyValue!, info.labelEn) : undefined}
                    style={{ fontSize:18, fontFamily:'inherit', fontWeight:500, color:'#0A0A0A', lineHeight:1.6, cursor: info.copyable ? 'pointer' : 'default', display:'inline-flex', alignItems:'center', gap:8, userSelect:'text', background:'none', border:0, padding:0, textAlign:'left' }}
                    title={info.copyable ? (lang === 'zh' ? '点击复制' : 'Click to copy') : undefined}
                  >
                    {lang === 'zh' ? info.valueZh : info.valueEn}
                    {info.copyable && copiedKey === info.labelEn && (
                      <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, fontWeight:400, color:'#22A06B', letterSpacing:'0.06em' }}>
                        {lang === 'zh' ? '已复制' : 'Copied'}
                      </span>
                    )}
                  </button>
                  <small style={{ display:'block', fontFamily:"'JetBrains Mono', monospace", fontSize:13, fontWeight:400, letterSpacing:'0.04em', color:'#888888', marginTop:8 }}>
                    {lang === 'zh' ? info.subZh : info.subEn}
                  </small>
                </div>
              </div>
            ))}
            {copyFailed && (
              <p role="alert" style={{ fontSize:13, color:'var(--accent)' }}>
                <LangText zh="复制失败，请手动选择并复制上方联系方式。" en="Copy failed. Please select and copy the contact details manually." />
              </p>
            )}

            {/* 微信 — 与上方各行同 grid */}
            <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:24, padding:'40px 0', borderTop:'1px solid var(--line)', alignItems:'center' }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:12, fontWeight:500, letterSpacing:'0.08em', color:'#888888', textTransform:'uppercase', alignSelf:'start', paddingTop:4 }}>
                <LangText zh="微信" en="WECHAT" />
              </span>
              {/* QR 左，文字右，顶部对齐 */}
              <div className="wechat-flex-row" style={{ display:'flex', alignItems:'flex-start', gap:32 }}>
                <div className="wechat-qr-container" style={{ flexShrink:0, width:180, height:180, padding:13, background:'#FFFFFF', border:'1px solid var(--line)', borderRadius:12, boxShadow:'0 2px 8px rgba(0,0,0,0.04)', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 0.4s ease, box-shadow 0.4s ease' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/wechat-qr-huangsanhong.png" alt="黄三红微信二维码" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontSize:22, fontWeight:500, color:'#0A0A0A', lineHeight:1.3, letterSpacing: lang==='en' ? '-0.005em' : '0.02em' }}>
                    <LangText zh="扫码添加微信" en="Scan to Add WeChat" />
                  </div>
                  <div style={{ fontSize:14, color:'var(--ink-soft)', lineHeight:1.5 }}>
                    <LangText zh="黄三红 · 怡途五金" en="Huang Sanhong · YITU Hardware" />
                  </div>
                  <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:4 }}>
                    <small style={{ display:'block', fontFamily:"'JetBrains Mono', monospace", fontSize:12, fontWeight:400, letterSpacing:'0.04em', color:'#888888', lineHeight:1.7 }}>
                      <LangText zh="用于精密加工业务沟通 · 图纸报价 · 工艺咨询" en="Machining inquiries · Drawing quotes · Process consultation" />
                    </small>
                    <small style={{ display:'block', fontFamily:"'JetBrains Mono', monospace", fontSize:12, fontWeight:400, letterSpacing:'0.04em', color:'#B5B7B0', lineHeight:1.7 }}>
                      <LangText zh="工作时间内通常 2 小时内回复" en="Usually responds within 2 hours during business hours" />
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右：表单 */}
          <div className="reveal d-200">
            <div className="contact-form-card" style={{ background:'var(--bg)', border:'1px solid #E5E2DA', padding:'56px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingBottom:20, marginBottom:36, borderBottom:'1.5px solid #1A1A1A' }}>
                  <h4 style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Serif SC', serif", fontWeight:500, fontSize:'clamp(24px, 2.4vw, 32px)', margin:0, color:'#0A0A0A', letterSpacing: lang==='en' ? '-0.01em' : '0.02em' }}>
                    <LangText zh="获取报价" en="Request a Quote" />
                  </h4>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px 32px' }}>
                    {fieldsZh.map(f => (
                      <div key={f.id} style={{ display:'flex', flexDirection:'column' }}>
                        <label htmlFor={`contact-${f.id}`} style={labelStyle}>
                          {lang === 'zh' ? f.labelZh : f.labelEn}
                          {f.req && <span style={{ fontSize:14, fontWeight:600, color:'#D9362C', marginLeft:4 }}>*</span>}
                        </label>
                        <input
                          id={`contact-${f.id}`}
                          type={f.type || 'text'}
                          name={f.id}
                          required={f.req}
                          placeholder={lang === 'zh' ? f.placeholderZh : f.placeholderEn}
                          className="yitu-input"
                          style={inputStyle}
                        />
                      </div>
                    ))}

                    <div style={{ gridColumn:'1 / -1', display:'flex', flexDirection:'column' }}>
                      <label htmlFor="contact-description" style={labelStyle}>
                        <LangText zh="需求描述" en="Description" />
                      </label>
                      <textarea
                        id="contact-description"
                        name="description"
                        rows={4}
                        placeholder={lang === 'zh' ? '请描述您的加工需求、精度要求或其他说明' : 'Describe your machining requirements, tolerances, or other specifications'}
                        className="yitu-input"
                        style={{ ...inputStyle, resize:'none' }}
                      />
                    </div>

                    {/* 图纸附件说明 */}
                    <div style={{ gridColumn:'1 / -1', marginTop:4 }}>
                      <label style={labelStyle}>
                        <LangText zh="图纸附件" en="Drawing Attachments" />
                      </label>
                      <div style={{ border:'1.5px dashed #C5C2BA', padding:'32px 28px', display:'flex', alignItems:'center', gap:24, transition:'border-color .3s, background .3s' }} className="drop-zone">
                        <div style={{ width:44, height:44, border:'1.5px solid #C5C2BA', display:'flex', alignItems:'center', justifyContent:'center', color:'#888888', flexShrink:0 }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M10 2v12M6 6l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 16h14" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily: lang==='en' ? "'Fraunces', serif" : "'Noto Sans SC', sans-serif", fontWeight:500, fontSize:16, color:'#1A1A1A', marginBottom:6 }}>
                            <LangText zh="请在打开的邮件中添加图纸附件" en="Attach drawings in the email draft" />
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:12, letterSpacing:'0.1em', color:'#888888', textTransform:'uppercase' }}>
                            PDF · STP · STEP · DXF · CAD
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="contact-actions" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:40, paddingTop:28, borderTop:'1px solid var(--line)', gap:24 }}>
                    <p className="contact-actions-note" style={{ fontSize:13, fontWeight:400, color:'#888888', lineHeight:1.7, maxWidth:340, margin:0 }}>
                      <LangText zh="点击后将打开您的本地邮箱，并自动填入询价内容；请在邮件发送前添加图纸附件。" en="This opens your email app with the inquiry filled in. Please attach drawings before sending." />
                    </p>
                    <button
                      type="submit"
                      style={{ display:'inline-flex', alignItems:'center', gap:14, padding:'18px 32px', background:'transparent', border:'1.5px solid #1A1A1A', color:'#1A1A1A', fontFamily:"'JetBrains Mono', monospace", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', transition:'all .3s ease', whiteSpace:'nowrap', borderRadius:0 }}
                      className="submit-btn"
                    >
                      <LangText zh="打开邮箱发送询价" en="Open Email" />
                      <span style={{ transition:'transform .3s' }} className="submit-arrow">→</span>
                    </button>
                  </div>
                  {mailPrepared && (
                    <p style={{ margin:'18px 0 0', fontFamily:"'Noto Sans SC', sans-serif", fontSize:13, lineHeight:1.7, color:'#22A06B' }}>
                      <LangText
                        zh={`已尝试打开邮箱。若没有弹出邮件窗口，请直接复制邮箱：${CONTACT_EMAIL}`}
                        en={`Email draft requested. If no mail window opened, please email us directly at ${CONTACT_EMAIL}.`}
                      />
                    </p>
                  )}
                </form>
              </div>
          </div>
        </div>
      </div>
      <style>{`
        .yitu-input:focus { border-bottom: 2px solid #1A1A1A !important; }
        .yitu-input::placeholder { color: #B5B2AA; font-weight: 400; }
        .submit-btn:hover { background: #1A1A1A !important; color: var(--bg) !important; }
        .submit-btn:hover .submit-arrow { transform: translateX(6px); }
        .drop-zone:hover { border-color: #888888 !important; background: rgba(0,0,0,.015) !important; }
        .wechat-qr-container:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.08) !important; }
        @media (max-width:1024px) {
          .wechat-qr-container { width: 150px !important; height: 150px !important; padding: 10px !important; }
        }
        @media (max-width:980px) {
          #contact { padding: 80px 0 60px; }
          #contact > div > div:last-child { grid-template-columns: 1fr !important; gap: 60px !important; }
          #contact [style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
          .contact-form-card { padding: 40px !important; }
          .wechat-qr-container { width: 180px !important; height: 180px !important; }
        }
        @media (max-width:768px) {
          #contact { padding: 60px 0 40px !important; }
          #contact > div { padding: 0 20px !important; }
          .contact-lede { margin: -40px 0 56px !important; font-size: 16px !important; }
          .contact-form-card { padding: 28px 20px !important; }
          #contact input, #contact textarea { font-size: 16px !important; }
          .contact-actions { flex-direction: column !important; align-items: stretch !important; }
          .contact-actions-note { max-width: 100% !important; }
          .submit-btn { width: 100% !important; justify-content: center !important; padding: 16px 24px !important; }
          /* 联系信息行：label 和内容各占一行 */
          #contact [style*="grid-template-columns: 80px 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 4px !important;
            padding: 28px 0 !important;
          }
        }
        @media (max-width:480px) {
          /* 微信 QR 区域：竖向堆叠 */
          .wechat-flex-row { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .wechat-qr-container { width: 140px !important; height: 140px !important; }
        }
      `}</style>
    </section>
  )
}
