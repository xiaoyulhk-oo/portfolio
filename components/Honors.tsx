'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const honors = [
  {
    year: '2023',
    name: 'Red Dot Design Award',
    description: '红点奖概念设计入围',
    image: '/images/reddot-award.jpg',
    tag: '/images/fish-tags/Group 3.png'
  },
  {
    year: '2023',
    name: 'European Product Design Award',
    description: '欧洲产品设计奖',
    image: '/images/euporean-award.jpg',
    tag: '/images/fish-tags/Group 3-1.png'
  },
  {
    year: '2023',
    name: 'NCDA Awards',
    description: '广东赛区一等奖',
    image: '/images/ncda-award.jpg',
    tag: '/images/fish-tags/Group 3-6.png'
  },
  {
    year: '2023',
    name: 'Britain International Creative Competition',
    description: 'BICC中英国际创意大赛 铜奖',
    image: '/images/britain-competition.jpg',
    tag: '/images/fish-tags/Group 3-7.png'
  },
  {
    year: '2024',
    name: 'GCROSS Creative Award',
    description: '金奖',
    image: '/images/gcross-award.jpg',
    tag: '/images/fish-tags/Group 3-2.png'
  },
  {
    year: '2024',
    name: 'Hong Kong Contemporary Design Awards',
    description: '香港新锐当代设计奖-铜奖',
    image: '/images/hongkong-award.jpg',
    tag: '/images/fish-tags/Group 3-5.png'
  },
  {
    year: '2024',
    name: 'CADA Japan Concept Art Design Award',
    description: '铜奖',
    image: '/images/cada-award.jpg',
    tag: '/images/fish-tags/Group 3-4.png'
  },
  {
    year: '2025',
    name: 'BMW × 同济学生创新挑战营',
    description: '决赛第二名',
    image: '/images/bmw-challenge.jpg',
    tag: '/images/fish-tags/Group 3-3.png'
  }
]

export default function Honors() {
  const [activePopup, setActivePopup] = useState<{ name: string; x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (honorName: string, e: React.MouseEvent) => {
    setActivePopup({ name: honorName, x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setActivePopup(null)
  }

  const currentHonor = activePopup ? honors.find(h => h.name === activePopup.name) : null

  return (
    <section
      id="honors"
      className="py-20 px-8"
      style={{ paddingTop: '80px', paddingBottom: '128px' }}
    >
      <motion.h2
        className="text-4xl md:text-6xl lg:text-[96px] font-bold text-[#2A2235] mb-8 md:mb-16 text-center"
        style={{ fontFamily: 'Georgia, serif', lineHeight: '1.2' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        HONORS
      </motion.h2>

      <div className="max-w-4xl mx-auto space-y-8" ref={containerRef}>
        {honors.map((honor, index) => (
          <motion.div
            key={honor.name}
            className="flex items-start cursor-pointer relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={(e) => handleMouseEnter(honor.name, e)}
            onMouseLeave={handleMouseLeave}
          >
            {/* 时间 - 左对齐 */}
            <span
              className="text-[20px] text-[#6B5B7A] shrink-0"
              style={{ fontFamily: 'PingFang SC, sans-serif', width: '200px', lineHeight: '28px' }}
            >
              {honor.year}
            </span>

            {/* 小鱼标签 */}
            <img
              src={honor.tag}
              alt="tag"
              style={{ width: '40px', height: '25px', objectFit: 'cover', marginLeft: '383px', marginTop: '3px' }}
            />

            {/* 奖项名称和描述 - 左对齐，不换行 */}
            <div style={{ marginLeft: '16px' }}>
              <h3
                className="text-[24px] text-black whitespace-nowrap"
                style={{ fontFamily: 'Georgia, serif', lineHeight: '32px' }}
              >
                {honor.name}
              </h3>
              <p
                className="text-[20px] text-[#6B5B7A] whitespace-nowrap"
                style={{ fontFamily: 'PingFang SC, sans-serif', lineHeight: '28px', marginTop: '4px' }}
              >
                {honor.description}
              </p>
            </div>
          </motion.div>
        ))}

        {/* 证书弹窗 - 独立触发，每个奖项都有自己的动画状态 */}
        <AnimatePresence>
          {activePopup && currentHonor && (
            <motion.div
              className="fixed bg-white p-3 shadow-xl rounded-lg z-50"
              style={{
                left: activePopup.x + 20,
                top: activePopup.y - 100,
                width: '320px',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1] // back-out ease
              }}
            >
              <img
                src={currentHonor.image}
                alt={currentHonor.name}
                className="w-full h-auto rounded"
                style={{ width: '320px', height: 'auto' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}