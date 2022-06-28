import  mongoose from "mongoose";

const shirtSchema = mongoose.Schema({
    dateTime:Date,
    shirtId:String,
    shirtCost:Object

})

const shirtRateUpdater = mongoose.model("shirtRateUpdater", shirtSchema)

export default shirtRateUpdater