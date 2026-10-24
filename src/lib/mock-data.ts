import type { HeroSlide, MaterialQuote, PropertyListing, ServiceSector } from "./types";

export const cities = [
  { en: "Tripoli", ar: "طرابلس" },
  { en: "Benghazi", ar: "بنغازي" },
  { en: "Misrata", ar: "مصراتة" },
  { en: "Zawiya", ar: "الزاوية" },
  { en: "Al Bayda", ar: "البيضاء" },
  { en: "Sabratha", ar: "صبراتة" },
  { en: "Garabulli", ar: "القره بوللي" },
] as const;

/**
 * Unsplash photo URLs. Every photo here was checked by eye: architecture, interiors, materials and
 * landscapes only, no people, faces or silhouettes. `unsplashLoader` overrides w/q per render.
 */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=85`;
const photos = (...ids: string[]) => ids.map(unsplash);

// Prices in Libyan Dinar (LYD), 2026 asking-price levels.
export const properties: PropertyListing[] = [
  {
    id: "p-1001",
    title: { en: "Corner villa with private pool, Hay Al Andalus", ar: "فيلا زاوية بمسبح خاص، حي الأندلس" },
    description: {
      en: "Two floors plus a roof annex, 6 bedrooms, a driver's room and a landscaped garden. Marble floors, central air conditioning and a generator for the whole house.",
      ar: "دوران وملحق علوي، ٦ غرف نوم، غرفة سائق وحديقة منسقة. أرضيات رخام، تكييف مركزي ومولد كهرباء للمنزل بالكامل.",
    },
    price: 4_200_000,
    areaSqm: 650,
    city: cities[0],
    images: photos("1613977257363-707ba9348227", "1613977257592-4871e5fcd7c4", "1600585152220-90363fe7e115", "1616046229478-9901c5536a45", "1507652313519-d4e9174996dd"),
    isVip: true,
    listingType: "SALE",
    rentCycle: "NONE",
    category: "VILLA",
    bedrooms: 6,
    bathrooms: 5,
  },
  {
    id: "p-1002",
    title: { en: "Family istiraha with pool, Garabulli resorts", ar: "استراحة عائلية بمسبح، استراحات القره بوللي" },
    description: {
      en: "Heated pool, separate men's and women's majlis, kids' play area and an outdoor grill. Sleeps 25 and is 45 minutes from central Tripoli.",
      ar: "مسبح مدفأ، مجلس رجال ونساء منفصل، ألعاب أطفال وشواء خارجي. تتسع لـ٢٥ شخصاً وتبعد ٤٥ دقيقة عن وسط طرابلس.",
    },
    price: 1_200,
    areaSqm: 3_000,
    city: cities[6],
    images: photos("1582268611958-ebfd161ef9cf", "1416331108676-a22ccb276e35", "1520250497591-112f2f40a3f4", "1615529182904-14819c35db37"),
    isVip: true,
    listingType: "RENT",
    rentCycle: "DAILY",
    category: "ISTIRAHA",
  },
  {
    id: "p-1003",
    title: { en: "Sea-view chalet, Garabulli resorts", ar: "شاليه بإطلالة بحرية، استراحات القره بوللي" },
    description: {
      en: "Direct beach access, a glass-walled dining room over the water and two master suites. Check-in from 4 pm.",
      ar: "دخول مباشر للشاطئ، غرفة طعام زجاجية مطلة على البحر وجناحان رئيسيان. الدخول من الساعة ٤ عصراً.",
    },
    price: 1_500,
    areaSqm: 450,
    city: cities[6],
    images: photos("1597211833712-5e41faa202ea", "1537726235470-8504e3beef77", "1578683010236-d716f9a3f461", "1507525428034-b723cf961d3e", "1604709177225-055f99402ea3"),
    isVip: true,
    listingType: "RENT",
    rentCycle: "DAILY",
    category: "CHALET",
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: "p-1004",
    title: { en: "3-bedroom apartment, Al Nofleen", ar: "شقة ٣ غرف، النوفليين" },
    description: {
      en: "Fully furnished, 6th floor, generator backup, covered parking and a lift. Yearly contract, paid in 2 instalments.",
      ar: "مفروشة بالكامل، الدور السادس، مولد احتياطي وموقف مظلل ومصعد. عقد سنوي على دفعتين.",
    },
    price: 38_000,
    areaSqm: 165,
    city: cities[0],
    images: photos("1515263487990-61b07816b324", "1618221118493-9cfa1a1c00da", "1595526114035-0d45ed16cfbf", "1620626011761-996317b8d101", "1616137466211-f939a420be84"),
    isVip: false,
    listingType: "RENT",
    rentCycle: "YEARLY",
    category: "APARTMENT",
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: "p-1005",
    title: { en: "Residential plot, Ben Ashour", ar: "أرض سكنية، بن عاشور" },
    description: {
      en: "Two street frontages (20 m and 30 m), zoned for villa construction, registered title ready for transfer.",
      ar: "واجهتان على شارعين (٢٠م و٣٠م)، مخصصة لبناء فيلا، مستندات الملكية جاهزة للتحويل.",
    },
    price: 1_350_000,
    areaSqm: 600,
    city: cities[0],
    images: photos("1500382017468-9049fed747ef", "1501854140801-50d01698950b", "1470071459604-3b5ec3a7fe05", "1558904541-efa843a96f01"),
    isVip: false,
    listingType: "SALE",
    rentCycle: "NONE",
    category: "LAND",
  },
  {
    id: "p-1006",
    title: { en: "Grand wedding hall for 500 guests, Al Siraj", ar: "قاعة أفراح فاخرة لـ٥٠٠ ضيف، السراج" },
    description: {
      en: "Crystal chandeliers, separate entrances, a bridal suite, a catering kitchen and valet parking for 150 cars.",
      ar: "ثريات كريستال، مداخل منفصلة، جناح للعروس، مطبخ ضيافة وخدمة صف سيارات لـ١٥٠ سيارة.",
    },
    price: 9_500,
    areaSqm: 1_800,
    city: cities[0],
    images: photos("1519167758481-83f550bb49b3", "1530023367847-a683933f4172", "1519225421980-715cb0215aed", "1464366400600-7168b8af9bc3", "1511795409834-ef04bbd61622"),
    isVip: true,
    listingType: "RENT",
    rentCycle: "DAILY",
    category: "EVENT_HALL",
  },
  {
    id: "p-1007",
    title: { en: "Modern apartment, Venezia, Benghazi", ar: "شقة حديثة، فينيسيا - بنغازي" },
    description: {
      en: "Sea breeze from the balcony, 3 bedrooms, an open living room and a covered parking space, minutes from the Corniche.",
      ar: "نسيم البحر من الشرفة، ٣ غرف نوم، صالة مفتوحة وموقف سيارة مظلل، على بعد دقائق من الكورنيش.",
    },
    price: 820_000,
    areaSqm: 210,
    city: cities[1],
    images: photos("1460317442991-0ec209397118", "1502672260266-1c1ef2d93688", "1505691938895-1758d7feb511", "1600121848594-d8644e57abab", "1505693416388-ac5ce068fe85"),
    isVip: false,
    listingType: "SALE",
    rentCycle: "NONE",
    category: "APARTMENT",
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: "p-1008",
    title: { en: "Furnished studio, monthly, Ben Ashour", ar: "استوديو مفروش شهري، بن عاشور" },
    description: {
      en: "A short drive from the city centre. Electricity, water and fibre internet included in the monthly rent.",
      ar: "على بعد دقائق بالسيارة من وسط المدينة. الكهرباء والماء والإنترنت بالألياف مشمولة في الإيجار الشهري.",
    },
    price: 2_200,
    areaSqm: 55,
    city: cities[0],
    images: photos("1586023492125-27b2c045efd7", "1615874959474-d609969a20ed", "1616486338812-3dadae4b4ace", "1556912173-3bb406ef7e77", "1584622650111-993a426fbf0a"),
    isVip: false,
    isNew: true,
    listingType: "RENT",
    rentCycle: "MONTHLY",
    category: "APARTMENT",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: "p-1009",
    title: { en: "Luxury villa with pool, Venezia, Benghazi", ar: "فيلا فاخرة بمسبح، فينيسيا - بنغازي" },
    description: {
      en: "Glass-fronted living areas onto a terraced pool, 5 bedrooms, a roof terrace and a smart-home system throughout.",
      ar: "صالات بواجهات زجاجية على مسبح مدرّج، ٥ غرف نوم، سطح خاص ونظام منزل ذكي في كامل الفيلا.",
    },
    price: 3_100_000,
    areaSqm: 520,
    city: cities[1],
    images: photos("1580587771525-78b9dba3b914", "1602343168117-bb8ffe3e2e9f", "1616594039964-ae9021a400a0", "1600607688969-a5bfcd646154", "1600566752355-35792bedcfea"),
    isVip: true,
    isNew: true,
    listingType: "SALE",
    rentCycle: "NONE",
    category: "VILLA",
    bedrooms: 5,
    bathrooms: 5,
  },
  {
    id: "p-1010",
    title: { en: "Showroom and offices, Al Siraj road", ar: "معرض ومكاتب تجارية، طريق السراج" },
    description: {
      en: "Double-height glass frontage, an open-plan mezzanine office and 8 dedicated parking bays on a main road.",
      ar: "واجهة زجاجية بارتفاع مزدوج، مكتب ميزانين مفتوح و٨ مواقف مخصصة على طريق رئيسي.",
    },
    price: 220_000,
    areaSqm: 380,
    city: cities[0],
    images: photos("1497366216548-37526070297c", "1497366811353-6870744d04b2", "1511818966892-d7d671e672a2", "1518005020951-eccb494ad742"),
    isVip: true,
    listingType: "RENT",
    rentCycle: "YEARLY",
    category: "COMMERCIAL",
  },
  {
    id: "p-1011",
    title: { en: "Villa in Al Siraj", ar: "فيلا في السراج" },
    description: {
      en: "Timber and glass facade, a pool-facing living room with a floating staircase, 5 bedrooms and a double garage.",
      ar: "واجهة من الخشب والزجاج، صالة مطلة على المسبح بدرج معلّق، ٥ غرف نوم ومرآب مزدوج.",
    },
    price: 2_600_000,
    areaSqm: 480,
    city: cities[0],
    images: photos("1600047509807-ba8f99d2cdde", "1600566753151-384129cf4e3e", "1600573472592-401b489a3cdc", "1617104678098-de229db51175"),
    isVip: true,
    isNew: true,
    listingType: "SALE",
    rentCycle: "NONE",
    category: "VILLA",
    bedrooms: 5,
    bathrooms: 4,
  },
  {
    id: "p-1012",
    title: { en: "Forest chalet with fireplace, Green Mountain", ar: "شاليه بين الغابات بمدفأة، الجبل الأخضر" },
    description: {
      en: "Among the junipers above Wadi Al Kouf, with a wooden terrace and an outdoor fire pit. Cool summer weekends.",
      ar: "بين أشجار العرعر فوق وادي الكوف، تراس خشبي وموقد خارجي. عطلات صيفية معتدلة.",
    },
    price: 650,
    areaSqm: 220,
    city: cities[4],
    images: photos("1568605114967-8130f3a36994", "1542718610-a1d656d1884c", "1587061949409-02df41d5e562", "1590490360182-c33d57733427"),
    isVip: false,
    listingType: "RENT",
    rentCycle: "DAILY",
    category: "CHALET",
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: "p-1013",
    title: { en: "Apartments on Airport Road", ar: "شقق في طريق المطار" },
    description: {
      en: "New residential block with 3-bedroom apartments, a lift, covered parking and a generator. Ready to move in, ten minutes from the airport.",
      ar: "عمارة سكنية جديدة بشقق من ٣ غرف نوم، مصعد، مواقف مظللة ومولد كهرباء. جاهزة للسكن وعلى بعد عشر دقائق من المطار.",
    },
    price: 650_000,
    areaSqm: 180,
    city: cities[0],
    images: photos("1515263487990-61b07816b324", "1618221118493-9cfa1a1c00da", "1600121848594-d8644e57abab", "1505693416388-ac5ce068fe85"),
    isVip: true,
    isNew: true,
    listingType: "SALE",
    rentCycle: "NONE",
    category: "APARTMENT",
    bedrooms: 3,
    bathrooms: 2,
  },
];

// Hand-picked order: Aqaar's two classic offers lead, then the VIP listings.
const featuredIds = ["p-1011", "p-1013", "p-1001"];
export const featuredProperties = [
  ...featuredIds.map((id) => properties.find((p) => p.id === id)!),
  ...properties.filter((p) => p.isVip && !featuredIds.includes(p.id)),
];

// Hero photos are served at 4K width: the loader swaps in the width each screen needs.
const hero = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=90`;

/** Hero background stages, shown in this order. Every photo was checked by eye: no people. */
export const heroSlides: HeroSlide[] = [
  { id: "villa", image: hero("1613490493576-7fde63acd811") },
  { id: "pools", image: hero("1600596542815-ffad4c1539a9") },
  { id: "landscape", image: hero("1600585154340-be6161a56a0c") },
  { id: "interior", image: hero("1600607687939-ce8a6c25118c") },
  { id: "architecture", image: hero("1600566753376-12c8ab7fb75b") },
  { id: "resort", image: hero("1512917774080-9991f1c4c750") },
  { id: "facade", image: hero("1600585154526-990dced4db0d") },
];

/** Rotating photo sets for section introductions (3-4 each, crossfaded every 4 s). */
export const sectionImages = {
  servicesIntro: photos("1600596542815-ffad4c1539a9", "1613977257365-aaae5a9817ff", "1564501049412-61c2a3083791", "1512917774080-9991f1c4c750"),
  bourse: photos("1517089596392-fb9a9033e05b", "1541976590-713941681591", "1599707254554-027aeb4deacd"),
  auth: photos("1613977257592-4871e5fcd7c4", "1600585154340-be6161a56a0c", "1564501049412-61c2a3083791"),
};

/**
 * Aqaar's six signature services. Photos come from the same eyeballed pool as the listings:
 * architecture, interiors, pools and equipment only, no people.
 */
export const serviceSectors: ServiceSector[] = [
  {
    id: "marketing",
    categories: [],
    mode: "browse",
    images: photos("1600585154340-be6161a56a0c", "1600596542815-ffad4c1539a9", "1600607687939-ce8a6c25118c"),
  },
  {
    id: "contracting",
    categories: ["CONSTRUCTION_SKELETON", "CONSTRUCTION_FINISHING", "MAINTENANCE_ELECTRICAL", "MAINTENANCE_PLUMBING"],
    mode: "quote",
    images: photos("1599707254554-027aeb4deacd", "1508450859948-4e04fabaa4ea", "1565008447742-97f6f38c985c"),
  },
  {
    id: "interior",
    categories: ["DESIGN_3D"],
    mode: "quote",
    images: photos("1618221195710-dd6b41faaea6", "1616486338812-3dadae4b4ace", "1600585154526-990dced4db0d"),
  },
  {
    id: "pools",
    categories: ["SWIMMING_POOL_LANDSCAPE", "MAINTENANCE_POOL"],
    mode: "quote",
    images: photos("1576013551627-0cc20b96c2a7", "1572331165267-854da2b10ccc", "1512917774080-9991f1c4c750"),
  },
  {
    id: "security",
    categories: ["SMART_HOME_SECURITY"],
    mode: "quote",
    images: photos("1557597774-9d273605dfa9", "1582139329536-e7284fece509", "1590856029826-c7a73142bbf1"),
  },
  {
    id: "smartHome",
    categories: ["SMART_HOME_SECURITY"],
    mode: "quote",
    images: photos("1513694203232-719a280e022f", "1618219908412-a29a1bb7b86e", "1617104678098-de229db51175"),
  },
];

const UPDATED = "2026-10-21T09:00:00.000Z";

export const materialPrices: MaterialQuote[] = [
  {
    materialType: "IRON_TON",
    nameEn: "Rebar steel",
    nameAr: "حديد تسليح",
    unit: { en: "per ton", ar: "للطن" },
    unitPrice: 4_650,
    previousPrice: 4_600,
    updatedAt: UPDATED,
  },
  {
    materialType: "CEMENT_BAG",
    nameEn: "Portland cement",
    nameAr: "أسمنت بورتلاندي",
    unit: { en: "per 50 kg bag", ar: "للكيس ٥٠ كجم" },
    unitPrice: 52,
    previousPrice: 53,
    updatedAt: UPDATED,
  },
  {
    materialType: "BRICKS_1000",
    nameEn: "Concrete blocks 20 cm",
    nameAr: "طوب خرساني ٢٠ سم",
    unit: { en: "per 1,000", ar: "لكل ١٠٠٠" },
    unitPrice: 2_950,
    previousPrice: 2_950,
    updatedAt: UPDATED,
  },
  {
    materialType: "SAND_LOAD",
    nameEn: "Washed sand",
    nameAr: "رمل مغسول",
    unit: { en: "per truck load", ar: "للنقلة" },
    unitPrice: 1_150,
    previousPrice: 1_100,
    updatedAt: UPDATED,
  },
  {
    materialType: "SOLAR_PANEL_KW",
    nameEn: "Solar panels",
    nameAr: "ألواح شمسية",
    unit: { en: "per kW installed", ar: "لكل كيلوواط مركب" },
    unitPrice: 5_200,
    previousPrice: 5_300,
    updatedAt: UPDATED,
  },
];
