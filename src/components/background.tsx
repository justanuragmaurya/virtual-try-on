"use client"
import { motion } from "motion/react"

export default function GradientBackground() {
  return (
    <motion.div
      className="fixed w-full h-screen -z-100 top-0"
      style={{
        backgroundImage: `
          radial-gradient(200% 125% at 50% 100%, #339cdd, transparent 60%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")
        `,
        backgroundBlendMode: "overlay"
      }}
    />
  );
}
