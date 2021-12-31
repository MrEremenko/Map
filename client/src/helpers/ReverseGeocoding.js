var openrouteservice = require("openrouteservice-js");

var geo = new openrouteservice.Geocode({ api_key: "5b3ce3597851110001cf62488de40f0a82c94f8b9ca3deafe96179ea" });

function getPointInfo({lat, lng}, callback) {
  console.log("Lat: " + lat);
  console.log("Lng: " + lng);
  geo.reverseGeocode({
    point: { lat_lng: [lat, lng], radius: 50 },
    // layers: ['county', 'state']
  })
  .then(function(response) {
    callback(response);
  })
  .catch(function(err) {
    var str = "An error occurred: " + err;
    console.log(str);
  });
}

module.exports = { getPointInfo }