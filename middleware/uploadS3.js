const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer")
const shortid= require("shortid");
const s3 = new aws.S3({
    secretAccessKey : "wlgK7sSHTJnMDQz99zPjsHF71DC2PirMoQ9vM4f8",
    accessKeyId : "AKIAI6N7SAJDLFPJ6YNA"
  });
exports.uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: "reactinstagramclone",
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
      },
    }),
  });