"use strict";
require("amd-loader");
var http = require('http');
var url = require('url');
const event_class_1 = require('./event_class');
const sql_func_1 = require('C:/Development/node/events_cli/sql_func');
var querystring = require('querystring');
class parse_string {
    constructor(_string) {
        this.pre_string = _string;
    }
    static replace_vals(x) {
        while (x.indexOf("%20") >= 0) {
            x = x.replace("%20", "");
        }
        while (x.indexOf("%22") >= 0) {
            x = x.replace("%22", "\"");
        }
        while (x.indexOf("%7B") >= 0) {
            x = x.replace("%7B", "\{");
        }
        while (x.indexOf("%7D") >= 0) {
            x = x.replace("%7D", "\}");
        }
        x = x.slice(1, x.length);
        console.log("replace vals");
        console.log(x);
        return x;
    }
    static obj_to_class(obj) {
        var cls = new event_class_1.default(obj.event['date'], obj.event['type'], obj.event['notes'], obj.event['recurring']);
        return cls;
    }
}
var create = http.createServer(function (req, res) {
    if (req.url.indexOf("date") !== -1 &&
        req.url.indexOf("notes") !== -1 &&
        req.url.indexOf("type") !== -1 &&
        req.url.indexOf("recurring") !== -1) {
        var parsed_string = parse_string.replace_vals(req.url);
        var obj = JSON.parse(parsed_string);
        var ev_cls = parse_string.obj_to_class(obj);
        console.log(ev_cls);
        sql_func_1.default.insert(ev_cls);
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("TEST");
    }
    else {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Bad Request");
    }
}).listen(3000);
console.log("Server Ready");
