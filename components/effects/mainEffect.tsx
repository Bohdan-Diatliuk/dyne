'use client';

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadTextShape } from "@tsparticles/shape-text";
import type { Container } from "@tsparticles/engine";
import { useEffect, useState, useCallback } from "react";
import { ParticleEffectProps } from "../../types/particles.interface";

function resolveCssVar(value: string): string {
  if (!value.startsWith("var(")) return value;
  
  const varName = value.match(/var\((--[^)]+)\)/)?.[1];
  if (!varName) return value;
  
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim() || "#ffffff";
}

export default function MainEffect({
  color = "var(--particle)",
  words = ["DYNE", "CHAT", "SOCIAL", "NETWORK"],
  moveSpeed = 2,
  numberCount = 100,
  minOpacity = 0.1,
  maxOpacity = 0.7,
  minSize = 1,
  maxSize = 10,
  zIndex = -1,
 }: ParticleEffectProps) {
  const [init, setInit] = useState(false);
  const [resolvedColor, setResolvedColor] = useState("#fff");

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadTextShape(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    const resolve = () => setResolvedColor(resolveCssVar(color));
    
    resolve();

    const observer = new MutationObserver(resolve);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
  });

    return () => observer.disconnect();
  }, [color]);
  const particlesLoaded = useCallback(async (container?: Container) => {
    console.log(container);
  }, []);

  if (!init) {
    return null;
  }
  
  return (
    <Particles
      key={resolvedColor}
      id={`tsparticles`}
      particlesLoaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 600,
        particles: {
          color: {
            value: resolvedColor,
          },
          move: {
            direction: "bottom",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: moveSpeed,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: numberCount,
          },
          opacity: {
            value: { min: minOpacity, max: maxOpacity },
          },
          shape: {
            type: "text",
            options: {
              text: { 
                value: words
               },
            },
          },
          size: {
            value: { min: minSize, max: maxSize },
          },
          wobble: {
            enable: true,
            distance: 10,
            speed: 10,
          },
        },
        detectRetina: true,
        fullScreen: {
          enable: true,
          zIndex: zIndex,
        },
      }}
    />
  );
}
