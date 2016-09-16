//var sql_func = require('sql_func');
//Separate out this class. here
var mysql = require('mysql');

var sql_func = (function () {
    function sql_func() {
    }
    sql_func.create_connection = function () {
        var connection = mysql.createConnection({
            host: "localhost",
            port: '3306',
            user: 'root',
            password: 'root'
        });

        return connection;
    };
    sql_func.retrieve = function () {
        var connection = this.create_connection();
        connection.connect();
        connection.query("SELECT * FROM devbox.events_data", function (err, result) {
            if (err) {
                console.log(err);
                connection.end(function (err) {
                });
            } else {
                console.log(result + " - 1");
                connection.end(function (err) {
                });
            }
        });

        return;
    };
    sql_func.insert = function (event) {
        var return_id;
        var connection = this.create_connection();
        var prom = new Promise(function (res, rej) {
            connection.query("insert into devbox.events_data(dateandtime, type, notes, recurring) values('" + event.date + "', '" + event.type + "', \"" + event.notes + '", "' + event.recurring + '");', { title: 'test' }, function (err, result) {
                if (err) {
                    connection.end(function (err) {
                    });
                    throw err;
                } else {
                    connection.end(function (err) {
                    });
                    return_id = result.insertId;
                    console.log(return_id + "Should fire first");
                    res(return_id);
                }
            });
        });
        return prom;
    };
    sql_func.retrieve_last = function (_id) {
        var connection = this.create_connection();
        connection.query("SELECT * FROM devbox.events_data WHERE idkey = '" + _id + "'", { title: 'test' }, function (err, result) {
            if (err) {
                connection.end(function (err) {
                });
                throw err;
            } else {
                connection.end(function (err) {
                });
                console.log(result);
            }
        });
    };
    return sql_func;
})();

//to here
//possible separate class?? here
var event_class = (function () {
    function event_class(_date, _type, _notes, _recurring) {
        this.date = _date;
        this.type = _type;
        this.notes = _notes;
        this.recurring = _recurring;
    }
    event_class.recurring_conv = function (answer) {
        if (answer.toUpperCase() === "Y") {
            return 1;
        } else {
            return 0;
        }
    };
    return event_class;
})();
;

// to here
var misc_funct = (function () {
    function misc_funct() {
    }
    misc_funct.string_builder = function (item) {
        var start_string = "{ \n";
        var basestring = "";
        for (var x in item) {
            basestring = basestring + "\t" + "\"" + x + "\"" + ":" + "\"" + item[x] + "\"" + ", \n";
        }
        var end_string = "\n}";
        basestring = basestring.slice(0, (basestring.length - 3));
        return start_string + basestring + end_string;
    };
    misc_funct.dateparser = function (string_val) {
        var basestring = "";
        var split_string = string_val.split('/');
        basestring = split_string[2] + split_string[1] + split_string[0];
        return basestring;
    };
    return misc_funct;
})();

var prompt_func = (function () {
    function prompt_func() {
    }
    prompt_func.create_schema = function () {
        var schema = {
            properties: {
                'Date(dd-mm-yyyy)': {
                    pattern: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
                    message: 'Please enter date as dd/mm/yyyy',
                    required: true
                },
                'Type(Birthday, Anniversary, Event)': {
                    pattern: 'birthday|anniversary|event',
                    message: 'Please enter either "birthday","anniversay" or "event"',
                    required: true
                },
                'Notes': {
                    pattern: /^[a-zA-Z0-9 ]{0,1000}$/,
                    message: 'Only letters numbers and spaces can be used. Must be no more than 1000 characters',
                    required: true
                },
                'Recurring event? (Y/N)': {
                    pattern: /y|Y|n|N/,
                    message: 'Only y / n are accepted',
                    required: true
                }
            }
        };
        return schema;
    };
    return prompt_func;
})();

var view_func = (function () {
    function view_func() {
    }
    view_func.view_today = function () {
        var connection = sql_func.create_connection();
        connection.query("");
    };
    return view_func;
})();

var Startup = (function () {
    function Startup() {
    }
    Startup.write_file = function (item_string) {
        var fs = require('fs');
        fs.writeFile("test.json", item_string, 'UTF-8', function () {
        });
    };
    Startup.main = function () {
        var that = this;
        var prom = new Promise(function (resolve, reject) {
            console.log('Hello World Programm');
            var prompt = require('prompt');

            prompt.start();
            prompt.get(prompt_func.create_schema(), function (err, result) {
                if (err) {
                    console.log("Failed");
                    return 0;
                }
                var curr = new event_class(misc_funct.dateparser(result['Date(dd-mm-yyyy)']), result['Type(Birthday, Anniversary, Event)'], result['Notes'], event_class.recurring_conv(result['Recurring event? (Y/N)']));
                console.log(curr);
                that.res_data = curr;
                resolve();
            });
        }).then(function () {
            var id;
            var prom_val = sql_func.insert(Startup.res_data);
            prom_val.then(function (idval) {
                sql_func.retrieve_last(idval);
            });
        }).then(function (value) {
        });
    };
    return Startup;
})();

Startup.main();
