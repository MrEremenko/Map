const fs = require('fs');
const path = require('path');

let rawdata = fs.readFileSync(path.resolve(__dirname, 'CoordsAndState.json'));
let data = JSON.parse(rawdata);

console.log(data);

let build = [];

let prevState = "";
let tempArr = [];

for(let i = 0; i < data.length; i++) {
  if(prevState !== data[i][2]) {
    if(tempArr.length > 0)
      build.push(tempArr);
    tempArr = [];
    prevState = data[i][2];
  }

  tempArr.push([data[i][0], data[i][1]]);
}
build.push(tempArr);

// console.log(build);

fs.writeFileSync(path.resolve(__dirname, 'orgByState.json'), JSON.stringify(build));