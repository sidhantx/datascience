class PieVis {

    constructor(parentElement,data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
        this.circleColors = ['#1b9e77','#d95f02','#7570b3','#fc8d59','#ffffbf','#91bfdb'];

        this.initVis()

    }

    initVis() {
        let vis = this;

        // == SVG == //
        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        vis.width = 300
        vis.height = 300

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)


        // == PIE CHART == //
        // add title
        vis.svg.append('g')
            .attr('class', 'title pie-title')
            .append('text')
            .text(vis.parentElement)
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px')
            .style('fill','#340744');

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')
            .style("opacity", 0)

        // pie chart setup
        vis.pieChartGroup = vis.svg
            .append('g')
            .attr('class', 'pie-chart')
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")");

        let outerRadius = vis.height / 3;
        let innerRadius = 0;      // Relevant for donut charts

        // Define a default pie layout
        vis.pie = d3.pie()
            .value(d => d.BacteriaLevel);

        // Path generator for the pie segments
        vis.arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);


        // Pie chart info tooltip
        vis.foodTooltipInfo = d3.select("#foodTooltip").append("div")
            .attr('class', 'foodInfoTooltip')
            .style("opacity", 0)
        //.append('text')


        vis.wrangleData();

    }

    wrangleData(){
        let vis = this

        vis.displayData = vis.data.filter((d)=>{
            return d.Food === vis.parentElement;
        })

        console.log('final data structure for Pie Chart', vis.displayData);

        vis.updateVis();

    }

    updateVis(){
        let vis = this;

        // Append an arc for each pie segment
        let arcs = vis.pieChartGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))

        arcs.enter()
            .append("path")
            //.attr('class', (d,i) => {return `arc ${vis.displayData[i].LINK}`})
            .merge(arcs)
            .attr("fill", (d,i) => {return vis.circleColors[i]})
            .attr("d", vis.arc)
            .on('mouseover', function(event, d){
                //console.log(d);
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', '#340744')
                vis.tooltip
                    .style("opacity", 0.85)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid #774C75; border-radius: 5px; background: #e6dce8; padding: 10px">
                            <h4>${d.data.BacteriaGenus}</h4>
                            <p>BacteriaLevel: ${d.data.BacteriaLevel}</p>
                             <p>Percentage: ${d.data.percentage} %</p>      
                        </div>
                    `)
                vis.foodTooltipInfo
                    .style("opacity", 1)
                    .html(`
                    <h5 style="padding: 10px; border: thin solid #774C75; border-radius: 5px">${d.data.INFO}</h5>
                    `)
                ;


            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)

                vis.foodTooltipInfo.style("opacity", 0).html(``);


            })


    }

}
