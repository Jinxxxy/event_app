///<reference path="C:\Development\node\events_cli\require.d.ts" />
///<reference path="C:\Development\node\events_cli\event_class.ts" />
import event_class from "./../event_class";
import html_export from "../export-html";
import filesaver from "./FileSaver";
import date_func from "./../date_functions";
var add_button:HTMLElement = document.getElementById('add-button');
var view_button:HTMLElement = document.getElementById('view-button');
var edit_button:HTMLElement = document.getElementById('edit-button');
var add_view:HTMLElement = document.getElementById('add-view');
var view_view:HTMLElement = document.getElementById('view-view');
var edit_view:HTMLElement = document.getElementById('edit-view');
var submit_buttom: HTMLElement = document.getElementById('submit_button');
var export_button: HTMLElement = document.getElementById('export-button');
var export_view: HTMLElement = document.getElementById('export-view');
var view_day_button: HTMLElement = document.getElementById("view-day-button");
var view_week_button: HTMLElement = document.getElementById("view-week-button");
var view_month_button: HTMLElement = document.getElementById("view-month-button");
var view_all_button: HTMLElement = document.getElementById("view-all-button");
var output_view: HTMLElement = document.getElementById("output-view");
var json_export_week_button: HTMLElement = document.getElementById("json-export-week-button");
var json_export_day_button: HTMLElement = document.getElementById("json-export-day-button");
var json_export_month_button: HTMLElement = document.getElementById("json-export-month-button");
var json_export_all_button: HTMLElement = document.getElementById("json-export-all-button");
var html_export_day_button: HTMLElement = document.getElementById("html-export-day-button");
var html_export_week_button: HTMLElement = document.getElementById("html-export-week-button");
var html_export_month_button: HTMLElement = document.getElementById("html-export-month-button");
var html_export_all_button: HTMLElement = document.getElementById("html-export-all-button");
var xml_export_day_button: HTMLElement = document.getElementById("xml-export-day-button");
var xml_export_week_button: HTMLElement = document.getElementById("xml-export-week-button");
var xml_export_month_button: HTMLElement = document.getElementById("xml-export-month-button");
var xml_export_all_button: HTMLElement = document.getElementById("xml-export-all-button");
var edit_pick_view: HTMLElement = document.getElementById("edit-form-container");
var edit_event_picker_input: HTMLInputElement = <HTMLInputElement>document.getElementById("event-id");
var edit_date_input: HTMLInputElement = <HTMLInputElement>document.getElementById("edit-dateinput");
var edit_type_input: HTMLInputElement = <HTMLInputElement>document.getElementById("edit-typeinput");
var edit_notes_input: HTMLInputElement = <HTMLInputElement>document.getElementById("edit-notesinput")
var edit_recurring_input: HTMLInputElement = <HTMLInputElement>document.getElementById("edit-recurringinput");
var edit_submit_button: HTMLInputElement = <HTMLInputElement>document.getElementById("edit-submit-button");
var edit_pick_submit_button: HTMLElement = document.getElementById("edit-pick-submit-button");
var add_date_input: HTMLInputElement = <HTMLInputElement>document.getElementById("dateinput");
var add_type_input: HTMLInputElement = <HTMLInputElement>document.getElementById("typeinput");
var add_notes_input: HTMLInputElement = <HTMLInputElement>document.getElementById("notesinput");
var add_recurring_input: HTMLInputElement = <HTMLInputElement>document.getElementById("recurringinput");
var operation_output_container: HTMLDivElement = <HTMLDivElement> document.getElementById("output-container");
var operation_close_button: HTMLInputElement = <HTMLInputElement>document.getElementById("close-output-button");
var operation_output: HTMLDivElement = <HTMLDivElement>document.getElementById("output-view-id")
var edit_form_container: HTMLDivElement = <HTMLDivElement> document.getElementById("edit-form-container");
var base_conn_string = "http://127.0.0.1:3000/";
var timer_running: boolean = false;

declare var saveAs:any; 
requirejs(["../event_class"],function(event_class){
    console.log("event_class has been loaded");
})
requirejs(["../export-html"],function(html_export){
    console.log("html_export has been loaded");
})
requirejs([],function(date_func){
    console.log("Date Functions Loaded...")
})
declare var filesaver: any;
class button_element_pair{
    public button: HTMLElement;
    public view: HTMLElement;
    constructor(_button: HTMLElement, _view: HTMLElement){
        this.button = _button;
        this.view = _view;
    }
    
}
class database_functions{
    public static update_database(event: event_class, prom_res: Function){
        var conn = new XMLHttpRequest();
            conn.open("POST", base_conn_string + "***ADD-NEW:://" + string_function.create_json_string(event), true);
            conn.onload = function(){
                form_functions.operation_output(conn.response);
                prom_res();                              
            }
            conn.send();
    }
    public static get_query_result(query_identifier: string){        
        var prom = new Promise(function(){
            var conn = new XMLHttpRequest();
            conn.open("GET", base_conn_string + query_identifier, true);
            conn.onload = function(){
                if(conn.response.indexOf("***No results to return***") === -1){
                    form_functions.display_result(page_functions.view_callback(conn.response));    
                } else {
                    form_functions.operation_output("No Results To Display");
                }
                               
            }
            conn.send();
        })
    }
    public static get_edit_event(): Promise<event_class>{
        var event_id: string = edit_event_picker_input.value;
        var edit_get_event_prom = new Promise(function(resolve, reject){
            var conn: XMLHttpRequest = new XMLHttpRequest();
            conn.open("GET", base_conn_string + "***EDIT-GET::" + event_id + "***", true);
            conn.onload = function(){           
                if(conn.response.indexOf("**//No Results") === -1){
                    var edit_event_arr: event_class = page_functions.view_callback(conn.response)[0];                    
                    resolve(edit_event_arr);
                } else {
                    reject("Unable to find ID, Please check again");
                }
            }
            conn.send();
        })
        return edit_get_event_prom;
    }
    public static update_record(idkey: string):Promise<string>{
        var object_string = string_function.create_json_string(page_functions.data_from_form(
            edit_date_input, edit_type_input, edit_notes_input, edit_recurring_input, idkey
        ));
        var update_prom: Promise<string> = new Promise(function(resolve, reject){
            var conn = new XMLHttpRequest();
            conn.open("GET", base_conn_string + "***UPDATE:://" + object_string + "***", true);
            conn.onload = function(){
                resolve(conn.response);
            }
            conn.send();
        })
        return update_prom;
    }    
    public static request_export(type_string: string): Promise<string>{
        var exp_prom = new Promise(function(resolve, reject){
            var conn = new XMLHttpRequest();
            conn.open("GET", base_conn_string + type_string, true);
            conn.onload = function(){
                if(conn.response.indexOf("**//No Results") === -1){
                    resolve(conn.response)    
                } else {
                    reject("No results to display");
                }               
                
                
            }
            conn.send();
        })
        return exp_prom;
    }     
}
class form_functions{
    public static reset_form(){
        var reset_items = document.getElementsByClassName("form_items");
        for(var x in reset_items){
            var elem: HTMLFormElement = <HTMLFormElement>reset_items[x];
            elem.reset();
        }
    }
    public static unlock_edit_form(){
        var edit_elements: HTMLCollectionOf<Element> = document.getElementsByClassName("edit-form-items");
        for(var x in edit_elements){
            var edit_item: HTMLInputElement = <HTMLInputElement> edit_elements[x];
            if(edit_item.readOnly){
                edit_item.readOnly = false;    
            }
            
        };
    }  
    public static create_span_element(): HTMLElement{
        var span_elem: HTMLElement = document.createElement("span");
        return span_elem;
    }  
    public static create_br_element(): HTMLElement{
        var header: HTMLElement = document.createElement("br");
        return header;
    }  
    public static populate_edit_fields(edit_data: event_class){
        //Check format.
        var date_array: string[] = edit_data.date.split("/");
        edit_date_input.value = date_array[2] + "-" + date_array[1] + "-" + date_array[0];
        edit_type_input.value = string_function.first_letter_to_uppercase(edit_data.type);
        edit_notes_input.value = edit_data.notes;        
        edit_recurring_input.value = string_function.recurring_number_to_string_option(edit_data.recurring.toString());
    }
    public static create_event_element(to_display: event_class): HTMLElement{
        var container:HTMLElement = document.createElement("div");
        var event_container: HTMLElement = document.createElement("div");
        var inner:HTMLElement = document.createElement("div");
        var hr: HTMLElement = document.createElement("hr");
        var header: HTMLElement = document.createElement("h3");
        var date_span: HTMLElement = this.create_span_element();
        var type_span: HTMLElement = this.create_span_element();
        var id_span: HTMLElement = this.create_span_element();
        var hr:HTMLElement = document.createElement("hr");
        var ref_date: string = date_function.get_ddmmyyy_from_date(new Date());
        var check_date: string = to_display.date;
        event_container.className = "event";
        header.id = "header";
        inner.className = "inner";
        type_span.innerText = "Type: " + to_display.type;
        id_span.innerText = "ID: " + to_display.id.toString();
        if(ref_date === check_date){
            date_span.innerText = to_display.date;
            date_span.style.textShadow = "0 0 15px yellow";
            date_span.style.backgroundColor = "grey";
            date_span.style.boxShadow = "0 0 15px yellow";
        } else {
            date_span.innerText = "Date: " + to_display.date;
        }
        
        header.innerText = to_display.notes;
        header.style.textAlign = "center"
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
        container.style.margin = "0 auto"           
        container.appendChild(document.createElement("br"));
        container.appendChild(event_container);
        event_container.style.border = "1px dashed grey";
        event_container.style.borderRadius = "10px";
        event_container.style.right = "5%";
        event_container.style.padding = "0% 5% 5% 5%";
        container.style.width = "80%"        
        return container;        
    }
    public static clear_output_view(){
        while(output_view.firstChild){
            output_view.removeChild(output_view.firstChild);
        }                            
    }
    public static display_result(event_array: Array<event_class>){          
           for(var item in event_array){
               var to_add: HTMLElement =  this.create_event_element(event_array[item])
               output_view.appendChild(to_add);
           }
            output_view.style.display = "block";
            view_view.style.display = "none";
        
    }
    public static no_result(){
        output_view.style.display = "inline-block";
        view_view.style.display = "none";
        var no_res: string = "No results! <br> Try adding an event for this";
        output_view.innerHTML += no_res;       
        output_view.style.color = "white";
    }   
    public static operation_output(err_message: string, cb?: Function){
        operation_output_container.style.display = "block";
        operation_output.innerText = err_message;
        if(cb){
            cb();
        }
        
    }
}
class string_function{    
    public static first_letter_to_uppercase(str: string){
        var first_letter = str.slice(0,1).toUpperCase();
        var rest_of_string = str.slice(1, str.length);
        return first_letter + rest_of_string;
    }    
    public static create_json_string(event: event_class){
        
            var json_string = `            
            {
                "event":{
                    "id":"` + event.id + `",\n
                    "date":"` + event.date +`",\n
                    "type":"` + event.type + `",\n
                    "notes":"` + event.notes + `",\n
                    "recurring":"` + event.recurring + `"\n                    
                }
            }
            
            `
            return json_string;        
    }
    public static recurring_number_to_string_option(recurring: string): string{
        if(recurring === "1"){
            return "Yes"
        } else {
            return "No"
        }
    }         
}
class date_function{    
    public static date_no_separator(date_string: string){
        while(date_string.indexOf("/") !== -1){
            date_string = date_string.replace("/", "");           
        }
        return date_string;
    }
    public static get_date_from_date_string(date_string: string): Date{
        var date_array = date_string.split("/");
        var return_date = new Date(date_array[2] + "/" + date_array[1] + "/" + date_array[0])
        return return_date;
    }
    public static get_ddmmyyy_from_date(date_obj: Date):string{
        var dd:string = date_func.single_date_to_double_date(date_obj.getDate());
        var mm:string = (date_obj.getMonth() + 1).toString();
        var yyyy:string = date_obj.getFullYear().toString();
        return dd + "/" + mm + "/" + yyyy;
    }  
}
class page_functions{
    public static hardcode_array(): button_element_pair[]{
        var add: button_element_pair = new button_element_pair(add_button, add_view);
        var edit: button_element_pair = new button_element_pair(edit_button, edit_view);
        var view: button_element_pair = new button_element_pair(view_button, view_view);
        var expor: button_element_pair = new button_element_pair(export_button, export_view);
        var elem_butt_array: button_element_pair[] = [];
        elem_butt_array.push(add, edit, view, expor);        
        return elem_butt_array;
    }    
    public static data_from_form(date_elem:HTMLElement,
                                 type_elem: HTMLElement,
                                 notes_elem: HTMLElement,
                                 recurring_elem:HTMLElement,
                                 id_val?: string):event_class{
                                     
        var date_input: string = (<HTMLInputElement>date_elem).value;
        while(date_input.indexOf("-") > 0){
            date_input = date_input.replace("-","/");
        }
        date_input = date_func.reverse_date_parser(date_input);
        var type_input: string = (<HTMLInputElement>type_elem).value;
        var notes_input: string = (<HTMLInputElement>notes_elem).value;
        var recurring_input: string = (<HTMLInputElement>recurring_elem).value;
        if(id_val){
            var new_class = new event_class(date_input, type_input,notes_input,1, parseInt(id_val));
        } else {            
            var new_class = new event_class(date_input, type_input,notes_input,1);
        }      
        return new_class;
        
    }
    public static object_to_event_class(obj: Object): event_class{
        var temp: event_class = new event_class(
            obj["Date"],
            obj["Type"],
            obj["Notes"],
            obj["Recurring"],
            obj["ID"]
        )
        return temp;
    }   
    public static view_callback(conn: string):Array<event_class>{
        if(conn.indexOf("No results to return") === -1){
            var ev_cls = JSON.parse((JSON.parse(conn))).events;
            var event_class_array: Array<event_class> = [];    
            if(Object.keys(ev_cls).length > 0){
                for(var x in ev_cls){
                    var temp:event_class = page_functions.object_to_event_class(ev_cls[x])
                    event_class_array.push(temp);
                }                
            }
            return event_class_array;
        } else {            
            form_functions.no_result();                       
        }
        
        
    }
    public static save_file(export_string: string, export_type: string){
        var file_name:string = date_function.date_no_separator(date_func.date_to_date_string(new Date)) + " " + export_type;
                
        var blob = new Blob([export_string], {type: "text/plain;charset=utf-8"});
        saveAs(blob, file_name + "." + export_type);
    }
}
function on_off(button: HTMLElement) {
    output_view.style.display = "none";
    var status = button.style.display;
    var all_elements: button_element_pair[] = page_functions.hardcode_array();
    for(var x in all_elements){
        if(all_elements[x].button !== button){
            all_elements[x].view.style.display = "none";
        } else {
            all_elements[x].view.style.display = "block";
        }
    }
    console.log(getComputedStyle(edit_form_container).display)
    if(getComputedStyle(edit_form_container).display === "block"){
        edit_form_container.style.display = "none"
    }
}
(function(){
    add_button.onclick = function () {
        on_off(add_button);
        };
    view_button.onclick = function () {
        on_off(view_button);
        form_functions.clear_output_view();    
        };
    edit_button.onclick = function () {
        on_off(edit_button);
        };
    export_button.onclick = function(){
            on_off(export_button);            
        }
    submit_buttom.onclick = function () {
        var prom = new Promise(function(res, rej){
           database_functions.update_database(page_functions.data_from_form(add_date_input, add_type_input, add_notes_input,add_recurring_input), res);            
        }).then(function(){
                
        })
        
        }
    view_day_button.onclick = function(){
        database_functions.get_query_result("QUERY=\"SELECTDAY\"")
        }
    view_week_button.onclick = function(){
        database_functions.get_query_result("QUERY=\"SELECTWEEK\"")
        }
    view_month_button.onclick = function(){
        database_functions.get_query_result("QUERY=\"SELECTMONTH\"")
        }
    view_all_button.onclick = function(){
        database_functions.get_query_result("QUERY=\"SELECTALL\"")        
        }    
    json_export_day_button.onclick = function(){
        database_functions.request_export("***DAY::EXPORT//==//JSON***").then(function(export_string){
                page_functions.save_file(export_string, "json");
            }).catch(function(err_message){
                form_functions.operation_output(err_message);
            });          
        }
    json_export_week_button.onclick = function(){
        database_functions.request_export("***WEEK::EXPORT//==//JSON***").then(function(export_string){
                page_functions.save_file(export_string, "json");                
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    json_export_month_button.onclick = function(){
        database_functions.request_export("***MONTH::EXPORT//==//JSON***").then(function(export_string){
                page_functions.save_file(export_string, "json");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    json_export_all_button.onclick = function(){
        database_functions.request_export("***ALL::EXPORT//==//JSON***").then(function(export_string){
                page_functions.save_file(export_string, "json");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    html_export_day_button.onclick = function(){
        database_functions.request_export("***DAY::EXPORT//==//HTML***").then(function(export_string){
        page_functions.save_file(export_string, "html");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        } 
    html_export_week_button.onclick = function(){
        database_functions.request_export("***WEEK::EXPORT//==//HTML***").then(function(export_string){
        page_functions.save_file(export_string, "html");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        } 
    html_export_month_button.onclick = function(){
        database_functions.request_export("***MONTH::EXPORT//==//HTML***").then(function(export_string){
        page_functions.save_file(export_string, "html");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        } 
    html_export_all_button.onclick = function(){
        database_functions.request_export("***ALL::EXPORT//==//HTML***").then(function(export_string){
        page_functions.save_file(export_string, "html");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    xml_export_day_button.onclick = function(){
        database_functions.request_export("***DAY::EXPORT//==//XML***").then(function(export_string){
        page_functions.save_file(export_string, "xml");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    xml_export_week_button.onclick = function(){
        database_functions.request_export("***WEEK::EXPORT//==//XML***").then(function(export_string){
        page_functions.save_file(export_string, "xml");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    xml_export_month_button.onclick = function(){
        database_functions.request_export("***MONTH::EXPORT//==//XML***").then(function(export_string){
        page_functions.save_file(export_string, "xml");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    xml_export_all_button.onclick = function(){
        database_functions.request_export("***ALL::EXPORT//==//XML***").then(function(export_string){
        page_functions.save_file(export_string, "xml");
            }).catch(function(err_message){
                form_functions.operation_output(err_message)
            })
        }
    edit_pick_submit_button.onclick = function(){
        var edit_pick_prom: Promise<any> = database_functions.get_edit_event();
        
        edit_pick_prom.then(function(ev_cls){            
            edit_view.style.display = "block";
            
                edit_form_container.style.display = "block";
            form_functions.populate_edit_fields(ev_cls);
            form_functions.unlock_edit_form();
            edit_submit_button.onclick = function(){
                var update_prom: Promise<string> = database_functions.update_record(edit_event_picker_input.value);
                update_prom.then(function(returned){
                form_functions.operation_output(returned)
                edit_form_container.style.display = "block";
                
                
        })
        
            }
        });
        edit_pick_prom.catch(function(err_message){
            
            form_functions.operation_output(err_message);
        })
        }
    operation_close_button.onclick = function(){
        operation_output_container.style.display = "none"
        operation_output.innerText = "";
    }

    })()
