


class MatrixVis {
    constructor(parentElement, dataRegion, dataBmi, dataAge) {

        this.parentElement = parentElement;
        //this.data = data;
        this.displayDataRegion = dataRegion ;
        this.displayDataBmi = dataBmi;
        this.displayDataAge = dataAge;
        this.displayData = [];

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 50, bottom: 100, left: 50, chartWidth:200};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        //svg area
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("class","bee_svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.xScale = d3.scaleBand()
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height-20, 20])
        //.nice();

        vis.radiusScale = d3.scaleLinear()
            .range([5,12]);

        vis.xCategoryScale = d3.scaleLinear()
            .domain([1,2])
            .rangeRound([50, 200]);

        vis.yCategoryScale = d3.scaleLinear()
            .rangeRound([100,vis.height]);


        vis.xScaleMatrix = d3.scaleLinear()
            .rangeRound([400, vis.width-400]);

        vis.yScaleMatrix = d3.scaleLinear()
            .rangeRound([100,vis.height]);

        //tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', 'tooltipSmall');

        vis.legendColor = d3.legendColor();

        vis.ordinaScale = d3.scaleOrdinal()
            .domain(["Absent","Present"])
            .range(["#ffffd9",colorbrewer.Dark2[3][1]]);

        vis.svg.append('g')
            .attr("class", "myLegendColor")
            .attr("transform", "translate("+(vis.width -200) + ","+(50)+")");

        vis.wrangleData();

    }

    wrangleData()
    {
        let vis = this;
        vis.displayData = [];

        if (selectedCategoryBees =="BMI")
        {
            vis.displayData = vis.displayDataBmi;
        }

        if (selectedCategoryBees =="Age")
        {
            vis.displayData = vis.displayDataAge;
        }

        if (selectedCategoryBees =="Nationality")
        {
            vis.displayData = vis.displayDataRegion;
        }

        let selGroup = d3.group(vis.displayData, d=>d['keyVal']);

        vis.selArray = Array.from(selGroup,([key,value])=>({key, value}) );

        vis.uniqueBacteria = vis.helperUniqueBacteria();

        vis.updateVis();
    }

    updateVis()
    {
        let vis = this;
        let max_n = vis.selArray.length;
        let y_max = Math.ceil(max_n/2);
        let posData = [];
        for (let i=1;i<=y_max;i++)
        {
            for(let j=1; j<=2;j++)
            {
                if (posData.length <= max_n)
                {
                    posData.push([j,i])
                }
                else
                {
                    break;
                }
            }
        }

        vis.categoryMatrixData =[];
        for(let i=0;i<vis.selArray.length;i++)
        {
            let bact_ids = []
            for (let j=0;j<vis.selArray[i].value.length;j++)
            {
                bact_ids.push(vis.selArray[i].value[j].bacteria_id)
            }

            let obj = {'key': vis.selArray[i].value[0].key,
                'bacteriaIdArray': bact_ids,
                'pos': posData[i]}
            vis.categoryMatrixData.push(obj);
        }

        let categoryCount = vis.categoryMatrixData.length;
        let yOffset = 200;
        if (categoryCount <6)
        {
            yOffset = yOffset + 100;
        }

        vis.yCategoryScale.domain([1, y_max])
            .rangeRound([100,vis.height -yOffset]);

        //start creating circle buttons
        let categoryCircle = vis.svg.selectAll(".categorycircle")
            .data(vis.categoryMatrixData);

        categoryCircle.enter()
            .append("circle")
            .attr("class","categorycircle")
            .merge(categoryCircle)
            .attr("cx", function (d){
                return vis.xCategoryScale(d.pos[0]);
            })
            .attr("cy", function (d){
                return vis.yCategoryScale(d.pos[1]);
            })
            .attr("r", 48)
            .attr("fill", "#8856a7")
            .on("click", function (e,d)
        {
            vis.onCategoryClick(d);
        });

        categoryCircle.transition()
        .duration(800);

        createTooltipWithText(".categorycircle",vis.svg, vis.tooltip, vis.selArray,
            "Please click on the circle to see the dominant bacteria in this category.");

        categoryCircle.exit().remove();

        let categoryLabels = vis.svg.selectAll(".categorylabel")
            .data(vis.categoryMatrixData);

        categoryLabels.enter()
            .append("text")
            .attr("class","categorylabel")
            .merge(categoryLabels)
            .transition()
            .duration(800)
            .attr("x", function(d) {
                return vis.xCategoryScale(d.pos[0]);
            })
            .attr("y", function(d) {
                return vis.yCategoryScale(d.pos[1])})
            .text(d => d.key)
            .style("text-anchor", "middle")
            .style("font-size","14px")
            .attr("fill","white");

        categoryLabels.exit().remove();

        vis.drawCircleMatrix();

    }


    onCategoryClick(d)
    {
        let vis = this;
        let circles = vis.svg.selectAll(".mycircleTwo");
        circles.attr("fill","#ffffd9");

       for (let i =0;i<d.bacteriaIdArray.length;i++)
       {
           let id = d.bacteriaIdArray[i];
           let circ = vis.svg.selectAll(".mycircleTwo").filter(function (d) {return d.bacteria_id ==id});
           circ.attr("fill", colorbrewer.Dark2[3][1])
               .transition()
               .duration(2000);
       }

    }
    drawCircleMatrix()
    {
        let vis = this;

        let max_n = vis.uniqueBacteria.length;
        let y_max = Math.ceil(max_n/4);
        let posData = [];
        for (let i=1;i<=y_max;i++)
        {
            for(let j=1; j<=4;j++)
            {
                if (posData.length <= max_n)
                {
                    posData.push([j,i])
                }
                else
                {
                    break;
                }
            }
        }

        vis.matrixData =[];
        for(let i=0;i<vis.uniqueBacteria.length;i++)
        {
            let obj = {'bacteria_id': vis.uniqueBacteria[i].bacteria_id,
                'genus':vis.uniqueBacteria[i].genus,
                'keys': vis.uniqueBacteria[i].keys,
                'pos': posData[i]}
            vis.matrixData.push(obj);
        }

        vis.xScaleMatrix.domain([1,4]);
        vis.yScaleMatrix.domain([1, y_max]);


        //start creating bacteria circles
        let circlesTwo = vis.svg.selectAll(".mycircleTwo")
            .data(vis.matrixData);

        circlesTwo.enter()
            .append("circle")
            .attr("class","mycircleTwo")
            .merge(circlesTwo)
            .transition()
            .duration(800)
            .attr("cx", function (d){
                return vis.xScaleMatrix(d.pos[0]);
            })
            .attr("cy", function (d){
               return vis.yScaleMatrix(d.pos[1]);
            })
            .attr("r", 48)
            .attr("fill", "#ffffd9");

        createTooltipSmall(".mycircleTwo",vis.svg, vis.tooltip,vis.matrixData);
        circlesTwo.exit().remove();

        //start creating lables for bacteria
        let bacteriaLabels = vis.svg.selectAll(".bacterialabel")
            .data(vis.matrixData);

       bacteriaLabels.enter()
            .append("text")
            .attr("class","bacterialabel")
            .merge(bacteriaLabels)
            .transition()
            .duration(800)
            .attr("x", function(d) {
                return (vis.xScaleMatrix(d.pos[0]));
            })
            .attr("y", function(d) {
                return (vis.yScaleMatrix(d.pos[1]) -50 )})
            .text(d => d.genus.split(" ")[0])
           .style("text-anchor","middle")
           .attr("fill","white");

        bacteriaLabels.exit().remove();

        vis.legendColor
            .shape("circle")
            .shapePadding(10)
            .scale(vis.ordinaScale);

        vis.svg.select(".myLegendColor")
            .call(vis.legendColor);

        vis.svg.selectAll("g.cell text").each(function (d)
        {
            d3.select(this).style("fill", "white")
        });

    }



    //helper function to create objects for creating bacteria matrix
    helperUniqueBacteria()
    {
        let vis = this;
        let bac_list = [];
        let idList = [];
        let each_id_list = [];
        let dict = new Object();
        let temp = [];
        for(let i=0;i<vis.selArray.length;i++)
        {
            for (let j=0;j<vis.selArray[i].value.length;j++)
            {
                let genus = vis.selArray[i].value[j].genus;
                let id = vis.selArray[i].value[j].bacteria_id;
                if(bac_list.includes(genus))
                {

                    temp.forEach((d) =>
                    {
                        if(d.bacteria_id ==id)
                        {
                            d.keys.push(vis.selArray[i].key);
                        }
                    });
                }
                else
                {
                    let obj = {'genus': genus, 'bacteria_id': id, "keys":[vis.selArray[i].key] };
                    bac_list.push(genus);
                    idList.push(id);
                    temp.push(obj);
                }

            }
        }
        return temp;
    }

}