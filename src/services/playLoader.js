import { FALLBACK_PLAY } from "../constants.js";

export async function loadPlayData() {
  try {
    const response = await fetch("play.json", { cache: "no-cache" });
    if (!response.ok) {
      throw new Error("No se pudo cargar el texto.");
    }
    const data = await response.json();
    return { data, usedFallback: false };
  } catch (error) {
    console.error(error);
    return {
      data: FALLBACK_PLAY,
      usedFallback: true
    };
  }
}
