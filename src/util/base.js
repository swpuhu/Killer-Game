import {isFunction} from "./util.js";

const obj = {
  eventList: {},
  addEventListener: function (name, fn) {
    if (!isFunction(fn)) {
      return ;
    }
    if (!this.eventList[name]) {
      this.eventList[name] = [];
    }
    this.eventList[name].push(fn);
  },
  removeEventListener: function (name, fn) {
    let fns = this.eventList[name];
    if (!fns) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let i = fns.length - 1; i >= 0; --i) {
        if (fns[i] === fn) {
          fns.splice(i, 1);
        }
      }
    }
  },
  dispatchEvent: function () {
    let name = Array.prototype.shift.call(arguments);
    let fns = this.eventList[name];
    if (!fns || fns.length === 0) {
      return false;
    }
    for (let i = fns.length - 1; i >= 0; --i) {
      fns[i].apply(this, arguments);
    }
  }
};

export default obj;
