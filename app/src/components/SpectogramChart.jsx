import React, {useRef, useLayoutEffect, useMemo, useCallback, useState, useEffect} from "react";
import * as d3 from "d3";
import {noteToMidi, hzToMidi, midiToNote, getStartOffset, fontSize} from "../functions.js";
import {useWindowSize} from "./UseWindowSize.jsx"
import ClipLoader from "react-spinners/ClipLoader"

const SpectogramChart = ({tune}) => {
    const svgRef = useRef(null);
    const [width, height] = useWindowSize();
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
        const audioContourFrequency = data.melodic_contour[0].f0.slice(offsetIndex)
        const audioContourDb = data.melodic_contour[0].f0_db
        
        // spectogram data
        const groupDataByTime = Array.from(d3.group(data.audio_spectogram_data, d => +d.time)).flatMap(d => d[1])
        const spectogramTimeDomain = [audioContourTime[offsetIndex], d3.max(audioContourTime)]
        const spectogramFrequencyDomain = d3.extent(data.audio_spectogram_data, d => +d.freq)
        const audioContourTimeDomain = [d3.min(audioContourTime), d3.max(audioContourTime)]
    
        // score
        const scoreContourTime = data.score_contour.map(d => d.end)
        const scoreContourNotes = data.score_contour.map(d => d.note)

        // other
        const dbThreshold = 30;
        const audioPathData = audioContourTime.map((time, i) => ({
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

        return { x, y };
    }, []);

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

        const { x, y } = createScales();

        // create svg
        const svg = d3.select(svgRef.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        
        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

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
        const {offsetIndex,
            audioContourFrequency,
            audioContourDb,
            audioContourTime,
            groupDataByTime,
            spectogramTimeDomain,
            spectogramFrequencyDomain,
            audioContourTimeDomain,
            scoreContourTime,
            scoreContourNotes,
        dbThreshold,
    audioPathData, scoreNotesData} = variableCalculations
            
    
        var yScore = y(innerRadiusSpectogram, outerRadiusSpectogram, [noteToMidi("C2"), noteToMidi("C7")])
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
        .innerRadius(d => yScore(hzToMidi(+d.f0)) - 3)  
        .outerRadius(d => yScore(hzToMidi(+d.f0)) + 3)
        .defined(d => +d.f0) 
        .curve(d3.curveBasis); 

        
            
        audioContour.append("path")
        .datum(audioPathData)
        .attr("fill", "black")
        .attr("fill-opacity", 0.8)
        .attr("d", d => areaGenerator(d))

    
        scoreContour.selectAll("line")
        .data(data.score_contour)
        .enter()
            .append("line")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", graphWidth * 0.004)
            .attr("x1", d => yScore(noteToMidi(d.note)) * Math.cos(xScore(+d.start)))
            .attr("y1", d => yScore(noteToMidi(d.note)) * Math.sin(xScore(+d.start)))
            .attr("x2", d => yScore(noteToMidi(d.note)) * Math.cos(xScore(+d.end)))
            .attr("y2", d => yScore(noteToMidi(d.note)) * Math.sin(xScore(+d.end)))
    
        
        

        scoreContour.selectAll(".scoreNotes")
            .data(scoreNotesData)
            .enter()
                .append("circle")
                .attr("cx", d => yScore(noteToMidi(d.note)) * Math.cos(xScore(+d.time)))
                .attr("cy", d => yScore(noteToMidi(d.note)) * Math.sin(xScore(+d.time)))
                .attr("fill", "black")
                .attr("r", graphWidth * 0.007)
            
    
        
        let ySpectogram = y(innerRadiusSpectogram, outerRadiusSpectogram, spectogramFrequencyDomain)
        let xSpectogram = x(spectogramTimeDomain)
        
        const n = Math.floor(groupDataByTime.length / 513)
        let maxTimeDataPoints = 350
        let step = Math.ceil(n / maxTimeDataPoints)
        let downsample = []
        let timeValues = Array.from(d3.group(data.audio_spectogram_data.filter(d => +d.time >= audioContourTime[offsetIndex]), d => +d.time).keys())

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
            .data(groupDataByTime)
            .enter()
            .each(function (d, i) {
                if (!(+d.db <= -dbThreshold) && timeValues.includes(+d.time) && i % 3 == 0) {
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
        .call(d3.axisLeft(y(-innerRadiusSpectogram, -outerRadiusSpectogram, [noteToMidi("C2"), noteToMidi("C7")])).tickValues([noteToMidi(scoreContourNotes[0]), hzToMidi(audioContourFrequency[0])]).tickFormat(d => midiToNote(d)))
        .selectAll("text") 
        .style('font-family', 'montserrat')
        .style('font-size', `${fontSize(width)}px`)
        
    
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
    
        const maxTime = parseInt(d3.max(scoreContourTime));
        const ticks = maxTime > 25 ? 
            d3.range(0, maxTime, 2) : 
            d3.range(0, maxTime, 1);
    
        const tickData = ticks.map(tick => {
            const angle = xScore(tick)
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
            .style('font-size', `${fontSize(width)}px`);
              
        
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