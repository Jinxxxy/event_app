

///<reference path="C:\Development\node\events_cli\require.d.ts" />
///<reference path="C:\Development\node\events_cli\event_class.ts" />
require("amd-loader");
var http = require('http'); 
var url = require('url');
var querystring = require('querystring');    
import event_class from './../event_class'
import sql_func from './../sql_func'
import result_class from './../result_class';
import query_builders from './../query-builders';
import json_export from './../export-json';
import html_export from './../export-html';
import xml_export from './../export-xml';

class parse_string{
    private pre_string;
    constructor(_string:string){
        this.pre_string = _string;
    }
    public static replace_vals(x: string):string{
        var output: string = x;
        while(output.indexOf("%20") >= 0){
            output = output.replace("%20", "");
        } 
        while(output.indexOf("%22") >= 0){
            output = output.replace("%22","\"");    
        }
        while(output.indexOf("%7B") >= 0){
            output = output.replace("%7B", "\{");
        }
        while(output.indexOf("%7D") >=0){
            output = output.replace("%7D", "\}")
        }
        output = output = output.replace("/", "");
        return output;
    }
    public static obj_to_class(obj:any): event_class[]{
        var cls_arr: Array<event_class> = [];
        for(var item in obj){
            var cls = new event_class(
            obj.event['date'],
            obj.event['type'],
            obj.event['notes'],
            obj.event['recurring']
            )    
            cls_arr.push(cls);
        }
        
        return cls_arr;
    }
    public static get_results(query: string):Promise<result_class>{        
        var day_prom: Promise<result_class> = sql_func.general_query(query);
        return day_prom;
    }
    public static parse_to_comp_value(url_string:string): string{
        var export_string = url_string.slice(url_string.lastIndexOf("//==//"), url_string.length);          
        var export_comparison_val: string = export_string.split("//==//")[1].replace("***","");
        return export_comparison_val;        
    }    
    public static get_time_from_url(url_sting: string): string{
        var working_string: string = "";
        working_string = url_sting.slice(4, url_sting.indexOf("::"));
        console.log("WS: " + working_string + "\n" + url_sting.indexOf("***" + 2).toString() + "\n" + url_sting.indexOf("::"));
        
        return working_string;
    }
    public static get_time_function(time: string): Function{
        var target:string = time;
        switch (target) {
        case "DAY":
        return query_builders.day_query_builder;
        case "WEEK":
        return query_builders.week_query_builder;
        case "MONTH":
        return query_builders.month_query_builder;
        case "ALL":
        return query_builders.all_query_builder;
        }
        
    }
    public static server_export_function(export_type: string, export_time:string): Promise<string>{
        var query_function: Function = parse_string.get_time_function(export_time);
        var server_export_prom: Promise<string> = new Promise(function(resolve, reject){
            switch(export_type){
              case "JSON":
              var export_json_prom: Promise<result_class> = sql_func.general_query(query_function())
              export_json_prom.then(function(res_cls){
              var export_json_output_string: string = json_export.file_content_builder(res_cls.res_array)  
              resolve(export_json_output_string)            
              })
              break;
              case "HTML":
              var export_html_prom: Promise<result_class> = sql_func.general_query(query_function())
              export_html_prom.then(function(res_cls){
              var export_html_output_string: string = html_export.file_content_builder(res_cls.res_array)
              resolve(export_html_output_string)              
              })
              break;
              case "XML":
              var export_xml_prom: Promise<result_class> = sql_func.general_query(query_function())
              export_xml_prom.then(function(res_cls){
              var export_xml_output_string: string = json_export.file_content_builder(res_cls.res_array)
              resolve(export_xml_output_string)              
              })              
          }          
        }) 
        return server_export_prom;       
        
    }
}


var create = http.createServer(function(req, res){ 
    console.log(req.url);
    if(
        req.url.indexOf("date") !== -1 &&
        req.url.indexOf("notes") !== -1 &&
        req.url.indexOf("type") !== -1 &&
        req.url.indexOf("recurring") !== -1        
      ){
        console.log(querystring.escape(req.url))
        var parsed_string: string = parse_string.replace_vals(req.url);        
        var obj = JSON.parse(parsed_string);
        var ev_cls: event_class[] = parse_string.obj_to_class(obj)
        console.log(ev_cls);
        var prom: Promise<result_class> = sql_func.insert(ev_cls[0]);
        prom.then(function(srv_res){            
            if(srv_res.record_id === -1){
                res.writeHead(200, {"content-type":"text/plain"})
                res.end("Unable to create record. Please try again. \n Error Code: " + srv_res.err);
            } else if (srv_res.record_id !== -1){
                res.writeHead(200, {"content-type":"text/plain"});    
                res.end("Record created. \nID: " + srv_res.record_id);     
            }
               
        })
              
      } else if (req.url.indexOf("QUERY") !== -1) {
          var query_string = req.url.slice(req.url.indexOf("QUERY="), req.url.length);
          console.log("QS=" + query_string);
          var comparison_val: string = parse_string.replace_vals(query_string);
          switch(comparison_val){
              case "QUERY=\"SELECTDAY\"": 
              console.log("CASE: QUERY=\"SELECTDAY\"")                           
              var day_prom: Promise<result_class> = parse_string.get_results(query_builders.day_query_builder());
              
              day_prom.then(function(res_obj){
                                  
                 if(res_obj.err_flag === true){
                      console.log("err " + res_obj.err);
                      return
                  } else {
                      if(res_obj.err.indexOf("No results to return. Please check parameters") !== -1){
                          return("No results to return. Please check parameters");
                      } else {
                          var response_content: string = json_export.file_content_builder((res_obj.res_array))                          
                          return(response_content);   
                      }                                            
                  }
              }).then(function(res_body){
                  console.log(JSON.stringify(res_body));                      
                      res.writeHead(200, {"content-type":"text/plain"});                      
                      res.end(JSON.stringify(res_body));
              })
              break;
              case "QUERY=\"SELECTWEEK\"":
              var week_prom: Promise<result_class> = parse_string.get_results(query_builders.week_query_builder());
              week_prom.then(function(res_obj){                
                 if(res_obj.err_flag === true){
                      console.log("err " + res_obj.err);
                      return
                  } else {
                      if(res_obj.err.indexOf("No results to return. Please check parameters") !== -1){
                          return("***No results to return***. Please check parameters");
                      } else {
                          var response_content: string = json_export.file_content_builder((res_obj.res_array))                          
                          return(response_content);   
                      }                                            
                  }
              }).then(function(res_body){
                  console.log(JSON.stringify(res_body));                      
                      res.writeHead(200, {"content-type":"text/plain"});                      
                      res.end(JSON.stringify(res_body));
              })
              break;
              case "QUERY=\"SELECTMONTH\"":
              var month_prom: Promise<result_class> = parse_string.get_results(query_builders.month_query_builder());
              month_prom.then(function(res_obj){                
                 if(res_obj.err_flag === true){
                      console.log("err" + res_obj.err);
                  } else {                      
                      var response_content: string = json_export.file_content_builder((res_obj.res_array))                      
                      res.writeHead(200, {"content-type":"text/plain"});                      
                      res.end(response_content);
                  }
              })
              break;
              case "QUERY=\"SELECTALL\"":
              var all_prom: Promise<result_class> = parse_string.get_results("SELECT * FROM devbox.events_data ORDER BY dateandtime asc");
              all_prom.then(function(res_obj){                
                 if(res_obj.err_flag === true){
                      console.log(res_obj.err);
                  } else {                      
                      var response_content: string = json_export.file_content_builder((res_obj.res_array))                      
                      res.writeHead(200, {"content-type":"text/plain"});                      
                      res.end(response_content);
                  }
              })
              break;            
          }
      } else if(req.url.indexOf("EXPORT//==//") !== -1){     
          var export_time_comparision_val: string = parse_string.get_time_from_url(req.url);
          var export_type_comparison_val: string = parse_string.parse_to_comp_value(req.url);
          var export_data_prom = parse_string.server_export_function(export_type_comparison_val, export_time_comparision_val);
          export_data_prom.then(function(export_data){
              
              res.writeHead(200, {"content-type":"application/JSON"});                      
              res.end(export_data);
          })
                          
          
      } else {
          res.writeHead(200, {"content-type":"text/plain"});
          res.end("Bad Request");
      }
    
}).listen(3000);
console.log("Server Ready");