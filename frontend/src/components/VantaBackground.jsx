import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';

/**
 * VantaBackground — renders Vanta.js GLOBE as a full-page background.
 *
 * Architecture:
 *  - A fixed div behind everything holds the Vanta canvas
 *  - Children render in normal document flow on top
 *
 * Key implementation notes (from official Vanta.js docs):
 *  1. Pass THREE explicitly so Vanta doesn't depend on window.THREE
 *  2. Use useRef to get the actual DOM node for `el`
 *  3. Use useEffect with empty deps [] (runs once on mount)
 *  4. Return cleanup function that calls .destroy() to prevent memory leaks
 *  5. Store vanta instance in a ref (not state) to avoid re-render loops
 */
export default function VantaBackground({ children }) {
  const bgRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current && bgRef.current) {
      vantaEffect.current = GLOBE({
        el: bgRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xffffff,
        color2: 0x3b82f6,
        backgroundColor: 0x0f172a,
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Fixed background layer — Vanta canvas renders here */}
      <div
        ref={bgRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      {/* Children render in normal document flow above the background */}
      {children}
    </>
  );
}
