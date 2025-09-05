import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: { type: String, required: true }, 
  city: { type: String, required: true },   
  state: { type: String },                  
  zipCode: { type: String },                
  country: { type: String, default: "India" } ,
  landmark: {type:String,}
}, { timestamps: true });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String }, 
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    image: { type: String }, 
    DateOfBirth: { type: Date }, 
    addresses: [addressSchema],

    // 2FA fields
    otp: { type: String }, // Store OTP
    otpExpiry: { type: Date }, // Expiry time for OTP
    isVerified: { type: Boolean, default: false }, // Optional: track email verification
  },
  { timestamps: true }
);



export default mongoose.model("User", userSchema);
