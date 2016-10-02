///<reference path="C:\Development\node\events_cli\require.d.ts" />
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
var export_week_button: HTMLElement = document.getElementById("export-week-button");
var export_day_button: HTMLElement = document.getElementById("export-day-button");
var export_month_button: HTMLElement = document.getElementById("export-month-button");
var export_all_button: HTMLElement = document.getElementById("export-all-button");
///<reference path="C:\Development\node\events_cli\event_class.ts" />
///<reference path="./../FileSaver.d.ts" />
import event_class from "./../event_class";
import html_export from "./../export-html";
import filesaver from "./FileSaver";
import date_func from "./../date_functions";

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

var base_conn_string = "http://127.0.0.1:3000/";

class button_element_pair{
    public button: HTMLElement;
    public view: HTMLElement;
    constructor(_button: HTMLElement, _view: HTMLElement){
        this.button = _button;
        this.view = _view;
    }
    
}
class page_functions{
    public static reset_form(){
        var reset_items = document.getElementsByClassName("form_items");
        for(var x in reset_items){
            var elem: HTMLFormElement = <HTMLFormElement>reset_items[x];
            console.log(elem);
            elem.reset();
        }
    }
    public static hardcode_array(): button_element_pair[]{
        var add: button_element_pair = new button_element_pair(add_button, add_view);
        var edit: button_element_pair = new button_element_pair(edit_button, edit_view);
        var view: button_element_pair = new button_element_pair(view_button, view_view);
        var expor: button_element_pair = new button_element_pair(export_button, export_view);
        var elem_butt_array: button_element_pair[] = [];
        elem_butt_array.push(add, edit, view, expor);
        
        return elem_butt_array;
    }    
    public static data_from_form():event_class{
        var date_input: string = (<HTMLInputElement>document.getElementById('dateinput')).value;
        var type_input: string = (<HTMLInputElement>document.getElementById('typeinput')).value
        var notes_input: string = (<HTMLInputElement>document.getElementById('notesinput')).value
        var recurring_input: string = (<HTMLInputElement>document.getElementById('recurringinput')).value;      
        var new_class = new event_class(date_input, type_input,notes_input,1);
        console.log(new_class)
        return new_class;
    }
    public static update_database(event: event_class, prom_res: Function){
        var conn = new XMLHttpRequest();
            conn.open("POST", base_conn_string + this.create_json_string(event), true);
            conn.onload = function(){
                alert(conn.response);
                prom_res();                              
            }
            conn.send();
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
            console.log("JSON Valid");
            console.log(JSON.parse(json_string));
            return json_string;        
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
    public static no_result(){
        console.log("functon_running")
        output_view.style.display = "inline-block";
        view_view.style.display = "none";
        var no_res: string = "No results! <br> Try adding an event for this";
        output_view.innerHTML += no_res;       
        output_view.style.color = "white";
    }      
    public static view_callback(conn: string):Array<event_class>{
        console.log(conn)
        console.log(conn.indexOf("No results to return"))
        if(conn.indexOf("No results to return") === -1){
            console.log(JSON.parse(conn));
            var ev_cls = JSON.parse((JSON.parse(conn))).events;
            console.log(typeof ev_cls);
            var event_class_array: Array<event_class> = [];    
            if(Object.keys(ev_cls).length > 0){
                for(var x in ev_cls){
                    var temp:event_class = page_functions.object_to_event_class(ev_cls[x])
                    event_class_array.push(temp);
                }                
            }
            return event_class_array;
        } else {            
            page_functions.no_result();                       
        }
        
        
    }  
    public static create_span_element(): HTMLElement{
        var span_elem: HTMLElement = document.createElement("span");
        return span_elem;
    }  
    public static create_br_element(): HTMLElement{
        var header: HTMLElement = document.createElement("br");
        return header;
    }
    public static get_ddmmyyy_from_date(date_obj: Date):string{
        var dd:string = date_func.single_date_to_double_date(date_obj.getDate());
        var mm:string = (date_obj.getMonth() + 1).toString();
        var yyyy:string = date_obj.getFullYear().toString();
        return dd + "/" + mm + "/" + yyyy;
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
        var ref_date: string = this.get_ddmmyyy_from_date(new Date());
        var check_date: string = to_display.date;
        console.log(ref_date + " : " + check_date);
        event_container.className = "event";
        header.id = "header";
        inner.className = "inner";
        console.log(ref_date === check_date)
        type_span.innerText = "Type: " + to_display.type;
        id_span.innerText = "ID: " + to_display.id.toString();
        if(ref_date === check_date){
            date_span.innerText = to_display.date;
            date_span.style.textShadow = "0 0 10px yellow";
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
        event_container.style.padding = "5%";
        container.style.width = "80%"        
        return container;        
    }
    public static display_result(event_array: Array<event_class>){          
           for(var item in event_array){
               var to_add: HTMLElement =  this.create_event_element(event_array[item])
               output_view.appendChild(to_add);
           }
            output_view.style.display = "block";
            view_view.style.display = "none";
        
    }
    public static get_query_result(query_identifier: string){        
        var prom = new Promise(function(){
            var conn = new XMLHttpRequest();
            conn.open("GET", base_conn_string + query_identifier, true);
            conn.onload = function(){
                if(conn.response.indexOf("***No results to return***") === -1){
                    page_functions.display_result(page_functions.view_callback(conn.response));    
                } else {
                    page_functions.no_result();
                }
                               
            }
            conn.send();
        })
    }
    public static request_export(type_string: string): Promise<string>{
        var exp_prom = new Promise(function(resolve, reject){
            var conn = new XMLHttpRequest();
            conn.open("GET", base_conn_string + type_string, true);
            conn.onload = function(){                
                resolve(conn.response)
            }
            conn.send();
        })
        return exp_prom;
    }
    public static clear_output_view(){
        while(output_view.firstChild){
            output_view.removeChild(output_view.firstChild);
        }                            
    }
    public static save_file(json_string: string){
        var download_link = document.createElement("a");
        download_link.href="./../output-cache/test.json";
        download_link.innerHTML = "Click here to download your file"
        download_link.className = "button";
        download_link.style.position = "absolute";
        download_link.style.top  = "0";
        download_link.style.left = "0";
        download_link.onclick = function(){
            document.removeChild(this);
        }
        document.body.appendChild(download_link);
    }
}

function on_off(button: HTMLElement) {
    output_view.style.display = "none";
    var status = button.style.display;
    var all_elements: button_element_pair[] = page_functions.hardcode_array();
    for(var x in all_elements){
        console.log(all_elements[x].button !== button)
        if(all_elements[x].button !== button){
            all_elements[x].view.style.display = "none";
        } else {
            all_elements[x].view.style.display = "block";
        }
    }
}
(function(){
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
    export_button.onclick = function(){
            on_off(export_button);            
        }
    submit_buttom.onclick = function () {
        var prom = new Promise(function(res, rej){
            page_functions.update_database(page_functions.data_from_form(), res);            
        }).then(function(){
            location.reload();    
        })
        
        }
    view_day_button.onclick = function(){
        page_functions.get_query_result("QUERY=\"SELECTDAY\"")
        }
    view_week_button.onclick = function(){
        page_functions.get_query_result("QUERY=\"SELECTWEEK\"")
        }
    view_month_button.onclick = function(){
        page_functions.get_query_result("QUERY=\"SELECTMONTH\"")
        }
    view_all_button.onclick = function(){
        page_functions.get_query_result("QUERY=\"SELECTALL\"")        
        }    
    export_day_button.onclick = function(){
        page_functions.request_export("***DAY::EXPORT//==//JSON***").then(function(){
                
            })
        }
    export_week_button.onclick = function(){
        page_functions.request_export("***WEEK::EXPORT//==//JSON***").then(function(json){
                
                page_functions.save_file(json)
            })
        }
    export_month_button.onclick = function(){
        page_functions.request_export("***MONTH::EXPORT//==//JSON***").then(function(){
                
            })
        }
    export_all_button.onclick = function(){
        page_functions.request_export("***ALL::EXPORT//==//JSON***").then(function(){
                
            })
        }
    
    })()
