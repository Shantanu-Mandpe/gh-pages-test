const fs = require("fs")

document.getElementById('modifyButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    const newFilename = document.getElementById('newFilename').value;

    if (!fileInput.files.length || !newFilename) {
        alert('Please select a file and enter a new filename.');
        return;
    }

    const selectedFile = fileInput.files[0];

    fs.writeFile(selectedFile, "Hello Worlds", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
        }
    }); 

    const modifiedFile = new File([selectedFile], newFilename, { type: selectedFile.type });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(modifiedFile);
    downloadLink.download = newFilename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});
