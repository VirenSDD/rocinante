import { elements, applyLineFontSize } from "./dom.js";
import { state } from "./state.js";

export function renderHeading() {
  if (!state.data) return;
  elements.title.textContent = state.data.title;
  elements.author.textContent = `Autor: ${state.data.author}`;
  elements.description.textContent = state.data.description;
}

export function renderCharacterList() {
  if (!state.data) return;
  elements.characterList.innerHTML = "";
  state.data.characters.forEach((character) => {
    const li = document.createElement("li");
    li.textContent = character.name;
    if (state.selectedCharacterId === character.id) {
      li.classList.add("selected");
    }
    li.tabIndex = 0;
    li.dataset.characterId = character.id;
    elements.characterList.appendChild(li);
  });
}

export function renderLines() {
  if (!state.data) return;
  elements.linesContainer.innerHTML = "";

  state.data.lines.forEach((line, index) => {
    const card = document.createElement("article");
    card.className = "line-card";
    card.dataset.lineIndex = String(index);
    const includesSelected =
      state.selectedCharacterId && line.characterIds.includes(state.selectedCharacterId);
    if (includesSelected) {
      card.classList.add("highlight");
    }
    if (state.activeLineIndex === index) {
      card.classList.add("narrating");
    }

    const charactersEl = document.createElement("div");
    charactersEl.className = "line-characters";
    charactersEl.textContent = line.characterIds
      .map((id) => state.characterMap[id] || id)
      .join(" + ");
    card.appendChild(charactersEl);

    const textEl = document.createElement("p");
    textEl.className = "line-text";
    textEl.dataset.text = line.text;
    if (includesSelected && state.hideMyLines) {
      textEl.classList.add("hidden");
      textEl.textContent = "";
    } else {
      textEl.textContent = line.text;
    }

    card.appendChild(textEl);
    card.tabIndex = 0;
    card.addEventListener("click", () => revealLine(textEl));
    card.addEventListener("keypress", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        revealLine(textEl);
      }
    });

    elements.linesContainer.appendChild(card);
  });

  applyLineFontSize(state.lineFontSize);
  scrollActiveLineIntoView();
}

/**
 * @param {HTMLParagraphElement} textElement
 */
function revealLine(textElement) {
  if (!textElement.classList.contains("hidden")) return;
  textElement.classList.remove("hidden");
  textElement.textContent = textElement.dataset.text ?? "";
}

function scrollActiveLineIntoView() {
  if (state.activeLineIndex == null) return;
  if (!state.speechPlaying && !state.autoPausedForUser) return;
  const selector = `[data-line-index="${state.activeLineIndex}"]`;
  const target = elements.linesContainer.querySelector(selector);
  if (!target) return;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
}
