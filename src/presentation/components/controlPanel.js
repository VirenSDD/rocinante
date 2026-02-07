import { t } from "../i18n/i18n.js";

/**
 * @typedef {{
 *   controlsSection: HTMLElement;
 *   controlsBody: HTMLElement;
 *   controlsToggle: HTMLButtonElement;
 * }} ControlPanelElements
 */

/**
 * Set the collapsed state of the controls panel.
 *
 * @param {ControlPanelElements} elements - The control panel elements
 * @param {boolean} collapsed - Whether to collapse the panel
 */
export function setControlsCollapsed(elements, collapsed) {
  elements.controlsSection.classList.toggle("collapsed", collapsed);
  elements.controlsBody.hidden = collapsed;
  elements.controlsToggle.setAttribute("aria-expanded", String(!collapsed));
  elements.controlsToggle.textContent = collapsed
    ? t("button.showControlPanel")
    : t("button.hideControlPanel");
}

/**
 * Update the toggle lines button label.
 *
 * @param {HTMLButtonElement} button - The toggle button
 * @param {boolean} hideMyLines - Current hide state
 */
export function updateToggleButtonLabel(button, hideMyLines) {
  button.textContent = hideMyLines ? t("button.showMyLines") : t("button.hideMyLines");
}

/**
 * Update the text size label.
 *
 * @param {HTMLElement} labelEl - The label element
 * @param {number} size - Font size in pixels
 */
export function updateTextSizeLabel(labelEl, size) {
  labelEl.textContent = t("label.textSizePx", { size });
}

/**
 * Update the speech rate label.
 *
 * @param {HTMLElement} labelEl - The label element
 * @param {number} rate - Speech rate
 */
export function updateSpeechRateLabel(labelEl, rate) {
  labelEl.textContent = t("label.speechRateX", { rate: rate.toFixed(2) });
}
