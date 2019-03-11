const env = process.env || {};

const constants = Object.keys(env).reduce((rs, o) => {
  const k = "REACT_APP_";
  const v = env[o];
  // rs[o] = v;
  if (o.includes(k)) rs[o.substr(k.length)] = v;
  return rs;
}, {});

const keys = Object.keys(constants);
keys.forEach(o => {
  let v = constants[o];
  keys.forEach(k => {
    if (k !== o) v = v.replace(`{${k}}`, constants[k]);
  });
  constants[o] = v;
});

module.exports = constants;
