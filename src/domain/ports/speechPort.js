/**
 * @typedef {{
 *   text: string;
 *   language: string;
 *   rate: number;
 *   onEnd: () => void;
 *   onError: (error: Error) => void;
 * }} SpeakOptions
 */

/**
 * @typedef {{
 *   lang: string;
 *   name: string;
 * }} VoiceInfo
 */

/**
 * Speech service interface for text-to-speech functionality.
 *
 * @typedef {{
 *   isSupported: () => boolean;
 *   speak: (options: SpeakOptions) => void;
 *   pause: () => void;
 *   resume: () => void;
 *   cancel: () => void;
 *   isSpeaking: () => boolean;
 *   isPaused: () => boolean;
 *   getVoices: () => VoiceInfo[];
 *   onVoicesChanged: (callback: () => void) => void;
 * }} ISpeechService
 */

/**
 * Factory function type for creating speech service instances.
 * @typedef {() => ISpeechService} SpeechServiceFactory
 */

export {};
