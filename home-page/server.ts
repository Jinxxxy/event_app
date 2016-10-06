

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
        console.log(obj);
        for(var item in obj){
            if(obj.event['id']){
                var cls = new event_class(
                obj.event['date'],
                obj.event['type'],
                obj.event['notes'],
                obj.event['recurring'],
                obj.event['id']            
            )
            } else {
                var cls = new event_class(
                obj.event['date'],
                obj.event['type'],
                obj.event['notes'],
                obj.event['recurring']            
            )    
            }
            
                
            cls_arr.push(cls);
        }
        console.log(cls_arr);
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
        
        
        return working_string;
    }
    public static get_id_from_url(url_string: string){
        return url_string.split("EDIT-GET::")[1].replace("***","");
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
    public static update_function(update_data: string): Promise<string>{
        console.log(update_data)
        var update_prom: Promise<string> = new Promise(function(resolve, reject){
            resolve(sql_func.update_event(query_builders.update_query_builder(parse_string.obj_to_class(JSON.parse(update_data.replace("***","")))[0])))
        })
        return update_prom;
    }
    public static server_export_function(export_type: string, export_time:string): Promise<string>{
        var query_function: Function = parse_string.get_time_function(export_time);
        var server_export_prom: Promise<string> = new Promise(function(resolve, reject){
            switch(export_type){
              case "JSON":
              var export_json_prom: Promise<result_class> = sql_func.general_query(query_function())
              export_json_prom.then(function(res_cls){
              var export_json_output_string: string = json_export.file_content_builder(res_cls.res_array)
              console.log(export_json_output_string);
              if(res_cls.res_array.length >= 1){
                  console.log("Resolving")

                  resolve(export_json_output_string);    
              } else {
                  console.log("Rejecting");
                  reject("**//No Results");
              }            
              })
              break;
              case "HTML":
              var export_html_prom: Promise<result_class> = sql_func.general_query(query_function())
              export_html_prom.then(function(res_cls){
              var export_html_output_string: string = html_export.file_content_builder(res_cls.res_array)
              if(res_cls.res_array.length >= 1){
                  resolve(export_html_output_string);    
              } else {
                  reject("**//No Results");
              }              
              })
              break;
              case "XML":
              var export_xml_prom: Promise<result_class> = sql_func.general_query(query_function())
              export_xml_prom.then(function(res_cls){
              var export_xml_output_string: string = xml_export.file_content_builder(res_cls.res_array)
              if(res_cls.res_array.length >= 1){
                  resolve(export_xml_output_string);    
              } else {
                  reject("**//No Results");
              }              
              })              
          }          
        }) 
        return server_export_prom;       
        
    }
}


var create = http.createServer(function(req, res){ 
    if(req.url.indexOf("***ADD-NEW:://") !== -1){
        var parsed_string: string = parse_string.replace_vals(req.url).replace("***ADD-NEW:://","");        
        var obj = JSON.parse(parsed_string);
        var ev_cls: event_class[] = parse_string.obj_to_class(obj)
        var prom: Promise<result_class> = sql_func.insert(ev_cls[0]);
        prom.then(function(srv_res){            
            if(srv_res.record_id === -1){
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200, {"content-type":"text/plain"})
                res.end("Unable to create record. Please try again. \n Error Code: " + srv_res.err);
            } else if (srv_res.record_id !== -1){
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200, {"content-type":"text/plain"});    
                res.end("Record created. \nID: " + srv_res.record_id);     
            }
               
        })
              
      } else if (req.url.indexOf("QUERY") !== -1) {
          var query_string = req.url.slice(req.url.indexOf("QUERY="), req.url.length);
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
                      if(res_obj.err.indexOf("**//No Results") !== -1){
                          return("No results to return. Please check parameters");
                      } else {
                          var response_content: string = json_export.file_content_builder((res_obj.res_array))                          
                          return(response_content);   
                      }                                            
                  }
              }).then(function(res_body){
                  res.setHeader("Access-Control-Allow-Origin", "*");                      
                      res.writeHead(200, {"content-type":"text/plain"});                      
                      res.end(JSON.stringify(res_body));
              })
              break;
              case "QUERY=\"SELECTWEEK\"":
              var week_prom: Promise<result_class> = parse_string.get_results(query_builders.week_query_builder());
              week_prom.then(function(res_obj){                
                 if(res_obj.err_flag === true){
                      console.log("err " + res_obj.err);
                      return("***No results to return***. Something went wrong with your request.")
                  } else {
                      if(res_obj.err.indexOf("**//No Results") !== -1){
                          return("***No results to return***. Please check parameters");
                      } else {
                          var response_content: string = json_export.file_content_builder((res_obj.res_array))                          
                          return(response_content);   
                      }                                            
                  }
              }).then(function(res_body){
                  res.setHeader("Access-Control-Allow-Origin", "*");                      
                res.writeHead(200, {"content-type":"text/plain"});                      
                res.end(JSON.stringify(res_body));
              })
              break;
              case "QUERY=\"SELECTMONTH\"":
              var month_prom: Promise<result_class> = parse_string.get_results(query_builders.month_query_builder());
              month_prom.then(function(res_obj){                
                 if(res_obj.err_flag === true){
                      console.log("err " + res_obj.err);
                      return
                  } else {
                      if(res_obj.err.indexOf("**//No Results") !== -1){
                          return("***No results to return***. Please check parameters");
                      } else {
                          var response_content: string = json_export.file_content_builder((res_obj.res_array))                          
                          return(response_content);   
                      }                                            
                  }
              }).then(function(res_body){
                  res.setHeader("Access-Control-Allow-Origin", "*");                      
                      res.writeHead(200, {"content-type":"text/plain"});                      
                      res.end(JSON.stringify(res_body));
              })
              break;
              case "QUERY=\"SELECTALL\"":
              var all_prom: Promise<result_class> = parse_string.get_results("SELECT * FROM devbox.events_data");
              all_prom.then(function(res_obj){                
                 if(res_obj.err_flag === true){
                      console.log("err " + res_obj.err);
                      return("***No results to return***. Something went wrong with your request");
                  } else {
                      if(res_obj.err.indexOf("**//No Results") !== -1){
                          return("***No results to return***. Please check parameters");
                      } else {
                          var response_content: string = json_export.file_content_builder((res_obj.res_array))                          
                          return(response_content);   
                      }                                            
                  }
              }).then(function(res_body){
                      res.setHeader("Access-Control-Allow-Origin", "*");                      
                      res.writeHead(200, {"content-type":"text/plain"});                      
                      res.end(JSON.stringify(res_body));
              })
              break;            
          }
      } else if(req.url.indexOf("EXPORT//==//") !== -1){     
          var export_time_comparision_val: string = parse_string.get_time_from_url(req.url);
          var export_type_comparison_val: string = parse_string.parse_to_comp_value(req.url);
          var export_data_prom = parse_string.server_export_function(export_type_comparison_val, export_time_comparision_val);
          export_data_prom.then(function(export_data){
              console.log("Export Output")
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.writeHead(200, {"content-type":"text/plain"});                     
              res.end(export_data);
          }).catch(function(){              
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.writeHead(200, {"content-type":"text/plain"});                    
              res.end("**//No Results");
          })
                          
          
      } else if(req.url.indexOf("***EDIT-GET::") !== -1){
          console.log(parse_string.get_id_from_url(req.url))
          var query_id: string = parse_string.get_id_from_url(req.url);
          var get_by_id_prom: Promise<result_class> = parse_string.get_results("SELECT * FROM devbox.events_data WHERE idkey = " + query_id + ";");+
          get_by_id_prom.then(function(res_cls){
              if(res_cls.res_array.length === 0){
                  return ("**//No Results")
              } else {
                  var data_to_send: string = json_export.file_content_builder(res_cls.res_array);
                  return (data_to_send);
              }
          }).then(function(response_data){
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.writeHead(200, {"content-type":"text/plain"});                      
              res.end(JSON.stringify(response_data));
          })
      } else if(req.url.indexOf("***UPDATE:://") !== -1){
          console.log("UPDATE");
          var data_to_send: string = parse_string.replace_vals(req.url.replace("***UPDATE:://",""));
          var update_prom: Promise<string> = parse_string.update_function(data_to_send);
          update_prom.then(function(message_string){
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.writeHead(200, {"content-type":"text/plain"});    
              res.end("Record created. \nID: " + message_string); 
          })
      } else {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.writeHead(200, {"content-type":"text/plain"});
          res.end("Bad Request");
      }
    
}).listen(3000);
console.log("Server Ready");