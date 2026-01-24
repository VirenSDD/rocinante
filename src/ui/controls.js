import { elements } from "../dom.js";
import {
  bindActionButtons,
  handleCharacterChange,
  handleLanguagePreferenceChange,
  handleSpeechRateChange,
  handleTextSizeChange,
  handleToggleLines,
  initializeControlsDefaults
} from "./handlers.js";

export function initControls() {
  initializeControlsDefaults();
  elements.characterSelect.addEventListener("change", handleCharacterChange);
  elements.toggleLines.addEventListener("click", handleToggleLines);
  elements.textSizeRange.addEventListener("input", handleTextSizeChange);
  elements.speechRate.addEventListener("input", handleSpeechRateChange);
  elements.languageSelect.addEventListener("change", handleLanguagePreferenceChange);
  bindActionButtons();
}
