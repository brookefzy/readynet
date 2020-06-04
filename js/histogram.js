//------------------------SVG PREPARATION------------------------//

function createhistogram(data) {
  var trace = {
    x: data,
    type: "histogram",
    opacity: 0.9,

    marker: { color: "#da587d" },
    // xbins: { size: 10 },#4e5dc1
  };
  var data = [trace];
  var layout = {
    width: 260,
    height: 300,
    margin: { t: 30, r: 50, b: 50, l: 60 },

    bargap: 0.1,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",

    title_font: { family: "Montserrat", size: 12, color: "white" },
    xaxis: {
      automargin: true,
      title: "Reserve Price Per Locations",
      gridcolor: "rgba(0,0,0,0)",
      zerolinecolor: "rgba(0,0,0,0)",
      color: "white",
    },
    yaxis: {
      automargin: true,
      title: "Number of CBGs",
      gridcolor: "rgba(0,0,0,0)",
      zerolinecolor: "white",
      color: "white",
    },
  };
  Plotly.newPlot("histo_container", data, layout);
}
