const fs = require("fs");
const path = require("path");

fs.readdir(
  path.join(__dirname, "secret-folder"),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      console.log("\nCurrent directory filenames:");
      files.forEach((file) => {
        if (!file.isDirectory()) {
          let filePath = path.join(__dirname, "secret-folder", file.name);
          let fileName = file.name.split(".")[0];
          let filExt = file.name.split(".")[1];
          let filStat;
          fs.stat(filePath, (err, stats) => {
            filStat = stats.size;
            console.log(fileName, "-", filExt, "-", filStat.toString());
          });
        }
      });
    }
  }
);
