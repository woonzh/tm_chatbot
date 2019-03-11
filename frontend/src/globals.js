import jQuery from "jquery";
import _ from "lodash";

import constants from "./constants";

global.jQuery = jQuery;
global.constants = constants;
require("jquery-resizable/resizable.css");
require("jquery-resizable");

Array.prototype.merge = function(...args) {
  return this.concat(...args).filter(o => o);
};
Array.prototype.diff = function(a) {
  return this.filter(o => a.indexOf(o) < 0);
};
Date.prototype.format = function(f) {
  if (!f && (!constants || !constants.dateformat))
    return this.toLocaleDateString();
  if (!f) f = constants.dateformat;
  return jQuery.datepicker.formatDate(f, this);
};
Number.prototype.format = function() {
  return this.toFixed(9);
};
Number.prototype.percent = function(n) {
  if (n) return "" + this.toFixed(9) + "%";
  return "" + this + "%";
};
String.prototype.lcfirst = function() {
  return this.substr(0, 1).toLowerCase() + this.substr(1);
};
String.prototype.camel = function() {
  var str = this.replace(/^([A-Z])|\s([a-z])/g, function(
    match,
    p1,
    p2,
    offset
  ) {
    if (p2) return ` ${p2.toUpperCase()}`;
    return p1.toLowerCase();
  });
  return str;
};
String.prototype.ucfirst = function() {
  return this.substr(0, 1).toUpperCase() + this.substr(1);
};
Object.omit = _.omit;
Object.isEmpty = _.isEmpty;

global.getReduxObjects = () => {
  return {
    apis: global.apis,
    actions: global.actions,
    storage: global.store.getState(),
    api: global.actions.api,
    url: global.actions.api,
    dispatch: global.actions.dispatch,
    dispatchLog: global.actions.dispatchLog,
    dispatchAll: global.actions.dispatchAll,
    socketRequest: global.actions.socketRequest,
    on: global.actions.on,
    off: global.actions.off,
    subscribeToProcess: global.actions.subscribeToProcess,
    unsubscribeFromProcess: global.actions.unsubscribeFromProcess
  };
};

export default global;
