//FILE IS USED, thank you for your time bye!

const fs = require('fs');
const path = require('path');

console.log("reading file");
let rawdata = fs.readFileSync(path.resolve(__dirname, '../assets/us-county-boundaries.json'));
let data = JSON.parse(rawdata);
console.log("Built json I guess");
console.log(data.length);

//load the data

//loop through each county
  //copy object to variable, clear that index
  //add to map with key to be the abbreviation, capitalized of the state

let build = {};

for(let i = 0; i < data.length; i++) {
  let county = data[i];
  data[i] = null; //clear it
  if(!build[county['fields']['stusab']]) {
    //create default array
    build[county['fields']['stusab']] = [];
    //create directory as well...
    // console.log("Ok, so the unknown thingy is..." + )
    fs.mkdirSync(`../states/${county['fields']['stusab']}`);
  }
  build[county['fields']['stusab']].push(county);
  county = null;
}

//loop through the resulting map, create folders and create a json file called counties.json
//pasting the contents of each state into it's own json file...yeahsssss
let count = 1;
for(let state in build) {
  // console.log(`${state} --> ${build[state].length} ${build[state].length <= 50 ? count++ : ""}`);
  let points = build[state].map(county => [county["fields"]["namelsad"], county["geometry"]["coordinates"]])
  fs.writeFileSync("../states/" + state + "/CountyBorders.json", JSON.stringify(build[state], null, 2));
  fs.writeFileSync("../states/" + state + "/FixedPoints.json", "{}");
  fs.writeFileSync("../states/" + state + "/Summary.json", JSON.stringify({ totalCounties: build[state].length }, null, 2));
  fs.writeFileSync("../states/" + state + "/CountyPoints.json", JSON.stringify(points, null, 2));
  
}