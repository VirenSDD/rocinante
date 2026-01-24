import { setStatus, updateCurrentLineDisplay, updateSpeechRateLabel, updateTextSizeLabel } from "./dom.js";
import { applyPlayData, resetPlaybackState, speechSupported, state } from "./state.js";
import { initControls } from "./ui/controls.js";
import { loadPlayData } from "./services/playLoader.js";
import { renderCharacterList, renderHeading, renderLines } from "./renderers.js";
import { initSpeech, stopSpeechPlayback, updateLanguageOptions } from "./services/speech.js";
import { elements } from "./dom.js";

async function init() {
  updateTextSizeLabel(state.lineFontSize);
  updateSpeechRateLabel(state.speechRate);
  initControls();
  initSpeech();

  try {
    const { data, usedFallback } = await loadPlayData();
    applyPlayData(data);
    renderHeading();
    renderCharacterList();
    renderLines();
    setStatus(
      usedFallback
        ? "No se pudo leer play.json directamente (esto ocurre al abrir el archivo sin servidor). Mostramos una copia integrada."
        : "Selecciona tu personaje y comienza el ensayo."
    );
    updateCurrentLineDisplay(
      "Pulsa “Reproducir otras voces” para seguir las intervenciones ajenas o desplázate y lee manualmente."
    );
  } catch (error) {
    console.error(error);
    resetPlaybackState();
    stopSpeechPlayback(false);
    setStatus("Ocurrió un problema al cargar la obra. Actualiza la página para intentarlo de nuevo.");
  }

  if (!speechSupported) {
    elements.languageSelect.disabled = true;
  } else {
    updateLanguageOptions();
  }
}

init();
