const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ContactsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag_arr:[Schema.Types.Mixed]

});
const Contacts=mongoose.model('Contacts',ContactsSchema);
module.exports=Contacts;