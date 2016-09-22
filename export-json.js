"use strict";
const main_menu_1 = require('./main-menu');
class export_to_json {
    static file_content_builder(cls_arr) {
        var pre_json = `
        {\n
          \t"events":{  
        `;
        var building = "";
        for (var event in cls_arr) {
            building += `
            \t\t "` + cls_arr[event].id + `": { 
            \t\t\t"ID": "` + cls_arr[event].id + `",\n
            \t\t\t"Date": "` + cls_arr[event].date + `",\n
            \t\t\t"Type": "` + cls_arr[event].type + `",\n
            \t\t\t"Notes": "` + cls_arr[event].notes + `",\n
            \t\t\t"Recurring": "` + cls_arr[event].recurring + `"\n 
            \t\t },           
            `;
        }
        building = building.slice(0, building.lastIndexOf(","));
        var post_json = `
        \t}
        }    
        `;
        var full_string = pre_json + building + post_json;
        return full_string;
    }
    static export_main(cls_arr) {
        var prom = new Promise(function (resolve, reject) {
            var file_contents = export_to_json.file_content_builder(cls_arr);
            resolve(file_contents);
        }).then(function (file_contents) {
            var fs = require('fs');
            fs.writeFile('./output/output.json', file_contents, function (err) {
                if (err) {
                    throw err;
                }
                console.log("File created");
                return;
            }).then(function () {
                main_menu_1.default.mainmenu();
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = export_to_json;
