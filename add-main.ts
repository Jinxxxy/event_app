///<reference path="./event_class.ts" />
///<reference path="./sql_func.ts" />
///<reference path="./misc_func.ts" />
///<reference path="./prompt_func.ts" />

declare function require(name: string);
import event_class from './event_class'
import sql_func from './sql_func'
import misc_func from './misc_func'
import mainmenu from './main-menu'

// resolve issue to export schema_objects to a separate class file
var schema_objects = {
    'add-new':{
        properties:{
            'Date(dd-mm-yyyy)':{
                pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
                message: 'Please enter date as dd/mm/yyyy',
                required: true,
            },
            'Type(Birthday, Anniversary, Event)':{
                pattern: 'birthday|anniversary|event',
                message: 'Please enter either "birthday","anniversay" or "event"',
                required: true,
            },
            'Notes':{
                pattern: /^[a-zA-Z0-9 ]{0,1000}$/,
                message: 'Only letters numbers and spaces can be used. Must be no more than 1000 characters',
                required: true
            },
            'Recurring event? (Y/N)':{
                pattern: /y|Y|n|N/,
                message: 'Only y / n are accepted',
                required: true
            }
        }
    }
}

export default class Startup {
    public static res_data: event_class;    
    public static id: number;
        
    public static main() {
        var that = this;
        var prom = new Promise(function(resolve, reject){
            console.log('Add a new event');            
            var prompt = require('prompt');
            //prompt.start();
            var schema = schema_objects['add-new'];
            prompt.get(schema, function(err, result){
                if(err){
                    console.log("Failed");
                    return 0;
                }
                var curr = new event_class(misc_func.dateparser(result['Date(dd-mm-yyyy)']), result['Type(Birthday, Anniversary, Event)'], result['Notes'], event_class.recurring_conv(result['Recurring event? (Y/N)']));
                console.log(curr);
                that.res_data = curr;
                resolve();
            })
        }).then(function(){
            var id: number;
            var prom_val = sql_func.insert(Startup.res_data);
            prom_val.then(function(idval){
                sql_func.retrieve_last(idval, mainmenu.mainmenu);
                return;
            })
        })
        
    }
}


