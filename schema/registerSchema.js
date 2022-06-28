
import mongoose from "mongoose"

const registerSchema = new mongoose.Schema({
    userID:String,
    name:String,
    emailId:String,
    mobNo:String,
    password:String,
    shopName:String,
    shopAddress:String,
    color:String,
    dbName:String,
    planExpiryDate:Date
});
const registrationDetails = mongoose.model("registrationDetails", registerSchema);

export default registrationDetails

