"use strict";
const main_menu_1 = require('./main-menu');
class export_to_html {
    static file_content_builder(cls_arr) {
        var pre_html = `
        <html>
        <head>  
        <style>
            @font-face {
            font-family: 'myFirstFont';
            src: url('typewrite-webfont.woff2') format('woff2'),
                url('typewrite-webfont.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            }
            body{
                background-color: black;
            }
            .event{
                background-color: grey;
                width: 300px;
                height: 175px;
                border: 2px white solid;
                border-radius: 10px;
                font-family:  'myFirstFont';
                text-align: left;
                margin:5px;    
            }
            .inner{
                margin-left: 20px;
            }
            #header{
                margin-left:20px;
            }
        </style>      
        <body>
        `;
        var building = "";
        for (var event in cls_arr) {
            building += `
            <div class="event">                
                <h3 id="header">` + cls_arr[event].notes + `</h3>
                <hr>
                <div class="inner">                
                    <span>Date: ` + cls_arr[event].date + `</span><br>
                    <span>Type: ` + cls_arr[event].type + `</span><br>            
                    <span>ID: ` + cls_arr[event].id + `</span><br>
                </div>              
            </div>
            <br>            
            `;
        }
        var post_html = `
                </body>        
            </head>
        </html>
        `;
        var full_string = pre_html + building + post_html;
        return full_string;
    }
    static export_main(cls_arr) {
        var prom = new Promise(function (resolve, reject) {
            var file_contents = export_to_html.file_content_builder(cls_arr);
            resolve(file_contents);
        }).then(function (file_contents) {
            var fs = require('fs');
            fs.writeFile('output.html', file_contents, function (err) {
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
exports.default = export_to_html;
