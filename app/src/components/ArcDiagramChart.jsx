import { useRef, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import {drawNoteFrequencyRings, drawSparklines, midiToNote, removeElement, fontSize, noteToMidi} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"


const typeOfIntervals = {
  "0": "Unison\nConsonant",
  "1": "Minor Second (↑)\nDissonant",
  "2": "Major Second (↑)\nDissonant",
  "3": "Minor Third (↑)\nConsonant",
  "4": "Major Third (↑)\nConsonant",
  "5": "Perfect Fourth (↑)\nConsonant",
  "6": "Tritone (↑)\nDissonant",
  "7": "Perfect Fifth (↑)\nConsonant",
  "8": "Minor Sixth (↑)\nConsonant",
  "9": "Major Sixth (↑)\nConsonant",
  "10": "Minor Seventh (↑)\nDissonant",
  "11": "Major Seventh (↑)\nDissonant",
  "12": "Octave (↑)\nConsonant",
  "-1": "Minor Second (↓)\nDissonant",
  "-2": "Major Second (↓)\nDissonant",
  "-3": "Minor Third (↓)\nConsonant",
  "-4": "Major Third (↓)\nConsonant",
  "-5": "Perfect Fourth (↓)\nConsonant",
  "-6": "Tritone (↓)\nDissonant",
  "-7": "Perfect Fifth (↓)\nConsonant",
  "-8": "Minor Sixth (↓)\nConsonant",
  "-9": "Major Sixth (↓)\nConsonant",
  "-10": "Minor Seventh (↓)\nDissonant",
  "-11": "Major Seventh (↓)\nDissonant",
  "-12": "Octave (↓)\nConsonant"
}


/* const intervalTextures = {
  "0": textures.circles().size(8),
  "1": textures.lines(),
  "2": textures.lines().heavier(),
  "3": textures.paths().d("caps").lighter().size(7),
  "4": textures.paths().d("caps").thicker().size(7),
  "5": textures.paths().d("squares"),
  "6": textures.paths().d("nylon").lighter().shapeRendering("crispEdges"),
  "7": textures.paths().d("crosses").lighter(),
  "8": textures.paths().d("hexagons").size(8).strokeWidth(2),
  "9": textures.paths().d("hexagons").size(8).strokeWidth(5),
  "10": textures.paths().d("waves").lighter(),
  "11": textures.paths().d("waves").lighter(),
  "12": textures.paths().d("woven").thicker()
} */


  const intervalColors = {
  "0": " #a1c5fa",
  "1":" #b589fc",
  "2": " #b589fc",
  "3": " #a1c5fa",
  "4": " #a1c5fa",
  "5": " #a1c5fa",
  "6": " #b589fc",
  "7": " #a1c5fa",
  "8": " #a1c5fa",
  "9": " #a1c5fa",
  "10": " #b589fc",
  "11": " #b589fc",
  "12": " #a1c5fa"
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
        let tooltipIntervals = d3.select("#tooltip-intervals")
        tooltipIntervals.selectAll("*").remove()
        let key = `${d.source - d.target}`
        // let texture = intervalTextures[`${Math.abs(d.source - d.target)}`]
        let intervalColor = intervalColors[`${Math.abs(d.source - d.target)}`]
        // update


        let radius = 5
        let tooltipWidth = 125
        let tooltipHeight = 40 + radius * 5
        let offset = 10

        tooltipIntervals
        .attr("opacity", 1)
        .attr("class", "interval-tooltip")
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("x", 0)
        .attr("y", offset)
        .attr("rx", '0.5rem')
        .attr("ry", '0.5rem')
        .attr("fill", 'white')
        
        tooltipIntervals.append("circle")
        .attr("cx", offset + radius)
        .attr("cy", offset + radius * 3)
        .attr("r", radius)
        .attr("fill", intervalColor)

        tooltipIntervals.append("text")
        .text(`${typeOfIntervals[key]}`)
        .attr("x", offset)
        .attr("y", offset + (tooltipHeight * 0.5) + 6)
        .attr("font-family", "montserrat")
        .attr("font-size", '12px')
        .attr("fill", "black")
        .attr("white-space", "pre-line")
        

       /*  d3.select("svg").call(texture)
        d3.select(e.currentTarget)
        .style("fill", texture.url()) */

        d3.select(e.currentTarget)
        .style("fill", intervalColor)
        .style("fill-opacity", 0.5)
       
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
        tooltipIntervals.selectAll("*").remove()
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
        .range([0.3, 1])
        .domain([d3.min(data.links.map(d => d.count)), d3.max(data.links.map(d => d.count))])
    
    let colorScale = d3.scaleLinear()
    .range(["#fc00ff", "#00dbde"])
    .domain([noteToMidi("C1"), noteToMidi("C8")])


    // save order
    data.links.forEach((d, i) => d.originalIndex = i);

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
                Math.abs(start - end), ',',         // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                arcHeight, 0, 0, ',',
                startid > endid ? 0 : 1, end, ',', y]
                .join(' ');
        }

        if (Math.abs(start - end) < inf) {
            inf = Math.abs(start - end)
            d3.select(this).raise();
        }
        return path
    })
    .style("filter", 'drop-shadow(0 0 20px #602cb9)')
    .style("fill","rgba(0,0,0,0)")
    .style("pointer-events", "all")
    .attr("stroke", d => colorScale((idToNode[d.source].id + idToNode[d.target].id) / 2))
    .attr("stroke-width", 2)
    .attr("stroke-opacity", d => opacityScale(d.count))
    .on("mouseover", (e, d) => mouseOver(e, d, data, graphHeight, graphWidth, x, "music-intervals"))
    .on("mouseout", (e, d) => mouseOut(e, d, "music-intervals"))

    links
    .attr("stroke-dasharray", function() {
        return this.getTotalLength();
    })
    .attr("stroke-dashoffset", function() {
        return this.getTotalLength();
    })
    .transition()
    .duration(600) 
    .delay(d => d.originalIndex * 500)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)


    return links
}

const ArcDiagramChart = ({tune, gridId, setMaxCount}) => {


    // remove unwanted tooltips
    removeElement("tooltip-lyrics")
    removeElement("tooltip-score")

    const svgRef = useRef(null)
    const [width, height] = useWindowSize(gridId);
    const filename = `/music_intervals/${tune}_music_intervals.json`
    
    useLayoutEffect(() => {
        

        // set the dimensions and margins of the graph
        const svgWidth = width * 0.9,
        svgHeight = width,
        graphWidth = svgWidth * 0.9,
        graphHeight = svgHeight
        
        // append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("overflow", "visible")
        // .attr("transform", `translate(${width * 0.07}, 0)`)
        
        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        const group = svg.append("g")
        .attr("id", "align-group")
        .attr("transform", `translate(${svgWidth * 0.1 * 0.25},${graphWidth * 0.3})`)
        
        group
        .append("g")
        .attr("id", "tooltip-sparklines")
        .attr("style", "opacity: 0;")

       svg
        .append("g")
        .attr("id", "tooltip-intervals")
        // .attr("style", "position: absolute; opacity: 0;")

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
            setMaxCount(d3.max(data.nodes.map(d => d.frequency)))
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