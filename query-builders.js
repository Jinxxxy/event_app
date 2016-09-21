"use strict";
const misc_func_1 = require('./misc_func');
class query_builders {
    static update_query_builder(upd_eve) {
        var pre_string = "UPDATE devbox.events_data SET ";
        var add_date = "dateandtime = " + misc_func_1.default.dateparser(upd_eve.date) + ", ";
        var add_type = "type = '" + upd_eve.type + "', ";
        var add_notes = "notes = '" + upd_eve.notes + "', ";
        var add_recurring = "recurring = " + upd_eve.recurring;
        var end_string = " WHERE idkey = " + upd_eve.id;
        var output_string = pre_string + add_date + add_type + add_notes + add_recurring + end_string;
        return output_string;
    }
    static delete_query_builder(id) {
        return 'DELETE from devbox.events_data where idkey = ' + id;
    }
    static week_query_builder() {
        var orig_date = new Date();
        var pre_month = misc_func_1.default.single_date_to_double_date(orig_date.getMonth() + 1);
        var pre_date = misc_func_1.default.single_date_to_double_date(orig_date.getDate());
        var full_pre_string = orig_date.getFullYear().toString() + pre_month + pre_date;
        orig_date.setDate(orig_date.getDate() + 7);
        var post_month = misc_func_1.default.single_date_to_double_date(orig_date.getMonth() + 1);
        var post_date = misc_func_1.default.single_date_to_double_date(orig_date.getDate());
        var full_post_string = orig_date.getFullYear().toString() + post_month + post_date;
        var pre_string = `
        SELECT *
        FROM devbox.events_data
        WHERE
        ((dateandtime > ` + full_pre_string + ` AND dateandtime < ` + full_post_string + `) AND recurring = 0) OR
        (((MONTH(dateandtime) = ` + post_month + ` AND DAY(dateandtime) < ` + post_date + ` AND (MONTH(dateandtime) = ` + pre_month + ` AND DAY(dateandtime) > ` + pre_date + `))) AND recurring = 1)

        `;
        return pre_string;
    }
    static day_query_builder() {
        var query_string = "";
        var now_date = new Date();
        var dd = misc_func_1.default.single_date_to_double_date(now_date.getDate());
        var mm = misc_func_1.default.single_date_to_double_date(now_date.getMonth() + 1);
        var yyyy = now_date.getFullYear().toString();
        query_string = yyyy + mm + dd;
        var output_string = `
        SELECT *
        FROM devbox.events_data
        WHERE
        (dateandtime = ` + query_string + ` AND recurring = 0) OR ((MONTH(dateandtime) = ` + mm + ` AND DAY(dateandtime) = ` + dd + `) AND recurring = 1);
        `;
        return output_string;
    }
    static month_query_builder() {
        var orig_date = new Date();
        var orig_string = orig_date.getFullYear().toString() + misc_func_1.default.single_date_to_double_date(((orig_date.getMonth() + 1))) + orig_date.getDate().toString();
        var start_month = misc_func_1.default.single_date_to_double_date(orig_date.getMonth() + 1);
        var end_month = misc_func_1.default.single_date_to_double_date(orig_date.getMonth() + 2);
        var day_val = orig_date.getDate().toString();
        orig_date.setMonth(orig_date.getMonth() + 2);
        var out_string = orig_date.getFullYear().toString() + misc_func_1.default.single_date_to_double_date(orig_date.getMonth()) + orig_date.getDate().toString();
        var pre_string = `
        SELECT * FROM devbox.events_data WHERE         
        (((dateandtime > ` + orig_string + `) AND (dateandtime < ` + out_string + `)) AND recurring = 0) 
        OR	
        ((MONTH(dateandtime) = ` + end_month + ` AND DAY(dateandtime) < ` + day_val + `)
        OR
        (MONTH(dateandtime) = ` + start_month + ` AND DAY(dateandtime) > ` + day_val + `)) AND recurring = 1;`;
        return pre_string;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = query_builders;
