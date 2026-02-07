/**
 * @typedef {"playDataChanged" | "characterSelected" | "hideMyLinesChanged" | "lineFontSizeChanged" | "speechRateChanged" | "preferredLanguageChanged" | "voicesChanged" | "playbackStateChanged" | "activeLineChanged"} StateEventType
 */

/**
 * @typedef {(data: unknown) => void} EventCallback
 */

/** @type {Map<StateEventType, Set<EventCallback>>} */
const listeners = new Map();

/**
 * Subscribe to a state change event.
 *
 * @param {StateEventType} eventType - The event type to subscribe to
 * @param {EventCallback} callback - The callback to invoke when the event fires
 * @returns {() => void} Unsubscribe function
 */
export function subscribe(eventType, callback) {
  if (!listeners.has(eventType)) {
    listeners.set(eventType, new Set());
  }
  const eventListeners = /** @type {Set<EventCallback>} */ (listeners.get(eventType));
  eventListeners.add(callback);

  return () => {
    eventListeners.delete(callback);
  };
}

/**
 * Emit a state change event to all subscribers.
 *
 * @param {StateEventType} eventType - The event type to emit
 * @param {unknown} [data] - Optional data to pass to subscribers
 */
export function emit(eventType, data) {
  const eventListeners = listeners.get(eventType);
  if (!eventListeners) return;

  for (const callback of eventListeners) {
    try {
      callback(data);
    } catch (error) {
      console.error(`Error in event listener for ${eventType}:`, error);
    }
  }
}

/**
 * Remove all listeners for all events.
 * Useful for testing.
 */
export function clearAllListeners() {
  listeners.clear();
}
