import mongoose from "mongoose"

var orderSchema = mongoose.Schema(
    {
        "orderID": String,
        "orderDate": Date,
        "name": String,
        "mobNo": String,
        "deliveryDate": Date,
        "orderStatus": String,
        "salwarCount": Number,
        "blouseCount": Number,
        "shirtCount": Number,
        "pantCount": Number,
        "salwarData": Array,
        "blouseData": Array,
        "shirtData": Array,
        "pantData": Array,
        "gst": Boolean,
        "cusId": String,
        "cusColor": String,
        "allInfoCompletionStatus": Boolean,
        "finalAmount": Number,
        "dcStatus": Boolean,
        "dcAmount":Number,
        "payAmount":Number,
        "grandTotal":Number,
        "fullPaymentReceived":Boolean

    }
)

const OrderSchema = mongoose.model("OrderDetails", orderSchema);


export default OrderSchema
