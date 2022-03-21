
# EasyFi DB - File Storage API

This free file storage API is built to help developers work with remote data & quick, yet reliable file hosting service to integrate them with your existing workflows.


## Authors

- 👔 [@priyangsubanerjee](https://www.github.com/priyangsubanerjee)


## 🔐 API Documentation

Developers can upload files (one file at a time) by sending POST request.

- ⬆️ Upload a file
  -
  Requirements
  - `npm i axios`
  - `File object inside FormData()`

  ### Example code:
  
  ### `Request: `
  ```bash
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  axios.post('https://easyfidb.herokuapp.com/upload', formData)
      .then(res => {
          console.log(res)
  })
  ```

  ### `Response: `
  ```bash
  {
    "fileUrl": "http://easyfidb.herokuapp.com/uploads/9a0c020a-6b2f-4460-8dde-d42e8a5e1597.png",
    "fileName": "diamond_logo.png",
    "fileType": "image/png",
    "fileSize": "28.74kb"
    "fileId": "62384960ef213ca454da612b"
  }
  ```


- 🗑 Delete a file
  -
  Requirements
  - `npm i axios`
  - `fileId` we got it from `File upload` response

  ### Example code:
  
  ### `Request: `
  ```bash
  const fileId = "62384960ef213ca454da612b";
  axios.post('http://easyfidb.herokuapp.com/delete', JSON.stringify({id: fileId}))
      .then(res => {
          console.log(res)
  })
  ```

  ### `Response: `
  ```bash
  { "message": "file deleted successfully" }
  ```


## Features

- 🔑 No API key is required to upload a file.
- 💰 Uploads are completely free as of now.
- 📱 Cross platform

## Use cases

- 💁‍♀️ Developers can use it to save clients avatar.
- 📁 Save a temporary file to be used later in the session.
- ❤️ We would like to hear more from you.

