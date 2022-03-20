const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 3000;
const multiparty = require("multiparty");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/delete", (req, res) => {
  const fs = require("fs");
  const { name } = req.body;
  var dir = "uploads/" + name;

  if (fs.existsSync(dir)) {
    fs.rmSync("uploads/" + name, {
      recursive: true,
      force: true,
    });
  } else {
    res.send("not found");
  }
  res.send("deleted");
});

app.post("/upload-file", upload.single("file"), (req, res) => {
  console.log(req);
  const url = req.protocol + "://" + req.get("host") + "/";
  res.status(200).json({
    fileUrl: url + req.file.path,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size / 1000 + "kb",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
