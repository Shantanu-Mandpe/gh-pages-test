const express = require('express');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.file;
  const newFilename = uuidv4() + path.extname(uploadedFile.name);
  const uploadPath = path.join(__dirname, 'uploads', newFilename);
  const modifiedPath = path.join(__dirname, 'modified', newFilename);

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const data = new Uint8Array(Buffer.from('Hello Node.js'));
      fs.writeFile(uploadPath, data, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
    });

    fs.rename(uploadPath, modifiedPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.download(modifiedPath, uploadedFile.name, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
