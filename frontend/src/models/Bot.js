import builder from "./builder";

const detail = {
  atomic: true,
  name: "",
  description: "",
  category: "",
  executor: { script: "" },
  parameters: [],
  runonclient: true,
  public: false,
  isAIBot: false
};

export const defaultState = {
  items: [],
  detail: { ...detail },
  temp: {}
};

export default builder("bot", defaultState, {
  reducer: (state = defaultState, action) => {
    const { type, payload } = action;
    ////////Experiment
    if (type === "bot.CreateExperiment") {
      return {
        ...state,
        temp: Object.omit(payload, "config")
      };
    }
    if (type === "bot.UpdateExperiment") {
      return {
        ...state,
        temp: {
          ...state.temp,
          ...Object.omit(payload, "config")
        }
      };
    }
    if (type === "bot.CleanExperiment") {
      return { ...state, temp: null };
    }
    ////////Experiment End
    if (type === "bot.List") {
      return { ...state, items: [].merge(payload) };
    }
    if (type === "bot.Delete") {
      const found = state.items.find(o => o.product === payload.product);
      if (found) state.items.splice(state.items.indexOf(found), 1);
      return { ...state, detail: { ...detail } };
    }
    if (type === "bot.Detail") {
      state.detail = payload || {
        ...detail,
        executor: { script: "" },
        parameters: []
      };
      const found = state.items.find(o => o.product === state.detail.product);
      if (found)
        state.items.splice(state.items.indexOf(found), 1, state.detail);
      else state.items.push(state.detail);
      return { ...state };
    }
    if (type === "bot.Update") {
      const [p, v] = payload;
      state.detail[p] = v;
      return { ...state };
    }
    if (type === "bot.UpdateExecutor") {
      state.detail.executor = { ...state.detail.executor, ...payload };
      return { ...state };
    }
    ////////Params
    if (type === "bot.ImportParameters") {
      state.detail.parameters = []
        .merge(payload)
        .map(o => Object.omit(o, "id"));
      return { ...state };
    }
    if (type === "bot.AddParam") {
      state.detail.parameters.push(payload);
      return { ...state };
    }
    if (type === "bot.RemoveParam") {
      const idx = state.detail.parameters.indexOf(payload);
      if (idx >= 0) state.detail.parameters.splice(idx, 1);
      return { ...state };
    }
    if (type === "bot.UpdateParam") {
      const [item, p, v] = payload;
      item[p] = v;
      return { ...state };
    }
    return state;
  },
  actions: ["List", "Detail", "Delete", "Update", "UpdateExecutor"] //
    .merge(["ImportParameters", "AddParam", "UpdateParam", "RemoveParam"])
    .merge(["CreateExperiment", "UpdateExperiment", "CleanExperiment"]),
  apis: {
    fetch: {
      url: "/api/v1/templates",
      success: ["bot.List", "category.AddProducts"],
      failure: "notification.Notify"
    },
    detail: {
      url: "/api/v1/products",
      success: ["bot.Detail", "category.ProductLoad"]
    },
    upsert: {
      url: "/api/v1/products",
      method: "post",
      success: ["bot.Detail", "category.ProductUpdate"],
      failure: "notification.Notify"
    },
    delete: {
      url: "/api/v1/products",
      method: "delete",
      success: ["bot.Delete", "category.ProductDelete"],
      failure: "notification.Notify"
    },
    experiment: {
      url: "/api/v1/experiment",
      method: "post",
      success: "bot.UpdateExperiment",
      failure: "notification.Notify"
    },
    experimentclean: {
      url: "/api/v1/experiment",
      method: "delete",
      success: "bot.CleanExperiment",
      failure: "notification.Notify"
    },
    experimenttest: {
      url: "/api/v1/experiment",
      method: "put",
      success: "bot.UpdateExperiment",
      failure: "notification.Notify"
    }
  }
});
