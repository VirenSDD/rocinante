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
  toggleLines: /** @type {HTMLButtonElement} */ (getRequiredElement("toggleLines")),
  textSizeRange: /** @type {HTMLInputElement} */ (getRequiredElement("textSizeRange")),
  textSizeLabel: /** @type {HTMLElement} */ (getRequiredElement("textSizeLabel")),
  speechRate: /** @type {HTMLInputElement} */ (getRequiredElement("speechRate")),
  speechRateLabel: /** @type {HTMLElement} */ (getRequiredElement("speechRateLabel")),
  playPauseBtn: /** @type {HTMLButtonElement} */ (getRequiredElement("playPauseBtn")),
  continueBtn: /** @type {HTMLButtonElement} */ (getRequiredElement("continueBtn")),
  languageSelect: /** @type {HTMLSelectElement} */ (getRequiredElement("languageSelect")),
  statusMessage: /** @type {HTMLElement} */ (getRequiredElement("statusMessage")),
  characterList: /** @type {HTMLElement} */ (getRequiredElement("characterList")),
  linesContainer: /** @type {HTMLElement} */ (getRequiredElement("linesContainer")),
  controlsSection: /** @type {HTMLElement} */ (getRequiredElement("controlsPanel")),
  controlsBody: /** @type {HTMLElement} */ (getRequiredElement("controlsBody")),
  controlsToggle: /** @type {HTMLButtonElement} */ (getRequiredElement("controlsToggle"))
};

let controlsCollapsed = true;

/**
 * @param {string} message
 */
export function setStatus(message) {
  elements.statusMessage.textContent = message;
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

export function updatePlaybackButtons() {
  const canPlay = speechSupported && state.selectedCharacterId;

  // Play/Pause button
  elements.playPauseBtn.disabled = !canPlay;
  if (!state.speechPlaying) {
    elements.playPauseBtn.textContent = "Reproducir";
  } else if (state.isPaused && !state.autoPausedForUser) {
    elements.playPauseBtn.textContent = "Reanudar";
  } else {
    elements.playPauseBtn.textContent = "Pausar";
  }

  // Continue button - only enabled when waiting for actor
  elements.continueBtn.disabled = !state.autoPausedForUser;
}

/**
 * @param {boolean} collapsed
 */
export function setControlsCollapsed(collapsed) {
  controlsCollapsed = collapsed;
  elements.controlsSection.classList.toggle("collapsed", collapsed);
  elements.controlsBody.hidden = collapsed;
  elements.controlsToggle.setAttribute("aria-expanded", String(!collapsed));
  elements.controlsToggle.textContent = collapsed ? "Mostrar panel de control" : "Ocultar panel de control";
}

export function toggleControlsPanel() {
  setControlsCollapsed(!controlsCollapsed);
}

export function getControlsCollapsed() {
  return controlsCollapsed;
}
