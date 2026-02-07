/**
 * All Spanish UI strings for the application.
 * Keys are organized by category: status, button, label, language, error, playback
 * @type {Record<string, string>}
 */
export const translations = {
  // Status messages
  "status.ready": "Selecciona tu personaje y comienza el ensayo.",
  "status.fallbackUsed": "No se pudo leer play.json directamente (esto ocurre al abrir el archivo sin servidor). Mostramos una copia integrada.",
  "status.loadError": "Ocurri\u00f3 un problema al cargar la obra. Actualiza la p\u00e1gina para intentarlo de nuevo.",
  "status.yourTurn": "Tu turno. Di tu parlamento y pulsa Continuar.",
  "status.playbackPaused": "Lectura en pausa.",
  "status.playbackResumed": "Lectura reanudada.",
  "status.playbackStopped": "Lectura detenida.",
  "status.playbackFinished": "Lectura finalizada.",
  "status.continuing": "Continuando\u2026",
  "status.playingOthers": "Reproduciendo parlamentos de otros personajes\u2026",
  "status.playingFromLine": "Reproduciendo desde el fragmento seleccionado\u2026",
  "status.speechUnavailable": "La lectura en voz alta no est\u00e1 disponible en este navegador.",
  "status.speechUnavailableManual": "La lectura en voz alta no est\u00e1 disponible en este navegador. Puedes leer y ocultar tus parlamentos manualmente.",
  "status.selectCharacterFirst": "Selecciona tu personaje antes de iniciar la lectura.",
  "status.noPlayLoaded": "A\u00fan no se ha cargado el texto.",
  "status.noOtherLines": "No hay parlamentos de otros personajes para reproducir.",
  "status.speechError": "No se pudo reproducir la voz.",
  "status.jumpError": "No se pudo reproducir ese fragmento.",

  // Button labels
  "button.play": "Reproducir",
  "button.pause": "Pausar",
  "button.resume": "Reanudar",
  "button.continue": "Continuar",
  "button.showMyLines": "Mostrar mis parlamentos",
  "button.hideMyLines": "Ocultar mis parlamentos",
  "button.showControlPanel": "Mostrar panel de control",
  "button.hideControlPanel": "Ocultar panel de control",
  "button.playFromLine": "\u25b6 Reproducir",

  // Labels
  "label.author": "Autor: {author}",
  "label.textSizePx": "{size}px",
  "label.speechRateX": "{rate}x",
  "label.characterSays": "{characters} dice: {text}",
  "label.playFromLineAria": "Reproducir desde esta l\u00ednea de {characters}",
  "label.languageAutoDetect": "Detectar autom\u00e1ticamente (prioriza espa\u00f1ol)",

  // Language names
  "language.es": "Espa\u00f1ol",
  "language.en": "Ingl\u00e9s",
  "language.fr": "Franc\u00e9s",
  "language.pt": "Portugu\u00e9s",
  "language.it": "Italiano",
  "language.de": "Alem\u00e1n",

  // Error messages
  "error.elementNotFound": "No se encontr\u00f3 el elemento con id {id}",
  "error.playLoadFailed": "No se pudo cargar el texto."
};
