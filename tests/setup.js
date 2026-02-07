import { vi, beforeEach, afterEach } from "vitest";

// Mock Web Speech API
beforeEach(() => {
  // Mock SpeechSynthesisUtterance
  global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
    text,
    rate: 1,
    lang: "",
    voice: null,
    onend: null,
    onerror: null
  }));

  // Mock speechSynthesis
  global.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([
      { lang: "es-ES", name: "Spanish Voice" },
      { lang: "en-US", name: "English Voice" }
    ]),
    speaking: false,
    paused: false,
    onvoiceschanged: null
  };
});

afterEach(() => {
  vi.clearAllMocks();
});
