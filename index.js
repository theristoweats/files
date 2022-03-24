const express = require("express");
const dotenv = require("dotenv");
const app = express();
const http = require("http");
const fileUpload = require('express-fileupload');
const { uploadFile, getFileStream } = require('./s3');

const cors = require("cors");
dotenv.config();


const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// app.use(fileUpload());
app.use(cors());
const server = http.createServer(app);



// app.use("/eats/products", express.static("./eats/products"));

app.get('/eats/products/:key', async (req, res) => {
    // console.log(req.params)
    const key = req.params.key;
    const readStream = await getFileStream(key); 
    if(readStream){
      readStream.pipe(res)
    }else{
      res.send("Errr")
    }
    
})

app.post('/eats/products/upload', upload.single('image'), async (req, res) => {
    // if (req.files === null) {
    //   return res.status(400).json({ msg: 'No file uploaded' });
    // }
    console.log(req.file);

    const file = req.file;
    // ${__dirname}
    // file.mv(`./eats/products/${file.name}`, err => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).send(err);
    //   }
    //   res.json({ fileName: file.name, filePath: `https://files.theristow.com/eats/products/${file.name}` });
    // });
    
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    console.log(result);
    res.send({filePath: `https://files.theristow.com/eats/products/${result.Key}`})
});

server.listen(process.env.PORT || 5000, ()=>{
    console.log("Files server is running...");
});
 