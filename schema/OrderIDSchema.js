import mongoose from "mongoose";

const OrderIDSchema = mongoose.Schema({
  orderID: Array,
});

const orderIDArray = mongoose.model("orderIDArray", OrderIDSchema);

export default orderIDArray;
