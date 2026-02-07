import { isOwnLine, getLineCharacterNames } from "../../domain/entities/play.js";
import { detectLanguage, createPlaybackQueue, clampQueueIndex } from "../../domain/entities/playback.js";
import {
  getPlayData,
  getSelectedCharacterId,
  getCharacterMap,
  getSpeechRate,
  getPreferredLanguage,
  getIsPlaying,
  getIsPaused,
  getIsAutoPausedForUser,
  getPlaybackQueue,
  getCurrentQueueIndex,
  updatePlaybackState,
  resetPlaybackState,
  isSpeechSupported
} from "../state/appState.js";

/**
 * @typedef {import('../../domain/ports/speechPort.js').ISpeechService} ISpeechService
 */

/**
 * @typedef {"started" | "paused" | "resumed" | "stopped" | "finished" | "yourTurn" | "continuing" | "error" | "noCharacter" | "noPlay" | "noOtherLines" | "speechUnavailable" | "jumpError"} PlaybackEventType
 */

/**
 * @typedef {(event: PlaybackEventType) => void} PlaybackEventCallback
 */

/**
 * Create a playback controller.
 *
 * @param {ISpeechService} speechService - The speech service implementation
 * @param {PlaybackEventCallback} onEvent - Callback for playback events
 * @returns {{
 *   togglePlayPause: () => void;
 *   continueAfterActor: () => void;
 *   jumpToLine: (lineIndex: number) => void;
 *   stop: () => void;
 * }}
 */
export function createPlaybackController(speechService, onEvent) {
  /**
   * Start playback from a specific line index.
   * @param {number} startIndex
   */
  function startPlaybackAt(startIndex) {
    if (!speechService.isSupported()) {
      onEvent("speechUnavailable");
      return;
    }

    const selectedCharacterId = getSelectedCharacterId();
    if (!selectedCharacterId) {
      onEvent("noCharacter");
      return;
    }

    const playData = getPlayData();
    if (!playData) {
      onEvent("noPlay");
      return;
    }

    const queue = createPlaybackQueue(playData.lines);
    const hasOtherLines = queue.some(
      ({ line }) => !isOwnLine(line, selectedCharacterId)
    );

    if (!hasOtherLines) {
      onEvent("noOtherLines");
      return;
    }

    speechService.cancel();

    const queueIndex = clampQueueIndex(startIndex, queue.length);
    updatePlaybackState({
      playbackQueue: queue,
      currentQueueIndex: queueIndex,
      isPlaying: true,
      isPaused: false,
      isAutoPausedForUser: false
    });

    onEvent("started");
    continuePlayback();
  }

  /**
   * Continue to the next line in the playback queue.
   */
  function continuePlayback() {
    if (!getIsPlaying() || getIsPaused()) {
      return;
    }

    const queue = getPlaybackQueue();
    let queueIndex = getCurrentQueueIndex();
    const selectedCharacterId = getSelectedCharacterId();
    const characterMap = getCharacterMap();

    while (queueIndex < queue.length) {
      const { line, idx } = queue[queueIndex];

      // Check if this is the actor's line
      if (isOwnLine(line, selectedCharacterId)) {
        updatePlaybackState({
          activeLineIndex: idx,
          isAutoPausedForUser: true,
          isPaused: true,
          currentQueueIndex: queueIndex
        });
        onEvent("yourTurn");
        return;
      }

      // Speak this line
      const language = chooseLanguageForLine(line.text);
      const characterNames = getLineCharacterNames(line, characterMap, " y ");
      const textToSpeak = `${characterNames} dice: ${line.text}`;

      updatePlaybackState({
        activeLineIndex: idx,
        currentQueueIndex: queueIndex
      });

      speechService.speak({
        text: textToSpeak,
        language,
        rate: getSpeechRate(),
        onEnd: () => {
          updatePlaybackState({
            activeLineIndex: null,
            currentQueueIndex: getCurrentQueueIndex() + 1
          });
          if (!getIsPaused()) {
            continuePlayback();
          }
        },
        onError: () => {
          updatePlaybackState({
            isPlaying: false,
            isPaused: false,
            isAutoPausedForUser: false,
            activeLineIndex: null
          });
          onEvent("error");
        }
      });

      return;
    }

    // Queue finished
    updatePlaybackState({
      isPlaying: false,
      isPaused: false,
      isAutoPausedForUser: false,
      activeLineIndex: null
    });
    onEvent("finished");
  }

  /**
   * Choose the language for a line based on preference or detection.
   * @param {string} text
   * @returns {string}
   */
  function chooseLanguageForLine(text) {
    const preferred = getPreferredLanguage();
    if (preferred && preferred !== "auto") {
      return preferred;
    }
    return detectLanguage(text);
  }

  return {
    /**
     * Toggle between play and pause states.
     */
    togglePlayPause() {
      if (!speechService.isSupported()) {
        onEvent("speechUnavailable");
        return;
      }

      // Not playing → start playback
      if (!getIsPlaying()) {
        startPlaybackAt(0);
        return;
      }

      // Playing but auto-paused for actor → do nothing (use continue button)
      if (getIsAutoPausedForUser()) {
        return;
      }

      // Playing and not paused → pause
      if (!getIsPaused()) {
        if (speechService.isSpeaking() && !speechService.isPaused()) {
          speechService.pause();
        }
        updatePlaybackState({ isPaused: true });
        onEvent("paused");
        return;
      }

      // Paused → resume
      if (speechService.isPaused()) {
        speechService.resume();
      } else {
        continuePlayback();
      }
      updatePlaybackState({ isPaused: false });
      onEvent("resumed");
    },

    /**
     * Continue playback after an actor's line.
     */
    continueAfterActor() {
      if (!getIsAutoPausedForUser()) return;

      updatePlaybackState({
        isAutoPausedForUser: false,
        isPaused: false,
        activeLineIndex: null,
        currentQueueIndex: getCurrentQueueIndex() + 1
      });
      onEvent("continuing");
      continuePlayback();
    },

    /**
     * Jump to and start playback from a specific line.
     * @param {number} lineIndex
     */
    jumpToLine(lineIndex) {
      if (Number.isNaN(lineIndex)) {
        onEvent("jumpError");
        return;
      }
      startPlaybackAt(lineIndex);
    },

    /**
     * Stop playback completely.
     */
    stop() {
      if (!isSpeechSupported()) return;
      speechService.cancel();
      resetPlaybackState();
      onEvent("stopped");
    }
  };
}
