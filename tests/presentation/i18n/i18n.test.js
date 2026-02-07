import { describe, it, expect, vi, beforeEach } from "vitest";
import { t, formatLanguageLabel } from "../../../src/presentation/i18n/i18n.js";

describe("i18n functions", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  describe("t (translation function)", () => {
    it("returns translation for valid key", () => {
      expect(t("status.ready")).toBe("Selecciona tu personaje y comienza el ensayo.");
    });

    it("returns key when translation not found", () => {
      expect(t("nonexistent.key")).toBe("nonexistent.key");
    });

    it("logs warning for missing key", () => {
      t("nonexistent.key");
      expect(console.warn).toHaveBeenCalledWith("Missing translation for key: nonexistent.key");
    });

    it("interpolates string parameters", () => {
      expect(t("label.author", { author: "Test Author" })).toBe("Autor: Test Author");
    });

    it("interpolates number parameters", () => {
      expect(t("label.textSizePx", { size: 18 })).toBe("18px");
    });

    it("handles multiple parameters", () => {
      expect(t("label.characterSays", { characters: "Aurora", text: "Hello" })).toBe(
        "Aurora dice: Hello"
      );
    });

    it("logs warning for missing parameter", () => {
      t("label.author", {});
      expect(console.warn).toHaveBeenCalledWith(
        'Missing parameter "author" for translation key: label.author'
      );
    });

    it("keeps placeholder when parameter is missing", () => {
      expect(t("label.author", {})).toBe("Autor: {author}");
    });
  });

  describe("formatLanguageLabel", () => {
    it("formats known language codes", () => {
      expect(formatLanguageLabel("es-ES")).toBe("Español (es-ES)");
      expect(formatLanguageLabel("en-US")).toBe("Inglés (en-US)");
    });

    it("handles case variations in base code", () => {
      expect(formatLanguageLabel("ES-ES")).toBe("Español (ES-ES)");
    });

    it("returns code as-is for unknown languages", () => {
      expect(formatLanguageLabel("xx-XX")).toBe("xx-XX");
    });

    it("handles simple language codes without region", () => {
      expect(formatLanguageLabel("es")).toBe("Español (es)");
    });
  });
});
