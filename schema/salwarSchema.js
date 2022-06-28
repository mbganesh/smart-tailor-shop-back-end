import mongoose from "mongoose"

const salwarSchema = new mongoose.Schema({
    dateTime:Date,
    salwarId:String,
    salwarCost:Object
});
const salwarRateUpdater = mongoose.model("salwarRateUpdater", salwarSchema)

export default salwarRateUpdater