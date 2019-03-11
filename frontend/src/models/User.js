import _ from "lodash";

import builder from "./builder";

const { constants } = global;
const { profileUrl, loginUrl, logoutUrl, registerUrl } = constants;

export const defaultState = {
  criteria: { search: "", order: "desc", orderBy: "" },
  items: [],
  detail: {},
  profile: {},
  groups: [],
  group: {},
  actions: [],
  action: {},
  nameFormat: function(user, defaultText) {
    if (!user) return defaultText;
    const { profile, preferences } = user;
    if (!preferences) return defaultText;
    const { nameFormat } = preferences;
    let name = nameFormat;
    Object.keys(_.omit(profile, "id")).forEach(o => {
      name = name.replace(o, profile[o]);
    });
    if (name.replace(/[\W]/gi, "")) return name;
    else return defaultText || user.username;
  },
  hasAction: function(action) {
    const user = this.profile;
    const actionnames = user.actionnames;
    return actionnames.includes(action);
  },
  hasOneOfActions: function(...actions) {
    const user = this.profile;
    const actionnames = [].concat(user.actionnames);
    let rs = false;
    for (let i in actions) {
      if (rs) break;
      if (actionnames.includes(actions[i])) rs = true;
    }
    return rs;
  },
  hasAllActions: function(actions) {
    const user = this.profile;
    const actionnames = [].concat(user.actionnames);
    if (!actionnames.length) return false;
    let rs = true;
    for (let i in actions) {
      if (!rs) break;
      if (!actionnames.includes(actions[i])) rs = false;
    }
    return rs;
  }
};

export default builder("user", defaultState, {
  reducer: (state = defaultState, action) => {
    if (action.type === "user.Criteria") {
      return { ...state, criteria: { ...state.criteria, ...action.payload } };
    }
    if (action.type === "user.Profile") {
      return { ...state, profile: action.payload };
    }
    if (action.type === "user.List") {
      return { ...state, items: action.payload };
    }
    if (action.type === "user.Add") {
      state.items.push(action.payload);
      return { ...state };
    }
    if (action.type === "user.Remove") {
      const found = state.items.indexOf(action.payload);
      if (found >= 0) state.items.splice(found, 1);
      return { ...state };
    }
    if (action.type === "user.Detail") {
      return { ...state, detail: action.payload };
    }
    if (action.type === "user.Groups") {
      return { ...state, groups: action.payload };
    }
    if (action.type === "user.Group") {
      return { ...state, group: action.payload };
    }
    if (action.type === "user.Actions") {
      return { ...state, actions: action.payload };
    }
    if (action.type === "user.Action") {
      return { ...state, action: action.payload };
    }
    return state;
  },
  actions: ["Login", "Logout", "Profile", "List", "Detail"].concat([
    "Criteria",
    "Add",
    "Remove",
    "Actions",
    "Action",
    "Groups",
    "Group"
  ]),
  apis: {
    list: {
      method: "get",
      url: "/api/v1/users",
      success: "user.List",
      failure: ["notification.Notify"]
    },
    detail: {
      method: "get",
      url: "/api/v1/users",
      success: "user.Detail",
      failure: ["notification.Notify"]
    },
    profileupdate: {
      method: "post",
      url: "/api/v1/profile",
      success: ["user.Profile"],
      failure: ["notification.Notify"]
    },
    passwordupdate: {
      method: "put",
      url: "/api/v1/passwordupdate",
      failure: ["notification.Notify"]
    },
    password: {
      method: "put",
      url: "/api/v1/userpassword",
      // success: "user.Detail",
      failure: ["notification.Notify"]
    },
    groups: {
      method: "get",
      url: "/api/v1/groups",
      success: "user.Groups",
      failure: ["notification.Notify"]
    },
    group: {
      method: "get",
      url: "/api/v1/groups",
      success: "user.Group",
      failure: ["notification.Notify"]
    },
    actions: {
      method: "get",
      url: "/api/v1/actions",
      success: "user.Actions",
      failure: ["notification.Notify"]
    },
    action: {
      method: "get",
      url: "/api/v1/actions",
      success: "user.Action",
      failure: ["notification.Notify"]
    },
    create: {
      method: "post",
      url: "/api/v1/usercreate",
      success: ["user.Detail", "user.Add"],
      failure: ["notification.Notify"]
    },
    remove: {
      method: "delete",
      url: "/api/v1/users",
      success: ["user.Remove"],
      failure: ["notification.Notify"]
    },
    savegroups: {
      method: "put",
      url: "/api/v1/usergroups",
      success: "user.Detail",
      failure: ["notification.Notify"]
    },
    saveprofile: {
      method: "put",
      url: "/api/v1/userprofile",
      success: "user.Detail",
      failure: ["notification.Notify"]
    },
    savepreferences: {
      method: "put",
      url: "/api/v1/userpreferences",
      success: "user.Detail",
      failure: ["notification.Notify"]
    },
    register: {
      method: "post",
      url: registerUrl,
      success: ["application.Authenticate", "user.Profile"],
      failure: ["notification.Notify"]
    },
    login: {
      method: "post",
      url: loginUrl,
      success: ["application.Authenticate", "user.Profile"],
      failure: ["notification.Notify"]
    },
    logout: {
      method: "get",
      url: logoutUrl,
      success: "application.Logout",
      failure: ["application.Logout", "notification.Notify"]
    },
    profile: {
      method: "get",
      url: profileUrl,
      success: "user.Profile",
      failure: "notification.Notify"
    }
  }
});
