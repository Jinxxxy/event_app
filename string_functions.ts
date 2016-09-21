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
}

export default str_fnc;