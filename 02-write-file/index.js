const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите произвольный текст?\n');
stdin.on('data', data => {
    const dataString = data.toString();
    if(dataString.trim() === 'exit'){
        goodbye();
    }
    output.write(dataString);  
});

function goodbye() {
    stdout.write('Удачи в изучении JS!');
    process.exit();
}
process.on('SIGINT', goodbye);

