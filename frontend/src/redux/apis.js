import * as models from "../models";

export default (global.apis = Object.keys(models).reduce((rs, k) => {
  const model = models[k];
  if (typeof model !== "object") return rs;
  const apis = model.apis || [];
  if (typeof model !== "object") return rs;
  rs[k.lcfirst()] = apis;
  return rs;
}, {}));
