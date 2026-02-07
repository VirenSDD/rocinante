import { isOwnLine, getLineCharacterNames } from "../../domain/entities/play.js";
import { t } from "../i18n/i18n.js";

/**
 * @typedef {import('../../domain/entities/play.js').PlayLine} PlayLine
 */

/**
 * @typedef {{
 *   selectedCharacterId: string;
 *   characterMap: Record<string, string>;
 *   hideMyLines: boolean;
 *   activeLineIndex: number | null;
 * }} RenderOptions
 */

/**
 * Render all line cards.
 *
 * @param {HTMLElement} container - The container element
 * @param {PlayLine[]} lines - Array of play lines
 * @param {RenderOptions} options - Rendering options
 */
export function renderLineCards(container, lines, options) {
  container.innerHTML = "";

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const card = createLineCard(line, index, options);
    container.appendChild(card);
  }
}

/**
 * Create a single line card element.
 *
 * @param {PlayLine} line - The play line
 * @param {number} index - The line index
 * @param {RenderOptions} options - Rendering options
 * @returns {HTMLElement}
 */
function createLineCard(line, index, options) {
  const { selectedCharacterId, characterMap, hideMyLines, activeLineIndex } = options;

  const card = document.createElement("article");
  card.className = "line-card";
  card.dataset.lineIndex = String(index);
  card.tabIndex = 0;

  const includesSelected = selectedCharacterId && isOwnLine(line, selectedCharacterId);

  if (includesSelected) {
    card.classList.add("highlight");
  }

  if (activeLineIndex === index) {
    card.classList.add("narrating");
  }

  // Characters header
  const charactersEl = document.createElement("div");
  charactersEl.className = "line-characters";
  charactersEl.textContent = getLineCharacterNames(line, characterMap);
  card.appendChild(charactersEl);

  // Line text
  const textEl = document.createElement("p");
  textEl.className = "line-text";
  textEl.dataset.text = line.text;

  if (includesSelected && hideMyLines) {
    textEl.classList.add("hidden");
    textEl.textContent = "";
  } else {
    textEl.textContent = line.text;
  }

  card.appendChild(textEl);

  // Actions
  const actionsEl = document.createElement("div");
  actionsEl.className = "line-actions";

  const jumpBtn = document.createElement("button");
  jumpBtn.type = "button";
  jumpBtn.className = "line-jump";
  jumpBtn.dataset.lineIndex = String(index);
  jumpBtn.textContent = t("button.playFromLine");
  jumpBtn.setAttribute(
    "aria-label",
    t("label.playFromLineAria", { characters: getLineCharacterNames(line, characterMap) })
  );

  actionsEl.appendChild(jumpBtn);
  card.appendChild(actionsEl);

  // Reveal on click
  card.addEventListener("click", (event) => {
    // Don't reveal if clicking the jump button
    if (event.target instanceof HTMLElement && event.target.classList.contains("line-jump")) {
      return;
    }
    revealLine(textEl);
  });

  card.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      revealLine(textEl);
    }
  });

  return card;
}

/**
 * Reveal a hidden line's text.
 *
 * @param {HTMLParagraphElement} textElement - The text element to reveal
 */
function revealLine(textElement) {
  if (!textElement.classList.contains("hidden")) return;
  textElement.classList.remove("hidden");
  textElement.textContent = textElement.dataset.text ?? "";
}

/**
 * Apply line font size via CSS custom property.
 *
 * @param {number} size - Font size in pixels
 */
export function applyLineFontSize(size) {
  document.documentElement.style.setProperty("--line-text-size", `${size}px`);
}

/**
 * Scroll the active line into view.
 *
 * @param {HTMLElement} container - The lines container
 * @param {number | null} activeLineIndex - The active line index
 * @param {{ isPlaying: boolean; isAutoPausedForUser: boolean }} state - Current playback state
 */
export function scrollActiveLineIntoView(container, activeLineIndex, state) {
  if (activeLineIndex == null) return;
  if (!state.isPlaying && !state.isAutoPausedForUser) return;

  const selector = `[data-line-index="${activeLineIndex}"]`;
  const target = container.querySelector(selector);
  if (!target) return;

  target.scrollIntoView({ block: "center", behavior: "smooth" });
}
