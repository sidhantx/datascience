


let createTooltipSmall = function(selectObjectString,svg ,tooltip, data)
{
    let vis = this;
    let circles = svg.selectAll(selectObjectString);

    circles.on("mouseover", function (event,d){
        //d3.select(this)
        // .attr("stroke-width",'1px')
        // .attr('stroke','black')
        //.attr('fill','rgba(173,222,255,0.62)');

        let c = data.find(obj => obj.bacteria_id ===d.bacteria_id);
        tooltip.style("opacity", 1)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY) +  "px")
            .html(`
                 <p><strong>${d.genus}</strong></p>`);
    })
        .on("mouseout", function (event,d){
            let c = data.find(obj => obj.bacteria_id ===d.bacteria_id);
            d3.select(this)
                .attr('stroke-width', '0px')

            tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        });

}


let createTooltipWithText = function(selectObjectString,svg ,tooltip, data ,text)
{
    let vis = this;
    let circles = svg.selectAll(selectObjectString);

    circles.on("mouseover", function (event,d){
        //d3.select(this)
        // .attr("stroke-width",'1px')
        // .attr('stroke','black')
        //.attr('fill','rgba(173,222,255,0.62)');

        let c = data.find(obj => obj.key ===d.key);
        tooltip.style("opacity", 1)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY) +  "px")
            .html(`
                 <p><strong>${text}</strong></p>`);
    })
        .on("mouseout", function (event,d){
            let c = data.find(obj => obj.key ===d.key);
            d3.select(this)
                .attr('stroke-width', '0px')

            tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        });

}