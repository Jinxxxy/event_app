"use strict";
class misc_funct {
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
    static string_builder(item) {
        var start_string = "{ \n";
        var basestring = "";
        for (var x in item) {
            basestring = basestring + "\t" + "\"" + x + "\"" + ":" + "\"" + item[x] + "\"" + ", \n";
        }
        var end_string = "\n}";
        basestring = basestring.slice(0, (basestring.length - 3));
        return start_string + basestring + end_string;
    }
    static dateparser(string_val) {
        var basestring = "";
        var split_string = string_val.split('/');
        basestring = split_string[2] + split_string[1] + split_string[0];
        return basestring;
    }
    static single_date_to_double_date(_date) {
        var out_date = _date.toString();
        if (out_date.length === 1) {
            out_date = "0" + _date;
            return out_date;
        }
        else {
            return out_date;
        }
    }
    static get_week_date() {
        var output_arr = [];
        var orig_date = new Date();
        var orig_string = orig_date.getFullYear().toString() + misc_funct.single_date_to_double_date((orig_date.getMonth() + 1)) + misc_funct.single_date_to_double_date(orig_date.getDate());
        var week_date = new Date(orig_date.toString());
        week_date.setDate(orig_date.getDate() + 7);
        var week_string = week_date.getFullYear().toString() + misc_funct.single_date_to_double_date(week_date.getMonth() + 1).toString() + misc_funct.single_date_to_double_date(week_date.getDate());
        output_arr.push(orig_string);
        output_arr.push(week_string);
        return output_arr;
    }
    static date_to_date_string(retrieve_val) {
        var return_string = misc_funct.single_date_to_double_date(retrieve_val.getDate()) + "/" + misc_funct.single_date_to_double_date(retrieve_val.getMonth() + 1) + "/" + retrieve_val.getFullYear().toString();
        return return_string;
    }
    static string_to_number_bool(str) {
        if (str === "y" || str === "Y") {
            return 1;
        }
        else {
            return 0;
        }
    }
    static find_longest_string(str_arr) {
        str_arr.sort(function (a, b) {
            return b.length - a.length;
        });
        return str_arr[0];
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
    static output_event(selected_item) {
        var str_arr = [];
        var id_string = "ID: " + selected_item.id;
        var date_string = "Date: " + selected_item.date;
        var type_string = "Type: " + selected_item.type;
        var notes_string = "Notes: " + selected_item.notes;
        str_arr.push(id_string, date_string, type_string, notes_string);
        var box_size = (misc_funct.find_longest_string(str_arr).length + 2);
        var border = "---";
        var i = 0;
        while (i < box_size) {
            border += "-";
            i++;
        }
        var ext_str_arr = [];
        for (var x in str_arr) {
            var out = misc_funct.string_extender(str_arr[x], box_size);
            ext_str_arr.push(out);
        }
        var final_str = border + "\n";
        for (var x in ext_str_arr) {
            final_str += ext_str_arr[x] + "\n";
        }
        final_str += border;
        return final_str;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = misc_funct;
