///<reference path="./event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />
///<reference path="./add-main.ts" />
///<reference path="./view-main.ts" />
///<reference path="./check-main.ts" />

import event_class from './event_class'
import sql_func from './sql_func'
import Startup from './add-main'
import view_main from './view-main'
import check_func from './check-main'
import edit from './edit_main'
import delete_main from './delete-main'

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
        misc_func.console_log("Program Open");
        var prom_add = new Promise(function(res, rej){
            prompt_add.get(schema_object_add, function(err, result){
                var result = result['What would you like to do? (check today (check), add, edit, delete, view, exit)'];
                res(result.toUpperCase())
                           
            })    
        }).then(function(val){
            switch (val){
                    case "ADD":
                    misc_func.console_log(val);
                    Startup.main();
                    break;
                    case "EDIT":
                    misc_func.console_log(val);
                    edit.main_pick_event();
                    break;
                    case "DELETE":
                    misc_func.console_log(val);
                    delete_main.main();
                    break;                    
                    case "VIEW":
                    misc_func.console_log(val);
                    view_main.main();
                    break;
                    case "EXIT":
                    misc_func.console_log("Goodbye!");
                    break;
                    case "CHECK":
                    misc_func.console_log(val);
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