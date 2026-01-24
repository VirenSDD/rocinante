import { speechSupported, state } from "./state.js";

/**
 * @param {string} id
 */
function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`No se encontró el elemento con id ${id}`);
  }
  return element;
}

export const elements = {
  title: /** @type {HTMLElement} */ (getRequiredElement("playTitle")),
  author: /** @type {HTMLElement} */ (getRequiredElement("playAuthor")),
  description: /** @type {HTMLElement} */ (getRequiredElement("playDescription")),
  characterSelect: /** @type {HTMLSelectElement} */ (getRequiredElement("characterSelect")),
  toggleLines: /** @type {HTMLButtonElement} */ (getRequiredElement("toggleLines")),
  textSizeRange: /** @type {HTMLInputElement} */ (getRequiredElement("textSizeRange")),
  textSizeLabel: /** @type {HTMLElement} */ (getRequiredElement("textSizeLabel")),
  speechRate: /** @type {HTMLInputElement} */ (getRequiredElement("speechRate")),
  speechRateLabel: /** @type {HTMLElement} */ (getRequiredElement("speechRateLabel")),
  playOthers: /** @type {HTMLButtonElement} */ (getRequiredElement("playOthers")),
  pauseSpeech: /** @type {HTMLButtonElement} */ (getRequiredElement("pauseSpeech")),
  stopSpeech: /** @type {HTMLButtonElement} */ (getRequiredElement("stopSpeech")),
  languageSelect: /** @type {HTMLSelectElement} */ (getRequiredElement("languageSelect")),
  currentLineText: /** @type {HTMLElement} */ (getRequiredElement("currentLineText")),
  statusMessage: /** @type {HTMLElement} */ (getRequiredElement("statusMessage")),
  characterList: /** @type {HTMLElement} */ (getRequiredElement("characterList")),
  linesContainer: /** @type {HTMLElement} */ (getRequiredElement("linesContainer"))
};

/**
 * @param {string} message
 */
export function setStatus(message) {
  elements.statusMessage.textContent = message;
}

/**
 * @param {string} message
 */
export function updateCurrentLineDisplay(message) {
  elements.currentLineText.textContent = message;
}

/**
 * @param {boolean} hideMyLines
 */
export function updateToggleButtonLabel(hideMyLines) {
  elements.toggleLines.textContent = hideMyLines ? "Mostrar mis parlamentos" : "Ocultar mis parlamentos";
}

/**
 * @param {number} size
 */
export function updateTextSizeLabel(size) {
  elements.textSizeLabel.textContent = `${size}px`;
}

/**
 * @param {number} rate
 */
export function updateSpeechRateLabel(rate) {
  elements.speechRateLabel.textContent = `${rate.toFixed(2)}x`;
}

/**
 * @param {number} size
 */
export function applyLineFontSize(size) {
  document.documentElement.style.setProperty("--line-text-size", `${size}px`);
}

export function updatePauseButtonView() {
  if (!speechSupported || !state.selectedCharacterId) {
    elements.pauseSpeech.disabled = true;
    elements.pauseSpeech.textContent = "Pausar lectura";
    return;
  }

  elements.pauseSpeech.disabled = !state.speechPlaying;
  if (!state.speechPlaying) {
    elements.pauseSpeech.textContent = "Pausar lectura";
  } else if (state.autoPausedForUser) {
    elements.pauseSpeech.textContent = "Continuar tras mi parlamento";
  } else if (state.isPaused) {
    elements.pauseSpeech.textContent = "Reanudar lectura";
  } else {
    elements.pauseSpeech.textContent = "Pausar lectura";
  }
}
