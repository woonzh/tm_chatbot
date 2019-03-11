import builder from "../../models/builder";
import globals from "../../globals";

const name = "ModelName";
const defaultWords = "Silent";
const words = "Hello world";

const defaultState = {
  words: defaultWords
};
const config = {
  reducer: (state = defaultState, action) => {
    if (action.type === `${name}.Say`) {
      return { ...state, words: action.payload };
    }
    return { ...state };
  },
  actions: ["Say"],
  apis: {
    action: {
      url: "url",
      success: "action"
    }
  }
};

let modelBuilt;

describe("Model builder for redux", () => {
  beforeEach(() => {
    modelBuilt = builder(name, defaultState, config);
  });

  test("Default state should be returned", () => {
    expect(modelBuilt.hasOwnProperty("loading")).toBe(true);
    expect(modelBuilt.hasOwnProperty("words")).toBe(true);
    expect(modelBuilt.words).toBe(defaultWords);
    expect(modelBuilt.actions).toContain("Loading", "Loaded");
  });

  test("Reducer function should return loading true for action type 'Loading'", () => {
    const state = { loading: false };
    const action = {
      type: `${name}.Loading`
    };
    const result = modelBuilt.reducer(state, action);
    expect(result.loading).toEqual(true);
  });

  test("Reducer function should return loading false for action type 'Loaded'", () => {
    const state = { loading: false };
    const action = {
      type: `${name}.Loaded`
    };
    const result = modelBuilt.reducer(state, action);
    expect(result.loading).toEqual(false);
  });

  test(`Reducer function should return words to be ${words}`, () => {
    const state = { loading: false };
    const action = {
      type: `${name}.Say`,
      payload: words
    };
    const result = modelBuilt.reducer(state, action);
    expect(result.words).toEqual(words);
  });

  test(`Test case for default reducer handler`, () => {
    const state = { a: "a", b: "b", c: "c" };
    const action = { type: `anonymous.Action` };
    const result = modelBuilt.reducer(state, action);
    expect(Object.keys(result)).toEqual(["a", "b", "c"]);
  });
});
