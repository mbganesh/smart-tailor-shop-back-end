import 'dotenv/config'
import express from "express";
import generateUniqueId from "generate-unique-id";
import salwarSchema from "./schema/salwarSchema.js";
import blouseSchema from "./schema/blouseSchema.js";
import userCreationalSchema from "./schema/userCreationalSchema.js";
import emailDetailSchema from "./schema/emailCreationalSchema.js";
import shirtSchema from "./schema/shirtSchema.js";
import pantSchema from "./schema/pantSchema.js";
import mongoose from "mongoose"
import randomColor from "randomcolor";

import registerSchema from "./schema/registerSchema.js";

import jwt from 'jsonwebtoken'


const TOKEN_KEY = "STONER"

const router = express.Router()
router.use(express.json());

var Admin = mongoose.mongo.Admin

let cdate = new Date();

let userCreationalfun = async (req, res) => {
    let loginData = [{ username: "admin", password: "123" }, { username: "user", password: "321" },];
    let findLogin = await userCreationalSchema.find({}).lean();
    for (let i in loginData) {
        if (findLogin.length === 0) {
            let addLogin = await userCreationalSchema.insertMany({ username: loginData[i]["username"], password: loginData[i]["password"], });
        } else {
            return;
        }
    }
};

let rateSalwarInitial = async (req, res) => {
    let salwarData = [{
        dateTime: cdate, salwarId: "sal" + generateUniqueId({ length: 4, useLetters: false }), salwarCost:
            { Basic: 790, "With Lining": 100, "Without Lining": 0, "Piping - Neck": 360, "Piping - Neck Sleeve": 460, Pocket: 30, Rope: 30, Zip: 50, "With Elastic": 75 }
    }];
    let findSalwarData = await salwarSchema.find({}).lean();

    for (let i in salwarData) {
        if (findSalwarData.length === 0) {
            let addSalwar = await salwarSchema.insertMany(salwarData[i]);
        } else {
            return;
        }
    }
};

let rateBlouseInitial = async (req, res) => {
    let blouseData = [
        {
            dateTime: cdate,
            blouseId: "blo" + generateUniqueId({ length: 4, useLetters: false }),
            blouseCost: {
                Basic: 500,
                "With Lining": 150,
                "Without Lining": 0,
                Rope: 30,
                Zip: 75,
                "Piping - Neck": 250,
                "Piping - Neck Sleeve": 350,
                "Double Piping - Neck Sleeve": 450,
                "Trible Piping - Neck Sleeve": 550,
                "Straight Cut": 0,
                "Cross Cut": 0,
                "Katori Cut": 290,
                "Boat Neck": 290,
                "Princess Neck": 290,
            },
        },
    ];
    let findBlouseData = await blouseSchema.find({}).lean();

    for (let i in blouseData) {
        if (findBlouseData.length === 0) {
            let addblouse = await blouseSchema.insertMany(blouseData[i]);
        } else {
            return;
        }
    }
};

let rateShirtInitial = async (req, res) => {
    let shirtData = [
        {
            dateTime: cdate,
            shirtId: "shi" + generateUniqueId({ length: 4, useLetters: false }),
            shirtCost: {
                Basic: 300,
            },
        },
    ];
    let findShirtData = await shirtSchema.find({}).lean();

    for (let i in shirtData) {
        if (findShirtData.length === 0) {
            let addShirt = await shirtSchema.insertMany(shirtData[i]);
        } else {
            return;
        }
    }
};

let ratePantInitial = async (req, res) => {
    let pantData = [{ dateTime: cdate, pantId: "Pan" + generateUniqueId({ length: 4, useLetters: false }), pantCost: { Basic: 500 } }];
    let findPantData = await pantSchema.find({}).lean();

    for (let i in pantData) {
        if (findPantData.length === 0) {
            let addPant = await pantSchema.insertMany(pantData[i]);
        }
        else {
            return;
        }
    }
};

let email = async (req, res) => {
    let findEmail = await emailDetailSchema.find({}).lean();
    if (findEmail.length === 0) {
        let getpassword = await emailDetailSchema.find({});

        console.log(getpassword);
        let emailDetails = await emailDetailSchema.insertMany({
            fromUsername: "netcom.steven@gmail.com",
            fromPassword: "Netcom123",
            toUsername: "development@ncpli.com",
        });
    } else {
        let getpassword = await emailDetailSchema.find({});

        // console.log(getpassword[0].fromPassword);
        return;
    }
};


router.post('/login', async (req, res) => {
    console.log("login")
    var requestData = req.body
    let dbName = requestData.username.split('@')[0] + 'SmartTailorShopDB'
    try {
        mongoose.disconnect()

        var isExists = false
        let mongoURL = 'mongodb://localhost/' + dbName

        var connection = await mongoose.createConnection(mongoURL);
       
        const temp = await connection.on('open', function () {
            new Admin(connection.db).listDatabases(async function (err, result) {
                var allDatabases = result.databases.map((item, index) => { return item.name });
                console.log('Is Includes :' + allDatabases.includes(dbName))

                if (allDatabases.includes(dbName)) {
                    console.log(connection.models)
                    connection.close()
                    const db = await mongoose.connect(mongoURL)
                    const filter = { "emailId": requestData.username, "password": requestData.password }
                    const omit = { _id: 0, __v: 0 }
                    let foundData = await registerSchema.find(filter, omit)
                    const date = new Date().toISOString()

                    const myArray = date.split("T");
                    let currentDate = myArray[0]

                    let expiryDate = foundData[0].planExpiryDate.toISOString()
                    const myArray1 = expiryDate.split("T");
                    let planExpiryDate = myArray1[0]

                  
                    if (foundData.length === 1) {

                        if (planExpiryDate >= currentDate) {

                            let token = jwt.sign({ userData: foundData[0] }, TOKEN_KEY, { expiresIn: '2h' })

                            console.log({ userData: foundData[0] })

                            return res.json({ 'success': true, message: 'Welcome', token })
                        }
                        else {
                           
                            return res.json({ 'success': true, message: 'plan expired' })

                        }
                    }
                    else {
                        return res.json({ 'success': false, message: 'Invalid Email/ Password' })
                    }
                } else {
                    return res.json({ 'success': false, message: 'Invalid Email/ Password' })
                }
            });

        });
        console.log("temp")

        return isExists
    } catch (error) {
        console.log(error + "ddd")
        return res.json({ 'success': false, message: 'Server Down' })
    }

})



router.post('/register', async (req, res) => {

    try {
        mongoose.disconnect()
        var requestData = req.body
        let dbName = requestData.emailId.split("@")[0] + 'SmartTailorShopDB'
        let userID = "userID-" + generateUniqueId({ length: 8, useLetters: false })
        let date = new Date()


        var numberOfDaysToAdd = 10;
        var result = date.setDate(date.getDate() + numberOfDaysToAdd);
        const planExpiryDate = new Date(result).toISOString()

        requestData['userID'] = userID
        requestData['dbName'] = dbName
        requestData['color'] = randomColor({ luminosity: 'dark', hue: 'random' })
        requestData['planExpiryDate'] = planExpiryDate
        requestData['suspendUser'] = false

        let obj = await createCustomDB(dbName, requestData)
        console.log(obj);
        return res.json(obj)
    } catch (error) {
        console.log(error)
        return res.json({ 'success': false, message: 'Server Down' })
    }

})


async function createCustomDB(name, requestData) {

    try {

        let mongoURL = 'mongodb://localhost/' + name
        const db = await mongoose.connect(mongoURL)
        let foundLength = (await registerSchema.find({})).length
        console.log(foundLength);
        if (foundLength === 1) {
            db.disconnect()
            return { success: false, message: 'Email ID Already Exists' }
        }
        await registerSchema.insertMany(requestData)
        await userCreationalfun();
        await email();
        await rateSalwarInitial();
        await rateBlouseInitial();
        await rateShirtInitial();
        await ratePantInitial();
        db.disconnect()
        return { success: true, message: 'Registration Success.Enjoy Using Smart Tailor Shop :)' }
    }
    catch (error) {
        console.log(error);
        return { success: false, message: 'Server Down...' }
    }

}



export default router