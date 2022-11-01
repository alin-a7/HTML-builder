const fs = require("fs");
const path = require("path");

// fs.rmdir(path.join(__dirname, "files-copy"), (err) => {
//   if(err) throw err
//     console.log('Папка files была скопирована');

// });

fs.readdir(
  path.join(__dirname, "files-copy"),
  { withFileTypes: true },
  (err, filesOld) => {
    if (err) console.log("Папка files была скопирована");
    else {
      filesOld.forEach((fileOld) => {
        fs.unlink(path.join(__dirname, "files-copy", fileOld.name), (err) => {
          if (err) throw err;
        });
      });
    }
  }
);

fs.access("files-copy", fs.constants.F_OK, (err) => {
  if (err) {
    fs.mkdir(path.join(__dirname, "files-copy"), (err) => {
      if (err) {
        console.log(
          "Папка files-copy уже существует, данные в ней перезаписаны"
        );
      }
    });
  }
});

fs.readdir(
  path.join(__dirname, "files"),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        let filePath = path.join(__dirname, "files", file.name);
        let filePathNew = path.join(__dirname, "files-copy", file.name);

        fs.copyFile(filePath, filePathNew, (err) => {
          if (err) throw err;
        });
      });
    }
  }
);
