const express = require("express");
const dotenv = require("dotenv");
const app = express();
const http = require("http");
const fileUpload = require('express-fileupload');
const { uploadFile, getFileStream } = require('./s3');
const S3 = require('aws-sdk/clients/s3')
var cryptotoken = require("crypto");
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

const cors = require("cors");


const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const multerS3 = require('multer-s3');

const upload = multer({
    storage: multerS3({
        s3: s3,
        // acl: "public-read",
        bucket: bucketName,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, cryptotoken.randomBytes(4).toString('hex') + "-" + file.originalname)
        }
    })
})


// app.use(fileUpload());
app.use(cors());
const server = http.createServer(app);



// app.use("/eats/products", express.static("./eats/products"));

app.get('/eats/products/:key', (req, res) => { 
    const key = req.params.key; 
    const downloadParams = {
        Key: key,
        Bucket: bucketName
    }   
    s3.getObject(downloadParams).createReadStream().on('error', function(err){
        res.status(502).send("Error, cannot get file!");
    }).pipe(res); 
     
}) 

app.post('/eats/products/upload', upload.single("image"), async (req, res) => {
    const fileName = req.file.key; 
    res.send({filePath: `https://files.theristow.com/eats/products/${fileName}`})
});

server.listen(process.env.port || 5000, ()=>{
    console.log("Files server is running..."); 
});
 