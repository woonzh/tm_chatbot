import builder from "./builder";

export const defaultState = { show: false, node: null, items: [] };

export default builder("propertyPanelProduct", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "propertyPanelProduct.Toggle") {
      if (action.payload) return { show: !state.show, node: action.payload };
      return { ...state, show: !state.show };
    }
    if (action.type === "propertyPanelProduct.Show") {
      return { ...state, show: true };
    }
    if (action.type === "propertyPanelProduct.Hide") {
      return { ...state, show: false };
    }
    return state;
  },
  actions: ["Show", "Hide", "Toggle"],
  apis: {}
});
