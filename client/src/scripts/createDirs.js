const fs = require('fs');
const path = require('path');

let rawdata = fs.readFileSync(path.resolve(__dirname, '../assets/CoordsAndState.json'));
let data = JSON.parse(rawdata);

// console.log(data);

//load the data

//loop through each county
  //copy object to variable, clear that index
  //add to map with key to be the abbreviation, capitalized of the state

for(let i = 0; i < data.length; )

//loop through the resulting map, create folders and create a json file called counties.json
//pasting the contents of each state into it's own json file...yeahsssss


