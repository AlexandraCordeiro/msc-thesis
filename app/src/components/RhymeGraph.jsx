import React, {useRef, useCallback, useMemo, useLayoutEffect, useState, useEffect} from "react";
import * as d3 from "d3";
import {setOfTokensFromString, arrayOfTokensFromString, cleanString, lyricsZoomBehavior, removeElement} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"
import ClipLoader from "react-spinners/ClipLoader"

const RhymeGraph = ({tuneIndex, gridId}) => {

    // remove unwanted tooltips
    removeElement("tooltip-sparklines")
    removeElement("tooltip-intervals")
    removeElement("tooltip-score")

    const svgRef = useRef(null);
    const [width, height] = useWindowSize(gridId);
    const svgWidth = width * 0.9;
    const svgHeight = svgWidth;

    // cache csv data
    const [csvData, setCsvData] = useState(null);
    const [loading, setLoading] = useState(false)

    const colorScheme = [
          "#b589fc",
          "#a0cafa",
          "#9fa0fd",
          "#deb8f5",
          "#e18a64",
          "#ff7e16",
          "#c7e1fc",
          "#ff5163",
          "#fe3eb7",
          "#fe87f9"
        ]
    
    const mouseOver = useCallback((d, circle) => {
        d3.select("#tooltip-lyrics")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("color", 'black')
        .style("font-family", "montserrat")
        .style("font-size", '14px')
        .text(`${d}`)

        let r = circle.attr("r")
        circle.attr("r", r * 1.3)
        circle.attr("class", "circle-in-focus")
    }, [])

    const mouseMove = useCallback((e) => {
        d3.select("#tooltip-lyrics")
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + 10 + "px")
    }, [])

    const mouseOut = useCallback((circle, size) => {
        d3.select("#tooltip-lyrics").style("opacity", 0)
        circle.attr("r", size)
    }, [])


    useEffect(() => {
        d3.csv("/data.csv").then(function(data) {
            setCsvData(data) // Cache the data
        }).catch(error => {
            console.error("Error loading CSV data:", error);
        });
    }, [])


    useEffect(() => {
        // D3 Code
        if (!csvData) return

        // create svg
        const svg = d3.select(svgRef.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("overflow", "visible")

        // clear all previous content on refresh
        svg.selectAll("*").remove();
        d3.select("#tooltip-lyrics").remove()
    
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
    
        const r = svgWidth * 0.45

        let verses = csvData[tuneIndex].lyrics.split("\n")
        let lastWords = []

        verses.forEach(verse => {
            let words = verse.split(/\s+/)
            let numWords = words.length
            console.log(words)
            console.log(words[numWords -1])
            lastWords.push(cleanString(words[numWords -1]))
            
        })

        console.log(lastWords)
        let tune = csvData[tuneIndex]
        let num = tune.rhyme.split(",").length
        let ang = ((2 * Math.PI) / num)
        let rhyme = tune.rhyme.split(",")
    
        let arcs = []
        
        for (let i = 0; i < rhyme.length; i++) {
            let source = +rhyme[i]
            for (let j = i + 1; j < rhyme.length; j++) {
                let target = +rhyme[j]
                if (source == target && source != "") {
                    arcs.push({source: i, target: j})
                }
            }
        }

            
        svg
        .append("circle")
        .attr("transform", `translate(${svgWidth * 0.5}, ${svgHeight * 0.5})`)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "lightgray")
        .attr("opacity", 0.5)
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
            .style("filter", "drop-shadow(0 0 5px #602cb9)")
            .attr("class", d => `rhyme-${+rhyme[d.source]}`)
            .attr("transform", `translate(${svgWidth * 0.5}, ${svgHeight * 0.5})`)
            .attr("d", d => {
                
                const x1 = r * Math.cos(ang * d.source - (Math.PI / 2))
                const y1 = r * Math.sin(ang * d.source - (Math.PI / 2))
                const x2 = r * Math.cos(ang * d.target - (Math.PI / 2))
                const y2 = r * Math.sin(ang * d.target - (Math.PI / 2))
                const xm = (x1 + x2) / 2
                const ym = (y1 + y2) / 2
    
                const points = [
                {x: x1, y: y1},
                {x: x2, y: y2}
                ]


                return line(points)
            })
            .attr("fill", "none")
            .attr("stroke", d => colorScheme[+rhyme[d.source] - 1] || "#ccc")
            .attr("stroke-width", "1px")
            .attr("opacity", 0.7)
        }
    
        svg.selectAll(".nodes")
        .data(rhyme)
        .enter()
        .append("circle")
        .style("filter", "drop-shadow(0 0 15px #602cb9)")
        .attr("class", d => `rhyme-${+d}`)
        .attr("transform", `translate(${svgWidth * 0.5}, ${svgHeight * 0.5})`)
        .attr("cx", (d, i) => r * Math.cos(ang * i - (Math.PI / 2)))
        .attr("cy", (d, i) => r * Math.sin(ang * i - (Math.PI / 2)))
        .attr("r", 20)
        .attr("fill", d => {
            if (d == "") {
                return "whitesmoke"
            }
            else {
                return colorScheme[+d - 1]
            }
        })


        // last word in verse
        svg.selectAll(".last-word")
        .data(lastWords)
        .enter()
        .append("text")
        .attr("class", (d, i) => `rhyme-${+rhyme[i]}`)
        .attr("transform", `translate(${svgWidth * 0.5}, ${svgHeight * 0.5 + 6})`)
        .attr("x", (d, i) => r * Math.cos(ang * i - (Math.PI / 2)))
        .attr("y", (d, i) => r * Math.sin(ang * i - (Math.PI / 2)))
        .attr("text-anchor", "middle")
        .attr("font-family", "montserrat")
        .attr("font-size", "10px")
        .attr("font-weight", "500")
        .text(d => d)        
    
        // d3.selectAll("path").style("filter", "url(#glow)")

        let set = new Set(rhyme)

        set.forEach(elem => {
            svg.selectAll(`.rhyme-${elem}`)
            .on("mouseover", () => {
                svg.selectAll("*")
                .filter(function() {
                    return !this.classList.contains(`rhyme-${elem}`);
                })
                .attr("opacity", 0.2)
            })
            .on("mouseout", () => {
                svg.selectAll("*").attr("opacity", 1)
            })
        });


        
    }, [width, csvData, tuneIndex]) 

    return <svg ref={svgRef}/>
}

export default RhymeGraph;