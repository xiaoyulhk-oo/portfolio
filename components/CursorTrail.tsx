'use client'

import { useEffect, useRef } from 'react'

// Custom event type for fish hover
interface FishHoverEvent {
  detail: boolean
}

const cursorImages = [
  '/images/cursor/Group 3-1.png',
  '/images/cursor/Group 3-2.png',
  '/images/cursor/Group 3-3.png',
  '/images/cursor/Group 3-4.png',
  '/images/cursor/Group 3.png',
]

const TRAIL_COUNT = 5
const QUEUE_LENGTH = 20
const LERP_FACTOR = 0.15

// Derive trail indices from QUEUE_LENGTH and TRAIL_COUNT
// These indices spread the 5 trail elements across the queue
const getTrailIndices = () => {
  const step = Math.floor((QUEUE_LENGTH - 1) / (TRAIL_COUNT - 1))
  return Array.from({ length: TRAIL_COUNT }, (_, i) => QUEUE_LENGTH - 1 - i * step).slice(0, TRAIL_COUNT)
}
const TRAIL_INDICES = getTrailIndices()

export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const positionQueue = useRef<{ x: number; y: number }[]>([])
  const currentPositions = useRef<{
    x: number
    y: number
    targetX: number
    targetY: number
    angle: number
    prevX: number
    prevY: number
  }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({
      x: -100,
      y: -100,
      targetX: -100,
      targetY: -100,
      angle: 0,
      prevX: -100,
      prevY: -100,
    }))
  )
  const rafId = useRef<number>(0)
  const isVisible = useRef(false)
  const isFishHovered = useRef(false)

  useEffect(() => {
    // 监听小鱼悬停事件
    const handleFishHover = (e: Event) => {
      isFishHovered.current = (e as CustomEvent<FishHoverEvent>).detail
    }
    window.addEventListener('fishHoverChange', handleFishHover)

    // 初始化队列
    positionQueue.current = Array.from({ length: QUEUE_LENGTH }, () => ({ x: -100, y: -100 }))

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e

      // 将新坐标 push 到队列末尾
      positionQueue.current.push({ x: clientX, y: clientY })

      // 保持队列长度固定
      if (positionQueue.current.length > QUEUE_LENGTH) {
        positionQueue.current.shift()
      }

      if (!isVisible.current) {
        isVisible.current = true
        // 初始化所有元素位置到当前位置
        for (let i = 0; i < TRAIL_COUNT; i++) {
          currentPositions.current[i].x = clientX
          currentPositions.current[i].y = clientY
          currentPositions.current[i].targetX = clientX
          currentPositions.current[i].targetY = clientY
          currentPositions.current[i].prevX = clientX
          currentPositions.current[i].prevY = clientY
        }
      }
    }

    // Lerp 函数
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    // 计算角度（鱼头朝向）
    const calculateAngle = (currX: number, currY: number, prevX: number, prevY: number): number => {
      const dx = currX - prevX
      const dy = currY - prevY
      // 计算弧度，dy在前（垂直），dx在后（水平）
      const angleRadians = Math.atan2(dy, dx)
      // 弧度转角度，并加180度修正（因为图片鱼头朝左）
      const angleDegrees = (angleRadians * 180) / Math.PI + 180
      return angleDegrees
    }

    // 动画循环
    const animate = () => {
      const container = containerRef.current
      if (!container) {
        rafId.current = requestAnimationFrame(animate)
        return
      }

      const queue = positionQueue.current
      if (queue.length >= QUEUE_LENGTH) {
        // 让 5 个元素分别读取 [16, 12, 8, 4, 0] 索引的坐标（颠倒）
        // 索引 16 是最新位置（靠近鼠标），索引 0 是最旧位置（拖尾末端）

        for (let i = 0; i < TRAIL_COUNT; i++) {
          const targetIndex = TRAIL_INDICES[i]
          const target = queue[targetIndex] || queue[queue.length - 1]
          const prev = currentPositions.current[i]

          if (target) {
            // 保存当前位置作为上一帧
            prev.prevX = prev.x
            prev.prevY = prev.y

            // 设置目标位置
            prev.targetX = target.x
            prev.targetY = target.y

            // Lerp 平滑移动
            prev.x = lerp(prev.x, target.x, LERP_FACTOR)
            prev.y = lerp(prev.y, target.y, LERP_FACTOR)

            // 计算朝向角度
            const dx = prev.x - prev.prevX
            const dy = prev.y - prev.prevY
            const distance = Math.sqrt(dx * dx + dy * dy)

            // 只有移动距离足够大时才更新角度，避免抖动
            if (distance > 2) {
              prev.angle = calculateAngle(prev.x, prev.y, prev.prevX, prev.prevY)
            }

            // 更新 DOM - scale 从大到小，angle 控制朝向
            // z-index: 最大的鱼(index=0)在最上层，最小的鱼(index=4)在最下层
            const element = container.children[i] as HTMLElement
            if (element) {
              const scale = 1 - i * 0.15
              element.style.transform = `translate(${prev.x - 24}px, ${prev.y - 24}px) rotate(${prev.angle}deg) scale(${scale})`
              element.style.opacity = isVisible.current && !isFishHovered.current ? String(1 - i * 0.15) : '0'
              element.style.zIndex = String(100 - i)
            }
          }
        }
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('fishHoverChange', handleFishHover)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ overflow: 'hidden' }}
    >
      {cursorImages.map((src, index) => {
        const shadow = 0.1 + index * 0.05

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '48px',
              height: '48px',
              transform: 'translate(-100px, -100px)',
              opacity: 0,
              willChange: 'transform',
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-contain"
              style={{
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,${shadow}))`,
              }}
              draggable={false}
            />
          </div>
        )
      })}
    </div>
  )
}
