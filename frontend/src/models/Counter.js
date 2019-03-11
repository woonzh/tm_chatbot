import builder from "./builder";

const { refreshTime } = global.constants;

export const defaultState = {
  stop: false,
  count: refreshTime,
  label: "Pulling data in",
  action: ""
};

export default builder("counter", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "counter.Stop") {
      return { ...state, stop: true };
    }
    if (action.type === "counter.Start") {
      return { ...state, stop: false };
    }
    if (action.type === "counter.Set") {
      return { ...state, count: action.payload, stop: false };
    }
    if (action.type === "counter.Reset") {
      return { ...state, count: refreshTime, stop: false };
    }
    if (action.type === "counter.Increase") {
      if (state.stop) return state;
      return { ...state, count: state.count + 1, stop: false };
    }
    if (action.type === "counter.Decrease") {
      if (state.stop) return state;
      return { ...state, count: state.count - 1, stop: false };
    }
    return state;
  },
  actions: ["set", "reset", "increase", "decrease", "stop", "start"]
});
