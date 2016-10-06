import sql_func from './sql_func';
import event_class from './event_class';
declare function require(name: string);

class export_to_xml{
    public static file_content_builder(cls_arr: Array<event_class>): string{
        var pre_xml: string = `<events>\r\n`;
        var building: string = "";
        for(var event in cls_arr){
            building +=`
    <` + cls_arr[event].id + `>\r\n
        <ID>` + cls_arr[event].id + `</ID>\r\n
        <Date>` + cls_arr[event].date + `</Date>\r\n
        <Type>` + cls_arr[event].type + `</Type>\r\n
        <Notes>` + cls_arr[event].notes + `</Notes>\r\n
        <Recurring>` + cls_arr[event].recurring + `</Recurring>\r\n\n\n
    </` + cls_arr[event].id + `>\r\n\n`
        }        
        building = building.slice(0, building.lastIndexOf(","));        
        var post_xml: string = 
        `</events>`;
        var full_string: string = pre_xml + building + post_xml;
        return full_string;
    }
    public static export_main(cls_arr: Array<event_class>){
        var prom = new Promise(function(resolve, reject){
            var file_contents: string = export_to_xml.file_content_builder(cls_arr);
            resolve(file_contents)
        }).then(function(file_contents){
            var fs = require('fs');
            fs.writeFile('./output/output.xml', file_contents, function(err){
                if(err){
                    throw err;
                }
                console.log("File created")
                return;
            }).then(function(){
                //Take function call back to main program
                //main_menu.mainmenu();
            })
        })
    }
}
export default export_to_xml;