import mongoose from 'mongoose'

const emailSchema = new mongoose.Schema({
    fromUsername:String,
    fromPassword:String,
    toUsername:String
});

const emailDetails = mongoose.model("emailCreational",emailSchema);

export default emailDetails