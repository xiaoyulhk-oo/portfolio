'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const navLinks = [
  { name: 'About', href: 'about' },
  { name: 'Honors', href: 'honors' },
  { name: 'Experience', href: 'experience' },
  { name: 'Products', href: 'works' },
  { name: 'Connect', href: 'connect' },
]

export default function Navigation({ hide = false }: { hide?: boolean }) {
  if (hide) return null

  const [isHovered, setIsHovered] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 桌面端布局
  if (!isMobile) {
    return (
      <>
        {/* 磨砂玻璃蒙层 */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '120px',
            zIndex: 99,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* 颗粒感纹理层 */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '120px',
            zIndex: 100,
            opacity: 0.03,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />
        <nav className="fixed left-0 right-0 top-[30px] flex justify-center items-center z-[100] px-[30px]">
        <div
          className="bg-[#E6E4DF] px-8 py-[16px] rounded-full flex justify-between items-center"
          style={{ height: '60px', width: '100%', maxWidth: '1200px' }}
        >
          <Link
            href="/"
            className="text-[20px] font-bold text-[#2A2235] shrink-0"
            style={{ fontFamily: 'Georgia, serif', lineHeight: '28px' }}
          >
            LIHUANKAI
          </Link>
          <ul className="flex gap-6 md:gap-8 lg:gap-[68px]">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={`#${link.href}`}
                  className="relative text-[#6B5B7A] hover:text-[#2A2235] transition-colors duration-300 whitespace-nowrap"
                  style={{ fontFamily: 'Georgia, serif', fontSize: '20px', lineHeight: '24px' }}
                  onMouseEnter={() => setIsHovered(link.name)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  {link.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-[#2A2235]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered === link.name ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left', top: '20px' }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      </>
    )
  }

  // 移动端布局
  return (
    <nav className="fixed left-4 right-4 top-4 z-50">
      <div className="bg-[#E6E4DF] rounded-full flex justify-between items-center px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-[#2A2235]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          LIHUANKAI
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#2A2235] p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[#E6E4DF] rounded-2xl py-4 px-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={`#${link.href}`}
              className="text-[#6B5B7A] text-lg py-2"
              style={{ fontFamily: 'Georgia, serif' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
