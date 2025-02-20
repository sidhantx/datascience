lineChart();
function lineChart() {

// SVG drawing area

    var margin = {top: 40, right: 10, bottom: 60, left: 60};

    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
    var x = d3.scaleBand()
        .range([0, width])
        .paddingInner(0.1);

    var y = d3.scaleLinear()
        .range([height, 0]);


// Axis
    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);

    var xAxisGroup = svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + height + ")")

    var yAxisGroup = svg.append("g")
        .attr("class", "y-axis axis")

    var yAxisTitle = svg.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .attr("x", 11)
        .text("Cytokine (IL6) Levels")

    var xAxisTitle = svg.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("y", 425)
        .attr("x", 850)
        .text("Time Point")


// Initialize data
    loadData();

// Create a 'data' property under the window object
    Object.defineProperty(window, 'data', {
        // data getter
        get: function() { return _data; },
        // data setter
        set: function(value) {
            _data = value;
            // update the visualization each time the data property is set by using the equal sign (e.g. data = [])
            updateVisualization()
        }
    });

// Sort order
    var reverse = false;

// Event Listener (ranking type)
    var selectRankingType = d3.select("#ranking-type").on("change", updateVisualization);




// Load CSV file
    function loadData() {
        d3.csv("data/Fermented_IL6_Levels.csv").then(function(csv) {

            csv.forEach(function(d){
                d.Participant1 = +d.Participant1;
                d.Participant2 = +d.Participant2;
                d.Participant3 = +d.Participant3;
                d.Participant4 = +d.Participant4;
                d.Participant5 = +d.Participant5;
                d.Participant6 = +d.Participant6;
                d.Participant7 = +d.Participant7;
                d.Participant8 = +d.Participant8;
                d.Participant9 = +d.Participant9;
                d.Participant10 = +d.Participant10;
                d.Participant11 = +d.Participant11;
                d.Participant12 = +d.Participant12;
                d.Participant13 = +d.Participant13;
                d.Participant14 = +d.Participant14;
                d.Participant15 = +d.Participant15;
            });

            // Store csv data in global variable
            data = csv;

            updateVisualization();

            // updateVisualization gets automatically called within the data = csv call;
            // basically(whenever the data is set to a value using = operator);
            // see the definition above: Object.defineProperty(window, 'data', { ...
        });
    }

// Render visualization
    function updateVisualization() {
        // Get the selected ranking option
        var rankingType = selectRankingType.property("value");

        // Sort data
        //data.sort(function(a, b) { return b[rankingType] - a[rankingType]; });

        if(reverse)
            data.reverse();

        // Update scales domains
        x.domain(data.map(function(d) { return d.Timepoint; }));
        y.domain([2, d3.max(data, function(d) { return d[rankingType]; })]);

        // Data join
        let bars = svg.selectAll(".bar")
            .data(data, function(d){ return d.Timepoint; });

        // Enter
        bars.enter().append("rect")
            .attr("height",0)
            .attr("y",height)
            .attr("class", "bar")

            // Update
            .merge(bars)
            .style("opacity", 0.5)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("x", function(d) { return x(d.Timepoint); })
            .attr("y", function(d) { return y(d[rankingType]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d[rankingType]); })

        // Exit
        bars.exit().remove();

        // Draw Axes
        xAxisGroup = svg.select(".x-axis")
            .attr("transform", "translate(0," + height + ")")
            .transition()
            .duration(1000)
            .call(xAxis);


        yAxisGroup = svg.select(".y-axis")
            .call(yAxis);
    }

};