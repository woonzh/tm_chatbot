import { combineReducers } from "redux";
import * as models from "../models";

export const reducersCollater = m =>
  Object.keys(m).reduce((rs, k) => {
    const model = m[k];
    if (typeof model !== "object") return rs;
    rs[k] = model.reducer;
    return rs;
  }, {});

export default combineReducers(reducersCollater(models));
