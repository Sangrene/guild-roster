const fs = require("fs");

const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8",(err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
}

const writeFileAsync = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile (file, JSON.stringify(data), function(err) {
      if(err) reject(err);
      else resolve();
    });
  });
}

module.exports =  {
  readFileAsync, writeFileAsync
}
