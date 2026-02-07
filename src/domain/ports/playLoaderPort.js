/**
 * @typedef {import('../entities/play.js').PlayData} PlayData
 */

/**
 * Result of loading play data.
 *
 * @typedef {{
 *   data: PlayData;
 *   usedFallback: boolean;
 * }} PlayLoadResult
 */

/**
 * Play loader interface for fetching play data.
 *
 * @typedef {{
 *   load: () => Promise<PlayLoadResult>;
 * }} IPlayLoader
 */

/**
 * Factory function type for creating play loader instances.
 * @typedef {() => IPlayLoader} PlayLoaderFactory
 */

export {};
