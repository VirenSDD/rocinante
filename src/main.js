import { t } from "./presentation/i18n/i18n.js";
import { getDOMElements } from "./presentation/bindings/domElements.js";
import { createWebSpeechAdapter } from "./infrastructure/adapters/webSpeechAdapter.js";
import { createFetchPlayLoader } from "./infrastructure/adapters/fetchPlayLoader.js";
import { createLoadPlayUseCase } from "./application/useCases/loadPlay.js";
import { createSelectCharacterUseCase } from "./application/useCases/selectCharacter.js";
import { createPlaybackController } from "./application/useCases/playbackControl.js";
import { createAppController, getStatusMessageForPlaybackEvent } from "./presentation/controllers/appController.js";
import { resetPlaybackState } from "./application/state/appState.js";

async function init() {
  // Get DOM elements
  const elements = getDOMElements();

  // Create infrastructure adapters
  const speechService = createWebSpeechAdapter();
  const playLoader = createFetchPlayLoader();

  /**
   * Set status message in the UI.
   * @param {string} message
   */
  function setStatus(message) {
    elements.statusMessage.textContent = message;
  }

  // Create use cases
  const loadPlayUseCase = createLoadPlayUseCase(playLoader);
  const selectCharacterUseCase = createSelectCharacterUseCase(speechService);
  const playbackController = createPlaybackController(speechService, (event) => {
    const message = getStatusMessageForPlaybackEvent(event);
    if (message) {
      setStatus(message);
    }
  });

  // Create and initialize the app controller
  const appController = createAppController(
    elements,
    selectCharacterUseCase,
    playbackController,
    speechService
  );

  appController.initialize();

  // Load play data
  try {
    const { usedFallback } = await loadPlayUseCase.execute();
    setStatus(
      usedFallback
        ? t("status.fallbackUsed")
        : t("status.ready")
    );
  } catch (error) {
    console.error(error);
    resetPlaybackState();
    playbackController.stop();
    setStatus(t("status.loadError"));
  }
}

init();
