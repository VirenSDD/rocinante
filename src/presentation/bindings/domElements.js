import { t } from "../i18n/i18n.js";

/**
 * Get a required DOM element by ID. Throws if not found.
 *
 * @param {string} id - Element ID
 * @returns {HTMLElement}
 */
function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(t("error.elementNotFound", { id }));
  }
  return element;
}

/**
 * Get all required DOM elements for the application.
 *
 * @returns {{
 *   title: HTMLElement;
 *   author: HTMLElement;
 *   description: HTMLElement;
 *   toggleLines: HTMLButtonElement;
 *   textSizeRange: HTMLInputElement;
 *   textSizeLabel: HTMLElement;
 *   speechRate: HTMLInputElement;
 *   speechRateLabel: HTMLElement;
 *   playPauseBtn: HTMLButtonElement;
 *   continueBtn: HTMLButtonElement;
 *   languageSelect: HTMLSelectElement;
 *   statusMessage: HTMLElement;
 *   characterList: HTMLElement;
 *   linesContainer: HTMLElement;
 *   controlsSection: HTMLElement;
 *   controlsBody: HTMLElement;
 *   controlsToggle: HTMLButtonElement;
 * }}
 */
export function getDOMElements() {
  return {
    title: getRequiredElement("playTitle"),
    author: getRequiredElement("playAuthor"),
    description: getRequiredElement("playDescription"),
    toggleLines: /** @type {HTMLButtonElement} */ (getRequiredElement("toggleLines")),
    textSizeRange: /** @type {HTMLInputElement} */ (getRequiredElement("textSizeRange")),
    textSizeLabel: getRequiredElement("textSizeLabel"),
    speechRate: /** @type {HTMLInputElement} */ (getRequiredElement("speechRate")),
    speechRateLabel: getRequiredElement("speechRateLabel"),
    playPauseBtn: /** @type {HTMLButtonElement} */ (getRequiredElement("playPauseBtn")),
    continueBtn: /** @type {HTMLButtonElement} */ (getRequiredElement("continueBtn")),
    languageSelect: /** @type {HTMLSelectElement} */ (getRequiredElement("languageSelect")),
    statusMessage: getRequiredElement("statusMessage"),
    characterList: getRequiredElement("characterList"),
    linesContainer: getRequiredElement("linesContainer"),
    controlsSection: getRequiredElement("controlsPanel"),
    controlsBody: getRequiredElement("controlsBody"),
    controlsToggle: /** @type {HTMLButtonElement} */ (getRequiredElement("controlsToggle"))
  };
}
