mapboxgl.accessToken =
  "pk.eyJ1IjoieXVhbnpmIiwiYSI6ImNrOXc4a3VwbzA2eGkzZHJ6bzg4anNpaHMifQ.xSyKndi9kO3wlTEnVnrDzA";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/yuanzf/ckal3mosv3iop1iryrrxdc7u0", //readybasemap
  center: [-69.4455, 45.2538],
  minZoom: 3,
  zoom: 6,
});

// Disable default box zooming.
map.boxZoom.disable();
var dataurl =
  "https://raw.githubusercontent.com/brookefzy/readynet/master/data/03_isp_sample.csv";
map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

// add popup
var popup = new mapboxgl.Popup({
  closeButton: false,
});

map.on("load", function () {
  var layers = map.getStyle().layers;

  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }
  var canvas = map.getCanvasContainer();

  // Variable to hold the starting xy coordinates
  // when `mousedown` occured.
  var start;

  // Variable to hold the current xy coordinates
  // when `mousemove` or `mouseup` occurs.
  var current;

  // Variable for the draw box element.
  var box;

  map.addSource("cbg", {
    type: "vector",
    url: "mapbox://yuanzf.6jvap7l2",
  });
  map.addLayer({
    id: "map2",
    source: "cbg",
    "source-layer": "RDOF_all-6zoxdq",
    type: "fill",
    paint: { "fill-color": "#fff", "fill-opacity": 0 },
  });

  map.addLayer(
    {
      id: "map2-highlighted",
      source: "cbg",
      "source-layer": "RDOF_all-6zoxdq",
      type: "fill",
      layout: {
        // make layer visible by default
        //   visibility: "visible",
      },

      paint: {
        "fill-color": {
          property: "locations",
          stops: [
            [0, "#fff"],
            [1, "#b0b6e8"],
            [600, "#4e5dc1"],
            [1200, "#8b38c7"],
            [1800, "#da587d"],
          ],
        },
        "fill-opacity": 0.75,
        "fill-outline-color": "#fff",
      },
      filter: ["in", "FIPS_cbg", ""],
    },
    firstSymbolId,
    "road-simple"
  );

  canvas.addEventListener("mousedown", mouseDown, true);

  function getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    var uniqueFeatures = array.filter(function (el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    });

    return uniqueFeatures;
  }

  // Return the xy coordinates of the mouse position
  function mousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return new mapboxgl.Point(
      e.clientX - rect.left - canvas.clientLeft,
      e.clientY - rect.top - canvas.clientTop
    );
  }

  function mouseDown(e) {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.button === 0)) return;

    // Disable default drag zooming when the shift key is held down.
    map.dragPan.disable();

    // Call functions for the following events
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keydown", onKeyDown);

    // Capture the first xy coordinates
    start = mousePos(e);
  }

  function onMouseMove(e) {
    // Capture the ongoing xy coordinates
    current = mousePos(e);

    // Append the box element if it doesnt exist
    if (!box) {
      box = document.createElement("div");
      box.classList.add("boxdraw");
      canvas.appendChild(box);
    }

    var minX = Math.min(start.x, current.x),
      maxX = Math.max(start.x, current.x),
      minY = Math.min(start.y, current.y),
      maxY = Math.max(start.y, current.y);

    // Adjust width and xy position of the box element ongoing
    var pos = "translate(" + minX + "px," + minY + "px)";
    box.style.transform = pos;
    box.style.WebkitTransform = pos;
    box.style.width = maxX - minX + "px";
    box.style.height = maxY - minY + "px";
  }

  function onMouseUp(e) {
    // Capture xy coordinates
    finish([start, mousePos(e)]);
  }

  function onKeyDown(e) {
    // If the ESC key is pressed
    if (e.keyCode === 27) finish();
  }

  function finish(bbox) {
    // Remove these events now that finish has been called.
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("mouseup", onMouseUp);

    if (box) {
      box.parentNode.removeChild(box);
      box = null;
    }

    // If bbox exists. use this value as the argument for `queryRenderedFeatures`
    if (bbox) {
      var features = map.queryRenderedFeatures(bbox, {
        layers: ["map2"],
      });

      if (features.length >= 2000) {
        return window.alert("Select a smaller number of features");
      }
      if (features.length > 0) {
        var uniqueFeatures = getUniqueFeatures(features, "FIPS_cbg");
        // downloadjson(uniqueFeatures);
        // downloadcsv(uniqueFeatures);

        isparray = getRDOFpriceLocs(uniqueFeatures);

        if (isparray.length > 0) {
          var k = document.getElementsByClassName("notice");
          var allresults = document.getElementsByClassName("results");
          var i;
          for (i = 0; i < k.length; i++) {
            k[i].style.display = "none";
          }
          for (i = 0; i < allresults.length; i++) {
            allresults[i].style.display = "inline-block";
          }
          //////////////////////////////////////////////////////////////////////
          // Change the RDOF Tab////////////////////////////////////////////////
          //////////////////////////////////////////////////////////////////////
          document.getElementsByClassName("row")[0].style.display = "flex";
          document.getElementById("rdofBoxleft").className = "results left";
          document.getElementById("rdofBoxright").className = "results right";

          document.getElementById("rdofBoxleft").innerHTML =
            "<p>Total CBGs Selected: <br><span class = 'strong'>" +
            uniqueFeatures.length +
            "</span></p><p>Average Price/Location: <br><span class = 'strong'>" +
            currencyFormat(
              getRDOFTotal(uniqueFeatures) /
                (getLocationTotal(uniqueFeatures) + 1)
            ) +
            "</span></p>";

          document.getElementById("rdofBoxright").innerHTML =
            "<p>Total Eligible Locations:  <br><span class = 'strong'>" +
            formatNumber(getLocationTotal(uniqueFeatures)) +
            "</span></p><p>Total Reserved Price: <br><span class = 'strong'>" +
            currencyFormat(getRDOFTotal(uniqueFeatures)) +
            "</span></p>";

          document.getElementById("histo_container").innerHTML = "";

          createhistogram(isparray);

          //////////////////////////////////////////////////////////////////////
          // Change the ACS Tab////////////////////////////////////////////////
          //////////////////////////////////////////////////////////////////////
          document.getElementsByClassName("row")[1].style.display = "flex";
          document.getElementById("acsBoxleft").className = "results left";
          document.getElementById("acsBoxright").className = "results right";

          document.getElementById("acsBoxleft").innerHTML =
            "<p>Population: <br><span class = 'strong'>" +
            getTotPop(uniqueFeatures) +
            "</span></p><p>Median Household Income: <br><span class = 'strong'>" +
            getincome(uniqueFeatures) +
            "</span></p><p>% Owner Occupied Housing: <br><span class = 'strong'>" +
            getowner(uniqueFeatures) +
            "</span></p>";

          document.getElementById("acsBoxright").innerHTML =
            "<p>% with Bachelor Degree: <br><span class = 'strong'>" +
            getEdu(uniqueFeatures) +
            "</span></p><p>% over 65: <br><span class = 'strong'>" +
            getsenior(uniqueFeatures) +
            "</span></p><p>Number of ISPs: <br><span class = 'strong'>" +
            getISPsum(uniqueFeatures) +
            "</span></p>";

          cbgfips = getFIPS(uniqueFeatures);
        }

        /////////////////////////////////////////////////////////////////
        /////////////////////////ISPs DATA///////////////////////////////
        /////////////////////////////////////////////////////////////////

        d3.csv(dataurl).then(function (isps) {
          // console.log(isps)
          var selisps = isps.filter((i) => cbgfips.includes(i.FIPS_cbg));
          var uniqisps = uniqueISPs(selisps);
          // console.log(uniqisps);
          buildISPList(uniqisps);
        });

        // d3.json(dataurl).then(function (isps) {
        //   var query = { FIPS_cbg: cbgfips };
        //   var selisps = isps.filter(search, query);

        //   function search(user) {
        //     return Object.keys(this).every((key) => user[key] === this[key]);
        //   }
        //   buildISPList(selisps);
        // });

        cbgs = uniqueFeatures;
      }

      // Run through the selected features and set a filter
      // to match features with unique FIPS codes to activate
      // the `counties-highlighted` layer.
      var filter = features.reduce(
        function (memo, feature) {
          memo.push(feature.properties.FIPS_cbg);
          return memo;
        },
        ["in", "FIPS_cbg"]
      );

      map.setFilter("map2-highlighted", filter);
    }

    map.dragPan.enable();
  }

  //   map.on("mousemove", function (e) {
  //     var counties = map.queryRenderedFeatures(e.point, {
  //       layers: ["rdofcounty"],
  //     });

  //     if (counties.length > 0) {
  //       // console.log(counties)
  //       document.getElementById("pd").innerHTML =
  //         "<h3><strong>" +
  //         counties[0].properties.county_nam +
  //         " County</h3></strong>" +
  //         "<h5><p>Eligible Locations: <strong></p>" +
  //         formatNumber(counties[0].properties.location) +
  //         "</strong><p> Total Reserved Price: <strong></p>" +
  //         currencyFormat(counties[0].properties.price) +
  //         "</strong></h5>";
  //     } else {
  //       document.getElementById("pd").innerHTML =
  //         "<h3>Hover over a county!</h3><h5><p>Eligible Locations: </p>0<br><p>Reserved Price: </p>0<br></h5>";
  //     }
  //   });

  var listings = document.getElementById("listings");
  function buildISPList(data) {
    listings.innerHTML = "";
    data.forEach(function (isp, i) {
      /* Add a new listing section to the listing. */

      var listing = listings.appendChild(document.createElement("div"));
      /* Assign a unique `id` to the listing. */
      listing.id = "listing-" + isp.id;
      /* Assign the `item` class to each listing for styling. */
      listing.className = "item";

      /* Add the link to the individual listing created above. */
      var link = listing.appendChild(document.createElement("a"));
      link.href = "#";
      link.className = "title";
      link.id = "link-" + isp.id;
      link.innerHTML =
        isp.DBAName +
        "  <span class = 'holding'>" +
        isp.HoldingCompanyName +
        "</span>";

      /* Add details to the individual listing. */
      var details = listing.appendChild(document.createElement("p"));

      details.innerHTML =
        "<table>" +
        "<tr><td>Download Speed:</td><td>" +
        isp.MaxAdDown +
        "</td><td>Number of States:</td><td>" +
        0 +
        // isp.number_of_states +
        "</td></tr>" +
        "<tr><td>Upload Speed:</td><td>" +
        isp.MaxAdUp +
        "</td><td>Estimated Population:</td><td>" +
        0 +
        // isp.estimated_population_covered +
        "</td></tr>" +
        "<tr><td>Technology:</td><td>" +
        0 +
        // isp.technology_types +
        "</td><td>Website:</td><td>" +
        "www.isp." +
        // isp.website +
        "</td></tr>" +
        "<tr><td>Offers Business Service:</td><td>" +
        "Not Known" +
        // isp.offers_business_service +
        "</td><td>Phone:</td><td>" +
        "(215) 000000" +
        // isp.phone +
        "</td></tr></table>";
    });
  }

  map.on("mousemove", function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["map2-highlighted"],
    });

    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = features.length ? "pointer" : "";

    if (!features.length) {
      popup.remove();
      return;
    }

    var feature = features[0];

    popup
      .setLngLat(e.lngLat)
      .setHTML(
        "<p>Census Block Group ID: " +
          feature.properties.FIPS_cbg +
          "</p>" +
          "</h2><p>Local Population: " +
          formatNumber(feature.properties.pop) +
          "</p><br>" +
          "<h3><strong>Eligible Locations: </strong></h3><h2>" +
          formatNumber(feature.properties.locations) +
          "<br></h2><h3><strong>Reserved Price: </strong></h3><h2>" +
          currencyFormat(feature.properties.reserve)
      )
      .addTo(map);
  });
});

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
});

document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
