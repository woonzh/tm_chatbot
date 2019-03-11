export async function readAsText(url) {
  return new Promise((resolve, reject) => {
    global.jQuery.ajax({
      url,
      cache: false,
      success: function(data, textStatus, res) {
        if (res.status === 200) return resolve(data || "");
        return reject(res);
      }
    });
  });
}
export async function readAsJson(url) {
  return new Promise((resolve, reject) => {
    global.jQuery.ajax({
      url,
      cache: false,
      success: function(data, textStatus, res) {
        if (res.status === 200) return resolve(data || "");
        return reject(res);
      }
    });
  });
}
export async function readAsRows(url) {
  return new Promise((resolve, reject) => {
    global.jQuery.ajax({
      url,
      cache: false,
      success: function(data, textStatus, res) {
        if (res.status === 200)
          return resolve((data || "").split("\n").map(o => o.split(",")));
        return reject(res);
      }
    });
  });
}
