const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dbConnect = require("./dbConnect");
const { GridFsStorage } = require("multer-gridfs-storage");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const port = process.env.PORT || 3000;

dbConnect();

const url = process.env.DB_URL;
let bucket;

mongoose.connection.on("connected", () => {
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads",
  });
});

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

const storage = new GridFsStorage({
  url: url,
  file: (req, file, cb) => {
    return new Promise((resolve, reject) => {
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 20MB,
  },
});

app.get("/download/:filename", (req, res) => {
  const file = bucket
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "The file does not exist",
        });
      }
      bucket.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const path = file.filename;
  const url = "https://" + req.get("host") + "/download/" + path;
  res.status(200).json({
    fileUrl: url,
    fileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size / 1000 + "kb",
    fileId: file.id,
  });
});

app.post("/delete", (req, res) => {
  const id = new mongoose.Types.ObjectId(req.body.id);
  bucket.delete(id, (err) => {
    if (err) {
      res.status(500).json({
        err: "error deleting file",
      });
    }
    res.status(200).json({
      message: "file deleted successfully",
    });
  });
});

app.listen(port, () => {
  console.log(`Application live on localhost:${port}`);
});
