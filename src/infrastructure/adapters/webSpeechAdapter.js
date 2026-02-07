/**
 * @typedef {import('../../domain/ports/speechPort.js').ISpeechService} ISpeechService
 * @typedef {import('../../domain/ports/speechPort.js').SpeakOptions} SpeakOptions
 * @typedef {import('../../domain/ports/speechPort.js').VoiceInfo} VoiceInfo
 */

/**
 * Create a Web Speech API adapter implementing ISpeechService.
 *
 * @returns {ISpeechService}
 */
export function createWebSpeechAdapter() {
  /** @type {SpeechSynthesisUtterance | null} */
  let currentUtterance = null;

  /** @type {SpeechSynthesisVoice[]} */
  let cachedVoices = [];

  /**
   * Pick the best voice for a given language.
   * @param {string} language
   * @returns {SpeechSynthesisVoice | null}
   */
  function pickVoiceForLanguage(language) {
    if (!cachedVoices.length) return null;
    const normalized = language.toLowerCase();

    // Try exact match first
    const exact = cachedVoices.find((voice) => voice.lang.toLowerCase() === normalized);
    if (exact) return exact;

    // Try base language match
    const base = normalized.split("-")[0];
    return cachedVoices.find((voice) => voice.lang.toLowerCase().startsWith(base)) || null;
  }

  return {
    /**
     * Check if speech synthesis is supported.
     * @returns {boolean}
     */
    isSupported() {
      return typeof window !== "undefined" && "speechSynthesis" in window;
    },

    /**
     * Speak text with the given options.
     * @param {SpeakOptions} options
     */
    speak(options) {
      if (!this.isSupported()) return;

      const utterance = new SpeechSynthesisUtterance(options.text);
      utterance.rate = options.rate;
      utterance.lang = options.language;

      const voice = pickVoiceForLanguage(options.language);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        currentUtterance = null;
        options.onEnd();
      };

      utterance.onerror = (event) => {
        currentUtterance = null;
        options.onError(new Error(event.error || "Speech synthesis error"));
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    },

    /**
     * Pause the current speech.
     */
    pause() {
      if (!this.isSupported()) return;
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
      }
    },

    /**
     * Resume paused speech.
     */
    resume() {
      if (!this.isSupported()) return;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    },

    /**
     * Cancel all speech.
     */
    cancel() {
      if (!this.isSupported()) return;
      window.speechSynthesis.cancel();
      if (currentUtterance) {
        currentUtterance.onend = null;
        currentUtterance = null;
      }
    },

    /**
     * Check if currently speaking.
     * @returns {boolean}
     */
    isSpeaking() {
      if (!this.isSupported()) return false;
      return window.speechSynthesis.speaking;
    },

    /**
     * Check if speech is paused.
     * @returns {boolean}
     */
    isPaused() {
      if (!this.isSupported()) return false;
      return window.speechSynthesis.paused;
    },

    /**
     * Get available voices.
     * @returns {VoiceInfo[]}
     */
    getVoices() {
      if (!this.isSupported()) return [];
      cachedVoices = window.speechSynthesis.getVoices();
      return cachedVoices.map((voice) => ({
        lang: voice.lang,
        name: voice.name
      }));
    },

    /**
     * Register a callback for when voices change.
     * @param {() => void} callback
     */
    onVoicesChanged(callback) {
      if (!this.isSupported()) return;

      // Initial population
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        cachedVoices = voices;
        callback();
      }

      // Listen for changes
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoices = window.speechSynthesis.getVoices();
        callback();
      };
    }
  };
}
