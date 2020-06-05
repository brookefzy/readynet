function downloadjson(features) {
  var data =
    "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(features));

  var a = document.createElement("a");
  a.href = "data:" + data;
  a.download = "data.json";
  a.innerHTML = "Download JSON";
  var container = document.getElementById("downloadJSON");
  container.replaceWith(a);
}

function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ",";
  lineDelimiter = args.lineDelimiter || "\n";

  keys = Object.keys(data[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

function downloadcsv(features) {
  var data, filename, link;
  var csv = convertArrayOfObjectsToCSV({
    data: features,
  });
  if (csv == null) return;

  filename = "data.csv";

  if (!csv.match(/^data:text\/csv/i)) {
    csv = "data:text/csv;charset=utf-8," + csv;
  }
  data = encodeURI(csv);

  // link = document.getElementById("downloadCSV");
  // link.setAttribute("href", data);
  // link.setAttribute("download", filename);
  // link.click();
  var a = document.createElement("a");
  a.href = "data:" + data;
  a.download = "data.csv";
  a.innerHTML = "Download CSV";
  var container = document.getElementById("downloadCSV");
  container.replaceWith(a);
}

// $(function () {
//   $("#downloadMap").click(function () {
//     html2canvas($("#map"), {
//       onrendered: function (canvas) {
//         theCanvas = canvas;
//         document.body.appendChild(canvas);

//         canvas.toBlob(function (blob) {
//           saveAs(blob, "map.png");
//         });
//       },
//     });
//   });
// });
