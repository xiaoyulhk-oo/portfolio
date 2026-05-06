"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

interface TimelineItemProps {
  title: string;
  org: string;
  period: string;
  details: string[];
  type: "award" | "work";
  polaroidImage?: string;
}

function TimelineItem({ title, org, period, details, type, polaroidImage }: TimelineItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const px = useTransform(mouseX, [-150, 150], [-12, 12]);
  const py = useTransform(mouseY, [-100, 100], [-8, 8]);
  const rotation = useTransform(mouseX, [-150, 150], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="flex items-start gap-6 md:gap-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-24 md:w-32 flex-shrink-0 pt-1">
          <span className="font-sans text-xs md:text-sm tracking-widest text-[var(--text-secondary)] opacity-60">{period}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: type === "award" ? "var(--accent)" : "var(--text-secondary)" }}
            />
            <h3 className="font-serif text-xl md:text-2xl font-light text-[var(--text-primary)]">{title}</h3>
          </div>
          <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] mb-3">{org}</p>
          {details.map((d, i) => (
            <p key={i} className="font-sans text-sm text-[var(--text-secondary)] opacity-80 leading-relaxed mb-1">{d}</p>
          ))}
        </div>
      </motion.div>

      {/* Polaroid effect for awards */}
      <AnimatePresence>
        {hovered && type === "award" && polaroidImage && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: "50%",
              top: "50%",
              x: px,
              y: py,
              rotate: rotation,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="bg-white p-3 pb-10 shadow-2xl"
              style={{
                width: 220,
                transform: "translate(-50%, -80%)",
                boxShadow: "0 20px 60px rgba(42,34,53,0.25), 0 8px 20px rgba(42,34,53,0.15)",
              }}
            >
              <div className="bg-[var(--border)] w-full h-48 mb-3 flex items-center justify-center">
                <span className="font-sans text-xs text-[var(--text-secondary)] opacity-50">Certificate</span>
              </div>
              <p className="font-serif text-xs text-center text-[var(--text-primary)]">{title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Timeline() {
  const awards = [
    {
      title: "Red Dot Design Award",
      org: "红点奖概念设计入围",
      period: "2023",
      details: [],
      type: "award" as const,
    },
    {
      title: "European Product Design Award",
      org: "欧洲产品设计奖",
      period: "2023",
      details: [],
      type: "award" as const,
    },
    {
      title: "GCROSS创意奖",
      org: "金奖",
      period: "2024",
      details: [],
      type: "award" as const,
    },
    {
      title: "BMW × 同济学生创新挑战营",
      org: "决赛第二名",
      period: "2025",
      details: [],
      type: "award" as const,
    },
  ];

  const works = [
    {
      title: "UI设计实习生",
      org: "广州钛动科技股份有限公司 (Tec-Do) | 2025.11 – 2026.03",
      period: "2025",
      details: [
        "核心项目：全球化移动应用 PlayRewards（优化迭代后位列美国iOS生活方式榜单 No.3）",
        "全链路设计执行：负责从概念构思到最终视觉实现的全流程。深度参与产品逻辑梳理，与产品团队紧密协作，确保设计方案精准对标北美用户需求与商业增长目标。",
        "功能逻辑与交互优化：践行「设计不仅是视觉，更是运作逻辑」的理念。通过分析业务需求，重构复杂页面的交互链路，提供多套优化方案进行灰度测试，显著提升了产品的易用性与用户留存。",
        "设计规范与高标准交付：快速掌握并完善 UI/交互设计规范，负责高保真原型、切图及标注交付。严格执行页面走查工作，确保视觉还原度与线上体验的高度统一。",
      ],
      type: "work" as const,
    },
    {
      title: "平面设计",
      org: "广州欧莱雅百库网络科技有限公司 | 2025.07 – 2025.10",
      period: "2025",
      details: [
        "负责旗下高奢品牌赫莲娜品牌形象的日常维护与延展设计。",
        "涵盖各大平台的推广素材与活动视觉以及HR赫莲娜品牌之家小程序的部分页面设计。",
        "在优化用户体验与交互流程的同时，确保了高品质的视觉呈现。",
      ],
      type: "work" as const,
    },
    {
      title: "平面设计",
      org: "大理喜洲暖暖汽车青旅 | 2024.11 – 2025.02",
      period: "2024",
      details: [
        "负责青旅各类线上线下活动的视觉设计工作，包括活动海报、社交媒体宣传图、展示物料等，提升整体品牌形象的一致性与吸引力。",
        "实习期间共完成15+份宣传物料设计，覆盖2场大型活动，视觉内容多次被用户自发分享，抖音单视频点赞10w+，增强品牌曝光与用户粘性。",
      ],
      type: "work" as const,
    },
  ];

  return (
    <section
      id="honors"
      className="px-8 md:px-16 py-32"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="font-serif text-4xl md:text-5xl font-light text-[var(--text-primary)] mb-16 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          履历与荣誉
        </motion.h2>

        {/* Awards */}
        <div className="mb-20">
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--text-secondary)] opacity-60 mb-10">Awards</h3>
          <div className="space-y-8">
            {awards.map((a, i) => (
              <TimelineItem key={i} {...a} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <motion.div
          className="w-full h-px bg-[var(--border)] mb-20"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Work Experience */}
        <div>
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--text-secondary)] opacity-60 mb-10">Experience</h3>
          <div className="space-y-12">
            {works.map((w, i) => (
              <TimelineItem key={i} {...w} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}