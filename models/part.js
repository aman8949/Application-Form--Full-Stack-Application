const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const Part=new Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    rType:{
        type:String,
        required:true
    },
    tickets:{
        type:Number,
        required:true
    },
    userPhoto:{
        data:Buffer,
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});
module.exports=mongoose.model("Part",Part);