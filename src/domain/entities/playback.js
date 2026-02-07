/**
 * @typedef {import('./play.js').PlayLine} PlayLine
 */

/**
 * @typedef {{
 *   line: PlayLine;
 *   idx: number;
 * }} PlaybackQueueItem
 */

/**
 * @typedef {{
 *   isPlaying: boolean;
 *   isPaused: boolean;
 *   isAutoPausedForUser: boolean;
 *   activeLineIndex: number | null;
 *   currentQueueIndex: number;
 * }} PlaybackState
 */

/**
 * Create an initial playback state.
 *
 * @returns {PlaybackState} Initial playback state with all values reset
 */
export function createInitialPlaybackState() {
  return {
    isPlaying: false,
    isPaused: false,
    isAutoPausedForUser: false,
    activeLineIndex: null,
    currentQueueIndex: 0
  };
}

/**
 * Detect the language of a text string.
 * Prioritizes Spanish detection for this theater app.
 *
 * @param {string} text - The text to analyze
 * @returns {"es-ES" | "en-US"} The detected language code
 */
export function detectLanguage(text) {
  const trimmed = text.toLowerCase();

  // Check for Spanish-specific characters and common words
  const spanishRegex = /[\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc\u00bf\u00a1]/i;
  if (spanishRegex.test(text)) {
    return "es-ES";
  }

  // Check for common Spanish words
  if (/\b(que|para|sue\u00f1o|besos|nadie|corte)\b/.test(trimmed)) {
    return "es-ES";
  }

  // Check for common English words
  if (/\b(the|and|but|you|love|night)\b/.test(trimmed)) {
    return "en-US";
  }

  // Default to Spanish for this theater app
  return "es-ES";
}

/**
 * Create a playback queue from play lines.
 *
 * @param {PlayLine[]} lines - Array of play lines
 * @returns {PlaybackQueueItem[]} Queue items with line and index
 */
export function createPlaybackQueue(lines) {
  return lines.map((line, idx) => ({ line, idx }));
}

/**
 * Get the next valid queue index, clamped to queue bounds.
 *
 * @param {number} requestedIndex - The requested starting index
 * @param {number} queueLength - Total length of the queue
 * @returns {number} Valid queue index
 */
export function clampQueueIndex(requestedIndex, queueLength) {
  if (queueLength === 0) return 0;
  return Math.min(Math.max(requestedIndex, 0), queueLength - 1);
}
