




class DiversityTextVis
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
        vis.margin = {top: 20, right: 160, bottom: 50, left: 50};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        //svg area
        // vis.svg = d3.select(vis.parentElement)
        //     .append("svg")
        //     .attr("width", vis.width + vis.margin.left + vis.margin.right)
        //     .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        //     .append('g')
        //     .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        d3.select(vis.parentElement)
            .insert('p').html("Detailed description of the chart");


        // d3.select(vis.parentElement)
        //     .data({'Region': 'US', 'Diversity':'Low'})
        //     .enter()
        //     .append("p")
        //     .html("Wow I am testing here")
        //     .style("font-weight","500")
        //     .style('font-size','24px');



    }


    wrangleData()
    {

    }

    updateVis()
    {


    }


}