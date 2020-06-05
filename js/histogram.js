//------------------------SVG PREPARATION------------------------//

function createhistogram(data) {
  var trace = {
    x: data,
    type: "histogram",
    opacity: 0.9,
    text: data.map(String),
    textposition: "auto",

    marker: { color: "#a860d2" },
    // xbins: { size: 10 },#4e5dc1
  };
  var data = [trace];
  var layout = {
    width: 400,
    // height: 300,
    margin: { t: 0, r: 15, b: 95, l: 45 },

    bargap: 0.1,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",

    title_font: { family: "Montserrat", size: 12, color: "white" },
    xaxis: {
      automargin: true,
      title: "Reserve Price Per Locations",
      gridcolor: "rgba(0,0,0,0)",
      zerolinecolor: "rgba(0,0,0,0)",
      color: "rgba(255,255,255,0.5)",
    },
    yaxis: {
      automargin: true,
      title: "Number of CBGs",
      gridcolor: "rgba(255,255,255,0.1)",
      zerolinecolor: "rgba(255,255,255,0.3)",
      color: "rgba(255,255,255,0.5)",
    },
  };
  Plotly.newPlot("histo_container", data, layout);
}
