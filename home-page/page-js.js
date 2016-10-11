///<reference path="C:\Development\node\events_cli\libs\require.d.ts" />
///<reference path="C:\Development\node\events_cli\libs\event_class.ts" />
define(["require", "exports", "./../libs/event_class", "./../libs/date_functions", "./../libs/string_functions", "./../libs/date_functions"], function (require, exports, event_class_1, date_functions_1, string_functions_1, date_functions_2) {
    "use strict";
    var add_button = document.getElementById('add-button');
    var view_button = document.getElementById('view-button');
    var edit_button = document.getElementById('edit-button');
    var add_view = document.getElementById('add-view');
    var view_view = document.getElementById('view-view');
    var edit_view = document.getElementById('edit-view');
    var submit_buttom = document.getElementById('submit_button');
    var export_button = document.getElementById('export-button');
    var export_view = document.getElementById('export-view');
    var view_day_button = document.getElementById("view-day-button");
    var view_week_button = document.getElementById("view-week-button");
    var view_month_button = document.getElementById("view-month-button");
    var view_all_button = document.getElementById("view-all-button");
    var output_view = document.getElementById("output-view");
    var json_export_week_button = document.getElementById("json-export-week-button");
    var json_export_day_button = document.getElementById("json-export-day-button");
    var json_export_month_button = document.getElementById("json-export-month-button");
    var json_export_all_button = document.getElementById("json-export-all-button");
    var html_export_day_button = document.getElementById("html-export-day-button");
    var html_export_week_button = document.getElementById("html-export-week-button");
    var html_export_month_button = document.getElementById("html-export-month-button");
    var html_export_all_button = document.getElementById("html-export-all-button");
    var xml_export_day_button = document.getElementById("xml-export-day-button");
    var xml_export_week_button = document.getElementById("xml-export-week-button");
    var xml_export_month_button = document.getElementById("xml-export-month-button");
    var xml_export_all_button = document.getElementById("xml-export-all-button");
    var edit_pick_view = document.getElementById("edit-form-container");
    var edit_event_picker_input = document.getElementById("event-id");
    var edit_date_input = document.getElementById("edit-dateinput");
    var edit_type_input = document.getElementById("edit-typeinput");
    var edit_notes_input = document.getElementById("edit-notesinput");
    var edit_recurring_input = document.getElementById("edit-recurringinput");
    var edit_submit_button = document.getElementById("edit-submit-button");
    var edit_pick_submit_button = document.getElementById("edit-pick-submit-button");
    var add_date_input = document.getElementById("dateinput");
    var add_type_input = document.getElementById("typeinput");
    var add_notes_input = document.getElementById("notesinput");
    var add_recurring_input = document.getElementById("recurringinput");
    var operation_output_container = document.getElementById("output-container");
    var operation_close_button = document.getElementById("close-output-button");
    var operation_output = document.getElementById("output-view-id");
    var edit_form_container = document.getElementById("edit-form-container");
    var edit_reset_button = document.getElementById("edit-reset-button");
    var edit_delete_button = document.getElementById("edit-delete-button");
    var base_conn_string = "http://127.0.0.1:3000/";
    var timer_running = false;
    require(["./../libs/event_class"], function (event_class) {
        console.log("event_class has been loaded");
    });
    requirejs(["./../libs/export-html"], function (html_export) {
        console.log("html_export has been loaded");
    });
    requirejs([], function (date_func) {
        console.log("Date Functions Loaded...");
    });
    class button_element_pair {
        constructor(_button, _view) {
            this.button = _button;
            this.view = _view;
        }
    }
    //Page specific database operations. Heavily integrate with page-only functions. Review overhead of intergrating into sql_functions.ts
    class database_functions {
        static update_database(event) {
            var upd_prom = new Promise(function (resolve, reject) {
                var conn = new XMLHttpRequest();
                conn.open("POST", base_conn_string + "***ADD-NEW:://" + string_functions_1.default.create_json_string(event), true);
                conn.onload = function () {
                    form_functions.operation_output(conn.response);
                    resolve("");
                };
                conn.send();
            });
            return upd_prom;
        }
        static get_query_result(query_identifier) {
            var prom = new Promise(function () {
                var conn = new XMLHttpRequest();
                conn.open("GET", base_conn_string + query_identifier, true);
                conn.onload = function () {
                    if (conn.response.indexOf("***No results to return***") === -1) {
                        form_functions.display_result(page_functions.view_callback(conn.response));
                    }
                    else {
                        form_functions.operation_output("No Results To Display");
                    }
                };
                conn.send();
            });
        }
        static get_edit_event() {
            var event_id = edit_event_picker_input.value;
            var edit_get_event_prom = new Promise(function (resolve, reject) {
                var conn = new XMLHttpRequest();
                conn.open("GET", base_conn_string + "***EDIT-GET::" + event_id + "***", true);
                conn.onload = function () {
                    if (conn.response.indexOf("**//No Results") === -1) {
                        var edit_event_arr = page_functions.view_callback(conn.response)[0];
                        resolve(edit_event_arr);
                    }
                    else {
                        reject("Unable to find ID, Please check again");
                    }
                };
                conn.send();
            });
            return edit_get_event_prom;
        }
        static update_record(idkey) {
            var object_string = string_functions_1.default.create_json_string(page_functions.data_from_form(edit_date_input, edit_type_input, edit_notes_input, edit_recurring_input, idkey));
            var update_prom = new Promise(function (resolve, reject) {
                var conn = new XMLHttpRequest();
                conn.open("GET", base_conn_string + "***UPDATE:://" + object_string + "***", true);
                conn.onload = function () {
                    resolve(conn.response);
                };
                conn.send();
            });
            return update_prom;
        }
        static request_export(type_string) {
            var exp_prom = new Promise(function (resolve, reject) {
                var conn = new XMLHttpRequest();
                conn.open("GET", base_conn_string + type_string, true);
                conn.onload = function () {
                    if (conn.response.indexOf("**//No Results") === -1) {
                        resolve(conn.response);
                    }
                    else {
                        reject("No results to display");
                    }
                };
                conn.send();
            });
            return exp_prom;
        }
        static delete_event(id) {
            var delete_prom = new Promise(function (resolve, reject) {
                var conn = new XMLHttpRequest();
                conn.open("GET", base_conn_string + "***DELETE:://" + id, true);
                conn.onload = function () {
                    if (conn.response === "1") {
                        resolve(conn.response);
                    }
                    else {
                        console.log("END");
                        reject("Something went wrong. Please restart and try again");
                    }
                };
                conn.send();
            });
            return delete_prom;
        }
    }
    //core functions that affect forms and successful form output.
    class form_functions {
        static reset_form(form_name) {
            var reset_items = document.getElementsByClassName(form_name);
            for (var x in reset_items) {
                if (typeof reset_items[x] !== "number") {
                    var elem = reset_items[x];
                    elem.value = elem.defaultValue;
                }
            }
        }
        static unlock_edit_form() {
            var edit_elements = document.getElementsByClassName("edit-form-items");
            for (var x in edit_elements) {
                var edit_item = edit_elements[x];
                if (edit_item.readOnly) {
                    edit_item.readOnly = false;
                }
            }
            ;
        }
        static create_span_element() {
            var span_elem = document.createElement("span");
            return span_elem;
        }
        static create_br_element() {
            var header = document.createElement("br");
            return header;
        }
        static populate_edit_fields(edit_data) {
            //Check format.
            var date_array = edit_data.date.split("/");
            edit_date_input.value = date_array[2] + "-" + date_array[1] + "-" + date_array[0];
            edit_type_input.value = string_functions_1.default.first_letter_to_uppercase(edit_data.type);
            edit_notes_input.value = edit_data.notes;
            edit_recurring_input.value = string_functions_1.default.recurring_number_to_string_option(edit_data.recurring.toString());
        }
        static create_event_element(to_display) {
            var container = document.createElement("div");
            var event_container = document.createElement("div");
            var inner = document.createElement("div");
            var hr = document.createElement("hr");
            var header = document.createElement("h3");
            var date_span = this.create_span_element();
            var type_span = this.create_span_element();
            var id_span = this.create_span_element();
            var hr = document.createElement("hr");
            var ref_date = date_functions_2.default.get_ddmmyyy_from_date(new Date());
            var check_date = to_display.date;
            event_container.className = "event";
            header.id = "header";
            inner.className = "inner";
            type_span.innerText = "Type: " + to_display.type;
            id_span.innerText = "ID: " + to_display.id.toString();
            if (ref_date === check_date) {
                date_span.innerText = to_display.date;
                date_span.style.textShadow = "0 0 15px yellow";
                date_span.style.backgroundColor = "grey";
                date_span.style.boxShadow = "0 0 15px yellow";
            }
            else {
                date_span.innerText = "Date: " + to_display.date;
            }
            header.innerText = to_display.notes;
            header.style.textAlign = "center";
            inner.appendChild(id_span);
            inner.appendChild(this.create_br_element());
            inner.appendChild(this.create_br_element());
            inner.appendChild(type_span);
            inner.appendChild(this.create_br_element());
            inner.appendChild(this.create_br_element());
            inner.appendChild(date_span);
            inner.appendChild(this.create_br_element());
            //inner.appendChild(this.create_br_element());
            event_container.appendChild(header);
            event_container.appendChild(hr);
            event_container.appendChild(inner);
            container.style.margin = "0 auto";
            container.appendChild(document.createElement("br"));
            container.appendChild(event_container);
            event_container.style.border = "1px dashed grey";
            event_container.style.borderRadius = "10px";
            event_container.style.right = "5%";
            event_container.style.padding = "0% 5% 5% 5%";
            container.style.width = "80%";
            return container;
        }
        static clear_output_view() {
            while (output_view.firstChild) {
                output_view.removeChild(output_view.firstChild);
            }
        }
        static display_result(event_array) {
            for (var item in event_array) {
                var to_add = this.create_event_element(event_array[item]);
                output_view.appendChild(to_add);
            }
            output_view.style.display = "block";
            view_view.style.display = "none";
        }
        static no_result() {
            output_view.style.display = "inline-block";
            view_view.style.display = "none";
            var no_res = "No results! <br> Try adding an event for this";
            output_view.innerHTML += no_res;
            output_view.style.color = "white";
        }
        static operation_output(err_message, cb) {
            operation_output_container.style.display = "block";
            operation_output.innerText = err_message;
            if (cb) {
                cb();
            }
        }
        //contains the edit-submit-function onclick assignment.
        static edit_pick_event(ev_cls) {
            edit_view.style.display = "block";
            edit_form_container.style.display = "block";
            form_functions.populate_edit_fields(ev_cls);
            form_functions.unlock_edit_form();
            edit_event_picker_input.readOnly = true;
            edit_event_picker_input.style.color = "Red";
            edit_submit_button.onclick = function () {
                var update_prom = database_functions.update_record(edit_event_picker_input.value);
                update_prom.then(function (returned) {
                    form_functions.operation_output(returned);
                    edit_form_container.style.display = "block";
                });
            };
        }
        static edit_reset_event() {
            form_functions.reset_form("edit-form-items");
            edit_event_picker_input.style.color = "black";
            edit_event_picker_input.value = edit_event_picker_input.defaultValue;
            edit_event_picker_input.readOnly = false;
            edit_form_container.style.display = "none";
        }
    }
    //list of specific functions which are implementation for the page.
    class page_functions {
        static hardcode_array() {
            var add = new button_element_pair(add_button, add_view);
            var edit = new button_element_pair(edit_button, edit_view);
            var view = new button_element_pair(view_button, view_view);
            var expor = new button_element_pair(export_button, export_view);
            var elem_butt_array = [];
            elem_butt_array.push(add, edit, view, expor);
            return elem_butt_array;
        }
        static data_from_form(date_elem, type_elem, notes_elem, recurring_elem, id_val) {
            var date_input = date_elem.value;
            while (date_input.indexOf("-") > 0) {
                date_input = date_input.replace("-", "/");
            }
            date_input = date_functions_1.default.reverse_date_parser(date_input);
            var type_input = type_elem.value;
            var notes_input = notes_elem.value;
            var recurring_input = recurring_elem.value;
            if (id_val) {
                var new_class = new event_class_1.default(date_input, type_input, notes_input, 1, parseInt(id_val));
            }
            else {
                var new_class = new event_class_1.default(date_input, type_input, notes_input, 1);
            }
            return new_class;
        }
        static object_to_event_class(obj) {
            var temp = new event_class_1.default(obj["Date"], obj["Type"], obj["Notes"], obj["Recurring"], obj["ID"]);
            return temp;
        }
        static view_callback(conn) {
            if (conn.indexOf("No results to return") === -1) {
                var ev_cls = JSON.parse((JSON.parse(conn))).events;
                var event_class_array = [];
                if (Object.keys(ev_cls).length > 0) {
                    for (var x in ev_cls) {
                        var temp = page_functions.object_to_event_class(ev_cls[x]);
                        event_class_array.push(temp);
                    }
                }
                return event_class_array;
            }
            else {
                form_functions.no_result();
            }
        }
        static save_file(export_string, export_type) {
            var file_name = date_functions_2.default.date_no_separator(date_functions_1.default.date_to_date_string(new Date)) + " " + export_type;
            var blob = new Blob([export_string], { type: "text/plain;charset=utf-8" });
            saveAs(blob, file_name + "." + export_type);
        }
        static on_off(button) {
            output_view.style.display = "none";
            var status = button.style.display;
            var all_elements = page_functions.hardcode_array();
            for (var x in all_elements) {
                if (all_elements[x].button !== button) {
                    all_elements[x].view.style.display = "none";
                }
                else {
                    all_elements[x].view.style.display = "block";
                }
            }
            if (getComputedStyle(edit_form_container).display === "block") {
                edit_form_container.style.display = "none";
            }
        }
        static page_init() {
            add_button.onclick = function () {
                page_functions.on_off(add_button);
            };
            view_button.onclick = function () {
                page_functions.on_off(view_button);
                form_functions.clear_output_view();
            };
            edit_button.onclick = function () {
                page_functions.on_off(edit_button);
            };
            export_button.onclick = function () {
                page_functions.on_off(export_button);
            };
            submit_buttom.onclick = function () {
                var prom = database_functions.update_database(page_functions.data_from_form(add_date_input, add_type_input, add_notes_input, add_recurring_input));
                prom.then(function (res) {
                    form_functions.reset_form("form_items");
                });
            };
            view_day_button.onclick = function () {
                database_functions.get_query_result("QUERY=\"SELECTDAY\"");
            };
            view_week_button.onclick = function () {
                database_functions.get_query_result("QUERY=\"SELECTWEEK\"");
            };
            view_month_button.onclick = function () {
                database_functions.get_query_result("QUERY=\"SELECTMONTH\"");
            };
            view_all_button.onclick = function () {
                database_functions.get_query_result("QUERY=\"SELECTALL\"");
            };
            json_export_day_button.onclick = function () {
                database_functions.request_export("***DAY::EXPORT//==//JSON***").then(function (export_string) {
                    page_functions.save_file(export_string, "json");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            json_export_week_button.onclick = function () {
                database_functions.request_export("***WEEK::EXPORT//==//JSON***").then(function (export_string) {
                    page_functions.save_file(export_string, "json");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            json_export_month_button.onclick = function () {
                database_functions.request_export("***MONTH::EXPORT//==//JSON***").then(function (export_string) {
                    page_functions.save_file(export_string, "json");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            json_export_all_button.onclick = function () {
                database_functions.request_export("***ALL::EXPORT//==//JSON***").then(function (export_string) {
                    page_functions.save_file(export_string, "json");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            html_export_day_button.onclick = function () {
                database_functions.request_export("***DAY::EXPORT//==//HTML***").then(function (export_string) {
                    page_functions.save_file(export_string, "html");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            html_export_week_button.onclick = function () {
                database_functions.request_export("***WEEK::EXPORT//==//HTML***").then(function (export_string) {
                    page_functions.save_file(export_string, "html");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            html_export_month_button.onclick = function () {
                database_functions.request_export("***MONTH::EXPORT//==//HTML***").then(function (export_string) {
                    page_functions.save_file(export_string, "html");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            html_export_all_button.onclick = function () {
                database_functions.request_export("***ALL::EXPORT//==//HTML***").then(function (export_string) {
                    page_functions.save_file(export_string, "html");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            xml_export_day_button.onclick = function () {
                database_functions.request_export("***DAY::EXPORT//==//XML***").then(function (export_string) {
                    page_functions.save_file(export_string, "xml");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            xml_export_week_button.onclick = function () {
                database_functions.request_export("***WEEK::EXPORT//==//XML***").then(function (export_string) {
                    page_functions.save_file(export_string, "xml");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            xml_export_month_button.onclick = function () {
                database_functions.request_export("***MONTH::EXPORT//==//XML***").then(function (export_string) {
                    page_functions.save_file(export_string, "xml");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            xml_export_all_button.onclick = function () {
                database_functions.request_export("***ALL::EXPORT//==//XML***").then(function (export_string) {
                    page_functions.save_file(export_string, "xml");
                }).catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            edit_pick_submit_button.onclick = function () {
                var edit_pick_prom = database_functions.get_edit_event();
                edit_pick_prom.then(function (ev_cls) {
                    form_functions.edit_pick_event(ev_cls);
                });
                edit_pick_prom.catch(function (err_message) {
                    form_functions.operation_output(err_message);
                });
            };
            edit_reset_button.onclick = function () {
                form_functions.edit_reset_event();
            };
            operation_close_button.onclick = function () {
                operation_output_container.style.display = "none";
                operation_output.innerText = "";
            };
            edit_delete_button.onclick = function () {
                var delete_prom = database_functions.delete_event(edit_event_picker_input.value);
                delete_prom.then(function (response) {
                    form_functions.operation_output(response + " rows affected. Event ID: " + edit_event_picker_input.value + " has been deleted");
                    form_functions.edit_reset_event();
                });
                delete_prom.catch(function (err) {
                    form_functions.operation_output(err);
                });
            };
        }
    }
    page_functions.page_init();
});
