const margin = { top: 20, right: 30, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

let data = [
  { category: "Product A", value: 45 },
  { category: "Product B", value: 78 },
  { category: "Product C", value: 32 },
  { category: "Product D", value: 91 },
  { category: "Product E", value: 56 },
  { category: "Product F", value: 67 },
];

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div").attr("class", "tooltip");

const x = d3.scaleBand().range([0, width]).padding(0.2);

const y = d3.scaleLinear().range([height, 0]);

const xAxis = svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0,${height})`);

const yAxis = svg.append("g").attr("class", "axis");

svg
  .append("text")
  .attr("class", "axis-label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("fill", "#666")
  .text("Products");

svg
  .append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -45)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("fill", "#666")
  .text("Sales Value");

const colorScale = d3
  .scaleSequential()
  .domain([0, 100])
  .interpolator(d3.interpolateViridis);

function render() {
  x.domain(data.map((d) => d.category));
  y.domain([0, d3.max(data, (d) => d.value) * 1.1]);

  xAxis.transition().duration(750).call(d3.axisBottom(x));
  yAxis.transition().duration(750).call(d3.axisLeft(y));

  const bars = svg.selectAll(".bar").data(data, (d) => d.category);

  bars
    .exit()
    .transition()
    .duration(500)
    .attr("y", height)
    .attr("height", 0)
    .remove();

  const barsEnter = bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.category))
    .attr("width", x.bandwidth())
    .attr("y", height)
    .attr("height", 0)
    .attr("rx", 4)
    .style("cursor", "pointer");

  bars
    .merge(barsEnter)
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(200).attr("opacity", 0.7);

      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.category}</strong><br/>Value: ${d.value}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("opacity", 1);

      tooltip.style("opacity", 0);
    })
    .transition()
    .duration(750)
    .attr("x", (d) => x(d.category))
    .attr("y", (d) => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => colorScale(d.value));
}

function updateData() {
  data.forEach((d) => {
    d.value = Math.floor(Math.random() * 90) + 10;
  });
  render();
}

function sortBars(order) {
  data.sort((a, b) => {
    return order === "ascending" ? a.value - b.value : b.value - a.value;
  });
  render();
}

function addBar() {
  const letters = "GHIJKLMNOPQRSTUVWXYZ";
  const nextLetter = letters[data.length - 6] || "X";
  data.push({
    category: `Product ${nextLetter}`,
    value: Math.floor(Math.random() * 90) + 10,
  });
  render();
}


function removeBar() {
  if (data.length > 1) {
    data.pop();
    render();
  }
}

render();
