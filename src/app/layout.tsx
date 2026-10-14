import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://yituhardware.com'),
  title: '怡途五金 · 精密金属零件加工 | YITU Hardware',
  description:
    '东莞怡途五金，专注精密CNC金属零件加工，服务新能源汽车、医疗器械、工业机器人行业，提供可靠的精密零件解决方案。',
  keywords: ['精密零件', 'CNC加工', '东莞五金', '医疗零件', '新能源零件', 'precision machining'],
  openGraph: {
    title: 'YITU Hardware · Precision Metal Components',
    description:
      'Precision CNC machining for NEV, medical, and robotics industries. Reliable custom metal components. Dongguan, China.',
    url: 'https://yituhardware.com',
    siteName: '怡途五金 YITU Hardware',
    type: 'website',
    locale: 'zh_CN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: '怡途五金 YITU Hardware' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '怡途五金 · 精密金属零件加工 | YITU Hardware',
    description: '东莞怡途五金，专注精密CNC金属零件加工，服务新能源汽车、医疗器械、工业机器人行业，提供可靠的精密零件解决方案。',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/logo-icon.png', type: 'image/png' }],
    shortcut: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body data-nav-theme="dark">{children}</body>
    </html>
  )
}
