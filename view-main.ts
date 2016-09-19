///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />

import event_class from './event_class'
import sql_func from './sql_func'
import misc_func from './misc_func'
import main_menu from './main-menu'
declare function require(name: string);
var schema_object = {
    properties:{
        'Select date dd/mm/yyyy':{
            pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
            message: 'Please enter date as dd/mm/yyyy',
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
                var date_string: string = misc_func.dateparser(result['Select date dd/mm/yyyy']);
                that._date = date_string;
                resolve(date_string)
            })
        }).then(function(renamed){
            var str: string = renamed.toString();
            sql_func.retrieve_by_date(str, main_menu.mainmenu);
        })
    }
}
export default view_main;