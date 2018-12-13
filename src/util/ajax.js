import * as util from '../util/util.js';

let ajax = function (url, type, data) {
  return new Promise((resolve, reject) =>{
    let request = new XMLHttpRequest();
    function handler () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject('error');
        }
      }
    }
    request.onreadystatechange = handler;
    request.open(type, url);
    request.send(data);
  });
};
export {ajax};
