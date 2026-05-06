"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Work {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
}

const works: Work[] = [
  {
    id: 1,
    title: "PlayRewards",
    category: "Product Design",
    year: "2025",
    description: "全球化移动应用，优化迭代后位列美国iOS生活方式榜单 No.3。全链路设计执行，深度参与产品逻辑梳理，重构复杂页面交互链路。",
    tags: ["UI Design", "Interaction", "iOS", "Mobile App"],
  },
  {
    id: 2,
    title: "赫莲娜品牌之家",
    category: "Web Design",
    year: "2025",
    description: "欧莱雅旗下高奢品牌小程序设计，负责品牌形象日常维护与延展，涵盖平台推广素材与活动视觉。",
    tags: ["Mini Program", "Brand Design", "Web"],
  },
  {
    id: 3,
    title: "暖暖汽车青旅",
    category: "Brand Design",
    year: "2024",
    description: "大理喜洲青旅品牌视觉系统，涵盖线上线下活动物料设计，完成15+份宣传物料，抖音单视频点赞10w+。",
    tags: ["Brand Identity", "Poster Design", "Social Media"],
  },
  {
    id: 4,
    title: "GCROSS创意奖视觉",
    category: "Award Visual",
    year: "2024",
    description: "GCROSS创意奖金奖获奖作品视觉延展设计。",
    tags: ["Award Design", "Visual Identity"],
  },
];

interface WorkCardProps {
  work: Work;
  onClick: () => void;
}

function WorkCard({ work, onClick }: WorkCardProps) {
  return (
    <motion.div
      layoutId={`work-card-${work.id}`}
      className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
      onClick={onClick}
      whileHover="hover"
      initial="rest"
    >
      {/* Placeholder image */}
      <div className="absolute inset-0 bg-[var(--border)] flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--text-secondary)]/10 flex items-center justify-center">
          <span className="font-serif text-2xl text-[var(--text-secondary)] opacity-30">{work.title.charAt(0)}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-[var(--card-dark)] flex flex-col items-center justify-center opacity-0"
        variants={{
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.h3
          className="font-serif text-2xl md:text-3xl text-white mb-2"
          variants={{
            hover: { opacity: 1, y: 0 },
          }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {work.title}
        </motion.h3>
        <motion.p
          className="font-sans text-sm text-white/60 tracking-widest uppercase"
          variants={{
            hover: { opacity: 1, y: 0 },
          }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {work.category} / {work.year}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

interface WorkDetailProps {
  work: Work;
  onClose: () => void;
}

function WorkDetail({ work, onClose }: WorkDetailProps) {
  return (
    <motion.div
      layoutId={`work-card-${work.id}`}
      className="fixed inset-0 z-50 flex flex-col overflow-auto"
      style={{ background: "var(--bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close button */}
      <motion.button
        className="fixed top-8 right-8 z-50 w-12 h-12 flex items-center justify-center"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>

      {/* Hero image */}
      <div className="w-full h-96 md:h-[60vh] bg-[var(--border)] flex items-center justify-center flex-shrink-0">
        <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--text-secondary)]/10 flex items-center justify-center">
          <span className="font-serif text-6xl text-[var(--text-secondary)] opacity-30">{work.title.charAt(0)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-16 flex-1">
        <motion.h2
          className="font-serif text-4xl md:text-5xl font-light text-[var(--text-primary)] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {work.title}
        </motion.h2>
        <motion.p
          className="font-sans text-sm tracking-widest uppercase text-[var(--text-secondary)] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {work.category} / {work.year}
        </motion.p>
        <motion.p
          className="font-sans text-lg leading-8 text-[var(--text-secondary)] mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {work.description}
        </motion.p>
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-xs tracking-widest uppercase px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Magnetic button */}
        <MagneticButton label="View Full Case" className="mt-16" />
      </div>
    </motion.div>
  );
}

function MagneticButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <motion.button
      className={`relative font-sans text-sm tracking-widest uppercase px-8 py-4 border border-[var(--text-primary)] text-[var(--text-primary)] ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ transform: "translateX(0)" }}
    >
      {label}
    </motion.button>
  );
}

export default function Works() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  return (
    <section
      id="works"
      className="px-8 md:px-16 py-32"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-serif text-4xl md:text-5xl font-light text-[var(--text-primary)] mb-16 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          作品陈列
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {works.map((work, i) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <WorkCard work={work} onClick={() => setSelectedWork(work)} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedWork && (
          <WorkDetail
            work={selectedWork}
            onClose={() => setSelectedWork(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}