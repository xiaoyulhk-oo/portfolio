'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

interface ContactCardProps {
  label: string
  value: string
  bgColor: string
  copyable?: boolean
}

function ContactCard({ label, value, bgColor, copyable = false }: ContactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const bubblePosRef = useRef({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Magnetic effect parameters
  const MAGNETIC_STRENGTH = 0.2
  const MAX_DISPLACEMENT = 15

  // Motion values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Springs for smooth lerp
  const springConfig = { stiffness: 120, damping: 18 }
  const springX = useSpring(rawX, springConfig)
  const springY = useSpring(rawY, springConfig)
  const rotateXSpring = useSpring(useMotionValue(0), springConfig)
  const rotateYSpring = useSpring(useMotionValue(0), springConfig)

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const dx = e.clientX - cx
    const dy = e.clientY - cy

    const distance = Math.sqrt(dx * dx + dy * dy)
    const magnitude = Math.min(distance * MAGNETIC_STRENGTH, MAX_DISPLACEMENT)

    const normalizedDx = distance > 0 ? dx / distance : 0
    const normalizedDy = distance > 0 ? dy / distance : 0

    rawX.set(normalizedDx * magnitude)
    rawY.set(normalizedDy * magnitude)
    rotateXSpring.set(-normalizedDy * magnitude * 0.5)
    rotateYSpring.set(normalizedDx * magnitude * 0.5)
  }, [isMobile, rawX, rawY, rotateXSpring, rotateYSpring])

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    rotateXSpring.set(0)
    rotateYSpring.set(0)
  }, [rawX, rawY, rotateXSpring, rotateYSpring])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!copyable) return

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      bubblePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value)
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setCopied(true)
    timeoutRef.current = setTimeout(() => setCopied(false), 1500)
  }, [copyable, value])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="contact-card relative cursor-pointer"
      style={{
        perspective: '600px',
        pointerEvents: 'auto',
        cursor: 'pointer'
      }}
    >
      <motion.div
        className="rounded-full px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: bgColor,
          minWidth: '420px',
          pointerEvents: 'auto',
          x: springX,
          y: springY,
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={isMobile ? {} : { scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{
          x: { type: 'spring', stiffness: 120, damping: 18 },
          y: { type: 'spring', stiffness: 120, damping: 18 },
          rotateX: { type: 'spring', stiffness: 120, damping: 18 },
          rotateY: { type: 'spring', stiffness: 120, damping: 18 },
          scale: { type: 'spring', stiffness: 300, damping: 20 },
        }}
      >
        <span
          className="text-black font-medium"
          style={{ fontFamily: 'Georgia, serif', fontSize: '18px' }}
        >
          {label}
        </span>
        <span
          className="text-black"
          style={{ fontFamily: 'PingFang SC, -apple-system, sans-serif', fontSize: '18px' }}
        >
          {value}
        </span>
      </motion.div>

      {/* Copy feedback bubble */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, scale: 0.5, y: -40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute pointer-events-none whitespace-nowrap"
            style={{
              left: bubblePosRef.current.x,
              top: bubblePosRef.current.y,
              transform: 'translate(-50%, -100%)',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontFamily: 'Georgia, serif',
            }}
          >
            Copied! ✅
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Particle Fountain Component - smooth emergence with 180° spray
interface Particle {
  id: number
  rotation: number
  rotationAmount: number // -20° to 20°
  scale: number
  velocityX: number
  velocityY: number
  image: string
}

const particleImages = [
  '/images/particles/Group 4.png',
  '/images/particles/Group 5.png',
  '/images/particles/Group 6.png',
  '/images/particles/Group 7.png',
  '/images/particles/Group 8.png',
  '/images/particles/Group 9.png',
  '/images/particles/Group 10.png',
  '/images/particles/Group 11.png',
  '/images/particles/Mask group.png',
  '/images/particles/0d5cebd32fc7a6f22f562fe830172ba2 2.png',
  '/images/particles/image 7.png',
  '/images/particles/4861d789ffd9ce6f979dbb2064966dd0 1.png',
  '/images/particles/5617636661a8c6287a5962b70d24483f 1.png',
  '/images/particles/8b527b3d399d5e7c3ad9abe1ce0d8961 1.png',
  '/images/particles/93611de4819f24952f00684b17f56746 1.png',
  '/images/particles/c5e1f99cca489de8a725e37a278d0d56 1.png',
  '/images/particles/22.png',
  '/images/particles/1048ad1c38c5163c2a4f29ca3e820f9c 1.png',
]

function ParticleFountain({ isActive, originX, originY }: {
  isActive: boolean
  originX: number
  originY: number
}) {
  const [particles, setParticles] = useState<Particle[]>([])
  const particleIdRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  // Clean up all timeouts using ref to avoid dependency issues
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      clearAllTimeouts()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Create particles with 180° spray from center
    const createParticle = () => {
      // 180° upward arc: from 180° (left) through 90° (up) to 0° (right)
      // In screen coords, negative Y is up
      const angle = (Math.random() * Math.PI)
      const power = (250 + Math.random() * 150) * 0.7 * 1.5 // 1.5x wider spread

      const newParticle: Particle = {
        id: particleIdRef.current++,
        rotation: Math.random() * 360,
        rotationAmount: -20 + Math.random() * 40, // -20° to 20° only
        scale: 0.8 + Math.random() * 0.4,
        velocityX: Math.cos(angle) * power,
        velocityY: -Math.sin(angle) * power, // Negate for upward in screen coords
        image: particleImages[Math.floor(Math.random() * particleImages.length)],
      }
      setParticles(prev => [...prev.slice(-11), newParticle]) // Max 11 particles
    }

    // Create initial batch with staggered timing - 17% faster
    for (let i = 0; i < 6; i++) {
      const timeoutId = setTimeout(() => createParticle(), i * 71 + Math.random() * 36) // 17% faster
      timeoutsRef.current.push(timeoutId)
    }

    // Continue creating particles - 17% faster
    intervalRef.current = setInterval(() => createParticle(), 119 + Math.random() * 59) // 17% faster

    return () => {
      clearAllTimeouts()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive])

  useEffect(() => {
    if (particles.length === 0) return

    // Clear existing timeouts before creating new ones
    clearAllTimeouts()

    const timeouts = particles.map((particle) => {
      const timeoutId = setTimeout(() => {
        setParticles(prev => prev.slice(1))
      }, 2960 + Math.random() * 360) // 17% faster
      return timeoutId
    })
    timeoutsRef.current = timeouts

    return () => clearAllTimeouts()
  }, [particles.length])

  if (!isActive) return null

  return (
    <>
      {particles.map((particle) => {
        const isSmallGroup = particle.image.includes('Group')
        const width = isSmallGroup ? 52 : 105
        const height = isSmallGroup ? 34 : 69
        return (
          <motion.img
            key={particle.id}
            src={particle.image}
            alt=""
            className="pointer-events-none fixed"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              objectFit: 'contain',
              left: originX - width / 2,
              top: originY - height / 2,
              zIndex: 9999,
            }}
            initial={{
              opacity: 0,
              scale: 0,
              rotate: particle.rotation,
            }}
            // Progressive emergence: 0-15% fade in, 0-30% grow to 1
            // 80-100% fade out and shrink
            animate={{
              x: particle.velocityX * 2,
              y: particle.velocityY * 2 + 200,
              rotate: particle.rotation + particle.rotationAmount,
              opacity: [0, 1, 1, 1, 0],
              scale: [0, particle.scale * 1.1, particle.scale, particle.scale * 0.5, 0],
            }}
            transition={{
              duration: 4.3, // 30% slower
              times: [0, 0.15, 0.3, 0.8, 1],
              ease: [0.3, 0.8, 0.6, 0.8],
            }}
          />
        )
      })}
    </>
  )
}

export default function Connect() {
  const [fishIndex, setFishIndex] = useState(0)
  const [isFishHovered, setIsFishHovered] = useState(false)
  const [showFountain, setShowFountain] = useState(false)
  const [fountainOrigin, setFountainOrigin] = useState({ x: 0, y: 0 })
  const [showHint, setShowHint] = useState(false)
  const [hintOpacity, setHintOpacity] = useState(0)
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fishRef = useRef<HTMLDivElement>(null)

  // Fish images for color cycling
  const fishImages = [
    '/images/fish/Group 4.png',
    '/images/fish/Group 5.png',
    '/images/fish/Group 6.png',
    '/images/fish/Group 7.png',
    '/images/fish/Group 8.png',
    '/images/fish/Group 9.png',
    '/images/fish/Group 10.png',
    '/images/fish/Group 11.png',
  ]

  // Cycle through fish colors when hovered
  useEffect(() => {
    if (!isFishHovered) return
    const interval = setInterval(() => {
      setFishIndex(prev => (prev + 1) % fishImages.length)
    }, 150)
    return () => clearInterval(interval)
  }, [isFishHovered, fishImages.length])

  const handleFishMouseEnter = () => {
    setIsFishHovered(true)
    window.dispatchEvent(new CustomEvent('fishHoverChange', { detail: true }))
    // Trigger fountain
    if (fishRef.current) {
      const rect = fishRef.current.getBoundingClientRect()
      setFountainOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
    setShowFountain(true)
  }

  const handleFishMouseLeave = () => {
    setIsFishHovered(false)
    window.dispatchEvent(new CustomEvent('fishHoverChange', { detail: false }))
    setShowFountain(false)
  }

  const handleCardsMouseEnter = () => {
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
    setShowHint(true)
    setHintOpacity(1)
  }

  const handleCardsMouseLeave = () => {
    setHintOpacity(0)
    fadeTimeoutRef.current = setTimeout(() => setShowHint(false), 500)
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
    }
  }, [])

  return (
    <section
      id="connect"
      className="connect-section flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#F8F6F3',
        paddingTop: '120px',
        paddingBottom: '160px',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto'
      }}
    >
      {/* Main title - same as PRODUCT section */}
      <h2
        className="font-bold text-center mb-4 uppercase"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '96px',
          color: '#2A2235',
          lineHeight: '96px',
        }}
      >
        connect
      </h2>

      {/* English subtitle */}
      <p
        className="text-center mb-6"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '36px',
          color: '#6B5B7A',
        }}
      >
        Ready to build something amazing?
      </p>

      {/* Chinese description */}
      <p
        className="text-center mb-12"
        style={{
          fontFamily: 'PingFang SC, -apple-system, sans-serif',
          fontSize: '24px',
          color: '#2A2235',
          lineHeight: 1.4,
        }}
      >
        欢迎联系我！
      </p>

      {/* Contact cards */}
      <div
        className="flex flex-col gap-5 items-center"
        style={{ pointerEvents: 'auto' }}
        onMouseEnter={handleCardsMouseEnter}
        onMouseLeave={handleCardsMouseLeave}
      >
        <ContactCard
          label="Email:"
          value={process.env.NEXT_PUBLIC_EMAIL || ''}
          bgColor="#FF9CCC"
          copyable
        />
        <ContactCard
          label="Phone:"
          value={process.env.NEXT_PUBLIC_PHONE || ''}
          bgColor="#9CDEFF"
          copyable
        />
        <ContactCard
          label="Wechat:"
          value={process.env.NEXT_PUBLIC_WECHAT || ''}
          bgColor="#FFED9C"
          copyable
        />
      </div>

      {/* Copy hint text */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: hintOpacity }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: 'PingFang SC, sans-serif',
          fontSize: '14px',
          color: '#6B5B7A',
          height: '20px'
        }}
      >
        {showHint && '点击复制信息~'}
      </motion.div>

      {/* Fish decoration - with hover color cycling, 1.5x size */}
      <div
        ref={fishRef}
        className="mt-16 relative"
        style={{ width: '120px', height: '78px', cursor: 'pointer' }}
        onMouseEnter={handleFishMouseEnter}
        onMouseLeave={handleFishMouseLeave}
        onClick={() => setFishIndex(prev => (prev + 1) % fishImages.length)}
      >
        <img
          src={fishImages[fishIndex]}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Particle Fountain Effect - rendered at viewport level */}
      <ParticleFountain
        isActive={showFountain}
        originX={fountainOrigin.x}
        originY={fountainOrigin.y}
      />
    </section>
  )
}
