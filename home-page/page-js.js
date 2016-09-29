define(["require", "exports", "./event_class"], function (require, exports, event_class_1) {
    "use strict";
    ///<reference path="C:\Development\node\events_cli\require.d.ts" />
    var add_button = document.getElementById('add-button');
    var view_button = document.getElementById('view-button');
    var edit_button = document.getElementById('edit-button');
    var add_view = document.getElementById('add-view');
    var view_view = document.getElementById('view-view');
    var edit_view = document.getElementById('edit-view');
    var submit_buttom = document.getElementById('submit_button');
    requirejs(["event_class"], function (event_class) {
        console.log("event_class has been loaded");
    });
    var base_conn_string = "http://127.0.0.1:3000/";
    class button_element_pair {
        constructor(_button, _view) {
            this.button = _button;
            this.view = _view;
        }
    }
    class page_functions {
        static hardcode_array() {
            var add = new button_element_pair(add_button, add_view);
            var edit = new button_element_pair(edit_button, edit_view);
            var view = new button_element_pair(view_button, view_view);
            var elem_butt_array = [];
            elem_butt_array.push(add, edit, view);
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
        static update_database(event) {
            var conn = new XMLHttpRequest();
            conn.open("POST", base_conn_string + this.create_json_string(event), true);
            conn.onload = function () {
                alert(conn.response);
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
    }
    function on_off(button) {
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
        };
        edit_button.onclick = function () {
            on_off(edit_button);
        };
        submit_buttom.onclick = function () {
            page_functions.update_database(page_functions.data_from_form());
        };
    })();
});
