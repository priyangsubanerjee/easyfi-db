const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 3000;

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
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", upload.single("userImage"), (req, res) => {
  console.log(req);
  const url = req.protocol + "://" + req.get("host") + "/";
  res.status(200).json({
    imageUrl: url + req.file.path,
    imageName: req.file.originalname,
    imageType: req.file.mimetype,
    imageSize: req.file.size / 1000 + "kb",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
