///<reference path="event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./prompt_func.ts" />

import event_class from './event_class'
import sql_func from './sql_func'
import main_menu from './../main-menu'
import query_builders from './query-builders'
import output_functions from './output_functions'
declare function require(name: string);

class delete_main{
    private static delete_schema = {
        properties:{
            'Please enter the ID of the even to delete:':{
                pattern: /[0-9]{0,4}/,
                message: "Please an event ID",
                required: true
            }
        }
    }
    public static main(){
        var prompt = require('prompt');
        var prom = new Promise(function(resolve, reject){
            prompt.get(delete_main.delete_schema, function(err, result){
                var answer = result['Please enter the ID of the even to delete:'];
                var ret_prom: Promise<string> = sql_func.void_return_query(query_builders.delete_query_builder(answer))
                ret_prom.then(function(res){
                    if(res['affectedRows'] < 1){
                        console.log("Unable to complete operation. Check ID and try again");
                        main_menu.mainmenu();
                    }
                    else{
                        resolve(answer)
                    }
                })
            })    
        }).then(function(answer){
            output_functions.console_log("Record " + answer + " has been deleted");
            main_menu.mainmenu();
        })
        
    }
}
export default delete_main;