"use strict";
const event_class_1 = require('./event_class');
const main_menu_1 = require('./main-menu');
const output_functions_1 = require('./output_functions');
const date_functions_1 = require('./date_functions');
var mysql = require('mysql');
class sql_func {
    static result_to_array(result_arr, cb) {
        var output_arr = [];
        var class_arr = [];
        if (Object.keys(result_arr).length > 0) {
            for (var x in result_arr) {
                output_arr.push(result_arr[x]);
                var date_var = date_functions_1.default.date_to_date_string(result_arr[x]['dateandtime']);
                var tmp_cls = new event_class_1.default(date_var, result_arr[x]['type'], result_arr[x]['notes'], result_arr[x]['recurring'], result_arr[x]['idkey']);
                class_arr.push(tmp_cls);
            }
            return class_arr;
        }
        else if (Object.keys(result_arr).length === 0) {
            console.log("No results to return. Please check parameters");
            main_menu_1.default.mainmenu();
        }
        else {
            console.log("Something went wront, please restart");
        }
    }
    static create_connection() {
        var connection = mysql.createConnection({
            host: "localhost",
            port: '3306',
            user: 'root',
            password: 'root'
        });
        return connection;
    }
    static retrieve_by_date(date, cb) {
        var connection = this.create_connection();
        var prom = new Promise(function (resolve, reject) {
            connection.query("SELECT * FROM devbox.events_data WHERE dateandtime = " + date + " ;", function (err, results) {
                output_functions_1.default.console_log("Results");
                console.log("Results: " + Object.keys(results).length + " entries for the specified date");
                var cls_arr = sql_func.result_to_array(results);
                resolve(cls_arr);
            });
        });
        return prom;
        ;
    }
    static retrieve() {
        var connection = this.create_connection();
        connection.connect();
        connection.query("SELECT * FROM devbox.events_data", function (err, result) {
            if (err) {
                console.log(err);
                connection.end(function (err) { });
            }
            else {
                connection.end(function (err) { });
            }
        });
        return;
    }
    static insert(event) {
        var return_id;
        var connection = this.create_connection();
        var prom = new Promise(function (res, rej) {
            connection.query("insert into devbox.events_data(dateandtime, type, notes, recurring) values('" + event.date + "', '" + event.type + "', \"" + event.notes + '", "' + event.recurring + '");', { title: 'test' }, function (err, result) {
                if (err) {
                    connection.end(function (err) { });
                    throw err;
                }
                else {
                    connection.end(function (err) { });
                    return_id = result.insertId;
                    res(return_id);
                }
            });
        });
        return prom;
    }
    static retrieve_last(_id, cb) {
        var connection = this.create_connection();
        connection.query("SELECT * FROM devbox.events_data WHERE idkey = '" + _id + "'", { title: 'test' }, function (err, result) {
            if (err) {
                connection.end(function (err) { });
                throw err;
            }
            else {
                connection.end(function (err) { });
                console.log("The following was added: ");
                console.log(output_functions_1.default.output_event(sql_func.result_to_array(result)[0]));
                if (cb) {
                    cb();
                }
                return;
            }
        });
    }
    static general_query(query) {
        var connection = this.create_connection();
        var output = [];
        var prom = new Promise(function (resolve, reject) {
            connection.query(query, function (err, result) {
                if (err) {
                    throw err;
                }
                else {
                    var output = sql_func.result_to_array(result);
                    resolve(output);
                }
            });
        });
        return prom;
    }
    static update_event(upd_string) {
        var conn = sql_func.create_connection();
        var prom = new Promise(function (resolve, reject) {
            conn.query(upd_string, function (err, result) {
                if (err) {
                    throw err;
                }
                else {
                    resolve(result['message']);
                }
            });
        });
        return prom;
    }
    static void_return_query(query) {
        var conn = sql_func.create_connection();
        var prom = new Promise(function (resolve, reject) {
            conn.query(query, function (err, result) {
                if (err) {
                    resolve(result);
                }
                else {
                    resolve(result);
                }
            });
        });
        return prom;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sql_func;
