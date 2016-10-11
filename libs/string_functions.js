define(["require", "exports"], function (require, exports) {
    "use strict";
    class str_fnc {
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
        static first_letter_to_uppercase(str) {
            var first_letter = str.slice(0, 1).toUpperCase();
            var rest_of_string = str.slice(1, str.length);
            return first_letter + rest_of_string;
        }
        static create_json_string(event) {
            var json_string = `            
            {
                "event":{
                    "id":"` + event.id + `",\n
                    "date":"` + event.date + `",\n
                    "type":"` + event.type + `",\n
                    "notes":"` + event.notes + `",\n
                    "recurring":"` + event.recurring + `"\n                    
                }
            }
            
            `;
            return json_string;
        }
        static recurring_number_to_string_option(recurring) {
            if (recurring === "1") {
                return "Yes";
            }
            else {
                return "No";
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = str_fnc;
});
