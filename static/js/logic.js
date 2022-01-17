async function main() {

  // Creating the map object
  const myMap = L.map("map", {
    center: [37.09024, -95.712891],
    zoom: 3.5
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
    let location = quake.properties.place;
    let magnitude = quake.properties.mag;
    let depth = quake.geometry.coordinates[2];
    let date= new Date(quake.properties.time);
    let color = depth > 89? 'crimson  ': 
                depth > 69? 'tomato': 
                depth > 49? 'orange': 
                depth > 29? 'yellow': 
                depth > 9? 'green': 
                'lightgreen'; 
    // define the markers
    let quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
      colorOpacity:.25,
      color: color,
      weight: 1,   
      fillOpacity: .25,
      fillColor: color, 
      radius: magnitude * 20000
      })
      .bindPopup("<H2>" + location + '<H2>' + '<hr>' +
      '<h4>' + 'Magnitude: ' + magnitude + '<br>' + 
      'Depth: ' + depth + '<br>' + 'Date: ' + date  + '<h4>');

      quakeMarkers.push(quakeMarker);
      

    }

    
  //  adding overlay layer
  let quakeLayer = L.layerGroup(quakeMarkers);

  // adding tile layers
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
        
  // creating layer group 
  const overlayMaps = {
    'Earthquakes': quakeLayer
  };

  // creating tile group
  const baseMaps = {
    'Street Map': streetMap,
    'Topography': topo
  }
 
  myMap.addLayer(quakeLayer)
  myMap.addLayer(streetMap)
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // FIRST OPTION
  // function chooseColor(depthIntervals) {
  //   switch(true) {
  //     case depthInterval < 10: 
  //         return "#3366ff";
  //     case depth < 30: 
  //         return "#6666ff";
  //     case depth < 50: 
  //         return "#9966ff";
  //     case depth < 70: 
  //         return "#cc33ff";
  //     case depth < 90: 
  //         return "#ff00ff";
  //     default:
  //         return "#cc0099";
  //   }
  // }    
  // Creating earthquake legend
  // var legend = L.control({position: 'bottomright'});
  //       legend.onAdd = function () {
  //     var div = L.DomUtil.create('div', 'info legend'),
  //       depthIntervals = [0, 10, 30, 50, 70, 90];
  //   // loop through our depth intervals, create a label for each
  //       for (var i = 0; i < depthIntervals.length; i++) {
  //         div.innerHTML +=
  //           '<i style="background:' + color(depthIntervals[i] + 1) + '"></i> ' +
  //           depthIntervals[i] + (depthIntervals[i + 1] ? '&ndash;' + depthIntervals[i + 1] + '<br>' : '+');
  //       }
  //     return div;
  //     };

  //   legend.addTo(myMap);
  
// SECOND OPTION
// var legend= L.control({position: 'bottomright'});
// legend.onAdd=function(myMap){
//     var div=L.DomUtil.create('div','legend');
//     var labels = ['<strong>depth</strong>']
//     var depth = ['0-9','10-29','30-49','50-69','70-89','90+'];
//     var colors =['lightgreen','green','yellow','orange','red', 'crimson']
//     div.innerHTML='<div><b>Legend</b></div';
//     for(var i = 0; i<depth.length; i++){
//         labels.push(
//         div.innerHTML +=  "<i style='background:" + colors[i] + "'></i> " +
//         depth[i] + (depth[i + 1] ? ""  + "<br>" : ""));
//         labels.push(
//          div.innerHTML +=  "<i style='background:" + colors[i] + "'></i> " +
//         colors[i] + (colors[i + 1] ? ""  + "<br>" : ""))
//     }
//     return div;
// }


// THIRD OPTION
  function getColor(d) {
    return d > 90 ? 'crimson' :
          d > 70  ? 'tomato' :
          d > 50  ? 'orange' :
          d > 30  ? 'yellow' :
          d > 10   ? 'green' :
          'lightgreen';
  }

  // var legend= L.control({position: 'bottomright'});

  // legend.onAdd = function(myMap) {

  // var div=L.DomUtil.create('div','legend');
  // var labels = ['<strong>depth</strong>'];
  // var depth = [-10, 10, 30,50,70,90,91];
  // for(var i = 0; i<depth.length; i++){
  //   div.innerHTML+= labels.push(
  //   "<i style='background:" + getColor(depth[i]) + "'></i> " +
  //   depth[i] + (depth[i + 1] ? ""  + "<br>" : ""));
  // }
  // return div;
  // }

  // legend.addTo(myMap)

  // FOURTH OPTION
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function (myMap) {
  var div = L.DomUtil.create('div', 'info legend');
  var depth = [0, 10, 30, 50, 70, 90];
  var legendtitle = "<h4> Earthquake Depth (km)</h4>";
  div.innerHTML = legendtitle
      // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < depth.length; i++) {
      div.innerHTML += 
          '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
   }
  
  return div;
  };
  
  legend.addTo(myMap);

// FIFTH OPTION
// var legend= L.control({position: 'bottomright'});
// legend.onAdd=function(){
//     var div=L.DomUtil.create('div','legend');
//     var depth=[
//         "0 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"
//     ];
//     var colors= [
//         'lightgreen', 'green', 'yellow', 'orange', 'tomato', 'crimson'
//     ];
//     //create title
//     var legendtitle="<h4> Earthquake Depth (km)</h4>";
//     div.innerHTML=legendtitle
//     // create labels array for legend values
//     var labels=[];
//     for (var i = 0; i < depth.length; i++) {
//         div.innerHTML += labels.push(
//           "<i style='background: " + colors[i] + "'></i> " +
//           depth[i] + (depth[i + 1] ? ""  + "<br>" : ""));
//         }
//         return div;
//       };
// legend.addTo(myMap)

}

main()