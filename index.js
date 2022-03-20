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

app.post("/upload-image", (req, res) => {
  res.send("uploaded");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
