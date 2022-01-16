async function main() {

  // Creating the map object
  const myMap = L.map("map", {
    center: [37.09024, -95.712891],
    zoom: 5
    // layers: [streetMap, quakeMarkers]
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap); 



  // Perform a GET request to the query URL/
  const queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
  const response =  await fetch(queryUrl);
  const data = await response.json();
   
  const features = data.features;
  // console.log(features);

  // THIS ADDS MARKER, but not the right type
  // Creating a GeoJSON layer with the retrieved data
  // L.geoJson(data).addTo(myMap);

  // array to store the quake locations
  const quakeMarkers = [];
  // const quakeMarkers = L.circle();

  //iterate through data to grab details
  for(let i = 0; i < features.length; i++ ) {
    let quake = features[i];
    let location = quake.properties.place
    let magnitude = quake.properties.mag;
    let depth = quake.geometry.coordinates[2];
    // let date= new Date(time);
    let time = quake.properties.time;
    // console.log(date)
      
    let quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
      colorOpacity:.5,
      color: '#FF0000',   
      fillOpacity: .25,
      fillColor: '#FF0000', 
      radius: magnitude * 10000
      })
      .bindPopup("<H1>" + location + '<H1>' +'<br>' + '<hr>' +
      '<h2>' + 'Magnitude: ' + magnitude + '<br>' + 
      'Depth: ' + depth +'<h2>');

      quakeMarkers.push(quakeMarker);

    // if (quake) {
    //   quakeMarkers.addLayer(L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
    //   .bindPopup(location));
    }
  }
    
  //  adding overlay layer
  let quakeLayer = L.layerGroup(quakeMarkers);

  // adding tile layers
  // let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	//   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  // });

  let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
        
  // creating layer group 
  const overlayMaps = {
    'Earthquakes': quakeLayer
  };

  // creating tile group
  const baseMaps = {
    'Street Map': streetMap
    // Topography: topo
  }
 
    
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
};
  
main();
  