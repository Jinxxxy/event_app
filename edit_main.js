///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />
"use strict";
const sql_func_1 = require('./sql_func');
const misc_func_1 = require('./misc_func');
const main_menu_1 = require('./main-menu');
class edit {
    static main_edit_event(curr_event) {
        var prompt = require('prompt');
        var prom = new Promise(function (resolve, reject) {
            prompt.get(edit.edit_event_schema, function (err, results) {
                var in_date = results['Leave blank for no change: Date - dd/mm/yyyy'];
                var in_type = results['Leave blank for no change: Type(Birthday, Anniversary, Event)'];
                var in_notes = results['Leave blank for no change: Notes'];
                var in_recurring = misc_func_1.default.string_to_number_bool(results['Leave blank for no change: Recurring event? (Y/N)']);
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
                console.log(curr_event);
                var ret_prom = sql_func_1.default.update_event(sql_func_1.default.update_query_builder(curr_event)).then(function (out_string) {
                    console.log(out_string);
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
                    misc_func_1.default.output_event(sql_res[0]);
                    edit.main_edit_event(sql_res[0]);
                });
            });
        });
    }
}
edit.pick_prompt_schema = {
    properties: {
        'Event ID: (Please find before editing)': {
            pattern: /^[0-9]{0,3}$/,
            message: 'Please enter the event ID',
            required: true
        }
    }
};
edit.edit_event_schema = {
    properties: {
        'Leave blank for no change: Date - dd/mm/yyyy': {
            pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
            message: 'Please enter date as dd/mm/yyyy',
            required: true,
        },
        'Leave blank for no change: Type(Birthday, Anniversary, Event)': {
            pattern: 'birthday|anniversary|event',
            message: 'Please enter either "birthday","anniversay" or "event"',
            required: true,
        },
        'Leave blank for no change: Notes': {
            pattern: /^[a-zA-Z0-9 ]{0,1000}$/,
            message: 'Only letters numbers and spaces can be used. Must be no more than 1000 characters',
            required: true
        },
        'Leave blank for no change: Recurring event? (Y/N)': {
            pattern: /y|Y|n|N/,
            message: 'Only y / n are accepted',
            required: true
        }
    }
};
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = edit;
