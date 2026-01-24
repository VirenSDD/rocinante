import { elements, setControlsCollapsed, toggleControlsPanel, updateToggleButtonLabel } from "../dom.js";
import {
  bindActionButtons,
  handleCharacterChange,
  handleLanguagePreferenceChange,
  handleSpeechRateChange,
  handleTextSizeChange,
  handleToggleLines,
  initializeControlsDefaults
} from "./handlers.js";
import { state } from "../state.js";

export function initControls() {
  initializeControlsDefaults();
  updateToggleButtonLabel(state.hideMyLines);
  elements.characterList.addEventListener("click", handleCharacterChange);
  elements.characterList.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCharacterChange(event);
    }
  });
  elements.toggleLines.addEventListener("click", handleToggleLines);
  elements.textSizeRange.addEventListener("input", handleTextSizeChange);
  elements.speechRate.addEventListener("input", handleSpeechRateChange);
  elements.languageSelect.addEventListener("change", handleLanguagePreferenceChange);
  bindActionButtons();
  setControlsCollapsed(true);
  elements.controlsToggle.addEventListener("click", () => {
    toggleControlsPanel();
  });
}
