


class BeeswarmVis {
    constructor(parentElement, dataRegion, dataBmi) {

        this.parentElement = parentElement;
        //this.data = data;
        this.displayDataRegion = dataRegion ;
        this.displayDataBmi = dataBmi;
        this.displayData = [];

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 50, bottom: 100, left: 50, chartWidth:200};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        console.log(vis.width);
        console.log(vis.height);

        //svg area
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("class","bee_svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.xScale = d3.scaleBand()
            .range([0, vis.width-vis.margin.chartWidth]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height-20, 20])
        //.nice();

        vis.radiusScale = d3.scaleLinear()
            .range([5,12]);


        //define axis
        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)
            .tickSizeInner(1)
            .tickSizeOuter(5);


        vis.svg.append('g')
            .attr('class', "x-axis axis")
            .attr("transform", "translate(" + 0 + "," + (vis.height)+ ")")
            .call(vis.xAxis);

        //define legend
        vis.legendColor = d3.legendColor();
        vis.legendSize = d3.legendSize();

        vis.ordinaScale = d3.scaleOrdinal()
            .range(colorbrewer.Paired[12]);


        vis.svg.append('g')
            .attr("class", "legendOrdinal")
            .attr("transform", "translate("+(vis.width -100) + ","+0+")");

        vis.svg.append('g')
            .attr("class", "legendSize")
            .attr("transform", "translate("+(vis.width -160) + ","+0+")");


        //circle and text







        // vis.yAxis = d3.axisLeft()
        //     .scale(vis.yScale)
        //     .ticks(5)
        //     //.tickValues([105,110,115])
        //     .tickPadding(5);
        //
        // vis.svg.append('g')
        //     .attr('class', "y-axis axis")
        //     .attr("transform", "translate(" + 0 + ",10)")
        //     .call(vis.yAxis);


        vis.wrangleData();


    }

    wrangleData()
    {
        let vis = this;
        vis.displayData = [];

        if (selectedCategoryBees =='BMI')
        {
            vis.displayData = vis.displayDataBmi;
        }

        else
        {
            vis.displayData = vis.displayDataRegion;
        }


        console.log(vis.displayData);
        //debugger;

        vis.updateVis();
    }

    updateVis()
    {
        let vis = this;

        vis.ordinaScale.domain(vis.displayData.map(function(d) { return d.genus.split(" ")[0]; }));

        vis.xScale.domain(vis.displayData.map(function(d) { return d.key; }));

        vis.yScale.domain([d3.min(vis.displayData, (d) => d.rank), d3.max(vis.displayData,
            (d) => d.rank)]);

        vis.radiusScale.domain([d3.min(vis.displayData, (d) => d.genus_mean), d3.max(vis.displayData,
            (d) => d.genus_mean)]);

        console.log(vis.height);
        console.log(d3.min(vis.displayData, (d) => d.rank));
        console.log(d3.max(vis.displayData, (d) => d.rank));
        //console.log(vis.xScale('CentralEurope'));
        //console.log(vis.yScale(0.0292));
        //let circle = svg.selectAll(".regions")
        console.log(vis.displayData);

        let circles = vis.svg.selectAll(".mycircle")
            .data(vis.displayData);

        circles.enter()
            .append("circle")
            .attr("class", 'mycircle')
            .merge(circles)
            .transition()
            .duration(800)
            .attr("cx", function (d){
                return vis.xScale(d.key)
            })
            .attr("cy", function (d){
                return vis.yScale(d.rank)
            })
            .attr("r", d => vis.radiusScale(d.genus_mean))
            .attr("stroke", "white")
            .attr("opacity",0.8)
            .attr("fill", function (d)
            {
                return vis.ordinaScale(d.genus);
            })
            .style("stroke", "#4F442B");

        circles.exit().remove();

        // let labels = vis.svg.selectAll(".mytext")
        //     .data(vis.displayData);
        //
        // labels.enter()
        //     .append("text")
        //     .attr("class","mytext")
        //     .merge(labels)
        //     .transition()
        //     .duration(800)
        //     .attr("x", function(d) {
        //         return vis.xScale(d.key);
        //     })
        //     .attr("y", function(d) {
        //         return vis.yScale(d.rank)})
        //     .text(d => d.genus.split(" ")[0]);
        //
        // labels.exit().remove();

        vis.svg.select('.x-axis')
            .transition()
            .duration(800)
            .call(vis.xAxis);


        vis.legendColor
            .shape("path", d3.symbol().type(d3.symbolCircle).size(100)())
            .shapePadding(10)
            .scale(vis.ordinaScale);

        vis.legendSize
            .scale(vis.radiusScale)
            .shape('circle')
            .shapePadding(5)
            .labelOffset(5)
            .orient('vertical');

        vis.svg.select(".legendSize")
            .call(vis.legendSize);


        vis.svg.select(".legendOrdinal")
            .call(vis.legendColor);




    }


}