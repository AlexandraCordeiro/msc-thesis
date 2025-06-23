import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const colorScheme = [
  "#b589fc",
  "#a0cafa",
  "#fcab58",
  "#58fca0",
  "#fc5858",
  "#58a0fc",
  "#fc58b5",
  "#a0fc58",
  "#fcfc58",
  "#5858fc"
]

let scaleRadial = (num) => {
    return d3.scaleRadial()
    .range([innerRadius, outterRadius])
    .domain([0, num])
}

d3.csv("data.csv").then((data) => {
    const svg = d3.select("#viz").append("svg").attr("width", window.innerWidth).attr("height", window.innerHeight)

    //Container for the gradients
    var defs = svg.append("defs");

    //Filter for the outside glow
    var filter = defs.append("filter")
    .attr("id","glow");
    filter.append("feGaussianBlur")
    .attr("stdDeviation","2.5")
    .attr("result","coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
    feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");

    const r = 250
    let tune = data[8]
    let num = tune.rhyme.split(",").length
    let ang = (2 * Math.PI) / num
    let rhyme = tune.rhyme.split(",")

    let arcs = []

    for (let i = 0; i < rhyme.length; i++) {
        let source = rhyme[i]
        for (let j = i + 1; j < rhyme.length; j++) {
            let target = rhyme[j]
            if (source == target && source != "") {
                arcs.push({source: i, target: j})
            }
        }
    }

    console.log(rhyme)
    console.log(arcs)

    svg
    .append("circle")
    .attr("transform", `translate(${window.innerWidth * 0.5}, ${window.innerHeight * 0.5})`)
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", r)
    .attr("fill", "none")
    .attr("stroke", "#b589fc")
    .lower()

    const line = d3.line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveBundle)


    if (arcs.length > 0) {
        svg.selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("transform", `translate(${window.innerWidth * 0.5}, ${window.innerHeight * 0.5})`)
        .attr("d", d => {
            
            const x1 = r * Math.cos(ang * d.source)
            const y1 = r * Math.sin(ang * d.source)
            const x2 = r * Math.cos(ang * d.target)
            const y2 = r * Math.sin(ang * d.target)
            const xm = (x1 + x2) / 2
            const ym = (y1 + y2) / 2

            const points = [
            {x: x1, y: y1},
            {x: xm, y: ym},
            {x: x2, y: y2}
            ]
            return line(points)
        })
        .attr("fill", "none")
        .attr("stroke", d => colorScheme[+rhyme[d.source] - 1] || "#ccc")
        .attr("stroke-width", "1.5px")
        .attr("opacity", 0.7)
    }

    svg.selectAll(".nodes")
    .data(rhyme)
    .enter()
    .append("circle")
    .attr("class", "nodes")
    .attr("transform", `translate(${window.innerWidth * 0.5}, ${window.innerHeight * 0.5})`)
    .attr("cx", (d, i) => r * Math.cos(ang * i))
    .attr("cy", (d, i) => r * Math.sin(ang * i))
    .attr("r", 10)
    .attr("fill", d => {
        if (d == "") {
            return "white"
        }
        else {
            return colorScheme[+d - 1]
        }
    })
    .attr("stroke", d => {
        if (d == "") {
            return "#b589fc"
        }
        else {
            return "none"
        }
    })

    // d3.selectAll(".nodes").style("filter", "url(#glow)")
    
})