/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below (.25 point)
//sets margins for the four sides of the chart, clockwise from top
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right, //sets value for the width
    height = 500 - margin.top - margin.bottom; //sets value for the height
    

// Define SVG. "g" means group SVG elements together.
// Confused about SVG still, see Chapter 3. 
// Add comments here in your own words to explain this segment of code (.25 point)
//adds svg element to the body of the HTML file
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right) //set width of chart
    .attr("height", height + margin.top + margin.bottom) //set height of chart
    .append("g") //add a group
    //moves svg element to the correct margins
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below (.25 point)
var xScale = d3.scale.ordinal() //an ordinal scale with ticks; ordinal scale is used for a set of names or categories
    .rangeRoundBands([0, width], 0.1); //returns bar width rounded to integers, (interval[, padding[, outerPadding]])

var yScale = d3.scale.linear() //a scale with no ticks by default, maps continuous input to output
    .range([height, 0]); //returns range of y values

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign(1 point)
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis() 
    .scale(yScale)
    .orient("left")
    .ticks(5, "$"); //adds tick marks with $

/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 


// data.csv contains the country name(key) and its GDP(value)
// 1 point for explaining the code for reading the data
d3.csv("GDP2016TrillionUSDollars.csv",function(error, data){
    //for each key-value pair in the csv file, read in the key and the value and store them; ensure the value in the pair is numeric
    data.forEach(function(d) {
        d.key = d.key;
        d.value = +d.value;
    });

    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // .25 point for explaining the code below
    //maps each key in the csv file to the x scale domain
    xScale.domain(data.map(function(d){ return d.key; }));
    //loops through the values in the csv file, returns the highest value
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below (no points but there may be a quiz in future)
    //creates rectangles with sizes corresponding to the values in the csv file
    svg.selectAll('rect') //select all rects in svg
        .data(data) //sees how many values there are
        .enter() //for processing
        .append('rect') //inserts rect into DOM
        .attr("height", 0) //initialize height
        .attr("y", height) //initialize y
        .attr({
            "x": function(d) { return xScale(d.key); },
            "y": function(d) { return yScale(d.value); },
            "width": xScale.rangeBand(),
            "height": function(d) { return  height - yScale(d.value); },
            // create increasing to decreasing shade of blue as shown on the output (2 points)
            "fill": function(d) {return "rgb(0, 0, " + Math.round(255-(d.value * 10)) + ")";} //round the values to prevent decimals in rgb value
        })
    
    
    // Label the data values(d.value) (3 points)
   	svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text(function(d) {
            return d.value; //determines the values of labels
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return xScale(d.key) + xScale.rangeBand() / 2; //sets the x position for labels
        })
        .attr("y", function(d) {
            return yScale(d.value) + 14; //sets the y position for labels
        })
    // Draw xAxis and position the label at -60 degrees as shown on the output (1 point)
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") //position the x-axis
        .call(xAxis) //call x-axis elements
        .selectAll("text")
        .attr("dx", "-.8em") //shift x position of x-axis labels
        .attr("dy", ".25em") //shift y position of x-axis labels
        .style("text-anchor", "end") //shift x-axis labels down
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("transform", "rotate(-60)"); //rotate label by -60
        
    
    // Draw yAxis and postion the label (2 points)
    svg.append("g")
        .attr("class", "y axis") 
        .attr("transform", "translate(0," - height + ")") //position the y-axis
        .call(yAxis) //call y-axis elements
        .selectAll("text")
        .attr("dx", "-.8em") //shift x position of y-axis labels
        .attr("dy", ".25em") //shift y position of y-axis labels
        .style("text-anchor", "end") //shift y-axis labels down
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
    
    //creates the y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)") //rotate label by 90 degrees
        .attr("dx", "-22em")
        .attr("dy", "-3.4em")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text("Trillions of US Dollars ($)");
});
