const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const output = fs.createWriteStream(path.join(__dirname, 'project-dist' ,'bundle.css'));

fs.readdir(
    path.join(__dirname, "styles"),
    { withFileTypes: true },
    (err, files) => {
      if (err) console.log('нет паки');
      else {
        files.forEach((file) => {
          if (!file.isDirectory()) {
            let filePath = path.join(__dirname, "styles", file.name);
            let filExt = file.name.split(".")[1];
            if (filExt === 'css'){
                const input = fs.createReadStream(filePath, 'utf-8');
                input.pipe(output);  
            }
          }
        });
      }
    }
  );