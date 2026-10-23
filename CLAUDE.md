# Role & Objective
Act as a Principal Full-Stack Architect. We are building **"Aqar" (عقار)**, a unified Real Estate, Construction, and Maintenance Super App (configured as an installable **PWA**) using **Next.js 14+ (App Router), TypeScript, Tailwind CSS, Supabase, and Prisma ORM**[cite: 1].

Your task is to scaffold the core project architecture, configure the unified dual-theme system (Dark/Light toggle), set up error-free bilingual support (English LTR first, with instant switching to Arabic RTL), configure full PWA capabilities, create the Prisma database schema, and build the foundational pages[cite: 1].

---

# 1. Tech Stack & Core Packages
- **Framework:** Next.js (App Router, TypeScript, `src/` directory)[cite: 1].
- **Styling:** Tailwind CSS, `lucide-react` for icons, `clsx`, `tailwind-merge`[cite: 1].
- **Theming:** `next-themes` (seamless switching between Dark Mode and Light Mode via a navbar button)[cite: 1].
- **Bilingual System (Zero-Bug Approach):** Create a clean React Context (`LanguageProvider`) that switches between `en` (LTR) and `ar` (RTL) dynamically on the client side using dictionary files (`src/dictionaries/en.json` and `src/dictionaries/ar.json`), automatically updating `<html lang={lang} dir={dir}>`.
- **PWA (Progressive Web App):** Native Next.js App Router Web Manifest (`src/app/manifest.ts`), Service Worker (`public/sw.js`), mobile viewport optimization, and an interactive "Install App" prompt component.
- **Database & Auth:** `@prisma/client`, `prisma`, `@supabase/supabase-js`[cite: 1].

---

# 2. Design System & Theme Configuration (`tailwind.config.ts` & `globals.css`)
We use a single Unified UI with a global Theme Switcher[cite: 1]:
- **Dark Mode (Luxury & Real Estate Exploration):**
  - Background Primary: `#0A0A0A` (Deep Matte Black)[cite: 1]
  - Background Secondary / Cards: `#141414`[cite: 1]
  - Text Primary: `#FFFFFF` (Pure White)[cite: 1]
  - Text Secondary: `#A3A3A3`[cite: 1]
  - Accent / Primary Brand: `#D4AF37` (Metallic Gold - used for primary buttons, VIP badges, borders)[cite: 1]
- **Light Mode (Engineering, Trust & Execution):**
  - Background Primary: `#FFFFFF` (Pure White)[cite: 1]
  - Background Secondary / Cards: `#F8FAFC` (Slate 50)[cite: 1]
  - Text Primary: `#0F172A` (Slate 900)[cite: 1]
  - Primary Brand: `#1E3A8A` (Engineering Royal Blue)[cite: 1]
  - Secondary Accent: `#D4AF37` (Gold - interwoven with blue for highlights and verified badges)[cite: 1]

---

# 3. Database Schema (`prisma/schema.prisma`)
Create a clean Prisma schema connected to PostgreSQL covering[cite: 1]:
1. **`User` & `Role` Enum:** (`CLIENT`, `OWNER`, `CONTRACTOR`, `ENGINEER`, `TECHNICIAN`, `SUPPLIER`, `ADMIN`)[cite: 1].
2. **`Property` (Unified Sale & Rent - Including Istirahat/Chalets):**
   - `listingType`: Enum (`SALE`, `RENT`)[cite: 1].
   - `rentCycle`: Enum (`DAILY`, `MONTHLY`, `YEARLY`, `NONE`) -> *Note: Istirahat, Chalets, and Event Halls are standard properties under RENT with a DAILY or MONTHLY cycle*[cite: 1].
   - `category`: Enum (`APARTMENT`, `VILLA`, `LAND`, `COMMERCIAL`, `ISTIRAHA`, `CHALET`, `EVENT_HALL`)[cite: 1].
   - Fields: `id`, `title`, `description`, `price`, `areaSqm`, `city`, `images`, `isVip`[cite: 1].
3. **`Booking` (Direct Online Booking for Rentals):**
   - `id`, `propertyId`, `clientId`, `startDate`, `endDate`, `totalPrice`, `status` (`PENDING`, `CONFIRMED`, `CANCELLED`)[cite: 1].
4. **`ServiceRequest` (Construction, Engineering & Specialist Services):**
   - `serviceCategory`: Enum (`CONSTRUCTION_SKELETON`, `CONSTRUCTION_FINISHING`, `DESIGN_3D`, `SWIMMING_POOL_LANDSCAPE`, `SOLAR_ENERGY_WATER`, `SMART_HOME_SECURITY`, `MAINTENANCE_PLUMBING`, `MAINTENANCE_ELECTRICAL`, `MAINTENANCE_AC`, `MAINTENANCE_POOL`)[cite: 1].
5. **`MaterialPrice` (Live Construction Bourse):**
   - `id`, `materialType` (`IRON_TON`, `CEMENT_BAG`, `BRICKS_1000`, `SAND_LOAD`, `SOLAR_PANEL_KW`), `nameEn`, `nameAr`, `unitPrice`, `updatedAt`[cite: 1].

---

# 4. PWA & Mobile App Experience Configuration
Configure the project to behave like a native mobile Super App when installed:
1. **Web App Manifest (`src/app/manifest.ts`):**
   - `name`: `"AQAR | عقار - Super App"`
   - `short_name`: `"AQAR"`
   - `display`: `"standalone"` (hides browser UI)
   - `background_color`: `"#0A0A0A"`
   - `theme_color`: `"#D4AF37"`
   - Generate scalable SVG/PNG app icons in `public/icons/` (`icon-192x192.png`, `icon-512x512.png` with a black & gold luxury geometric logo).
2. **Metadata & Apple Web App Support (`src/app/layout.tsx`):**
   - Configure `viewport` with `themeColor`, `maximumScale: 1`, and `appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'AQAR' }`.
3. **Service Worker & Install Button (`src/components/pwa/InstallPrompt.tsx`):**
   - Register a lightweight Service Worker (`public/sw.js`) for offline shell caching and PWA installability criteria.
   - Add an `"Install App / تثبيت التطبيق"` button in the Navbar and a floating mobile banner that triggers the native browser `beforeinstallprompt` event (with iOS Safari instructions fallback).
4. **Mobile Bottom Navigation Bar (`src/components/layout/MobileNav.tsx`):**
   - Visible only on mobile screens (`md:hidden`), fixed at the bottom like a native app with tabs: `Home`, `Properties`, `Services`, `Bourse & Calc`.

---

# 5. Core Layout & Feature Modules to Build
Build the application in English first with full Arabic toggle readiness:

1. **Global Header (`src/components/layout/Navbar.tsx`):**
   - Brand Logo ("AQAR | عقار" with gold accent)[cite: 1].
   - Navigation Links: Home (`/`), Properties (`/properties`), Construction & Services (`/services`), Materials Bourse & Calculator (`/bourse`)[cite: 1].
   - Top-right Controls: **Install App Button (PWA)** + **Theme Toggle Button** (Dark/Light) + **Language Toggle Button** (`EN` / `AR`)[cite: 1].

2. **Landing Page (`src/app/page.tsx`):**
   - Hero section with quick search filter (Sale / Rent / Daily Istiraha).
   - Featured VIP Properties grid.
   - Quick overview cards for Construction, Solar & Water Solutions, Smart Home, and Maintenance.
   - Live ticker widget showing today's Iron and Cement prices.

3. **Unified Properties Page (`src/app/properties/page.tsx`):**
   - Filter bar for `SALE` vs `RENT`, Category (`Apartment`, `Villa`, `Land`, `Istiraha`, `Chalet`), and Rent Cycle (`Daily`, `Monthly`, `Yearly`)[cite: 1].
   - Property Cards showing VIP badge, price, specs, and a **"Book Now"** interactive modal with a date-range calendar for rental properties[cite: 1].

4. **Construction, Energy & Maintenance Hub (`src/app/services/page.tsx`):**
   - Clean grid showcasing all 6 service sectors (Contracting, 3D Design, Pools & Landscaping, Solar & Water Solutions, Smart Home, Maintenance)[cite: 1] with an interactive "Request a Quote / Book Technician" modal.

5. **Materials Bourse & Smart Cost Calculator (`src/app/bourse/page.tsx`):**
   - **Live Bourse Table:** Displays daily prices for Steel/Iron, Cement, Bricks, Sand, and Solar Systems[cite: 1].
   - **Integrated Smart Cost Calculator:** User inputs Roof Area in `m²`, Number of Floors, and Finishing Level (`Skeleton Only`, `Economy`, `Luxury`, `VIP`)[cite: 1]. Dynamically multiplies engineering consumption ratios by the live Bourse prices to output an instant breakdown[cite: 1].

---

# Execution Plan
Execute step-by-step without skipping any UI implementation[cite: 1]:
1. Initialize Next.js project, install packages (`lucide-react`, `next-themes`, `clsx`, `tailwind-merge`, `prisma`, `@prisma/client`), and configure `tailwind.config.ts` and `prisma/schema.prisma`[cite: 1].
2. Configure PWA files (`src/app/manifest.ts`, `public/sw.js`, custom SVG/PNG icons, and `InstallPrompt` + `MobileNav` components).
3. Create the `ThemeProvider`, `LanguageProvider` (with full `en` and `ar` dictionaries), and the `Navbar` + `Footer`[cite: 1].
4. Build all pages (`/`, `/properties`, `/services`, `/bourse`) using rich mock data so every page works immediately out of the box[cite: 1].
5. Run `npm run build` to verify there are zero TypeScript or Next.js build errors.