const express = require("express");
const router = express.Router();

const fs = require('fs');
const path = require('path');


router.post("/update", async (req, res) => {
  console.log(req.body);
  if(!req.body.county || !req.body.state || !req.body.lat || !req.body.lng) {
    return res.status(400).json("cmon, no county, state or coords fellas");
  }
  let rawdata = fs.readFileSync(path.resolve(__dirname, `../../client/src/states/${req.body.state}/FixedPoints.json`));
  let data = JSON.parse(rawdata);
  console.log("Built json:");
  console.log(data);
  data[req.body.county] = [req.body.lng, req.body.lat];
  fs.writeFileSync(path.resolve(__dirname, `../../client/src/states/${req.body.state}/FixedPoints.json`), JSON.stringify(data, null, 2));
  return res.status(200).json("Got it boys");
});


module.exports = router