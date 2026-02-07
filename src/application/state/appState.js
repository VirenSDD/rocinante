import { createCharacterMap } from "../../domain/entities/play.js";
import { createInitialPlaybackState } from "../../domain/entities/playback.js";
import { emit } from "./stateEvents.js";

/**
 * @typedef {import('../../domain/entities/play.js').PlayData} PlayData
 * @typedef {import('../../domain/entities/play.js').PlayLine} PlayLine
 * @typedef {import('../../domain/ports/speechPort.js').VoiceInfo} VoiceInfo
 */

/**
 * @typedef {{
 *   playData: PlayData | null;
 *   characterMap: Record<string, string>;
 *   selectedCharacterId: string;
 *   hideMyLines: boolean;
 *   lineFontSize: number;
 *   speechRate: number;
 *   preferredLanguage: string;
 *   voices: VoiceInfo[];
 *   isPlaying: boolean;
 *   isPaused: boolean;
 *   isAutoPausedForUser: boolean;
 *   activeLineIndex: number | null;
 *   playbackQueue: Array<{ line: PlayLine; idx: number }>;
 *   currentQueueIndex: number;
 * }} AppState
 */

/** @type {AppState} */
const state = {
  playData: null,
  characterMap: {},
  selectedCharacterId: "",
  hideMyLines: true,
  lineFontSize: 18,
  speechRate: 1,
  preferredLanguage: "auto",
  voices: [],
  isPlaying: false,
  isPaused: false,
  isAutoPausedForUser: false,
  activeLineIndex: null,
  playbackQueue: [],
  currentQueueIndex: 0
};

// Play data
/**
 * @returns {PlayData | null}
 */
export function getPlayData() {
  return state.playData;
}

/**
 * @param {PlayData} playData
 */
export function setPlayData(playData) {
  state.playData = playData;
  state.characterMap = createCharacterMap(playData.characters);
  resetPlaybackState();
  emit("playDataChanged", playData);
}

/**
 * @returns {Record<string, string>}
 */
export function getCharacterMap() {
  return state.characterMap;
}

// Character selection
/**
 * @returns {string}
 */
export function getSelectedCharacterId() {
  return state.selectedCharacterId;
}

/**
 * @param {string} characterId
 */
export function setSelectedCharacterId(characterId) {
  state.selectedCharacterId = characterId;
  state.hideMyLines = true;
  emit("characterSelected", characterId);
  emit("hideMyLinesChanged", true);
}

// Hide my lines
/**
 * @returns {boolean}
 */
export function getHideMyLines() {
  return state.hideMyLines;
}

/**
 * @param {boolean} hide
 */
export function setHideMyLines(hide) {
  state.hideMyLines = hide;
  emit("hideMyLinesChanged", hide);
}

// Line font size
/**
 * @returns {number}
 */
export function getLineFontSize() {
  return state.lineFontSize;
}

/**
 * @param {number} size
 */
export function setLineFontSize(size) {
  state.lineFontSize = size;
  emit("lineFontSizeChanged", size);
}

// Speech rate
/**
 * @returns {number}
 */
export function getSpeechRate() {
  return state.speechRate;
}

/**
 * @param {number} rate
 */
export function setSpeechRate(rate) {
  state.speechRate = rate;
  emit("speechRateChanged", rate);
}

// Preferred language
/**
 * @returns {string}
 */
export function getPreferredLanguage() {
  return state.preferredLanguage;
}

/**
 * @param {string} language
 */
export function setPreferredLanguage(language) {
  state.preferredLanguage = language;
  emit("preferredLanguageChanged", language);
}

// Voices
/**
 * @returns {VoiceInfo[]}
 */
export function getVoices() {
  return state.voices;
}

/**
 * @param {VoiceInfo[]} voices
 */
export function setVoices(voices) {
  state.voices = voices;
  emit("voicesChanged", voices);
}

// Playback state
/**
 * @returns {boolean}
 */
export function getIsPlaying() {
  return state.isPlaying;
}

/**
 * @returns {boolean}
 */
export function getIsPaused() {
  return state.isPaused;
}

/**
 * @returns {boolean}
 */
export function getIsAutoPausedForUser() {
  return state.isAutoPausedForUser;
}

/**
 * @returns {number | null}
 */
export function getActiveLineIndex() {
  return state.activeLineIndex;
}

/**
 * @returns {Array<{ line: PlayLine; idx: number }>}
 */
export function getPlaybackQueue() {
  return state.playbackQueue;
}

/**
 * @returns {number}
 */
export function getCurrentQueueIndex() {
  return state.currentQueueIndex;
}

/**
 * @param {{
 *   isPlaying?: boolean;
 *   isPaused?: boolean;
 *   isAutoPausedForUser?: boolean;
 *   activeLineIndex?: number | null;
 *   playbackQueue?: Array<{ line: PlayLine; idx: number }>;
 *   currentQueueIndex?: number;
 * }} updates
 */
export function updatePlaybackState(updates) {
  if (updates.isPlaying !== undefined) state.isPlaying = updates.isPlaying;
  if (updates.isPaused !== undefined) state.isPaused = updates.isPaused;
  if (updates.isAutoPausedForUser !== undefined) state.isAutoPausedForUser = updates.isAutoPausedForUser;
  if (updates.activeLineIndex !== undefined) state.activeLineIndex = updates.activeLineIndex;
  if (updates.playbackQueue !== undefined) state.playbackQueue = updates.playbackQueue;
  if (updates.currentQueueIndex !== undefined) state.currentQueueIndex = updates.currentQueueIndex;
  emit("playbackStateChanged", {
    isPlaying: state.isPlaying,
    isPaused: state.isPaused,
    isAutoPausedForUser: state.isAutoPausedForUser,
    currentQueueIndex: state.currentQueueIndex
  });
  if (updates.activeLineIndex !== undefined) {
    emit("activeLineChanged", state.activeLineIndex);
  }
}

/**
 * Reset playback state to initial values.
 */
export function resetPlaybackState() {
  const initial = createInitialPlaybackState();
  state.isPlaying = initial.isPlaying;
  state.isPaused = initial.isPaused;
  state.isAutoPausedForUser = initial.isAutoPausedForUser;
  state.activeLineIndex = initial.activeLineIndex;
  state.currentQueueIndex = initial.currentQueueIndex;
  state.playbackQueue = [];
  emit("playbackStateChanged", {
    isPlaying: false,
    isPaused: false,
    isAutoPausedForUser: false,
    currentQueueIndex: 0
  });
  emit("activeLineChanged", null);
}

/**
 * Check if speech is supported based on whether voices are available.
 * @returns {boolean}
 */
export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
