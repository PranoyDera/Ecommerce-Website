import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,},
    password: { type: String, required: true, minlength: 6 },
    phone: {type: String},
    gender: {type:String},
    image:{type:String},
    DateOfBirth: { type: Date }, 
},{
    timestamps:true
}
);

export default mongoose.model("Admin",adminSchema);