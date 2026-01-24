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
 * @typedef {{
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
 * }} AppState
 */

const fallbackPlay = /** @type {PlayData} */ ({
  playId: "besos-bella-durmiente",
  title: "Besos para la Bella Durmiente",
  author: "J. Luis Alonso de Santos",
  description: "Una adaptación breve para ensayar parlamentos clave con soporte visual y auditivo.",
  characters: [
    { id: "aurora", name: "Aurora" },
    { id: "tomas", name: "Tomás" },
    { id: "narrator", name: "Narrador" },
    { id: "abuela", name: "Abuela" },
    { id: "guardian", name: "Guardián" },
    { id: "cocinero", name: "Cocinero" },
    { id: "paje", name: "Paje" },
    { id: "reina", name: "Reina" },
    { id: "rey", name: "Rey" },
    { id: "bufon", name: "Bufón" },
    { id: "hada", name: "Hada" },
    { id: "mensajero", name: "Mensajero" },
    { id: "multitud", name: "Multitud" }
  ],
  lines: [
    {
      characterIds: ["narrator"],
      text: "La corte contiene el aliento. Se acerca la noche donde todo puede despertar."
    },
    {
      characterIds: ["aurora"],
      text: "Aun con los ojos cerrados siento las manos que me buscan."
    },
    {
      characterIds: ["reina", "rey"],
      text: "Si despierta, que sea entre besos y sin miedo."
    },
    {
      characterIds: ["tomas"],
      text: "No soy príncipe, pero traigo el valor que faltaba."
    },
    {
      characterIds: ["abuela"],
      text: "Los cuentos crecen con nosotros, niño. Respira hondo."
    },
    {
      characterIds: ["guardian"],
      text: "Nadie pasa sin dejar atrás la duda."
    },
    {
      characterIds: ["hada"],
      text: "Le regalé un sueño, ahora necesitan devolverle la risa."
    },
    {
      characterIds: ["cocinero"],
      text: "La cocina no duerme cuando hierven las esperanzas."
    },
    {
      characterIds: ["mensajero"],
      text: "Traigo palabras urgentes: el tiempo corre como un potro loco."
    },
    {
      characterIds: ["paje"],
      text: "Yo sostendré la puerta para que nadie aparte la mirada."
    },
    {
      characterIds: ["bufon", "multitud"],
      text: "Si la magia falla, que al menos queden carcajadas."
    },
    {
      characterIds: ["aurora"],
      text: "¿Quién me llama desde tan lejos? Siento calor en los labios."
    },
    {
      characterIds: ["tomas"],
      text: "Besos para la Bella Durmiente, y para el miedo, silencio."
    }
  ]
});

const LANGUAGE_LABELS = /** @type {Record<string, string>} */ ({
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  pt: "Portugués",
  it: "Italiano",
  de: "Alemán"
});

/** @type {AppState} */
const state = {
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
 * @param {string} id
 * @returns {HTMLElement}
 */
function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`No se encontró el elemento con id ${id}`);
  }
  return element;
}

const elements = {
  title: /** @type {HTMLElement} */ (getRequiredElement("playTitle")),
  author: /** @type {HTMLElement} */ (getRequiredElement("playAuthor")),
  description: /** @type {HTMLElement} */ (getRequiredElement("playDescription")),
  characterSelect: /** @type {HTMLSelectElement} */ (getRequiredElement("characterSelect")),
  toggleLines: /** @type {HTMLButtonElement} */ (getRequiredElement("toggleLines")),
  textSizeRange: /** @type {HTMLInputElement} */ (getRequiredElement("textSizeRange")),
  textSizeLabel: /** @type {HTMLElement} */ (getRequiredElement("textSizeLabel")),
  speechRate: /** @type {HTMLInputElement} */ (getRequiredElement("speechRate")),
  speechRateLabel: /** @type {HTMLElement} */ (getRequiredElement("speechRateLabel")),
  playOthers: /** @type {HTMLButtonElement} */ (getRequiredElement("playOthers")),
  pauseSpeech: /** @type {HTMLButtonElement} */ (getRequiredElement("pauseSpeech")),
  stopSpeech: /** @type {HTMLButtonElement} */ (getRequiredElement("stopSpeech")),
  languageSelect: /** @type {HTMLSelectElement} */ (getRequiredElement("languageSelect")),
  currentLineText: /** @type {HTMLElement} */ (getRequiredElement("currentLineText")),
  statusMessage: /** @type {HTMLElement} */ (getRequiredElement("statusMessage")),
  characterList: /** @type {HTMLElement} */ (getRequiredElement("characterList")),
  linesContainer: /** @type {HTMLElement} */ (getRequiredElement("linesContainer"))
};

const speechSupported = "speechSynthesis" in window;

init();

async function init() {
  updateSpeechRateLabel(state.speechRate);
  if (!speechSupported) {
    elements.playOthers.disabled = true;
    elements.stopSpeech.disabled = true;
    elements.languageSelect.disabled = true;
    setStatus(
      "La lectura en voz alta no está disponible en este navegador. Puedes leer y ocultar tus parlamentos manualmente."
    );
  } else {
    setupVoiceHandling();
  }

  updateTextSizeLabel(state.lineFontSize);
  updatePauseButton();

  try {
    const response = await fetch("play.json");
    if (!response.ok) {
      throw new Error("No se pudo cargar el texto.");
    }
    const data = await response.json();
    hydrateData(data, "Texto cargado desde play.json. Selecciona tu personaje y comienza el ensayo.");
  } catch (error) {
    console.error(error);
    hydrateData(
      fallbackPlay,
      "No se pudo leer play.json directamente (esto ocurre al abrir el archivo sin servidor). Mostramos una copia integrada."
    );
  }

  elements.characterSelect.addEventListener("change", handleCharacterChange);
  elements.toggleLines.addEventListener("click", toggleLineVisibility);
  elements.textSizeRange.addEventListener("input", handleTextSizeChange);
  elements.speechRate.addEventListener("input", handleSpeechRateChange);
  elements.playOthers.addEventListener("click", handlePlayOthers);
  elements.pauseSpeech.addEventListener("click", handlePauseSpeech);
  elements.stopSpeech.addEventListener("click", () => stopSpeechPlayback());
  elements.languageSelect.addEventListener("change", handleLanguagePreferenceChange);
}

/**
 * @param {PlayData} data
 * @param {string} statusText
 */
function hydrateData(data, statusText) {
  state.data = data;
  state.activeLineIndex = null;
  state.playbackQueue = [];
  state.currentQueueIndex = 0;
  state.characterMap = data.characters.reduce((map, character) => {
    map[character.id] = character.name;
    return map;
  }, /** @type {Record<string, string>} */ ({}));

  renderHeading();
  populateCharacterSelect();
  renderCharacterList();
  renderLines();
  setStatus(statusText);
  updateCurrentLineDisplay("Pulsa “Reproducir otras voces” para seguir las intervenciones ajenas.");
}

function renderHeading() {
  if (!state.data) return;
  elements.title.textContent = state.data.title;
  elements.author.textContent = `Autor: ${state.data.author}`;
  elements.description.textContent = state.data.description;
}

function populateCharacterSelect() {
  if (!state.data) return;
  elements.characterSelect.innerHTML = '<option value="">Selecciona un personaje</option>';
  state.data.characters.forEach((character) => {
    const option = document.createElement("option");
    option.value = character.id;
    option.textContent = character.name;
    elements.characterSelect.appendChild(option);
  });
}

function renderCharacterList() {
  elements.characterList.innerHTML = "";
  if (!state.data) return;
  state.data.characters.forEach((character) => {
    const li = document.createElement("li");
    li.textContent = character.name;
    if (state.selectedCharacterId === character.id) {
      li.style.backgroundColor = "#fed7aa";
    }
    elements.characterList.appendChild(li);
  });
}

function renderLines() {
  elements.linesContainer.innerHTML = "";
  if (!state.data) return;

  state.data.lines.forEach((line, index) => {
    const card = document.createElement("article");
    card.className = "line-card";
    const includesSelected =
      state.selectedCharacterId && line.characterIds.includes(state.selectedCharacterId);
    if (includesSelected) {
      card.classList.add("highlight");
    }
    if (state.activeLineIndex === index) {
      card.classList.add("narrating");
    }

    const charactersEl = document.createElement("div");
    charactersEl.className = "line-characters";
    charactersEl.textContent = line.characterIds.map((id) => state.characterMap[id] || id).join(" + ");
    card.appendChild(charactersEl);

    const textEl = document.createElement("p");
    textEl.className = "line-text";
    textEl.dataset.text = line.text;
    if (includesSelected && state.hideMyLines) {
      textEl.classList.add("hidden");
      textEl.textContent = "";
    } else {
      textEl.textContent = line.text;
    }

    card.appendChild(textEl);
    card.tabIndex = 0;
    card.addEventListener("click", () => revealLine(textEl));
    card.addEventListener("keypress", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        revealLine(textEl);
      }
    });

    elements.linesContainer.appendChild(card);
  });

  document.documentElement.style.setProperty("--line-text-size", `${state.lineFontSize}px`);
}

/**
 * @param {Event} event
 */
function handleCharacterChange(event) {
  const target = /** @type {HTMLSelectElement} */ (event.target);
  state.selectedCharacterId = target.value;
  state.hideMyLines = false;
  elements.toggleLines.textContent = "Ocultar mis parlamentos";
  elements.toggleLines.disabled = !state.selectedCharacterId;
  elements.playOthers.disabled = !state.selectedCharacterId || !speechSupported;
  elements.pauseSpeech.disabled = !state.selectedCharacterId;
  if (state.speechPlaying) {
    stopSpeechPlayback(false);
  }
  updatePauseButton();
  renderLines();
  renderCharacterList();
}

function toggleLineVisibility() {
  if (!state.selectedCharacterId) return;
  state.hideMyLines = !state.hideMyLines;
  elements.toggleLines.textContent = state.hideMyLines
    ? "Mostrar mis parlamentos"
    : "Ocultar mis parlamentos";
  renderLines();
}

/**
 * @param {HTMLParagraphElement} textElement
 */
function revealLine(textElement) {
  if (!textElement.classList.contains("hidden")) return;
  textElement.classList.remove("hidden");
  textElement.textContent = textElement.dataset.text ?? "";
}

/**
 * @param {Event} event
 */
function handleTextSizeChange(event) {
  const target = /** @type {HTMLInputElement} */ (event.target);
  state.lineFontSize = Number(target.value);
  updateTextSizeLabel(state.lineFontSize);
  document.documentElement.style.setProperty("--line-text-size", `${state.lineFontSize}px`);
}

/**
 * @param {number} size
 */
function updateTextSizeLabel(size) {
  elements.textSizeLabel.textContent = `${size}px`;
}

/**
 * @param {Event} event
 */
function handleSpeechRateChange(event) {
  const target = /** @type {HTMLInputElement} */ (event.target);
  state.speechRate = Number(target.value);
  updateSpeechRateLabel(state.speechRate);
}

/**
 * @param {number} rate
 */
function updateSpeechRateLabel(rate) {
  elements.speechRateLabel.textContent = `${rate.toFixed(2)}x`;
}

/**
 * @param {Event} event
 */
function handleLanguagePreferenceChange(event) {
  const target = /** @type {HTMLSelectElement} */ (event.target);
  state.preferredLanguage = target.value;
}

function handlePlayOthers() {
  if (!speechSupported) return;
  if (!state.selectedCharacterId) {
    setStatus("Selecciona tu personaje antes de iniciar la lectura.");
    return;
  }
  if (!state.data) {
    setStatus("Aún no se ha cargado el texto.");
    return;
  }

  const queue = /** @type {Array<{ line: PlayLine; idx: number }>} */ (
    state.data.lines.map((line, idx) => ({ line, idx }))
  );
  const hasOtherLines = queue.some(
    ({ line }) => !line.characterIds.includes(state.selectedCharacterId)
  );

  if (!hasOtherLines) {
    setStatus("No hay parlamentos de otros personajes para reproducir.");
    return;
  }

  resetPlaybackState();
  state.playbackQueue = queue;
  state.currentQueueIndex = 0;
  state.speechPlaying = true;
  state.isPaused = false;
  state.autoPausedForUser = false;
  updatePauseButton();
  setStatus("Reproduciendo parlamentos de otros personajes…");
  continuePlayback();
}

function handlePauseSpeech() {
  if (!state.speechPlaying) return;

  if (state.autoPausedForUser) {
    resumeAfterActorLine();
    return;
  }

  if (!speechSupported) return;

  if (!state.isPaused) {
    if (state.currentUtterance && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    } else {
      state.isPaused = true;
      updatePauseButton();
      setStatus("Lectura en pausa.");
      return;
    }
    state.isPaused = true;
    setStatus("Lectura en pausa. Pulsa reanudar para continuar.");
  } else {
    if (state.currentUtterance && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else if (!state.currentUtterance) {
      continuePlayback();
    }
    state.isPaused = false;
    setStatus("Lectura reanudada.");
  }
  updatePauseButton();
}

/**
 * @param {boolean} [showStatus=true]
 */
function stopSpeechPlayback(showStatus = true) {
  if (!speechSupported) return;
  window.speechSynthesis.cancel();
  state.speechPlaying = false;
  state.activeLineIndex = null;
  state.playbackQueue = [];
  state.currentQueueIndex = 0;
  state.isPaused = false;
  state.autoPausedForUser = false;
  if (state.currentUtterance) {
    state.currentUtterance.onend = null;
    state.currentUtterance = null;
  }
  if (showStatus) {
    setStatus("Lectura detenida.");
    updateCurrentLineDisplay("Lectura detenida. Vuelve a presionar el botón para continuar.");
  }
  renderLines();
  updatePauseButton();
}

function resetPlaybackState() {
  window.speechSynthesis.cancel();
  state.activeLineIndex = null;
  state.currentUtterance = null;
  state.isPaused = false;
  state.autoPausedForUser = false;
}

function resumeAfterActorLine() {
  state.autoPausedForUser = false;
  state.isPaused = false;
  state.activeLineIndex = null;
  state.currentQueueIndex += 1;
  updatePauseButton();
  setStatus("Continuando tras tu parlamento…");
  updateCurrentLineDisplay("Continuando tras tu parlamento…");
  renderLines();
  continuePlayback();
}

function continuePlayback() {
  if (!state.speechPlaying || state.isPaused) {
    updatePauseButton();
    return;
  }

  while (state.currentQueueIndex < state.playbackQueue.length) {
    const { line, idx } = state.playbackQueue[state.currentQueueIndex];

    if (line.characterIds.includes(state.selectedCharacterId)) {
      state.activeLineIndex = idx;
      state.autoPausedForUser = true;
      state.isPaused = true;
      setStatus("Tu turno. Di tu parlamento y pulsa continuar para seguir.");
      updateCurrentLineDisplay(
        `Tu turno (${line.characterIds.map((id) => state.characterMap[id] || id).join(" + ")}): ${
          line.text
        }`
      );
      renderLines();
      updatePauseButton();
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
      updateCurrentLineDisplay("No se pudo reproducir la voz. Intenta otra vez.");
      renderLines();
      updatePauseButton();
    };
    state.currentUtterance = utterance;
    state.activeLineIndex = idx;
    updateCurrentLineDisplay(
      `${line.characterIds.map((id) => state.characterMap[id] || id).join(" + ")}: ${line.text}`
    );
    renderLines();
    window.speechSynthesis.speak(utterance);
    updatePauseButton();
    return;
  }

  state.speechPlaying = false;
  state.isPaused = false;
  state.autoPausedForUser = false;
  state.activeLineIndex = null;
  setStatus("Lectura finalizada.");
  updateCurrentLineDisplay("Lectura finalizada. Vuelve a reproducir cuando lo necesites.");
  renderLines();
  updatePauseButton();
}

/**
 * @param {string} message
 */
function setStatus(message) {
  elements.statusMessage.textContent = message;
}

/**
 * @param {string} message
 */
function updateCurrentLineDisplay(message) {
  elements.currentLineText.textContent = message;
}

function updatePauseButton() {
  if (!speechSupported || !state.selectedCharacterId) {
    elements.pauseSpeech.disabled = true;
    elements.pauseSpeech.textContent = "Pausar lectura";
    return;
  }
  elements.pauseSpeech.disabled = !state.speechPlaying;
  if (!state.speechPlaying) {
    elements.pauseSpeech.textContent = "Pausar lectura";
    return;
  }

  if (state.autoPausedForUser) {
    elements.pauseSpeech.textContent = "Continuar tras mi parlamento";
  } else if (state.isPaused) {
    elements.pauseSpeech.textContent = "Reanudar lectura";
  } else {
    elements.pauseSpeech.textContent = "Pausar lectura";
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

function updateLanguageOptions() {
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
 * @param {string} lang
 */
function formatLanguageLabel(lang) {
  const base = lang.split("-")[0].toLowerCase();
  const friendly = LANGUAGE_LABELS[base];
  return friendly ? `${friendly} (${lang})` : lang;
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
 * @param {string} text
 */
function chooseLanguageForLine(text) {
  if (state.preferredLanguage && state.preferredLanguage !== "auto") {
    return state.preferredLanguage;
  }
  return detectLanguageFromText(text);
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
