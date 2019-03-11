export const defaultState = {
  result: {},
  checkStatus: {}
};
//console.log("hostname", window.location.hostname);

export default {
  reducer: (state = defaultState, action) => {
    if (action.type === "annotation.UploadDone") {
      return {
        ...state,
        result: action.payload
      };
    }
    return state;
  },
  actions: ["detect"],
  apis: {
    upload: {
      method: "post",
      url: "http://" + window.location.hostname + ":1337/api/v1/utils/load",
      success: "annotation.UploadDone"
    },
    export: {
      method: "post",
      url: "http://" + window.location.hostname + ":1337/api/v1/utils/export",
      success: "annotation.ExportDone"
    }
  },
  ...defaultState
};
