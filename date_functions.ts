class date_fnc{
    public static dateparser(string_val: string): string{
        var basestring: string = "";
        var split_string = string_val.split('/');
        basestring = split_string[2] + split_string[1] + split_string[0];
        return basestring;
    }
    public static reverse_date_parser(string_val): string{
        var basestring: string = "";
        var split_string = string_val.split('/');
        basestring = string_val.slice(0,4) + string_val.slice(5,7) + string_val.slice(8,10);
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
        var orig_string: string = orig_date.getFullYear().toString() + this.single_date_to_double_date((orig_date.getMonth() + 1)) + this.single_date_to_double_date(orig_date.getDate());        
        var week_date: Date = new Date(orig_date.toString());
        week_date.setDate(orig_date.getDate() + 7);
        var week_string: string = week_date.getFullYear().toString() + this.single_date_to_double_date(week_date.getMonth() + 1).toString() + this.single_date_to_double_date(week_date.getDate());
        output_arr.push(orig_string);
        output_arr.push(week_string);
        return output_arr;
    }
    public static date_to_date_string(retrieve_val: Date): string{
        var return_string: string = this.single_date_to_double_date(retrieve_val.getDate()) + "/" + this.single_date_to_double_date(retrieve_val.getMonth() + 1) + "/" + retrieve_val.getFullYear().toString();
        return return_string;
    } 
}
export default date_fnc;