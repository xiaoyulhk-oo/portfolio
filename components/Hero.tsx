'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

function TypewriterText({ text, delay = 0, speed = 50 }: {
  text: string
  delay?: number
  speed?: number
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    hasStartedRef.current = false
    setDisplayedText('')
    setIsTyping(false)

    let timer: NodeJS.Timeout | null = null
    const startTimeout = setTimeout(() => {
      hasStartedRef.current = true
      setIsTyping(true)
      let index = 0
      timer = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index))
          index++
        } else {
          if (timer) clearInterval(timer)
          setIsTyping(false)
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      if (timer) clearInterval(timer)
      hasStartedRef.current = false
    }
  }, [text, delay, speed])

  return (
    <span>
      {displayedText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  )
}

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-start" style={{ paddingTop: '110px', minHeight: '600px' }}>
      {/* 小鱼 PNG - 带摇摆动画 */}
      <motion.div
        className="mb-3"
        animate={{
          rotate: [0, 8, -8, 6, -6, 4, -4, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "easeInOut",
        }}
        style={{ width: '100px', height: '65px' }}
      >
        <img
          src="/images/fish-decor.png"
          alt="logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </motion.div>

      {/* LIHUANKAI 姓名 */}
      <motion.h1
        className="text-[72px] font-bold text-[#2A2235] cursor-pointer"
        style={{ fontFamily: 'Georgia, serif', lineHeight: '72px', letterSpacing: 'normal', marginBottom: '12px' }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      >
        LIHUANKAI
      </motion.h1>

      {/* 标签 */}
      <div className="flex gap-5" style={{ marginBottom: '14px' }}>
        <motion.span
          className="rounded-full border-2 cursor-pointer flex items-center justify-center"
          style={{
            borderColor: '#980F6A',
            color: '#980F6A',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            width: '320px',
            height: '46px',
            fontSize: '22px',
            padding: '0 24px',
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        >
          Experience Design
        </motion.span>
        <motion.span
          className="rounded-full border-2 border-black text-black cursor-pointer flex items-center justify-center"
          style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            width: '300px',
            height: '46px',
            fontSize: '22px',
            padding: '0 24px',
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        >
          Fervent Creator
        </motion.span>
      </div>

      {/* 个人介绍 - 打字机效果 */}
      <div className="text-center text-[#6B5B7A] leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', marginTop: '20px' }}>
        <p style={{ lineHeight: '26px', marginBottom: '0' }}>
          <TypewriterText text="HI,我是李焕楷，一名在视觉感官与功能逻辑之间寻找平衡的设计师。" delay={500} speed={40} />
        </p>
        <p className="whitespace-nowrap" style={{ lineHeight: '26px', marginTop: '0' }}>
          <TypewriterText text="我推崇乔布斯对设计的定义：'Design is not just what it looks like and feels like. Design is how it works.'" delay={2000} speed={40} />
        </p>
        <p style={{ lineHeight: '26px', marginTop: '0', minHeight: '26px' }}>
          <TypewriterText text="我致力于用一丝不苟的设计语言，创作出更多美好，有意义的产品。" delay={5500} speed={40} />
        </p>
      </div>
    </section>
  )
}
