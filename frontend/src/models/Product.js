import builder from "./builder";

const { rootUrl } = global.constants;

export const defaultState = { items: [], detail: null };

export const normalizeNodes = nodes => {
  return [].merge(nodes).filter(o => normalizeNode(o));
};
export const normalizeNode = o => {
  o.image = o.image || "/assets/node/default-icon.svg";
  if (!o.cat) {
    o.cat = o.category || "__NoCategory";
    o.category =
      o.image !== "/assets/node/default-icon.svg" ? "onlyImage" : "default";
  }
  o.fill = "transparent";
  return o;
};
export const normalizeProductData = product => {
  let { nodeDataArray, linkDataArray, parameters } = product;
  return {
    ...product,
    nodeDataArray: normalizeNodes(
      [].merge(nodeDataArray).filter(o => !Object.isEmpty(o))
    ),
    linkDataArray: [].merge(linkDataArray).filter(o => !Object.isEmpty(o)),
    parameters: parameters.filter(o => !Object.isEmpty(o))
  };
};

export default builder("product", defaultState, {
  reducer: (state = defaultState, action) => {
    const { type, payload } = action;
    if (type === "product.RemoveParameters") {
      state.detail.parameters = [];
      return { ...state };
    }
    if (type === "product.RemoveParameter") {
      const index = state.detail.parameters.indexOf(payload);
      if (index >= 0) state.detail.parameters.splice(index, 1);
      return { ...state };
    }
    if (type === "product.ChangeParameter") {
      const { item, update } = payload;
      Object.assign(item, update);
      return { ...state };
    }
    if (type === "product.AddParameter") {
      state.detail.parameters.push({
        name: "",
        type: "string",
        value: "",
        isOutput: false,
        description: ""
      });
      return { ...state };
    }
    if (type === "product.ImportParameters") {
      state.detail.parameters = [].merge(payload);
      return { ...state };
    }
    if (type === "product.Change") {
      return {
        ...state,
        detail: { ...state.detail, ...payload }
      };
    }
    if (type === "product.Update") {
      const nodes = normalizeNodes(payload.nodeDataArray);
      return {
        ...state,
        detail: { ...state.detail, ...payload, nodeDataArray: nodes }
      };
    }
    if (type === "product.List") {
      return { ...state, items: payload };
    }
    if (type === "product.Search") {
      const q = payload;
      if (q)
        state.items.forEach(
          o =>
            (o.hide = !`${o.name} ${o.description}`
              .toLowerCase()
              .includes(q.toLowerCase()))
        );
      else state.items.forEach(o => (o.hide = false));
      return { ...state };
    }
    if (type === "product.Delete") {
      const found = state.items.find(o => o.product === payload.product);
      if (found) state.items.splice(state.items.indexOf(found), 1);
      return { ...state, detail: null };
    }
    if (type === "product.Detail") {
      const found = state.items.find(o => o.id === payload.id);
      let detail = {
        ...found,
        ...payload,
        nodeDataArray: normalizeNodes(payload.nodeDataArray)
      };
      if (found) state.items.splice(state.items.indexOf(found), 1, detail);
      else state.items.push(detail);
      return { ...state, detail };
    }
    return state;
  },
  actions: ["list", "search", "detail", "Update", "launch"].merge(
    ["Change", "ImportParameters", "AddParameter"],
    ["ChangeParameter", "RemoveParameter", "RemoveParameters"]
  ),
  apis: {
    exportScript: {
      method: "get",
      url: "/api/v1/products/export",
      failure: "notification.Notify"
    },
    list: {
      method: "get",
      url: "/api/v1/products",
      success: ["product.List"],
      failure: "notification.Notify"
    },
    detail: {
      url: "/api/v1/products",
      success: ["bot.Detail", "category.ProductUpdate", "product.Detail"],
      failure: "notification.Notify"
    },
    update: {
      method: "put",
      url: "/api/v1/products",
      success: ["bot.Detail", "category.ProductUpdate", "product.Detail"],
      failure: "notification.Notify"
    },
    create: {
      method: "post",
      url: "/api/v1/products",
      success: ["bot.Detail", "category.ProductUpdate", "product.Detail"],
      failure: "notification.Notify"
    },
    delete: {
      method: "delete",
      url: "/api/v1/products",
      success: ["bot.Delete", "category.ProductDelete", "product.Delete"],
      failure: "notification.Notify"
    },
    updateValues: {
      method: "put",
      url: "/api/v1/parameters",
      before: "propertyPanel.Loading",
      success: "propertyPanel.UpdateParameter",
      failure: "notification.Notify",
      after: "propertyPanel.Loaded"
    },
    nodeOutputs: {
      method: "get",
      url: "/api/v1/outputs",
      before: "propertyPanel.Loading",
      success: "propertyPanel.UpdateOutputs",
      failure: "notification.Notify",
      after: "propertyPanel.Loaded"
    },
    updateOutputs: {
      method: "put",
      url: "/api/v1/outputs",
      before: "propertyPanel.Loading",
      success: "propertyPanel.UpdateOutputs",
      failure: "notification.Notify",
      after: "propertyPanel.Loaded"
    },
    imageUpload: {
      method: "post",
      url: `${rootUrl}/api/v1/upload`,
      failure: "notification.Notify"
    }
  }
});
