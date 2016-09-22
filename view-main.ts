///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./prompt_func.ts" />

import event_class from './event_class'
import sql_func from './sql_func'
import main_menu from './main-menu'
import check_main from './check-main'
import output_functions from './output_functions'
import date_fnc from './date_functions'
import exp_html from './export-html'
import exp_json from './export-json'
import exp_xml from './export-xml'
declare function require(name: string);
var schema_object = {
    properties:{
        'Select date dd/mm/yyyy':{
            pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$|all/,
            message: 'Please enter date as dd/mm/yyyy (`all` for all)',
            required: true
        }
    }
}

class view_main{
    public static _date;
    public static main(){
        var that = this;
        var prompt = require('prompt');
        var prom_ret = new Promise(function(resolve, reject){
            prompt.get(schema_object, function(err, result){
                if(result['Select date dd/mm/yyyy'].toLowerCase() === "all"){
                   var ret_prom:Promise<Array<event_class>> = sql_func.general_query("SELECT * FROM devbox.events_data ORDER BY dateandtime asc");
                   ret_prom.then(function(cls_arr){
                       output_functions.print_result_cards(cls_arr);
                       exp_html.export_main(cls_arr)
                       exp_json.export_main(cls_arr)
                       exp_xml.export_main(cls_arr)
                       return;
                   }).then(function(){
                       main_menu.mainmenu();
                   })
                } else {
                    var date_string: string = date_fnc.dateparser(result['Select date dd/mm/yyyy']);
                    that._date = date_string;
                    resolve(date_string)
                }
            })
        }).then(function(renamed){
            var str: string = renamed.toString();
            var ret_prom: Promise<Array<event_class>> = sql_func.retrieve_by_date(str);
            ret_prom.then(function(res_arr){
                for(var x in res_arr){
                    console.log(output_functions.output_event(res_arr[x]))
                }
                return;
            }).then(function(){
                main_menu.mainmenu();
            })
        })
    }
}
export default view_main;