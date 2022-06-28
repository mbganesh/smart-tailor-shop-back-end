import express from "express";
import generateUniqueId from "generate-unique-id";
import randomColor from "randomcolor";
import nodemailer from "nodemailer";
import CustomerSchema from "./schema/CustomerSchema.js";
import addOrderSchema from "./schema/addOrderSchema.js";
import CustomerDetails from "./schema/CustomerSchema.js";
import salwarSchema from "./schema/salwarSchema.js";
import blouseSchema from "./schema/blouseSchema.js";
import DesignTeamOrderDetails from "./schema/DesignTeamOrderSchema.js";
import userCreationalSchema from "./schema/userCreationalSchema.js";
import emailDetailSchema from "./schema/emailCreationalSchema.js";
import shirtSchema from "./schema/shirtSchema.js";
import pantSchema from "./schema/pantSchema.js";
import orderIDSchema from "./schema/OrderIDSchema.js";
import s3Methods from "./s3.js";

import mongoose from "mongoose"


const router = express.Router();

router.use(express.json());

let cdate = new Date();
let currentyear = cdate.getUTCFullYear();

var tenDays = new Date(new Date().getTime() + 11 * 24 * 60 * 60 * 1000);
let currentDate = cdate.toISOString();
let myDate1 = tenDays.toISOString();
let nextTenthDay = myDate1.split("T")[0];
let currentDateSplit = currentDate.split("T")[0];
let todayDate = currentDateSplit + "T00:00:00.000+00:00";
let nextTenDays = nextTenthDay + "T00:00:00.000+00:00";
console.log(nextTenDays);
var myDate = new Date("2022-03-12");

let personNames = (orderlist) => {
  let salwarPersons = [];
  let blousePersons = [];
  let shirtPersons = [];
  let pantPersons = [];

  for (let i in orderlist) {

    let sd = orderlist[i]["salwarData"];
    for (let j in sd) {
      salwarPersons.push(sd[j]["personName"]);
      salwarPersons = salwarPersons.filter((e, i, a) => a.indexOf(e) === i); //removes duplicate in array
    }

    let bd = orderlist[i]["blouseData"];
    for (let j in bd) {
      blousePersons.push(bd[j]["personName"]);
      blousePersons = blousePersons.filter((e, i, a) => a.indexOf(e) === i);
    }

    let shd = orderlist[i]["shirtData"];
    for (let j in shd) {
      shirtPersons.push(shd[j]["personName"]);
      shirtPersons = shirtPersons.filter((e, i, a) => a.indexOf(e) === i);
    }

    let pd = orderlist[i]["pantData"];
    for (let j in pd) {
      pantPersons.push(pd[j]["personName"]);
      pantPersons = pantPersons.filter((e, i, a) => a.indexOf(e) === i);
    }

    salwarPersons = salwarPersons.filter((e) => e !== undefined); //remove undefined in array
    blousePersons = blousePersons.filter((e) => e !== undefined);
    shirtPersons = shirtPersons.filter((e) => e !== undefined);
    pantPersons = pantPersons.filter((e) => e !== undefined);
  }
  let salwarPersonObj = { ["salwarPersons"]: salwarPersons };
  let blousePersonObj = { ["blousePersons"]: blousePersons };
  let shirtPersonObj = { ["shirtPersons"]: shirtPersons };
  let pantPersonObj = { ["pantPersons"]: pantPersons };

  return [salwarPersonObj, blousePersonObj, shirtPersonObj, pantPersonObj];
};

router.post("/lastTenDays", async (req, res) => {
  console.log("lastTenDays");
  let temp = await addOrderSchema.find({});
});

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

    console.log(getpassword[0].fromPassword);
    return;
  }
};

let updateOrderDataFromDesignTeam = (stitchedImageSB, Data, OrderIdName) => {
  let updatedData = [];

  for (let j in stitchedImageSB) {
    let DressIdSB = stitchedImageSB[j]["DressID"];
    for (let i in Data) {
      console.log(Data[i][OrderIdName]);
      if (Data[i][OrderIdName] === DressIdSB) {
        console.log("enter if");
        Data[i]["stichedDressImage"] = stitchedImageSB[j]["stichedDressImage"];
        Data[i]["stichedDressImageName"] =
          stitchedImageSB[j]["stichedDressImageName"];
      }
    }
  }

  return Data;
};

userCreationalfun();
email();
rateSalwarInitial();
rateBlouseInitial();
rateShirtInitial();
ratePantInitial();

router.post("/resetUserCreational", async (req, res) => {
  console.log("resetUserCreational");
  if (req.body.user === "admin") {
    let updatepassword = await userCreationalSchema.updateOne(
      { username: req.body.username },
      { $set: { password: req.body.password } }
    );
    return res.json({ success: true, message: updatepassword });
  } else {
    return res.json({ success: false, message: [] });
  }
});

router.post("/email", async (req, res) => {
  console.log("email");
  let randomNumbers = generateUniqueId({ length: 4, useLetters: false });
  let emailUpdate = await emailDetailSchema.find({});
  if (req.body.user === "admin") {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUpdate[0].fromUsername,
        pass: emailUpdate[0].fromPassword,
      },
    });
    var mailOptions = {
      from: emailUpdate[0].fromUsername,
      to: emailUpdate[0].toUsername,
      subject: "OTP from KOMALA Creations",
      html:
        " <p style='font-size:1.1em'>Hi,</p>  <p>Your OTP Verification Code for Resetting Password</p> <h2 style='background: #000000;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px'>" +
        randomNumbers +
        "</h2><p style='font-size:0.9em'>Regards,<br />Komala Creations</p> ",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({ success: false, message: "OTP not Sen" });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ success: true, message: randomNumbers });
      }
    });
  }
});

router.post("/login", async (req, res) => {
  console.log("login");
  if (req.body.user === "admin") {
    let login = await userCreationalSchema.find({
      $and: [{ username: req.body.username }, { password: req.body.password }],
    });
    if (login.length === 1) {
      if (req.body.username === "admin") {
        return res.json({ success: true, message: "Shop Owner" });
      } else if (req.body.username === "user") {
        return res.json({ success: true, message: "Designing Team" });
      }
    } else {
      return res.json({ success: false, message: "" });
    }
  } else {
    return res.json({ success: false, message: "" });
  }
});

router.post("/allCustomerData", async (req, res) => {
  console.log("allCustomerData");
  if (req.body.user === "admin") {
    try {
      var results = await CustomerSchema.find({}, { _id: 0, __v: 0 }).lean();

      if (results.length != 0) {
        var temp = {};
        var tempArr = [];
        for (let i in results) {
          let mobNo = results[i]["cusMobNo"];
          let orderDataforNo = await addOrderSchema
            .find(
              { mobNo: mobNo },
              { blouseData: 0, salwarData: 0, _id: 0, __v: 0 }
            )
            .lean();
          if (orderDataforNo.length != 0) {
            for (let j in orderDataforNo) {
              var salwarCountNo = orderDataforNo[j].salwarCount;
              var blouseCountNo = orderDataforNo[j].blouseCount;
              var finalAmount = orderDataforNo[j].finalAmount;
              temp["cusMobNo"] = mobNo;
              temp["salwarCount"] = salwarCountNo;
              temp["blouseCount"] = blouseCountNo;
              temp["finalAmount"] = finalAmount;
              tempArr.push(temp);
              temp = {};
            }
          }
        }
        let obj = {};
        tempArr.forEach((item) => {
          if (obj[item.cusMobNo]) {
            obj[item.cusMobNo].salwarCount =
              obj[item.cusMobNo].salwarCount + item.salwarCount;
            obj[item.cusMobNo].blouseCount =
              obj[item.cusMobNo].blouseCount + item.blouseCount;
            obj[item.cusMobNo].finalAmount =
              obj[item.cusMobNo].finalAmount + item.finalAmount;
          } else {
            obj[item.cusMobNo] = item;
          }
        });
        let valuesArr = Object.values(obj);
        let merge = results.map((t1) => ({
          ...t1,
          ...valuesArr.find((t2) => t2.cusMobNo === t1.cusMobNo),
        }));
        const addSBF = merge.map((v) => ({
          ...v,
          salwarCount: 0,
          blouseCount: 0,
          finalAmount: 0,
        }));
        let merge1 = addSBF.map((t1) => ({
          ...t1,
          ...valuesArr.find((t2) => t2.cusMobNo === t1.cusMobNo),
        }));

        var wantKeys = ["cusId", "cusName", "cusMobNo", "finalAmount"];

        var result = merge1.map((obj) => Object.fromEntries(wantKeys.map((key) => obj.hasOwnProperty(key) && [key, obj[key]])));

        var top10 = result.sort(function (a, b) { return a.finalAmount < b.finalAmount ? 1 : -1; }).slice(0, 10);

        return res.json({ success: true, message: merge1, top10Customer: top10, });
      } else {
        return res.json({ success: "false", message: [] });
      }
    } catch (e) {
      return res.json({ success: "false", message: [] });
    }
  } else {
    return res.json({ success: "false", message: [] });
  }
});


let mongoDBConnect=async(username)=>
{
  mongoose.disconnect()

  let dbName = username.split('@')[0] + 'SmartTailorShopDB'

  let mongoURL = 'mongodb://localhost/' + dbName

  const db = await mongoose.connect(mongoURL)

}


router.post("/getAllCustomerData", async (req, res) => {
  console.log("getAllCustomerData");



  
  try {

    await mongoDBConnect(req.body.username)



 
    var pageNo = req.body.page;
    let size = req.body.size;

    var result2 = 0;
    for (let i = 1; i <= pageNo; i++) {
      result2 = i * size;
    }
    var totalCustomerCount = await CustomerSchema.count();

    var skips = totalCustomerCount - result2;

    if (skips <= 0) {
      size = size + skips;
      skips = 0;
    }
    console.log(req.body)
    var results = []

    if (req.body.searchQuery === "") {
      results = await CustomerSchema.find({}, { _id: 0, __v: 0 }).limit(size).skip(skips).lean();
    }
    else if (req.body.searchQuery !== "") {
      console.log(req.body)
      var fieldName = req.body.field
      var searchValue = '\\b' + req.body.searchQuery + '[a-zA-Z0-9]*'
      console.log(searchValue)

      if (pageNo > 1) {
        var newSkips = 0;
        newSkips = ((pageNo) - 1) * size

        console.log(newSkips)

        results = await CustomerSchema.find({ [fieldName]: { $regex: searchValue, $options: "i" } }).limit(size).skip(newSkips).lean()
      }
      else {
        results = await CustomerSchema.find({ [fieldName]: { $regex: searchValue, $options: "i" } }).limit(size).lean()
      }


      totalCustomerCount = (await CustomerSchema.find({ [fieldName]: { $regex: searchValue, $options: "i" } }).lean()).length

    }



    if (results.length != 0) {
      var temp = {};
      var tempArr = [];
      for (let i in results) {
        let mobNo = results[i]["cusMobNo"];
        let orderDataforNo = await addOrderSchema
          .find(
            { mobNo: mobNo },
            { blouseData: 0, salwarData: 0, _id: 0, __v: 0 }
          )
          .lean();
        if (orderDataforNo.length != 0) {
          for (let j in orderDataforNo) {
            var salwarCountNo = orderDataforNo[j].salwarCount;
            var blouseCountNo = orderDataforNo[j].blouseCount;
            var finalAmount = orderDataforNo[j].finalAmount;
            temp["cusMobNo"] = mobNo;
            temp["salwarCount"] = salwarCountNo;
            temp["blouseCount"] = blouseCountNo;
            temp["finalAmount"] = finalAmount;
            tempArr.push(temp);
            temp = {};
          }
        }
      }
      let obj = {};
      tempArr.forEach((item) => {
        if (obj[item.cusMobNo]) {
          obj[item.cusMobNo].salwarCount =
            obj[item.cusMobNo].salwarCount + item.salwarCount;
          obj[item.cusMobNo].blouseCount =
            obj[item.cusMobNo].blouseCount + item.blouseCount;
          obj[item.cusMobNo].finalAmount =
            obj[item.cusMobNo].finalAmount + item.finalAmount;
        } else {
          obj[item.cusMobNo] = item;
        }
      });
      let valuesArr = Object.values(obj);
      let merge = results.map((t1) => ({
        ...t1,
        ...valuesArr.find((t2) => t2.cusMobNo === t1.cusMobNo),
      }));
      const addSBF = merge.map((v) => ({
        ...v,
        salwarCount: 0,
        blouseCount: 0,
        finalAmount: 0,
      }));
      let merge1 = addSBF.map((t1) => ({
        ...t1,
        ...valuesArr.find((t2) => t2.cusMobNo === t1.cusMobNo),
      }));

      var wantKeys = ["cusId", "cusName", "cusMobNo", "finalAmount"];

      var result = merge1.map((obj) =>
        Object.fromEntries(
          wantKeys.map((key) => obj.hasOwnProperty(key) && [key, obj[key]])
        )
      );

      var top10 = result.sort(function (a, b) { return a.finalAmount < b.finalAmount ? 1 : -1; }).slice(0, 10);

      return res.json({ success: true, message: merge1, top10Customer: top10, totalCustomerCount: totalCustomerCount, });
    } else {
      return res.json({ success: "false", message: [] });
    }
  } catch (e) {
    return res.json({ success: "catchfalse", message: [] });
  }

});




// dataToSend = {user:"admin", searchQuery: searchQuery, field:"CustomerName"}
router.post("/searchCustomerData", async (req, res) => {
  var search = req.body.searchQuery;

  console.log(req.body)
  return res.json({
    success: true,
    searchedData: searchedData
  });


});

router.post("/designingTeamEdit", async (req, res) => {
  console.log("designingTeamEdit");
  var dataImGet = req.body;

  if (req.body.user === "admin") {
    var updateDelieveryStaus = [];
    var id = await dataImGet["orderID"];
    var mobNo = dataImGet["mobNo"];

    try {
      updateDelieveryStaus = await addOrderSchema.findOne({
        orderID: req.body.orderID,
      });
    } catch (err) {
      updateDelieveryStaus = [];
    }

    let foundObjectFullDate = dataImGet["orderDate"];

    let newFoundObjectFullDate = new Date(foundObjectFullDate);

    if (myDate < newFoundObjectFullDate) {
      let stitchedSalwarImageArr = dataImGet["stitchedSalwarImage"];
      let stitchedBlouseImageArr = dataImGet["stitchedBlouseImage"];

      let orderID = dataImGet["orderID"];
      var DBOrderIDDataArr = await addOrderSchema.find({ orderID: orderID });

      let DBOrderIDDataObj = DBOrderIDDataArr[0];
      let prevDBOrderIDDataObj = JSON.parse(
        JSON.stringify(DBOrderIDDataArr[0])
      );

      var d = {};
      var arr = [];

      for (let i = 0; i < stitchedSalwarImageArr.length; i++) {
        d = stitchedSalwarImageArr[i];

        if (d["DressID"] === DBOrderIDDataObj.salwarData[i]["salwarOrderId"]) {
          if (d.stichedDressImageName !== "" && d.stichedDressImage !== "") {
            DBOrderIDDataObj.salwarData[i]["stichedDressImageName"] =
              d.stichedDressImageName;
            DBOrderIDDataObj.salwarData[i]["stichedDressImage"] =
              d.stichedDressImage;
          }
        }
        delete d["DressID"];
      }

      for (let i = 0; i < stitchedBlouseImageArr.length; i++) {
        d = stitchedBlouseImageArr[i];

        if (d["DressID"] === DBOrderIDDataObj.blouseData[i]["blouseOrderId"]) {
          if (d.stichedDressImageName !== "" && d.stichedDressImage !== "") {
            DBOrderIDDataObj.blouseData[i]["stichedDressImageName"] =
              d.stichedDressImageName;
            DBOrderIDDataObj.blouseData[i]["stichedDressImage"] =
              d.stichedDressImage;
          }
        }
        delete d["DressID"];
      }

      DBOrderIDDataObj["orderStatus"] = dataImGet["orderStatus"];

      DBOrderIDDataObj = await imageToS3Transporter(
        DBOrderIDDataObj,
        prevDBOrderIDDataObj,
        "salwarData",
        "salwarOrderId",
        "stichedDressImageName",
        "stichedDressImage"
      );
      DBOrderIDDataObj = await imageToS3Transporter(
        DBOrderIDDataObj,
        prevDBOrderIDDataObj,
        "blouseData",
        "blouseOrderId",
        "stichedDressImageName",
        "stichedDressImage"
      );

      insertFunction(DBOrderIDDataObj, id, mobNo, res);
    } else if (myDate > newFoundObjectFullDate) {
      console.log("elseif");

      var stitchedSalwarImage = req.body.stitchedSalwarImage;
      var stitchedBlouseImage = req.body.stitchedBlouseImage;
      let salwarData = updateDelieveryStaus.salwarData;

      salwarData = updateOrderDataFromDesignTeam(
        stitchedSalwarImage,
        salwarData,
        "salwarOrderId"
      );

      let blouseData = updateDelieveryStaus.blouseData;
      blouseData = updateOrderDataFromDesignTeam(
        stitchedBlouseImage,
        blouseData,
        "blouseOrderId"
      );

      var updateDB = await addOrderSchema.updateMany({ orderID: req.body.orderID }, { $set: { salwarData: salwarData, blouseData: blouseData, orderStatus: req.body.orderStatus }, });

      if (updateDB.matchedCount === 1) {
        return res.json({ success: true, message: "DataStored" });
      } else {
        return res.json({ success: false, message: "Not updated" });
      }
    }
  }
});

router.post("/updateVerify", async (req, res) => {
  console.log("updateVerify");
  const data = req.body;

  var foundUser = await CustomerDetails.findOne({ cusId: data.cusId });
  if (data.user === "admin") {
    if (foundUser.cusMobNo === data.cusMobNo) {
      await addOrderSchema.updateMany(
        { cusId: data.cusId },
        { $set: { name: data.cusName, mobNo: data.cusMobNo } }
      );
      var updateSameMobNo = await CustomerDetails.findOneAndUpdate(
        { cusId: data.cusId },
        data
      );
      return res.json({ sucess: true, message: "updated" });
    } else if (foundUser.cusMobNo !== data.cusMobNo) {
      var id = await CustomerDetails.findOne({ cusId: data.cusId });
      var MobNo = await CustomerDetails.find({ cusMobNo: data.cusMobNo });
      var mobLength = MobNo.length;

      if (mobLength === 1) {
        return res.json({ sucess: true, message: "MobileNumberExists" });
      } else if (id !== null) {
        await addOrderSchema.updateMany(
          { cusId: data.cusId },
          { $set: { name: data.cusName, mobNo: data.cusMobNo } }
        );
        var updateMobNo = await CustomerDetails.findOneAndUpdate(
          { cusId: data.cusId },
          data
        );
        return res.json({ sucess: true, message: "updated" });
      } else if (id === null) {
        await addOrderSchema.updateMany(
          { cusId: data.cusId },
          { $set: { name: data.cusName, mobNo: data.cusMobNo } }
        );
        var updateMobNo = await CustomerDetails.findOneAndUpdate(
          { cusId: data.cusId },
          data
        );

        return res.json({ sucess: true, message: "updated" });
      }
    }
  }
});

router.post("/getCustomerData", async (req, res) => {
  console.log("getCustomerData");
  var user = req.body.user;
  await mongoDBConnect(req.body.username)
  try {
    var results = await CustomerSchema.findOne(
      { cusMobNo: req.body.cusMobNo },
      { _v: 0, _id: 0 }
    ).lean();

    var orderlist = await addOrderSchema.find({ mobNo: results.cusMobNo });
    let temp = personNames(orderlist);
    console.log(temp);
    let salwarPersonObj = temp[0];
    let blousePersonObj = temp[1];
    let shirtPersonObj = temp[2];
    let pantPersonObj = temp[3];
    var meregeObj = Object.assign(
      salwarPersonObj,
      results,
      blousePersonObj,
      shirtPersonObj,
      pantPersonObj
    );
    return res.json({ success: true, message: meregeObj });
  } catch (err) {
    return res.json({ success: false, message: [] });
  }

});

router.post("/getMeasurementDataForPerson", async (req, res) => {
  console.log("getMeasurementDataForPerson");
  if (req.body.user === "admin") {
    const specificCustomerData = await addOrderSchema
      .find({ mobNo: req.body.mobNo })
      .sort({ date: -1 });

    console.log(req.body);

    let haveItemsSalwar = [
      "Shoulder Size",
      "Shoulder Width",
      "Breast Circum",
      "Breast Size",
      "Hip",
      "Waist",
      "Arm Hole",
      "Arm Length",
      "Arm Circum",
      "Neck F",
      "Neck B",
      "Full Length",
      "Ankle",
      "Pant Length",
      "Side Slit",
    ];
    let haveItemsBlouse = [
      "Shoulder Size",
      "Shoulder Width",
      "Breast Circum",
      "Breast Size",
      "Hip",
      "Waist",
      "Arm Hole",
      "Arm Length",
      "Arm Circum",
      "Neck F",
      "Neck B",
      "Full Length",
      "Back Length",
    ];

    var haveItemsShirt = [
      "Shirt Length",
      "Shoulder",
      "Sleeve Length",
      "Sleeve Open",
      "Chest Width",
      "Collar Length",
      "Pocket Down",
    ];
    var haveItemsPant = [
      "Pant Length",
      "Hip",
      "Inseam",
      "Seat",
      "Thigh Loose",
      "Knee",
      "Front Raise",
      "Back Raise",
      "Leg Opening",
    ];

    let salwarData = {};
    let blouseData = {};
    let shirtData = {};
    let pantData = {};

    for (let i in specificCustomerData) {
      let sd = specificCustomerData[i]["salwarData"];

      console.log(sd);
      let filteredNameData = sd.filter(function (el) {
        return el.personName === req.body.personName;
      });

      for (let j in sd) {
        if (sd[j]["personName"] === req.body.personName) {
          for (const key of Object.keys(sd[j])) {
            if (!haveItemsSalwar.includes(key)) {
              delete sd[j][key];
            }
          }
          salwarData = sd[j];
        }
      }

      let bd = specificCustomerData[i]["blouseData"];
      for (let k in bd) {
        if (bd[k]["personName"] === req.body.personName) {
          for (const key of Object.keys(bd[k])) {
            if (!haveItemsBlouse.includes(key)) {
              delete bd[k][key];
            }
          }
          blouseData = bd[k];
        }
      }

      let shd = specificCustomerData[i]["shirtData"];
      for (let q in shd) {
        if (shd[q]["personName"] === req.body.personName) {
          for (const key of Object.keys(shd[q])) {
            if (!haveItemsShirt.includes(key)) {
              delete shd[q][key];
            }
          }
          shirtData = shd[k];
        }
      }

      let pd = specificCustomerData[i]["pantData"];
      for (let w in pd) {
        if (pd[w]["personName"] === req.body.personName) {
          for (const key of Object.keys(pd[w])) {
            if (!haveItemsPant.includes(key)) {
              delete pd[w][key];
            }
          }
          pantData = pd[w];
        }
      }
    }
    var salwarDatas = { ["salwarData"]: salwarData };
    var blouseDatas = { ["blouseData"]: blouseData };

    var shirtDatas = { ["shirtData"]: shirtData };
    var pantDatas = { ["pantData"]: pantData };

    var personName = { ["personName"]: req.body.personName };
    var mobileNo = { ["mobNo"]: req.body.mobNo };
    var meregeObj = Object.assign(
      salwarDatas,
      blouseDatas,
      shirtDatas,
      pantDatas,
      personName,
      mobileNo
    );
    // console.log(meregeObj)
    return res.json({ success: "true", message: meregeObj });
  }
});

router.post("/getYearBasedChartData", async (req, res) => {
  console.log("getYearBasedChartData");
  if (req.body.user === "admin") {
    let monthyearOrder = [];
    let year = req.body.year;
    let monthCustomer = [];
    for (let i = 0; i <= 11; i++) {
      let getOrdersMonth = await addOrderSchema.find({
        orderDate: {
          $gte: new Date(year, i, 1),
          $lt: new Date(year, i + 1, 1),
        },
      });
      let getCustomerMonth = await CustomerSchema.find({
        cusDate: { $gte: new Date(year, i, 1), $lt: new Date(year, i + 1, 1) },
      });
      monthyearOrder.push(getOrdersMonth.length);
      monthCustomer.push(getCustomerMonth.length);
    }
    let msg = {
      countOrder: monthyearOrder,
      countCustomer: monthCustomer,
      year: year,
    };
    return res.json({ success: "true", message: msg });
  }
});

router.post("/dashBoard", async (req, res) => {
  console.log("dashBoard");


  try {

    await mongoDBConnect(req.body.username)


    let customerCount = await CustomerSchema.find({});
    let orderCount = await addOrderSchema.find({});
    let confirmOrderCount = await addOrderSchema.find({
      orderStatus: "Confirmed",
    });
    let processingOrderCount = await addOrderSchema.find({
      orderStatus: "Processing",
    });
    let readyOrderCount = await addOrderSchema.find({ orderStatus: "Ready" });
    let deliveredOrderCount = await addOrderSchema.find({
      orderStatus: "Delivered",
    });
    let assignedOrder = await DesignTeamOrderDetails.find({});
    let salwarBlouseValues = await addOrderSchema.find(
      {},
      { salwarCount: 1, blouseCount: 1 }
    );

    //adding in array of objects. objects value
    let salwarCounts = salwarBlouseValues.reduce(
      (acc, curr) => acc + curr.salwarCount,
      0
    );
    let blouseCounts = salwarBlouseValues.reduce(
      (acc, curr) => acc + curr.blouseCount,
      0
    );

    let d = new Date().toISOString();
    var monthNo = d.split("T")[0];

    let gte = "T00:00:00.000+00:00";
    let timeinzero = monthNo + gte;

    var TodayDeliveries = await addOrderSchema.find({
      deliveryDate: timeinzero,
    });

    let gteq = monthNo + "T00:00:00.000+00:00";
    let lt = monthNo + "T23:59:59.999+00:00";
    var TodayOrders = await addOrderSchema.find(
      { orderDate: { $gte: gteq, $lt: lt } },
      {
        _id: 0,
        salwarData: 0,
        blouseData: 0,
        shirtData: 0,
        pantData: 0,
        __v: 0,
      }
    );

    let TodayCustomer = await CustomerSchema.find({
      cusDate: { $gte: gteq, $lt: lt },
    });

    console.log(TodayCustomer.length);
    let BlouseToday = await addOrderSchema.find(
      { orderDate: { $gte: gteq, $lt: lt } },
      { blouseCount: 1 }
    );
    let BlouseTodayCounts = BlouseToday.reduce(
      (acc, curr) => acc + curr.blouseCount,
      0
    );

    let salwarToday = await addOrderSchema.find(
      { orderDate: { $gte: gteq, $lt: lt } },
      { salwarCount: 1 }
    );
    let salwarTodayCounts = salwarToday.reduce(
      (acc, curr) => acc + curr.salwarCount,
      0
    );
    try {
      if (assignedOrder.length !== 0) {
        var assignID = assignedOrder[0].designTeamOrderIDs;
      } else {
        var assignID = [];
      }
    } catch (err) {
      console.log("errrrrrrr");
    }

    // let getOrdersMonth = await addOrderSchema.find({ "orderDate": { "$gte": new Date(currentyear, currentMonth, 1) } })
    // let getReadyMonth = await addOrderSchema.find({ $and: [{ "orderDate": { "$gte": new Date(currentyear, currentMonth, 1) } }, { "orderStatus": "Ready" }] })
    // let getDeliveredMonth = await addOrderSchema.find({ $and: [{ "orderDate": { "$gte": new Date(currentyear, currentMonth, 1) } }, { "orderStatus": "Delivered" }] })

    var count = {
      "All Customers": customerCount.length,
      "All Orders": orderCount.length,
      "Confirmed Orders": confirmOrderCount.length,
      "Processing Orders": processingOrderCount.length,
      "Ready Orders": readyOrderCount.length,
      "Delivered Orders": deliveredOrderCount.length,
      "Assigned Orders": assignID.length,
      Salwar: salwarCounts,
      Blouse: blouseCounts,
      "Today's Orders": TodayOrders.length,
      "Today's Deliveries": TodayDeliveries.length,
      "New Customers Today": TodayCustomer.length,
      "Salwar Ordered Today": salwarTodayCounts,
      "Blouse Ordered Today": BlouseTodayCounts,
    };
    console.log(count);
    // var arr = []
    // let getOrderstatusAll = {}
    // let getOrder = {}
    // let getOrderStatus = ["Ready", "Confirmed", "Processing", "Delivered"]
    // let merge = {}
    // for (let i in getOrderStatus) {
    //   getOrderstatusAll = await addOrderSchema.find({ orderStatus: getOrderStatus[i] }, { "_id": 0, "salwarData": 0, "blouseData": 0, "gst": 0, "__v": 0 })
    //   let getOrderStatusName = getOrderStatus[i]
    //   getOrder = { [getOrderStatusName + "Count"]: getOrderstatusAll.length }
    //   arr.push(getOrder)
    // }
    // let getOrderStatusNameAll = Object.assign({}, ...arr)
    // merge = { ...count, ...getOrderStatusNameAll }
    return res.json({ success: "true", message: count });
  } catch (error) {
    return res.json({ success: false, message: "Server Down" });
  }




});

router.post("/addDesigningTeamOrders", async (req, res) => {
  console.log("addDesigningTeamOrders");
  const postPerson = await new DesignTeamOrderDetails({
    designTeamOrderIDs: req.body.designTeamOrderIDs,
  });
  try {
    var results = await DesignTeamOrderDetails.remove(
      {},
      async function (err, docs) {
        const savePersons = postPerson.save();
        return res.json({ success: "true", message: "DesignTeamOrderAdded" });
      }
    );
  } catch (e) {
    return;
  }
});

router.post("/getDesigningTeamOrders", async (req, res) => {
  console.log("getDesigningTeamOrders");
  var results = await DesignTeamOrderDetails.find({});
  return res.json({ success: "true", message: results });
});
//dataImGet, updateDelieveryStaus, "salwarData", "salwarOrderId", "stichedDressImageName", "stichedDressImage"

const imageToS3Transporter = async (
  dataImGet,
  prevOrderData,
  dressData,
  dressOrderID,
  patternIDName,
  patternIDImage
) => {
  for (let i in dataImGet[dressData]) {
    let obj = dataImGet[dressData][i];
    let prevSalwarArr = [];

    try {
      prevSalwarArr = prevOrderData[dressData];
    } catch (e) {
      prevSalwarArr = [];
    }

    let prevSalwarObj = prevSalwarArr.filter(function (el) {
      return el[dressOrderID] === obj[dressOrderID];
    })[0];

    if (
      obj.hasOwnProperty(patternIDImage) &&
      obj[patternIDImage].slice(0, 4) !== "http"
    ) {
      var neckPatternIDImage = obj[patternIDImage];
      let neckResult = await s3Methods.uploadFileToS3(
        neckPatternIDImage,
        obj[dressOrderID] + obj[patternIDName] + currentDate + ".jpeg"
      );
      obj[patternIDImage] = neckResult.Key;
    } else if (
      obj.hasOwnProperty(patternIDImage) &&
      obj[dressOrderID] === prevSalwarObj[dressOrderID]
    ) {
      obj[patternIDImage] = prevSalwarObj[patternIDImage];
    }
  }

  if (prevOrderData !== undefined) {
    let newOrderNeckKeys = dataImGet[dressData].map((el) => el[patternIDImage]);
    let prevOrderNeckKeys = prevOrderData[dressData].map(
      (el) => el[patternIDImage]
    );

    let keyToRemove = prevOrderNeckKeys.filter(
      (e) => !newOrderNeckKeys.includes(e)
    );

    keyToRemove.map(async (text) => {
      const result = await s3Methods.deleteFile(text);
    });
  }

  return dataImGet;
};

const StichedImageToS3Transporter = async (
  dataImGet,
  prevOrderData,
  dressData,
  dressOrderID,
  patternIDName,
  patternIDImage
) => {
  for (let i in dataImGet[dressData]) {
    let obj = dataImGet[dressData][i];

    try {
      prevSalwarArr =
        prevOrderData[
        dressData === "stichedSalwarImage" ? "salwarData" : "blouseData"
        ];
    } catch (e) {
      prevSalwarArr = [];
    }

    let prevSalwarObj = prevSalwarArr.filter(function (el) {
      return (
        el[
        dressData === "stichedSalwarImage" ? "salwarOrderId" : "blouseOrderId"
        ] ===
        obj[
        dressData === "stichedSalwarImage" ? "salwarOrderId" : "blouseOrderId"
        ]
      );
    })[0];

    if (
      obj.hasOwnProperty(patternIDImage) &&
      obj[patternIDImage].slice(0, 4) !== "http"
    ) {
      var neckPatternIDImage = obj[patternIDImage];
      let neckResult = await s3Methods.uploadFileToS3(
        neckPatternIDImage,
        obj[dressOrderID] + obj[patternIDName] + currentDate + ".jpeg"
      );
      obj[patternIDImage] = neckResult.Key;
    } else if (
      obj.hasOwnProperty(patternIDImage) &&
      obj[dressOrderID] === prevSalwarObj[dressOrderID]
    ) {
      obj[patternIDImage] = prevSalwarObj[patternIDImage];
    }
  }

  if (prevOrderData !== undefined) {
    let newOrderNeckKeys = dataImGet[dressData].map((el) => el[patternIDImage]);
    let prevOrderNeckKeys = prevOrderData[dressData].map(
      (el) => el[patternIDImage]
    );

    let keyToRemove = prevOrderNeckKeys.filter(
      (e) => !newOrderNeckKeys.includes(e)
    );

    keyToRemove.map(async (text) => {
      const result = await s3Methods.deleteFile(text);
    });
  }

  return dataImGet;
};

const insertFunction = async (dataImGet, id, mobNo, res) => {
  console.log("insertFunction");

  try {
    var results = await CustomerSchema.findOne(
      { cusMobNo: mobNo },
      async function (err, obj) {
        if (!err && obj) {
          dataImGet["cusColor"] = obj.cusColor;
          dataImGet["cusId"] = obj.cusId;
          var dbId = addOrderSchema.findOne({ orderID: id });
          try {
            if (dbId === null) {
              var StoreData = await addOrderSchema(dataImGet);
              StoreData.save((err) => {
                if (err) {
                  res.json({ success: false, message: "error" });
                } else {
                  res.json({ success: true, message: "DataStored" });
                }
              });
            } else {
              console.log("else");

              var DeleteData = await addOrderSchema.deleteOne({ orderID: id });
              var storeData = await addOrderSchema.insertMany(dataImGet);
              res.json({ success: true, message: "DataStored" });
            }
          } catch (error) { }
        } else {
          return res.json({ success: false, message: "nodata" });
        }
      }
    );
  } catch (e) {
    return;
  }
};

router.post("/addOrder", async (req, res) => {
  console.log("addOrder");
  var dataImGet = req.body;

  var id = await dataImGet["orderID"];
  var mobNo = dataImGet["mobNo"];
  var prevOrderData = [];
  try {
    prevOrderData = (await addOrderSchema.find({ orderID: id }))[0];
  } catch (e) {
    prevOrderData = [];
  }

  let foundObjectFullDate = dataImGet["orderDate"];

  let newFoundObjectFullDate = new Date(foundObjectFullDate);

  console.log(newFoundObjectFullDate);
  console.log(myDate);

  if (myDate < newFoundObjectFullDate) {
    console.log(true);
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "salwarData",
      "salwarOrderId",
      "Neck Pattern ID name",
      "Neck Pattern ID image"
    );
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "salwarData",
      "salwarOrderId",
      "Sleeve Pattern ID name",
      "Sleeve Pattern ID image"
    );
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "salwarData",
      "salwarOrderId",
      "dressImageName",
      "dressImage"
    );
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "salwarData",
      "salwarOrderId",
      "stichedDressImageName",
      "stichedDressImage"
    );

    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "blouseData",
      "blouseOrderId",
      "Neck Pattern ID name",
      "Neck Pattern ID image"
    );
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "blouseData",
      "blouseOrderId",
      "Sleeve Pattern ID name",
      "Sleeve Pattern ID image"
    );
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "blouseData",
      "blouseOrderId",
      "Work Blouse ID name",
      "Work Blouse ID image"
    );
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "blouseData",
      "blouseOrderId",
      "dressImageName",
      "dressImage"
    );
    dataImGet = await imageToS3Transporter(
      dataImGet,
      prevOrderData,
      "blouseData",
      "blouseOrderId",
      "stichedDressImageName",
      "stichedDressImage"
    );

    insertFunction(dataImGet, id, mobNo, res);
  } else {
    console.log(false);
    insertFunction(dataImGet, id, mobNo, res);
  }
});
router.post("/getCustomerPage", async (req, res) => {
  console.log("getCustomerPage");
  if (req.body.user == "admin") {
    var mobNo = req.body.cusMobNo;
    var customerDet = await addOrderSchema.find(
      { mobNo: mobNo },
      { salwarData: 0, blouseData: 0, __v: 0, _id: 0 }
    );
    res.json({ success: true, message: customerDet });
  } else {
    res.json({ success: false, message: "No Data" });
  }
});

router.post("/getOrderId", async (req, res) => {
  console.log("getOrderId");
  var cusId = req.body.cusId;
  var cusMobNo = req.body.cusMobNo;
  var cusOrderId = await CustomerSchema.find({
    $and: [{ cusMobNo: cusMobNo }, { cusId: cusId }],
  });
  if (cusOrderId.length === 0) {
    res.json({ success: false, message: "Customer Data Not Found" });
  } else {
    var customerDet = await addOrderSchema.find(
      { mobNo: cusMobNo },
      {
        salwarData: 0,
        blouseData: 0,
        __v: 0,
        _id: 0,
        gst: 0,
        orderDate: 0,
        name: 0,
        mobNo: 0,
        deliveryDate: 0,
        orderStatus: 0,
        salwarCount: 0,
        finalAmount: 0,
        blouseCount: 0,
      }
    );
    var arr = [];
    for (let i = 0; i < customerDet.length; i++) {
      arr.push(customerDet[i]["orderID"]);
    }
    res.json({ success: true, message: arr });
  }
});

router.post("/customerLoginData", async (req, res) => {
  console.log("customerLoginData");
  let reqCusId = req.body.cusId;
  let reqCusMobNo = req.body.cusMobNo;
  var reqOrderId = req.body.orderID;
  var customerData = await CustomerSchema.find({
    $and: [{ cusMobNo: reqCusMobNo }, { cusId: reqCusId }],
  });
  if (customerData.length === 0) {
    res.json({ success: false, message: "Customer Data Not Found" });
  } else {
    var customerDet = await addOrderSchema.find(
      { $and: [{ orderID: reqOrderId }, { mobNo: reqCusMobNo }] },
      { __v: 0, _id: 0, gst: 0 }
    );
    res.json({ success: true, message: customerDet });
  }
});

const viewImageInS3 = async (foundObject, dressData, patternIDImage) => {
  for (let i in foundObject[dressData]) {
    let obj = foundObject[dressData][i];
    if (obj.hasOwnProperty(patternIDImage)) {
      var neckPatternIDImage = obj[patternIDImage];

      let neckResult = await s3Methods.viewFileFromS3(neckPatternIDImage);

      foundObject[dressData][i][patternIDImage] = neckResult;
    }
  }
  return foundObject;
};

router.post("/getOrderData", async (req, res) => {
  console.log("getOrderData");
  if (req.body.user === "admin") {
    console.log(req.body);
    var orderId = req.body.orderID;
    var no = req.body.cusMobNo;
    var foundObject = await addOrderSchema
      .findOne({ orderID: orderId, mobNo: no })
      .lean();
    let foundObjectFullDate = foundObject["orderDate"];

    console.log(foundObjectFullDate);
    console.log(myDate);
    if (myDate < foundObjectFullDate) {
      console.log(true);

      foundObject = await viewImageInS3(
        foundObject,
        "salwarData",
        "Neck Pattern ID image"
      );
      foundObject = await viewImageInS3(
        foundObject,
        "salwarData",
        "Sleeve Pattern ID image"
      );
      foundObject = await viewImageInS3(
        foundObject,
        "salwarData",
        "dressImage"
      );
      foundObject = await viewImageInS3(
        foundObject,
        "salwarData",
        "stichedDressImage"
      );

      foundObject = await viewImageInS3(
        foundObject,
        "blouseData",
        "Neck Pattern ID image"
      );
      foundObject = await viewImageInS3(
        foundObject,
        "blouseData",
        "Sleeve Pattern ID image"
      );
      foundObject = await viewImageInS3(
        foundObject,
        "blouseData",
        "Work Blouse ID image"
      );
      foundObject = await viewImageInS3(
        foundObject,
        "blouseData",
        "dressImage"
      );
      foundObject = await viewImageInS3(
        foundObject,
        "blouseData",
        "stichedDressImage"
      );

      var results = await CustomerSchema.findOne(
        { cusMobNo: req.body.cusMobNo },
        { _v: 0, _id: 0 }
      ).lean();

      var orderlist = await addOrderSchema.find({ mobNo: results.cusMobNo });
      let temp = personNames(orderlist);
      let salwarPersonObj = temp[0];
      let blousePersonObj = temp[1];
      let shirtPersonObj = temp[2];
      let pantPersonObj = temp[3];

      var meregeObj = Object.assign(
        salwarPersonObj,
        foundObject,
        blousePersonObj,
        shirtPersonObj,
        pantPersonObj
      );

      return res.json({ success: true, message: meregeObj });
    } else {
      console.log(false);
      var results = await CustomerSchema.findOne(
        { cusMobNo: req.body.cusMobNo },
        { _v: 0, _id: 0 }
      ).lean();
      var orderlist = await addOrderSchema.find({ mobNo: results.cusMobNo });
      let temp = personNames(orderlist);
      let salwarPersonObj = temp[0];
      let blousePersonObj = temp[1];
      let shirtPersonObj = temp[2];
      let pantPersonObj = temp[3];
      var meregeObj = Object.assign(
        salwarPersonObj,
        foundObject,
        blousePersonObj,
        shirtPersonObj,
        pantPersonObj
      );
      return res.json({ success: true, message: meregeObj });
    }
  } else {
    res.json({ success: false, message: "No Data" });
  }
});

router.post("/generateOrderID", async (req, res) => {
  console.log("OrderIDArray");

  if (req.body.user === "admin") {
    let orderIDArray = await orderIDSchema.find({});
    var arr = [];
    var orderId = 0;

    var list = await addOrderSchema.find(
      {},
      {
        orderDate: 0,
        name: 0,
        mobNo: 0,
        deliveryDate: 0,
        orderStatus: 0,
        salwarCount: 0,
        blouseCount: 0,
        salwarData: 0,
        blouseData: 0,
        _id: 0,
        __v: 0,
      }
    );
    if (orderIDArray.length === 0) {
      if (list.length !== 0) {
        for (let i in list) {
          arr.push(list[i].orderID);
        }
        var sortedOrderIds = arr.sort().reverse();
        var lastOrderNo = parseInt(sortedOrderIds[0].match(/\d+$/)[0]);
        if (lastOrderNo < 9) {
          orderId = "00" + (lastOrderNo + 1);
        } else if (lastOrderNo >= 9 && lastOrderNo < 99) {
          orderId = "0" + (lastOrderNo + 1);
        } else {
          orderId = lastOrderNo + 1;
        }
        res.json({ success: true, message: "K" + orderId });
      } else {
        var tempStartNo = 0;
        if (tempStartNo < 9) {
          orderId = "00" + (tempStartNo + 1);
        } else if (tempStartNo >= 9 && tempStartNo < 100) {
          orderId = "0" + (tempStartNo + 1);
        } else {
          orderId = tempStartNo + 1;
        }
        res.json({ success: true, message: "K" + orderId });
      }

      await orderIDSchema.insertMany({ orderID: "K" + orderId });
    } else {
      let tempOrder = orderIDArray[0]["orderID"];
      if (tempOrder.length === 0) {
        {
          if (list.length !== 0) {
            for (let i in list) {
              arr.push(list[i].orderID);
            }
            var sortedOrderIds = arr.sort().reverse();
            var lastOrderNo = parseInt(sortedOrderIds[0].match(/\d+$/)[0]);
            if (lastOrderNo < 9) {
              orderId = "00" + (lastOrderNo + 1);
            } else if (lastOrderNo >= 9 && lastOrderNo < 99) {
              orderId = "0" + (lastOrderNo + 1);
            } else {
              orderId = lastOrderNo + 1;
            }
            res.json({ success: true, message: "K" + orderId });
          } else {
            var tempStartNo = 0;
            if (tempStartNo < 9) {
              orderId = "00" + (tempStartNo + 1);
            } else if (tempStartNo >= 9 && tempStartNo < 100) {
              orderId = "0" + (tempStartNo + 1);
            } else {
              orderId = tempStartNo + 1;
            }
            res.json({ success: true, message: "K" + orderId });
          }
          await orderIDSchema.updateOne(
            {},
            { $push: { orderID: "K" + orderId } }
          );
        }
      } else {
        var sortedOrderIds = tempOrder.sort().reverse();
        let lastOrderId = parseInt(sortedOrderIds[0].match(/\d+$/)[0]);

        if (lastOrderId < 9) {
          orderId = "00" + (lastOrderId + 1);
        } else if (lastOrderId >= 9 && lastOrderId < 99) {
          orderId = "0" + (lastOrderId + 1);
        } else {
          orderId = lastOrderId + 1;
        }

        res.json({ success: true, message: "K" + orderId });
        await orderIDSchema.updateOne(
          {},
          { $push: { orderID: "K" + orderId } }
        );
      }
    }
  }
});

router.post("/removeOrderID", async (req, res) => {
  console.log("removeOrderID");
  if (req.body.user === "admin") {
    let item = req.body.orderID;
    console.log(item);
    await orderIDSchema.updateOne({}, { $pull: { orderID: item } });
    let orderIDArray = await orderIDSchema.find({});
    let tempOrder = orderIDArray[0]["orderID"];
    res.json({ success: true, message: tempOrder });
  }
});

// router.post("/generateOrderID", async (req, res) => {
//   console.log("generateOrderID");
//   var arr = [];
//   if (req.body.user === "admin") {
//     var orderId = 0;
//     var list = await addOrderSchema.find(
//       {},
//       {
//         orderDate: 0,
//         name: 0,
//         mobNo: 0,
//         deliveryDate: 0,
//         orderStatus: 0,
//         salwarCount: 0,
//         blouseCount: 0,
//         salwarData: 0,
//         blouseData: 0,
//         _id: 0,
//         __v: 0,
//       }
//     );
//     if (list.length !== 0) {
//       for (let i in list) {
//         arr.push(list[i].orderID);
//       }
//       var sortedOrderIds = arr.sort().reverse();
//       var lastOrderNo = parseInt(sortedOrderIds[0].match(/\d+$/)[0]);
//       if (lastOrderNo < 9) {
//         orderId = "00" + (lastOrderNo + 1);
//       } else if (lastOrderNo >= 9 && lastOrderNo < 99) {
//         orderId = "0" + (lastOrderNo + 1);
//       } else {
//         orderId = lastOrderNo + 1;
//       }
//       res.json({ success: true, message: "K" + orderId });
//     } else {
//       var tempStartNo = 0;
//       if (tempStartNo < 9) {
//         orderId = "00" + (tempStartNo + 1);
//       } else if (tempStartNo >= 9 && tempStartNo < 100) {
//         orderId = "0" + (tempStartNo + 1);
//       } else {
//         orderId = tempStartNo + 1;
//       }
//       res.json({ success: true, message: "K" + orderId });
//     }

//     // let orderIDArray = await orderIDSchema.find({})
//   }
// });

router.post("/removeOrderData", async (req, res) => {
  console.log("removeOrderData");
  if (req.body.user === "admin") {
    var orderId = req.body.orderID;

    console.log(orderId);
    await orderIDSchema.updateOne({}, { $pull: { orderID: orderId } });
    var no = req.body.cusMobNo;
    var foundObject = await addOrderSchema.deleteOne({
      orderID: orderId,
      mobNo: no,
    });

    const result = s3Methods.deleteAllFile(orderId + "/");
    res.json({ success: true, message: result });
  } else {
    res.json({ success: false, message: "No Data" });
  }
});

router.post("/getDeliveryDateData", async (req, res) => {
  console.log("getDeliveryDateData");
  var deliveryDate = req.body.deliveryDate;
  if (req.body.user === "admin") {
    var multiOrderIdDataInDate = await addOrderSchema.find({ deliveryDate: deliveryDate }, { salwarData: 0, blouseData: 0, __v: 0, _id: 0, gst: 0 });
    res.json({ success: true, message: multiOrderIdDataInDate });
  }
});

router.post("/getMultiOrderIdData", async (req, res) => {
  console.log("getMultiOrderIdData");
  var orderIds = (req.body.orderID)

  var pageNo = req.body.page
  var size = req.body.size

  console.log(orderIds)

  var multiOrderIdDataCount = await addOrderSchema.find({ orderID: { $in: orderIds } }).count();
  console.log(multiOrderIdDataCount)
  let dataSkips = findSkips(pageNo, size, multiOrderIdDataCount)


  if (req.body.user === "admin") {

    var multiOrderIdData = await addOrderSchema.find({ orderID: { $in: orderIds } }, { salwarData: 0, blouseData: 0, __v: 0, _id: 0, gst: 0 }).sort({ orderID: 1 }).limit(dataSkips[0]).skip(dataSkips[1]);

    res.json({ success: true, message: multiOrderIdData, totalOrderCount: multiOrderIdDataCount });
  }
});

router.post("/getAllCusMobNos", async (req, res) => {
  console.log("getAllCusMobNos");
  if (req.body.user === "admin") {
    var multiOrderIdData = await CustomerSchema.find({}, { cusDate: 0, cusEmail: 0, cusAddress: 0, cusId: 0, cusColor: 0, __v: 0, _id: 0, });
    res.json({ success: true, message: multiOrderIdData });
  }
});

router.post("/allOrderData", async (req, res) => {
  console.log("allOrderData");
  if (req.body.user === "admin") {
    var list = await addOrderSchema.find({}, { _id: 0, __v: 0 });
    res.json({ success: true, message: list });
  } else {
    res.json({ success: false, message: "No Data" });
  }
});

router.post("/getMeasurement", async (req, res) => {
  console.log("getMeasurement");
  if (req.body.user === "admin") {
    var data = await addOrderSchema.findOne(
      {},
      {
        "salwarData.Shoulder Width": 1,
        "Breast Circum": 1,
        "salwarData.Breast Size": 1,
        "salwarData.Hip": 1,
        "salwarData.Waist": 1,
        "salwarData.Arm Hole": 1,
        "salwarData.Arm Length": 1,
        "salwarData.Arm Circum": 1,
        "salwarData.Neck F": 1,
        "salwarData.Neck B": 1,
        "salwarData.Full Length": 1,
        _id: 0,
      }
    );
    res.json({ success: true, message: data });
  }
});

router.post("/addCustomerData", async (req, res) => {
  console.log("addCustomerData");



  try {
    await mongoDBConnect(req.body.username)


    let reqData = req.body
    console.log(reqData)

    const id = generateUniqueId({
      length: 5,
      useLetters: false,
    });
    var custId = "cus-" + id;
    const color = randomColor({
      luminosity: "bright",
      format: "rgb",
    });
    let currentdate = new Date().toISOString();
    const postPerson = await new CustomerSchema({ cusDate: currentdate, cusName: req.body.cusName, cusEmail: req.body.cusEmail, cusMobNo: req.body.cusMobNo, cusAddress: req.body.cusAddress, cusId: custId, cusColor: color, });
    try {


      var results = await CustomerSchema.find({ cusMobNo: req.body.cusMobNo })


      if (results.length != 0) {
        return res.json({ success: "false", message: "UserExists" });
      } else {
        const savePersons = postPerson.save();
        return res.json({ success: "true", message: "RegistrationSuccess" });
      }


    } catch (e) {
      console.log("cat" + e)
      return res.json({ 'success': false, message: 'Server Down' })

    }
  } catch (error) {
    console.log("catchhhhhhherrorrrrrrrr" + error)

    return res.json({ 'success': false, message: 'Server Down' })
  }

});

router.post("/fromtodate", async (req, res) => {
  console.log("fromtodate");
  if (req.body.user === "admin") {
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromToDate = await addOrderSchema.find({ orderDate: { $gte: new Date(fromDate), $lte: new Date(toDate) } }, { salwarData: 0, blouseData: 0, _id: 0, orderID: 0, name: 0, mobNo: 0, deliveryDate: 0, orderStatus: 0, gst: 0, __v: 0, });

    let TodayCustomer = await CustomerSchema.find(
      { cusDate: { $gte: new Date(fromDate), $lt: new Date(toDate) } },
      {
        cusName: 0,
        _id: 0,
        cusEmail: 0,
        cusMobNo: 0,
        cusAddress: 0,
        cusId: 0,
        cusColor: 0,
        __v: 0,
      }
    );
    // customer joined date

    var arrCus = [];

    TodayCustomer.map((text) => {
      var textValue = (textValue = text.cusDate.toISOString()); //get value and convert into string
      var spiltValue = (spiltValue = textValue.split("T")[0]); //split value

      var datePart = spiltValue.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2];
      var ddmmyyyy = day + "/" + month + "/" + year;
      arrCus.push(ddmmyyyy);
    });

    const occurrences = arrCus.reduce(function (acc, curr) {
      //using func calcu same date of count 15/02/2022 : 02
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});

    var arrOfCustomer = [];
    var customerObj = {};
    var objKeys = Object.keys(occurrences);
    var objValues = Object.values(occurrences);

    objKeys.some((data, index) => {
      //creating array of objects
      customerObj.dailyDate = objKeys[index];
      customerObj.customerCount = objValues[index];

      arrOfCustomer.push(customerObj);
      customerObj = {};
    });

    var sumarr = objValues.reduce((a, b) => a + b, 0); //sum of array

    var TotalObj = { dailyDate: "Total", customerCount: sumarr };

    arrOfCustomer.push(TotalObj);

    var op = {};
    var arr = [];
    for (let i = 0; i < fromToDate.length; i++) {
      var date = new Date(fromToDate[i].orderDate).toISOString();

      var monthNo = date.split("T")[0];
      var datePart = monthNo.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2];
      var ddmmyyyy = day + "/" + month + "/" + year;
      var salwarCountNo = fromToDate[i].salwarCount;
      var blouseCountNo = fromToDate[i].blouseCount;
      var grandTotal = fromToDate[i].grandTotal;

      op["dailyDate"] = ddmmyyyy;
      op["salwarCount"] = salwarCountNo;
      op["blouseCount"] = blouseCountNo;
      op["grandTotal"] = grandTotal;

      arr.push(op);
      op = {};
    }
    let obj = {};

    arr.forEach((item) => {
      if (obj[item.dailyDate]) {
        obj[item.dailyDate].salwarCount =
          obj[item.dailyDate].salwarCount + item.salwarCount;
        obj[item.dailyDate].blouseCount =
          obj[item.dailyDate].blouseCount + item.blouseCount;
        obj[item.dailyDate].grandTotal =
          obj[item.dailyDate].grandTotal + item.grandTotal;
      } else {
        obj[item.dailyDate] = item;
      }
    });
    let valuesArr = Object.values(obj);

    if (valuesArr.length === 1) {
      var val = {
        dailyDate: "Total",
        salwarCount: valuesArr[0]["salwarCount"],
        blouseCount: valuesArr[0]["blouseCount"],
        grandTotal: valuesArr[0]["grandTotal"],
      };

      valuesArr.push(val);
    } else if (valuesArr.length === 0) {
      valuesArr = [];
    } else {
      var val = valuesArr.reduce(function (previousValue, currentValue) {
        return {
          dailyDate: "Total",
          salwarCount: previousValue.salwarCount + currentValue.salwarCount,
          blouseCount: previousValue.blouseCount + currentValue.blouseCount,
          grandTotal: previousValue.grandTotal + currentValue.grandTotal,
        };
      });
      valuesArr.push(val);
    }

    res.json({
      success: true,
      message: valuesArr,
      customerReportData: arrOfCustomer,
    });
  }
});

router.post("/deleteCustomerData", async (req, res) => {
  console.log("deleteCustomerData");
  await mongoDBConnect(req.body.username)
  
  var mobileNo = req.body.cusMobNo;
  var orderIdLength;
  if (req.body.user === "admin") {
    var countOrderId = await addOrderSchema.find({ mobNo: mobileNo });
    orderIdLength = countOrderId.length;
    if (orderIdLength === 0) {
      await CustomerSchema.deleteOne({ cusMobNo: mobileNo });
      res.json({ sucess: true, message: "Deleted" });
    } else {
      res.json({ sucess: true, message: "Please delete order first" });
    }
  }
});

router.post("/updateCustomerData", async (req, res) => {
  console.log("updateCustomerData");
  if (req.body.user === "admin") {
    try {
      var results = await CustomerSchema.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            cusDate: req.body.cusDate,
            cusName: req.body.cusName,
            cusEmail: req.body.cusEmail,
            cusMobNo: req.body.cusMobNo,
            cusAddress: req.body.cusAddress,
          },
        },
        function (err, data) {
          if (!err && data) {
            return res.json({ success: true, message: "updated" });
          } else {
            return res.json({ success: false, message: "not inserted" });
          }
        }
      );
    } catch (e) {
      return;
    }
  } else {
    return res.json({ success: false, message: "Your not admin" });
  }
});


router.post("/getOrderByStatusForExcelFile", async (req, res) => {
  console.log("getOrderByStatus");
  if ((req.body.user = "admin")) {
    if (req.body.orderStatus === "All") {
      var getOrderstatusAll = await addOrderSchema.find({}, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, });
      res.json({ success: false, message: getOrderstatusAll });
    } else if (req.body.orderStatus === "Today's Deliveries" || "Today's Orders" || "Ready" || "Confirmed" || "Processing" || "Delivered" || "Next 10 Days Deliveries") {
      let d = new Date().toISOString();
      var monthNo = d.split("T")[0];

      if (req.body.orderStatus === "Today's Deliveries") {
        let concat = "T00:00:00.000+00:00";
        let timeinzero = monthNo + concat;
        var TodayDeliveres = await addOrderSchema.find(
          { deliveryDate: timeinzero },
          {
            _id: 0,
            salwarData: 0,
            blouseData: 0,
            shirtData: 0,
            pantData: 0,
            __v: 0,
          }
        );
        res.json({ success: true, message: TodayDeliveres });
      } else if (req.body.orderStatus === "Next 10 Days Deliveries") {
        var nextTenDaysOrders = await addOrderSchema
          .find(
            { deliveryDate: { $gte: todayDate, $lte: nextTenDays } },
            {
              _id: 0,
              salwarData: 0,
              blouseData: 0,
              shirtData: 0,
              pantData: 0,
              __v: 0,
            }
          )
          .sort({ deliveryDate: 1 });
        console.log("nextTenDaysOrders");
        res.json({ success: true, message: nextTenDaysOrders });
      } else if (req.body.orderStatus === "Today's Orders") {
        let gte = monthNo + "T00:00:00.000+00:00";
        let lt = monthNo + "T23:59:59.999+00:00";
        var TodayOrders = await addOrderSchema.find(
          { orderDate: { $gte: gte, $lt: lt } },
          {
            _id: 0,
            salwarData: 0,
            blouseData: 0,
            shirtData: 0,
            pantData: 0,
            __v: 0,
          }
        );
        res.json({ success: true, message: TodayOrders });
      } else if (req.body.orderStatus === "Assigned Orders") {
        let assignedOrdersIDList = await DesignTeamOrderDetails.find({});
        if (assignedOrdersIDList.length !== 0) {
          let assignID = assignedOrdersIDList[0].designTeamOrderIDs;
          let assignOrders = [];

          for (let i in assignID) {
            let temp = await addOrderSchema.find({ orderID: assignID[i] }, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, });
            assignOrders.push(temp[0]);
          }
          res.json({ success: true, message: assignOrders });
        } else {
          res.json({ success: true, message: [] });
        }
      } else if (
        req.body.orderStatus === "Ready" ||
        "Confirmed" ||
        "Processing" ||
        "Delivered"
      ) {
        var getOrderstatus = await addOrderSchema.find(
          { orderStatus: req.body.orderStatus },
          {
            _id: 0,
            salwarData: 0,
            blouseData: 0,
            shirtData: 0,
            pantData: 0,
            __v: 0,
          }
        );
        res.json({ success: true, message: getOrderstatus });
      } else {
        res.json({ success: false, message: [] });
      }
    }
  }
});










let findSkips = (pageNo, size, count) => {

  var result2 = 0;
  for (let i = 1; i <= pageNo; i++) {
    result2 = i * size;
  }
  var totalOrderCount = count


  var skips = totalOrderCount - result2;

  if (skips <= 0) {
    size = size + skips;
    skips = 0;
  }

  return [size, skips]
}





const searchOrderDataFunc = async (pageNo, size, searchQuery, fieldName, objToSearch) => {
  var searchValue = '\\b' + searchQuery + '[a-zA-Z0-9]*'
  let results = []

  if (pageNo > 1) {
    var newSkips = 0;
    newSkips = ((pageNo) - 1) * size

    results = await addOrderSchema.find({ ...objToSearch, [fieldName]: { $regex: searchValue, $options: "i" } }).limit(size).skip(newSkips).lean()
  }
  else {
    results = await addOrderSchema.find({ ...objToSearch, [fieldName]: { $regex: searchValue, $options: "i" } }).limit(size).lean()

  }
  let totalOrderCount = (await addOrderSchema.find({ ...objToSearch, [fieldName]: { $regex: searchValue, $options: "i" } }).lean()).length
  return { results: results, totalOrderCount: totalOrderCount }
}

router.post("/getOrderByStatus", async (req, res) => {

  console.log("getOrderByStatus");
  if ((req.body.user = "admin")) {
    var pageNo = req.body.page;
    let size = req.body.size;
    let searchQuery = req.body.searchQuery
    let fieldName = req.body.field

    if (req.body.orderStatus === "All") {
      let getOrderstatusAll = []
      let getOrderstatusAllCount = 0;
      if (searchQuery === "") {
        getOrderstatusAllCount = await addOrderSchema.find({}).count();
        let temp = findSkips(pageNo, size, getOrderstatusAllCount)

        getOrderstatusAll = await addOrderSchema.find({}, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, }).sort({ orderID: 1 }).limit(temp[0]).skip(temp[1]);

      }
      else if (searchQuery !== "") {

        let searchOrderDataFuncResults = await searchOrderDataFunc(pageNo, size, searchQuery, fieldName, {})
        getOrderstatusAll = searchOrderDataFuncResults.results
        getOrderstatusAllCount = searchOrderDataFuncResults.totalOrderCount

      }

      res.json({ success: true, message: getOrderstatusAll, totalOrderCount: getOrderstatusAllCount });



    }
    else if (req.body.orderStatus === "Today's Deliveries" || "Today's Orders" || "Ready" || "Confirmed" || "Processing" || "Delivered" || "Next 10 Days Deliveries") {
      let d = new Date().toISOString();
      var monthNo = d.split("T")[0];

      if (req.body.orderStatus === "Today's Deliveries") {


        let TodayDeliveres = []
        let TodayDeliveresCount = 0

        let concat = "T00:00:00.000+00:00";
        let timeinzero = monthNo + concat;
        if (searchQuery === "") {
          TodayDeliveresCount = await addOrderSchema.find({ deliveryDate: timeinzero }).count()
          let temp = findSkips(pageNo, size, TodayDeliveresCount)
          TodayDeliveres = await addOrderSchema.find({ deliveryDate: timeinzero }, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, }).sort({ orderID: 1 }).limit(temp[0]).skip(temp[1]);
        }
        else if (searchQuery !== "") {
          let searchOrderDataFuncResults = await searchOrderDataFunc(pageNo, size, searchQuery, fieldName, { deliveryDate: timeinzero })
          TodayDeliveres = searchOrderDataFuncResults.results
          TodayDeliveresCount = searchOrderDataFuncResults.totalOrderCount
        }


        res.json({ success: true, message: TodayDeliveres, totalOrderCount: TodayDeliveresCount });
      }


      else if (req.body.orderStatus === "Next 10 Days Deliveries") {

        let nextTenDaysOrdersCount = 0
        let nextTenDaysOrders = []
        if (searchQuery === "") {
          nextTenDaysOrdersCount = await addOrderSchema.find({ deliveryDate: { $gte: todayDate, $lte: nextTenDays } }).sort({ deliveryDate: 1 }).count();
          let temp = findSkips(pageNo, size, nextTenDaysOrdersCount)
          nextTenDaysOrders = await addOrderSchema.find({ deliveryDate: { $gte: todayDate, $lte: nextTenDays } }, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, }).sort({ deliveryDate: 1, orderID: 1 }).limit(temp[0]).skip(temp[1]);
        }
        else if (searchQuery !== "") {
          let searchOrderDataFuncResults = await searchOrderDataFunc(pageNo, size, searchQuery, fieldName, { deliveryDate: { $gte: todayDate, $lte: nextTenDays } })
          nextTenDaysOrders = searchOrderDataFuncResults.results
          nextTenDaysOrdersCount = searchOrderDataFuncResults.totalOrderCount
        }

        res.json({ success: true, message: nextTenDaysOrders, totalOrderCount: nextTenDaysOrdersCount });
      }


      else if (req.body.orderStatus === "Today's Orders") {
        let TodayOrdersCount = 0;
        let TodayOrders = []

        let gte = monthNo + "T00:00:00.000+00:00";
        let lt = monthNo + "T23:59:59.999+00:00";
        if (searchQuery === "") {
          TodayOrdersCount = await addOrderSchema.find({ orderDate: { $gte: gte, $lt: lt } }).count();
          let temp = findSkips(pageNo, size, TodayOrdersCount)
          TodayOrders = await addOrderSchema.find({ orderDate: { $gte: gte, $lt: lt } }, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, }).sort({ orderID: 1 }).limit(temp[0]).skip(temp[1]);
        }
        else if (searchQuery !== "") {
          let searchOrderDataFuncResults = await searchOrderDataFunc(pageNo, size, searchQuery, fieldName, { orderDate: { $gte: gte, $lt: lt } })
          TodayOrders = searchOrderDataFuncResults.results
          TodayOrdersCount = searchOrderDataFuncResults.totalOrderCount
        }
        res.json({ success: true, message: TodayOrders, totalOrderCount: TodayOrdersCount });
      }


      else if (req.body.orderStatus === "Assigned Orders") {

        let assignedOrdersIDList = await DesignTeamOrderDetails.find({});
        if (assignedOrdersIDList.length !== 0) {
          let assignID = assignedOrdersIDList[0].designTeamOrderIDs;
          let reverseAssignID = assignID.sort().reverse()

          let assignOrders = [];
          let temp = []
          let out1 = pageNo * size === size ? 0 : (pageNo * size) - size
          let out2 = pageNo * size === size ? size : (pageNo * size)
          let totalOrderCount = 0

          console.log()
          if (searchQuery === "") {
            let sliceArr = reverseAssignID.slice(out1, out2)
            for (let i in sliceArr) {
              temp = await addOrderSchema.find({ orderID: sliceArr[i] }, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, });
              assignOrders.push(temp[0]);
            }
            totalOrderCount = reverseAssignID.length
          }
          else if (searchQuery !== "") {

            for (let i in assignID) {
              temp = await addOrderSchema.find({ orderID: assignID[i] }, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, });
              assignOrders.push(temp[0]);
            }

            const isNumeric = (value) => {
              return /^-?\d+$/.test(value);
            }


            const filteredRows = assignOrders.filter((row) => {
              if (isNumeric(searchQuery)) {
                return row.mobNo.toLowerCase().includes(searchQuery.toLowerCase());
              }
              else if (searchQuery.toLowerCase()[0] === "k" && isNumeric(searchQuery[1])) {
                return row.orderID.toLowerCase().includes(searchQuery.toLowerCase());
              }
              else {
                return row.name.toLowerCase().includes(searchQuery.toLowerCase());
              }
            });

            assignOrders = filteredRows

            totalOrderCount = filteredRows.length

          }

          res.json({ success: true, message: assignOrders, totalOrderCount: totalOrderCount });
        } else {
          res.json({ success: true, message: [] });
        }
      }


      else if (req.body.orderStatus === "Ready" || "Confirmed" || "Processing" || "Delivered") {
        let getOrderstatusCount = 0
        let getOrderstatus = []
        if (searchQuery === "") {
          getOrderstatusCount = await addOrderSchema.find({ orderStatus: req.body.orderStatus }).count();
          let temp = findSkips(pageNo, size, getOrderstatusCount)
          getOrderstatus = await addOrderSchema.find({ orderStatus: req.body.orderStatus }, { _id: 0, salwarData: 0, blouseData: 0, shirtData: 0, pantData: 0, __v: 0, }).sort({ orderID: 1 }).limit(temp[0]).skip(temp[1]);
        }
        else if (searchQuery !== "") {
          let searchOrderDataFuncResults = await searchOrderDataFunc(pageNo, size, searchQuery, fieldName, { orderStatus: req.body.orderStatus })
          getOrderstatus = searchOrderDataFuncResults.results
          getOrderstatusCount = searchOrderDataFuncResults.totalOrderCount
        }
        res.json({ success: true, message: getOrderstatus, totalOrderCount: getOrderstatusCount });
      }


      else {
        res.json({ success: false, message: [] });
      }
    }
  }
});

router.post("/insertSalwarCost", async (req, res) => {
  console.log("insertSalwarCost");
  if (req.body.user === "admin") {
    const randomNumber =
      "sal" + generateUniqueId({ length: 4, useLetters: false });
    const date = new Date();
    var insertSalwar = await salwarSchema.insertMany({
      dateTime: date,
      salwarId: randomNumber,
      salwarCost: req.body.salwarCost,
    });
    return res.json({ success: "true", message: insertSalwar });
  }
});

router.post("/insertBlouseCost", async (req, res) => {
  console.log("insertBlouseCost");
  if (req.body.user === "admin") {
    const randomNumber =
      "blo" + generateUniqueId({ length: 4, useLetters: false });
    const date = new Date();
    var insertBlouse = await blouseSchema.insertMany({
      dateTime: date,
      blouseId: randomNumber,
      blouseCost: req.body.blouseCost,
    });
    return res.json({ success: "true", message: insertBlouse });
  }
});

router.post("/insertShirtCost", async (req, res) => {
  console.log("insertShirtCost");
  if (req.body.user === "admin") {
    const randomNumber =
      "shi" + generateUniqueId({ length: 4, useLetters: false });
    const date = new Date();
    console.log(date);
    var insertShirt = await shirtSchema.insertMany({ dateTime: date, shirtId: randomNumber, shirtCost: req.body.shirtCost, });
    return res.json({ success: "true", message: insertShirt });
  }
});

router.post("/insertPantCost", async (req, res) => {
  console.log("insertPantCost");
  if (req.body.user === "admin") {
    const randomNumber =
      "pan" + generateUniqueId({ length: 4, useLetters: false });
    const date = new Date();
    var insertPant = await pantSchema.insertMany({
      dateTime: date,
      pantId: randomNumber,
      pantCost: req.body.pantCost,
    });
    return res.json({ success: "true", message: insertPant });
  }
});

router.post("/viewBlouseSalwarLastInsert", async (req, res) => {
  console.log("viewBlouseSalwarLastInsert");
  if (req.body.user === "admin") {
    let lastUpdateSalwar = await salwarSchema.find({}, { _id: 0, __v: 0 }).sort({ _id: -1 }).limit(1);
    let lastUpdateBlouse = await blouseSchema.find({}, { _id: 0, __v: 0 }).sort({ _id: -1 }).limit(1);
    let lastUpdateShirt = await shirtSchema.find({}, { _id: 0, __v: 0 }).sort({ _id: -1 }).limit(1);
    let lastUpdatePant = await pantSchema.find({}, { _id: 0, __v: 0 }).sort({ _id: -1 }).limit(1);

    let salwarBlouseShirtPantRateArray = [...lastUpdateSalwar, ...lastUpdateBlouse, ...lastUpdateShirt, ...lastUpdatePant,];


    return res.json({ success: "true", message: salwarBlouseShirtPantRateArray, });
  } else {
    return res.json({ success: "true", message: [] });
  }
});

router.post("/getSalwarORBlouseId", async (req, res) => {
  console.log("getSalwarORBlouseId");
  if (req.body.user === "admin") {
    if (req.body.dress === "salwar") {
      let salwarIdData = await salwarSchema.find({ salwarId: req.body.rateId });
      return res.json({ success: "true", message: salwarIdData });
    } else if (req.body.dress === "blouse") {
      let blouseIdData = await blouseSchema.find({ blouseId: req.body.rateId });
      return res.json({ success: "true", message: blouseIdData });
    } else if (req.body.dress === "shirt") {
      let shirtIdData = await shirtSchema.find({ shirtId: req.body.rateId });
      return res.json({ success: "true", message: shirtIdData });
    } else if (req.body.dress === "pant") {
      let pantIdData = await pantSchema.find({ pantId: req.body.rateId });
      return res.json({ success: "true", message: pantIdData });
    }
  }
});

router.get("/apiCheck", async (req, res) => {
  return res.json({ success: "true", message: "API Running" });
});

export default router;