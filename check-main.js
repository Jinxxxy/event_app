///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./prompt_func.ts" />
"use strict";
const sql_func_1 = require('./sql_func');
const main_menu_1 = require('./main-menu');
const query_builders_1 = require('./query-builders');
const output_functions_1 = require('./output_functions');
var schema_object = {
    properties: {
        'Check day / week / month': {
            pattern: /day|week|month/,
            message: 'Please enter \'day\', \'week\' or \'month\'',
            required: true
        }
    }
};
class week {
    static week_get() {
        var prom = new Promise(function (resolve, reject) {
            var ret_prom = sql_func_1.default.general_query(query_builders_1.default.week_query_builder());
            ret_prom.then(function (arr_obj) {
                output_functions_1.default.print_result_cards(arr_obj, resolve);
            });
        }).then(function () {
            main_menu_1.default.mainmenu();
        });
    }
}
class day {
    static day_get() {
        var prom = new Promise(function (resolve, reject) {
            var ret_prom = sql_func_1.default.general_query(query_builders_1.default.day_query_builder());
            ret_prom.then(function (arr_obj) {
                output_functions_1.default.print_result_cards(arr_obj, resolve);
            });
        }).then(function () {
            main_menu_1.default.mainmenu();
        });
    }
}
class month {
    static month_get() {
        var prom = new Promise(function (resolve, reject) {
            var ret_prom = sql_func_1.default.general_query(query_builders_1.default.month_query_builder());
            ret_prom.then(function (arr_obj) {
                output_functions_1.default.print_result_cards(arr_obj, resolve);
            });
        }).then(function () {
            main_menu_1.default.mainmenu();
        });
    }
}
class check_func {
    static check_menu() {
        var that = this;
        var prompt = require('prompt');
        var prom = new Promise(function (resolve, reject) {
            prompt.get(schema_object, function (err, result) {
                if (err) {
                    throw err;
                }
                else {
                    var res = result['Check day / week / month'].toLowerCase();
                    switch (res) {
                        case 'day':
                            day.day_get();
                            break;
                        case 'week':
                            week.week_get();
                            break;
                        case 'month':
                            month.month_get();
                            break;
                    }
                }
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = check_func;
