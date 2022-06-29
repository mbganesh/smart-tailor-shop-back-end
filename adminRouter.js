import "dotenv/config";
import express from "express";
import generateUniqueId from "generate-unique-id";
import salwarSchema from "./schema/salwarSchema.js";
import blouseSchema from "./schema/blouseSchema.js";
import userCreationalSchema from "./schema/userCreationalSchema.js";
import emailDetailSchema from "./schema/emailCreationalSchema.js";
import shirtSchema from "./schema/shirtSchema.js";
import pantSchema from "./schema/pantSchema.js";
import mongoose from "mongoose";
import randomColor from "randomcolor";

import registerSchema from "./schema/registerSchema.js";

import jwt from "jsonwebtoken";

const TOKEN_KEY = "STONER";

const router = express.Router();
router.use(express.json());

var Admin = mongoose.mongo.Admin;

router.get("/", (req, res) => {
  res.json("admin router works");
});

router.post("/getAllDataBase", async (req, res) => {
  var requestData = req.body;
  let dbName = requestData.username.split("@")[0] + "SmartTailorShopDB";
  try {
    mongoose.disconnect();

    var allDBNames = [];

    var dataToRes = [];

    let mongoURL = "mongodb://localhost/" + dbName;

    var connection = await mongoose.createConnection(mongoURL);

    const temp = await connection.on("open", function () {
      new Admin(connection.db).listDatabases(async function (err, result) {
        var allDatabases = result.databases.map((item, index) => {
          return item.name;
        });

        for (let i = 0; i < allDatabases.length; i++) {
          if (allDatabases[i].split("SmartTailorShopDB").length === 2) {
            allDBNames.push(
              allDatabases[i].split("SmartTailorShopDB")[0] +
                "SmartTailorShopDB"
            );
          }
        }

        for (let i = 0; i < allDBNames.length; i++) {
          let url = "mongodb://localhost/" + allDBNames[i];
          connection.close();
          const db = await mongoose.connect(url);
          const omit = { emailId: 1, _id: 0, name: 1, planExpiryDate: 1,suspendUser:1 };
          let foundData = await registerSchema.findOne({}, omit);
          dataToRes.push(foundData);
          db.disconnect();
        }

        var pageNo = req.body.pageNo; // 2
        let size = req.body.pageSize; // 5
        var lastPos = 0;
        var startPos = 0;
        for (let i = 1; i <= pageNo; i++) {
          lastPos = i * size;
        }

        startPos = lastPos - size;

        console.log(`Start Position -> ${startPos}`);
        console.log(`Last Position -> ${lastPos}`);
        console.log(`Total Data : ${allDatabases.length}`);

        var tempStore = [];

        for (let i = startPos; i < lastPos; i++) {
          if (dataToRes[i] === undefined || dataToRes[i] === null) {
            continue;
          }
          tempStore.push(dataToRes[i]);
        }

        console.log(`Response Data Count -> ${tempStore.length}`);

        // var allStudentData = await studentModal
        // .find(searchFilter, { _id: 0, __v: 0 })
        // .skip(skips)
        // .limit(size)
        // .lean();

        console.log(requestData);

        return res.json({
          success: true,
          data: tempStore,
          count: allDBNames.length,
        });
      });
    });
  } catch (error) {
    // console.log(error + "ddd");
    return res.json({ success: false, message: "Server Down" });
  }
});

router.post("/deleteDB", async (req, res) => {
  mongoose.disconnect();
  var dbName = req.body.username.split("@")[0];
  const url = `mongodb://localhost/${dbName}SmartTailorShopDB`;
  await mongoose.connect(url);

  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });

  mongoose.connection.dropDatabase().then(async () => {
    try {
      mongoose.connection.close();
      return res.json({
        success: true,
        message: "Database Deleted Successfully.",
      });
    } catch (err) {
      console.log(err);
      return res.json({ success: true, message: "Unable to Delete databse" });
    }
  });
});

router.post("/updateExpiryDate", async (req, res) => {
  try {
    mongoose.disconnect();
    var requestData = req.body;
    let dbName = requestData.username.split("@")[0];
    const url = `mongodb://localhost/${dbName}SmartTailorShopDB`;
    await mongoose.connect(url);
    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
    });
    console.log(requestData);
    await registerSchema.findOneAndUpdate(
      { emailId: requestData.username },
      { planExpiryDate: requestData.planExpiryDate }
    );
    return res.json({ success: true, message: "Expiry Date Updated" });
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: "Invalid Date and Time Format." });
  }
});

router.post("/suspendUser", async (req, res) => {
  try {
    mongoose.disconnect();
    var requestData = req.body;

    let dbName = requestData.username.split("@")[0];
    const url = `mongodb://localhost/${dbName}SmartTailorShopDB`;
    console.log(requestData);
    await mongoose.connect(url);

    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
    });

    console.log(requestData);

    await registerSchema.findOneAndUpdate(
      { emailId: requestData.username },
      { suspendUser: requestData.suspendUser }
    );

    if(requestData.suspendUser){  // if true as res
      return res.json({ success: true, message: "User Suspended" });
    }else{
      return res.json({ success: true, message: "Suspend Removed" });
    }

    
  } catch (error) {
    return res.json({ success: false, message: "Unable to Update." });
  }
});

export default router;

/**
 * 
 * router.post("/getAllDataBase", async (req, res) => {
  var requestData = req.body;
  let dbName = requestData.username.split("@")[0] + "SmartTailorShopDB";
  try {
    mongoose.disconnect();

    var allDBNames = [];

    var dataToRes = [];

    let mongoURL = "mongodb://localhost/" + dbName;

    var connection = await mongoose.createConnection(mongoURL);

    const temp = await connection.on("open", function () {
      new Admin(connection.db).listDatabases(async function (err, result) {
        var allDatabases = result.databases.map((item, index) => {
          return item.name;
        });
        

        for (let i = 0; i < allDatabases.length; i++) {
          // console.log(allDatabases[i].split('SmartTailorShopDB'));
          if (allDatabases[i].split("SmartTailorShopDB").length === 2) {
            allDBNames.push(
              allDatabases[i].split("SmartTailorShopDB")[0] +
                "SmartTailorShopDB"
            );
          }
        }

        for (let i = 0; i < allDBNames.length; i++) {
          let url = "mongodb://localhost/" + allDBNames[i];
          console.log(url);
          console.log(connection.models);
          connection.close();
          const db = await mongoose.connect(url);
          const omit = { emailId: 1, _id: 0, name: 1 };
          let foundData = await registerSchema.findOne({}, omit);
          dataToRes.push(foundData);
          console.log(dataToRes);
          db.disconnect();
        }

        var pageNo = req.body.pageNo;
        let size = req.body.pageSize;
        var result = 0;
        for (let i = 1; i <= pageNo; i++) {
          result = i * size;
        }

        var skips = dataToRes.length - result;
        if (skips <= 0) {
          size = size + skips;
          skips = 0;
        }

        console.log(`result`, result);
        console.log(`skips -> start`, skips);
        console.log(`size -> end`, size);

        for (let i = 0; i < dataToRes.length; i++) {}

        // var allStudentData = await studentModal
        // .find(searchFilter, { _id: 0, __v: 0 })
        // .skip(skips)
        // .limit(size)
        // .lean();

        return res.json({
          success: true,
          data: dataToRes,
          size: dataToRes.length,
        });
      });
    });
  } catch (error) {
    console.log(error + "ddd");
    return res.json({ success: false, message: "Server Down" });
  }
});

 */
