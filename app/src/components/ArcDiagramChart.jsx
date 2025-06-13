import { useRef, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import {drawNoteFrequencyRings, drawSparklines, midiToNote, cursorPoint, fontSize} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"
// @ts-ignore
import textures from 'textures'


const typeOfIntervals = {
  "0": "Unison",
  "1": "Minor Second (↑)",
  "2": "Major Second (↑)",
  "3": "Minor Third (↑)",
  "4": "Major Third (↑)",
  "5": "Perfect Fourth (↑)",
  "6": "Tritone (↑)",
  "7": "Perfect Fifth (↑)",
  "8": "Minor Sixth (↑)",
  "9": "Major Sixth (↑)",
  "10": "Minor Seventh (↑)",
  "11": "Major Seventh (↑)",
  "12": "Octave (↑)",
  "-1": "Minor Second (↓)",
  "-2": "Major Second (↓)",
  "-3": "Minor Third (↓)",
  "-4": "Major Third (↓)",
  "-5": "Perfect Fourth (↓)",
  "-6": "Tritone (↓)",
  "-7": "Perfect Fifth (↓)",
  "-8": "Minor Sixth (↓)",
  "-9": "Major Sixth (↓)",
  "-10": "Minor Seventh (↓)",
  "-11": "Major Seventh (↓)",
  "-12": "Octave (↓)"
}


const intervalTextures = {
  "0": textures.circles(),
  "1": textures.lines(),
  "2": textures.lines().heavier(),
  "3": textures.paths().d("caps").lighter(),
  "4": textures.paths().d("caps").thicker(),
  "5": textures.paths().d("squares"),
  "6": textures.paths().d("nylon").lighter().shapeRendering("crispEdges"),
  "7": textures.paths().d("crosses").lighter(),
  "8": textures.paths().d("hexagons").size(8).strokeWidth(2),
  "9": textures.paths().d("hexagons").size(8).strokeWidth(5),
  "10": textures.paths().d("waves").lighter(),
  "11": textures.paths().d("waves").lighter(),
  "12": textures.paths().d("woven").thicker()
}

const mouseOver = (e, d, data, graphHeight, graphWidth, x, type) => {   
    
    if (type == "tooltip-histogram") {
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
    
        // translate
        tooltip.attr('transform', `translate(${mouseX - sparklineWidth * 0.25}, ${mouseY + sparklineHeight})`)
    }

    if (type == "music-intervals") {
        console.log(d)
        let tooltipIntervals = d3.select("#tooltip-intervals")
        let key = `${d.source - d.target}`
        let texture = intervalTextures[`${Math.abs(d.source - d.target)}`]
        // transition
        tooltipIntervals
        .style("opacity", 1)
        .style("color", 'black')
        .style("font-family", "montserrat")
        .style("font-size", '14px')
        .style("transform", `translate(${100}, 0)`)
        .text(`${typeOfIntervals[key]}`)


        d3.select("svg").call(texture)
        d3.select(e.currentTarget)
        .style("fill", texture.url())
       
    }

    
}
  
const mouseOut = (e, d, type) => {

    if (type == "tooltip-histogram") {
        d3.select("#tooltip-sparklines").style("opacity", 0);
        d3.select(`#circle-${d}`)
        .transition()
        .attr("opacity", 0)
        .attr("r", 10)
    }
    if (type == "music-intervals") {
        let tooltipIntervals = d3.select("#tooltip-intervals")
        d3.select(e.currentTarget)
        .style("fill", "rgba(0, 0, 0, 0)")
    }

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
    .on("mouseover", (e, d) => mouseOver(e, d, data, graphHeight, graphWidth, x, "tooltip-histogram"))
    .on("mouseout", (e, d) => mouseOut(e, d, "tooltip-histogram"))

    return noteNamesAxis
}

export function drawLinks(data, group, graphHeight, graphWidth, x) {
    // Add links between nodes
    let extent = d3.extent(data.nodes.map(d => d.id))
    let inf = 1000
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
    let sortedLinks = data.links.slice().sort((a, b) => {
        return Math.abs(b.source - b.target) - Math.abs(a.source - a.target)
    })
    const links = group
    .append('g')
    .attr('id', 'links')
    .selectAll('links')
    .data(sortedLinks)
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

            let loopWidth = graphHeight * 0.05
            let loopHeight = graphHeight * 0.05

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
                startid > endid ? 1 : 0, end, ',', y]
                .join(' ');
        }

        if (Math.abs(start - end) < inf) {
            inf = Math.abs(start - end)
            d3.select(this).raise();
        }
        return path
    })
    .style("fill","rgba(0,0,0,0)")
    .style("pointer-events", "all")
    .attr("stroke", d => colorScale((x(idToNode[d.source].id) + x(idToNode[d.target].id)) / 2))
    .attr("stroke-width", 2)
    .attr("opacity", d => opacityScale(d.count))
    .on("mouseover", (e, d) => mouseOver(e, d, data, graphHeight, graphWidth, x, "music-intervals"))
    .on("mouseout", (e, d) => mouseOut(e, d, "music-intervals"))

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

        d3.select("body")
        .append("div")
        .attr("id", "tooltip-intervals")
        .attr("style", "position: absolute; opacity: 0;")

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