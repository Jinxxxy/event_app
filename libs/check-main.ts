///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./prompt_func.ts" />

import event_class from './event_class'
import sql_func from './sql_func'
import main_menu from './../main-menu'
import query_builders from './query-builders'
import output_functions from './output_functions'
import exp_html from './export-html'
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
    public static week_get(){
        var prom = new Promise(function(resolve, reject){
            var ret_prom = sql_func.general_query(query_builders.week_query_builder())
            
            ret_prom.then(function(arr_obj){
                output_functions.print_result_cards(arr_obj.res_array, resolve);
                resolve(arr_obj)
            })
            
        }).then(function(){
                main_menu.mainmenu();
                
            })
    }    
}
class day{    
    public static day_get(){
        var prom = new Promise(function(resolve, reject){
            var ret_prom = sql_func.general_query(query_builders.day_query_builder());
            ret_prom.then(function(arr_obj){
                output_functions.print_result_cards(arr_obj.res_array, resolve);
            })
        }).then(function(){
            main_menu.mainmenu();
        })
    } 
}
class month{    
    public static month_get(){
        var prom = new Promise(function(resolve, reject){
            var ret_prom = sql_func.general_query(query_builders.month_query_builder());
            ret_prom.then(function(arr_obj){                
                output_functions.print_result_cards(arr_obj.res_array, resolve);
            })
        }).then(function(){
            
            main_menu.mainmenu();
        })
    }
}
class check_func{
        
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