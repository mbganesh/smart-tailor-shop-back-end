import mongoose from "mongoose"

const customerSchema = new mongoose.Schema({
    cusDate     :Date,
    cusName     : String,
    cusEmail     : String,
    cusMobNo     : String,
    cusAddress     : String,
    cusId    : String,
    cusColor: String
});
const CustomerDetails = mongoose.model("CustomerDetails", customerSchema);


export default CustomerDetails

