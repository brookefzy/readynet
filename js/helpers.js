function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function formatNumber2(num) {
  return num.toFixed(2).toString();
}
function currencyFormat(num) {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function getispnum(features) {
  let result = features.map((d) => d.properties.num_isp);
  return result;
}
function dealnan(a) {
  return a ? a : 0;
}

function getFIPS(features) {
  let result = features.map((d) => d.properties.FIPS_cbg);
  return result;
}

function getRDOFpriceLocs(features) {
  let result = features.map(
    (d) => dealnan(d.properties.reserve) / dealnan(d.properties.locations) + 1
  );
  return result;
}
function uniqueISPs(features) {
  let result = Array.from(new Set(features.map((s) => s.DBAName))).map(
    (DBAName) => {
      return {
        DBAName: DBAName,
        HoldingCompanyName: features.find((s) => s.DBAName === DBAName)
          .HoldingCompanyName,
        MaxAdDown: features.find((s) => s.DBAName === DBAName).MaxAdDown,
        MaxAdUp: features.find((s) => s.DBAName === DBAName).MaxAdUp,
        is_fiber: features.find((s) => s.DBAName === DBAName).is_fiber,
      };
    }
  );
  return result;
}
