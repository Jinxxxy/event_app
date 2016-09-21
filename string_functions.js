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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = str_fnc;
