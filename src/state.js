import { FALLBACK_PLAY } from "./constants.js";

/**
 * @typedef {{ id: string, name: string }} Character
 * @typedef {{ characterIds: string[], text: string }} PlayLine
 * @typedef {{
 *   playId: string;
 *   title: string;
 *   author: string;
 *   description: string;
 *   characters: Character[];
 *   lines: PlayLine[];
 * }} PlayData
 */

export const speechSupported = "speechSynthesis" in window;

/** @type {{
 *   data: PlayData | null;
 *   characterMap: Record<string, string>;
 *   selectedCharacterId: string;
 *   hideMyLines: boolean;
 *   lineFontSize: number;
 *   speechRate: number;
 *   speechPlaying: boolean;
 *   currentUtterance: SpeechSynthesisUtterance | null;
 *   voices: SpeechSynthesisVoice[];
 *   preferredLanguage: string;
 *   activeLineIndex: number | null;
 *   isPaused: boolean;
 *   autoPausedForUser: boolean;
 *   playbackQueue: Array<{ line: PlayLine; idx: number }>;
 *   currentQueueIndex: number;
 * }} */
export const state = {
  data: null,
  characterMap: {},
  selectedCharacterId: "",
  hideMyLines: false,
  lineFontSize: 18,
  speechRate: 1,
  speechPlaying: false,
  currentUtterance: null,
  voices: [],
  preferredLanguage: "auto",
  activeLineIndex: null,
  isPaused: false,
  autoPausedForUser: false,
  playbackQueue: [],
  currentQueueIndex: 0
};

/**
 * @param {PlayData} playData
 */
export function applyPlayData(playData) {
  state.data = playData;
  state.characterMap = playData.characters.reduce((map, character) => {
    map[character.id] = character.name;
    return map;
  }, /** @type {Record<string, string>} */ ({}));
  resetPlaybackState();
}

export function resetPlaybackState() {
  state.playbackQueue = [];
  state.currentQueueIndex = 0;
  state.currentUtterance = null;
  state.speechPlaying = false;
  state.activeLineIndex = null;
  state.isPaused = false;
  state.autoPausedForUser = false;
}

export const fallbackPlayData = FALLBACK_PLAY;
