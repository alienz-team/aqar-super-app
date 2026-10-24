/** Official Aqaar contact details: the single source for the footer, contact section and action buttons. */
export const contact = {
  city: { en: "Tripoli, Libya", ar: "طرابلس، ليبيا" },
  lat: 32.8872094,
  lng: 13.1913383,
  phoneE164: "+218915229703",
  phoneDisplay: "+218-91-5229703",
  whatsappNumber: "218915229703",
  email: "aqqar.ly@gmail.com",
  facebook: "https://www.facebook.com/aqaarlibya",
  instagram: "https://www.instagram.com/aqaar_ly/",
  googleMaps: "https://maps.google.com?q=32.8872094,13.1913383",
  waze: "https://waze.com/ul?ll=32.8872094,13.1913383&navigate=yes",
} as const;

export const telUrl = `tel:${contact.phoneE164}`;
export const mailUrl = `mailto:${contact.email}`;

/** WhatsApp chat link, optionally with a prefilled message. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
