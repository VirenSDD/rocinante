import {
  applyLineFontSize,
  elements,
  setStatus,
  updatePlaybackButtons,
  updateSpeechRateLabel,
  updateTextSizeLabel,
  updateToggleButtonLabel
} from "../dom.js";
import { renderCharacterList, renderLines } from "../renderers.js";
import { speechSupported, state } from "../state.js";
import { togglePlayPause, continueAfterActor, stopSpeechPlayback, jumpToLine } from "../services/speech.js";

/**
 * @param {Event} event
 */
export function handleCharacterChange(event) {
  const target = /** @type {HTMLElement} */ (event.target);
  const characterItem = target.closest("[data-character-id]");
  if (!characterItem) return;
  const characterId = characterItem.getAttribute("data-character-id");
  if (!characterId) return;
  state.selectedCharacterId = characterId;
  state.hideMyLines = true;
  updateToggleButtonLabel(state.hideMyLines);
  elements.toggleLines.disabled = !state.selectedCharacterId;
  if (state.speechPlaying) {
    stopSpeechPlayback(false);
  }
  updatePlaybackButtons();
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
  elements.playPauseBtn.disabled = true;
  elements.continueBtn.disabled = true;
  if (!speechSupported) {
    elements.languageSelect.disabled = true;
    setStatus(
      "La lectura en voz alta no está disponible en este navegador. Puedes leer y ocultar tus parlamentos manualmente."
    );
  }
}

export function bindActionButtons() {
  elements.playPauseBtn.addEventListener("click", togglePlayPause);
  elements.continueBtn.addEventListener("click", continueAfterActor);
  elements.linesContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains("line-jump")) {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(target.dataset.lineIndex);
      if (Number.isNaN(index)) return;
      jumpToLine(index);
    }
  });
}
