export const defaultState = {
  result: {},
  checkStatus: {}
};
//console.log("hostname", window.location.hostname);

export default {
  reducer: (state = defaultState, action) => {
    if (action.type === "demo.loadDone") {
      return {
        ...state,
        result: action.payload
      };
    } else if (action.type === "demo.loadPatternDone") {
      return {
        ...state,
        result: action.payload
      };
    } else if (action.type === "demo.loadNLGDone") {
      return {
        ...state,
        result: action.payload
      };
    }
    return state;
  },
  actions: ["loadDone"],
  apis: {
    load: {
      method: "post",
      url: "http://" + window.location.hostname + ":1337/api/v1/demo/main",
      success: "demo.loadDone"
    },
    loadpattern: {
      method: "get",
      url: "http://" + window.location.hostname + ":1337/api/v1/demo/pattern",
      success: "demo.loadPatternDone"
    },
    loadnlg: {
      method: "post",
      url: "https://faas.amaris.ai/function/restaurant-nlg",
      success: "demo.loadNLGDone"
    }
  },
  ...defaultState
};
