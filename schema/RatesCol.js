import mongoose from "mongoose"

const RatesColSchema = new mongoose.Schema({
    user     : String,
    rateId    : String,
    dateTime     : String,
    salwarCost     : Object,
    blouseCost     : Object
});
const RatesColDetails = mongoose.model("RatesColDetails", RatesColSchema);

export default RatesColDetails

