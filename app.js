const express = require("express");
const dotenv = require("dotenv");
const app = express();
const http = require("http");
const fileUpload = require('express-fileupload');
const { uploadFile, getFileStream } = require('./s3');
const S3 = require('aws-sdk/clients/s3')
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


// const fs = require('fs')
// const util = require('util')
// const unlinkFile = util.promisify(fs.unlink)

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

app.use(fileUpload());
app.use(cors());
const server = http.createServer(app);



// app.use("/eats/products", express.static("./eats/products"));

app.get('/eats/products/:key', (req, res) => {
    // console.log(req.params)
    const key = req.params.key;
    // const readStream = getFileStream(key); 
    // console.log(readStream.Body);
    const downloadParams = {
        Key: key,
        Bucket: bucketName
    }   
    s3.getObject(downloadParams).createReadStream().on('error', function(err){
        res.status(502).send("Error, cannot get file!");
    }).pipe(res);
    
    // const stream = s3.getObject(downloadParams).createReadStream() 
    // stream.pipe(res);  

    // try{
    //     const stream = s3.getObject(downloadParams).createReadStream() 
    //     stream.pipe(res);  
    // }catch(err){
    //     console.log(err);
    // }
    
    // const stream = s3.getObject(downloadParams, function (err, data) {
    //   if (err) {
    //     res.status(200);
    //     res.end('Error Fetching File');
    //   }
    //   else {
    //     console.log(data);
    //     // res.attachment(req.params.Key); // Set Filename
    //     // res.type(data.ContentType); // Set FileType
    //     // res.send(data.Body);        // Send File Buffer 
    //     stream.Body.pipe(res);
    //   }
    // });
        // var s3Stream = s3.getObject(downloadParams).createReadStream()
        //   .on('error', function(err) {  
        //     // console.log("hii");
        //     return false;
        //   })
        //   .on('end', function(){
        //     // s3Stream.pipe(res); 
        //   });  
      

    // s3.waitFor('objectExists', downloadParams, function(err, data) {
    //     if (err) return res.send(502).json("Bad request"); // an error occurred
    //     else{

    //         const stream =  s3.getObject(downloadParams).createReadStream()
    //         stream.pipe(res); 
    //     }           // successful response
    //   });
}) 

// app.post('/eats/products/upload', (req, res) => {
//     // if (req.files === null) {
//     //   return res.status(400).json({ msg: 'No file uploaded' });
//     // } 
//     // const file = req.files.file;
//     const file = req.file;

//     // // ${__dirname}
//     // file.mv(`./eats/products/${file.name}`, err => {
//     //   if (err) {
//     //     console.error(err);
//     //     return res.status(500).send(err);
//     //   }
//     //   res.json({ fileName: file.name, filePath: `https://files.theristow.com/eats/products/${file.name}` });
//     // });
    
//     const result = uploadFile(file); 
//     // await unlinkFile(file.path); 
//     console.log(result);
//     res.send({filePath: `https://files.theristow.com/eats/products/${result.Key}`})
// });

server.listen(process.env.port || 5000, ()=>{
    console.log("Files server is running..."); 
});
 