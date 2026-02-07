import {
  setSelectedCharacterId,
  getIsPlaying,
  resetPlaybackState
} from "../state/appState.js";

/**
 * @typedef {import('../../domain/ports/speechPort.js').ISpeechService} ISpeechService
 */

/**
 * Create a select character use case.
 *
 * @param {ISpeechService} speechService - The speech service implementation
 * @returns {{ execute: (characterId: string) => void }}
 */
export function createSelectCharacterUseCase(speechService) {
  return {
    /**
     * Select a character and reset playback state.
     *
     * @param {string} characterId - The character ID to select
     */
    execute(characterId) {
      // Stop any current playback
      if (getIsPlaying()) {
        speechService.cancel();
        resetPlaybackState();
      }

      setSelectedCharacterId(characterId);
    }
  };
}
