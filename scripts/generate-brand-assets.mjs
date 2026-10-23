/**
 * Builds every logo and app-icon file from the master artwork in brand/aqar-logo-source.jpg.
 * Run with `node scripts/generate-brand-assets.mjs` after replacing the source image.
 * Uses the `sharp` copy that ships with Next.js.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "brand/aqar-logo-source.jpg";
const BLACK = { r: 10, g: 10, b: 10, alpha: 1 };

// Regions of the 2048px source, measured from its brightness profile (+20px breathing room).
const MARK = { left: 548, top: 279, width: 954, height: 1098 };
const LOCKUP = { left: 548, top: 279, width: 954, height: 1506 };

/** Gold-on-black → gold-on-transparent: brightness becomes alpha, colour is un-premultiplied. */
async function cutout(region) {
  const { data, info } = await sharp(SOURCE).extract(region).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  const FLOOR = 16; // the source's black is noisy around #0B0B0B
  for (let i = 0, o = 0; i < data.length; i += info.channels, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const peak = Math.max(r, g, b);
    const alpha = Math.max(0, Math.min(1, (peak - FLOOR) / (255 - FLOOR)));
    const scale = peak > 0 ? 255 / peak : 0;
    out[o] = Math.min(255, r * scale);
    out[o + 1] = Math.min(255, g * scale);
    out[o + 2] = Math.min(255, b * scale);
    out[o + 3] = Math.round(alpha * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

/** Square tile on brand black with the artwork filling `fill` of the height. */
async function tile(art, size, fill) {
  const inner = await sharp(art)
    .resize({ height: Math.round(size * fill), width: Math.round(size * fill), fit: "inside", kernel: "lanczos3" })
    // Hairlines go dim when shrunk to favicon size; lift and crisp them.
    .modulate(size <= 64 ? { brightness: 1.4 } : {})
    .sharpen(size <= 64 ? { sigma: 0.8 } : undefined)
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BLACK } })
    .composite([{ input: inner, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** ICO with PNG payloads (supported by every current browser and Windows Vista+). */
function ico(pngs) {
  const header = Buffer.alloc(6 + pngs.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

await mkdir("public/brand", { recursive: true });
await mkdir("public/icons", { recursive: true });

const mark = await cutout(MARK);
const lockup = await cutout(LOCKUP);

const files = {
  // Transparent cutouts read only on dark surfaces; on light ones the UI uses them as a CSS mask.
  "public/brand/mark.png": await sharp(mark).resize({ height: 384 }).png({ palette: true, compressionLevel: 9 }).toBuffer(),
  "public/logo-gold.png": await sharp(lockup).resize({ height: 1024 }).png({ palette: true, compressionLevel: 9 }).toBuffer(),
  // Lockup on brand black, for sharing and print.
  "public/logo.png": await sharp(lockup)
    .resize({ height: 1024 })
    .extend({ top: 64, bottom: 64, left: 64, right: 64, background: BLACK })
    .flatten({ background: BLACK })
    .png({ compressionLevel: 9 })
    .toBuffer(),
  // App icons: full lockup where there is room, the mark alone at favicon sizes.
  "public/icons/icon-192x192.png": await tile(lockup, 192, 0.8),
  "public/icons/icon-512x512.png": await tile(lockup, 512, 0.8),
  // Older file names stay valid for caches and installs that already point at them.
  "public/icons/icon-192.png": await tile(lockup, 192, 0.8),
  "public/icons/icon-512.png": await tile(lockup, 512, 0.8),
  // Maskable: launchers crop to a circle, so keep the art inside the 80% safe zone.
  "public/icons/maskable-512.png": await tile(lockup, 512, 0.6),
  "public/icons/apple-touch-icon.png": await tile(lockup, 180, 0.78),
};

const favicons = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await tile(mark, size, 0.92) })));
files["public/icons/favicon.ico"] = ico(favicons);

for (const [path, data] of Object.entries(files)) {
  await writeFile(path, data);
  console.log(`${path}  ${(data.length / 1024).toFixed(1)} KB`);
}
