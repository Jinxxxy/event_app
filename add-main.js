///<reference path="./event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />
"use strict";
const event_class_1 = require('./event_class');
const sql_func_1 = require('./sql_func');
const misc_func_1 = require('./misc_func');
const main_menu_1 = require('./main-menu');
// resolve issue to export schema_objects to a separate class file
var schema_objects = {
    'add-new': {
        properties: {
            'Date(dd-mm-yyyy)': {
                pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
                message: 'Please enter date as dd/mm/yyyy',
                required: true,
            },
            'Type(Birthday, Anniversary, Event)': {
                pattern: 'birthday|anniversary|event',
                message: 'Please enter either "birthday","anniversay" or "event"',
                required: true,
            },
            'Notes': {
                pattern: /^[a-zA-Z0-9 ]{0,1000}$/,
                message: 'Only letters numbers and spaces can be used. Must be no more than 1000 characters',
                required: true
            },
            'Recurring event? (Y/N)': {
                pattern: /y|Y|n|N/,
                message: 'Only y / n are accepted',
                required: true
            }
        }
    }
};
class Startup {
    static main() {
        var that = this;
        var prom = new Promise(function (resolve, reject) {
            console.log('Add a new event');
            var prompt = require('prompt');
            //prompt.start();
            var schema = schema_objects['add-new'];
            prompt.get(schema, function (err, result) {
                if (err) {
                    console.log("Failed");
                    return 0;
                }
                var curr = new event_class_1.default(misc_func_1.default.dateparser(result['Date(dd-mm-yyyy)']), result['Type(Birthday, Anniversary, Event)'], result['Notes'], event_class_1.default.recurring_conv(result['Recurring event? (Y/N)']));
                console.log(curr);
                that.res_data = curr;
                resolve();
            });
        }).then(function () {
            var id;
            var prom_val = sql_func_1.default.insert(Startup.res_data);
            prom_val.then(function (idval) {
                sql_func_1.default.retrieve_last(idval, main_menu_1.default.mainmenu);
                return;
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Startup;
