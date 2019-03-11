import globals from "../../globals";
import * as api from "../../utils/api";

let opts = {};
let optsPOST = {};

beforeEach(() => {
  opts = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "", // default no method specified
    url: "api/v1/model",
    path: "",
    query: "",
    body: {}, // for query string
    upload: {}
  };
  optsPOST = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "", // default no method specified
    url: "api/v1/model",
    path: "",
    query: "",
    body: {
      data: "body data"
    }, // for query string
    upload: {
      uploadData: "upload data"
    }
  };
});

describe("Utils api function unit test", () => {
  test("getMethod should return 'get' when method is not specified", () => {
    const result = "get";
    expect(api.getMethod(opts.method)).toBe(result);
  });
  test("getMethod should return 'get' when 'get' is specified", () => {
    const result = "get";
    opts.method = "get";
    expect(api.getMethod(opts.method)).toBe(result);
  });
  test("getMethod should return 'put' when 'put' is specified", () => {
    const result = "put";
    opts.method = "put";
    expect(api.getMethod("put")).toBe(result);
  });

  test("prependURL should return url with http prepend", () => {
    const result = `/${opts.url}`;
    expect(api.prependURL(opts.url)).toBe(result);
  });

  test("setPathname should return same url with no '?' in input url", () => {
    const result = `/${opts.url}`;
    const inputURL = api.prependURL(opts.url);
    expect(api.setPathname(inputURL, opts.path)).toBe(result);
  });
  test("setPathname should return url with path", () => {
    opts.path = "11111111";
    const result = `/${opts.url}/${opts.path}`;
    const inputURL = api.prependURL(opts.url);
    expect(api.setPathname(inputURL, opts.path)).toBe(result);
  });

  test("setQueryStr should return empty str", () => {
    const { url, query, body, method } = opts;
    expect(api.setQueryStr(url, query, body, method)).toBe("");
  });
  test("setQueryStr should return query string", () => {
    const result = "q=parameter";
    opts.url += `?${result}`;
    const { url, query, body, method } = opts;
    expect(api.setQueryStr(url, query, body, method)).toBe(result);
  });

  test("Input url should return without query string appended", () => {
    const result = `/${opts.url}/${opts.path}`.replace(/\/$/g, "");
    expect(api.URL(opts)).toBe(result);
  });
  test("Input url should return without query string appended", () => {
    opts.url = `/${opts.url}`;
    const result = `${opts.url}/${opts.path}`.replace(/\/$/g, "");
    expect(api.URL(opts)).toBe(result);
  });
  test("Input url w/ http should return with query string appended", () => {
    opts.url = `/${opts.url}?q=query+string`;
    const result = `${opts.url}/${opts.path}`.replace(/\/$/g, "");
    expect(api.URL(opts)).toBe(result);
  });

  test("setUploadBody returns form data", () => {
    const { body, upload } = optsPOST;
    const formData = api.setUploadBody(body, upload);
    expect(formData.get("data")).toBe(optsPOST.body.data);
    expect(formData.get("uploadData")).toBe(optsPOST.upload.uploadData);
  });

  test.only("Utils getOptions function unit test", () => {
    expect(api.getOptions(opts).method.toLowerCase()).toEqual("get");
  });
});
