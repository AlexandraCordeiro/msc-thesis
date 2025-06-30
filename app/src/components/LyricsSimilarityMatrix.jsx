import React, {useRef, useCallback, useMemo, useLayoutEffect, useState, useEffect} from "react";
import * as d3 from "d3";
import {setOfTokensFromString, arrayOfTokensFromString, cleanString, lyricsZoomBehavior, removeElement} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"
import ClipLoader from "react-spinners/ClipLoader"
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';


const LyricsSimilarityMatrix = ({tuneIndex, gridId}) => {

    // remove unwanted tooltips
    removeElement("tooltip-sparklines")
    removeElement("tooltip-intervals")
    removeElement("tooltip-score")

    // zoom icons
    /* d3.select("body")
    .append("button")
    .attr("id", "zoom-in")
    .append("i")
    .attr("class", "fa fa-search-plus")
    .attr("aria-hidden", "true")
 */

    /* d3.select("body")
    .append("button")
    .attr("id", "zoom-out")
    .append("i")
    .attr("class", "fa fa-search-minus")
    .attr("aria-hidden", "true") */

    const svgRef = useRef(null);
    const [width, height] = useWindowSize(gridId);

    // cache csv data
    const [csvData, setCsvData] = useState(null);
    const [loading, setLoading] = useState(false)
    const isLoading = useRef(null)

    const variableCalculations = useMemo(() => {

        if (!csvData) return

        setLoading(true)
        console.log(loading)
        
        const svgWidth = width * 0.9;
        const svgHeight = svgWidth;
        const graphWidth = svgWidth * 0.7;
        const graphHeight = graphWidth;

        let data = csvData
        let song = data[tuneIndex]
        console.log(song)
        console.log(song.lyrics)
        let songTokens = arrayOfTokensFromString(cleanString(song.lyrics))
        let setOfTokens = d3.shuffle(Array.from(setOfTokensFromString(cleanString(song.lyrics.toLowerCase()))))
        let numOfTokens = songTokens.length

        const color = d3.scaleSequential()
        .domain([0, setOfTokens.length - 1])
        .range(["#000000", "#673ab7"])

        let colors = {}
        
        setOfTokens.forEach((token, i) => {
            colors[token] = color(i)
        })

        let size = d3.min([graphWidth * 0.05, graphWidth / ((numOfTokens - 1) * 2.5)])
        let padding = 1.5 * size
        let matrixSize = (numOfTokens - 1) * (size + padding)
        let axis = d3.scaleLinear().domain([0, numOfTokens - 1]).range([0, matrixSize])
    
        let rows = []
        songTokens.forEach((token_i, i) => {
            let fillColor 
            let circles = []

            songTokens.forEach((token_j, j) => {
                if (token_i.toLowerCase() === token_j.toLowerCase()) {
                    fillColor = colors[token_i.toLowerCase()]
                    circles.push({
                        id: `col-${j}`,
                        cx: i * (size + padding),
                        cy: j * (size + padding),
                        r: size,
                        fill: fillColor,
                        token: token_i
                    })
                }
            })

            rows.push(circles)
        })
        
        return {svgWidth, svgHeight, graphWidth, graphHeight, song, songTokens, setOfTokens, numOfTokens, colors, color, size, padding, matrixSize, axis, rows};
    }, [tuneIndex, csvData, width]);


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
        d3.csv("data.csv").then(function(data) {
            setCsvData(data) // Cache the data
            console.log(data)
        }).catch(error => {
            console.error("Error loading CSV data:", error);
        });
    }, [])


    useEffect(() => {
        // D3 Code
        if (!variableCalculations) return;

        

        const {svgWidth,
        svgHeight,
        graphWidth,
        graphHeight,
        song,
        songTokens,
        setOfTokens,
        numOfTokens,
        colors,
        color,
        size,
        padding,
        matrixSize,
        axis,
        rows} = variableCalculations;

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

        // chart
        const chart = svg.append('g')
        .attr("id", "lyrics-chart")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

        if (!csvData) return;

        const zoomContainer = chart.append("g").attr("id", "zoom-container")
        const similarityMatrix = zoomContainer.append("g").attr("id", "similarity-matrix")

        rows.forEach((row, i) => {
            similarityMatrix.append("g").attr("id", `row-${i}`)
            .selectAll("circle")
            .data(row)
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

        const xAxis = chart.append("g").attr("id", "x-axis")/* .attr("width", graphWidth) */
        const yAxis = chart.append("g").attr("id", "y-axis")/* .attr("width", graphWidth) */

        let ratio = 12
        const zoom = lyricsZoomBehavior(axis, numOfTokens, xAxis, yAxis, zoomContainer, graphWidth, songTokens, size, ratio, matrixSize)

        const initialTransform = d3.zoomIdentity.translate(
            (svgWidth - matrixSize) / 2,
            (svgHeight - matrixSize) / 2
        );
        
        svg.on("mouseleave", () => {
            d3.select("#tooltip-lyrics").style("opacity", 0)
        })
        svg.on("mouseout", () => {
            d3.select("#tooltip-lyrics").style("opacity", 0)
        })
        svg.call(zoom).call(zoom.transform, initialTransform);

        requestAnimationFrame(() => {
            setLoading(false)
            console.log(loading)
        })
        
    }, [tuneIndex, csvData, loading]) 

     return loading ? 
        (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <ClipLoader color="#d0b6fa" loading={loading} size={width * 0.05}/>
        </div>)
        : 
        (<svg ref={svgRef}/>)
}

export default LyricsSimilarityMatrix;