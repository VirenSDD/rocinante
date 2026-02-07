import { FALLBACK_PLAY } from "../config/fallbackData.js";

/**
 * @typedef {import('../../domain/ports/playLoaderPort.js').IPlayLoader} IPlayLoader
 * @typedef {import('../../domain/ports/playLoaderPort.js').PlayLoadResult} PlayLoadResult
 */

/**
 * Create a fetch-based play loader implementing IPlayLoader.
 *
 * @param {string} [playJsonPath="play.json"] - Path to the play.json file
 * @returns {IPlayLoader}
 */
export function createFetchPlayLoader(playJsonPath = "play.json") {
  return {
    /**
     * Load play data from JSON file with fallback to embedded data.
     *
     * @returns {Promise<PlayLoadResult>}
     */
    async load() {
      try {
        const response = await fetch(playJsonPath, { cache: "no-cache" });
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
  };
}
