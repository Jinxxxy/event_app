define(["require", "exports"], function (require, exports) {
    "use strict";
    class date_fnc {
        static dateparser(string_val) {
            var basestring = "";
            var split_string = string_val.split('/');
            basestring = split_string[2] + split_string[1] + split_string[0];
            return basestring;
        }
        static reverse_date_parser(string_val) {
            var basestring = "";
            var split_string = string_val.split('/');
            basestring = string_val.slice(0, 4) + string_val.slice(5, 7) + string_val.slice(8, 10);
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
            var orig_string = orig_date.getFullYear().toString() + this.single_date_to_double_date((orig_date.getMonth() + 1)) + this.single_date_to_double_date(orig_date.getDate());
            var week_date = new Date(orig_date.toString());
            week_date.setDate(orig_date.getDate() + 7);
            var week_string = week_date.getFullYear().toString() + this.single_date_to_double_date(week_date.getMonth() + 1).toString() + this.single_date_to_double_date(week_date.getDate());
            output_arr.push(orig_string);
            output_arr.push(week_string);
            return output_arr;
        }
        static date_to_date_string(retrieve_val) {
            var return_string = this.single_date_to_double_date(retrieve_val.getDate()) + "/" + this.single_date_to_double_date(retrieve_val.getMonth() + 1) + "/" + retrieve_val.getFullYear().toString();
            return return_string;
        }
        static date_no_separator(date_string) {
            while (date_string.indexOf("/") !== -1) {
                date_string = date_string.replace("/", "");
            }
            return date_string;
        }
        static get_date_from_date_string(date_string) {
            var date_array = date_string.split("/");
            var return_date = new Date(date_array[2] + "/" + date_array[1] + "/" + date_array[0]);
            return return_date;
        }
        static get_ddmmyyy_from_date(date_obj) {
            var dd = this.single_date_to_double_date(date_obj.getDate());
            var mm = (date_obj.getMonth() + 1).toString();
            var yyyy = date_obj.getFullYear().toString();
            return dd + "/" + mm + "/" + yyyy;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = date_fnc;
});
