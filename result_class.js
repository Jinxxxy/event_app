"use strict";
class result_object {
    constructor(_res_array, _err, _err_flag, _record_id) {
        this.res_array = [];
        this.err = "";
        this.err_flag = false;
        if (_res_array) {
            this.res_array = _res_array;
        }
        if (_err) {
            this.err = _err;
        }
        if (_err_flag) {
            this.err_flag = _err_flag;
        }
        if (_record_id) {
            this.record_id = _record_id;
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = result_object;
