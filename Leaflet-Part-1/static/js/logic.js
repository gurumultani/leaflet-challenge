// Fetch earthquake data from USGS GeoJSON feed
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  // Create Leaflet map
  var map = L.map("map").setView([37.09, -95.71], 4);

  // Add tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Create a layer group for the markers
  var markers = L.layerGroup().addTo(map);

  // Iterate through the earthquake data
  data.features.forEach(function(earthquake) {
    // Get the magnitude and depth of the earthquake
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];

    // Create a circle marker for each earthquake
    var marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      radius: magnitude * 5, // Adjust the radius based on the magnitude
      fillColor: getColor(depth), // Get the color based on the depth
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });

    // Create a popup for each marker
    marker.bindPopup("<b>Magnitude:</b> " + magnitude + "<br><b>Depth:</b> " + depth);

    // Add the marker to the layer group
    marker.addTo(markers);
  });

  // Create a legend control
  var legend = L.control({ position: "bottomright" });

  // Define the legend content
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    div.innerHTML += '<i style="background: #ff0000"></i> Depth > 100 km<br>';
    div.innerHTML += '<i style="background: #ff6600"></i> Depth > 50 km<br>';
    div.innerHTML += '<i style="background: #ffcc00"></i> Depth > 10 km<br>';
    div.innerHTML += '<i style="background: #ffff00"></i> Depth <= 10 km<br>';
    return div;
  };

  // Add the legend to the map
  legend.addTo(map);
}).catch(function(error) {
  console.log(error);
});

// Function to get color based on depth
function getColor(depth) {
  if (depth > 100) {
    return "#ff0000";
  } else if (depth > 50) {
    return "#ff6600";
  } else if (depth > 10) {
    return "#ffcc00";
  } else {
    return "#ffff00";
  }
}