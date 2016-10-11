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
    public static schema_objects = {
    'add-new':{
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
}
}