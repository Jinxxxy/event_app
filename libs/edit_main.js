///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./prompt_func.ts" />
"use strict";
const sql_func_1 = require('./sql_func');
const main_menu_1 = require('./main-menu');
const query_builders_1 = require('./query-builders');
const string_functions_1 = require('./string_functions');
const output_functions_1 = require('./output_functions');
class edit {
    static main_edit_event(curr_event) {
        var prompt = require('prompt');
        var prom = new Promise(function (resolve, reject) {
            prompt.get(edit.edit_event_schema, function (err, results) {
                var in_date = results['Leave blank for no change: Date - dd/mm/yyyy'];
                var in_type = results['Leave blank for no change: Type(Birthday, Anniversary, Event)'];
                var in_notes = results['Leave blank for no change: Notes'];
                var in_recurring = string_functions_1.default.string_to_number_bool(results['Leave blank for no change: Recurring event? (Y/N)']);
                if (in_date !== "") {
                    curr_event.date = in_date;
                }
                if (in_type !== "") {
                    curr_event.type = in_type;
                }
                if (in_notes !== "") {
                    curr_event.notes = in_notes;
                }
                if (in_recurring.toString() !== "") {
                    curr_event.recurring = in_recurring;
                }
                var ret_prom = sql_func_1.default.update_event(query_builders_1.default.update_query_builder(curr_event)).then(function (out_string) {
                    main_menu_1.default.mainmenu();
                });
            });
        });
    }
    static main_pick_event() {
        var prompt = require("prompt");
        var prom = new Promise(function (resolve, reject) {
            prompt.get(edit.pick_prompt_schema, function (err, results) {
                var ret_prom = sql_func_1.default.general_query("SELECT * FROM devbox.events_data WHERE idkey = " + results['Event ID: (Please find before editing)']);
                ret_prom.then(function (sql_res) {
                    if (Object.keys(sql_res).length < 1) {
                        output_functions_1.default.console_log("No record found! Please check ID");
                        main_menu_1.default.mainmenu();
                    }
                    else {
                        edit.main_edit_event(sql_res[0]);
                    }
                });
            });
        });
    }
}
edit.pick_prompt_schema = {
    properties: {
        'Event ID: (Please find before editing)': {
            pattern: /^[0-9]{0,4}$/,
            message: 'Please enter the event ID',
            required: true
        }
    }
};
edit.edit_event_schema = {
    properties: {
        'Leave blank for no change: Date - dd/mm/yyyy': {
            pattern: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
            message: 'Please enter date as dd/mm/yyyy',
        },
        'Leave blank for no change: Type(Birthday, Anniversary, Event)': {
            pattern: 'birthday|anniversary|event',
            message: 'Please enter either "birthday","anniversay" or "event"',
        },
        'Leave blank for no change: Notes': {
            pattern: /^[a-zA-Z0-9 ]{0,1000}$/,
            message: 'Only letters numbers and spaces can be used. Must be no more than 1000 characters',
        },
        'Leave blank for no change: Recurring event? (Y/N)': {
            pattern: /y|Y|n|N/,
            message: 'Only y / n are accepted',
        }
    }
};
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = edit;
