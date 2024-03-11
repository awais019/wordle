import { mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
import {
  VICTORY_MESSAGE,
  DEFEAT_MESSAGE,
  WORD_SIZE,
  MAX_GUESSES_COUNT,
} from "@/settings";

describe("WordleBoard", () => {
  let wordOfTheDay = "TESTS";
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } });
  });

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find("input[type='text']");
    await guessInput.setValue(guess);
    await guessInput.trigger("keydown.enter");
  }

  describe("End of the game messages", () => {
    test("a victory message should appear when the user makes a guess that matches the word of the day.", async () => {
      await playerSubmitsGuess(wordOfTheDay);

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    describe.each(
      Array.from({ length: MAX_GUESSES_COUNT + 1 }, (_, numberOfGuesses) => ({
        numberOfGuesses,
        shouldSeeDefeatMessage: numberOfGuesses === MAX_GUESSES_COUNT,
      }))
    )(
      `a defeat message should appear if the player makes incorrect guesses ${MAX_GUESSES_COUNT} times in a row`,
      ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
        test(`therefore for ${numberOfGuesses} guess(es), a defeat message should ${
          shouldSeeDefeatMessage ? "" : "not"
        } appear`, async () => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerSubmitsGuess("WRONG");
          }
          if (shouldSeeDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
          }
        });
      }
    );

    test("no end-of-game messge appears if the user has not yet made a guess.", async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });
  });

  describe("rules for defining the word of the day", () => {
    beforeEach(() => {
      console.warn = vi.fn();
    });

    test.each([
      { wordOfTheDay: "FLY", reason: "word-of-the-day must have 5 characters" },
      {
        wordOfTheDay: "tests",
        reason: "word-of-the-day must be all uppercase",
      },
      {
        wordOfTheDay: "QWERT",
        reason: "word-of-the-day must be a valid English word",
      },
    ])(
      "Since $reason: $wordOfTheDay is invalid, therefore a warning must be emitted",
      async ({ wordOfTheDay }) => {
        mount(WordleBoard, { props: { wordOfTheDay } });

        expect(console.warn).toHaveBeenCalled();
      }
    );

    test("no warning is emitted if the word of the day is a real uppercase English word with 5 characters", async () => {
      mount(WordleBoard, { props: { wordOfTheDay } });

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe("player input", () => {
    test("remains in focus the entire time", async () => {
      document.body.innerHTML = `<div id="app"></div>`;
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: "#app",
      });

      expect(
        wrapper.find("input[type=text]").attributes("autofocus")
      ).not.toBeUndefined();

      await wrapper.find("input[type=text]").trigger("blur");
      expect(document.activeElement).toBe(
        wrapper.find("input[type=text]").element
      );
    });

    test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + "EXTRA");

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    test("player guesses are only submitted if they are real words", async () => {
      await playerSubmitsGuess("QWERT");

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });

    test("player guesses are not case sensitive", async () => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase());

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    test("player guesses can only contain letters", async () => {
      await playerSubmitsGuess("H3!RT");

      expect(
        wrapper.find<HTMLInputElement>("input[type='text']").element.value
      ).toEqual("HRT");
    });
  });
});
