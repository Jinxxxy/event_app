import event_class from './event_class';

class output_functions{
    public static print_result_cards(res_arr: Array<event_class>, cb?: Function): void{
        for(var x in res_arr){
            console.log(output_functions.output_event(res_arr[x]));
        }
        if(cb){
            cb();
        }
        return;
    }
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
    public static output_event(selected_item: event_class):string{
        var str_arr: string[] = [];
        var id_string: string = "ID: " + selected_item.id;
        var date_string: string = "Date: " + selected_item.date;
        var type_string: string = "Type: " + selected_item.type;
        var notes_string: string = "Notes: " + selected_item.notes;        
        str_arr.push(id_string, date_string, type_string, notes_string);
        var box_size:number = (misc_func.find_longest_string(str_arr).length + 2);
        var border: string = "---";
        var i: number = 0;
        while(i < box_size){
            border += "-"
            i++;
        }
        var ext_str_arr:string[] = [];
        for(var x in str_arr){
            var out:string = this.string_extender(str_arr[x],box_size);
            ext_str_arr.push(out);
        }
        var final_str = border + "\n";
        for(var x in ext_str_arr){
            final_str += ext_str_arr[x] + "\n"
        }
        final_str += border;       
        return final_str;
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
}
export default output_functions;