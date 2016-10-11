import event_class from "./event_class";

class result_object{
    public res_array: Array<event_class> = [];
    public err: string = "";
    public err_flag: boolean = false;
    public record_id: number;
    constructor(
        _res_array?: Array<event_class>,
        _err?: string,
        _err_flag?: boolean,
        _record_id?: number
        ){
            if(_res_array){
                this.res_array = _res_array;
            }
            if(_err){
                this.err = _err;
            }
            if(_err_flag){
                this.err_flag = _err_flag;
            }
            if(_record_id){                
                this.record_id = _record_id;    
            }
    }
}

export default result_object;