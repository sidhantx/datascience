


// Load CSV file
//import {event} from "../../../../d3-book/d3";

d3.csv("data/zaatari-refugee-camp-population.csv", d => {
	//parse dates to date, and population to int
	var parseTime = d3.timeParse("%Y-%m-%d");
	d.date = parseTime(d.date)
	d.population = +d.population;
	return d;
}).then( data => {
	// show the data on console
	console.log(data);

	//data structure for barchart
	let camp_data = [
		{type:"Caravans", percent:.7968},
		{type:"Combination", percent:.1081},
		{type:"Tents", percent: .0951}];

	//draw areachart
	draw_areachart(data);

	//draw barchart
	draw_barchart(camp_data);
});


function draw_barchart(data)
{
	/**
	 * Helper method to draw the bar-chart with camp_data
	 *
	 */
	let categories =["Caravans","Combination","Tents"];
	// SVG canvas size
	let margin = {top: 80, right: 60, bottom: 80, left: 80};
	let width = 700 - margin.left - margin.right;
	let height = 700 - margin.top - margin.bottom;

	//create new svg container
	var svg_barchart = d3.select("#chart-2")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "scale(0.75), translate(" + margin.left + "," + margin.top + ")");

	//create scales
	let x_scale = d3.scaleBand()
		.domain(categories)
		.range([0, width])
		.padding(0.15);

	let y_scale = d3.scaleLinear()
		.domain([0, 1])
		.range([height, 0]);

	svg_barchart.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("class","barchart_class")
		.attr("x",(d)=> x_scale(d.company))
		.attr("y",(d)=> y_scale(d.stores))
		.attr("height",(d) => height - y_scale(d.percent))
		.attr("width",(d) =>x_scale.bandwidth());

	//draw bar chart
	svg_barchart.selectAll("bar")
		.data(data)
		.enter()
		.append("text")
		.attr("text-anchor","start")
		.attr("fill","black")
		.attr("class","bar_labels")
		.attr("x", (d)=> x_scale(d.type) + 40)
		.attr("y", (d) => y_scale(d.percent) -20)
		.text((d) => (d.percent*100).toFixed(2) + "%");

	//draw x-axis
	let x_axis = d3.axisBottom()
		.scale(x_scale);

	//insert axis and update ticks
	svg_barchart.append("g")
		.attr("transform", "translate(0," + (height) + ")")
		.attr("class", "bar_x_axis x_axis")
		.attr("transform", "translate(0,"+height+")")
		.call(x_axis);

	//add x-axis labels
	svg_barchart.append("text")
		.attr("class","bar_x_label x_label")
		.attr("transform", "translate(" + (width/2 -10)+ "," + (height+50) + ")")
		.text("Types of Shelter");

	//bar chart title
	svg_barchart.append("text")
		.attr("class","bar_title chart_title")
		.attr("transform", "translate(" + width/2+ "," + (30) + ")")
		.text("Types of Shelter");


	//draw y-axis
	//ref : https://github.com/d3/d3-format
	let y_axis = d3.axisLeft()
		.scale(y_scale)
		.tickFormat(d3.format(".0%"));

	//insert axis and update ticks
	svg_barchart.append("g")
		.attr("class", "bar_y_axis y_axis")
		.attr("transform", "translate(0,0)")
		.call(y_axis);

	//insert y axis label
	svg_barchart.append("text")
		.attr("class","bar_y_label y_label")
		.attr("transform", "translate(" + -50 +"," + (height/2) + ") rotate(-90)")
		.text("Percent")

}


function draw_areachart(data) {
	/**
	 * Helper method to draw areachart
	 *
	 */

	// SVG canvas margin and size for area chart
	let margin = {top: 80, right: 100, bottom: 80, left: 100};
	let width = 1060 - margin.left - margin.right;
	let height = 700 - margin.top - margin.bottom;

	//create new svg container
	let svg_areachart = d3.select("#chart-1")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "scale(0.75), translate(" + margin.left + "," + margin.top + ")");

	//Create scales for x, and y data
	let pop_scale = d3.scaleLinear()
		.domain([0, d3.max(data, function (d) {
			return d.population
		}) + 20000])
		.range([height, 0]);


	let time_scale = d3.scaleTime()
		.domain([d3.min(data, function (d) {
			return d.date
		}),
			d3.max(data, function (d) {
				return d.date
			})])
		.range([0, width]);

	//Create area
	const chart_area = d3.area()
		.x(function (d) {
			return time_scale(d.date);
		})
		.y1(function (d) {
			return pop_scale(d.population);
		})
		.y0(pop_scale.range()[0]);


	//using path draw the area
	svg_areachart.append("path")
		.datum(data)
		.attr("class", "path_area")
		.attr("d", chart_area);

	//draw x-axis
	let x_axis = d3.axisBottom()
		.scale(time_scale)
		.tickFormat(d3.timeFormat("%b %Y"));

	//add x-axis and update ticks
	svg_areachart.append("g")
		.attr("transform", "translate(0," + (height) + ")")
		.call(x_axis)
		.attr("class", "area_x_axis x_axis")
		.selectAll("text")
		.attr("transform", "rotate(1) translate(-2,8)");

	//add x-axis label
	svg_areachart.append("text")
		.attr("transform", "translate(" + width / 2 + "," + (height + 70) + ")")
		.attr("class","axis_title x_label")
		.text("Date");

	//draw y-axis
	let y_axis = d3.axisLeft()
		.scale(pop_scale);

	//add y_axis
	svg_areachart.append("g")
		.attr("transform", "translate(0,0)")
		.call(y_axis)
		.attr("class","area_y_axis y_axis");

	//add y-axis label
	svg_areachart.append("text")
		.attr("class","axis_title y_label")
		.attr("transform", "translate("+(-76)+ "," + height/2 + ") rotate(-90)")
		.text("Population");

	//add title to the chart
	svg_areachart.append("text")
		.attr("class","chart_1_title chart_title")
		.attr("transform","translate("+ (width/2)+","+ 0 +")" )
		.text("Camp Population");

	//Draw tooltip
	draw_tooltip(data, svg_areachart,height,width,time_scale,pop_scale)
}

function draw_tooltip(data,svg_areachart, height, width, time_scale, pop_scale)
{
	/**
	 * Helper method to add tooltip to area chart
	 */

	let focus = svg_areachart.append("g")
		.style("display","none");

	// draw the line
	focus.append("line")
		.attr("y1",0)
		.attr("y2", height)
		.attr("class","focus_line");

	//create placeholder for texts based on the position

	//population text
	focus.append("text")
		.attr("x",8)
		.attr("y",60)
		.attr("class","focus_text_pop focus_text");

	//date text
	focus.append("text")
		.attr("x",8)
		.attr("y",80)
		.attr("class","focus_text_date focus_text");

	//capture the mouse over event using rectangle.
	//The rectangle is not visible
	svg_areachart.append("rect")
		.attr("width", width)
		.attr("height", height)
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", ()=> focus.style("display", null))
		.on("mouseout", () =>
			focus.style("display", "none"))
		.on("mousemove", (event) => mouse_move(event));

	function mouse_move(event)
	{
		/**
		 * Event handler for mousemove event on area chart
		 */

		//get date
		let date_val = time_scale.invert(d3.pointer(event)[0]);

		//bisect
		let date_bisect = d3.bisector((d) => d.date).left;
		let i = date_bisect(data, date_val,1);

		//index to get the data
		let p_left = data[i-1];
		let p_right = data[i];

		//assign the value
		let cursor = date_val - p_left.date > p_right.date - date_val ? p_right : p_left;

		//add the values obtained above
		focus.select("line.focus_line")
			.attr("transform", "translate(" + time_scale(cursor.date) + ",0)");

		focus.select("text.focus_text_pop")
			.attr("transform","translate(" + time_scale(cursor.date) + ",0)")
			.text(cursor.population.toLocaleString('en-US'));

		focus.select("text.focus_text_date")
			.attr("transform","translate(" + time_scale(cursor.date) + ",0)")
			.text(cursor.date.toLocaleDateString('en-US'));

	}
}





















