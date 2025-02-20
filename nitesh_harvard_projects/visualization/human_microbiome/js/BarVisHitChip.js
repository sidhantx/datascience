

/*
 * BarDiversityVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */


class BarVis {

	constructor(parentElement, data, config) {
		this.parentElement = parentElement;
		this.data = data;
		this.displayData = [];
		this.config = config;

		console.log(this.data);
		console.log(config);
		this.initVis();

	}
	/*
	 * Initialize visualization (static content; e.g. SVG area, axes)
	 */

	initVis() {
		let vis = this;

		vis.margin = { top: 40, right: 100, bottom: 10, left: 100 };
		vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = window.outerHeight/6.8 - vis.margin.top - vis.margin.bottom;

		console.log(vis.width);
		console.log(vis.height);
		// * TO-DO *

		// SVG drawing area
		vis.svg = d3.select(vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		//creat scale and axis
		vis.createScaleAndAxis();

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}

	/**
	 * Creates scale and axis for barchart.
	 */
	createScaleAndAxis()
	{
		let vis = this;
		vis.x = d3.scaleLinear()
			.rangeRound([0, vis.width]);

		vis.y = d3.scaleBand()
			.rangeRound([0,vis.height])
			.paddingInner(0.075)
			.paddingOuter(0.075);

		vis.yAxis = d3.axisLeft().tickSizeOuter(0)
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		//Give the barchart title

		vis.svg.append("g").append("text")
			.attr("class", "bar_title")
			.attr("transform", "translate(" + (-vis.margin.left+12) + "," + -vis.margin.top + ")")
			.attr("x",8)
			.attr("y",35)
			.text(vis.config.title)
	}


	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;
		vis.tempData = []
		let selGroup = d3.group(vis.data, d=>d[selectedCategory]);
		let selArray = Array.from(selGroup,([key,value])=>({key, value}) );

		for (let i=0;i <selArray.length;i++)
		{
			//console.log(diversityArray[i]);
			let temp = selArray[i].value;
			let key = selArray[i].key;
			let sum =0;
			for (let j=0;j<temp.length;j++)
			{
				sum = sum + temp[j][vis.config.key];
			}

			vis.tempData.push({"key":key,"value":sum/temp.length});
		}

		vis.tempData.sort(function (val1,val2)
		{
			return val2.value -val1.value;
		});

		console.log(vis.tempData);
		vis.displayData = vis.tempData;

		vis.updateVis();
	}



	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 */

	updateVis() {
		console.log("inside update vis")
		let vis = this;
		//console.log(vis.displayData);

		// (1) Update domains
		vis.x.domain([0 , d3.max(vis.displayData, function(d) {return d.value; }) ]);
		vis.y.domain(vis.displayData.map(function(d) { return d.key; }));

		vis.yAxis.scale(vis.y)
		//(2) Draw rectangles
		vis.rectangles = vis.svg.selectAll("rect")
			.data(vis.displayData);

		vis.rectangles.enter()
			.append("rect")
			.attr("class","bars")
			.merge(vis.rectangles)
			.attr("y", function(d) { return vis.y(d.key); })
			.attr("x", function(d) { return 0; })
			.attr("height", vis.y.bandwidth())
			.attr("width", function(d) { return vis.x(d.value); })
			.attr('fill', "gray")
			.transition()
			.duration(130);

			vis.rectangles.exit().remove();


		//(3) Draw labels
		vis.rectangleLabels = vis.svg.selectAll(".bar_label").data(vis.displayData);
		vis.rectangleLabels.enter()
			.append("text")
			.attr("class","bar_label")
			.merge(vis.rectangleLabels)
			//.transition()
			// .duration(120)
			.text(function(d){
				let a = d.value.toFixed(2);
				return a;
			 })
			.attr("x",function(d){
				return (vis.x(d.value));
			})
			.attr("y",function(d){
				return vis.y(d.key)+vis.y.bandwidth()/2 + 4;
			});

		vis.rectangleLabels.exit().remove();


		// * TO-DO *

		// Update the y-axis
		vis.svg.select(".y-axis")
			.transition()
			.duration(120)
			.call(vis.yAxis);
	}

}
