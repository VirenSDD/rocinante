import {
  applyLineFontSize,
  elements,
  setStatus,
  updatePauseButtonView,
  updateSpeechRateLabel,
  updateTextSizeLabel,
  updateToggleButtonLabel
} from "../dom.js";
import { renderCharacterList, renderLines } from "../renderers.js";
import { speechSupported, state } from "../state.js";
import { pauseSpeech, playOtherVoices, stopSpeechPlayback } from "../services/speech.js";

/**
 * @param {Event} event
 */
export function handleCharacterChange(event) {
  const target = /** @type {HTMLSelectElement} */ (event.target);
  state.selectedCharacterId = target.value;
  state.hideMyLines = false;
  updateToggleButtonLabel(state.hideMyLines);
  elements.toggleLines.disabled = !state.selectedCharacterId;
  elements.playOthers.disabled = !state.selectedCharacterId || !speechSupported;
  elements.pauseSpeech.disabled = !state.selectedCharacterId;
  if (state.speechPlaying) {
    stopSpeechPlayback(false);
  }
  updatePauseButtonView();
  renderLines();
  renderCharacterList();
}

export function handleToggleLines() {
  if (!state.selectedCharacterId) return;
  state.hideMyLines = !state.hideMyLines;
  updateToggleButtonLabel(state.hideMyLines);
  renderLines();
}

/**
 * @param {Event} event
 */
export function handleTextSizeChange(event) {
  const target = /** @type {HTMLInputElement} */ (event.target);
  state.lineFontSize = Number(target.value);
  updateTextSizeLabel(state.lineFontSize);
  applyLineFontSize(state.lineFontSize);
}

/**
 * @param {Event} event
 */
export function handleSpeechRateChange(event) {
  const target = /** @type {HTMLInputElement} */ (event.target);
  state.speechRate = Number(target.value);
  updateSpeechRateLabel(state.speechRate);
}

/**
 * @param {Event} event
 */
export function handleLanguagePreferenceChange(event) {
  const target = /** @type {HTMLSelectElement} */ (event.target);
  state.preferredLanguage = target.value;
}

export function initializeControlsDefaults() {
  elements.toggleLines.disabled = true;
  elements.playOthers.disabled = true;
  elements.pauseSpeech.disabled = true;
  if (!speechSupported) {
    elements.playOthers.disabled = true;
    elements.pauseSpeech.disabled = true;
    elements.stopSpeech.disabled = true;
    elements.languageSelect.disabled = true;
    setStatus(
      "La lectura en voz alta no está disponible en este navegador. Puedes leer y ocultar tus parlamentos manualmente."
    );
  }
}

export function bindActionButtons() {
  elements.playOthers.addEventListener("click", playOtherVoices);
  elements.pauseSpeech.addEventListener("click", pauseSpeech);
  elements.stopSpeech.addEventListener("click", () => stopSpeechPlayback());
}
