import builder from "./builder";

const { constants } = global;
const { tokenName, rootUrl, configUrl, authUrl } = constants;

export const defaultState = {
  currentPage: null,
  name: "AI PROCESS AUTOMATION",
  shortname: "APA",
  logo: "logo.svg",
  routes: [],
  menu: [],
  topmenu: [],
  token: null,
  components: {},
  folders: [],
  folder: {},
  files: [],
  file: {},
  icons: [],
  accountFields: [],
  profileFields: [],
  preferencesFields: [],
  isAuthenticated: function() {
    this.token = localStorage.getItem(tokenName);
    return this.token;
  },
  defaultPath: function() {
    if (this.routes.length) {
      const found = this.routes.find(o => o.default);
      if (found) return found.path;
    }
    return "/";
  }
};

export default builder("application", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "application.OnEnter") {
      return { ...state, enter: action.payload ? true : false };
    }
    if (action.type === "application.OnEscape") {
      return { ...state, escape: action.payload ? true : false };
    }
    if (action.type === "application.OnRemoveLastPopup") {
      return { ...state, removingLastPopup: action.payload ? true : false };
    }
    if (action.type === "application.SetCurrentPage") {
      return { ...state, currentPage: action.payload };
    }
    if (action.type === "application.Unauthorized") {
      localStorage.setItem(tokenName, "");
      return { ...state, token: "" };
    }
    if (action.type === "application.Authenticate") {
      const { payload } = action;
      const token = payload[tokenName];
      localStorage.setItem(tokenName, token || "");
      return { ...state, token };
    }
    if (action.type === "application.Logout") {
      return { ...state, token: "" };
    }
    if (action.type === "application.LoadToken") {
      return { ...state, token: action.payload || "" };
    }
    if (action.type === "application.FetchIcons") {
      return { ...state, icons: action.payload };
    }
    if (action.type === "application.OpenFile") {
      return { ...state, file: action.payload };
    }
    if (action.type === "application.OpenFolder") {
      return { ...state, folder: action.payload };
    }
    if (action.type === "application.FetchFiles") {
      return { ...state, files: action.payload };
    }
    if (action.type === "application.FetchFolders") {
      return { ...state, folders: action.payload };
    }
    if (action.type === "application.SetComponents") {
      return { ...state, components: action.payload };
    }
    if (action.type === "application.Fetch") {
      return { ...state, ...action.payload };
    }
    return state;
  },
  actions: ["SetCurrentPage", "SetComponents"] //
    .merge(["LoadToken", "Authenticate", "Logout", "Unauthorized"])
    .merge(["Fetch", "FetchIcons"])
    .merge(["OnEnter", "OnEscape", "OnRemoveLastPopup"])
    .merge(["FetchFolders", "FetchFiles", "OpenFolder", "OpenFile"]),
  apis: {
    authenticate: {
      url: authUrl,
      success: "application.Authenticate",
      nospinner: true
    },
    fetch: {
      url: configUrl,
      success: "application.Fetch",
      nospinner: true
    },
    fetchFolders: {
      method: "get",
      url: `/api/v1/finder`,
      success: "application.FetchFolders",
      failure: "notification.Notify"
    },
    fetchFiles: {
      method: "get",
      url: `/api/v1/finder`,
      success: "application.FetchFiles",
      failure: "notification.Notify"
    },
    upload: {
      method: "post",
      upload: true,
      url: `/api/v1/finder`,
      success: "application.FetchFiles",
      failure: "notification.Notify"
    },
    download: {
      method: "get",
      url: `/api/v1/download`
      // failure: "notification.Notify"
    },
    unlink: {
      method: "delete",
      url: `/api/v1/finder`,
      success: "application.FetchFiles",
      failure: "notification.Notify"
    },
    icons: {
      method: "get",
      url: `${rootUrl}/api/v1/icons`,
      success: "application.FetchIcons",
      failure: "notification.Notify",
      nospinner: true
    }
  }
});
