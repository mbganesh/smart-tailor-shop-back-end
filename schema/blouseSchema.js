import mongoose from "mongoose"

const blouseSchema = new mongoose.Schema({
    dateTime:Date,
    blouseId:String,
    blouseCost:Object
});
const blouseRateUpdater = mongoose.model("blouseRateUpdater", blouseSchema)

export default blouseRateUpdater