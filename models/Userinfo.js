const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserinfoSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    marketing:[Schema.Types.Mixed],
    finance:[Schema.Types.Mixed],
    hr:[Schema.Types.Mixed],
    sports:[Schema.Types.Mixed]

});
const Userinfo=mongoose.model('Userinfo',UserinfoSchema);
module.exports=Userinfo;