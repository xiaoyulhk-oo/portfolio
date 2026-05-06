"use client";

import { motion } from "framer-motion";

const aboutText = `HI, 我是李焕楷，一名在视觉感官与功能逻辑之间寻找平衡的设计师。

我推崇乔布斯对设计的定义："Design is not just what it looks like and feels like. Design is how it works." 我注重视觉美感，但更在意设计在实际场景中的逻辑支撑。

我乐于尝试一切新事物，并能凭着极强的学习力快速破局。我待人诚挚，对事则全力以赴。我致力于用一丝不苟的设计语言，创作出更多美好，有用的产品。`;

export default function About() {
  const paragraphs = aboutText.trim().split("\n\n");

  return (
    <section
      id="about"
      className="min-h-screen px-8 md:px-16 py-32 flex items-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* Left: Vertical "ABOUT ME" */}
        <motion.div
          className="md:col-span-3 flex md:justify-end"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.2em] text-[var(--text-secondary)] leading-none"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            ABOUT ME
          </span>
        </motion.div>

        {/* Right: Profile text */}
        <motion.div
          className="md:col-span-9 space-y-6"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              className="font-sans text-base md:text-lg leading-8 text-[var(--text-secondary)] max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {para}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}