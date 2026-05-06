'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Model3D from '@/components/Model3D'
import Honors from '@/components/Honors'
import Experience from '@/components/Experience'
import Products from '@/components/Products'
import Connect from '@/components/Connect'
import Footer from '@/components/Footer'
import type { Project } from '@/components/Products'

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <main className="bg-[#F8F6F3]">
      <Navigation hide={selectedProject !== null} />
      <Hero />
      <Model3D />
      <Honors />
      <Experience />
      <Products
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />
      <Connect />
      <Footer />
    </main>
  )
}
