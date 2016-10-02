define(["require", "exports", "./../event_class", "./../date_functions"], function (require, exports, event_class_1, date_functions_1) {
    "use strict";
    ///<reference path="C:\Development\node\events_cli\require.d.ts" />
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
    var export_week_button = document.getElementById("export-week-button");
    var export_day_button = document.getElementById("export-day-button");
    var export_month_button = document.getElementById("export-month-button");
    var export_all_button = document.getElementById("export-all-button");
    requirejs(["../event_class"], function (event_class) {
        console.log("event_class has been loaded");
    });
    requirejs(["../export-html"], function (html_export) {
        console.log("html_export has been loaded");
    });
    requirejs([], function (date_func) {
        console.log("Date Functions Loaded...");
    });
    var base_conn_string = "http://127.0.0.1:3000/";
    class button_element_pair {
        constructor(_button, _view) {
            this.button = _button;
            this.view = _view;
        }
    }
    class page_functions {
        static reset_form() {
            var reset_items = document.getElementsByClassName("form_items");
            for (var x in reset_items) {
                var elem = reset_items[x];
                console.log(elem);
                elem.reset();
            }
        }
        static hardcode_array() {
            var add = new button_element_pair(add_button, add_view);
            var edit = new button_element_pair(edit_button, edit_view);
            var view = new button_element_pair(view_button, view_view);
            var expor = new button_element_pair(export_button, export_view);
            var elem_butt_array = [];
            elem_butt_array.push(add, edit, view, expor);
            return elem_butt_array;
        }
        static data_from_form() {
            var date_input = document.getElementById('dateinput').value;
            var type_input = document.getElementById('typeinput').value;
            var notes_input = document.getElementById('notesinput').value;
            var recurring_input = document.getElementById('recurringinput').value;
            var new_class = new event_class_1.default(date_input, type_input, notes_input, 1);
            console.log(new_class);
            return new_class;
        }
        static update_database(event, prom_res) {
            var conn = new XMLHttpRequest();
            conn.open("POST", base_conn_string + this.create_json_string(event), true);
            conn.onload = function () {
                alert(conn.response);
                prom_res();
            };
            conn.send();
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
            console.log("JSON Valid");
            console.log(JSON.parse(json_string));
            return json_string;
        }
        static object_to_event_class(obj) {
            var temp = new event_class_1.default(obj["Date"], obj["Type"], obj["Notes"], obj["Recurring"], obj["ID"]);
            return temp;
        }
        static no_result() {
            console.log("functon_running");
            output_view.style.display = "inline-block";
            view_view.style.display = "none";
            var no_res = "No results! <br> Try adding an event for this";
            output_view.innerHTML += no_res;
            output_view.style.color = "white";
        }
        static view_callback(conn) {
            console.log(conn);
            console.log(conn.indexOf("No results to return"));
            if (conn.indexOf("No results to return") === -1) {
                console.log(JSON.parse(conn));
                var ev_cls = JSON.parse((JSON.parse(conn))).events;
                console.log(typeof ev_cls);
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
                page_functions.no_result();
            }
        }
        static create_span_element() {
            var span_elem = document.createElement("span");
            return span_elem;
        }
        static create_br_element() {
            var header = document.createElement("br");
            return header;
        }
        static get_ddmmyyy_from_date(date_obj) {
            var dd = date_functions_1.default.single_date_to_double_date(date_obj.getDate());
            var mm = (date_obj.getMonth() + 1).toString();
            var yyyy = date_obj.getFullYear().toString();
            return dd + "/" + mm + "/" + yyyy;
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
            var ref_date = this.get_ddmmyyy_from_date(new Date());
            var check_date = to_display.date;
            console.log(ref_date + " : " + check_date);
            event_container.className = "event";
            header.id = "header";
            inner.className = "inner";
            console.log(ref_date === check_date);
            type_span.innerText = "Type: " + to_display.type;
            id_span.innerText = "ID: " + to_display.id.toString();
            if (ref_date === check_date) {
                date_span.innerText = to_display.date;
                date_span.style.textShadow = "0 0 10px yellow";
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
            event_container.style.padding = "5%";
            container.style.width = "80%";
            return container;
        }
        static display_result(event_array) {
            for (var item in event_array) {
                var to_add = this.create_event_element(event_array[item]);
                output_view.appendChild(to_add);
            }
            output_view.style.display = "block";
            view_view.style.display = "none";
        }
        static get_query_result(query_identifier) {
            var prom = new Promise(function () {
                var conn = new XMLHttpRequest();
                conn.open("GET", base_conn_string + query_identifier, true);
                conn.onload = function () {
                    if (conn.response.indexOf("***No results to return***") === -1) {
                        page_functions.display_result(page_functions.view_callback(conn.response));
                    }
                    else {
                        page_functions.no_result();
                    }
                };
                conn.send();
            });
        }
        static request_export(type_string) {
            var exp_prom = new Promise(function (resolve, reject) {
                var conn = new XMLHttpRequest();
                conn.open("GET", base_conn_string + type_string, true);
                conn.onload = function () {
                    resolve(conn.response);
                };
                conn.send();
            });
            return exp_prom;
        }
        static clear_output_view() {
            while (output_view.firstChild) {
                output_view.removeChild(output_view.firstChild);
            }
        }
        static save_file(json_string) {
            var download_link = document.createElement("a");
            download_link.href = "./../output-cache/test.json";
            download_link.innerHTML = "Click here to download your file";
            download_link.className = "button";
            download_link.style.position = "absolute";
            download_link.style.top = "0";
            download_link.style.left = "0";
            download_link.onclick = function () {
                document.removeChild(this);
            };
            document.body.appendChild(download_link);
        }
    }
    function on_off(button) {
        output_view.style.display = "none";
        var status = button.style.display;
        var all_elements = page_functions.hardcode_array();
        for (var x in all_elements) {
            console.log(all_elements[x].button !== button);
            if (all_elements[x].button !== button) {
                all_elements[x].view.style.display = "none";
            }
            else {
                all_elements[x].view.style.display = "block";
            }
        }
    }
    (function () {
        add_button.onclick = function () {
            on_off(add_button);
        };
        view_button.onclick = function () {
            on_off(view_button);
            page_functions.clear_output_view();
        };
        edit_button.onclick = function () {
            on_off(edit_button);
        };
        export_button.onclick = function () {
            on_off(export_button);
        };
        submit_buttom.onclick = function () {
            var prom = new Promise(function (res, rej) {
                page_functions.update_database(page_functions.data_from_form(), res);
            }).then(function () {
                location.reload();
            });
        };
        view_day_button.onclick = function () {
            page_functions.get_query_result("QUERY=\"SELECTDAY\"");
        };
        view_week_button.onclick = function () {
            page_functions.get_query_result("QUERY=\"SELECTWEEK\"");
        };
        view_month_button.onclick = function () {
            page_functions.get_query_result("QUERY=\"SELECTMONTH\"");
        };
        view_all_button.onclick = function () {
            page_functions.get_query_result("QUERY=\"SELECTALL\"");
        };
        export_day_button.onclick = function () {
            page_functions.request_export("***DAY::EXPORT//==//JSON***").then(function () {
            });
        };
        export_week_button.onclick = function () {
            page_functions.request_export("***WEEK::EXPORT//==//JSON***").then(function (json) {
                page_functions.save_file(json);
            });
        };
        export_month_button.onclick = function () {
            page_functions.request_export("***MONTH::EXPORT//==//JSON***").then(function () {
            });
        };
        export_all_button.onclick = function () {
            page_functions.request_export("***ALL::EXPORT//==//JSON***").then(function () {
            });
        };
    })();
});
