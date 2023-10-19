const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());

app.use(express.static(__dirname));

function modifyAndCreateFile(uploadedFile, newFilename, callback) {
    // Read the content of the uploaded file
    fs.readFile(uploadedFile, 'utf8', (readErr, fileContent) => {
        if (readErr) {
            callback(readErr, null);
            return;
        }

        // Append data to the file content
        const newData = 'Additional data added to the file.\n';
        const modifiedContent = fileContent + newData;

        // Generate a unique new file name
        const modifiedFilename = newFilename + uuidv4() + path.extname(uploadedFile);

        // Path for the newly created modified file
        const modifiedPath = path.join(__dirname, 'modified', modifiedFilename);

        // Write the modified content to the new file
        fs.writeFile(modifiedPath, modifiedContent, (writeErr) => {
            if (writeErr) {
                callback(writeErr, null);
                return;
            }

            callback(null, modifiedPath);
        });
    });
}

app.post('/modify', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    const newFilename = req.body.newFilename;

    uploadedFile.mv(path.join(__dirname, 'uploads', uploadedFile.name), (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        modifyAndCreateFile(
            path.join(__dirname, 'uploads', uploadedFile.name),
            newFilename,
            (modifyErr, modifiedPath) => {
                if (modifyErr) {
                    return res.status(500).send(modifyErr);
                }

                res.download(modifiedPath, newFilename + path.extname(uploadedFile.name), (downloadErr) => {
                    if (downloadErr) {
                        return res.status(500).send(downloadErr);
                    }
                });
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
