const colores: Record<string, string> = {
  "Alpine": "#ff539e",
  "Aston Martin": "#229971",
  "Audi": "#BB0A30",
  "Cadillac": "#C0A062",
  "Ferrari": "#E8002D",
  "Haas": "#B6BABD",
  "McLaren": "#FF8000",
  "Mercedes": "#27F4D2",
  "Racing Bulls": "#6692FF",
  "Red Bull": "#3671C6",
  "Williams": "#64C4FF"
};

export function colorEquipo(equipo?: string) {
  if (!equipo) {
    return "var(--negro)";
  }

  return colores[equipo] ?? "var(--negro)";
}
