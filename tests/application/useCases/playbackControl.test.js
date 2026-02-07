import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPlaybackController } from "../../../src/application/useCases/playbackControl.js";
import {
  setPlayData,
  setSelectedCharacterId,
  getIsPlaying,
  getIsAutoPausedForUser,
  resetPlaybackState
} from "../../../src/application/state/appState.js";
import { clearAllListeners } from "../../../src/application/state/stateEvents.js";

describe("playbackControl use case", () => {
  /** @type {import('../../../src/domain/ports/speechPort.js').ISpeechService} */
  let mockSpeechService;
  /** @type {ReturnType<typeof createPlaybackController>} */
  let playbackController;
  /** @type {import('vitest').Mock} */
  let onEvent;

  const playData = {
    playId: "test",
    title: "Test Play",
    author: "Test Author",
    description: "Test description",
    characters: [
      { id: "aurora", name: "Aurora" },
      { id: "tomas", name: "Tomás" }
    ],
    lines: [
      { characterIds: ["tomas"], text: "Line from Tomás" },
      { characterIds: ["aurora"], text: "Line from Aurora" },
      { characterIds: ["tomas"], text: "Another from Tomás" }
    ]
  };

  beforeEach(() => {
    clearAllListeners();
    resetPlaybackState();

    mockSpeechService = {
      isSupported: vi.fn().mockReturnValue(true),
      speak: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      cancel: vi.fn(),
      isSpeaking: vi.fn().mockReturnValue(false),
      isPaused: vi.fn().mockReturnValue(false),
      getVoices: vi.fn().mockReturnValue([]),
      onVoicesChanged: vi.fn()
    };

    onEvent = vi.fn();
    playbackController = createPlaybackController(mockSpeechService, onEvent);

    setPlayData(playData);
  });

  describe("togglePlayPause", () => {
    it("emits speechUnavailable when speech not supported", () => {
      mockSpeechService.isSupported.mockReturnValue(false);

      playbackController.togglePlayPause();

      expect(onEvent).toHaveBeenCalledWith("speechUnavailable");
    });

    it("emits noCharacter when no character selected", () => {
      playbackController.togglePlayPause();

      expect(onEvent).toHaveBeenCalledWith("noCharacter");
    });

    it("starts playback when character is selected", () => {
      setSelectedCharacterId("aurora");

      playbackController.togglePlayPause();

      expect(onEvent).toHaveBeenCalledWith("started");
      expect(getIsPlaying()).toBe(true);
    });

    it("pauses playback when playing", () => {
      setSelectedCharacterId("aurora");
      playbackController.togglePlayPause(); // Start

      mockSpeechService.isSpeaking.mockReturnValue(true);
      playbackController.togglePlayPause(); // Pause

      expect(mockSpeechService.pause).toHaveBeenCalled();
      expect(onEvent).toHaveBeenCalledWith("paused");
    });
  });

  describe("continueAfterActor", () => {
    it("does nothing when not auto-paused", () => {
      setSelectedCharacterId("aurora");

      playbackController.continueAfterActor();

      expect(onEvent).not.toHaveBeenCalledWith("continuing");
    });

    it("continues playback when auto-paused for user", () => {
      setSelectedCharacterId("aurora");
      playbackController.togglePlayPause(); // Start - should speak first line (tomas)

      // Simulate the speech ending and hitting aurora's line
      const speakCall = mockSpeechService.speak.mock.calls[0];
      if (speakCall) {
        speakCall[0].onEnd();
      }

      // Now should be auto-paused for aurora
      expect(getIsAutoPausedForUser()).toBe(true);

      playbackController.continueAfterActor();

      expect(onEvent).toHaveBeenCalledWith("continuing");
    });
  });

  describe("jumpToLine", () => {
    it("emits jumpError for NaN index", () => {
      playbackController.jumpToLine(NaN);

      expect(onEvent).toHaveBeenCalledWith("jumpError");
    });

    it("starts playback from specified line", () => {
      setSelectedCharacterId("aurora");

      playbackController.jumpToLine(2);

      expect(onEvent).toHaveBeenCalledWith("started");
      expect(getIsPlaying()).toBe(true);
    });
  });

  describe("stop", () => {
    it("cancels speech and resets state", () => {
      setSelectedCharacterId("aurora");
      playbackController.togglePlayPause();

      playbackController.stop();

      expect(mockSpeechService.cancel).toHaveBeenCalled();
      expect(onEvent).toHaveBeenCalledWith("stopped");
      expect(getIsPlaying()).toBe(false);
    });
  });
});
