"use client"

import LightRays from "@/components/LightRays"

export default function MainLightRays() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <LightRays
        raysOrigin="top-center"
        raysColor="#8be9ff"
        raysSpeed={1.15}
        lightSpread={0.9}
        rayLength={5}
        followMouse={true}
        mouseInfluence={0.18}
        noiseAmount={0}
        distortion={0}
        className="custom-rays"
        pulsating={true}
        fadeDistance={1.8}
        saturation={1.15}
      />
    </div>
  )
}
