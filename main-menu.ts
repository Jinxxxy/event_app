///<reference path="./event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />
///<reference path="./add-main.ts" />
///<reference path="./view-main.ts" />
///<reference path="./check-main.ts" />

import event_class from './event_class'
import sql_func from './sql_func'
import misc_func from './misc_func'
import Startup from './add-main'
import view_main from './view-main'
import check_func from './check-main'
import edit from './edit_main'

declare function require(name: string);
//adding to console prototype


var schema_object_add = {
    properties:{
        'What would you like to do? (check today (check), add, edit, view, exit)':{
            pattern: /add|edit|view|exit|check/,
            message: "Please enter add, edit or view",
            required: true
        }
    }
}

export default class main_menu{
    public static mainmenu(): void{
        var prompt_add = require('prompt');
        misc_func.console_log("Program Open");
        var prom_add = new Promise(function(res, rej){
            prompt_add.get(schema_object_add, function(err, result){
                var result = result['What would you like to do? (check today (check), add, edit, view, exit)'];
                res(result.toUpperCase())
                           
            })    
        }).then(function(val){
            switch (val){
                    case "ADD":
                    console.log(val);
                    Startup.main();
                    break;
                    case "EDIT":
                    edit.main_pick_event();
                    break;
                    case "VIEW":
                    console.log(val);
                    view_main.main();
                    break;
                    case "EXIT":
                    console.log("Goodbye!")
                    break;
                    case "CHECK":
                    check_func.check_menu();
                    break;
            }
        })
        
    }
}
main_menu.mainmenu();