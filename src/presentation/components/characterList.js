/**
 * @typedef {import('../../domain/entities/play.js').Character} Character
 */

/**
 * Render the character selection list.
 *
 * @param {HTMLElement} container - The container element
 * @param {Character[]} characters - Array of characters
 * @param {string} selectedId - Currently selected character ID
 */
export function renderCharacterList(container, characters, selectedId) {
  container.innerHTML = "";

  for (const character of characters) {
    const li = document.createElement("li");
    li.textContent = character.name;
    li.tabIndex = 0;
    li.dataset.characterId = character.id;

    if (selectedId === character.id) {
      li.classList.add("selected");
    }

    container.appendChild(li);
  }
}
