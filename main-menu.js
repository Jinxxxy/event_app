///<reference path="./event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />
///<reference path="./add-main.ts" />
///<reference path="./view-main.ts" />
///<reference path="./check-main.ts" />
"use strict";
const misc_func_1 = require('./misc_func');
const add_main_1 = require('./add-main');
const view_main_1 = require('./view-main');
const check_main_1 = require('./check-main');
const edit_main_1 = require('./edit_main');
//adding to console prototype
var schema_object_add = {
    properties: {
        'What would you like to do? (check today (check), add, edit, view, exit)': {
            pattern: /add|edit|view|exit|check/,
            message: "Please enter add, edit or view",
            required: true
        }
    }
};
class main_menu {
    static mainmenu() {
        var prompt_add = require('prompt');
        misc_func_1.default.console_log("Program Open");
        var prom_add = new Promise(function (res, rej) {
            prompt_add.get(schema_object_add, function (err, result) {
                var result = result['What would you like to do? (check today (check), add, edit, view, exit)'];
                res(result.toUpperCase());
            });
        }).then(function (val) {
            switch (val) {
                case "ADD":
                    console.log(val);
                    add_main_1.default.main();
                    break;
                case "EDIT":
                    edit_main_1.default.main_pick_event();
                    break;
                case "VIEW":
                    console.log(val);
                    view_main_1.default.main();
                    break;
                case "EXIT":
                    console.log("Goodbye!");
                    break;
                case "CHECK":
                    check_main_1.default.check_menu();
                    break;
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main_menu;
main_menu.mainmenu();
