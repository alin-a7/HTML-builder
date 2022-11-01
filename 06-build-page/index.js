const fs = require("fs");
const path = require("path");
const input = fs.createReadStream(
  path.join(__dirname, "template.html"),
  "utf-8"
);
let components = [];

// СОЗДАНИЕ ПАПКИ

fs.access("project-dist", fs.constants.F_OK, (err) => {
  if (err) {
    fs.mkdir(path.join(__dirname, "project-dist"), (err) => {
      if (err) {
        console.log(
          "Папка project-dist уже существует, данные в ней перезаписаны"
        );
      }
    });
  }
});

// // ЗАПИСЬ В INDEX.HTML

fs.readdir(
  path.join(__dirname, "components"),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (!file.isDirectory()) {
          let filePath = path.join(__dirname, "components", file.name);
          fileName = file.name.split(".")[0];
          components.push(`{{${fileName}}}`);
        }
      });
    }
    let inputStr = "";
    let inputComponentsStr = "";
    input.on("data", (data) => {
      inputStr = data.toString();
      // console.log(inputStr)
    });
    const output = fs.createWriteStream(
      path.join(__dirname, "project-dist", "index.html")
    );
    files.forEach((file, i) => {
      if (!file.isDirectory()) {
        let filePath = path.join(__dirname, "components", file.name);
        let inputComponents = fs.createReadStream(filePath, "utf-8");
        inputComponents.on("data", (data) => {
          inputComponentsStr = data.toString();
          //   console.log(inputComponentsStr);
          inputStr = inputStr.replace(components[i], inputComponentsStr);

          if (!components.find((component) => inputStr.includes(component))) {
            output.write(inputStr);
          }
        });
      }
    });
  }
);

// СБОРКА СТИЛЕЙ

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log("нет паки");
    else {
      const outputCSS = fs.createWriteStream(
        path.join(__dirname, "project-dist", "style.css")
      );
      files.forEach((file) => {
        if (!file.isDirectory()) {
          let filePath = path.join(__dirname, "styles", file.name);
          let filExt = file.name.split(".")[1];
          if (filExt === "css") {
            const input = fs.createReadStream(filePath, "utf-8");
            input.pipe(outputCSS);
          }
        }
      });
    }
  }
);

// КОПИРОВАНИЕ ПАПКИ ASSETS

fs.access(
  path.join(__dirname, "project-dist", "assets"),
  fs.constants.F_OK,
  (err) => {
    if (err) {
      fs.mkdir(path.join(__dirname, "project-dist", "assets"), (err) => {
        if (err) {
          console.log(
            "Папка project-dist/assets уже существует, данные в ней перезаписаны"
          );
        }
      });
    }
  }
);

fs.readdir(
  path.join(__dirname, "assets"),
  { withFileTypes: true },
  (err, dirs) => {
    if (err) console.log(err);
    else {
      dirs.forEach((dir) => {
        let dirPath = path.join(__dirname, "assets", dir.name);
        let dirPathNew = path.join(
          __dirname,
          "project-dist",
          "assets",
          dir.name
        );

        fs.readdir(dirPathNew, { withFileTypes: true }, (err, filesOld) => {
          if (err) console.log(`Папка assets/${dir.name} была скопирована`);
          else {
            filesOld.forEach((fileOld) => {
              fs.unlink(path.join(dirPathNew, fileOld.name), (err) => {
                if (err) throw err;
              });
            });
          }
        });

        fs.access(dirPathNew, fs.constants.F_OK, (err) => {
          if (err) {
            fs.mkdir(dirPathNew, (err) => {
              if (err) {
                console.log(
                  `Папка project-dist/assets/${dir.name} уже существует, данные в ней перезаписаны`
                );
              }
            });
          }
        });

        fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
          if (err) console.log(err);
          else {
            files.forEach((file) => {
              let filePath = path.join(dirPath, file.name);
              let filePathNew = path.join(dirPathNew, file.name);

              fs.copyFile(filePath, filePathNew, (err) => {
                if (err) throw err;
              });
            });
          }
        });
      });
    }
  }
);

