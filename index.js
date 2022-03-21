const express = require("express");
const dotenv = require("dotenv");
const app = express();
const http = require("http");
const fileUpload = require('express-fileupload');

const cors = require("cors");
dotenv.config();


app.use(fileUpload());
app.use(cors());
const server = http.createServer(app);

app.use("/eats/products", express.static("./eats/products"));

app.post('/eats/products/upload', (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
    // ${__dirname}
    file.mv(`./eats/products/${file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({ fileName: file.name, filePath: `/eats/products/${file.name}` });
    });
});

server.listen(process.env.PORT || 5000, ()=>{
    console.log("Files server is running...");
});
 