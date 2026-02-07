import { LANGUAGE_LABELS } from "../constants.js";
import { elements, setStatus, updatePlaybackButtons } from "../dom.js";
import { renderLines } from "../renderers.js";
import { speechSupported, state } from "../state.js";

export function initSpeech() {
  if (!speechSupported) return;
  setupVoiceHandling();
}

export function playOtherVoices() {
  startPlaybackAt(0, "Reproduciendo parlamentos de otros personajes…");
}

/**
 * @param {number} lineIndex
 */
export function jumpToLine(lineIndex) {
  if (Number.isNaN(lineIndex)) {
    setStatus("No se pudo reproducir ese fragmento.");
    return;
  }
  startPlaybackAt(lineIndex, "Reproduciendo desde el fragmento seleccionado…");
}

export function togglePlayPause() {
  if (!speechSupported) {
    setStatus("La lectura en voz alta no está disponible en este navegador.");
    return;
  }

  // Not playing → start playback
  if (!state.speechPlaying) {
    playOtherVoices();
    return;
  }

  // Playing but auto-paused for actor → do nothing (use continue button)
  if (state.autoPausedForUser) {
    return;
  }

  // Playing and not paused → pause
  if (!state.isPaused) {
    if (state.currentUtterance && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
    state.isPaused = true;
    setStatus("Lectura en pausa.");
    updatePlaybackButtons();
    return;
  }

  // Paused → resume
  if (state.currentUtterance && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  } else if (!state.currentUtterance) {
    continuePlayback();
  }
  state.isPaused = false;
  setStatus("Lectura reanudada.");
  updatePlaybackButtons();
}

export function continueAfterActor() {
  if (!state.autoPausedForUser) return;
  resumeAfterActorLine();
}

export function stopSpeechPlayback(showStatus = true) {
  if (!speechSupported) return;
  cancelSpeech();
  state.speechPlaying = false;
  state.activeLineIndex = null;
  state.playbackQueue = [];
  state.currentQueueIndex = 0;
  state.isPaused = false;
  state.autoPausedForUser = false;
  if (showStatus) {
    setStatus("Lectura detenida.");
  }
  renderLines();
  updatePlaybackButtons();
}

export function updateLanguageOptions() {
  if (!elements.languageSelect) return;
  const previousValue = elements.languageSelect.value;
  elements.languageSelect.innerHTML = "";
  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = "Detectar automáticamente (prioriza español)";
  elements.languageSelect.appendChild(autoOption);

  const seen = new Set();
  state.voices
    .map((voice) => voice.lang)
    .filter(Boolean)
    .forEach((lang) => seen.add(lang));

  Array.from(seen)
    .sort()
    .forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = formatLanguageLabel(lang);
      elements.languageSelect.appendChild(option);
    });

  elements.languageSelect.value = previousValue || "auto";
}

/**
 * @param {number} startIndex
 * @param {string} statusMessage
 */
function startPlaybackAt(startIndex, statusMessage) {
  if (!speechSupported) {
    setStatus("La lectura en voz alta no está disponible en este navegador.");
    return;
  }
  if (!state.selectedCharacterId) {
    setStatus("Selecciona tu personaje antes de iniciar la lectura.");
    return;
  }
  if (!state.data) {
    setStatus("Aún no se ha cargado el texto.");
    return;
  }

  const queue = state.data.lines.map((line, idx) => ({ line, idx }));
  const hasOtherLines = queue.some(
    ({ line }) => !line.characterIds.includes(state.selectedCharacterId)
  );

  if (!hasOtherLines) {
    setStatus("No hay parlamentos de otros personajes para reproducir.");
    return;
  }

  cancelSpeech();
  state.playbackQueue = queue;
  state.currentQueueIndex = Math.min(Math.max(startIndex, 0), queue.length - 1);
  state.speechPlaying = true;
  state.isPaused = false;
  state.autoPausedForUser = false;
  updatePlaybackButtons();
  setStatus(statusMessage);
  continuePlayback();
}

function continuePlayback() {
  if (!state.speechPlaying || state.isPaused) {
    updatePlaybackButtons();
    return;
  }

  while (state.currentQueueIndex < state.playbackQueue.length) {
    const { line, idx } = state.playbackQueue[state.currentQueueIndex];

    if (line.characterIds.includes(state.selectedCharacterId)) {
      state.activeLineIndex = idx;
      state.autoPausedForUser = true;
      state.isPaused = true;
      setStatus("Tu turno. Di tu parlamento y pulsa Continuar.");
      renderLines();
      updatePlaybackButtons();
      return;
    }

    const language = chooseLanguageForLine(line.text);
    const utterance = new SpeechSynthesisUtterance(
      `${line.characterIds.map((id) => state.characterMap[id] || id).join(" y ")} dice: ${line.text}`
    );
    utterance.rate = state.speechRate;
    utterance.lang = language;
    const voice = pickVoiceForLanguage(language);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.onend = () => {
      state.currentUtterance = null;
      state.activeLineIndex = null;
      renderLines();
      state.currentQueueIndex += 1;
      if (!state.isPaused) {
        continuePlayback();
      }
    };
    utterance.onerror = () => {
      setStatus("No se pudo reproducir la voz.");
      state.speechPlaying = false;
      state.activeLineIndex = null;
      state.isPaused = false;
      state.autoPausedForUser = false;
      renderLines();
      updatePlaybackButtons();
    };
    state.currentUtterance = utterance;
    state.activeLineIndex = idx;
    renderLines();
    window.speechSynthesis.speak(utterance);
    updatePlaybackButtons();
    return;
  }

  state.speechPlaying = false;
  state.isPaused = false;
  state.autoPausedForUser = false;
  state.activeLineIndex = null;
  setStatus("Lectura finalizada.");
  renderLines();
  updatePlaybackButtons();
}

function resumeAfterActorLine() {
  state.autoPausedForUser = false;
  state.isPaused = false;
  state.activeLineIndex = null;
  state.currentQueueIndex += 1;
  setStatus("Continuando…");
  renderLines();
  continuePlayback();
}

function cancelSpeech() {
  if (speechSupported) {
    window.speechSynthesis.cancel();
  }
  if (state.currentUtterance) {
    state.currentUtterance.onend = null;
    state.currentUtterance = null;
  }
}

function setupVoiceHandling() {
  const populateVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    if (!availableVoices.length) return;
    state.voices = availableVoices;
    updateLanguageOptions();
  };

  populateVoices();
  window.speechSynthesis.onvoiceschanged = populateVoices;
}

/**
 * @param {string} text
 */
function chooseLanguageForLine(text) {
  if (state.preferredLanguage && state.preferredLanguage !== "auto") {
    return state.preferredLanguage;
  }
  return detectLanguageFromText(text);
}

/**
 * @param {string} text
 */
function detectLanguageFromText(text) {
  const trimmed = text.toLowerCase();
  const spanishRegex = /[áéíóúñü¿¡]/i;
  if (spanishRegex.test(text) || /\b(que|para|sueño|besos|nadie|corte)\b/.test(trimmed)) {
    return "es-ES";
  }
  if (/\b(the|and|but|you|love|night)\b/.test(trimmed)) {
    return "en-US";
  }
  return "es-ES";
}

/**
 * @param {string} language
 */
function pickVoiceForLanguage(language) {
  if (!state.voices.length) return null;
  const normalized = language.toLowerCase();
  const exact = state.voices.find((voice) => voice.lang.toLowerCase() === normalized);
  if (exact) return exact;
  const base = normalized.split("-")[0];
  return state.voices.find((voice) => voice.lang.toLowerCase().startsWith(base)) || null;
}

/**
 * @param {string} lang
 */
function formatLanguageLabel(lang) {
  const base = lang.split("-")[0].toLowerCase();
  const friendly = LANGUAGE_LABELS[base];
  return friendly ? `${friendly} (${lang})` : lang;
}
