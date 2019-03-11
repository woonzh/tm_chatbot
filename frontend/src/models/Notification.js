import builder from "./builder";

export const defaultState = {
  items: []
};

export default builder("notification", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "notification.Notify") {
      state.items.push(action.payload);
      return { ...state };
    }
    if (action.type === "notification.Remove") {
      if (state.items.indexOf(action.payload) >= 0) {
        state.items.splice(state.items.indexOf(action.payload), 1);
      }
      return { ...state };
    }
    return state;
  },
  actions: ["notify", "remove"]
});
