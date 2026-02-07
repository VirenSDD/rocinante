import { setPlayData } from "../state/appState.js";

/**
 * @typedef {import('../../domain/ports/playLoaderPort.js').IPlayLoader} IPlayLoader
 * @typedef {import('../../domain/entities/play.js').PlayData} PlayData
 */

/**
 * @typedef {{
 *   data: PlayData;
 *   usedFallback: boolean;
 * }} LoadPlayResult
 */

/**
 * Create a load play use case.
 *
 * @param {IPlayLoader} playLoader - The play loader implementation
 * @returns {{ execute: () => Promise<LoadPlayResult> }}
 */
export function createLoadPlayUseCase(playLoader) {
  return {
    /**
     * Load play data and update application state.
     *
     * @returns {Promise<LoadPlayResult>}
     */
    async execute() {
      const result = await playLoader.load();
      setPlayData(result.data);
      return result;
    }
  };
}
