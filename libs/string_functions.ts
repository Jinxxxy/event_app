import event_class from "./event_class";
class str_fnc{
    public static string_to_number_bool(str: string): number{
        if(str === "y" || str === "Y"){
            return 1;
        } else {
            return 0;
        }
    }
    public static find_longest_string(str_arr: string[]): string{
        str_arr.sort(function(a,b){
            return b.length - a.length
        })
        return str_arr[0];
    } 
    public static first_letter_to_uppercase(str: string){
        var first_letter = str.slice(0,1).toUpperCase();
        var rest_of_string = str.slice(1, str.length);
        return first_letter + rest_of_string;
    }    
    public static create_json_string(event: event_class){
        
            var json_string = `            
            {
                "event":{
                    "id":"` + event.id + `",\n
                    "date":"` + event.date +`",\n
                    "type":"` + event.type + `",\n
                    "notes":"` + event.notes + `",\n
                    "recurring":"` + event.recurring + `"\n                    
                }
            }
            
            `
            return json_string;        
    }
    public static recurring_number_to_string_option(recurring: string): string{
        if(recurring === "1"){
            return "Yes"
        } else {
            return "No"
        }
    } 
}

export default str_fnc;