const monthlySales = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 18000 },
  { month: "Mar", value: 15000 },
  { month: "Apr", value: 22000 },
  { month: "May", value: 26000 },
  { month: "Jun", value: 30000 }
];

const categorySales = [
  { category: "Electronics", value: 42000 },
  { category: "Fashion", value: 28000 },
  { category: "Grocery", value: 18000 },
  { category: "Home", value: 24000 }
];

const width = 600;
const height = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const tooltip = d3.select("#tooltip");

const lineSvg = d3.select("#lineChart")
  .attr("width", width)
  .attr("height", height);

const xLine = d3.scalePoint()
  .domain(monthlySales.map(d => d.month))
  .range([margin.left, width - margin.right]);

const yLine = d3.scaleLinear()
  .domain([0, d3.max(monthlySales, d => d.value)])
  .nice()
  .range([height - margin.bottom, margin.top]);

lineSvg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(xLine));

lineSvg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yLine));

const line = d3.line()
  .x(d => xLine(d.month))
  .y(d => yLine(d.value));

lineSvg.append("path")
  .datum(monthlySales)
  .attr("fill", "none")
  .attr("stroke", "#38bdf8")
  .attr("stroke-width", 2)
  .attr("d", line);

lineSvg.selectAll("circle")
  .data(monthlySales)
  .enter()
  .append("circle")
  .attr("cx", d => xLine(d.month))
  .attr("cy", d => yLine(d.value))
  .attr("r", 4)
  .attr("fill", "#38bdf8")
  .on("mouseover", (e, d) => {
    tooltip.style("opacity", 1)
      .html(`₹ ${d.value}`)
      .style("left", e.pageX + 10 + "px")
      .style("top", e.pageY - 20 + "px");
  })
  .on("mouseout", () => tooltip.style("opacity", 0));

const barSvg = d3.select("#barChart")
  .attr("width", width)
  .attr("height", height);

const xBar = d3.scaleBand()
  .domain(categorySales.map(d => d.category))
  .range([margin.left, width - margin.right])
  .padding(0.3);

const yBar = d3.scaleLinear()
  .domain([0, d3.max(categorySales, d => d.value)])
  .nice()
  .range([height - margin.bottom, margin.top]);

barSvg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(xBar));

barSvg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yBar));

barSvg.selectAll("rect")
  .data(categorySales)
  .enter()
  .append("rect")
  .attr("x", d => xBar(d.category))
  .attr("y", d => yBar(d.value))
  .attr("height", d => yBar(0) - yBar(d.value))
  .attr("width", xBar.bandwidth())
  .attr("fill", "#22c55e")
  .on("mouseover", (e, d) => {
    tooltip.style("opacity", 1)
      .html(`${d.category}<br>₹ ${d.value}`)
      .style("left", e.pageX + 10 + "px")
      .style("top", e.pageY - 20 + "px");
  })
  .on("mouseout", () => tooltip.style("opacity", 0));
