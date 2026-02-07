import { t } from "../i18n/i18n.js";

/**
 * Render the play heading with title, author, and description.
 *
 * @param {{
 *   titleEl: HTMLElement;
 *   authorEl: HTMLElement;
 *   descriptionEl: HTMLElement;
 * }} elements - The DOM elements to render into
 * @param {{
 *   title: string;
 *   author: string;
 *   description: string;
 * }} data - The play data to display
 */
export function renderHeading(elements, data) {
  elements.titleEl.textContent = data.title;
  elements.authorEl.textContent = t("label.author", { author: data.author });
  elements.descriptionEl.textContent = data.description;
}
