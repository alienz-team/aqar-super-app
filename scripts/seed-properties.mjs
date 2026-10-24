// Syncs the demo listings in src/lib/mock-data.ts into the Property table (bilingual).
// Idempotent: each listing keeps a stable UUID derived from its mock id, so re-running updates in place.
// Usage: npm run db:seed   (reads DATABASE_URL from .env; needs Node 22.18+ to import the .ts data file)
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { properties } from "../src/lib/mock-data.ts";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run through `npm run db:seed` so .env is loaded.");
  process.exit(1);
}

/** Deterministic UUID (v5-style layout) from a listing id like "p-1001". */
function stableUuid(key) {
  const h = createHash("sha1").update(`aqar-property:${key}`).digest("hex");
  const variant = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-${variant}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

const prisma = new PrismaClient();

try {
  const statements = properties.map((p) =>
    prisma.$executeRaw`
      insert into "Property"
        ("id", "title", "description", "titleAr", "descriptionAr", "price", "areaSqm", "city", "images",
         "isVip", "listingType", "rentCycle", "category", "updatedAt")
      values
        (${stableUuid(p.id)}::uuid, ${p.title.en}, ${p.description.en}, ${p.title.ar}, ${p.description.ar},
         ${p.price}, ${p.areaSqm}, ${p.city.en}, ${p.images}::text[],
         ${p.isVip}, ${p.listingType}::"ListingType", ${p.rentCycle}::"RentCycle", ${p.category}::"PropertyCategory", now())
      on conflict ("id") do update set
        "title" = excluded."title", "description" = excluded."description",
        "titleAr" = excluded."titleAr", "descriptionAr" = excluded."descriptionAr",
        "price" = excluded."price", "areaSqm" = excluded."areaSqm", "city" = excluded."city",
        "images" = excluded."images", "isVip" = excluded."isVip", "listingType" = excluded."listingType",
        "rentCycle" = excluded."rentCycle", "category" = excluded."category", "updatedAt" = now()`,
  );
  await prisma.$transaction(statements);

  const [{ n, photos }] = await prisma.$queryRaw`select count(*)::int as n, coalesce(sum(cardinality("images")), 0)::int as photos from "Property"`;
  console.log(`Synced ${properties.length} listings. Property table now holds ${n} rows with ${photos} photos.`);
} catch (error) {
  console.error("Seeding failed:", error.code ?? "", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
