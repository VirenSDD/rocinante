/**
 * @typedef {ReturnType<import('./domElements.js').getDOMElements>} DOMElements
 */

/**
 * @typedef {{
 *   onCharacterSelect: (characterId: string) => void;
 *   onToggleLines: () => void;
 *   onTextSizeChange: (size: number) => void;
 *   onSpeechRateChange: (rate: number) => void;
 *   onLanguageChange: (language: string) => void;
 *   onPlayPause: () => void;
 *   onContinue: () => void;
 *   onJumpToLine: (lineIndex: number) => void;
 *   onControlsToggle: () => void;
 * }} EventHandlers
 */

/**
 * Bind all event listeners to DOM elements.
 *
 * @param {DOMElements} elements - The DOM elements
 * @param {EventHandlers} handlers - The event handlers
 */
export function bindEvents(elements, handlers) {
  // Character selection
  elements.characterList.addEventListener("click", (event) => {
    const characterId = getCharacterIdFromEvent(event);
    if (characterId) {
      handlers.onCharacterSelect(characterId);
    }
  });

  elements.characterList.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const characterId = getCharacterIdFromEvent(event);
      if (characterId) {
        handlers.onCharacterSelect(characterId);
      }
    }
  });

  // Toggle lines
  elements.toggleLines.addEventListener("click", () => {
    handlers.onToggleLines();
  });

  // Text size
  elements.textSizeRange.addEventListener("input", (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    handlers.onTextSizeChange(Number(target.value));
  });

  // Speech rate
  elements.speechRate.addEventListener("input", (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    handlers.onSpeechRateChange(Number(target.value));
  });

  // Language preference
  elements.languageSelect.addEventListener("change", (event) => {
    const target = /** @type {HTMLSelectElement} */ (event.target);
    handlers.onLanguageChange(target.value);
  });

  // Play/Pause
  elements.playPauseBtn.addEventListener("click", () => {
    handlers.onPlayPause();
  });

  // Continue
  elements.continueBtn.addEventListener("click", () => {
    handlers.onContinue();
  });

  // Jump to line
  elements.linesContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains("line-jump")) {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(target.dataset.lineIndex);
      if (!Number.isNaN(index)) {
        handlers.onJumpToLine(index);
      }
    }
  });

  // Controls toggle
  elements.controlsToggle.addEventListener("click", () => {
    handlers.onControlsToggle();
  });
}

/**
 * Extract character ID from a click/keypress event.
 *
 * @param {Event} event
 * @returns {string | null}
 */
function getCharacterIdFromEvent(event) {
  const target = /** @type {HTMLElement} */ (event.target);
  const characterItem = target.closest("[data-character-id]");
  if (!characterItem) return null;
  return characterItem.getAttribute("data-character-id");
}
