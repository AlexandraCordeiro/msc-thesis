import { useRef, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import {drawNoteFrequencyRings, drawSparklines, midiToNote, cursorPoint, fontSize} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"

const mouseOver = (e, d, data, graphHeight, graphWidth, x) => {   
    

    let tooltip = d3.select("#tooltip-sparklines")
    let group = d3.select("#align-group").node()
    let r = 40
    
    d3.select(`#circle-${d}`)
    .transition()
    .attr("opacity", 0.3)
    .attr("r", 20)

    const [mouseX, mouseY] = d3.pointer(e, group)

    // update
    tooltip.selectAll("*").remove()
    tooltip.attr("transform", null)

    // transition
    tooltip.transition()
    .duration(200)
    .style("opacity", 1)
    
    drawSparklines(data, tooltip, graphHeight, graphWidth, x, d)
    let sparklineWidth = tooltip.node().getBBox().width,
    sparklineHeight = tooltip.node().getBBox().height
    console.log("+-+-+-+")
    console.log(tooltip.node().getBBox())

    // translate
    tooltip.attr('transform', `translate(${mouseX - sparklineWidth * 0.25}, ${mouseY + sparklineHeight})`)

    
}
  
const mouseOut = (e, d) => {
    d3.select("#tooltip-sparklines").style("opacity", 0);
    d3.select(`#circle-${d}`)
    .transition()
    .attr("opacity", 0)
    .attr("r", 10)

}

function drawXAxis(data, group, graphHeight, graphWidth, x) {
    // display x axis
    const noteNamesAxis = group.append("g")
    .attr("id", "note-names-x-axis")
    .attr("color", "black")

    
    noteNamesAxis
    .call(
        d3.axisBottom(x)
        .tickValues(data.nodes.map(d => d.id)) 
        .tickFormat(d => {
            const match = data.nodes.find(n => n.id === d);
            return match ? match.name : "";
        })
        .tickPadding(graphHeight * 0.05)
    )
    .attr("transform", `translate(0, ${graphHeight * 0.1})`)


    noteNamesAxis.selectAll(".on-hover-circle")
    .data(data.nodes.map(d => d.id))
    .enter()
    .append("circle")
    .attr("fill", "#6889fc")
    .attr("cx", d => x(d))
    .attr("cy", graphHeight * 0.05 + 10)
    .attr("r", 10)
    .attr("opacity", 0)
    .attr("id", d => `circle-${d}`)
    .lower()

    noteNamesAxis.selectAll(".tick text")
    .attr("class", "axis-ticks")
    .on("mouseover", (e, d) => mouseOver(e, d, data, graphHeight, graphWidth, x))
    .on("mouseout", (e, d) => mouseOut(e, d))

    return noteNamesAxis
}

export function drawLinks(data, group, graphHeight, graphWidth, x) {
    // Add links between nodes
    let extent = d3.extent(data.nodes.map(d => d.id))

    const idToNode = {};
    data.nodes.forEach(function (n) {
        idToNode[n.id] = n;
    });

    let opacityScale = d3.scaleLinear()
        .range([0.2, 1])
        .domain([d3.min(data.links.map(d => d.count)), d3.max(data.links.map(d => d.count))])
    
    let colorScale = d3.scaleLinear()
    .range(["#fdeff9", "#ec38bc", "#ab1bbe", "#7303c0"])
    .domain([extent[0], extent[1] / 3, 2 * extent[1] / 3, extent[1]])

    // Add the links
    const links = group
    .append('g')
    .attr('id', 'links')
    .selectAll('links')
    .data(data.links)
    .join('path')
    .attr('d', (d, i) => {
        let y = graphHeight * 0.1
        let startid = idToNode[d.source]
        let endid = idToNode[d.target]
        let start = x(idToNode[d.source].id)      // start node on the x axis
        let end = x(idToNode[d.target].id)        // end node on the x axis
        let arcHeight = (end - start) * 2
        
        // loop
        let path;
        if (d.source == d.target) {

            let loopWidth = graphHeight * 0.09
            let loopHeight = graphHeight * 0.09

            path = 
                ['M', start, y,                                
                'C', start + loopWidth, y - loopHeight ,                       
                start - loopWidth, y - loopHeight,
                start, y]
                .join(' ');
        }
        else {
            path = 
                ['M', start, y,                     // arc starts at x, y
                'A',                                // This means we're gonna build an elliptical arc
                Math.abs(start - end), ',',                   // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                arcHeight, 0, 0, ',',
                startid > endid ? 0 : 1, end, ',', y]
                .join(' ');
        }
        return path
    })
    .style("fill","none")
    .attr("stroke", d => colorScale((x(idToNode[d.source].id) + x(idToNode[d.target].id)) / 2))
    .attr("stroke-width", 2/* d => d.count */)
    .attr("opacity", d => opacityScale(d.count))

    return links
}

const ArcDiagramChart = ({tune}) => {
    const svgRef = useRef(null)
    const [width, height] = useWindowSize();
    console.log([width, height])
    const filename = `/music_intervals/${tune}_music_intervals.json`
    
    useLayoutEffect(() => {
        

        // set the dimensions and margins of the graph
        const svgWidth = width,
        svgHeight = width,
        graphWidth = svgWidth * 0.9,
        graphHeight = svgHeight
        
        // append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        // .attr("transform", `translate(${width * 0.07}, 0)`)
        
        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        const group = svg.append("g")
        .attr("id", "align-group")
        .attr("transform", `translate(${svgWidth * 0.1 * 0.5},${graphHeight / 3})`)
        
        group
        .append("g")
        .attr("id", "tooltip-sparklines")
        .attr("style", "opacity: 0;")

        // load data
        d3.json(filename).then(function(data) {
        
            // List of node names
            const allIds = data.nodes.map(d => d.id)
            let extent = d3.extent(allIds)
        
            // X scale
            const x = d3.scaleLinear()
            .domain(extent)
            .range([0, graphWidth])           
            
            // Add links
            const links = drawLinks(data, group, graphHeight, graphWidth, x)
        
            // Add frequency rings
            const rings = drawNoteFrequencyRings(data, group, graphWidth, x)
        
            // Add X Axis
            const xAxis = drawXAxis(data, group, graphHeight, graphWidth, x)
            xAxis.selectAll("text") 
            .style('font-family', 'montserrat')
            .style('font-size', `${fontSize(width)}px`)
        })
        
        
    }, [width, /* height,  */svgRef.current, filename])

    return <svg ref={svgRef}/>
}

export default ArcDiagramChart