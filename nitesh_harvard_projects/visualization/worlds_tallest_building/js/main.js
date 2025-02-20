console.log("let's get started!")




d3.csv("data/buildings.csv", (d) =>
{
    d.height_m = +d.height_m;
    d.height_ft = +d.height_ft;
    d.height_px = +d.height_px;
    d.floors = +d.floors;
    return d;
}).then( (data) =>{
    console.log(data)

    let svg = d3.select("#chart").append("svg")
        .attr("width", 600)
        .attr("height", 500);


    //sort the data
    data.sort(function (a,b) {
        return b.height_m - a.height_m
    });

    //add the rectangles that represent bar chart
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        //.attr("fill", "#808080")
        .attr("width", (d,i) => d.height_px + 100)
        .attr("height", 25 )
        .attr("x", 170 )
        .attr("y", (d,i) => (i*34) +60)
        .attr("class","horizontal-barchart")
        .on("click", function (event, d){
            show_summary(d);
    });


    //add the height in meters to the end of the bar
    svg.selectAll("text-1")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d,i) => (d.height_px + 250) )
        .attr("y", (d, i) => (i*34) + 75)
        .text((d) => d.height_m)
        .attr("class","bar-text");

    //add the buildinng names
    svg.selectAll("text-2")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", (d, i) => (i*34) + 80)
        .text((d) => d.building)
        .attr("class", "bar-label");

    //call show_summary. By default shows the tallest building.
    show_summary(data[0])

});

function show_summary(d)
{
    /* ************************************************************
	 This function assigns the details of the tallest building selected
	 by the user. It also includes the image and wikipedia link.
	 * ************************************************************/
    //get the elements from html
    let table_summary = document.getElementById("building-table");
    let tblbody = document.getElementById("building-table-body");
    let build_name = document.getElementById("building-name");
    let wiki_link = document.getElementById("wiki-link");
    let summary_card = document.getElementById("summary-card-hidden");


    //empty the tbody. The tbody is generated again based on the
    //user selected values
    while(tblbody.firstChild)
    {
        tblbody.removeChild(tblbody.firstChild);
    }

    // title for our dataset summary
    let data_summary_items = ['   Height : ', '   City : ',
        '   Country : ', '   Floors : ', '   Completed :'];

    //data about the selected building
    let data = [d.height_m, d.city, d.country,d.floors,d.completed]

    for(let i=0;i<data.length;i++)
    {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        const cell_text = document.createTextNode(`${data_summary_items[i]} ${data[i]}`);
        cell.appendChild(cell_text);
        row.appendChild(cell);
        tblbody.appendChild(row)
    }
    table_summary.appendChild(tblbody)

    //assign image
    let img_holder = document.getElementById("building-image");
    while(img_holder.firstChild)
    {
        img_holder.removeChild(img_holder.firstChild);
        wiki_link.removeChild(wiki_link.firstChild)
    }

    const myImage = new Image(200, 200);
    myImage.src = `img/${d.image}`;
    img_holder.appendChild(myImage);

    //assign building name
    build_name.innerHTML = d.building;

    const name_split = d.building.split(" ");
    let wiki = name_split[0];
    for(i=1;i<name_split.length;i++)
    {
        wiki = wiki.concat("_", name_split[i]);
    }

    //assign wikipedia link
    let anchor = document.createElement('a');

    let textnode = document.createTextNode(`wikipedia`);

    anchor.appendChild(textnode);
    anchor.href = `https://en.wikipedia.org/wiki/${wiki}`

    wiki_link.appendChild(anchor)

}
