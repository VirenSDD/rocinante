import { describe, it, expect, beforeEach } from "vitest";
import { renderLineCards, applyLineFontSize } from "../../../src/presentation/components/lineCards.js";

describe("lineCards component", () => {
  /** @type {HTMLElement} */
  let container;

  const lines = [
    { characterIds: ["narrator"], text: "La corte contiene el aliento." },
    { characterIds: ["aurora"], text: "Siento las manos que me buscan." },
    { characterIds: ["aurora", "tomas"], text: "Juntos al fin." }
  ];

  const characterMap = {
    narrator: "Narrador",
    aurora: "Aurora",
    tomas: "Tomás"
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  describe("renderLineCards", () => {
    it("renders all lines as cards", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "",
        characterMap,
        hideMyLines: false,
        activeLineIndex: null
      });

      const cards = container.querySelectorAll(".line-card");
      expect(cards.length).toBe(3);
    });

    it("shows character names in each card", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "",
        characterMap,
        hideMyLines: false,
        activeLineIndex: null
      });

      const characterDivs = container.querySelectorAll(".line-characters");
      expect(characterDivs[0].textContent).toBe("Narrador");
      expect(characterDivs[2].textContent).toBe("Aurora + Tomás");
    });

    it("shows line text when not hidden", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "aurora",
        characterMap,
        hideMyLines: false,
        activeLineIndex: null
      });

      const textEls = container.querySelectorAll(".line-text");
      expect(textEls[1].textContent).toBe("Siento las manos que me buscan.");
    });

    it("hides selected character lines when hideMyLines is true", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "aurora",
        characterMap,
        hideMyLines: true,
        activeLineIndex: null
      });

      const textEls = container.querySelectorAll(".line-text");
      expect(textEls[0].textContent).toBe("La corte contiene el aliento."); // Not Aurora's
      expect(textEls[1].textContent).toBe(""); // Aurora's - hidden
      expect(textEls[1].classList.contains("hidden")).toBe(true);
    });

    it("highlights selected character lines", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "aurora",
        characterMap,
        hideMyLines: false,
        activeLineIndex: null
      });

      const cards = container.querySelectorAll(".line-card");
      expect(cards[0].classList.contains("highlight")).toBe(false);
      expect(cards[1].classList.contains("highlight")).toBe(true);
      expect(cards[2].classList.contains("highlight")).toBe(true); // Multi-character line
    });

    it("marks active line as narrating", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "",
        characterMap,
        hideMyLines: false,
        activeLineIndex: 1
      });

      const cards = container.querySelectorAll(".line-card");
      expect(cards[0].classList.contains("narrating")).toBe(false);
      expect(cards[1].classList.contains("narrating")).toBe(true);
    });

    it("includes jump buttons with correct line index", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "",
        characterMap,
        hideMyLines: false,
        activeLineIndex: null
      });

      const jumpBtns = container.querySelectorAll(".line-jump");
      expect(jumpBtns.length).toBe(3);
      expect(jumpBtns[0].dataset.lineIndex).toBe("0");
      expect(jumpBtns[2].dataset.lineIndex).toBe("2");
    });

    it("sets data-text attribute for hidden lines", () => {
      renderLineCards(container, lines, {
        selectedCharacterId: "aurora",
        characterMap,
        hideMyLines: true,
        activeLineIndex: null
      });

      const textEls = container.querySelectorAll(".line-text");
      expect(textEls[1].dataset.text).toBe("Siento las manos que me buscan.");
    });
  });

  describe("applyLineFontSize", () => {
    it("sets CSS custom property for font size", () => {
      applyLineFontSize(24);

      const value = document.documentElement.style.getPropertyValue("--line-text-size");
      expect(value).toBe("24px");
    });
  });
});
