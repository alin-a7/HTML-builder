const fs = require('fs');
const path = require('path');

const readTextStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readTextStream.on('data', chunk => console.log(chunk));