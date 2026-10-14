'use client'

import { useEffect, useRef } from 'react'

/**
 * 给 ref 容器内所有 .reveal 元素挂 IntersectionObserver，
 * 进入视口后加 .in 类触发 globals.css 里的入场动画。
 */
export function useReveal(rootMargin = '-60px') {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const els = Array.from(container.querySelectorAll<HTMLElement>('.reveal'))
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin, threshold: 0.12 }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootMargin])

  return ref
}
