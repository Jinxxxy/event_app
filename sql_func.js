"use strict";
const event_class_1 = require('./event_class');
const misc_func_1 = require('./misc_func');
var mysql = require('mysql');
class sql_func {
    static result_to_array(result_arr) {
        var output_arr = [];
        var class_arr = [];
        if (Object.keys(result_arr).length > 0) {
            for (var x in result_arr) {
                output_arr.push(result_arr[x]);
                var date_var = misc_func_1.default.date_to_date_string(result_arr[x]['dateandtime']);
                var tmp_cls = new event_class_1.default(date_var, result_arr[x]['type'], result_arr[x]['notes'], result_arr[x]['recurring'], result_arr[x]['idkey']);
                class_arr.push(tmp_cls);
            }
            return class_arr;
        }
        else if (Object.keys(result_arr).length === 0) {
            console.log("No results to return");
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
        connection.query("SELECT * FROM devbox.events_data WHERE dateandtime = " + date + " ;", function (err, results) {
            console.log("results: " + Object.keys(results).length + "entries for the specified date");
            cb();
            return;
        });
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
                console.log(misc_func_1.default.output_event(result));
                if (cb) {
                    cb();
                }
                return;
            }
        });
    }
    static general_query(query, cb) {
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
    static update_query_builder(upd_eve) {
        var pre_string = "UPDATE devbox.events_data SET ";
        var add_date = "dateandtime = " + misc_func_1.default.dateparser(upd_eve.date) + ", ";
        var add_type = "type = '" + upd_eve.type + "', ";
        var add_notes = "notes = '" + upd_eve.notes + "', ";
        var add_recurring = "recurring = " + upd_eve.recurring;
        var end_string = " WHERE idkey = " + upd_eve.id;
        var output_string = pre_string + add_date + add_type + add_notes + add_recurring + end_string;
        return output_string;
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sql_func;
