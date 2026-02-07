/**
 * @typedef {{ id: string; name: string }} Character
 */

/**
 * @typedef {{ characterIds: string[]; text: string }} PlayLine
 */

/**
 * @typedef {{
 *   playId: string;
 *   title: string;
 *   author: string;
 *   description: string;
 *   characters: Character[];
 *   lines: PlayLine[];
 * }} PlayData
 */

/**
 * Create a map from character ID to character name.
 *
 * @param {Character[]} characters - Array of characters
 * @returns {Record<string, string>} Map of character ID to name
 */
export function createCharacterMap(characters) {
  /** @type {Record<string, string>} */
  const map = {};
  for (const character of characters) {
    map[character.id] = character.name;
  }
  return map;
}

/**
 * Check if a line belongs to a specific character.
 *
 * @param {PlayLine} line - The play line to check
 * @param {string} characterId - The character ID to check for
 * @returns {boolean} True if the line includes the character
 */
export function isOwnLine(line, characterId) {
  return line.characterIds.includes(characterId);
}

/**
 * Get the display names for all characters in a line.
 *
 * @param {PlayLine} line - The play line
 * @param {Record<string, string>} characterMap - Map of character ID to name
 * @param {string} [separator=" + "] - Separator for multiple characters
 * @returns {string} Combined character names
 */
export function getLineCharacterNames(line, characterMap, separator = " + ") {
  return line.characterIds
    .map((id) => characterMap[id] || id)
    .join(separator);
}

/**
 * Check if there are any lines not belonging to a specific character.
 *
 * @param {PlayLine[]} lines - Array of play lines
 * @param {string} characterId - The character ID to exclude
 * @returns {boolean} True if there are other characters' lines
 */
export function hasOtherCharacterLines(lines, characterId) {
  return lines.some((line) => !isOwnLine(line, characterId));
}
