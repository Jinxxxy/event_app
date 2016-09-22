"use strict";
const main_menu_1 = require('./main-menu');
class export_to_xml {
    static file_content_builder(cls_arr) {
        var pre_xml = `<events>\r\n`;
        var building = "";
        for (var event in cls_arr) {
            building +=
                `<` + cls_arr[event].id + `>\r\n 
            <ID>` + cls_arr[event].id + `</ID>\r\n 
            <Date>` + cls_arr[event].date + `</Date>\r\n 
            <Type>` + cls_arr[event].type + `</Type>\r\n 
            <Notes>` + cls_arr[event].notes + `</Notes>\r\n 
            <Recurring>` + cls_arr[event].recurring + `<\Recurring>\r\n  
            </` + cls_arr[event].id + `>\r\n`;
        }
        building = building.slice(0, building.lastIndexOf(","));
        var post_xml = `</events>`;
        var full_string = pre_xml + building + post_xml;
        return full_string;
    }
    static export_main(cls_arr) {
        var prom = new Promise(function (resolve, reject) {
            var file_contents = export_to_xml.file_content_builder(cls_arr);
            resolve(file_contents);
        }).then(function (file_contents) {
            var fs = require('fs');
            fs.writeFile('./output/output.xml', file_contents, function (err) {
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
exports.default = export_to_xml;
