'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Category = 'ALL' | 'UI/UX DESIGN' | 'PRODUCT DESIGN' | 'GRAPHIC DESIGN'

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  tagColors: string[]
  image: string
  folder: string  // 项目图片文件夹
  imageCount: number  // 图片数量
  extensions?: string[]  // 每个图片的扩展名，如 ['jpg', 'png', 'jpg', ...]
}

const projects: Project[] = [
  {
    id: 1,
    title: 'PLAYREWARDS',
    description: 'PlayRewards 是一款深耕美国市场的 IAA（广告变现）游戏聚合激励平台。用户通过"玩游戏做任务获取金币，金币兑换成现金进行提现"的机制，连接用户、开发者与广告主，构建了一套高效的流量分发与商业变现闭环。',
    tags: ['UI/UX DESIGN', 'IP DESIGN'],
    tagColors: ['#3E076E', '#3E076E'],
    image: '/images/PLAYREWARDS.png',
    folder: '/images/projects/playrewards',
    imageCount: 18,
    extensions: Array(18).fill('webp')
  },
  {
    id: 2,
    title: '窝友自驾',
    description: '窝友自驾APP是专为自驾旅行与房车出行打造的移动服务平台，为用户提供房车租赁、搭子结伴、营地预订、路线规划等完整出行服务流程；并提供最新的房车活动、营地资讯与自驾主题推荐。',
    tags: ['UI/UX DESIGN'],
    tagColors: ['#55C2FF'],
    image: '/images/woyou-drive.png',
    folder: '/images/projects/woyou-drive',
    imageCount: 15,
    extensions: Array(15).fill('webp')
  },
  {
    id: 3,
    title: 'ONEAID',
    description: 'Oneaid 是一款针对单肢活动受限群体（如残疾人士、暂时性手部受伤者）设计的包容性医疗产品。它针对传统创可贴在开启、定位与粘贴过程中高度依赖"双手协同"的交互痛点，提出了创新的解决方案。',
    tags: ['PRODUCT DESIGN'],
    tagColors: ['#FF8910'],
    image: '/images/ONEAID.png'
  },
  {
    id: 4,
    title: 'X-WARNING',
    description: 'X-WARNING 是一款创新的电力设备漏电警示系统，旨在通过全方位、多感官的提醒方式，预防公共区域的触电事故 。该设计针对电力设施老化及极端天气（如台风、暴雨）导致的漏电隐患，解决了漏电"不可见"带来的安全挑战 。',
    tags: ['PRODUCT DESIGN'],
    tagColors: ['#D63717'],
    image: '/images/projects/x-warning/1.webp',
    folder: '/images/projects/x-warning',
    imageCount: 5,
    extensions: ['webp', 'webp', 'webp', 'webp', 'webp']
  },
  {
    id: 5,
    title: '杏花栖品牌设计',
    description: '踏入杏花村，追寻千年文脉的诗意栖居。这里，是杜牧笔下的"杏花村"，是苏轼流连的江南胜地。每一片杏花，每一寸土地，都承载着古代文人的情感与智慧。在这里，古诗词中的意象得以再现，历史与自然在此交融。',
    tags: ['Graphic Design'],
    tagColors: ['#EA517F'],
    image: '/images/xinghuaqi-brand.png',
    folder: '/images/projects/xinghuaqi',
    imageCount: 12,
    extensions: ['jpg', 'jpg', 'jpg', 'png', 'png', 'webp', 'jpg', 'png', 'png', 'webp', 'webp', 'webp']
  },
  {
    id: 6,
    title: '暖暖杀猪饭视觉设计',
    description: '本设计以"回家吃饭"为核心，采用治愈系插画还原大理暖暖青旅的杀猪饭盛事。画面巧妙融合房车、苍山与趣味萌宠，将乡土烟火转化为温情叙事，生动传递"有暖暖就有家"的品牌归属感。',
    tags: ['Graphic Design'],
    tagColors: ['#568374'],
    image: '/images/warm-meal-design.png',
    folder: '/images/projects/warm-meal',
    imageCount: 5,
    extensions: ['webp', 'jpg', 'webp', 'webp', 'webp']
  }
]

const categories: Category[] = ['ALL', 'UI/UX DESIGN', 'PRODUCT DESIGN', 'GRAPHIC DESIGN']

const matchCategory = (projectTags: string[], filter: Category): boolean => {
  if (filter === 'ALL') return true
  const tags = projectTags.map(t => t.toLowerCase())
  if (filter === 'GRAPHIC DESIGN') return tags.some(t => t.includes('graphic'))
  if (filter === 'PRODUCT DESIGN') return tags.some(t => t.includes('product'))
  if (filter === 'UI/UX DESIGN') return tags.some(t => t.includes('ui/ux') || t.includes('ui'))
  return false
}

// Project Card with hover state management
function ProjectCard({ project, isHovered, onMouseEnter, onMouseLeave, onClick }: {
  project: Project
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Card Container - Fixed height */}
      <div
        className="p-6 rounded-[32px] flex flex-col relative group"
        style={{
          backgroundColor: '#EBE9E4',
          height: '100%',
          minHeight: '520px'
        }}
      >
        {/* Image container with overflow hidden for zoom effect */}
        <div
          className="relative overflow-hidden rounded-[24px] flex-shrink-0"
          style={{ backgroundColor: '#EBE9E4' }}
        >
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-auto"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{
              duration: 0.88,
              ease: [0.45, 0, 0.4, 1],
            }}
            style={{
              aspectRatio: '16/10',
              objectFit: 'cover',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          />
        </div>
        {/* Content - Fixed height to align */}
        <div className="mt-6 flex flex-col flex-grow relative">
          {/* Dynamic Action Button - card bottom right */}
          <motion.div
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: project.tagColors[0],
              opacity: 0,
              filter: 'blur(10px)',
              willChange: 'transform, opacity, filter',
            }}
            animate={isHovered ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { y: 20 }}
            transition={{
              duration: 0.88,
              ease: [0.45, 0, 0.4, 1],
            }}
            whileHover={{ scale: 1.5 }}
          >
            <span className="text-white text-[18px]">→</span>
          </motion.div>
          <h3
            className="text-[28px] font-bold text-[#2A2235]"
            style={{ fontFamily: 'Georgia, serif', lineHeight: '36px' }}
          >
            {project.title}
          </h3>
          <p
            className="text-[14px] text-[#6B5B7A] mt-4 flex-grow"
            style={{
              fontFamily: 'PingFang SC, sans-serif',
              lineHeight: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {project.description}
          </p>
          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-4 py-2 rounded-full text-[14px] font-medium"
                style={{
                  fontFamily: 'PingFang SC, sans-serif',
                  backgroundColor: project.tagColors[tagIndex] || '#6B5B7A',
                  color: '#FFFFFF'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Lazy loading image component with blur placeholder
function LazyImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={imgRef}
      className="w-full max-w-[1200px] relative overflow-hidden"
      style={{ minHeight: '200px' }}
    >
      {/* Blur placeholder background */}
      <div
        className="absolute inset-0 bg-gray-800 transition-opacity duration-500"
        style={{
          opacity: isLoaded ? 0 : 1,
          filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
        }}
      />
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto object-contain relative z-10 transition-opacity duration-500"
          style={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}

// Project Detail Page with vertical scroll gallery
function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  // Get the starting number based on project
  const getStartNumber = (): number => {
    if (project.title === 'PLAYREWARDS') return 3
    if (project.title === '窝友自驾') return 21
    return 1
  }

  // Build image list using extensions array if available
  const images: string[] = []
  for (let i = 0; i < project.imageCount; i++) {
    const num = getStartNumber() + i
    const ext = project.extensions?.[i] || 'jpg'
    images.push(`${project.folder}/${num}.${ext}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="fixed top-8 left-8 px-6 py-3 rounded-full z-50 flex items-center gap-2"
        style={{
          fontFamily: 'Georgia, serif',
          backgroundColor: '#EBE9E4',
          color: '#2A2235'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>←</span> Back
      </motion.button>

      {/* Project title */}
      <h1
        className="text-[72px] font-bold text-white text-center pt-16 pb-12"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {project.title}
      </h1>

      {/* Image gallery - seamless vertical scroll */}
      <div className="flex flex-col items-center gap-0 pb-16">
        {images.map((src, index) => (
          <LazyImage
            key={index}
            src={src}
            alt={`${project.title} - ${index + 1}`}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function Products({ selectedProject, onSelectProject }: {
  selectedProject?: Project | null
  onSelectProject?: (project: Project | null) => void
}) {
  const [activeCategory, setActiveCategory] = useState<Category>('ALL')
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null)

  const displayProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(p => matchCategory(p.tags, activeCategory))

  const handleMouseEnter = useCallback((id: number) => {
    setHoveredProjectId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredProjectId(null)
  }, [])

  const handleProjectClick = (project: Project) => {
    onSelectProject?.(project)
  }

  const handleBack = () => {
    onSelectProject?.(null)
  }

  return (
    <>
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>

      <section id="works" className="py-20 px-8" style={{ paddingTop: '80px', paddingBottom: '128px' }}>
        <motion.h2
          className="text-[96px] font-bold text-[#2A2235] mb-12 text-center"
          style={{ fontFamily: 'Georgia, serif', lineHeight: '96px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          PRODUCT
        </motion.h2>

        {/* Filter Tabs - Pill shaped */}
        <div className="flex justify-center gap-2 mb-16" style={{ marginBottom: '80px' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-6 py-3 rounded-full transition-all duration-300"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                backgroundColor: activeCategory === category ? '#000000' : '#EBE9E4',
                color: activeCategory === category ? '#FFFFFF' : '#6B5B7A',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid - 2x3 with Layout Animation */}
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            className="grid grid-cols-2 gap-12"
            layout
            transition={{
              layout: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }}
          >
            <AnimatePresence mode="popLayout">
              {displayProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isHovered={hoveredProjectId === project.id}
                  onMouseEnter={() => handleMouseEnter(project.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}
