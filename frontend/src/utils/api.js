import queryHelper from "query-string";
import _ from "lodash";
import stringify from "json-stringify-safe";

const { constants, location } = global;
const { tokenName } = constants;

export const getMethod = method => (method || "get").toLowerCase();
export const method = opts => getMethod(opts.method);
export const prependURL = url => {
  if (!url) return "";
  if (url.indexOf("//") === 0) return url;
  if (url.indexOf("http:") === 0) return url;
  if (url.indexOf("https:") === 0) return url;
  Object.keys(location).forEach(k => {
    const v = location[k];
    if (typeof v === "string") url = url.replace(`%location.${k}%`, v);
  });
  if (url.indexOf("http") < 0) return `/${url.replace(/^\//gi, "")}`;
  return url;
};
export const setPathname = (url, path) => {
  if (!url) return "";
  const questionMarkIndex = url.indexOf("?");
  let pathname =
    questionMarkIndex >= 0 ? url.substr(0, questionMarkIndex) : url;
  pathname = pathname.replace(/\/$/g, "");
  if (path && path.length) return `${pathname}/${[].merge(path).join("/")}`;
  return pathname;
};
export const setQueryStr = (url, query, body, method) => {
  if (!url) return "";
  const questionMarkIndex = url.indexOf("?");
  let queryStr =
    questionMarkIndex >= 0 ? url.substr(questionMarkIndex + 1) : "";
  if (query) queryStr = `${queryStr}&${queryHelper.stringify(query)}`;
  if (!_.isEmpty(body) && method === "get")
    return `${queryStr ? `${queryStr}&` : ""}${queryHelper.stringify(body)}`;

  return queryStr;
};

export function URL(opts) {
  let { method, url, path, query, body } = opts;
  method = getMethod(method);
  url = prependURL(url);
  const pathname = setPathname(url, path);
  const querystr = setQueryStr(url, query, body, method);

  return querystr ? `${pathname}?${querystr}` : pathname;
}
export function setUploadBody(body, upload) {
  const formData = new FormData();
  if (!_.isEmpty(body)) {
    Object.keys(body).map(o =>
      formData.append(
        o,
        _.isObject(body[o]) ? JSON.stringify(body[o]) : body[o]
      )
    );
  }
  if (upload instanceof File) {
    formData.append(`uploadFields`, ["files"]);
    formData.append(`files`, upload);
  } else if (Array.isArray(upload)) {
    formData.append(`uploadFields`, ["files"]);
    upload.map((o, i) => formData.append(`files`, o));
  } else {
    Object.keys(upload).map(o => {
      formData.append(`uploadFields`, o);
      formData.append(o, upload[o]);
    });
  }

  return formData;
}

export function getOptions(opts) {
  let { body, upload } = opts;
  const method = getMethod(opts.method);
  const headersArr = headers(opts);
  delete opts.query;
  if (method === "get" || _.isEmpty(body)) delete opts.body;
  else if (!_.isEmpty(body))
    opts.body = typeof body !== "string" ? stringify(body) : body;
  if (upload) opts.body = setUploadBody(body, upload);
  return Object.omit({ ...opts, method, headers: headersArr }, "upload");
}

export const headers = opts => {
  if (!opts) opts = {};
  const headers = {
    Accept: "*/*",
    "Content-Type": "application/json; charset=utf-8",
    ...opts.headers
  };
  if (opts.upload) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
  if (headers[tokenName] !== false) {
    const token = localStorage.getItem(tokenName);
    if (token) headers[tokenName] = token;
  } else delete headers[tokenName];
  return headers;
};

export default function(opts) {
  const clone = { ...opts };
  const body = clone.body || {};
  const path = body.path ? body.path : clone.path;
  delete clone.nospinner;
  delete clone.model;
  delete clone.path;
  delete body.nospinner;
  delete body.path;
  let normalisedOpts = { ...clone, path, body };
  const url = URL(normalisedOpts);
  if (!url)
    return new Promise(function(resolve, reject) {
      throw new Error({ type: "error", message: "Url is empty", opts });
    });
  else return fetch(url, getOptions(normalisedOpts));
}
