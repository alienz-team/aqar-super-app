// Generates the PWA icons in public/icons/ with no image dependencies:
// a gold roofline-and-doorway mark on #0A0A0A, rasterised with 4x4 supersampling.
// Usage: node scripts/generate-icons.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const BG = [0x0a, 0x0a, 0x0a];
const GOLD = [0xd4, 0xaf, 0x37];

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

function encodePng(size, pixel) {
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixel(x, y);
      const i = y * (size * 3 + 1) + 1 + x * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Distance from point to segment, all in unit (0..1) space.
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Mark: a roof chevron over a doorway, drawn as thick strokes. `scale` shrinks it for maskable safe zone. */
function isGold(u, v, scale) {
  const x = (u - 0.5) / scale + 0.5;
  const y = (v - 0.5) / scale + 0.5;
  const w = 0.055;
  const roof = Math.min(segDist(x, y, 0.2, 0.52, 0.5, 0.24), segDist(x, y, 0.5, 0.24, 0.8, 0.52)) < w;
  const left = segDist(x, y, 0.3, 0.5, 0.3, 0.78) < w;
  const right = segDist(x, y, 0.7, 0.5, 0.7, 0.78) < w;
  const base = segDist(x, y, 0.3, 0.78, 0.7, 0.78) < w;
  const door = x > 0.45 && x < 0.55 && y > 0.6 && y < 0.78;
  return roof || left || right || base || door;
}

function render(size, scale) {
  const ss = 4;
  return encodePng(size, (x, y) => {
    let hits = 0;
    for (let i = 0; i < ss; i++)
      for (let j = 0; j < ss; j++) if (isGold((x + (i + 0.5) / ss) / size, (y + (j + 0.5) / ss) / size, scale)) hits++;
    const a = hits / (ss * ss);
    return BG.map((c, k) => Math.round(c + (GOLD[k] - c) * a));
  });
}

const outDir = new URL("../public/icons/", import.meta.url);
mkdirSync(outDir, { recursive: true });
const icons = [
  ["icon-192.png", 192, 1],
  ["icon-512.png", 512, 1],
  ["apple-touch-icon.png", 180, 0.9],
  ["maskable-512.png", 512, 0.72],
];
for (const [name, size, scale] of icons) {
  writeFileSync(new URL(name, outDir), render(size, scale));
  console.log(`wrote public/icons/${name}`);
}
