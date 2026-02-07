import { t, formatLanguageLabel } from "../i18n/i18n.js";

/**
 * @typedef {import('../../domain/ports/speechPort.js').VoiceInfo} VoiceInfo
 */

/**
 * Populate the language select dropdown with available voices.
 *
 * @param {HTMLSelectElement} selectEl - The select element
 * @param {VoiceInfo[]} voices - Available voices
 * @param {string} currentValue - Current selected value
 */
export function updateLanguageOptions(selectEl, voices, currentValue) {
  const previousValue = selectEl.value || currentValue;
  selectEl.innerHTML = "";

  // Auto-detect option
  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = t("label.languageAutoDetect");
  selectEl.appendChild(autoOption);

  // Collect unique languages
  /** @type {Set<string>} */
  const seen = new Set();
  for (const voice of voices) {
    if (voice.lang) {
      seen.add(voice.lang);
    }
  }

  // Add language options
  const sortedLangs = Array.from(seen).sort();
  for (const lang of sortedLangs) {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = formatLanguageLabel(lang);
    selectEl.appendChild(option);
  }

  // Restore previous selection
  selectEl.value = previousValue || "auto";
}
