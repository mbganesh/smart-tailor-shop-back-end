import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({ region, accessKeyId, secretAccessKey });

function uploadFileToS3(base64Image, id) {
  var buf = Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  var dirName = id.split("-")[0];

  var data = {
    Key: dirName + "/" + id,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    Bucket: bucketName,
  };
  return s3.upload(data).promise();
}

//  view
function viewFileFromS3(fileKey) {
  const fileURL = s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: fileKey,
    Expires: 60 * 30, // time in seconds: e.g. 60 * 5 = 5 mins
  });
  return fileURL;
}

// deleteAll
function deleteAllFile(fileName) {
  // fileName -> 'tempDir/'
  var myKeys = [];

  console.log("Recheck : " + fileName);

  var params = {
    Bucket: bucketName,
    Prefix: fileName, // dirName
  };

  s3.listObjectsV2(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data.Contents.length);

      for (let i = 0; i < data.Contents.length; i++) {
        var key = data.Contents[i]["Key"];
        console.log(key);
        myKeys.push(key);
      }

      if (myKeys.length !== 0) deleteWithKeys(myKeys)
    }
  });

  console.log(myKeys);
}


// deleteImageFinalFun
function deleteWithKeys(myKeys) {
  for (let i = 0; i < myKeys.length; i++) {
    var  fileName = myKeys[i];
    console.log(fileName);
    var params = {
      Bucket: bucketName,
      Key: fileName,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }
}

// delete
function deleteFile(fileKeys) {
  var params = {Bucket: bucketName,Key: fileKeys,};
  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}

function s3Methods() {
  uploadFileToS3(base64Image, id);
  viewFileFromS3(fileKey);
  deleteAllFile(fileName)
  deleteFile(fileKeys)
}

export default { uploadFileToS3, viewFileFromS3,deleteAllFile, deleteFile,s3Methods };
