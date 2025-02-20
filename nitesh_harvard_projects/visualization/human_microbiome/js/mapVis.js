/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {

    constructor(parentElement, geoData, data, config) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.data = data;
        this.config = config;

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;

        console.log(vis.parentElement);
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        console.log(vis.width);
        console.log(vis.height);

        // init drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        console.log([vis.width,vis.height]);

        // TODO

        vis.projection = d3.geoMollweide()
            .scale(100)
            .center([-50,10])
            .translate([vis.width/4, vis.height/1.9]);

        vis.path = d3.geoPath()
            .projection(vis.projection);
        console.log(vis.path);

        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features;
        console.log(vis.world);
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter()
            .append("path")
            .attr('class', 'country')
            .attr("d", vis.path);

        vis.colorScale = d3.scaleQuantize()
            .range(colorbrewer.OrRd[6]);

        vis.createLegend();
        vis.wrangleData()



    }

    wrangleData() {
        let vis = this;

        let selGroup = d3.group(vis.data, d=>d['Nationality']);
        vis.selArray = Array.from(selGroup,([key,value])=>({key, value}) );


        vis.tempData = []
        for (let i=0; i<vis.selArray.length;i++)
        {

            let x = vis.selArray[i].value;
            let sum =0;
            for (let k=0;k<x.length;k++)
            {
                sum = sum + x[k][vis.config.key];
            }
            vis.tempData.push({'key':vis.selArray[i].key, 'name': vis.config.key, 'value': sum/x.length})

        }

        console.log([d3.min(vis.tempData, (d) => d.value),
            d3.max(vis.tempData, (d) => d.value )]);
        vis.colorScale.domain([d3.min(vis.tempData, (d) => d.value),
            d3.max(vis.tempData, (d) => d.value )]);

        console.log(vis.tempData);

        vis.modifiedRegionData =[];
        for(let i=0;i<vis.tempData.length;i++)
        {
            let key = vis.tempData[i].key
            console.log(key);
            console.log(vis.colorScale(vis.tempData[i].value));

            for (let k=0;k< regionData.length;k++) {

                if (key == regionData[k].region) {
                    vis.modifiedRegionData.push( {
                        "region": regionData[k]['region'],
                        "countries": regionData[k]['countries'],
                        "color": vis.colorScale(vis.tempData[i].value),
                        "diversity_shannon":vis.tempData[i].value
                    });


                }
            }
        }
        console.log(vis.modifiedRegionData);

        // create random data structure with information for each land
        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach(d => {

            let country = d.properties.name;
            let color ="";
            let region ="";
            let opacity = 0.5;
            let diversity_shannon =0;

            for(let i=0;i<vis.modifiedRegionData.length;i++)
            {
                let found = false;
                for (let k=0;k<vis.modifiedRegionData[i].countries.length;k++)
                {
                    if (vis.modifiedRegionData[i].countries[k] === country)
                    {
                        color = vis.modifiedRegionData[i].color;
                        region = vis.modifiedRegionData[i].region;
                        diversity_shannon = vis.modifiedRegionData[i].diversity_shannon;
                        found = true;
                        break;

                    }
                    if(found)
                    {
                        break;
                    }
                }
            }


            if (color !="") {
                vis.countryInfo[d.properties.name] =
                    {
                        "name" :d.properties.name,
                        "region": region,
                        "color":color,
                        "opacity":1,
                        "diversity_shannon":diversity_shannon

                    }
            }
            else
            {
                vis.countryInfo[d.properties.name] =
                    {
                        "name" :d.properties.name,
                        "region":region,
                        "color":"white",
                        "opacity":opacity
                    }
            }

        })
        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.tooltip = d3.select("body").append('div')
            .attr('class', 'tooltip');

        vis.countries.attr("fill", function (d){

            //let c = vis.countryInfo.find(a => a.name === d.properties.name);
            let c = vis.countryInfo[d.properties.name];
            return c.color;


        });

        vis.countries.attr("opacity", function (d){

            //let c = vis.countryInfo.find(a => a.name === d.properties.name);
            let c = vis.countryInfo[d.properties.name];

           return c.opacity;

        });

        vis.countries.on("mouseover", function (event,d){
            //console.log(d);
            let c = vis.countryInfo[d.properties.name];
            if (c.region != "") {
                d3.select(this)
                    .attr("stroke-width", '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)');

                vis.tooltip.style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
             <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                 <h4>Country: ${c.name}<h3>
                 <h4>Region: ${c.region}</h4>
                 <h4>Avg.Shannon Diversity Index:${(c.diversity_shannon.toFixed(2))}</h4>
             </div>`);
            }
        })
            .on("mouseout", function (event,d){
                let c = vis.countryInfo[d.properties.name];
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", function (d) {

                        return c.color
                    })
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });


        vis.countries.on("click", function (e,d)
        {

            let c =  vis.countryInfo[d.properties.name];

            if (c.region != "")
            {
                selectedCategoryMap = c.region;
                categoryChange("map");
            }

        });



        vis.legendColor
            .shape("rect")
            .shapePadding(50)
            .orient("horizontal")
            .scale(vis.colorScale)
            .title("Shannon diversity index")
            .labelAlign('center')
            .labelDelimiter("-")
            //.labelWrap(6);


        vis.svgLegend.select(".myLegendColor")
            .call(vis.legendColor);


        vis.svgLegend.selectAll("g.cell text").each(function (d)
        {
            console.log(d3.select(this));
            d3.select(this).style("fill", "white")
        });

        vis.svgLegend.selectAll(".myLegendColor text").each(function (d)
        {
            d3.select(this).style("fill", "white")
        });

        // TODO
    }

    createLegend()
    {

        let vis = this;
        vis.marginLegendSvg = {top: 5, right: 5, bottom: 5, left: 5};
        vis.legendParent = document.getElementById('mapDivLegend');

        vis.widthLegend = vis.legendParent.getBoundingClientRect().width - vis.marginLegendSvg.left - vis.marginLegendSvg.right;
        vis.heightLegend = vis.legendParent.getBoundingClientRect().height - vis.marginLegendSvg.top - vis.marginLegendSvg.bottom;
        console.log(vis.widthLegend);
        console.log(vis.heightLegend);

        // init drawing area
        vis.svgLegend = d3.select(vis.legendParent).append("svg")
            .attr("width", vis.widthLegend)
            .attr("height", vis.heightLegend)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.legendColor = d3.legendColor();

        vis.svgLegend.append('g')
            .attr("class", "myLegendColor")
            .attr("transform", "translate("+(40) + ","+(vis.heightLegend -100)+")");



    }

}