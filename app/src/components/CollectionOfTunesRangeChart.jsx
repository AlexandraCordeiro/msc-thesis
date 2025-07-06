import {useRef, useLayoutEffect} from "react";
import * as d3 from "d3";
import {drawLinks, drawXAxis, radsToDegrees, removeElement} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"
import { noteToMidi } from "../functions.js";
import BarLoader from "react-spinners/BarLoader"

function calcInnerAndOutterRadius(data) {
    const numArray = new Float64Array(data);

    const uniqueValues = [...new Set(numArray)];

    uniqueValues.sort((a, b) => a - b);

    return [uniqueValues[1], uniqueValues[uniqueValues.length - 2]];
}


const CollectionOfTunesRangeChart = ({collection, setTuneName, gridId, interaction, titles}) => {
    
    // remove unwanted tooltips
    removeElement("tooltip-lyrics")
    removeElement("tooltip-sparklines")
    removeElement("tooltip-intervals")
    removeElement("tooltip-score")

    const svgRef = useRef(null);
    const [width, height] = useWindowSize(gridId);
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
        // .attr("transform", `translate(${(width * 0.5 - graphWidth * 0.5)}, 0)`)
        
        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();
        
        const group = svg.append("g")
        .attr("id", "center")
        .attr("transform", `translate(${graphWidth}, ${graphHeight * 0.3})`)
        
        
        
        // load data
        d3.json(filename).then(function(data) {
            
            var ids = data.flatMap(d => d.nodes).map(d => d.id)
            let extent = [noteToMidi("C1"), noteToMidi("C8")]

            var segmentInnerRadius = calcInnerAndOutterRadius(ids)[0]
            var segmentOutterRadius = calcInnerAndOutterRadius(ids)[1]

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
        
            })

            group.selectAll('.segment')
            .on('mouseover', function (e, d) {

                if (interaction) {
                    const hovered = d3.select(this);
                    let scaleValue = 1 /* (svgWidth / graphWidth) * 0.6 */
                    hovered
                    .transition()
                    .ease(d3.easeCubicIn)
                    .attr("transform", `${d.originalTransform} scale(${scaleValue}, ${scaleValue})`)
                    group.selectAll('.links').attr("opacity", 0.3);
                    hovered.selectAll('.links').attr("opacity", 1);
                    hovered.selectAll('.x-axis').attr("opacity", 0.6)
                    hovered.select('.donut').attr("opacity", 0);
                    hovered.select('.symbol').attr("fill", "#7303c0")
                    hovered.select('.donut').attr("box-shadow", "rgba(0, 0, 0, 0.24) 0px 3px 8px")
                    // setTuneName(titles[parseInt(hovered.attr("id").split("-").slice(-1)) - 1])
                    setTuneName(hovered.attr("id"))
                }

            })
            .on('mouseout', function (e, d) {

                if (interaction) {
                    // Reset everything
                    const hovered = d3.select(this);
                    hovered
                    .transition()
                    .attr("transform", d.originalTransform)
    
                    group.selectAll('.x-axis').attr("opacity", 0);
                    group.selectAll('.links').attr("opacity", 1);
                    group.selectAll('.donut').attr("fill", "lightgray").attr("opacity", 0);
                    group.selectAll('.symbol').attr("fill", "none")
                    setTuneName("Hover the chart to find more")
                }
            });


            
        
        }) 
        
        
    }, [collection, width, svgRef.current]) // redraw chart if data changes

    return <svg ref={svgRef}/>
}

export default CollectionOfTunesRangeChart;