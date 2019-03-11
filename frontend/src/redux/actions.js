import { api, URL, method, headers } from "../utils";

import * as models from "../models";
import { sailsIO } from "../socket";

import apis from "./apis";

const { constants } = global;
const { tokenName, logAction } = constants;

const url = (opts, data) => {
  if (!opts) opts = {};
  const { body } = opts;
  return URL({
    ...opts,
    body: { ...body, ...data }
  });
};
const dispatchLog = (...args) => {
  if (logAction) console.log("dispatchLog", ...args);
  const { dispatch } = global.store;
  return dispatch(...args);
};
const dispatchAll = async (payload, ...acts) => {
  acts = [].merge(...acts);
  return Promise.all(acts.map(type => dispatchLog({ type, payload })));
};

export const socketRequest = async (opts, data) => {
  const nospinner = (data && data.nospinner) || (opts && opts.nospinner);
  const { model } = opts;
  if (!nospinner) dispatchLog({ type: "spinner.Show" });
  if (model) dispatchLog({ type: `${model.toLowerCase()}.Loading` });
  const { before, success, failure, after, body } = opts;
  await dispatchAll([opts, data], before);
  return new Promise((resolve, reject) => {
    const reqOpts = {
      ...opts,
      url: url(opts, data),
      method: method(opts, data),
      data: { ...body, ...data },
      headers: headers(opts)
    };
    sailsIO.socket.request(reqOpts, (data, jwr) => {
      const { error } = jwr;
      if (error) reject({ ...jwr, req: reqOpts, message: data, type: "error" });
      else resolve(data, jwr);
    });
  })
    .then(async data => {
      try {
        if (data.hasOwnProperty(tokenName))
          await dispatchLog({
            type: "application.Authenticate",
            payload: data
          });
        await dispatchAll(data, success);
        return data;
      } catch (e) {
        const err = { ...e, data };
        throw err;
      }
    })
    .catch(async json => {
      console.log("Socket Request: error", json);
      await dispatchLog({ type: "error.Set", payload: json });
      await dispatchAll(json, failure);
      return json;
    })
    .then(async json => {
      await setTimeout(async json => {
        if (!nospinner) await dispatchLog({ type: "spinner.Hide" });
        if (model) dispatchLog({ type: `${model.toLowerCase()}.Loaded` });
        await dispatchAll([opts, data, json], after);
      }, 1000);
      return json;
    });
};
export const apiCall = async (opts, data, upload) => {
  if (!opts) opts = {};
  const nospinner = (data && data.nospinner) || (opts && opts.nospinner);
  const { model } = opts;
  if (!nospinner) dispatchLog({ type: "spinner.Show" });
  if (model) dispatchLog({ type: `${model.toLowerCase()}.Loading` });
  let { before, success, failure, after, body } = opts;
  await dispatchAll([opts, data], before);
  if (data) {
    if (typeof data === "string") body = data;
    else body = { ...body, ...data };
  }
  return api({
    ...opts,
    mode: "cors",
    upload: opts.upload || upload,
    body
  })
    .then(
      async res => {
        if (res.status === 404) {
          const err = { message: "API not found" };
          throw err;
        }
        if (res.status === 401)
          await dispatchLog({ type: "application.Unauthorized" });
        else await dispatchLog({ type: "error.Reset" });

        let json;
        try {
          json = await res.json();
        } catch (e) {
          const err = { ...res, message: res.statusText };
          throw err;
        }
        if (res.ok) {
          if (json.hasOwnProperty(tokenName))
            await dispatchLog({
              type: "application.Authenticate",
              payload: json
            });
          await dispatchAll(json, success);
          return json;
        }
        throw json;
      },
      e => e
    )
    .catch(async json => {
      console.log("API: error", json);
      await dispatchLog({ type: "error.Set", payload: json });
      await dispatchAll({ type: "error", ...json }, failure);
      return { ...json, error: true };
    })
    .then(async json => {
      await setTimeout(async () => {
        if (!nospinner) await dispatchLog({ type: "spinner.Hide" });
        if (model) dispatchLog({ type: `${model.toLowerCase()}.Loaded` });
        await dispatchAll([opts, data, json], after);
      }, 1000);
      return json;
    });
};

export default dispatch => {
  return (global.actions = Object.keys(models).reduce(
    (rs, k) => {
      const model = models[k];
      if (typeof model !== "object") return rs;
      const actions = model.actions || [];
      if (typeof model !== "object") return rs;
      if (actions.length) {
        actions.map(
          a =>
            (rs[`${k.lcfirst()}${a.ucfirst()}`] = (...payload) => {
              const type = `${k.lcfirst()}.${a.ucfirst()}`;
              payload = !payload.length
                ? null
                : payload.length === 1
                ? payload[0]
                : payload;
              const data = { type, payload };
              return new Promise((resolve, reject) => {
                try {
                  dispatchLog(data);
                  resolve(data);
                } catch (e) {
                  reject(e);
                }
              });
            })
        );
      }
      return rs;
    },
    {
      url,
      dispatch,
      dispatchLog,
      dispatchAll,
      socketRequest,
      api: apiCall,
      on: async (topic, handler) => await sailsIO.socket.on(topic, handler),
      off: async (topic, handler) => await sailsIO.socket.off(topic, handler),
      subscribeToProcess: async id =>
        socketRequest({ ...apis.process.watch, path: [id] }),
      unsubscribeFromProcess: async id =>
        socketRequest({
          ...apis.process.watch,
          path: [id],
          body: { unsubscribe: true }
        })
    }
  ));
};
