import { translations } from "./translations.js";

/**
 * Get a translated string by key with optional parameter interpolation.
 * Parameters in the translation string use {paramName} syntax.
 *
 * @param {string} key - The translation key (e.g., "status.ready", "label.author")
 * @param {Record<string, string | number>} [params] - Optional parameters to interpolate
 * @returns {string} The translated string with parameters replaced
 *
 * @example
 * t("status.ready") // "Selecciona tu personaje y comienza el ensayo."
 * t("label.author", { author: "J. Luis Alonso de Santos" }) // "Autor: J. Luis Alonso de Santos"
 * t("label.textSizePx", { size: 18 }) // "18px"
 */
export function t(key, params) {
  const template = translations[key];
  if (template === undefined) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }

  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, paramName) => {
    const value = params[paramName];
    if (value === undefined) {
      console.warn(`Missing parameter "${paramName}" for translation key: ${key}`);
      return match;
    }
    return String(value);
  });
}

/**
 * Format a language code into a user-friendly label.
 * Uses the base language code to look up the translation key.
 *
 * @param {string} langCode - The language code (e.g., "es-ES", "en-US")
 * @returns {string} Formatted label like "Espa\u00f1ol (es-ES)" or the original code if unknown
 */
export function formatLanguageLabel(langCode) {
  const base = langCode.split("-")[0].toLowerCase();
  const key = `language.${base}`;
  const friendly = translations[key];
  return friendly ? `${friendly} (${langCode})` : langCode;
}
