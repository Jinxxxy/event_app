import event_class from './event_class.ts'
export default class misc_funct{
    public static console_log(out: any){
        var hor_line: string = "-"
        var i: number = 0;
        while(i <= out.length){
            hor_line += "-"
            i++
        }
        var output_string: string = "|" + out + "|";
        console.log(hor_line);
        console.log(output_string);
        console.log(hor_line);
    }    
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
    public static single_date_to_double_date(_date: number): string {
        var out_date = _date.toString();
        if(out_date.length === 1){
            out_date = "0" + _date;
            return out_date;
        } else {
            return out_date
        }
    }
    public static get_week_date(): string[]{
        var output_arr:string[] = [];
        var orig_date: Date = new Date();        
        var orig_string: string = orig_date.getFullYear().toString() + misc_funct.single_date_to_double_date((orig_date.getMonth() + 1)) + misc_funct.single_date_to_double_date(orig_date.getDate());        
        var week_date: Date = new Date(orig_date.toString());
        week_date.setDate(orig_date.getDate() + 7);
        var week_string: string = week_date.getFullYear().toString() + misc_funct.single_date_to_double_date(week_date.getMonth() + 1).toString() + misc_funct.single_date_to_double_date(week_date.getDate());
        output_arr.push(orig_string);
        output_arr.push(week_string);
        return output_arr;
    }
    public static date_to_date_string(retrieve_val: Date): string{
        var return_string: string = misc_funct.single_date_to_double_date(retrieve_val.getDate()) + "/" + misc_funct.single_date_to_double_date(retrieve_val.getMonth() + 1) + "/" + retrieve_val.getFullYear().toString();
        return return_string;
    }
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
    public static string_extender(str: string, len: number): string{
        str = "| " + str;
        var spacer = "";
        while((str.length + spacer.length) < len + 2){
            spacer += " ";
        }
        str = str + spacer + "|"
        return str;
    }
    public static output_event(selected_item: event_class):string{
        var str_arr: string[] = [];
        var id_string: string = "ID: " + selected_item.id;
        var date_string: string = "Date: " + selected_item.date;
        var type_string: string = "Type: " + selected_item.type;
        var notes_string: string = "Notes: " + selected_item.notes;        
        str_arr.push(id_string, date_string, type_string, notes_string);
        var box_size:number = (misc_funct.find_longest_string(str_arr).length + 2);
        var border: string = "---";
        var i: number = 0;
        while(i < box_size){
            border += "-"
            i++;
        }
        var ext_str_arr:string[] = [];
        for(var x in str_arr){
            var out:string = misc_funct.string_extender(str_arr[x],box_size);
            ext_str_arr.push(out);
        }
        var final_str = border + "\n";
        for(var x in ext_str_arr){
            final_str += ext_str_arr[x] + "\n"
        }
        final_str += border;       
        return final_str;
    }
}