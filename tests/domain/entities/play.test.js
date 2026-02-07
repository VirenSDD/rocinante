import { describe, it, expect } from "vitest";
import {
  createCharacterMap,
  isOwnLine,
  getLineCharacterNames,
  hasOtherCharacterLines
} from "../../../src/domain/entities/play.js";

describe("play entity functions", () => {
  const characters = [
    { id: "aurora", name: "Aurora" },
    { id: "tomas", name: "Tomás" },
    { id: "narrator", name: "Narrador" }
  ];

  const lines = [
    { characterIds: ["narrator"], text: "La corte contiene el aliento." },
    { characterIds: ["aurora"], text: "Siento las manos que me buscan." },
    { characterIds: ["aurora", "tomas"], text: "Juntos al fin." }
  ];

  describe("createCharacterMap", () => {
    it("creates a map from character ID to name", () => {
      const map = createCharacterMap(characters);

      expect(map).toEqual({
        aurora: "Aurora",
        tomas: "Tomás",
        narrator: "Narrador"
      });
    });

    it("returns empty object for empty array", () => {
      const map = createCharacterMap([]);
      expect(map).toEqual({});
    });
  });

  describe("isOwnLine", () => {
    it("returns true when character is in the line", () => {
      expect(isOwnLine(lines[1], "aurora")).toBe(true);
    });

    it("returns false when character is not in the line", () => {
      expect(isOwnLine(lines[0], "aurora")).toBe(false);
    });

    it("returns true for multi-character lines containing the character", () => {
      expect(isOwnLine(lines[2], "aurora")).toBe(true);
      expect(isOwnLine(lines[2], "tomas")).toBe(true);
    });
  });

  describe("getLineCharacterNames", () => {
    it("returns single character name", () => {
      const map = createCharacterMap(characters);
      expect(getLineCharacterNames(lines[0], map)).toBe("Narrador");
    });

    it("returns multiple character names joined with default separator", () => {
      const map = createCharacterMap(characters);
      expect(getLineCharacterNames(lines[2], map)).toBe("Aurora + Tomás");
    });

    it("uses custom separator", () => {
      const map = createCharacterMap(characters);
      expect(getLineCharacterNames(lines[2], map, " y ")).toBe("Aurora y Tomás");
    });

    it("falls back to ID if character not in map", () => {
      const map = {};
      expect(getLineCharacterNames(lines[0], map)).toBe("narrator");
    });
  });

  describe("hasOtherCharacterLines", () => {
    it("returns true when other characters have lines", () => {
      expect(hasOtherCharacterLines(lines, "aurora")).toBe(true);
    });

    it("returns false when all lines belong to the character", () => {
      const onlyAuroraLines = [
        { characterIds: ["aurora"], text: "Line 1" },
        { characterIds: ["aurora"], text: "Line 2" }
      ];
      expect(hasOtherCharacterLines(onlyAuroraLines, "aurora")).toBe(false);
    });

    it("returns true for empty character ID", () => {
      expect(hasOtherCharacterLines(lines, "")).toBe(true);
    });
  });
});
