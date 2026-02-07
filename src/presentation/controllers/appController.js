import { t } from "../i18n/i18n.js";
import { subscribe } from "../../application/state/stateEvents.js";
import {
  getPlayData,
  getSelectedCharacterId,
  getCharacterMap,
  getHideMyLines,
  getLineFontSize,
  getSpeechRate,
  getPreferredLanguage,
  getVoices,
  getIsPlaying,
  getIsPaused,
  getIsAutoPausedForUser,
  getActiveLineIndex,
  setHideMyLines,
  setLineFontSize,
  setSpeechRate,
  setPreferredLanguage,
  setVoices,
  isSpeechSupported
} from "../../application/state/appState.js";
import { renderHeading } from "../components/heading.js";
import { renderCharacterList } from "../components/characterList.js";
import { renderLineCards, applyLineFontSize, scrollActiveLineIntoView } from "../components/lineCards.js";
import { setControlsCollapsed, updateToggleButtonLabel, updateTextSizeLabel, updateSpeechRateLabel } from "../components/controlPanel.js";
import { updatePlaybackButtons } from "../components/playbackDock.js";
import { updateLanguageOptions } from "../components/languageSelect.js";
import { bindEvents } from "../bindings/eventBindings.js";

/**
 * @typedef {ReturnType<import('../bindings/domElements.js').getDOMElements>} DOMElements
 * @typedef {import('../../application/useCases/selectCharacter.js').createSelectCharacterUseCase} SelectCharacterUseCase
 * @typedef {import('../../application/useCases/playbackControl.js').createPlaybackController} PlaybackController
 * @typedef {import('../../domain/ports/speechPort.js').ISpeechService} ISpeechService
 */

/**
 * @typedef {{
 *   togglePlayPause: () => void;
 *   continueAfterActor: () => void;
 *   jumpToLine: (lineIndex: number) => void;
 *   stop: () => void;
 * }} PlaybackControllerInstance
 */

/**
 * @typedef {{
 *   execute: (characterId: string) => void;
 * }} SelectCharacterUseCaseInstance
 */

/**
 * Create the application controller.
 *
 * @param {DOMElements} elements - DOM elements
 * @param {SelectCharacterUseCaseInstance} selectCharacterUseCase - Character selection use case
 * @param {PlaybackControllerInstance} playbackController - Playback controller
 * @param {ISpeechService} speechService - Speech service
 * @returns {{ initialize: () => void }}
 */
export function createAppController(elements, selectCharacterUseCase, playbackController, speechService) {
  let controlsCollapsed = true;

  /**
   * Set the status message.
   * @param {string} message
   */
  function setStatus(message) {
    elements.statusMessage.textContent = message;
  }

  /**
   * Render lines with current state.
   */
  function renderLines() {
    const playData = getPlayData();
    if (!playData) return;

    renderLineCards(elements.linesContainer, playData.lines, {
      selectedCharacterId: getSelectedCharacterId(),
      characterMap: getCharacterMap(),
      hideMyLines: getHideMyLines(),
      activeLineIndex: getActiveLineIndex()
    });

    applyLineFontSize(getLineFontSize());

    scrollActiveLineIntoView(elements.linesContainer, getActiveLineIndex(), {
      isPlaying: getIsPlaying(),
      isAutoPausedForUser: getIsAutoPausedForUser()
    });
  }

  /**
   * Update all playback-related UI.
   */
  function updatePlaybackUI() {
    updatePlaybackButtons(
      { playPauseBtn: elements.playPauseBtn, continueBtn: elements.continueBtn },
      {
        isPlaying: getIsPlaying(),
        isPaused: getIsPaused(),
        isAutoPausedForUser: getIsAutoPausedForUser(),
        hasCharacter: Boolean(getSelectedCharacterId()),
        speechSupported: isSpeechSupported()
      }
    );
  }

  /**
   * Subscribe to state changes and update UI accordingly.
   */
  function subscribeToStateChanges() {
    subscribe("playDataChanged", () => {
      const playData = getPlayData();
      if (!playData) return;

      renderHeading(
        { titleEl: elements.title, authorEl: elements.author, descriptionEl: elements.description },
        { title: playData.title, author: playData.author, description: playData.description }
      );
      renderCharacterList(elements.characterList, playData.characters, getSelectedCharacterId());
      renderLines();
    });

    subscribe("characterSelected", () => {
      const playData = getPlayData();
      if (!playData) return;

      renderCharacterList(elements.characterList, playData.characters, getSelectedCharacterId());
      renderLines();
      updatePlaybackUI();
      elements.toggleLines.disabled = !getSelectedCharacterId();
      updateToggleButtonLabel(elements.toggleLines, getHideMyLines());
    });

    subscribe("hideMyLinesChanged", () => {
      updateToggleButtonLabel(elements.toggleLines, getHideMyLines());
      renderLines();
    });

    subscribe("lineFontSizeChanged", (size) => {
      const sizeNum = /** @type {number} */ (size);
      updateTextSizeLabel(elements.textSizeLabel, sizeNum);
      applyLineFontSize(sizeNum);
    });

    subscribe("speechRateChanged", (rate) => {
      updateSpeechRateLabel(elements.speechRateLabel, /** @type {number} */ (rate));
    });

    subscribe("voicesChanged", () => {
      updateLanguageOptions(elements.languageSelect, getVoices(), getPreferredLanguage());
    });

    subscribe("playbackStateChanged", () => {
      updatePlaybackUI();
    });

    subscribe("activeLineChanged", () => {
      renderLines();
    });
  }

  /**
   * Bind event handlers.
   */
  function bindEventHandlers() {
    bindEvents(elements, {
      onCharacterSelect: (characterId) => {
        selectCharacterUseCase.execute(characterId);
      },

      onToggleLines: () => {
        if (!getSelectedCharacterId()) return;
        setHideMyLines(!getHideMyLines());
      },

      onTextSizeChange: (size) => {
        setLineFontSize(size);
      },

      onSpeechRateChange: (rate) => {
        setSpeechRate(rate);
      },

      onLanguageChange: (language) => {
        setPreferredLanguage(language);
      },

      onPlayPause: () => {
        playbackController.togglePlayPause();
      },

      onContinue: () => {
        playbackController.continueAfterActor();
      },

      onJumpToLine: (lineIndex) => {
        playbackController.jumpToLine(lineIndex);
      },

      onControlsToggle: () => {
        controlsCollapsed = !controlsCollapsed;
        setControlsCollapsed(
          {
            controlsSection: elements.controlsSection,
            controlsBody: elements.controlsBody,
            controlsToggle: elements.controlsToggle
          },
          controlsCollapsed
        );
      }
    });
  }

  /**
   * Set up speech voice handling.
   */
  function setupSpeechVoices() {
    if (!speechService.isSupported()) {
      elements.languageSelect.disabled = true;
      return;
    }

    speechService.onVoicesChanged(() => {
      const voices = speechService.getVoices();
      setVoices(voices);
    });
  }

  /**
   * Initialize default control states.
   */
  function initializeDefaults() {
    elements.toggleLines.disabled = true;
    elements.playPauseBtn.disabled = true;
    elements.continueBtn.disabled = true;

    updateTextSizeLabel(elements.textSizeLabel, getLineFontSize());
    updateSpeechRateLabel(elements.speechRateLabel, getSpeechRate());
    updateToggleButtonLabel(elements.toggleLines, getHideMyLines());

    setControlsCollapsed(
      {
        controlsSection: elements.controlsSection,
        controlsBody: elements.controlsBody,
        controlsToggle: elements.controlsToggle
      },
      controlsCollapsed
    );

    if (!isSpeechSupported()) {
      elements.languageSelect.disabled = true;
      setStatus(t("status.speechUnavailableManual"));
    }
  }

  return {
    /**
     * Initialize the controller.
     */
    initialize() {
      subscribeToStateChanges();
      bindEventHandlers();
      initializeDefaults();
      setupSpeechVoices();
    }
  };
}

/**
 * Map playback events to status messages.
 *
 * @param {import('../../application/useCases/playbackControl.js').PlaybackEventType} event
 * @returns {string}
 */
export function getStatusMessageForPlaybackEvent(event) {
  const messages = {
    started: t("status.playingOthers"),
    paused: t("status.playbackPaused"),
    resumed: t("status.playbackResumed"),
    stopped: t("status.playbackStopped"),
    finished: t("status.playbackFinished"),
    yourTurn: t("status.yourTurn"),
    continuing: t("status.continuing"),
    error: t("status.speechError"),
    noCharacter: t("status.selectCharacterFirst"),
    noPlay: t("status.noPlayLoaded"),
    noOtherLines: t("status.noOtherLines"),
    speechUnavailable: t("status.speechUnavailable"),
    jumpError: t("status.jumpError")
  };
  return messages[event] || "";
}
