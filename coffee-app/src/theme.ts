// Colours for the whole app, defined once. Light and dark versions
// follow the phone's or computer's dark-mode setting.

const light = {
  bg: "#f6f4f1",
  surface: "#ffffff",
  text: "#2b2420",
  muted: "#7a6f68",
  accent: "#8a5a3b",
  danger: "#c0392b",
  border: "#e4ded8",
};

const dark: typeof light = {
  bg: "#1c1917",
  surface: "#292524",
  text: "#f5f0eb",
  muted: "#a8a29e",
  accent: "#a8714a",
  danger: "#f87171",
  border: "#3f3a36",
};

export function getColors(scheme: string | null | undefined) {
  return scheme === "dark" ? dark : light;
}
