
    export class event_class{
    
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
        
        constructor(_date: string, _type: string, _notes: string, _recurring: number, _id_key?: number){
            this.date = _date;
            this.type = _type;
            this.notes = _notes;
            this.recurring = _recurring;
            if(_id_key){
                this.id = _id_key; 
            }
        }   
    };   

export default event_class;
//export { event_class};