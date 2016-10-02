declare function require(name: string);
import event_class from './event_class'
import date_functions from './date_functions'
var mysql = require('mysql');
import result_class from './result_class'
export default class sql_func{
       
    public static result_to_array(result_arr: any, cb?: Function): Array<event_class>{
        
        var output_arr: Array<Object> = [];
        var class_arr: Array<event_class> = [];
        if(Object.keys(result_arr).length    > 0){
            for(var x in result_arr){
                output_arr.push(result_arr[x])
                var date_var = date_functions.date_to_date_string(result_arr[x]['dateandtime']); 
                var tmp_cls = new event_class(
                    date_var,
                    result_arr[x]['type'],
                    result_arr[x]['notes'],
                    result_arr[x]['recurring'],
                    result_arr[x]['idkey']
                )
                class_arr.push(tmp_cls);
            }
            return class_arr;
        } else if(Object.keys(result_arr).length === 0) {
            console.log("No results to return. Please check parameters");
            var empty_array: event_class[] = [];
            return empty_array;
        } else {
            console.log("Something went wront, please restart");
        }
    }
    public static create_connection(): any{
        var connection = mysql.createConnection({
            host: "127.0.0.1",
            port: '3306',
            user: 'root',
            password: 'root'
        });
        
        return connection;
    }  
    public static retrieve_by_date(date: string, cb?: Function): Promise<Array<event_class>>{
        var connection = this.create_connection();
        var prom = new Promise(function(resolve, reject){
            connection.query("SELECT * FROM devbox.events_data WHERE dateandtime = " + date + " ;", function(err, results){                
                console.log("Results: " + Object.keys(results).length + " entries for the specified date");
                var cls_arr: Array<event_class> = sql_func.result_to_array(results);
                resolve(cls_arr)
                
            })
        })
        return prom;
        ;
    }        
    public static insert(event: event_class): Promise<result_class> {
        var return_id: number;
        var connection = this.create_connection();
        var prom = new Promise(function(res, rej){
            connection.query("insert into devbox.events_data(dateandtime, type, notes, recurring) values('" + event.date + "', '" + event.type + "', \"" + event.notes + '", "' + event.recurring + '");', {title: 'test'}, function(err, result) {
                if (err){
                    connection.end(function(err){
                        
                    });
                    var res_obj: result_class = new result_class([], err.message, true, -1);
                    res(res_obj);              
                } else {                
                    connection.end(function(err){});
                    return_id = result.insertId;
                    var res_obj: result_class = new result_class([], "", false, return_id)
                    res(res_obj)                           
                }  
                         
            })
        })
        return prom         
               
    }    
    public static retrieve_last(_id: number, cb?: Function){
        var connection = this.create_connection();
        connection.query("SELECT * FROM devbox.events_data WHERE idkey = '" + _id + "'", {title: 'test'}, function(err, result){
            if(err){                                 
                connection.end(function(err){});
                throw err;
            } else {                            
                connection.end(function(err){});                
                if(cb){
                    cb();
                }
                return;                
            }
        })
    }
    public static general_query(query: string): Promise<result_class>{
        var connection = this.create_connection();
        var output: Array<event_class> = [];
        var prom = new Promise(function(resolve, reject){
            connection.query(query, function(err, result){
                console.log("connection-loaded")
                if(err){
                    var err_obj: result_class = new result_class([], err.message, true, -1);
                    resolve(err_obj);                
                    console.log(err)                    
                } else {                                        
                    var output: Array<event_class> = sql_func.result_to_array(result);
                    if(output.length === 0){
                        var no_res_obj: result_class = new result_class([], "No results to return. Please check parameters", false)
                        resolve(no_res_obj);
                    } else {
                        var ret_obj: result_class = new result_class(output, "", false);
                        resolve(ret_obj);
                    }
                                                     
                }                
            })
        })
        return prom;
        
        
    }    
    public static update_event(upd_string: string): Promise<string>{
         var conn = sql_func.create_connection();
         var prom = new Promise(function(resolve, reject){
            conn.query(upd_string, function(err, result){
             if(err){
                 throw err;
             } else {
                 resolve(result['message']);                     
             }
             
         })    
      })
      return prom;         
    }
    public static void_return_query(query: string): Promise<string>{
        var conn = sql_func.create_connection();
        var prom = new Promise(function(resolve, reject){
            conn.query(query, function(err, result){
                if(err){
                    resolve(result);
                } else {
                    resolve(result)
                }               
            })    
        })
        return prom;
        
    }
}