"use strict";
const string_functions_1 = require('./string_functions');
class output_functions {
    static print_result_cards(res_arr, cb) {
        for (var x in res_arr) {
            console.log(output_functions.output_event(res_arr[x]));
        }
        if (cb) {
            cb();
        }
        return;
    }
    static console_log(out) {
        var hor_line = "-";
        var i = 0;
        while (i <= out.length) {
            hor_line += "-";
            i++;
        }
        var output_string = "|" + out + "|";
        console.log(hor_line);
        console.log(output_string);
        console.log(hor_line);
    }
    static output_event(selected_item) {
        var str_arr = [];
        var id_string = "ID: " + selected_item.id;
        var date_string = "Date: " + selected_item.date;
        var type_string = "Type: " + selected_item.type;
        var notes_string = "Notes: " + selected_item.notes;
        str_arr.push(id_string, date_string, type_string, notes_string);
        var box_size = (string_functions_1.default.find_longest_string(str_arr).length + 2);
        var border = "---";
        var i = 0;
        while (i < box_size) {
            border += "-";
            i++;
        }
        var ext_str_arr = [];
        for (var x in str_arr) {
            var out = this.string_extender(str_arr[x], box_size);
            ext_str_arr.push(out);
        }
        var final_str = border + "\n";
        for (var x in ext_str_arr) {
            final_str += ext_str_arr[x] + "\n";
        }
        final_str += border;
        return final_str;
    }
    static string_extender(str, len) {
        str = "| " + str;
        var spacer = "";
        while ((str.length + spacer.length) < len + 2) {
            spacer += " ";
        }
        str = str + spacer + "|";
        return str;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = output_functions;
