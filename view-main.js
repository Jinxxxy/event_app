///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./prompt_func.ts" />
"use strict";
const sql_func_1 = require('./sql_func');
const main_menu_1 = require('./main-menu');
const output_functions_1 = require('./output_functions');
const date_functions_1 = require('./date_functions');
const export_html_1 = require('./export-html');
var schema_object = {
    properties: {
        'Select date dd/mm/yyyy': {
            pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$|all/,
            message: 'Please enter date as dd/mm/yyyy (`all` for all)',
            required: true
        }
    }
};
class view_main {
    static main() {
        var that = this;
        var prompt = require('prompt');
        var prom_ret = new Promise(function (resolve, reject) {
            prompt.get(schema_object, function (err, result) {
                if (result['Select date dd/mm/yyyy'].toLowerCase() === "all") {
                    var ret_prom = sql_func_1.default.general_query("SELECT * FROM devbox.events_data;");
                    ret_prom.then(function (cls_arr) {
                        output_functions_1.default.print_result_cards(cls_arr);
                        export_html_1.default.export_main(cls_arr);
                        return;
                    }).then(function () {
                        main_menu_1.default.mainmenu();
                    });
                }
                else {
                    var date_string = date_functions_1.default.dateparser(result['Select date dd/mm/yyyy']);
                    that._date = date_string;
                    resolve(date_string);
                }
            });
        }).then(function (renamed) {
            var str = renamed.toString();
            var ret_prom = sql_func_1.default.retrieve_by_date(str);
            ret_prom.then(function (res_arr) {
                for (var x in res_arr) {
                    console.log(output_functions_1.default.output_event(res_arr[x]));
                }
                return;
            }).then(function () {
                main_menu_1.default.mainmenu();
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = view_main;
