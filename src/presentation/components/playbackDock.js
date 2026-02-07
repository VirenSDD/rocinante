import { t } from "../i18n/i18n.js";

/**
 * @typedef {{
 *   playPauseBtn: HTMLButtonElement;
 *   continueBtn: HTMLButtonElement;
 * }} PlaybackElements
 */

/**
 * @typedef {{
 *   isPlaying: boolean;
 *   isPaused: boolean;
 *   isAutoPausedForUser: boolean;
 *   hasCharacter: boolean;
 *   speechSupported: boolean;
 * }} PlaybackUIState
 */

/**
 * Update the playback buttons based on current state.
 *
 * @param {PlaybackElements} elements - The playback button elements
 * @param {PlaybackUIState} state - Current playback state
 */
export function updatePlaybackButtons(elements, state) {
  const canPlay = state.speechSupported && state.hasCharacter;

  // Play/Pause button
  elements.playPauseBtn.disabled = !canPlay;

  if (!state.isPlaying) {
    elements.playPauseBtn.textContent = t("button.play");
  } else if (state.isPaused && !state.isAutoPausedForUser) {
    elements.playPauseBtn.textContent = t("button.resume");
  } else {
    elements.playPauseBtn.textContent = t("button.pause");
  }

  // Continue button - only enabled when waiting for actor
  elements.continueBtn.disabled = !state.isAutoPausedForUser;
}
