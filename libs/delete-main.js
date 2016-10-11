///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./prompt_func.ts" />
"use strict";
const sql_func_1 = require('./sql_func');
const main_menu_1 = require('./main-menu');
const query_builders_1 = require('./query-builders');
const output_functions_1 = require('./output_functions');
class delete_main {
    static main() {
        var prompt = require('prompt');
        var prom = new Promise(function (resolve, reject) {
            prompt.get(delete_main.delete_schema, function (err, result) {
                var answer = result['Please enter the ID of the even to delete:'];
                var ret_prom = sql_func_1.default.void_return_query(query_builders_1.default.delete_query_builder(answer));
                ret_prom.then(function (res) {
                    if (res['affectedRows'] < 1) {
                        console.log("Unable to complete operation. Check ID and try again");
                        main_menu_1.default.mainmenu();
                    }
                    else {
                        resolve(answer);
                    }
                });
            });
        }).then(function (answer) {
            output_functions_1.default.console_log("Record " + answer + " has been deleted");
            main_menu_1.default.mainmenu();
        });
    }
}
delete_main.delete_schema = {
    properties: {
        'Please enter the ID of the even to delete:': {
            pattern: /[0-9]{0,4}/,
            message: "Please an event ID",
            required: true
        }
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = delete_main;
