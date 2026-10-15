'use client'

import { useLang } from '@/hooks/useLang'

interface SectionHeadProps {
  tag: string
  label: string
  titleZh: string
  titleEn: string
  ledeZh?: string
  ledeEn?: string
}

export function SectionHead({ tag, label, titleZh, titleEn, ledeZh, ledeEn }: SectionHeadProps) {
  const { lang } = useLang()

  return (
    <div
      className="section-head"
      style={{
        display: 'grid',
        gridTemplateColumns: ledeZh || ledeEn ? 'minmax(0,1fr) minmax(0,1.3fr)' : '1fr',
        gap: 80,
        marginBottom: 120,
        alignItems: 'end',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.28em',
              color: 'var(--ink-mute)',
            }}
          >
            ({tag})
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.22em',
              color: 'var(--ink-mute)',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(34px, 3.6vw, 52px)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            lineHeight: 1.15,
            fontFamily: lang === 'en' ? "'Fraunces', serif" : "'Noto Serif SC', serif",
          }}
          dangerouslySetInnerHTML={{ __html: lang === 'zh' ? titleZh : titleEn }}
        />
      </div>

      {(ledeZh || ledeEn) && (
        <div
          style={{
            fontSize: 15,
            lineHeight: 2,
            color: 'var(--ink-soft)',
            alignSelf: 'end',
          }}
        >
          {lang === 'zh' ? ledeZh : ledeEn}
        </div>
      )}
    </div>
  )
}
