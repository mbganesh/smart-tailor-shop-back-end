import mongoose from "mongoose"

const DesignTeamOrderSchema = new mongoose.Schema({
    designTeamOrderIDs: Array,
 

});
const DesignTeamOrderDetails = mongoose.model("DesignTeamOrderDetails", DesignTeamOrderSchema);


export default DesignTeamOrderDetails

