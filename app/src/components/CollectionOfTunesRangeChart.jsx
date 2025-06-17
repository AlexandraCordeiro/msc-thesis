import React, {useRef, useEffect, useLayoutEffect} from "react";
import * as d3 from "d3";
import {drawLinks, drawXAxis, radsToDegrees} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"
import { noteToMidi } from "../functions.js";

function degToRadians(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}


function calcInnerAndOutterRadius(data) {
    const numArray = new Float64Array(data);

    const uniqueValues = [...new Set(numArray)];

    uniqueValues.sort((a, b) => a - b);

    return [uniqueValues[1], uniqueValues[uniqueValues.length - 2]];
}


const CollectionOfTunesRangeChart = ({collection, setTuneName}) => {


    const svgRef = useRef(null);
    const [width, height] = useWindowSize();
    let filename = `/collection_of_tunes_intervals/${collection}.json`
    useLayoutEffect(() => {
        // D3 Code

        // set the dimensions and margins of the graph
        const svgWidth = width * 0.8,
        svgHeight = svgWidth,
        innerRadius = 0,
        graphHeight = svgHeight / 2,
        graphWidth = graphHeight - innerRadius
        
        // append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", "collection-tunes")
        
        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();
        
        const group = svg.append("g")
        .attr("id", "center")
        .attr("transform", `translate(${graphWidth}, ${graphHeight})`)
        
        
        
        // load data
        d3.json(filename).then(function(data) {
            
            var ids = data.flatMap(d => d.nodes).map(d => d.id)
            let extent = [noteToMidi("C1"), noteToMidi("C8")]

            var segmentInnerRadius = calcInnerAndOutterRadius(ids)[0]
            var segmentOutterRadius = calcInnerAndOutterRadius(ids)[1]

            console.log(segmentInnerRadius)
            console.log(segmentOutterRadius)

            var n = data.length
            var ang = (2 * Math.PI) / n 
            
            const arcGen = (segmentInnerRadius, segmentOutterRadius) => {
                return d3.arc()
                .innerRadius(segmentInnerRadius)
                .outerRadius(segmentOutterRadius)
                .startAngle(Math.PI / 2 - (ang * 0.5))
                .endAngle((Math.PI / 2 + (ang * 0.5)))
            }

            const xRadial = d3.scaleLinear()
            .range([-Math.PI / 2, -Math.PI / 2 + 2 * Math.PI])
            .domain([0, data.length])

            group.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "segment")
            .attr("id", d => d.name)
            .attr("transform", (d, i) => {
                d.originalTransform = `translate(${innerRadius * Math.cos(xRadial(i))}, ${innerRadius * Math.sin(xRadial(i))}) rotate(${radsToDegrees(xRadial(i))})`
                return d.originalTransform

            })
            .each(function(d, i){

                // List of node names
                let thisGroup = d3.select(this)

                
                // X scale
                let x = d3.scaleLinear()
                .domain(extent)
                .range([0, graphWidth])

                

                thisGroup.append("path")
                .attr("fill", "lightgray")
                .attr("class", "donut")
                .attr("opacity", 0)
                .attr("d", arcGen(0, graphWidth))
                

                // Add X Axis
                const xAxis = drawXAxis(d, thisGroup, graphHeight, x, extent)
                xAxis.attr("class", "x-axis").attr("opacity", 0)
        
                // Add links
                let p = 2 * (Math.PI * innerRadius) / data.length
                const links = drawLinks(d, thisGroup, p, graphWidth, x, extent)


                let symbolSize = graphWidth * 0.2
                thisGroup.append("path")
                .attr("d", d3.symbol(d3.symbolCircle).size(symbolSize))
                .attr("fill", "none")
                .attr("class", "symbol")
                .attr("transform", `translate(${graphWidth + 10}, 0)`)

        
            })

            group.selectAll('.segment')
            .on('mouseover', function (e, d) {
                const hovered = d3.select(this);
                let scaleValue = 1 /* (svgWidth / graphWidth) * 0.6 */
                hovered
                .transition()
                .ease(d3.easeCubicIn)
                .attr("transform", `${d.originalTransform} scale(${scaleValue})`)
                group.selectAll('.links').attr("opacity", 0.13);
                hovered.selectAll('.links').attr("opacity", 1);
                hovered.selectAll('.x-axis').attr("opacity", 1);
                hovered.select('.donut').attr("opacity", 0);
                hovered.select('.symbol').attr("fill", "#7303c0")
                hovered.select('.donut').attr("box-shadow", "rgba(0, 0, 0, 0.24) 0px 3px 8px")
                setTuneName(hovered.attr("id"))

            })
            .on('mouseout', function (e, d) {
                // Reset everything
                const hovered = d3.select(this);
                hovered
                .transition()
                .attr("transform", d.originalTransform)

                // hovered.attr("transform", "scale(1)")
                group.selectAll('.x-axis').attr("opacity", 0);
                group.selectAll('.links').attr("opacity", 1);
                group.selectAll('.donut').attr("fill", "lightgray").attr("opacity", 0);
                group.selectAll('.symbol').attr("fill", "none")
                setTuneName("Hover chart")
            });


            
        
        }) 
        
        
    }, [collection, width, svgRef.current]) // redraw chart if data changes

    return <svg ref={svgRef}/>
}

export default CollectionOfTunesRangeChart;