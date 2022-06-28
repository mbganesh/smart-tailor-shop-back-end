import mongoose from 'mongoose'

var schema = mongoose.Schema({
    userID:String,
    name:String,
    emailId:String,
    mobNo:String,
    password:String,
    shopName:String,
    shopAddress:String,
    color:String,
    dbName:String
})


export default schema