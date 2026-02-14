"use client";

import { useEffect, useRef } from "react";
import init, {
  init_system,
  init_circular_orbit,
  step_system,
} from "@/wasm/exovita_sim_core";

export default function OrbitSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function run() {
      await init();

      // 1 day per frame (accelerated time)
      init_system(86400.0);

      // Sun + Earth circular orbit
      init_circular_orbit(
        1.989e30,   // Sun mass
        5.972e24,   // Earth mass
        1.5e11      // 150 million km
      );

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      function animate() {
        const bodies = step_system() as any[];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = 2e-9; // Adjust for visibility

        bodies.forEach((body, index) => {
          const x = canvas.width / 2 + body.position[0] * scale;
          const y = canvas.height / 2 + body.position[1] * scale;

          ctx.beginPath();

          if (index === 0) {
            ctx.fillStyle = "yellow";
            ctx.arc(x, y, 12, 0, Math.PI * 2);
          } else {
            ctx.fillStyle = "blue";
            ctx.arc(x, y, 6, 0, Math.PI * 2);
          }

          ctx.fill();
        });

        requestAnimationFrame(animate);
      }

      animate();
    }

    run();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Kepler Circular Orbit (Backend Physics)</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid white" }}
      />
    </div>
  );
}


