import builder from "./builder";

export const defaultState = {
  detail: null
};

export default builder("error", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "error.Set") {
      return {
        ...state,
        detail: action.payload
      };
    }
    if (action.type === "error.Reset") {
      return {
        ...state,
        detail: null
      };
    }
    return state;
  },
  actions: ["set", "reset"]
});
