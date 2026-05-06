'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const experiences = [
  {
    id: 1,
    company: '广州钛动科技股份有限公司 (Tec-Do)',
    position: 'UI/UX设计',
    period: '2025.11 – 2026.03',
    color: '#FF9CCC',
    tags: ['移动端增长', '全球化交互', '迭代后产品位列美国 iOS 生活榜 Top 3'],
    details: [
      '与产品、策划开发共同推进设计项目。主导海外IAA游戏聚合平台PlayRewards APP的UI/UX改版设计',
      '取得成果：迭代后APP冲上美国生活时尚板块免费榜 Top3，巴西生活时尚板块免费榜No.6，加拿大生活时尚板块免费榜No.12，以及进入人气飙升榜单',
      '重构关键提现流程信息架构，减少40%点击成本和降低了15%的客询率',
      '探索AI UX工作流，在资源有限情况下探索更优方案，将留存率和用户转化率提高4-6%',
      '通过竞品调研和用户调研，为不同国家设计、适配不同app上架图，将下载转化率提升15-40%不等'
    ]
  },
  {
    id: 2,
    company: '广州欧莱雅百库网络科技有限公司',
    position: 'UI 设计，平面设计',
    period: '2025.07 – 2025.10',
    color: '#9CDEFF',
    tags: ['高奢品牌视觉', '视觉维护', '体验优化'],
    details: [
      '负责旗下高奢品牌赫莲娜品牌形象的日常维护与延展设计',
      '涵盖各大平台的推广素材与活动视觉',
      '参与赫莲娜品牌之家部分页面的UI设计，在优化用户体验与交互流程的同时，确保了高品质的视觉呈现'
    ]
  },
  {
    id: 3,
    company: '大理喜洲暖暖汽车青旅',
    position: '平面设计',
    period: '2024.11 – 2025.02',
    color: '#FFED9C',
    tags: ['品牌传播', '视觉叙事', '社媒策略'],
    details: [
      '负责青旅各类线上线下活动的视觉设计工作，包括活动海报、社交媒体宣传图、展示物料等，提升整体品牌形象的一致性与吸引力',
      '实习期间共完成15+份宣传物料设计，覆盖2场大型活动',
      '视觉内容多次被用户自发分享，抖音单视频点赞10w+，增强品牌曝光与用户粘性'
    ]
  }
]

export default function Experience() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <section id="experience" className="py-20 px-8" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <motion.h2
        className="text-4xl md:text-6xl lg:text-[96px] font-bold text-[#2A2235] mb-8 md:mb-12 text-center"
        style={{ fontFamily: 'Georgia, serif', lineHeight: '1.2' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        EXPERIENCE
      </motion.h2>

      <div className="max-w-5xl mx-auto space-y-6">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="rounded-[30px] overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={{ height: expandedId === exp.id ? 'auto' : '220px' }}
          >
            <motion.div
              className="p-6 md:p-8 cursor-pointer transition-all duration-300 relative flex flex-col"
              style={{ backgroundColor: exp.color, minHeight: '220px' }}
              onClick={() => setExpandedId(exp.id === expandedId ? null : exp.id)}
              whileHover={{ scale: 1.02, backgroundColor: '#FFFFFF' }}
              transition={{ duration: 0.1 }}
            >
              {/* 展开图标 - 右上角 */}
              <img
                src="/images/Frame 18.png"
                alt="expand"
                style={{ position: 'absolute', right: '32px', top: '32px', width: '32px', height: '32px' }}
              />

              {/* 公司名称 */}
              <h3
                className="text-xl md:text-2xl lg:text-[30px] font-bold text-[#2A2235]"
                style={{ fontFamily: 'PingFang SC, sans-serif', fontWeight: 'bold', lineHeight: '1.2' }}
              >
                {exp.company}
              </h3>

              {/* 实习时间 */}
              <p
                className="text-base md:text-lg lg:text-[20px] text-[#6B5B7A] mt-2"
                style={{ fontFamily: 'PingFang SC, sans-serif', lineHeight: '28px' }}
              >
                {exp.period}
              </p>

              {/* 底部区域：标签 + 职位标签 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-auto" style={{ marginTop: '28px' }}>
                {/* 左侧三个标签 */}
                <div className="flex flex-wrap gap-2 md:gap-[15px]">
                  {exp.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full text-sm md:text-base lg:text-[18px] border border-black text-black"
                      style={{
                        fontFamily: 'PingFang SC, sans-serif',
                        padding: '9px 16px',
                        lineHeight: '28px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 右侧：职位标签 - 白底 */}
                <span
                  className="rounded-full text-sm md:text-base lg:text-[18px] text-[#2A2235] bg-white"
                  style={{
                    fontFamily: 'PingFang SC, sans-serif',
                    padding: '8px 24px',
                    lineHeight: '28px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {exp.position}
                </span>
              </div>
            </motion.div>

            {/* 展开内容 */}
            <AnimatePresence>
              {expandedId === exp.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6"
                  style={{ padding: '32px' }}
                >
                  <ul className="list-disc pl-6 space-y-3">
                    {exp.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-[#6B5B7A]"
                        style={{ fontFamily: 'PingFang SC, sans-serif', fontSize: '16px', lineHeight: '28px' }}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
