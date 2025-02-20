



class ScatterBubbleVis
{
    constructor(parentElement, data, config)
    {

        this.parentElement = parentElement;
        this.data = data;
        this.config = config;
        this.displayData = [];
        this.initVis();
    }

    initVis()
    {
        let vis = this;
        vis.margin = {top: 20, right: 100, bottom: 10, left: 75};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;


        //svg area
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("class","scatter_svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        //define scales for the data
        vis.xScale = d3.scaleLinear()
            .range([30, vis.width-30]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height-20, 20]);

        //define axis

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)
            .ticks(5, ",f")
            //.tickValues([2.8,3.0,3.2,3.4])
            //.tickFormat(a);
            //.tickSubdivide(5)
            //.tickSizeInner([10])
            //.tickSizeOuter([5])
            .tickPadding(5);

        vis.svg.append('g')
            .attr('class', "x-axis axis")
            .attr("transform", `translate(${(vis.margin.left*(-1))+45},${vis.height-30} )`)
            .call(vis.xAxis);



        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)
            .ticks(5)
            //.tickValues([105,110,115])
            .tickPadding(5);

        vis.svg.append('g')
            .attr('class', "y-axis axis")
            .attr("transform", "translate(" + 5 + ",-5)")
            .call(vis.yAxis);

        vis.svg.append("text")
            .attr("transform", "translate(" + vis.width/2+ "," + (vis.height+ 5) + ")")
            .attr("class",'x_axis_title axis_title')
            .text("Avg.Shannon Index")
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        vis.svg.append("text")
            .attr("transform", "translate("+(-30)+ "," + ((vis.margin.top+vis.height)/2)  + ") rotate(-90)")
            .attr("class",'y_axis_title axis_title')
            .text("Avg.Chao1")
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        vis.selectedMenuItemText =  vis.svg.append("text")
            .attr("transform", "translate(" + (vis.width+10) +"," + (vis.height-40) + ")")
            .attr("class",'x_axis_title axis_title');


        vis.colorScale = d3.scaleQuantize()
            .range(colorbrewer.OrRd[6]);

        vis.createLegend();

        vis.wrangleData();

    }

    wrangleData()
    {
        let vis = this;
        vis.tempData = [];
        vis.displayData = [];

        if (selectedCategoryMap =="") {

            let selGroup = d3.group(vis.data, d => d[selectedCategory]);
            let selArray = Array.from(selGroup, ([key, value]) => ({key, value}));
            vis.tempData = vis.helperWrangleData(selArray);
        }

        else
        {
            let selGroup = d3.group(vis.data, d=>d["Nationality"]);
            let selArray = selGroup.get(selectedCategoryMap);

            let selGroup2 = d3.group(selArray, d=> d[selectedCategory]);
            let selArray2 = Array.from(selGroup2, ([key, value]) => ({key, value}));
            vis.tempData = vis.helperWrangleData(selArray2);
        }


        vis.displayData = vis.tempData;
        vis.updateVis();

    }

    updateVis()
    {

        let vis = this;
        vis.xScale.domain([d3.min(vis.displayData, (d) => d.diversity_shannon),
            d3.max(vis.displayData, (d) => d.diversity_shannon )]);

        vis.yScale.domain([d3.min(vis.displayData, (d) => d.chao1)-1,
            d3.max(vis.displayData, (d) => d.chao1)+1]);

        vis.sizeScale = d3.scaleLinear()
            .range([16, 24])
            .domain(d3.extent(vis.displayData, d=> d.coverage_index ));

        vis.colorScale([d3.min(vis.displayData, (d) => +d.diversity_shannon),
            d3.max(vis.displayData, (d) => +d.diversity_shannon )]);

        //debugger;
        let circles = vis.svg.selectAll(".mycircle")
            .data(vis.displayData);

        circles.enter()
            .append("circle")
            .attr("class", 'mycircle')
            .merge(circles)
            .transition()
            .duration(800)
            .attr("cx", function (d){
                return vis.xScale(d.diversity_shannon)
            })
            .attr("cy", function (d){
                return vis.yScale(d.chao1)
            })
            .attr("r", d => vis.sizeScale(d.coverage_index))

            .attr("stroke", "white")
            .attr("opacity",0.8)
            .attr("fill", "#8856a7");




        circles.exit().remove();

        let labels = vis.svg.selectAll(".mytext")
            .data(vis.displayData);


        labels.enter()
            .append("text")
            .attr("class","mytext")
            .merge(labels)
            .transition()
            .duration(800)
            .attr("x", function(d) {
                return (vis.xScale(d.diversity_shannon)-15);
            })
            .attr("y", function(d) {
                return (vis.yScale(d.chao1)-25);
            })
            .text(function(d) {
                return d.key;
            })
            .attr("fill", "white");

        labels.exit().remove();



        vis.svg.select('.x-axis')
            .transition()
            .duration(800)
            .call(vis.xAxis);

        vis.svg.select('.y-axis')
            .transition()
            .duration(800)
            .call(vis.yAxis);

        var colorScale = d3.scaleOrdinal()
            .domain([1])
            .range(["#8856a7"]);

        vis.legendSize = d3.legendSize()
            .scale(vis.sizeScale)
            .cells(vis.displayData.length)
            .shape("circle")
            .shapePadding(20)
            .orient("horizontal")
            .title("Avg.Coverage Index")
            .labelAlign('center');



        vis.svgLegend.select(".myLegendSize")
            .call(vis.legendSize);

        vis.svgLegend.selectAll("g.cell circle").each(function (d)
        {
            d3.select(this).style("fill", "#8856a7")
        });


        vis.svgLegend.selectAll("g.cell text").each(function (d)
        {
            d3.select(this).style("fill", "white")
        });

        vis.svgLegend.selectAll(".myLegendSize text").each(function (d)
        {
            d3.select(this).style("fill", "white")
        });

        vis.selectedMenuItemText.text(mapCategoryToName[selectedCategory])
        .attr("fill", "white")
        .attr("text-anchor", "middle");
        let filterDietText = dietMicorbiomeText.find(obj => obj.key === selectedCategory);

        let dietText = d3.select("#diet-microbiome-p").text(filterDietText.text);

    }

    helperWrangleData(selArray)
    {
        let vis = this;
        let tempData = []
        for (let i = 0; i < selArray.length; i++) {
            let tempData2 = []
            for (let j = 0; j < vis.config.length; j++) {
                let x = selArray[i].value;


                let sum = 0;
                for (let k = 0; k < x.length; k++) {
                    sum = sum + x[k][vis.config[j].key];
                }

                tempData2.push({'name': vis.config[j].key, 'value': sum / x.length})

            }

            tempData.push(
                {
                    'key': selArray[i].key,
                    'diversity_shannon': tempData2[0].value,
                    "chao1": tempData2[1].value,
                    "evenness_pielou": tempData2[2].value,
                    "coverage_index": tempData2[3].value,
                    "gini_inequality": tempData2[4].value
                }
            )
        }

        return tempData;

    }


    createLegend()
    {

        let vis = this;
        vis.marginLegendSvg = {top: 5, right: 5, bottom: 5, left: 5};
        vis.legendParent = document.getElementById('scatterHitDivLegend');

        vis.widthLegend = vis.legendParent.getBoundingClientRect().width - vis.marginLegendSvg.left - vis.marginLegendSvg.right;
        vis.heightLegend = vis.legendParent.getBoundingClientRect().height - vis.marginLegendSvg.top - vis.marginLegendSvg.bottom;

        // init drawing area
        vis.svgLegend = d3.select(vis.legendParent).append("svg")
            .attr("width", vis.widthLegend)
            .attr("height", vis.heightLegend)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.svgLegend.append('g')
            .attr("class", "myLegendSize")
            .attr("transform", "translate("+(40) + ","+(vis.heightLegend -100)+")");



    }


}

