


class LollipopVis {

    constructor(parentElement, data, config,chartType) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
        this.config = config;
        this.chart = chartType;

        this.initVis();

    }
    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 30, right: 50, bottom: 20, left: 120 };
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
            .range([20, vis.width]);

        vis.xScaleAxis = d3.scaleBand()
            .range([20, vis.width]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height-90, 50]);
            //.nice();


        //define axis
        vis.xAxis = d3.axisBottom()
            .scale(vis.xScaleAxis)
            .tickSizeInner(0)
            .tickPadding(5);
            //.tickSizeOuter(5);


        vis.svg.append('g')
            .attr('class', "x-axis axis")
            .attr("transform", "translate(" + -50 + "," + (vis.height-90 )+ ")")
            .call(vis.xAxis);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)
            .ticks(6)
            //.tickValues([105,110,115])
            .tickPadding(5);

        vis.svg.append('g')
            .attr('class', "y-axis axis")
            .attr("transform", "translate(" + -20 + ",0)")
            .call(vis.yAxis);

        vis.xAxisTitle = vis.svg.append("text")
            .attr("transform", "translate(" + (vis.width-40)+ "," + (vis.height-70) + ")")
            .attr("class",'x_axis_title axis_title');



        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        vis.tempData = [];
        vis.displayData = [];
        let selGroup = d3.group(vis.data, d=>d[selectedCategoryEven]);
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

        vis.tempData.sort(function (val1,val2)
        {
            return val2.value -val1.value;
        });

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

        vis.offset = 0;
        vis.offsetStart =20;
        let categoryCount = vis.displayData.length;

        if(categoryCount <6)
        {
            let x =Math.ceil(6/categoryCount);
            vis.offset = vis.offset + (vis.width/(x*0.25));
            vis.offsetStart = vis.offsetStart + (20*x)
        }


        vis.xScaleAxis
            .domain(vis.displayData.map(function(d) { return d.key; }));


        vis.xScale
            .domain(vis.displayData.map(function(d) { return d.key; }))
            .range([20, vis.width]);

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

        var nScale = d3.scaleBand()
            .domain(vis.displayData.map(function(d) { return d.key; }))
            .range([100, vis.width]);


        vis.svg.append("text")
            .attr("transform", "translate("+(-60)+ "," + ((vis.margin.top+vis.height)/2.5)  + ") rotate(-90)")
            .attr("class",'y_axis_title axis_title');

        if(vis.chart == evennessChart)
        {
        vis.svg.select(".y_axis_title").text(evennessChart)
            .attr("fill", "white")
            .attr("text-anchor", "middle");
        }
        else
        {
            vis.svg.select(".y_axis_title").text(inequalityChart)
                .attr("fill", "white")
                .attr("text-anchor", "middle");
        }


        vis.xAxisTitle.text(mapCategoryToName[selectedCategoryEven])
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        if (selectedCategoryEven == "Nationality") {
            vis.xScaleAxis.range([20, vis.width])
            vis.svg.select('.x-axis')
                .transition()
                .duration(800)
                .call(vis.xAxis)
                .selectAll("text")
                .attr("transform", `translate(10,15) rotate(20)`);
        }
        if (selectedCategoryEven == "BMI_group")
        {
            vis.xScaleAxis.range([20, vis.width-40])
            vis.svg.select('.x-axis')
                .transition()
                .duration(800)
                .call(vis.xAxis)
                .selectAll("text")
                .attr("transform", `translate(-20,12) rotate(20)`);
        }

        if (selectedCategoryEven == "age_group")
        {
        vis.xScaleAxis.range([20, vis.width-150]);
            vis.svg.select('.x-axis')
                .transition()
                .duration(800)
                .call(vis.xAxis)
                .selectAll("text")
                .attr("transform", `translate(-20,12)`);
        }

        if (selectedCategoryEven == "Sex")
        {
           vis.xScaleAxis.range([20, vis.width-200]);
            vis.svg.select('.x-axis')
                .transition()
                .duration(800)
                .call(vis.xAxis)
                .selectAll("text")
                .attr("transform", `translate(-25,12)`);
        }

        vis.svg.select('.y-axis')
            .transition()
            .duration(800)
            .call(vis.yAxis);

        let filterDietText = evennessMicorbiomeText.find(obj => obj.key === selectedCategoryEven);

        let dietText = d3.select("#even-microbiome-p").text(filterDietText.text);


    }

}
