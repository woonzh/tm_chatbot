import builder from "./builder";
import { normalizeNodes } from "./Product";

export const defaultState = { items: [], detail: {} };

export default builder("process", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "process.Reset") {
      return { ...state, detail: null };
    }
    if (action.type === "process.Add") {
      const processObj = action.payload;
      processObj.nodeDataArray = normalizeNodes(processObj.nodeDataArray);
      if (!state.items.find(o => o.id === processObj.id))
        state.items.push(processObj);
      return { ...state, detail: processObj };
    }
    if (action.type === "process.Run") {
      const detail = action.payload;
      const { nodeDataArray } = detail;
      nodeDataArray.forEach(o => delete o.background);
      return { ...state, detail };
    }
    if (action.type === "process.Done") {
      const detail = { ...action.payload };
      const { nodeDataArray } = detail;
      nodeDataArray.forEach(o => delete o.background);
      return { ...state, detail };
    }
    if (action.type === "process.Watch") {
      const { id, nodeid, status } = action.payload;
      if (!id || !nodeid || !status) return state;
      const processObj = state.items.find(o => o.id === id);
      if (!processObj) return state;
      const { nodeDataArray } = processObj;
      const node = nodeDataArray.find(o => o.id === nodeid);
      if (!node) return state;
      node.background = status === "start" ? "white" : "green";
      return { ...state };
    }
    return state;
  },
  actions: ["Reset", "Add", "Run", "Watch", "Done"],
  apis: {
    create: {
      method: "post",
      url: "/api/v1/process",
      success: "process.Add",
      failure: "notification.Notify"
    },
    run: {
      method: "post",
      url: "/api/v1/process/run",
      // success: "process.Add",
      failure: "notification.Notify"
    },
    watch: {
      method: "post",
      url: "/api/v1/process/watch",
      success: "process.Watch",
      failure: "notification.Notify"
    }
  }
});
