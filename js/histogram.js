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
    // width: 260,
    // height: 300,
    margin: { t: 30, r: 50, b: 50, l: 60 },

    bargap: 0.1,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    // bgcolor: rgb(0, 0, 0, 0),
    // bargroupgap: 0.2,

    // barmode: "overlay",
    // title_text: "RDOF Distribution Per CBG",
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
  Plotly.newPlot("container", data, layout);

  // var width = 200;
  // var height = 250;
  // var margin = { top: 15, right: 15, bottom: 40, left: 25 };
  // // we are appending SVG first

  // var x = d3
  //   .scaleLinear()
  //   .domain(d3.extent(data))
  //   .nice()
  //   .range([margin.left, width - margin.right]);

  // var bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(12))(data);

  // var y = d3
  //   .scaleLinear()
  //   .domain([0, d3.max(bins, (d) => d.length)])
  //   .nice()
  //   .range([height - margin.bottom, margin.top]);

  // var yAxis = (g) =>
  //   g
  //     .attr("transform", `translate(${margin.left},0)`)
  //     .call(d3.axisLeft(y).ticks(height / 40))
  //     .call((g) => g.select(".domain").remove())
  //     .call((g) =>
  //       g
  //         .select(".tick:last-of-type text")
  //         .clone()
  //         .attr("x", 0)
  //         .attr("y", -20)
  //         .attr("text-anchor", "start")
  //         .attr("font-weight", "bold")
  //         .attr("font-size", "10px")
  //         .text("Number of CBGs")
  //     );

  // var xAxis = (g) =>
  //   g
  //     .attr("transform", `translate(0,${height - margin.bottom})`)
  //     .call(
  //       d3
  //         .axisBottom(x)
  //         .ticks(width / 40)
  //         .tickSizeOuter(0)
  //     )
  //     .call(
  //       (g) =>
  //         g
  //           .append("text")
  //           .attr("x", width - margin.right)
  //           .attr("y", 30)
  //           .attr("fill", "currentColor")
  //           .attr("font-weight", "bold")
  //           .attr("text-anchor", "end")
  //           .attr("font-size", "10px")
  //           .text("Reserve Price Per Locations")
  //       //   .text("Number of ISPs")
  //     );

  // var svg = d3
  //   .select("div#container")
  //   .append("svg")
  //   .attr("viewBox", [0, 0, width, height]);

  // svg
  //   .append("g")
  //   .attr("fill", "#4e5dc1")
  //   .selectAll("rect")
  //   .data(bins)
  //   .join("rect")
  //   .attr("x", (d) => x(d.x0) + 1)
  //   .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
  //   .attr("y", (d) => y(d.length))
  //   .attr("height", (d) => y(0) - y(d.length));

  // svg.append("g").attr("class", "axiswhite").call(xAxis);

  // svg.append("g").attr("class", "axiswhite").call(yAxis);
}
