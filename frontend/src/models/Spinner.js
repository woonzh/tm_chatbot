import builder from "./builder";

export const defaultState = {
  show: false,
  loading: false
};

export default builder("spinner", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "spinner.Show") {
      return { ...state, show: true };
    }
    if (action.type === "spinner.Hide") {
      return { ...state, show: false };
    }
    if (action.type === "spinner.Toggle") {
      return { ...state, show: !state.show };
    }
    return state;
  },
  actions: ["show", "hide", "toggle"]
});
