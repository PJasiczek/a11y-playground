import { criteria } from "../content/wcag.gen.ts";

export type SocialImage = {
  path: string;
  alt: string;
  width: number;
  height: number;
  type: "image/png" | "image/jpeg";
};

export const socialSections = {
  kryteria: { title: "WCAG po polsku", label: "KRYTERIA WCAG", color: "#a8dffc" },
  praktyka: { title: "Sprawdź w praktyce", label: "PRZYKŁADY I WZORCE ARIA", color: "#ffd2aa" },
  sciezki: { title: "Ucz się małymi krokami", label: "ŚCIEŻKI NAUKI", color: "#acf0b6" },
  prawo: { title: "Poznaj zasady dostępności", label: "PRAWO I STANDARDY", color: "#d0b9fa" },
  symulatory: { title: "Zmień perspektywę", label: "SYMULATORY", color: "#ffbcd8" },
  slownik: { title: "Zrozum dostępność", label: "SŁOWNIK", color: "#ffe78a" },
  "wcag-3": { title: "Poznaj kierunek zmian", label: "WCAG 3 · WERSJA ROBOCZA", color: "#92e5e7" },
} as const;

/** Shared by the image generator and page metadata so filenames cannot drift. */
export const socialCards = [
  { key: "home", title: "Małe kroki. Wielka zmiana.", label: "DOSTĘPNOŚĆ CYFROWA", color: "#ffe78a" },
  ...Object.entries(socialSections).map(([key, card]) => ({ key, ...card })),
  ...criteria.map((criterion) => ({
    key: `criterion-${criterion.id}`,
    title: criterion.name,
    label: `KRYTERIUM WCAG · ${criterion.id} · ${criterion.level}`,
    color: "#a8dffc",
  })),
];

const criterionCards = new Map(criteria.map((c) => [`/kryteria/${c.id}`, `criterion-${c.id}`]));

export function socialImageForPath(path: string): SocialImage {
  const clean = path.split(/[?#]/)[0]?.replace(/\/+$/, "") ?? "";
  const section = clean.split("/")[1];
  const key = criterionCards.get(clean) ?? (section && Object.hasOwn(socialSections, section) ? section : "home");
  const card = socialCards.find((entry) => entry.key === key) ?? socialCards[0];
  return {
    path: `/social/${key}-v1.png`,
    alt: `${card?.label ?? "DOSTĘPNOŚĆ CYFROWA"}: ${card?.title ?? "a11y playground"}. Pastelowy plac zabaw.`,
    width: 1200,
    height: 630,
    type: "image/png",
  };
}

export function twitterImagePath(image: SocialImage) {
  return image.path.startsWith("/social/") ? image.path.replace(/-v1\.png$/, "-x-v1.png") : image.path;
}
