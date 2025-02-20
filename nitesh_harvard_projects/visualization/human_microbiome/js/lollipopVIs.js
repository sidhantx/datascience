
class LollipopVis3 {

    constructor(parentElement, data, config) {
        console.log("I am at LollipoVis3");
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
        this.config = config;

        console.log(this.data);
        console.log(config);
        this.initVis();

    }
    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 100, bottom: 10, left: 100 };
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        console.log(vis.width);
        console.log(vis.height);
        // * TO-DO *

        // SVG drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //define scale
        vis.xScale = d3.scaleBand()
            .range([0, vis.width]);

        vis.xScaleAxis = d3.scaleBand()
            .range([20, vis.width])
            .domain(['Baseline','Intervention']);


        vis.yScale = d3.scaleLinear()
            .range([vis.height-40, 20])
        //.nice();


        //define axis
        vis.xAxis = d3.axisBottom()
            .scale(vis.xScaleAxis)
            .tickSizeInner(1)
            .tickPadding(10);


        vis.svg.append('g')
            .attr('class', "x-axis axis")
            .attr("transform", "translate(" + -40 + "," + (vis.height-40 )+ ")")
            .call(vis.xAxis);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)
            .ticks(5)
            //.tickValues([105,110,115])
            .tickPadding(0);

        vis.svg.append('g')
            .attr('class', "y-axis axis")
            .attr("transform", "translate(" + -20 + ",3)")
            .call(vis.yAxis);

        vis.svg.append("text")
            .attr("transform", "translate("+(-65)+ "," + ((vis.margin.top+vis.height)/2.5)  + ")rotate(-90)")
            .attr("class",'y_axis_title axis_title')
            .text(vis.config.key)
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        vis.wrangleData();

    }

    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        vis.tempData = [];
        vis.displayData = [];
        let selGroup = d3.group(vis.data, d => d.Group);
        let selArray = Array.from(selGroup,([key,value])=>({key, value}) );
        console.log(selArray);



        for (let i=0; i<selArray.length;i++) {

            let x = selArray[i].value;
            let sum =0;
            for(let k=0; k<x.length;k++)
            {
                sum = sum + x[k][vis.config.key];
            }

            vis.tempData.push({'key':selArray[i].key,'value': sum/ x.length});
        }


        console.log(vis.tempData);
        vis.displayData = vis.tempData;
        vis.updateVis();
    }



    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {

        let vis = this;
        console.log("In updateVis");
        console.log(vis.displayData);

        vis.xScale.domain(vis.displayData.map(function(d) { return d.key; }));

        vis.yScale.domain([0.0,
            d3.max(vis.displayData, (d) => d.value)]);

        console.log(d3.max(vis.displayData, (d) => d.value));
        console.log(vis.yScale(0));
        console.log(vis.yScale(0.6213643526));


        let lines = vis.svg.selectAll(".myline")
            .data(vis.displayData);


        lines.enter()
            .append('line')
            .attr("class", 'myline')
            .transition()
            .duration(1000)
            .attr('x1', d => vis.xScale(d.key))
            .attr('x2', d=> vis.xScale(d.key))
            .attr('y1', d=> vis.yScale(0))
            .attr('y2', d=> vis.yScale(d.value))
            .attr("stroke", "darkgrey")
            .attr("stroke-width",5);

        lines.exit().remove();

        let circles = vis.svg.selectAll(".mycircle")
            .data(vis.displayData);

        circles.enter()
            .append("circle")
            .attr("class", "mycircle")
            .transition()
            .duration(1000)
            .attr("cx", d => vis.xScale(d.key))
            .attr("cy", d=> vis.yScale(d.value))
            .attr("r", 10)
            .attr("fill", "#c25d5d");

        circles.exit().remove();

        vis.svg.select('.x-axis')
            .transition()
            .duration(800)
            .call(vis.xAxis);

        vis.svg.select('.y-axis')
            .transition()
            .duration(800)
            .call(vis.yAxis);

    }

}
