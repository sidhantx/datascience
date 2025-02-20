
// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

let margin = {top: 40, right: 40, bottom: 60, left: 60};

let width = 600 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

pad = 40;
// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");

//create axis and scale - x-axis
xScale = d3.scaleTime()
	.range([10,width])

let xAxis = d3.axisBottom()
	.scale(xScale)
	.tickFormat(d3.format("d"))

let xGroup = svg.append("g")
	.attr("class", "x_axis axis")
	.attr("color", "maroon")
	.attr("transform", `translate(0,${height})`);

svg.append("text")
	.attr("class","x_axis_title")
	.attr("transform", `translate(${(width-margin.left)/2},${height+40})`);

//create scale and axis - y-axis
yScale = d3.scaleLinear()
	.range([height-5,0])

let yAxis = d3.axisLeft()
	.scale(yScale);

let yGroup = svg.append("g")
	.attr("class", "y_axis axis")
	.attr("fill", "maroon")
	.attr("color", "maroon")
	.attr("transform", "translate(0,0)");

svg.append("text")
	.attr("class","y_axis_title")
	.attr("transform", `translate(${-48},${(height+margin.top-20)/2}) rotate(-90)`);


// declare variables to store data
let data;
let myData;

// Initialize data
loadData();

// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", row => {
		row.YEAR = parseDate(row.YEAR);
		row.TEAMS = +row.TEAMS;
		row.MATCHES = +row.MATCHES;
		row.GOALS = +row.GOALS;
		row.AVERAGE_GOALS = +row.AVERAGE_GOALS;
		row.AVERAGE_ATTENDANCE = +row.AVERAGE_ATTENDANCE;
		return row
	}).then(csv => {
		//store the data
		data = csv;
		console.log(data);
		//make an additional copy of the data for filtering
		myData = data;

		// Draw the visualization for the first time
		updateVisualization();
		showEdition(data[0]);
		createSlider();
	});
}


// Render visualization
function updateVisualization() {
	let duration = 850;
	console.log(data);
	//get the user selected value
	let selectedVal = d3.select("#select_group").property("value");
	console.log(selectedVal);

	//get the ylabels based on user selection
	let splits = selectedVal.split("_");
	let yLabel;
	if (splits.length ==1)
	{
		yLabel = splits[0].toLowerCase();
		fChar = yLabel[0];
		fChar = fChar.toUpperCase();
		rest = yLabel.slice(1,yLabel.length)
		yLabel = fChar.concat(rest)
	}
	else
	{
		first = splits[0].toLowerCase();
		second = splits[1].toLowerCase();
		fChar = first[0].toUpperCase();
		sChar = second[0].toUpperCase();

		slice1 = first.slice(1,first.length);
		slice2 = second.slice(1, second.length);
		yLabel = fChar.concat(slice1);
		yLabel = yLabel.concat(" ");
		yLabel = yLabel.concat(sChar);
		yLabel = yLabel.concat(slice2)
	}

	//update scales
	xScale.domain([d3.min(data, (d) => +formatDate(d.YEAR)), d3.max(data, (d) => +formatDate(d.YEAR))]);

	yScale.domain([0, d3.max(data, function (d){return d[selectedVal]})]);

	//draw the line
	var  line_struct = d3.line()
		.x(d=> xScale(+formatDate(d.YEAR)))
		.y(d=> yScale(d[selectedVal]))
		.curve(d3.curveLinear);

	var line_data = svg.selectAll(".line")
		.data(data);

	line_data.enter()
		.append("path")
		.merge(line_data)
		.transition()
		.duration(duration)
		.attr("class","line")
		.attr("fill", "maroon")
		.attr("d",line_struct(data))

	line_data.exit().remove();

	//create the points
	let points = svg.selectAll("circle")
		.data(data);

	//update circles
	points.enter()
		.append("circle")
		.merge(points)
		.on("click", (event, d) => showEdition(d))
		.transition()
		.duration(duration-200)
		.attr("fill","maroon")
		.attr("class","point_circle")
		.attr("r", "5")
		.attr("cx", function(d) { return xScale(+formatDate(d.YEAR)); })
		.attr("cy", function(d) { return yScale(d[selectedVal]); });

	//exit
	points.exit().remove();

	xGroup.transition()
		.duration(duration)
		.call(xAxis);
	yGroup.transition()
		.duration(duration)
		.call(yAxis);

	svg.select(".x_axis_title")
		.text("Date")

	svg.select(".y_axis_title")
	.text(yLabel)

}


function showEdition(d){

	/**
	 * Show details of fifa world cup given the year in the table element
	 *
	 * **/
	let avgAttendance ="Avg.Attendance ";
	console.log(d)
	document.getElementById("name_edition").innerHTML = d.EDITION;
	document.getElementById("table_edition").innerHTML =
		"<tr> <td> Winner </td> <td>" + d.WINNER + "</td> </tr> \ " +
		"<tr> <td> Goals </td> <td>" + d.GOALS + "</td> </tr> \ " +
		"<tr> <td> Average Goals </td> <td>" + d.AVERAGE_GOALS + "</td> </tr> \ " +
		"<tr> <td> Teams </td> <td>" + d.TEAMS + "</td> </tr>" +
		"<tr> <td> Matches </td> <td>" + d.MATCHES + "</td> </tr>" +
		"<tr> <td> Avg.Attendance </td> <td>" + d.AVERAGE_ATTENDANCE + "</td> </tr>";

}

function createSlider()
{
	/**
	 * This function creates a slider for users to select a date
	 * range using NoUiSlider. https://refreshless.com/nouislider/
	 */
	//sorted = data.sort((a,b) => a.YEAR - b.YEAR)
	console.log("Inside createSlider");
	console.log(data);

	let sliders = document.getElementById("year_slider");
	noUiSlider.create(sliders, {

		start: [d3.min(data, (d) => +formatDate(d.YEAR)), d3.max(data, (d) => +formatDate(d.YEAR))],
		range: {
			'min': d3.min(data, (d) => +formatDate(d.YEAR)),
			'max': d3.max(data, (d) => +formatDate(d.YEAR))
		},
		step: 4,
		margin: 8,
		connect: true,
		behaviour: 'drag',
		//reference: https://refreshless.com/nouislider/number-formatting/
		tooltips: true,
		format:
			{
				to: function (value)
				{
					return d3.format("d") (value);
				},
				from: function (value)
				{
					return +value
				}
			}

	});
	// Attach an event listener to the slider
	sliders.noUiSlider.on('slide', function (values, handle) {
		console.log(values);

		//filter the data to date range selected by the user
		let filteredData = myData.filter((d) => {
			return (+formatDate(d.YEAR) >= values[0]) && (+formatDate(d.YEAR) <= values[1])
		});

		data = filteredData;

		updateVisualization();
		});

	}

