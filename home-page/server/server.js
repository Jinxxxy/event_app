"use strict";
///<reference path="C:\Development\node\events_cli\libs\require.d.ts" />
///<reference path="C:\Development\node\events_cli\libs\event_class.ts" />
require("amd-loader");
var http = require('http');
var url = require('url');
var querystring = require('querystring');
const event_class_1 = require('./../../libs/event_class');
const sql_func_1 = require('./../../libs/sql_func');
const query_builders_1 = require('./../../libs/query-builders');
const export_json_1 = require('./../../libs/export-json');
const export_html_1 = require('./../../libs/export-html');
const export_xml_1 = require('./../../libs/export-xml');
class parse_string {
    constructor(_string) {
        this.pre_string = _string;
    }
    static replace_vals(x) {
        var output = x;
        while (output.indexOf("%20") >= 0) {
            output = output.replace("%20", "");
        }
        while (output.indexOf("%22") >= 0) {
            output = output.replace("%22", "\"");
        }
        while (output.indexOf("%7B") >= 0) {
            output = output.replace("%7B", "\{");
        }
        while (output.indexOf("%7D") >= 0) {
            output = output.replace("%7D", "\}");
        }
        output = output = output.replace("/", "");
        return output;
    }
    static obj_to_class(obj) {
        var cls_arr = [];
        for (var item in obj) {
            if (obj.event['id']) {
                var cls = new event_class_1.default(obj.event['date'], obj.event['type'], obj.event['notes'], obj.event['recurring'], obj.event['id']);
            }
            else {
                var cls = new event_class_1.default(obj.event['date'], obj.event['type'], obj.event['notes'], obj.event['recurring']);
            }
            cls_arr.push(cls);
        }
        return cls_arr;
    }
    static get_results(query) {
        var day_prom = sql_func_1.default.general_query(query);
        return day_prom;
    }
    static parse_to_comp_value(url_string) {
        var export_string = url_string.slice(url_string.lastIndexOf("//==//"), url_string.length);
        var export_comparison_val = export_string.split("//==//")[1].replace("***", "");
        return export_comparison_val;
    }
    static get_time_from_url(url_sting) {
        var working_string = "";
        working_string = url_sting.slice(4, url_sting.indexOf("::"));
        return working_string;
    }
    static get_id_from_url(url_string) {
        return url_string.split("EDIT-GET::")[1].replace("***", "");
    }
    static get_time_function(time) {
        var target = time;
        switch (target) {
            case "DAY":
                return query_builders_1.default.day_query_builder;
            case "WEEK":
                return query_builders_1.default.week_query_builder;
            case "MONTH":
                return query_builders_1.default.month_query_builder;
            case "ALL":
                return query_builders_1.default.all_query_builder;
        }
    }
    static update_function(update_data) {
        var update_prom = new Promise(function (resolve, reject) {
            resolve(sql_func_1.default.update_event(query_builders_1.default.update_query_builder(parse_string.obj_to_class(JSON.parse(update_data.replace("***", "")))[0])));
        });
        return update_prom;
    }
    static server_export_function(export_type, export_time) {
        var query_function = parse_string.get_time_function(export_time);
        var server_export_prom = new Promise(function (resolve, reject) {
            switch (export_type) {
                case "JSON":
                    var export_json_prom = sql_func_1.default.general_query(query_function());
                    export_json_prom.then(function (res_cls) {
                        var export_json_output_string = export_json_1.default.file_content_builder(res_cls.res_array);
                        if (res_cls.res_array.length >= 1) {
                            resolve(export_json_output_string);
                        }
                        else {
                            reject("**//No Results");
                        }
                    });
                    break;
                case "HTML":
                    var export_html_prom = sql_func_1.default.general_query(query_function());
                    export_html_prom.then(function (res_cls) {
                        var export_html_output_string = export_html_1.default.file_content_builder(res_cls.res_array);
                        if (res_cls.res_array.length >= 1) {
                            resolve(export_html_output_string);
                        }
                        else {
                            reject("**//No Results");
                        }
                    });
                    break;
                case "XML":
                    var export_xml_prom = sql_func_1.default.general_query(query_function());
                    export_xml_prom.then(function (res_cls) {
                        var export_xml_output_string = export_xml_1.default.file_content_builder(res_cls.res_array);
                        if (res_cls.res_array.length >= 1) {
                            resolve(export_xml_output_string);
                        }
                        else {
                            reject("**//No Results");
                        }
                    });
            }
        });
        return server_export_prom;
    }
}
var create = http.createServer(function (req, res) {
    if (req.url.indexOf("***ADD-NEW:://") !== -1) {
        var parsed_string = parse_string.replace_vals(req.url).replace("***ADD-NEW:://", "");
        var obj = JSON.parse(parsed_string);
        var ev_cls = parse_string.obj_to_class(obj);
        var prom = sql_func_1.default.insert(query_builders_1.default.insert_query_builder(ev_cls[0]));
        prom.then(function (srv_res) {
            if (srv_res.record_id === -1) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200, { "content-type": "text/plain" });
                res.end("Unable to create record. Please try again. \n Error Code: " + srv_res.err);
            }
            else if (srv_res.record_id !== -1) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200, { "content-type": "text/plain" });
                res.end("Record created. \nID: " + srv_res.record_id);
            }
        });
    }
    else if (req.url.indexOf("QUERY") !== -1) {
        var query_string = req.url.slice(req.url.indexOf("QUERY="), req.url.length);
        var comparison_val = parse_string.replace_vals(query_string);
        switch (comparison_val) {
            case "QUERY=\"SELECTDAY\"":
                var day_prom = parse_string.get_results(query_builders_1.default.day_query_builder());
                day_prom.then(function (res_obj) {
                    if (res_obj.err_flag === true) {
                        return;
                    }
                    else {
                        if (res_obj.err.indexOf("**//No Results") !== -1) {
                            return ("No results to return. Please check parameters");
                        }
                        else {
                            var response_content = export_json_1.default.file_content_builder((res_obj.res_array));
                            return (response_content);
                        }
                    }
                }).then(function (res_body) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.writeHead(200, { "content-type": "text/plain" });
                    res.end(JSON.stringify(res_body));
                });
                break;
            case "QUERY=\"SELECTWEEK\"":
                var week_prom = parse_string.get_results(query_builders_1.default.week_query_builder());
                week_prom.then(function (res_obj) {
                    if (res_obj.err_flag === true) {
                        ("err " + res_obj.err);
                        return ("***No results to return***. Something went wrong with your request.");
                    }
                    else {
                        if (res_obj.err.indexOf("**//No Results") !== -1) {
                            return ("***No results to return***. Please check parameters");
                        }
                        else {
                            var response_content = export_json_1.default.file_content_builder((res_obj.res_array));
                            return (response_content);
                        }
                    }
                }).then(function (res_body) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.writeHead(200, { "content-type": "text/plain" });
                    res.end(JSON.stringify(res_body));
                });
                break;
            case "QUERY=\"SELECTMONTH\"":
                var month_prom = parse_string.get_results(query_builders_1.default.month_query_builder());
                month_prom.then(function (res_obj) {
                    if (res_obj.err_flag === true) {
                        return;
                    }
                    else {
                        if (res_obj.err.indexOf("**//No Results") !== -1) {
                            return ("***No results to return***. Please check parameters");
                        }
                        else {
                            var response_content = export_json_1.default.file_content_builder((res_obj.res_array));
                            return (response_content);
                        }
                    }
                }).then(function (res_body) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.writeHead(200, { "content-type": "text/plain" });
                    res.end(JSON.stringify(res_body));
                });
                break;
            case "QUERY=\"SELECTALL\"":
                var all_prom = parse_string.get_results("SELECT * FROM devbox.events_data");
                all_prom.then(function (res_obj) {
                    if (res_obj.err_flag === true) {
                        return ("***No results to return***. Something went wrong with your request");
                    }
                    else {
                        if (res_obj.err.indexOf("**//No Results") !== -1) {
                            return ("***No results to return***. Please check parameters");
                        }
                        else {
                            var response_content = export_json_1.default.file_content_builder((res_obj.res_array));
                            return (response_content);
                        }
                    }
                }).then(function (res_body) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.writeHead(200, { "content-type": "text/plain" });
                    res.end(JSON.stringify(res_body));
                });
                break;
        }
    }
    else if (req.url.indexOf("EXPORT//==//") !== -1) {
        var export_time_comparision_val = parse_string.get_time_from_url(req.url);
        var export_type_comparison_val = parse_string.parse_to_comp_value(req.url);
        var export_data_prom = parse_string.server_export_function(export_type_comparison_val, export_time_comparision_val);
        export_data_prom.then(function (export_data) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { "content-type": "text/plain" });
            res.end(export_data);
        }).catch(function () {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { "content-type": "text/plain" });
            res.end("**//No Results");
        });
    }
    else if (req.url.indexOf("***EDIT-GET::") !== -1) {
        var query_id = parse_string.get_id_from_url(req.url);
        var get_by_id_prom = parse_string.get_results("SELECT * FROM devbox.events_data WHERE idkey = " + query_id + ";");
        +get_by_id_prom.then(function (res_cls) {
            if (res_cls.res_array.length === 0) {
                return ("**//No Results");
            }
            else {
                var data_to_send = export_json_1.default.file_content_builder(res_cls.res_array);
                return (data_to_send);
            }
        }).then(function (response_data) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { "content-type": "text/plain" });
            res.end(JSON.stringify(response_data));
        });
    }
    else if (req.url.indexOf("***UPDATE:://") !== -1) {
        var data_to_send = parse_string.replace_vals(req.url.replace("***UPDATE:://", ""));
        var update_prom = parse_string.update_function(data_to_send);
        update_prom.then(function (message_string) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { "content-type": "text/plain" });
            res.end("Record created. \nID: " + message_string);
        });
    }
    else if (req.url.indexOf("***DELETE:://") !== -1) {
        var parsed_string = parse_string.replace_vals(req.url).replace("***DELETE:://", "");
        var delete_prom = sql_func_1.default.delete_query(query_builders_1.default.delete_query_builder(parsed_string));
        delete_prom.then(function (res_cls) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { "content-type": "text/plain" });
            //change name of err for message value
            res.end(res_cls.err.toString());
        });
    }
    else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Bad Request");
    }
}).listen(3000);
console.log("Server Ready");
