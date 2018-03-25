var usdPrice = [];
var xhttp = new XMLHttpRequest();
var url = "https://api.coinmarketcap.com/v1/ticker/"
xhttp.responseType = 'json';
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    for (var i = 0; i < this.response.length; i++) {
      var name = this.response[i].name;
      var price = this.response[i].price_usd;
      usdPrice.push({"name": name, "price": price});
    }
  }
};
console.log(usdPrice);
xhttp.open("GET", url, true);
xhttp.send();

var svg = d3.select("svg");
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(usdPrice.map(function(d) {return d.name;}));
y.domain([0, d3.max(usdPrice, function(d) {return d.price;})]);

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("USD Price");

g.selectAll(".bar")
  .data(usdPrice)
  .enter()
  .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {return x(d.name);})
    .attr("y", function(d) {return y(d.price);})
    .attr("width", x.bandwidth())
    .attr("height", function(d) {return height - y(d.price);});
