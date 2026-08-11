export const ENGLISH_LEVELS = [
  { value: "A1", title: "A1 · Amator", description: "Zaczynam od zera — pierwsze słowa i proste zdania." },
  { value: "A2", title: "A2 · Początkujący", description: "Radzę sobie w najprostszych codziennych sytuacjach." },
  { value: "B1", title: "B1 · Średniozaawansowany", description: "Rozmawiam samodzielnie o znanych tematach." },
  { value: "B2", title: "B2 · Zaawansowany", description: "Mówię i piszę swobodnie w pracy oraz na co dzień." },
  { value: "C1", title: "C1 · Bardzo zaawansowany", description: "Wyrażam złożone myśli płynnie, precyzyjnie i naturalnie." },
  { value: "C2", title: "C2 · Perfekcyjna biegłość", description: "Dążę do niemal perfekcyjnego mówienia i pisania." }
] as const;

export type EnglishLevel = typeof ENGLISH_LEVELS[number]["value"];
