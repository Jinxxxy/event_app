///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />
"use strict";
const sql_func_1 = require('./sql_func');
const misc_func_1 = require('./misc_func');
const main_menu_1 = require('./main-menu');
var schema_object = {
    properties: {
        'Select date dd/mm/yyyy': {
            pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
            message: 'Please enter date as dd/mm/yyyy',
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
                var date_string = misc_func_1.default.dateparser(result['Select date dd/mm/yyyy']);
                that._date = date_string;
                resolve(date_string);
            });
        }).then(function (renamed) {
            var str = renamed.toString();
            sql_func_1.default.retrieve_by_date(str, main_menu_1.default.mainmenu);
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = view_main;
