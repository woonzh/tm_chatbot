import builder from "./builder";

export const defaultState = { node: null, items: [], outputs: [] };

export default builder("propertyPanel", defaultState, {
  reducer: (state = defaultState, action) => {
    const { type, payload } = action;
    if (type === "propertyPanel.SetOutputs") {
      return { ...state, outputs: [].merge(payload) };
    }
    if (type === "propertyPanel.AddOutput") {
      state.outputs.push(payload);
      return { ...state };
    }
    if (type === "propertyPanel.UpdateOutput") {
      const { item, update } = payload;
      Object.assign(item, update);
      return { ...state };
    }
    if (type === "propertyPanel.RemoveOutput") {
      const index = state.outputs.indexOf(payload);
      if (index >= 0) state.outputs.splice(index, 1);
      return { ...state };
    }

    if (type === "propertyPanel.SetParameters") {
      return { ...state, items: [].merge(payload) };
    }
    if (type === "propertyPanel.AddParameter") {
      state.items.push(payload);
      return { ...state };
    }
    if (type === "propertyPanel.UpdateParameter") {
      const { item, value, valueRef } = payload;
      if (payload.hasOwnProperty("value")) item.value = value;
      if (payload.hasOwnProperty("valueRef")) item.valueRef = valueRef;
      return { ...state };
    }
    if (type === "propertyPanel.RemoveParameter") {
      const remainingItems = state.items.filter(item => item.id !== payload);
      return { ...state, items: remainingItems };
    }
    if (type === "propertyPanel.Reset") {
      return { ...state, node: null, items: [] };
    }
    if (type === "propertyPanel.Fetch") {
      return { ...state, items: payload };
    }
    if (type === "propertyPanel.Populate") {
      return { ...state, node: payload };
    }
    return state;
  },
  actions: [
    "Populate",
    "Fetch",
    "Reset",
    "SetParameters",
    "AddParameter",
    "UpdateParameter",
    "UpdateParameter",
    "RemoveParameter",
    "AddOutput",
    "RemoveOutput",
    "UpdateOutput",
    "SetOutputs"
  ],
  apis: {
    list: {
      method: "get",
      url: `/api/v1/parameters`,
      before: "propertyPanel.Loading",
      success: "propertyPanel.Fetch",
      after: "propertyPanel.Loaded"
    }
  }
});
