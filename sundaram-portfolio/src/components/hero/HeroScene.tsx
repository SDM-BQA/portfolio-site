"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { AdditiveBlending, NormalBlending, Vector3, type Group } from "three";
import { getServerTheme, getTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { createParticleField } from "./particleField";

const CAMERA_DISTANCE = 6.4;
const FOV = 45;
const HALF_HEIGHT = Math.tan((FOV * Math.PI) / 360) * CAMERA_DISTANCE;
const DRAG_THRESHOLD_PX = 6;
const DRAG_SPEED = 0.008;

type Interaction = {
  /** Pointer position in normalised device coordinates; null when it is off the canvas. */
  pointer: { x: number; y: number } | null;
  burst: { x: number; y: number } | null;
  dragX: number;
  dragY: number;
};

function Particles({
  theme,
  shape,
  interaction,
  takeBurst,
  settleDrag,
  count,
}: {
  theme: Theme;
  shape: number;
  interaction: React.RefObject<Interaction>;
  takeBurst: () => Interaction["burst"];
  settleDrag: (frames: number) => void;
  count: number;
}) {
  const field = useMemo(() => createParticleField(count), [count]);
  const group = useRef<Group>(null);
  const scratch = useMemo(() => new Vector3(), []);

  useEffect(() => field.setTheme(theme), [field, theme]);
  useEffect(() => () => field.dispose(), [field]);

  useFrame((state, delta) => {
    const pose = group.current;
    if (!pose) return;
    const { pointer, dragX, dragY } = interaction.current;
    const burst = takeBurst();
    const frames = Math.min(delta * 60, 2.5);
    settleDrag(frames);
    const sway = Math.sin(state.clock.elapsedTime * 0.45) * 0.28;
    const lean = pointer ?? { x: 0, y: 0 };

    pose.rotation.y += (dragX + sway + lean.x * 0.14 - pose.rotation.y) * 0.07;
    pose.rotation.x += (dragY - lean.y * 0.1 - pose.rotation.x) * 0.07;
    pose.updateMatrixWorld();

    const toLocal = (ndc: { x: number; y: number }) => {
      scratch.set((ndc.x * HALF_HEIGHT * state.size.width) / state.size.height, ndc.y * HALF_HEIGHT, 0);
      pose.worldToLocal(scratch);
      return scratch;
    };

    if (burst) field.burst(toLocal(burst));
    field.tick(frames, shape, pointer ? toLocal(pointer) : null);
  });

  return (
    <group ref={group}>
      <points geometry={field.geometry} frustumCulled={false}>
        <pointsMaterial
          map={field.sprite}
          vertexColors
          size={theme === "dark" ? 0.058 : 0.062}
          transparent
          depthWrite={false}
          blending={theme === "dark" ? AdditiveBlending : NormalBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

export default function HeroScene({
  shape,
  onReady,
  onAdvance,
  onInteract,
}: {
  shape: number;
  onReady: () => void;
  onAdvance: () => void;
  onInteract: () => void;
}) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const interaction = useRef<Interaction>({ pointer: null, burst: null, dragX: 0, dragY: 0 });
  const container = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number; dragX: number; dragY: number; dragged: boolean } | null>(null);
  const count = useMemo(() => (window.innerWidth < 768 ? 1600 : 3200), []);

  function takeBurst() {
    const { burst } = interaction.current;
    interaction.current.burst = null;
    return burst;
  }

  // Once released, the shape turns back to face the viewer so it stays readable.
  function settleDrag(frames: number) {
    if (press.current?.dragged) return;
    const ease = Math.pow(0.97, frames);
    interaction.current.dragX *= ease;
    interaction.current.dragY *= ease;
  }

  function toNdc(event: ReactPointerEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    };
  }

  function onPointerMove(event: ReactPointerEvent) {
    interaction.current.pointer = toNdc(event);
    onInteract();
    const current = press.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
    current.dragged = true;
    interaction.current.dragX = current.dragX + dx * DRAG_SPEED;
    interaction.current.dragY = Math.max(-0.9, Math.min(0.9, current.dragY + dy * DRAG_SPEED));
  }

  function onPointerDown(event: ReactPointerEvent) {
    press.current = {
      x: event.clientX,
      y: event.clientY,
      dragX: interaction.current.dragX,
      dragY: interaction.current.dragY,
      dragged: false,
    };
  }

  function onPointerUp(event: ReactPointerEvent) {
    const current = press.current;
    press.current = null;
    if (!current || current.dragged) return;
    interaction.current.burst = toNdc(event);
    onAdvance();
  }

  function onPointerLeave() {
    press.current = null;
    interaction.current.pointer = null;
  }

  return (
    <div
      ref={container}
      data-particle-stage
      className="absolute inset-0 touch-pan-y"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerLeave}
    >
      <Canvas
        camera={{ position: [0, 0, CAMERA_DISTANCE], fov: FOV }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        onCreated={(state) => {
          // Stop rendering once the hero is scrolled away.
          const observer = new IntersectionObserver(([entry]) => {
            state.setFrameloop(entry.isIntersecting ? "always" : "never");
          });
          if (container.current) observer.observe(container.current);
          onReady();
        }}
      >
        <Particles theme={theme} shape={shape} interaction={interaction} takeBurst={takeBurst} settleDrag={settleDrag} count={count} />
      </Canvas>
    </div>
  );
}
