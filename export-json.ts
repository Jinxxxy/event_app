import sql_func from './sql_func';
import event_class from './event_class';
import main_menu from './main-menu';
declare function require(name: string);

class export_to_json{
    public static file_content_builder(cls_arr: Array<event_class>): string{
        var pre_json: string = `
        {\n
          \t"events":{  
        `;
        var building: string = "";
        for(var event in cls_arr){
            building += `
            \t\t "` + cls_arr[event].id + `": { 
            \t\t\t"ID": "` + cls_arr[event].id + `",\n
            \t\t\t"Date": "` + cls_arr[event].date + `",\n
            \t\t\t"Type": "` + cls_arr[event].type + `",\n
            \t\t\t"Notes": "` + cls_arr[event].notes + `",\n
            \t\t\t"Recurring": "` + cls_arr[event].recurring + `"\n 
            \t\t },           
            `
        }        
        building = building.slice(0, building.lastIndexOf(","));        
        var post_json: string = `
        \t}
        }    
        `;
        var full_string: string = pre_json + building + post_json;
        return full_string;
    }
    public static export_main(cls_arr: Array<event_class>){
        var prom = new Promise(function(resolve, reject){
            var file_contents: string = export_to_json.file_content_builder(cls_arr);
            resolve(file_contents)
        }).then(function(file_contents){
            var fs = require('fs');
            fs.writeFile('./output/output.json', file_contents, function(err){
                if(err){
                    throw err;
                }
                console.log("File created")
                return;
            }).then(function(){
                //return to mainmenu function
            })
        })
    }
}
export default export_to_json;