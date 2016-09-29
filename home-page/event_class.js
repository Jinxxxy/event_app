define(["require", "exports"], function (require, exports) {
    "use strict";
    class event_class {
        constructor(_date, _type, _notes, _recurring, _id_key) {
            this.date = _date;
            this.type = _type;
            this.notes = _notes;
            this.recurring = _recurring;
            if (_id_key) {
                this.id = _id_key;
            }
        }
        static recurring_conv(answer) {
            if (answer.toUpperCase() === "Y") {
                return 1;
            }
            else {
                return 0;
            }
        }
    }
    exports.event_class = event_class;
    ;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = event_class;
});
//export { event_class}; 
