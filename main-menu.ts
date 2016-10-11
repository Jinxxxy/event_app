///<reference path="./libs/event_class.ts" />
///<reference path="./libs/sql_func.ts" />
///<reference path="./libs/prompt_func.ts" />
///<reference path="./libs/add-main.ts" />
///<reference path="./libs/view-main.ts" />
///<reference path="./libs/check-main.ts" />

import event_class from './libs/event_class'
import sql_func from './libs/sql_func'
import Startup from './libs/add-main'
import view_main from './libs/view-main'
import check_func from './libs/check-main'
import edit from './libs/edit_main'
import delete_main from './libs/delete-main'
import output_functions from './libs/output_functions'

declare function require(name: string);
//adding to console prototype


var schema_object_add = {
    properties:{
        'What would you like to do? (check today (check), add, edit, delete, view, exit)':{
            pattern: /add|edit|delete|view|exit|check/,
            message: "Please enter add, edit or view",
            required: true
        }
    }
}

export default class main_menu{
    public static mainmenu(): void{
        var prompt_add = require('prompt');
        output_functions.console_log("Program Open");
        var prom_add = new Promise(function(res, rej){
            prompt_add.get(schema_object_add, function(err, result){
                var result = result['What would you like to do? (check today (check), add, edit, delete, view, exit)'];
                res(result.toUpperCase())
                           
            })    
        }).then(function(val){
            switch (val){
                    case "ADD":
                    output_functions.console_log(val);
                    Startup.main();
                    break;
                    case "EDIT":
                    output_functions.console_log(val);
                    edit.main_pick_event();
                    break;
                    case "DELETE":
                    output_functions.console_log(val);
                    delete_main.main();
                    break;                    
                    case "VIEW":
                    output_functions.console_log(val);
                    view_main.main();
                    break;
                    case "EXIT":
                    output_functions.console_log("Goodbye!");
                    break;
                    case "CHECK":
                    output_functions.console_log(val);
                    check_func.check_menu();
                    break;
                    default:
                    console.log("Unknown Command. Please check and try again")
                    main_menu.mainmenu();
                    break;
            }
        })
        
    }
}
main_menu.mainmenu();