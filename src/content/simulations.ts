/**
 * The simulators an example can be viewed through. Safe for the client: the example page, the
 * demo documents and the parsers all read these ids. The descriptions of each kind live in
 * content/symulatory/<kind>.md, see simulators.ts.
 */

/** A kind groups the ids that teach the same thing; each kind has one Markdown file. */
export const simulationKinds = ["barwy", "slabe-widzenie", "klawiatura", "czytnik", "waski-ekran"] as const;
export type SimulationKind = (typeof simulationKinds)[number];

/**
 * One entry per value of `?symulacja=`, in the order the picker lists them. `hint` is the line
 * under the name in the picker.
 */
export const simulations = {
  deuteranopia: { kind: "barwy", label: "Deuteranopia", hint: "Zieleń i czerwień wyglądają podobnie." },
  protanopia: { kind: "barwy", label: "Protanopia", hint: "Czerwień ciemnieje i zlewa się z zielenią." },
  tritanopia: { kind: "barwy", label: "Tritanopia", hint: "Niebieski zlewa się z zielonym." },
  achromatopsja: { kind: "barwy", label: "Achromatopsja", hint: "Same odcienie szarości." },
  "slabe-widzenie": { kind: "slabe-widzenie", label: "Słabe widzenie", hint: "Rozmycie i niski kontrast." },
  klawiatura: { kind: "klawiatura", label: "Tylko klawiatura", hint: "Mysz nie działa, fokus dostaje numery." },
  czytnik: { kind: "czytnik", label: "Czytnik ekranu", hint: "Co przeczyta czytnik, po kolei." },
  "320px": { kind: "waski-ekran", label: "320 pikseli", hint: "Tyle, ile widać przy powiększeniu 400%." },
  "tekst-200": { kind: "waski-ekran", label: "Tekst 200%", hint: "Tekst dwa razy większy." },
} as const satisfies Record<string, { kind: SimulationKind; label: string; hint: string }>;

export type SimulationId = keyof typeof simulations;

export function isSimulationId(value: unknown): value is SimulationId {
  return typeof value === "string" && Object.hasOwn(simulations, value);
}

/** Every id in picker order. */
export const simulationIds: readonly SimulationId[] = Object.keys(simulations).filter(isSimulationId);

/** The id a "Wypróbuj na" link preselects for each kind. For colour, the commonest type. */
export const firstOfKind = {
  barwy: "deuteranopia",
  "slabe-widzenie": "slabe-widzenie",
  klawiatura: "klawiatura",
  czytnik: "czytnik",
  "waski-ekran": "320px",
} as const satisfies Record<SimulationKind, SimulationId>;
