
declare function require(name: string);
require("amd-loader");
var http = require('http'); 
var url = require('url');
import event_class from './event_class'
import sql_func from 'C:/Development/node/events_cli/sql_func'
var querystring = require('querystring');
class parse_string{
    private pre_string;
    constructor(_string:string){
        this.pre_string = _string;
    }
    public static replace_vals(x: string):string{
        
        while(x.indexOf("%20") >= 0){
            x = x.replace("%20", "");
        } 
        while(x.indexOf("%22") >= 0){
            x = x.replace("%22","\"");    
        }
        while(x.indexOf("%7B") >= 0){
            x = x.replace("%7B", "\{");
        }
        while(x.indexOf("%7D") >=0){
            x = x.replace("%7D", "\}")
        }
        x = x.slice(1, x.length);
        console.log("replace vals")
        console.log(x);
        return x;
    }
    public static obj_to_class(obj:any): event_class{
        var cls = new event_class(
            obj.event['date'],
            obj.event['type'],
            obj.event['notes'],
            obj.event['recurring']
        )
        return cls;
    }
}

var create = http.createServer(function(req, res){ 
    if(
        req.url.indexOf("date") !== -1 &&
        req.url.indexOf("notes") !== -1 &&
        req.url.indexOf("type") !== -1 &&
        req.url.indexOf("recurring") !== -1        
      ){
        var parsed_string: string = parse_string.replace_vals(req.url);
        var obj = JSON.parse(parsed_string);
        var ev_cls: event_class = parse_string.obj_to_class(obj)
        console.log(ev_cls);
        sql_func.insert(ev_cls);
        res.writeHead(200, {"content-type":"text/plain"});    
        res.end("TEST");      
      } else {
          res.writeHead(200, {"content-type":"text/plain"});
          res.end("Bad Request");
      }
    
}).listen(3000);
console.log("Server Ready");