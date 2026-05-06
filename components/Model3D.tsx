'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'
import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

function Model() {
  const { scene } = useGLTF('/models/model.glb')
  const modelRef = useRef<THREE.Group>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.emissive = new THREE.Color(0x111111)
              mat.emissiveIntensity = 0.1
            })
          } else {
            child.material.emissive = new THREE.Color(0x111111)
            child.material.emissiveIntensity = 0.1
          }
        }
      }
    })

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 1.92 / maxDim
    scene.scale.multiplyScalar(scale)
    scene.position.sub(center.multiplyScalar(scale))
  }, [scene])

  return (
    <group ref={modelRef} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={scene} />
    </group>
  )
}

function AutoResetControls({ enabled, onInteractionStart, onInteractionEnd }: { enabled: boolean; onInteractionStart?: () => void; onInteractionEnd?: () => void }) {
  const controlsRef = useRef<any>(null)
  const lastInteractionTime = useRef<number>(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const targetAzimuth = useRef(0)
  const targetPolar = useRef(Math.PI / 2)
  const currentAzimuth = useRef(0)
  const currentPolar = useRef(Math.PI / 2)

  useFrame(() => {
    if (!controlsRef.current) return

    const now = Date.now()
    const timeSinceInteraction = now - lastInteractionTime.current

    if (!isInteracting && timeSinceInteraction > 3000) {
      currentAzimuth.current += (targetAzimuth.current - currentAzimuth.current) * 0.015
      currentPolar.current += (targetPolar.current - currentPolar.current) * 0.015
      controlsRef.current.setAzimuthalAngle(currentAzimuth.current)
      controlsRef.current.setPolarAngle(currentPolar.current)
    }
  })

  const handleInteractionStart = () => {
    setIsInteracting(true)
    lastInteractionTime.current = Date.now()
    onInteractionStart?.()
  }

  const handleInteractionEnd = () => {
    setIsInteracting(false)
    lastInteractionTime.current = Date.now()
    onInteractionEnd?.()
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={1.5}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      target={[0, 0, 0]}
      onStart={handleInteractionStart}
      onEnd={handleInteractionEnd}
    />
  )
}

function Scene({ onInteractionStart, onInteractionEnd }: { onInteractionStart?: () => void; onInteractionEnd?: () => void }) {
  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -5, -5]} intensity={0.6} />
      <directionalLight position={[0, 10, -5]} intensity={0.4} />

      <Suspense fallback={
        <Html>
          <div className="absolute inset-0 flex items-center justify-center bg-[#EBE9E4]" style={{ width: '800px', height: '600px' }}>
            <div className="w-16 h-16 border-4 border-[#2A2235] border-t-transparent rounded-full animate-spin" />
          </div>
        </Html>
      }>
        <Model />
      </Suspense>

      <AutoResetControls enabled={true} onInteractionStart={onInteractionStart} onInteractionEnd={onInteractionEnd} />
    </>
  )
}

// Scratch Card Component with Polaroid style (only when scratched)
interface ScratchCardProps {
  onHover: () => void
  onLeave: () => void
  isScratchedGlobal: boolean
  onScratchComplete: () => void
  rotation: number
  image: string
}

function ScratchCard({ onHover, onLeave, isScratchedGlobal, onScratchComplete, rotation, image }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratched, setIsScratched] = useState(false)
  const [imgSize, setImgSize] = useState({ width: 200, height: 150 })
  const [isDragging, setIsDragging] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(rotation)

  // 保存初始随机旋转角度
  const initialRotation = useRef(rotation)

  // 当传入的rotation变化时更新状态
  useEffect(() => {
    setCurrentRotation(rotation)
    initialRotation.current = rotation
  }, [rotation])

  // Load image to get natural dimensions
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      // Calculate aspect ratio, max height 300px
      const aspectRatio = img.width / img.height
      const height = 300
      const width = height * aspectRatio
      setImgSize({ width, height })
    }
    img.onerror = () => {
      console.warn(`Failed to load image: ${image}`)
    }
    img.src = image
  }, [image])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fill with silver scratch layer
    ctx.fillStyle = '#C0C0C0'
    ctx.fillRect(0, 0, imgSize.width, imgSize.height)

    // Add texture
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`
      ctx.beginPath()
      ctx.arc(Math.random() * imgSize.width, Math.random() * imgSize.height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [imgSize])

  // Update local state when global state changes
  useEffect(() => {
    if (isScratchedGlobal) {
      setIsScratched(true)
    }
  }, [isScratchedGlobal])

  const isDrawing = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const canvasRefCallback = useRef<HTMLCanvasElement>(null)

  // Use callback ref to get the correct canvas
  const setCanvasRef = (el: HTMLCanvasElement | null) => {
    canvasRef.current = el
    canvasRefCallback.current = el
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    // 鼠标相对于 Canvas 左上角的坐标
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    // 缩放到 Canvas 内部物理像素坐标系
    const finalX = mouseX * (canvas.width / rect.width)
    const finalY = mouseY * (canvas.height / rect.height)
    lastPos.current = { x: finalX, y: finalY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current || isScratched) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    // 鼠标相对于 Canvas 左上角的坐标
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    // 缩放到 Canvas 内部物理像素坐标系
    const finalX = mouseX * (canvas.width / rect.width)
    const finalY = mouseY * (canvas.height / rect.height)

    // Draw scratch (reveal)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(finalX, finalY)
    ctx.lineWidth = 18
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPos.current = { x: finalX, y: finalY }

    // Calculate scratch progress around the scratch area
    const checkCenterX = finalX
    const checkCenterY = finalY
    const checkRadius = 50

    // Check pixels in a local area around the scratch line
    const startX = Math.max(0, Math.floor(checkCenterX - checkRadius))
    const endX = Math.min(canvas.width, Math.ceil(checkCenterX + checkRadius))
    const startY = Math.max(0, Math.floor(checkCenterY - checkRadius))
    const endY = Math.min(canvas.height, Math.ceil(checkCenterY + checkRadius))

    const imageData = ctx.getImageData(startX, startY, endX - startX, endY - startY)
    let transparentPixels = 0
    let totalPixels = 0

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) {
        transparentPixels++
      }
      totalPixels++
    }

    const progress = totalPixels > 0 ? (transparentPixels / totalPixels) * 100 : 0

    if (progress > 60) {
      setIsScratched(true)
      onScratchComplete()
    }
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  // When scratched = true, show polaroid style (without label)
  if (isScratched) {
    // Polaroid style (without label)
    return (
      <motion.div
        style={{
          width: `${imgSize.width + 24}px`,
          height: `${imgSize.height + 62}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
        drag={isScratched}
        dragMomentum={false}
        dragElastic={0.05}
        dragSnapToOrigin={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false)
          // 松手时恢复原始旋转角度，保持随意感
          setCurrentRotation(initialRotation.current)
        }}
        whileDrag={{ scale: 0.95 }}
        animate={{ rotate: currentRotation }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          mass: 1
        }}
      >
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '2px 4px 15px rgba(0,0,0,0.2)',
            padding: '12px',
            boxSizing: 'border-box'
          }}
        >
            <div
              className="relative"
              style={{
                width: `${imgSize.width}px`,
                height: `${imgSize.height}px`,
                backgroundColor: '#888888'
              }}
            >
              <img
                src={image}
                alt="scratched reveal"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </div>
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '50px', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </motion.div>
    )
  }

  // Simple scratch card (before scratched) - no label, no bottom bar
  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        width: `${imgSize.width}px`,
        height: `${imgSize.height}px`,
        transform: `rotate(${rotation}deg)`
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Image as background */}
      <img
        src={image}
        alt="scratch card"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Scratch layer */}
      <canvas
        ref={setCanvasRef}
        width={imgSize.width}
        height={imgSize.height}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Center text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <span
          className="text-[#000000] text-[14px] font-medium"
          style={{
            fontFamily: 'Georgia, serif'
          }}
        >
          刮开看看呢
        </span>
      </div>
    </div>
  )
}

export default function Model3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(900)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isMagicPhase, setIsMagicPhase] = useState(false)
  const [showScratchCards, setShowScratchCards] = useState(false)
  const [scratchCards, setScratchCards] = useState<{ id: number; isScratched: boolean; rotation: number }[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInteractingRef = useRef(false)

  // Card images
  const cardImages = [
    '/images/scratch-1.jpg',
    '/images/scratch-2.jpg',
    '/images/scratch-3.jpg',
    '/images/scratch-4.png'
  ]

  // Generate random rotations for each card (ONEAID fixed at 20 degrees)
  const cardRotations = useMemo(() => [
    20,  // ONEAID fixed rotation
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 6
  ], [])

  // Show tooltip only when rotating (interacting with) the model
  const handleInteractionStart = () => {
    isInteractingRef.current = true
    if (!isMagicPhase && !showScratchCards) {
      setShowTooltip(true)
    }
  }

  const handleInteractionEnd = () => {
    isInteractingRef.current = false
    setShowTooltip(false)
  }

  const handleDoubleClick = () => {
    if (!isMagicPhase && !showScratchCards) {
      setShowTooltip(false)
      setIsMagicPhase(true)

      setTimeout(() => {
        setIsMagicPhase(false)
        setShowScratchCards(true)
        // Initialize 3 scratch cards with random rotations
        setScratchCards([
          { id: 0, isScratched: false, rotation: cardRotations[0] },
          { id: 1, isScratched: false, rotation: cardRotations[1] },
          { id: 2, isScratched: false, rotation: cardRotations[2] }
        ])
      }, 500)
    }
  }

  const handleScratchCardHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleScratchCardLeave = () => {
    if (showScratchCards) {
      const hasUnscratched = scratchCards.some(card => !card.isScratched)
      if (hasUnscratched) {
        timeoutRef.current = setTimeout(() => {
          setShowScratchCards(false)
          setScratchCards([])
        }, 7000)
      }
    }
  }

  const handleScratchComplete = (id: number) => {
    setScratchCards(prev => prev.map(card =>
      card.id === id ? { ...card, isScratched: true } : card
    ))
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <section
      className="py-2 px-8 relative"
      style={{ marginTop: '-120px', pointerEvents: 'none' }}
    >
      {/* Tooltip - adjusted position to the left */}
      <AnimatePresence>
        {showTooltip && !isMagicPhase && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="absolute z-20 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg"
            style={{
              backgroundColor: '#FF9CCC',
              color: '#000000',
              maxWidth: '200px',
              top: '80px',
              left: 'calc(50% + 280px)',
              transform: 'translateX(-100%)'
            }}
          >
            双击我有彩蛋藏着，一般人我不告诉他
            <div className="absolute -bottom-2 left-8 w-4 h-4 rotate-45" style={{ backgroundColor: '#FF9CCC' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magic message */}
      <AnimatePresence>
        {isMagicPhase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-4 rounded-2xl text-white text-lg font-medium"
            style={{ backgroundColor: '#3E076E' }}
          >
            ✨ 收到！正在变魔法...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scratch Cards - positioned to the sides with more aggressive offset */}
      <AnimatePresence>
        {showScratchCards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute z-20 flex gap-8"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              marginTop: '40px',
              pointerEvents: 'auto'
            }}
          >
            {/* Card 1 - positioned far left, scale 1.2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -80, y: 80 }}
              animate={{ opacity: 1, scale: 1.1, x: -200, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                delay: 0,
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1]
              }}
            >
              <ScratchCard
                onHover={handleScratchCardHover}
                onLeave={handleScratchCardLeave}
                isScratchedGlobal={scratchCards[0]?.isScratched || false}
                onScratchComplete={() => handleScratchComplete(0)}
                rotation={scratchCards[0]?.rotation || 0}
                image={cardImages[0]}
              />
            </motion.div>

            {/* Card 2 - positioned top-right (x: 600, y: -300) */}
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 80, y: 80 }}
              animate={{ opacity: 1, scale: 1, x: 600, y: -300 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1]
              }}
            >
              <ScratchCard
                onHover={handleScratchCardHover}
                onLeave={handleScratchCardLeave}
                isScratchedGlobal={scratchCards[1]?.isScratched || false}
                onScratchComplete={() => handleScratchComplete(1)}
                rotation={scratchCards[1]?.rotation || 0}
                image={cardImages[1]}
              />
            </motion.div>

            {/* Card 3 - positioned below (x: 200, y: 100) */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 120 }}
              animate={{ opacity: 1, scale: 1, x: 200, y: 100 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1]
              }}
            >
              <ScratchCard
                onHover={handleScratchCardHover}
                onLeave={handleScratchCardLeave}
                isScratchedGlobal={scratchCards[2]?.isScratched || false}
                onScratchComplete={() => handleScratchComplete(2)}
                rotation={scratchCards[2]?.rotation || 0}
                image={cardImages[2]}
              />
            </motion.div>

            {/* Card 4 - smaller card above Card 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -50 }}
              animate={{ opacity: 1, scale: 0.75, x: -800, y: -320 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1]
              }}
            >
              <ScratchCard
                onHover={handleScratchCardHover}
                onLeave={handleScratchCardLeave}
                isScratchedGlobal={scratchCards[3]?.isScratched || false}
                onScratchComplete={() => handleScratchComplete(3)}
                rotation={scratchCards[3]?.rotation || 0}
                image={cardImages[3]}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Model Container */}
      <div
        className="relative"
        onDoubleClick={handleDoubleClick}
        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      >
        <motion.div
          ref={containerRef}
          className="w-full cursor-grab active:cursor-grabbing mx-auto"
          style={{
            height: `${height}px`,
            maxHeight: '900px',
            maxWidth: '800px',
            pointerEvents: 'auto'
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 3], fov: 45 }}
            gl={{
              alpha: true,
              antialias: false,
              powerPreference: 'low-power',
              preserveDrawingBuffer: false,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0
            }}
            dpr={[1, 1.5]}
            style={{ background: 'transparent' }}
            onCreated={({ gl }) => {
              gl.domElement.style.pointerEvents = 'none'
            }}
          >
            <Scene onInteractionStart={handleInteractionStart} onInteractionEnd={handleInteractionEnd} />
          </Canvas>
        </motion.div>
      </div>
    </section>
  )
}