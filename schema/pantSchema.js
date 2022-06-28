import  mongoose from "mongoose";

const pantSchema = mongoose.Schema({
    dateTime:Date,
    pantId:String,
    pantCost:Object

})

const pantRateUpdater = mongoose.model("pantRateUpdater", pantSchema)

export default pantRateUpdater