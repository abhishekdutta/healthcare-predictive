
var ticketsTimeline = function() {

  var margin = {top: 20, right: 80, bottom: 20, left: 80};
  var width = $("#chart").width() - margin.right - margin.left,
      height = $("#chart").height() - margin.top - margin.bottom;

  var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom + 10),
      g = svg.append("g")
              .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%H:%M:%S:%L");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var line = d3.line()
              .x(function(d) {
                // console.log(d);
                // console.log();
                return x(d.timestamp); })
              .y(function(d) { 
                return y(d.ECG.mean); });

d3.json("/data", 
  function(error, data) {
    console.log(data);
  // if (error) throw error;
  
  // x.domain(d3.extent(ff, function(d) { return d.timestamp; }));
  // y.domain(d3.extent(ff, function(d) { return ff.ECG.mean; }));

  // g.append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x))
  //     .selectAll("text")  
  //           .style("text-anchor", "end")
  //           .attr("dx", "-.8em")
  //           .attr("dy", ".15em")
  //           .attr("transform", "rotate(-65)" )
  //   .select(".domain")
  //     .remove();

  // g.append("g")
  //     .call(d3.axisLeft(y));
  //   // .append("text")
  //   //   .attr("fill", "#000")
  //   //   .attr("transform", "rotate(-90)")
  //   //   .attr("y", 6)
  //   //   .attr("dy", "0.71em")
  //   //   .attr("text-anchor", "end")
  //   //   .text("Price ($)");

  // g.append("path")
  //     .datum(data)
  //     .attr("fill", "none")
  //     .attr("stroke", "steelblue")
  //     .attr("stroke-linejoin", "round")
  //     .attr("stroke-linecap", "round")
  //     .attr("stroke-width", 1.5)
  //     .attr("d", line);
});

  // console.log(new Date("1982-06-25T00:18:52.496000"))

  // Chart dimensions
//   var margin = {top: 20, right: 80, bottom: 20, left: 80};
//   var width = $("#chart").width() - margin.right - margin.left,
//       height = 500 - margin.top - margin.bottom;

// //   // Create the SVG container and set the origin
//   var svg = d3.select("#chart")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom + 10)
//                 .append("g")
//                 .attr("transform",
//                       "translate(" + margin.left + "," + margin.top + ")");

//   // Add bottom x axis
//   // var xAxisRef = svg.append("g")
//   //                    .attr("class", "x axis")
//   //                    .attr("transform", "translate(0, " + height + ")");

//   var yScale = d3.scaleLinear().domain([0, 200]).range([height - 50, 0]);
//   var yAxis = d3.axisLeft(yScale);
//   // svg.append("g").attr("class", "axis").call(yAxis);

//   svg.append("g")
//         .attr("class", "axis")
//         .call(yAxis);

//         // .append("text")
//         // .attr("transform", "rotate(-90)")
//         // .attr("x", -150)
//         // .attr("y", 0)
//         // .attr("dy", "0.32em")
//         // .attr("fill", "#000")
//         // .attr("font-weight", "bold")
//         // .attr("text-anchor", "start")
//         // .text("Tickets Per Hour");

//   function drawTPHperDayGraph() {
//     d3.json("/dateRange", function(dateRange) {
//       // console.log("I am HERE");
//       var minDate = new Date(dateRange.minDate),
//           maxDate = new Date(dateRange.maxDate);

//       // Give some leeway
//       // minDate.setDate(minDate.getDate() - 15);
//       // maxDate.setDate(maxDate.getDate() + 15);

//       // X scale
//       var xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);

//       // The x axis
//       // var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));

//       // xAxisRef.call(xAxis);

//        svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0, " + (height - 50) + ")")
//         .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%H:%M:%S:%L")).ticks(24))
//       .selectAll("text")  
//             .style("text-anchor", "end")
//             .attr("dx", "-.8em")
//             .attr("dy", ".15em")
//             .attr("transform", "rotate(-65)" );
//             // .exit()
//         // .append("text")
//         // .attr("x", width + 5 + 10 - 400)
//         // .attr("y", 10 + 12)
//         // .attr("dy", "0.32em")
//         // .attr("fill", "black")
//         // .attr("font-weight", "bold")
//         // .attr("text-anchor", "start")
//         // .text("Dates");

//     //   function drawDots(dots) {
//     //     dots.attr("r", 2).attr("cx", function(d) {
//     //                        return xScale(new Date(d.key));
//     //                      }).attr("cy", function(d) { return yScale(d.value); });
//     //   }

//     var line = d3.line()
//               .x(function(d) {
//                 // console.log(d);
//                 // console.log();
//                 ff = JSON.parse(d)
//                 // console.log(ff.timestamp)
//                 return xScale(new Date(ff.timestamp)); })
//               .y(function(d) { return yScale(ff.ECG); });

//     d3.json("/data", function(error, data) {
//       // console.log(data);
//       svg.append("path")
//         // .attr("class", "path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-linejoin", "round")
//         .attr("stroke-linecap", "round")
//         .attr("stroke-width", 1.5)
//         .attr("d", line);
//     });
    
//     //   d3.json("/ticketsPerHour/" + courseName, function(ticketsPerHour) {
//     //     var circles = svg.selectAll("circle").data(d3.entries(ticketsPerHour));

//     //     // Update
//     //     circles.transition().duration(1000).call(drawDots);

//     //     // Create
//     //     circles.enter().append("circle").call(drawDots);

//     //     // Remove
//     //     circles.exit().remove();
//     //   });

//     //   function getX(d) {
//     //     var date = new Date(d.dueDate);
//     //     // date.setHours(23);
//     //     return xScale(date.getTime());
//     //   }

//     //   function drawLines(lines) {
//     //     lines.attr("class", function(d) { return "deadline " + d.type; })
//     //         .attr("x1", getX)
//     //         .attr("y1", 0)
//     //         .attr("x2", getX)
//     //         .attr("y2", height);
//     //   }

//     //   d3.json("/deadlines/" + courseName, function(deadlines) {
//     //     var lines = svg.selectAll(".deadline").data(deadlines);

//     //     // Update
//     //     lines.transition().duration(1000).call(drawLines);

//     //     // Create
//     //     lines.enter().append("line").call(drawLines);

//     //     // console.log(svg.selectAll(".deadline"))
//     //   });

//     });
//   }


//   return drawTPHperDayGraph();
};
var drawTicketsVis = ticketsTimeline();
