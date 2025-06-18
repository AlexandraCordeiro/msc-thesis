import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export const setOfTokensFromString = (text) => {
    return new Set(text.split(/\s/g))
}

export const arrayOfTokensFromString = (text) => {
    return text.split(/\s/g)
}

export const cleanString = (text) => {
    return text.replace(/[^'’a-zA-Z\s]/g, '')
}

export const fontSize = (windowWidth) => {

    /* Larger screens */
    if (windowWidth >= 992) {
        return 16
    }
    /* Smaller tablets and mobile */
    if (windowWidth <= 768) {
        return 14
    }
    return 14
}

export const noteToMidi = (n) => {
    if (!n) {return 0}
    let octave = parseInt(n.match(new RegExp("[0-9]+"))[0])
    let acc = n.match(new RegExp("[#b]"))
    acc ? acc = acc[0] : acc = ""

    let note = n.match(new RegExp("[a-zA-Z]+"))[0]

    const noteValues = {
        'C': 0, 'C#': 1, 'Db': 1,
        'D': 2, 'D#': 3, 'Eb': 3,
        'E': 4, 
        'F': 5, 'F#': 6, 'Gb': 6,
        'G': 7, 'G#': 8, 'Ab': 8,
        'A': 9, 'A#': 10, 'Bb': 10,
        'B': 11
    }

    return noteValues[note + acc] + (parseInt(octave) + 1) * 12
}

export const hzToMidi = (freq) => {
    // formula hz to note (midi note)
    let midi = Math.round(12 * Math.log2((freq / 440)) + 69)
    let name = midiToNote(midi)
    return noteToMidi(name)
}

export const midiToHz = (midi) => {
    return 440 * Math.pow(2, (midi - 69) / 12)
}

export const midiToNote = (midi) => {
    let noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    let octave = Math.floor((midi / 12) - 1)
    let noteIndex = (midi % 12)
    return noteNames[noteIndex] + octave
}

export const radsToDegrees = (rads) => {
    return (rads * 180) / Math.PI
}

export const getStartOffset = (f0) => {

    for (let i = 0; i < f0.length - 1; i++) {
        if (f0[i] == 0 && f0[i + 1] > 0) {
            // save index for later
            return i + 1;
        }
    }
    return 0;

}

// Get point in global SVG space
export function cursorPoint(evt, svg){
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function drawLinks(data, group, graphHeight, graphWidth, x, extent) {

    let opacityScale = d3.scaleLinear()
    .range([0.1, 1])
    .domain([d3.min(data.links.map(d => d.count)), d3.max(data.links.map(d => d.count))])

    let colorScale = d3.scaleLinear()
    .range(["#fc00ff", "#00dbde"])
    .domain([noteToMidi("C1"), noteToMidi("C8")])

    // Add links between nodes
    const idToNode = {};
    data.nodes.forEach(function (n) {
        idToNode[n.id] = n;
    });

    // Add the links
    const links = group
    .append('g')
    .attr('id', 'links')
    .attr("class", "links")
    .selectAll('links')
    .data(data.links)
    .join('path')
    .attr('d', (d, i) => {
        console.log(d.name)
        let y = 0
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
    .attr("stroke", d => colorScale((idToNode[d.source].id + idToNode[d.target].id) / 2))
    .attr("stroke-width", "0.05rem"/* d => d.count */)
    .attr("stroke-opacity", d => opacityScale(d.count))

    return links
}

/* export function drawNoteFrequencyRings(data, group, graphWidth, x, colorGradient) {
    group
    .append('g')
    .attr('id', 'rings')
    .selectAll('g')
    .data(data.nodes.filter(d => d.frequency > 0))
    .enter()
        .append('g')
        .attr('id', d => 'ring-'+ d.name)
        .selectAll('circle')
        .data(d => {
            let map = new Map()
            for (let i = 0; i < d.frequency; i++) {
                map.set(i, d.id)
            }
            return map;
        })
        .enter()
            .append('circle')
            .attr('cx', d => x(d[1]))
            .attr('cy', -graphWidth * 0.1)
            .attr('r', d => 4 * (d[0] + 1)) 
            .style('stroke', (d, i) => colorGradient(i))
            .attr("stroke-width", "0.08rem")
            .style('fill', 'none')
} */

export function drawNoteFrequencyRings(data, group, graphWidth, x) {
    const radius = d3.scaleLinear()
    .range([graphWidth * 0.01, graphWidth * 0.1])
    .domain([d3.min(data.nodes.map(d => d.frequency)), d3.max(data.nodes.map(d => d.frequency))])

    const radialGradient = group.append('defs')
    .append('radialGradient')
    .attr('id', 'gradient')

    
    radialGradient.append('stop')
        .attr('offset', '10%')
        .attr('stop-color', '#f9def1')

    radialGradient.append('stop')
    .attr('offset', '95%')
    .attr('stop-color', '#6889fc')

    group
    .append('g')
    .attr('id', 'rings')
    .selectAll('g')
    .data(data.nodes.filter(d => d.frequency > 0))
    .enter()
        .append('circle')
        .attr('id', d => 'ring-'+ d.name)
        .attr('cx', d => x(d.id))
        .attr('cy', -graphWidth * 0.1)
        .attr('r', d => radius(d.frequency))      
        .attr('fill', 'url(#gradient)')
        .attr('fill-opacity', 0.4)

}

export function drawSparklines(data, group, graphHeight, graphWidth, x, id) {

    let note = data.note_frequency_by_measure.find(d => d.id === id)

    if (note) {
        const sparklineSize = graphWidth * 0.1
        const measures = data.note_frequency_by_measure.flatMap(d => d.measures.map(m => m.measure))
    
    
        const xHistogram = d3.scaleLinear()
        .range([0, sparklineSize])
        .domain([d3.min(measures), d3.max(measures)])
    
        const yHistogram = d3.scaleLinear()
        .range([0, -sparklineSize])
        .domain([0, d3.max(data.note_frequency_by_measure.flatMap(d => d.measures.map(m => m.counter)))])
    
        const sparklines = group.append('g')
        .attr('id', 'sparklines')
        .attr("color", "black")

    
        const areaGenerator = d3.area()
        .x(d => xHistogram(d.measure))
        .y0(yHistogram(0))
        .y1(d => yHistogram(d.counter))
        .curve(d3.curveBasis)
        
        let xOffset = 30
        let yOffset = 20
        
        const histogram = sparklines.append('g').attr("id", "histogram")

        const range = d3.range(d3.min(measures), d3.max(measures) + 1)
        let numTicks = range.length


        if (numTicks >= 6) numTicks = 5;

        histogram.append("path")
        .datum(note.measures)
        .attr("fill", "#6889fc")
        .attr("d", d => areaGenerator(d))
    
        histogram.append("g")
        .attr("id", "histogram-x-axis")
        .call(d3.axisBottom(xHistogram).ticks(numTicks).tickFormat(d3.format("d")))
        .attr('style', 'font-family: montserrat')

        
        histogram.append("g")
        .attr("id", "histogram-y-axis")
        .call(d3.axisLeft(yHistogram).ticks(numTicks).tickFormat(d3.format("d")))
        .attr('style', 'font-family: montserrat')


        // x label
        histogram.append("g")
        .attr("id", "x-label")
        .append("text")
        .attr('class', 'sparkline-labels')
        .text("Measure")
        .attr("text-anchor", "middle")
        .attr("x", sparklineSize / 2)
        .attr("y", xOffset)


        // y label
        histogram.append("g")
        .attr("id", "y-label")
        .append("text")
        .attr('class', 'sparkline-labels')
        .text("Count")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${-yOffset}, ${-sparklineSize / 2}) rotate(-90) `)


        // title
        histogram.append("g")
        .attr("id", "sparkline-title")
        .append("text")
        .text("Note Distribution")
        .attr("x", 0)
        .attr("y", 0)
        .attr('class', 'sparkline-labels')
        .attr("font-weight", "600")
        .attr("text-anchor", "start")
        .attr("transform", `translate(${-yOffset*1.5}, ${-sparklineSize-yOffset*2})`)

        // Note hovered
        histogram.append("g")
        .attr("id", "sparkline-note")
        .append("text")
        .text(midiToNote(id))
        .attr('class', 'sparkline-labels')
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-weight", "600")
        .attr("text-anchor", "start")
        .attr("fill", "#565656")
        .attr("transform", `translate(${-yOffset*1.5}, ${-sparklineSize-yOffset})`)


        let histogramBBox = d3.select("#histogram").node().getBBox()

        sparklines
        .append("rect")
        .attr("width", sparklineSize + (yOffset * 6))
        .attr("height", sparklineSize + (xOffset * 4))
        .attr("rx", '1rem')
        .attr("ry", '1rem')
        .attr("stroke", '#C7D0DD')
        .attr("stroke-width", "1px")
        .attr("fill", "white")
        .attr("class", "sparkline-tooltip")
        .attr("transform", `translate(${-yOffset * 2.5}, ${-sparklineSize - (xOffset * 2.5)})`)
        .lower()


        return histogram

    }

}

export function drawXAxis(data, group, graphHeight, x, extent) {
    // display x axis
    const noteNamesAxis = group.append("g")
    .attr("color", "black")
    .attr("stroke-width", 1)
    .attr("font-size", "12px")
    .attr("id", "note-names-x-axis")

    console.log(extent)
    noteNamesAxis
    .call(
        d3.axisBottom(x)
        .tickValues(extent)
        .tickFormat(d => midiToNote(d))
    );

    return noteNamesAxis
}

export function lyricsZoomBehavior(axis, numOfTokens, xAxis, yAxis, zoomContainer, graphWidth, songTokens, size, ratio)  {
    let lastK = -1
    
    // console.log(ratio)
    return d3.zoom()
    .scaleExtent([1, ratio])
    .translateExtent([[0, 0], [graphWidth, graphWidth]])

    .on("zoom", (event) => {
        
        
        // update coordinates
        let axisInnerPadding = - 1.5 * size * event.transform.k
        const approxLabelWidth = 20;
        const maxTicks = Math.floor(graphWidth / approxLabelWidth);
        const tickStep = Math.ceil(numOfTokens / (maxTicks * event.transform.k));
        const effectiveTickStep = Math.max(tickStep, 1);

        zoomContainer.attr("transform", event.transform)

        xAxis.attr("transform", `translate(${event.transform.x}, ${event.transform.y + axisInnerPadding})`)
        yAxis.attr("transform", `translate(${event.transform.x + axisInnerPadding}, ${event.transform.y})`)

        // when zoom in/out
        if (event.transform.k != lastK) {
            // update last k
            lastK = event.transform.k

            // update scale
            let updateScale = event.transform.rescaleX(axis)
            let currentDomain = updateScale.domain()
            let fontSize = 14
            let newScale = updateScale

            if (currentDomain[0] < 0) {
                newScale = d3.scaleLinear()
                .domain([0, numOfTokens - 1])
                .range([0, graphWidth * event.transform.k])
            }

            // display x axis (semantic zoom)
            xAxis
            .attr("stroke-width", "1px")
            .attr("color", "black")
            .call(
                d3.axisTop(newScale)
                .tickValues(d3.range(0, numOfTokens, effectiveTickStep))
                .tickFormat(d => songTokens[d])
            )

            xAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style('text-anchor', 'start')
            .style('font-family', 'montserrat')
            .style('font-size', `${fontSize}px`)

            // display y axis (semantic zoom)
            yAxis
            .attr("stroke-width", "1px")
            .attr("color", "black")
            .call(
                d3.axisLeft(newScale)
                .tickValues(d3.range(0, numOfTokens, effectiveTickStep))
                .tickFormat(d => songTokens[d])
            )

            yAxis.selectAll("text")
            .style('text-anchor', 'end')
            .style('font-family', 'montserrat')
            .style('font-size', `${fontSize}px`)
        }
    
    })
    
}