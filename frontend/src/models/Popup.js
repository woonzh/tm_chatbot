import builder from "./builder";

export const defaultState = {
  items: []
};

export default builder("popup", defaultState, {
  reducer: (state = defaultState, action) => {
    const { type, payload } = action;
    if (type === "popup.Add") {
      state.items.push(payload);
      return { ...state };
    }
    if (type === "popup.Update") {
      return { ...state };
    }
    if (type === "popup.Remove") {
      const idx = state.items.indexOf(payload);
      if (idx >= 0) state.items.splice(idx, 1);
      return { ...state };
    }
    if (type === "popup.RemoveAll") {
      state.items = [];
      return { ...state };
    }
    if (type === "popup.RemoveLast") {
      state.items.pop();
      return { ...state };
    }
    return state;
  },
  actions: ["add", "update", "remove", "removeAll", "removeLast"]
});
