import React, {useRef, useCallback, useMemo, useLayoutEffect} from "react";
import * as d3 from "d3";
import {setOfTokensFromString, arrayOfTokensFromString, cleanString, lyricsZoomBehavior, fontSize} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"

const LyricsSimilarityMatrix = ({tuneIndex, gridId}) => {
    const svgRef = useRef(null);
    const [width, height] = useWindowSize(gridId);
    // set the dimensions and margins of the graph
    // useMemo() stores calculations
    // prevents expensive calculations on new renders

    const dimensions = useMemo(() => {
        const svgWidth = width * 0.7;
        const svgHeight = svgWidth;
        const graphWidth = svgWidth * 0.7;
        const graphHeight = graphWidth;
        
        return {svgWidth, svgHeight, graphWidth, graphHeight };
    }, [width]);


    // useCallBack() stores the function
    // prevents new creation of the function on new renders

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

    // Cache CSV data to avoid reloading
    const csvDataRef = useRef(null);

    useLayoutEffect(() => {
        // D3 Code
        const { svgWidth, svgHeight, graphWidth, graphHeight } = dimensions;

        // create svg
        const svg = d3.select(svgRef.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "centered-svg")
        
        
        // clear all previous content on refresh
        svg.selectAll("*").remove();
        d3.select("#tooltip-lyrics").remove()
        
        // tooltip
        d3.select("body")
        .append("div")
        .attr("id", "tooltip-lyrics")
        .attr("style", "position: absolute; opacity: 0;")
        
        const chart = svg.append('g')
        .attr("id", "lyrics-chart")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        


        const drawSimilarityMatrix = (data) => {
            // if index is invalid
            if (!data[tuneIndex]) return;

            // select current tune
            let song = data[tuneIndex]
            let songTokens = arrayOfTokensFromString(cleanString(song.lyrics))
            let setOfTokens = d3.shuffle(Array.from(setOfTokensFromString(cleanString(song.lyrics.toLowerCase()))))
            let numOfTokens = songTokens.length

            const color = d3.scaleSequential()
            .domain([0, setOfTokens.length - 1])
            .range(["#d0b6fa", "#94bbe9"])
        
            let colors = {}
            
            setOfTokens.forEach((token, i) => {
                colors[token] = color(i)
            })

            const zoomContainer = chart.append("g").attr("id", "zoom-container")
            const similarityMatrix = zoomContainer.append("g").attr("id", "similarity-matrix")
            
            let size = graphWidth / ((numOfTokens - 1) * 2.5)
            let padding = 1.5 * size
            let axis = d3.scaleLinear().domain([0, numOfTokens - 1]).range([0, graphWidth])


            songTokens.forEach((token_i, i) => {
                const row = similarityMatrix.append("g").attr("id", `row-${i}`)
                let fillColor 
                let circles = []

                songTokens.forEach((token_j, j) => {
                    if (token_i === token_j) {fillColor = colors[token_i.toLowerCase()]}
                    else {fillColor = "#f0f0f0"}

                    circles.push({
                        id: `col-${j}`,
                        cx: i * (size + padding),
                        cy: j * (size + padding),
                        r: size,
                        fill: fillColor,
                        token: token_i
                    })
                })

                // append circles all at once for better performance
                row.selectAll("circle")
                .data(circles)
                .enter()
                .append("circle")
                .attr("id", d => d.id)
                .attr("cx", d => d.cx)
                .attr("cy", d => d.cy)
                .attr("r", d => d.r)
                .attr("fill", d => d.fill)
                .on("mouseover", (e, d) => mouseOver(d.token, d3.select(e.target)))
                .on("mouseout", e => mouseOut(d3.select(e.target), size))
                .on("mousemove", e => mouseMove(e));


            })

            
            
                
                
                
        
                const xAxis = chart.append("g").attr("id", "x-axis")
                const yAxis = chart.append("g").attr("id", "y-axis")

                let ratio = 12
                const zoom = lyricsZoomBehavior(axis, numOfTokens, xAxis, yAxis, zoomContainer, graphWidth, songTokens, size, ratio)

                const initialTransform = d3.zoomIdentity.translate(
                    (svgWidth - graphWidth) / 2,
                    (svgHeight - graphHeight) / 2
                );
                
                svg.on("mouseleave", () => {
                    d3.select("#tooltip-lyrics").style("opacity", 0)
                })
                svg.on("mouseout", () => {
                    d3.select("#tooltip-lyrics").style("opacity", 0)
                })
                svg.call(zoom).call(zoom.transform, initialTransform);


        }

        // Load CSV data with caching
        if (csvDataRef.current) {
            drawSimilarityMatrix(csvDataRef.current);
        } else {
            d3.csv("/lyrics_data.csv").then(function(data) {
                csvDataRef.current = data; // Cache the data
                drawSimilarityMatrix(data);
            }).catch(error => {
                console.error("Error loading CSV data:", error);
            });
        }
        
        
        
    }, [tuneIndex, dimensions, mouseOver, mouseMove, mouseOut]) // redraw chart if data changes

    return <svg ref={svgRef}/>
}

export default LyricsSimilarityMatrix;