import {ajax} from "../util/ajax.js";

ajax('/upload', 'POST', 'a=12345&b=45678&c=vnbs').then(data => console.log(data));
