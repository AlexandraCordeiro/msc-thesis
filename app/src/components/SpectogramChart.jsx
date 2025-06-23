import React, {useRef, useLayoutEffect, useMemo, useCallback, useState, useEffect} from "react";
import * as d3 from "d3";
import {noteToMidi, hzToMidi, midiToHz, midiToNote, getStartOffset, fontSize, removeElement} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"
import ClipLoader from "react-spinners/ClipLoader"

const SpectogramChart = ({tune, gridId}) => {

    // remove unwanted tooltips
    removeElement("tooltip-lyrics")
    removeElement("tooltip-sparklines")
    removeElement("tooltip-intervals")

    const svgRef = useRef(null);
    const [width, height] = useWindowSize(gridId);
    const filename = `/audio_vs_score/${tune}_audio_vs_score.json`
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)

    const dimensions = useMemo(() => {
        const svgHeight = width * 0.9;
        const svgWidth = svgHeight;
        const graphWidth = svgWidth * 0.5;
        const graphHeight = graphWidth;
        const innerRadiusSpectogram = graphWidth * 0.35;
        const outerRadiusSpectogram = graphWidth * 0.9;
        
        return {
            svgWidth,
            svgHeight,
            graphWidth,
            graphHeight,
            innerRadiusSpectogram,
            outerRadiusSpectogram
        };
    }, [width]);


    const variableCalculations = useMemo(() => {
        if (!data) return null
        // ignore initial silence
        const offsetIndex = getStartOffset(data.melodic_contour[0].f0)
        const audioContourTime = data.melodic_contour[0].time.slice(offsetIndex)
        const timeOffset = audioContourTime[0]
        const normalizedAudioContourTime = audioContourTime.map(t => t - timeOffset)
        const audioContourFrequency = data.melodic_contour[0].f0.slice(offsetIndex)
        const audioContourDb = data.melodic_contour[0].f0_db
        
        // spectogram data
        const groupDataByTime = Array.from(d3.group(data.audio_spectogram_data, d => +d.time)).flatMap(d => d[1])
        const spectogramTimeDomain = [d3.min(normalizedAudioContourTime), d3.max(normalizedAudioContourTime)]
        const spectogramFrequencyDomain = [midiToHz(noteToMidi("C1")), d3.max(data.audio_spectogram_data, d => +d.freq)]
        const audioContourTimeDomain = [d3.min(normalizedAudioContourTime), d3.max(normalizedAudioContourTime)]
    
        // score
        const scoreContourTime = data.score_contour.map(d => d.end)
        const scoreContourNotes = data.score_contour.map(d => d.note)

        // other
        const dbThreshold = 0;
        const audioPathData = normalizedAudioContourTime.map((time, i) => ({
            time: +time,
            f0: +audioContourFrequency[i],
            db: +audioContourDb[i]
        }));

        const scoreNotesData = data.score_contour.flatMap(d => [
            {note: d.note, time: +d.start},
            {note: d.note, time: +d.end}
        ]);

        return {offsetIndex,
            audioContourFrequency,
            audioContourDb,
            audioContourTime,
            normalizedAudioContourTime,
            groupDataByTime,
            spectogramTimeDomain,
            spectogramFrequencyDomain,
            audioContourTimeDomain,
            scoreContourTime,
            scoreContourNotes,
            dbThreshold,
            audioPathData,
            scoreNotesData};
    }, [data])


    const createScales = useCallback(() => {

        const x = (domain) => {
            return d3.scaleLinear()
                .range([(-Math.PI/2), (-Math.PI/2) + (2*Math.PI)])             
                .domain(domain)
        };
        
        const y = (innerRadius, outerRadius, domain) => {
            return d3.scaleRadial()
                .range([innerRadius, outerRadius])   
                .domain(domain)
                .nice()
        };

        const yLog = (innerRadius, outerRadius, domain) => {
            return d3.scaleLog()
            .domain(domain)
            .range([innerRadius, outerRadius])
            .clamp(true);
        };

        return { x, y, yLog};
    }, []);

    const mouseOver = useCallback((d, time, circle) => {

        console.log(circle.attr("id"))
        let text
        let r = circle.attr("r")

        if (circle.attr("id") == "tooltip-score-contour") {
            text = `Note: ${d}`
            circle.transition()
            .attr("r", 10)
            .attr("fill", "#390160")
            .attr("opacity", 0.5)
            .attr("class", "circle-in-focus")
        }
        if (circle.attr("id") == "tooltip-audio-contour") {
            text = `Frequency: ${d.toFixed(3)} Hz\nApproximate Note: ${midiToNote(hzToMidi(d))}\nTime: ${time.toFixed(3)} s`
            circle
            .attr("r", 10)
            .attr("fill", "#390160")
            .attr("opacity", 0.5)
            .attr("class", "circle-in-focus")
        }

        d3.select("#tooltip-score")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("color", '#390160')
        .style("font-family", "montserrat")
        .style("font-size", '14px')
        .text(`${text}`)


        
    }, [])
    
    const mouseMove = useCallback((e) => {
        d3.select("#tooltip-score")
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + 10 + "px")
    }, [])

    const mouseOut = useCallback((circle) => {
        d3.select("#tooltip-score").style("opacity", 0)

        if (circle.attr("id") == "tooltip-score-contour") {
            circle
            .transition()
            .attr("r", 3)
            .attr("fill", "#390160")
            .attr("opacity", 1)
        }
        if (circle.attr("id") == "tooltip-audio-contour") {
            circle.attr("fill", "none")
        }

        
    }, [])


    useEffect(() => {
        d3.json(filename).then((loadedData) => {
            setData(loadedData)
            requestAnimationFrame(() => setLoading(false)) // render spinner!
        })
    }, [filename])

    useEffect(() => {

        if (!data || !variableCalculations || loading) {
            return;
        }

        // D3 Code
        const {
            svgWidth,
            svgHeight,
            graphWidth,
            graphHeight,
            innerRadiusSpectogram,
            outerRadiusSpectogram
        } = dimensions;

        const {offsetIndex,
            audioContourFrequency,
            audioContourDb,
            audioContourTime,
            normalizedAudioContourTime,
            groupDataByTime,
            spectogramTimeDomain,
            spectogramFrequencyDomain,
            audioContourTimeDomain,
            scoreContourTime,
            scoreContourNotes,
            dbThreshold,
            audioPathData, scoreNotesData} = variableCalculations

        const { x, y, yLog} = createScales();
        // create svg
        const svg = d3.select(svgRef.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        
        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();


        d3.select("body")
        .append("div")
        .attr("id", "tooltip-score")
        .attr("style", "position: absolute; opacity: 0;")

        const viz = svg.append("g")
        .attr("id", "audio-vs-score")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .attr("transform", `translate(${svgWidth * 0.5}, ${svgHeight * 0.5})`)
        
        const spectogram = viz.append("g").attr("id", "spectogram")
        const audioContour = viz.append("g").attr("id", "melodic-contour")
        const scoreContour = viz.append("g").attr("id", "score-contour")
        
        const maxDb = d3.max(data.audio_spectogram_data.map(d => +d.db))
        const minDb = d3.min(data.audio_spectogram_data.map(d => +d.db))
    
        // audio contour

            
    
        var yScore = yLog(innerRadiusSpectogram, outerRadiusSpectogram, spectogramFrequencyDomain)
        var xScore = x([0, d3.max(data.score_contour.map(d => d.end))])
        let xAudio = x(audioContourTimeDomain)
            

        let colorScale = d3.scaleLinear()
            .range(["#e0f4fd", "#390160"])
            .domain([minDb, maxDb])
    

        

        const opacityScale = d3
        .scaleLog()
        .domain([1, (maxDb) + 1 + Math.abs(minDb)])
        .range([0, 0.7])
        
        const radiusScale = (maxRadius) => {
            return d3
            .scaleLog()
            .domain([1, -dbThreshold + 1 + Math.abs(minDb)])
            .range([0, maxRadius])
        } 
        

        let areaGenerator = d3.areaRadial()
        // angle 0 starts at 12 o'clock
        .angle(d => xAudio(d.time) + Math.PI / 2) 
        .innerRadius(d => yScore(+d.f0) - 3)  
        .outerRadius(d => yScore(+d.f0) + 3)
        .defined(d => +d.f0) 
        .curve(d3.curveBasis); 

        
            
        audioContour.append("path")
        .datum(audioPathData)
        .attr("fill", "black")
        .attr("fill-opacity", 0.7)
        .attr("d", d => areaGenerator(d))

        audioContour.selectAll("circle")
        .data(d3.filter(audioPathData, d => d.f0 > 0))
        .enter()
        .append("circle")
        .attr("id", "tooltip-audio-contour")
        .attr("fill", "none")
        .style("pointer-events", "all")
        .attr("cx", d => yScore(+d.f0) * Math.cos(xAudio(d.time)))
        .attr("cy", d => yScore(+d.f0) * Math.sin(xAudio(d.time)))
        .attr("r", 10)
        .on("mouseover", (e, d) => mouseOver(d.f0, d.time, d3.select(e.target)))
        .on("mouseout", e => mouseOut(d3.select(e.target)))
        .on("mousemove", e => mouseMove(e));
        


    
        scoreContour.selectAll("line")
        .data(data.score_contour)
        .enter()
            .append("line")
            .attr("fill", "none")
            .attr("stroke", "#390160")
            .attr("stroke-width", 3)
            .attr("x1", d => yScore(midiToHz(noteToMidi(d.note))) * Math.cos(xScore(+d.start)))
            .attr("y1", d => yScore(midiToHz(noteToMidi(d.note))) * Math.sin(xScore(+d.start)))
            .attr("x2", d => yScore(midiToHz(noteToMidi(d.note))) * Math.cos(xScore(+d.end)))
            .attr("y2", d => yScore(midiToHz(noteToMidi(d.note))) * Math.sin(xScore(+d.end)))
    
        
        

        scoreContour.selectAll(".scoreNotes")
            .data(scoreNotesData)
            .enter()
                .append("circle")
                .attr("cx", d => yScore(midiToHz(noteToMidi(d.note))) * Math.cos(xScore(+d.time)))
                .attr("cy", d => yScore(midiToHz(noteToMidi(d.note))) * Math.sin(xScore(+d.time)))
                .attr("fill", "#390160")
                .attr("r", 3.5)
                .attr("id", "tooltip-score-contour")
                .on("mouseover", (e, d) => mouseOver(d.note, d.time, d3.select(e.target)))
                .on("mouseout", e => mouseOut(d3.select(e.target)))
                .on("mousemove", e => mouseMove(e));
                

        scoreContour            
    
        
        let ySpectogram = yLog(innerRadiusSpectogram, outerRadiusSpectogram, spectogramFrequencyDomain)
        let xSpectogram = x(spectogramTimeDomain)
        
        const n = Math.floor(groupDataByTime.length / 513)
        let maxTimeDataPoints = 350
        let step = Math.ceil(n / maxTimeDataPoints)
        let downsample = []
        let timeValues = Array.from(d3.group(data.audio_spectogram_data.filter(d => +d.time >= normalizedAudioContourTime[offsetIndex]), d => +d.time).keys())

        if (n > maxTimeDataPoints) {
            downsample.push(timeValues[0])
            for (let i = 0; i < timeValues.length; i++) {
                if ((i + 1) % step == 0) {
                    downsample.push(timeValues[i])
                }
            }
            timeValues = downsample
        }

        spectogram.selectAll("circle")
            .data(d3.filter(groupDataByTime, d => +d.freq > 0))
            .enter()
            .each(function (d, i) {
                if ((+d.db >= minDb * 0.5) && timeValues.includes(+d.time) && i % 3 == 0) {
                    d3.select(this)
                    .append("circle")
                    .attr("cx", ySpectogram(+d.freq) * Math.cos(xSpectogram(+d.time)))
                    .attr("cy", ySpectogram(+d.freq) * Math.sin(xSpectogram(+d.time)))
                    .attr("fill", colorScale(+d.db))
                    .attr("fill-opacity", opacityScale(+d.db + Math.abs(maxDb) + 1))
                    .each(function (d) {
                        let maxRadius = (((ySpectogram(+d.freq) * 2 * Math.PI) / (maxTimeDataPoints)))
                        let newRadiusScale = radiusScale(maxRadius)
                        d3.select(this).attr("r", newRadiusScale(+d.db + Math.abs(maxDb) + 1))
                    })
                }
            })
    
            

        
        let yAxis = viz.append("g")
        .attr("id", "y-axis")
        .attr("color", "black")
        .call(d3.axisLeft(yLog(-innerRadiusSpectogram, -outerRadiusSpectogram, spectogramFrequencyDomain)).tickValues([midiToHz(noteToMidi("C1")), midiToHz(noteToMidi("C2")), midiToHz(noteToMidi("C3")), midiToHz(noteToMidi("C4")), midiToHz(noteToMidi("C5")), midiToHz(noteToMidi("C6")), midiToHz(noteToMidi("C7")), midiToHz(noteToMidi("C8"))]).tickFormat(d => (midiToNote(hzToMidi(d)) == "C1" ) || (midiToNote(hzToMidi(d)) =="C8") ? midiToNote(hzToMidi(d)) : ""))
        .selectAll("text") 
        .style('font-family', 'montserrat')
        .style('font-weight', 500)
        .style('font-size', `12px`)
        
    
        let xAxisRadius = innerRadiusSpectogram - 7
    
        let xAxis = viz.append("g")
        .attr("id", "x-axis")
        
        xAxis.append("g")
        .attr("id", "axisBottom")
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", (xAxisRadius))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
            

        const maxTime = parseInt(d3.max(normalizedAudioContourTime));
        const breakpoints = {xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536}
        let stepXAxis = 1
        
        const ticks = d3.range(0, maxTime, stepXAxis)
    
        const tickData = ticks.map(tick => {
            const angle = xAudio(tick)
            return {
                tick,
                angle,
                x1: xAxisRadius * Math.cos(angle),
                y1: xAxisRadius * Math.sin(angle),
                x2: (xAxisRadius - 5) * Math.cos(angle),
                y2: (xAxisRadius - 5) * Math.sin(angle),
                textX: (xAxisRadius - 20) * Math.cos(angle),
                textY: (xAxisRadius - 20) * Math.sin(angle)
            };
        })

        xAxis.selectAll(".tick-line")
            .data(tickData)
            .enter()
            .append("line")
            .attr("x1", d => d.x1)
            .attr("y1", d => d.y1)
            .attr("x2", d => d.x2)
            .attr("y2", d => d.y2)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        xAxis.selectAll(".tick-label")
            .data(tickData)
            .enter()
            .append("text")
            .text(d => d.tick)
            .attr("x", d => d.textX)
            .attr("y", d => d.textY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style('font-family', 'montserrat')
            .style('font-weight', '500')
            .style('font-size', `12px`);
        
        d3.selectAll(".tick").each(function(d,i){

        var tick = d3.select(this),
            text = tick.select('text'),
            bBox = text.node().getBBox();

            if (text.node().innerHTML == "C1" || text.node().innerHTML == "C8") {
            tick.append('rect')
                .attr('x', bBox.x - 3)
                .attr('y', bBox.y - 3)
                .attr('height', bBox.height + 6)
                .attr('width', bBox.width + 6)
                .attr("rx", '0.5rem')
                .attr("ry", '0.5rem')
                .attr("fill", "white")
                .attr("opacity", 0.6)
                .lower()    
            }
        
        });

        viz.append("defs")
        .append("path")
        .attr("id", "circlePath")
        .attr("d", d3.arc()
        .innerRadius(innerRadiusSpectogram)
        .outerRadius(innerRadiusSpectogram)
        .startAngle(-Math.PI / 1.02)
        .endAngle(3 * Math.PI / 2))

        viz.append("text")
        .append("textPath")
        .attr("href", "#circlePath")
        .attr("startOffset", "25%")
        .attr("font-family", "montserrat")
        .attr("font-weight", 500)
        .attr("font-size", '12px')
        .text("Time (seconds)");


        viz.append("text")
        .attr("font-family", "montserrat")
        .attr("font-weight", 500)
        .attr("font-size", '12px')
        .attr("transform", `translate(-8, ${-outerRadiusSpectogram - 8})`)
        .text("Note / Frequency (Hz)");
        
        setLoading(false);
        
    }, [tune, dimensions, createScales, loading]) // redraw chart if data changes

    return loading ? 
        (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <ClipLoader color="#d0b6fa" loading={loading} size={width * 0.05}/>
        </div>)
        : 
        (<svg ref={svgRef}/>)
}

export default SpectogramChart;