import * as models from "../models";
import apis from "./apis";

export default state => {
  return Object.keys(models).reduce(
    (rs, k) => {
      const model = models[k];
      if (typeof model !== "object") return rs;
      rs[k] = state.hasOwnProperty(k) ? state[k] : rs[k];
      return rs;
    },
    {
      apis
    }
  );
};
