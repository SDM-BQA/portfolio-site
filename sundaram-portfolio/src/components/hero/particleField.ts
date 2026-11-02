import { BufferAttribute, BufferGeometry, CanvasTexture, Color, type Texture } from "three";
import type { Theme } from "@/lib/theme";

/** Shown as buttons under the visual. Captions only restate where each tool was really used. */
export const SHAPES = [
  { id: "code", label: "</>", caption: "Full stack, from the interface to the database." },
  { id: "react", label: "React", caption: "Helpee dashboards, CoreLog and Virtual Mentor." },
  { id: "graphql", label: "GraphQL", caption: "APIs and resolver optimisation at Helpee." },
  { id: "mongodb", label: "MongoDB", caption: "Query optimisation and schema design." },
  { id: "me", label: "SDM", caption: "Sundaram Dutta Modak." },
] as const;

const SPRING = 0.045;
const DAMPING = 0.84;
const REPEL_RADIUS = 0.95;
const REPEL_FORCE = 0.075;
const BURST_RADIUS = 3.2;
const BURST_FORCE = 0.55;

const random = (spread: number) => (Math.random() - 0.5) * spread;

function textPoints(text: string, count: number, width: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 240;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const points = new Float32Array(count * 3);
  if (!context) return points;

  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-space-grotesk").trim() || "sans-serif";
  context.font = `700 170px ${family}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#fff";
  context.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 20);

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const filled: number[] = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  if (!filled.length) return points;

  // Fit the drawn text itself to the width, so narrow text is as large as wide text.
  const scale = width / Math.min(context.measureText(text).width, canvas.width - 20);
  for (let index = 0; index < count; index++) {
    const pick = Math.floor(Math.random() * (filled.length / 2)) * 2;
    points[index * 3] = (filled[pick] - canvas.width / 2 + random(2)) * scale;
    points[index * 3 + 1] = (canvas.height / 2 - filled[pick + 1] + random(2)) * scale;
    points[index * 3 + 2] = random(0.35);
  }
  return points;
}

function atomPoints(count: number) {
  const points = new Float32Array(count * 3);
  for (let index = 0; index < count; index++) {
    if (index % 7 === 0) {
      // Nucleus
      const radius = 0.3 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      points[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      points[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      points[index * 3 + 2] = radius * Math.cos(phi);
      continue;
    }
    const ring = (index % 3) * (Math.PI / 3);
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * 2.2 + random(0.07);
    const y = Math.sin(angle) * 0.82 + random(0.07);
    points[index * 3] = x * Math.cos(ring) - y * Math.sin(ring);
    points[index * 3 + 1] = x * Math.sin(ring) + y * Math.cos(ring);
    points[index * 3 + 2] = Math.sin(angle) * 0.5 + random(0.07);
  }
  return points;
}

function graphPoints(count: number) {
  // The GraphQL mark: a hexagon of nodes, joined by its outline and an inner triangle.
  const nodes = Array.from({ length: 6 }, (_, index) => {
    const angle = Math.PI / 2 + (index * Math.PI) / 3;
    return [Math.cos(angle) * 2, Math.sin(angle) * 2];
  });
  const edges = [
    ...nodes.map((_, index) => [index, (index + 1) % 6]),
    [0, 2],
    [2, 4],
    [4, 0],
  ];
  const points = new Float32Array(count * 3);
  for (let index = 0; index < count; index++) {
    if (Math.random() < 0.3) {
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      const radius = 0.24 * Math.sqrt(Math.random());
      const angle = Math.random() * Math.PI * 2;
      points[index * 3] = node[0] + Math.cos(angle) * radius;
      points[index * 3 + 1] = node[1] + Math.sin(angle) * radius;
    } else {
      const [from, to] = edges[Math.floor(Math.random() * edges.length)];
      const along = Math.random();
      points[index * 3] = nodes[from][0] + (nodes[to][0] - nodes[from][0]) * along + random(0.06);
      points[index * 3 + 1] = nodes[from][1] + (nodes[to][1] - nodes[from][1]) * along + random(0.06);
    }
    points[index * 3 + 2] = random(0.16);
  }
  return points;
}

function databasePoints(count: number) {
  // Three stacked discs, tilted so their tops read as a database symbol.
  const points = new Float32Array(count * 3);
  const tilt = 0.5;
  const radius = 1.75;
  const thickness = 0.62;
  for (let index = 0; index < count; index++) {
    const disc = Math.floor(Math.random() * 3);
    const center = (1 - disc) * 1.08;
    const part = Math.random();
    let angle = Math.random() * Math.PI * 2;
    let height: number;
    if (part < 0.42) {
      height = center + thickness / 2; // Top rim
    } else if (part < 0.72) {
      height = center - thickness / 2; // Bottom rim
    } else {
      // The two silhouette edges join the rims, so each disc reads as a solid.
      angle = (Math.random() < 0.5 ? 0 : Math.PI) + random(0.08);
      height = center + random(thickness);
    }
    const x = Math.cos(angle) * radius + random(0.04);
    const z = Math.sin(angle) * radius + random(0.04);
    points[index * 3] = x;
    points[index * 3 + 1] = height * Math.cos(tilt) - z * Math.sin(tilt);
    points[index * 3 + 2] = height * Math.sin(tilt) + z * Math.cos(tilt);
  }
  return points;
}

function dotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.45, "rgba(255,255,255,0.85)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
  }
  return new CanvasTexture(canvas);
}

export type ParticleField = {
  geometry: BufferGeometry;
  sprite: Texture;
  setTheme: (theme: Theme) => void;
  tick: (frames: number, shape: number, pointer: { x: number; y: number; z: number } | null) => void;
  burst: (point: { x: number; y: number; z: number }) => void;
  dispose: () => void;
};

export function createParticleField(count: number): ParticleField {
  const targets = [
    textPoints("</>", count, 4.5),
    atomPoints(count),
    graphPoints(count),
    databasePoints(count),
    textPoints("SDM", count, 4.5),
  ];
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const shades = Float32Array.from({ length: count }, () => 0.65 + Math.random() * 0.5);

  // Particles start scattered and gather into the first shape.
  for (let index = 0; index < count * 3; index++) positions[index] = random(9);

  const geometry = new BufferGeometry();
  const positionAttribute = new BufferAttribute(positions, 3);
  const colorAttribute = new BufferAttribute(colors, 3);
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("color", colorAttribute);
  const sprite = dotTexture();

  return {
    geometry,
    sprite,
    setTheme(theme) {
      const base = new Color(theme === "dark" ? "#b9a4ff" : "#6042b6");
      for (let index = 0; index < count; index++) {
        colors[index * 3] = base.r * shades[index];
        colors[index * 3 + 1] = base.g * shades[index];
        colors[index * 3 + 2] = base.b * shades[index];
      }
      colorAttribute.needsUpdate = true;
    },
    tick(frames, shape, pointer) {
      const target = targets[shape];
      const damping = Math.pow(DAMPING, frames);
      for (let index = 0; index < count; index++) {
        const i = index * 3;
        let vx = velocities[i] + (target[i] - positions[i]) * SPRING * frames;
        let vy = velocities[i + 1] + (target[i + 1] - positions[i + 1]) * SPRING * frames;
        let vz = velocities[i + 2] + (target[i + 2] - positions[i + 2]) * SPRING * frames;

        if (pointer) {
          const dx = positions[i] - pointer.x;
          const dy = positions[i + 1] - pointer.y;
          const distance = Math.hypot(dx, dy) || 0.001;
          if (distance < REPEL_RADIUS) {
            const push = ((1 - distance / REPEL_RADIUS) * REPEL_FORCE * frames) / distance;
            vx += dx * push;
            vy += dy * push;
            vz += random(0.02) * frames;
          }
        }

        velocities[i] = vx * damping;
        velocities[i + 1] = vy * damping;
        velocities[i + 2] = vz * damping;
        positions[i] += velocities[i] * frames;
        positions[i + 1] += velocities[i + 1] * frames;
        positions[i + 2] += velocities[i + 2] * frames;
      }
      positionAttribute.needsUpdate = true;
    },
    burst(point) {
      for (let index = 0; index < count; index++) {
        const i = index * 3;
        const dx = positions[i] - point.x;
        const dy = positions[i + 1] - point.y;
        const dz = positions[i + 2] - point.z;
        const distance = Math.hypot(dx, dy, dz) || 0.001;
        if (distance > BURST_RADIUS) continue;
        const push = ((1 - distance / BURST_RADIUS) * BURST_FORCE) / distance;
        velocities[i] += dx * push;
        velocities[i + 1] += dy * push;
        velocities[i + 2] += dz * push + random(0.1);
      }
    },
    dispose() {
      geometry.dispose();
      sprite.dispose();
    },
  };
}
