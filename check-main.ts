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
        'Check day / week / month':{
            pattern:/day|week|month/,
            message:'Please enter \'day\', \'week\' or \'month\'',
            required: true
        }
    }
}
class week{
    public static week_query_string(date_arr: string[]): string{
        var pre_string: string = "SELECT * FROM devbox.events_data WHERE dateandtime > " + date_arr[0] + " AND dateandtime < " + date_arr[1] + ";";
        return pre_string;
    }
    public static week_get(){
        var prom = new Promise(function(resolve, reject){
            var ret_prom = sql_func.general_query(week.week_query_string(misc_func.get_week_date()))
            
            ret_prom.then(function(arr_obj){
                check_func.print_results(arr_obj, resolve);
            }).then(function(){
                main_menu.mainmenu();
            })
            
        })
    }
    
}
class day{
    public static day_query_string(): string{
        var query_string: string = "";
        var now_date: Date = new Date();
        var dd: string = misc_func.single_date_to_double_date(now_date.getDate());
        var mm: string = misc_func.single_date_to_double_date(now_date.getMonth() + 1);
        var yyyy: string = now_date.getFullYear().toString();
        
        query_string = yyyy + mm + dd;
        var output_string = "SELECT * FROM devbox.events_data WHERE dateandtime = " + query_string
        return output_string;
        
    }
    public static day_get(){
        var prom = new Promise(function(resolve, reject){
            var ret_prom = sql_func.general_query(day.day_query_string());
            ret_prom.then(function(arr_obj){
                check_func.print_results(arr_obj, resolve);
            })
        }).then(function(){
            main_menu.mainmenu();
        })
    } 
}
class month{
    public static month_query_string(){
        var orig_date = new Date();
        var orig_string = orig_date.getFullYear().toString() + misc_func.single_date_to_double_date(((orig_date.getMonth() + 1))) + orig_date.getDate().toString();
        orig_date.setMonth(orig_date.getMonth() + 2);        
        var out_string = orig_date.getFullYear().toString() + misc_func.single_date_to_double_date(orig_date.getMonth()) + orig_date.getDate().toString();        
        var pre_string: string = "SELECT * FROM devbox.events_data WHERE dateandtime >=" + orig_string + " AND dateandtime <=" + out_string;        
        return pre_string;        
    }
    public static month_get(){
        var prom = new Promise(function(resolve, reject){
            var ret_prom = sql_func.general_query(month.month_query_string());
            ret_prom.then(function(arr_obj){
                check_func.print_results(arr_obj, resolve);
            })
        }).then(function(){
            main_menu.mainmenu();
        })
    }
}
class check_func{
    
    public static print_results(res_arr: Array<event_class>, cb?: Function): void{
        for(var x in res_arr){
            console.log(misc_func.output_event(res_arr[x]));
        }
        console.log("______________________")
        if(cb){
            cb();
        }
        return;
    }
    
    public static check_menu(){
        var that = this;
        var prompt = require('prompt');
        var prom = new Promise(function(resolve, reject){
            prompt.get(schema_object, function(err, result){
                if(err){
                    throw err;
                } else {
                    var res: string = result['Check day / week / month'].toLowerCase(); 
                    switch(res){
                        case 'day':                        
                        day.day_get();
                        break
                        case 'week':
                        week.week_get();
                        break
                        case 'month':
                        month.month_get();
                        break
                    }
                }                
            })
        })
    }
    
}
export default check_func;