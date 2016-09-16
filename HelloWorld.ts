
declare function require(name: string);
//var sql_func = require('sql_func');

//Separate out this class. here
var mysql = require('mysql');

class sql_func{    
    public static create_connection(){
        var connection = mysql.createConnection({
            host: "localhost",
            port: '3306',
            user: 'root',
            password: 'root'
        });
        
        return connection;
    }    
    public static retrieve(){        
        var connection = this.create_connection();        
        connection.connect();        
        connection.query("SELECT * FROM devbox.events_data", function(err, result){
            if(err){
                console.log(err);                
                connection.end(function(err){});
            } else {
                console.log(result + " - 1");
                connection.end(function(err){});    
            }            
        })
        
        return;               
    }    
    public static insert(event: event_class): Promise<number> {
        var return_id: number;
        var connection = this.create_connection();
        var prom = new Promise(function(res, rej){
            connection.query("insert into devbox.events_data(dateandtime, type, notes, recurring) values('" + event.date + "', '" + event.type + "', \"" + event.notes + '", "' + event.recurring + '");', {title: 'test'}, function(err, result) {
                if (err){
                    connection.end(function(err){});
                    throw err;               
                } else {                
                    connection.end(function(err){});
                    return_id = result.insertId;
                    console.log(return_id + "Should fire first");
                    res(return_id)                           
                }  
                         
            })
        })
        return prom         
               
    }    
    public static retrieve_last(_id: number){
        var connection = this.create_connection();
        connection.query("SELECT * FROM devbox.events_data WHERE idkey = '" + _id + "'", {title: 'test'}, function(err, result){
            if(err){                                 
                connection.end(function(err){});
                throw err;
            } else {                            
                connection.end(function(err){});
                console.log(result);
            }
        })
    }
}
//to here

//possible separate class?? here
class event_class{
    public id: number;
    public date: string;
    public type: string;
    public notes: string;
    public recurring: number;
    
    public static recurring_conv(answer: string): number{
        if(answer.toUpperCase() === "Y"){
            return 1;
        } else{
            return 0;
        }                
    }
    
    constructor(_date: string, _type: string, _notes: string, _recurring: number){
        this.date = _date;
        this.type = _type;
        this.notes = _notes;
        this.recurring = _recurring;
    }   
};  
// to here

class misc_funct{
    public static string_builder(item: event_class): string{
        var start_string: string = "{ \n";
        var basestring: string = "";
        for(var x in item){
            basestring = basestring + "\t" + "\"" + x + "\"" + ":" + "\"" + item[x] + "\"" + ", \n";            
        }
        var end_string: string = "\n}"        
        basestring = basestring.slice(0, (basestring.length - 3));
        return start_string + basestring + end_string;
    }
    public static dateparser(string_val: string): string{
        var basestring: string = "";
        var split_string = string_val.split('/');
        basestring = split_string[2] + split_string[1] + split_string[0];
        return basestring;
    }
}

class prompt_func{
    public static create_schema(): any{
        var schema = {
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
            return schema;
    }   
}

class view_func{
    public static view_today(){
        var connection = sql_func.create_connection();
        connection.query("")
    }
}

class Startup {
    public static res_data: event_class;
    public static built_string: string;
    public static id: number;
        
    public static write_file(item_string: string){
        var fs = require('fs');
        fs.writeFile("test.json", item_string, 'UTF-8', function(){})
    }    
    public static main() {
        var that = this;
        var prom = new Promise(function(resolve, reject){
            console.log('Hello World Programm');
            var prompt = require('prompt');
            
            prompt.start();        
            prompt.get(prompt_func.create_schema(), function(err, result){
                if(err){
                    console.log("Failed");
                    return 0;
                }
                var curr = new event_class(misc_funct.dateparser(result['Date(dd-mm-yyyy)']), result['Type(Birthday, Anniversary, Event)'], result['Notes'], event_class.recurring_conv(result['Recurring event? (Y/N)']));
                console.log(curr);
                that.res_data = curr;
                resolve();
            })
        }).then(function(){
            var id: number;
            var prom_val = sql_func.insert(Startup.res_data);
            prom_val.then(function(idval){
                sql_func.retrieve_last(idval)
            })
        }).then(function(value){
        })
        
    }
}

Startup.main();

