var fakedata = ["ECG", "SpO2", "Pleth", "Respiration Rate", "Heart Rate", 
				"mean", "systolic", "diastolic", "Respiration Rate-", "etCO2"];
var listelems = {};
var clicked = null;

$('#fb').on('click', function(event) {
	// console.log("hello");        
     $('#demo').toggle('show');
});

var flag = 0;
document.addEventListener("mousedown", function(){
    flag = 1;
}, false);
document.addEventListener("mousemove", function(){
	if (flag >= 1)
		flag += 1
}, false);

document.addEventListener("mouseup", function(e) 
{

	if (flag >= 2) {
		flag = 0;
		return;
	}
	flag = 0;


    var container = $("#demo");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0 && !$("#fb").is(e.target)) {
    	if (container.is(':visible'))
        	container.fadeOut();
        else if (clicked !== null) {
        	var claz = $(e.target).attr("class") !== undefined ? $(e.target).attr("class").split(" ")[0] : null;

        	if (claz !== "alarm" && claz !== "dot") {
	        	$("#td121, #td131").find("ul").remove();
				$("#s2, #s3").find("path").remove();

				if ($("#" + clicked).attr("class").split(" ")[0] === "alarm")
					$("#" + clicked).attr("stroke", "red");
				else
					$("#" + clicked).attr("fill", "red");

				clicked = null;
	        }
        } 

    }
});

function nextChar(c) {
	return String.fromCharCode(c.charCodeAt(0) + 1);
};

function parser(str) {
	// console.log("str is: " + str);
	var len = str.length;
	var alarms = $(".dot:visible");
	alarms.hide();
	var l = 0
	while (l < len && (str.charAt(l) === " " || str.charAt(l) === "\n" || str.charAt(l) === "\t")) {l++;}
	if (len === 0 || str.charAt(l) === " " || str.charAt(l) === "\n" || str.charAt(l) === "\t"){
		alarms.show();
		return;
	}

	// console.log("l value is " + l);
	//tokenising loop
	var tokens = [{"statement": null}];
	var liststobe = 0;
	var currlist = tokens;
	var parents = [];
	var currstr = "";
	var not = false;
	var lastchar = null;
	for (var i = l; i < len; i++) {
		// console.log("Step1");
		var currchar = str.charAt(i);
		switch (currchar) {
			case " ":
			case "\n":
			case "\t":
				continue;
			case "(":
				if (lastchar !== null && lastchar !== "!" && lastchar !== "&" && lastchar !== "|"  && lastchar !== "(") {
					window.alert("Syntax Error (at character " + (i + 1) + "): Invalid statement");
					alarms.show();
					return;
				}
				liststobe++;
				var ll = [{"statement": null, "truth": !not}];
				not = false;
				currlist.push(ll);
				parents.push(currlist);
				currlist = ll;
				break;
			case ")":
				if (currstr === "" && lastchar !== ")") {
					window.alert("Syntax Error (at character " + (i + 1) 
						+ "): No value before \"" + currchar +"\"");
					alarms.show();
					return;
				}
				currstr = "";

				liststobe--;
				if (liststobe < 0) {
					window.alert("Syntax Error (at character " + (i + 1) + "): Missing \"(\"");
					alarms.show();
					return;
				}
				currlist = parents.pop();
				break;
			case "!":
				for (; i < len && str.charAt(i) === "!"; i++) {not = !not;}
				// if (i >= len) {
				// 	window.alert("Syntax Error (at character " + i + "): No value after \"!\"");
				// 	alarms.show();
				// 	return;
				// }
				i--;
				break;
			case "|":
			case "&":
				if (currstr === "" && lastchar !== ")") {
					window.alert("Syntax Error (at character " + (i + 1) 
						+ "): No value before \"" + currchar +"\"");
					alarms.show();
					return;
				}
				currstr = "";

				if (currlist[0].statement === null)
					currlist[0].statement = currchar;
				else if (currlist[0].statement !== currchar) {
					window.alert("Syntax Error (at character " + (i + 1) + 
						"): Cannot use different logical statements in the same area; found \"" + 
						currchar +"\" in a statement beginning with \"" + currlist[0].statement + "\"");
					alarms.show();
					return;
				}
				break;
			default:
				// console.log("Step2");
				if (lastchar !== null && lastchar !== "!" && lastchar !== "&" && lastchar !== "|"  && lastchar !== "(") {
					window.alert("Syntax Error (at character " + (i + 1) + "): Invalid statement");
					alarms.show();
					return;
				}

				while (i < len && currchar !== "(" && currchar !== ")" && currchar !== "&" && currchar !== "|"
					&& currchar !== " " && currchar !== "\n" && currchar !== "\t") {
					currstr += currchar;
					i++;
					currchar = str.charAt(i);
				}
				i--;
				var token = listelems[currstr];

				if (token === undefined) {
					window.alert("Value Error (at character " + (i + 1) + 
								"): Couldn't find the value before \"" + currchar +"\"");
					alarms.show();
					return;
				}

				var tokenized = token.split(";");
				// console.log(tokenized);

				if (currlist[0][tokenized[0]] === undefined)
					currlist[0][tokenized[0]] = [];

				var vtp = not ? tokenized[1] + "!" : tokenized[1];
				currlist[0][tokenized[0]].push(vtp);
				not = false;
				// console.log("Step3");
		}
		lastchar = currchar;
	}
	if (lastchar === "&" || lastchar === "|" || lastchar === "!") {
		window.alert("Syntax Error (at the end of the input): No value after \"" + lastchar + "\"");
		alarms.show();
		return;
	}
	if (liststobe > 0) {
		window.alert("Syntax Error (at the end of the input): Missing \")\"");
		alarms.show();
		return;
	}
	// if (currstr !== "") {
	// 	var token = listelems[currstr];
	// 	if (token === undefined) {
	// 		window.alert("Value Error (at character " + (i + 1) + 
	// 					"): Couldn't find the value before \"" + currchar +"\"");
	// 		alarms.show();
	// 		return;
	// 	}
	// 	var tokenized = token.split(";");
	// 	currlist[0][tokenized[0]].push(tokenized[1] + (not) ? "!" : "");
	// 	not = false;
	// }
	// console.log(tokens);

	var res = evalluate(tokens);
	$(".dot").filter(function(index, d) {
	// console.log();
	return res(d3.select("#" + $(d).attr("id")).data()[0].data.alarms);
	}).show();

};

function evalluate(tokens) {
	var res = null;

	var acdic = tokens[0];
	var keys = Object.keys(acdic);
	keys.splice(keys.indexOf("statement"), 1);
	if (acdic.statement === null) {
		if (tokens.length === 1) {
			var vall = acdic[keys[0]][0].split("!");
			if (keys[0] === "alarms")
				res = function(d) {
					var ret = (d[vall[0]] !== undefined); 
					return (vall.length === 1) ? ret : !ret;
				};
			else
				res = function(d) {
					for (var k in d) {
						if ((vall.length === 1) ? (d[k][keys[0]] === vall[0]) : (d[k][keys[0]] !== vall[0]))
							return true;
					}
					return false;
				};
		} else
			res = evallu(tokens[1]);

	} else {

		var resfuncs = [];
		for (var i = 1; i < tokens.length; i++)
			resfuncs.push(evallu(tokens[i]));

		if (acdic.statement === "&") {
			res = function(d) {
				for (var k = 0; k < keys.length; k++) {
					var alls = acdic[keys[k]];
					if (keys[k] === "alarms") {
						for (var i = 0; i < alls.length; i++) {
							var vall = alls[i].split("!");
							var possres = (d[vall[0]] !== undefined);
							if (vall.length === 1) {
								if (!possres)
									return false;
							} else if (possres)
								return false;
						}
						// console.log("Step1");
					} else {
						var og = acdic["alarms"];
						var reslen = 0;
						for (var i = 0; i < alls.length; i++) {
							var vall = alls[i].split("!");
							var curreslen = reslen;
							if (og === undefined) {
								for (var analarm in d) {
									// console.log(analarm + "   " + d[analarm][keys[k]]);
									var possres = (d[analarm][keys[k]] === vall[0]);
									if (vall.length === 1) {
										if (possres) {
											reslen++;
											break;
										}
									} else if (!possres) {
										reslen++;
										break;
									}
								}
								if (curreslen === reslen)
									return false;
							} else {
								for (var l = 0; l < og.length; l++) {
									var current = og[l].split("!")[0];
									if (d[current] === undefined)
										return false;
									var possres = (d[current][keys[k]] === vall[0]);
									if (vall.length === 1) {
										if (!possres) 
											return false;
									} else if (possres)
										return false;
								}
							}
						}
						// console.log("Step2");
					}
				}
				for (var i = 0; i < resfuncs.length; i++) { // could be replaced with line 239
					if (!resfuncs[i](d))
						return false;
				}
				// console.log("Step3");
				return true;	
			};
		} else {
			res = function(d) {
				for (var k = 0; k < keys.length; k++) {
					var alls = acdic[keys[k]];
					if (keys[k] === "alarms") {
						for (var i = 0; i < alls.length; i++) {
							var vall = alls[i].split("!");
							var possres = (d[vall[0]] !== undefined);
							if (vall.length !== 1) {
								if (!possres)
									return true;
							} else if (possres)
								return true;
						}
					} else {
						for (var i = 0; i < alls.length; i++) {
							var vall = alls[i].split("!");
							for (var analarm in d) {
								var possres = (d[analarm][keys[k]] === vall[0]);
								if (vall.length === 1) {
									if (possres)
										return true;
								} else if (!possres)
									return true;
							}
						}
					}
				}
				for (var i = 0; i < resfuncs.length; i++) { // could be replaced with line 239
					if (resfuncs[i](d))
						return true;
				}
				return false;	
			};
		}
	}
	return res;
}

function evallu(tokens) {
	var res = null;

	var acdic = tokens[0];
	var keys = Object.keys(acdic);
	// console.log(keys);
	keys.splice(keys.indexOf("statement"), 1);
	keys.splice(keys.indexOf("truth"), 1);
	// console.log(keys);
	if (acdic.statement === null) {
		if (tokens.length === 1) {
			var vall = acdic[keys[0]][0].split("!");
			if (keys[0] === "alarms")
				res = function(d) {
					var dd = Object.keys(d);
					var ret = (dd.length === 1) && (dd[0] === vall[0]); 
					return (vall.length === 1) ? ret : !ret;
				};
			else
				res = function(d) {
					for (var k in d) {
						if ((vall.length === 1) ? (d[k][keys[0]] !== vall[0]) : (d[k][keys[0]] === vall[0]))
							return false;
					}
					return true;
				};
		} else
			res = evallu(tokens[1]);

	} else {

		var resfuncs = [];
		for (var i = 1; i < tokens.length; i++)
			resfuncs.push(evallu(tokens[i]));

		if (acdic.statement === "&") {
			res = function(d) {
				if (acdic["alarms"] !== undefined) {
					var reslen = 0;
					for (var i = 0; i < alls.length; i++) {
						var vall = alls[i].split("!");
						var possres = (d[vall[0]] !== undefined);
						if (vall.length === 1) {
							reslen++;
							if (!possres)
								return false;
						} else if (possres)
							return false;
					}
					if (Object.keys(d).length !== reslen)
						return false;
					for (var k = 0; k < keys.length; k++) {
						if (keys[k] === "alarms")
							continue;
						var alls = acdic[keys[k]];
						for (var i = 0; i < alls.length; i++) {
							var vall = alls[i].split("!");
							for (var analarm in d) {
								var possres = (d[analarm][keys[k]] === vall[0]);
								if (vall.length === 1) {
									if (!possres)
										return false;
								} else if (possres)
									return false;
							}
						}
					}
				} else {
					var reslen = 0;
					var breaker = false;
					for (var analarm in d) {
						for (var k = 0; k < keys.length; k++) {
							var alls = acdic[keys[k]];
							for (var i = 0; i < alls.length; i++) {
								var vall = alls[i].split("!");
								var possres = (d[analarm][keys[k]] === vall[0]);
								if (vall.length === 1) {
									if (!possres) {
										breaker = true;
										break;
									}
								} else if (possres) {
									breaker = true;
									break;
								}
							}
							if (breaker) {
								reslen++;
								break;
							}
						}
						breaker = false;
					}
					if (reslen === Object.keys(d).length)
						return false;
				}
				
				for (var i = 0; i < resfuncs.length; i++) { // could be replaced with line 239
					if (!resfuncs[i](d))
						return false;
				}
				return true;	
			};
		} else {
			res = function(d) {
				for (var k = 0; k < keys.length; k++) {
					var alls = acdic[keys[k]];
					var reslen = 0;
					if (keys[k] === "alarms") {
						for (var i = 0; i < alls.length; i++) {
							var vall = alls[i].split("!");
							var possres = (d[vall[0]] !== undefined);
							if (vall.length === 1 && possres)
								reslen++;
						}
					} else {
						for (var i = 0; i < alls.length; i++) {
							var vall = alls[i].split("!");
							for (var analarm in d) {
								var possres = (d[analarm][keys[k]] === vall[0]);
								if (vall.length === 1 && possres)
									reslen++;
							}
						}
						
					}
					if (Object.keys(d).length === reslen)
							return true;
				}
				for (var i = 0; i < resfuncs.length; i++) { // could be replaced with line 239
					if (resfuncs[i](d))
						return true;
				}
				return false;	
			};
		}
	}

	return function (d) {
		var resu = res(d);
		return (acdic.truth) ? resu : !resu;
	};

}

function drawgraph(datum, strattr, place) {
	// var datum = iden[strattr].val;
	var sv = d3.select(place);
	var xScale = d3.scale.linear()
					.domain(d3.range(0, datum.length))
					.range([0, $(place).width()]);
	var yScale = d3.scale.linear()
					.domain(d3.extent(datum))
					.range([$(place).height() - 13, 0]);
	var line = d3.svg.line()
				.interpolate("linear")
				.x(function(d, i) {return xScale(i);})
				.y(function(d) {return (d !== null && d !== "Not a number") ? yScale(d) : ($(place).height() - 3);});

	sv.selectAll(".line")
		.data([datum])
		.enter()
		.append("path")
		.attr("class", "line")
		.attr("stroke", color(strattr))
		.attr("stroke-width", "1.5px")
		.attr("fill", "none")
		.attr("d", function(d) {return line(d)});
};

var graph = function() {
	d3.json("/data", function(datat) {
		var notrecorded = true;
	    // console.log(data);

	    minmax = datat.minmax;
	    datacount = datat.amount;
	    data = datat.data;
	    xmin = new Date(Date.parse(minmax.timestamp.min));
	    xmax = new Date(Date.parse(minmax.timestamp.max));

	    var start = 1;
	    var params = {"source": {}, "state": {}, "code": {}, "type": {}, "string": {}};
	    var leroy = {};

		$( "#alarmlist li" ).children().each( function() {
			if ($(this).attr("id") === "kinds") {
				for (var key in minmax.alarms) {
					// if (key === "times")
					// 	continue;
			    	$(this).append("<li>" + key + "</li>");
			    	listelems[start.toString()] = "alarms;" + key;
			    	for (var seckey in minmax.alarms[key]) {
		    			//if (seckey === "times")
						// continue;
			    		var thestr = "<ul><li>" + seckey.charAt(0).toUpperCase() + seckey.slice(1) + ":</li>\n";
			    		for (var trdkey in minmax.alarms[key][seckey]) {
			    			params[seckey][trdkey] = true;
			    			thestr += "<li class=\"acode\" style=\"list-style-type: none; margin-left: 20px;\">" + 
			    						trdkey + "</li>\n";
			    		}
			    		thestr += "</ul>"
			    		$(this).append(thestr);
			    	}
			    	start++;
				}
			}
			else {
				$(this).attr("start", start);
				for (var key in params[$(this).attr("id")]) {
					$(this).append("<li>" + key + "</li>");
					listelems[start.toString()] = $(this).attr("id") + ";" + key;
					leroy[key] = start;
					start++;
				}
			}
		});
		
		$(".acode").each(function() {
			$(this).text("(" + leroy[$(this).text()] + ") " + $(this).text());
		});

		var order = "a";
		for (var key in minmax.qos) {
			$("#qoslist").append("<li>" + key + "</li>");
			listelems[order] = "qos;" + key;
			order = nextChar(order);
		}



		$("#sb").click(function(){
			// console.log("hello");
		    parser($("textarea").val());
		    // console.log("bye");
		});

		$(".graph").change(function() {
			// console.log($(this).attr("value"));
			var atttr = $(this).attr("value");
			if ($(this).prop("checked"))
				$("#" + atttr + ", circle." + atttr).show();
			else
				$("#" + atttr + ", circle." + atttr).hide();
		});

		$(".alarmhide").change(function() {
			if ($(this).prop("checked"))
				$(".alarm").show();
			else
				$(".alarm").hide();
		});






var color = d3.scale.category10().domain(fakedata);
var linedict = {};
// var processeddata = [];

var margin = {top: 20, right: 30, bottom: 30, left: 30};
var width = $("#td4").width() - 3 - margin.left - margin.right;
var height = $("#td4").height() - 2 - margin.top - margin.bottom;


fakedata.forEach(function(realattr) {
	// console.log(realattr + ": " + color(realattr));
	linedict[realattr] = {"yScale": d3.scale.linear()
										.range([height - 55, 0]),
							// "lasttime":  new Date( Date.parse( "0000-00-00T00:00:00.000000" ) ),
							"line": d3.svg.line()
										.interpolate("linear")
										// .defined(function(d) {
										// 	return (d.value != null && d.value !== "Not a number"); })
		    							.x(function(d) {
		    						// 		if (notrecorded)
												// actdict[realattr][d.timestamp] = d.value;

		    								// var currval = new Date(Date.parse(d.timestamp));
		    								// if (currval < linedict[realattr].lasttime)
		    								// 	console.log("There is an error in " + realattr);
		    								// linedict[realattr].lasttime = currval;
		    								return x(new Date(Date.parse(d.timestamp))); 
		    							})};
	// var tobepushed = {
	// 		"name": realattr,
	// 		"values": null
	// 		};

	// var thedict = null;

	if (realattr === "ECG" || realattr === "Pleth") {

		linedict[realattr].yScale.domain([minmax[realattr].mean.min, minmax[realattr].mean.max]);
		// tobepushed.values = minmax[realattr].values;

		linedict[realattr].line.y(function(d) {
			var res = d[realattr] ? linedict[realattr].yScale(d[realattr].stats.mean) : (height - 5);
			// svg.append("circle")
			// 	.attr("class", "datapoint")
			// 	.attr("r", 2
			// 		// function(d) {return 8 - fakedata.indexOf(d.attribute);}
			// 		)
			// 	.attr('fill', color(realattr))	
			// 	.attr("transform", "translate(" + x(new Date(Date.parse(d.timestamp))) + "," + res + ")");

			return res; 
		});

		// thedict = minmax[realattr].values;
		// for (var key in thedict){
		// 	if (thedict.hasOwnProperty(key))
		// 		tobepushed.values.push({"timestamp": key, 
		// 						"value": thedict[key].stats ? thedict[key].stats.mean : null});
		// }

	} else if (realattr === "mean" || realattr === "systolic" || realattr === "diastolic") {
		linedict[realattr].yScale.domain([minmax["Non-invasive Blood Pressure"][realattr].min, 
										minmax["Non-invasive Blood Pressure"][realattr].max]);
		linedict[realattr].line.y(function(d) {
			var currdata = d["Non-invasive Blood Pressure"][realattr]
			return (currdata !== null && currdata !== "Not a number") ? linedict[realattr].yScale(currdata) : (height - 5);});
		// tobepushed.values = minmax["Non-invasive Blood Pressure"][realattr].values;
		// thedict = minmax["Non-invasive Blood Pressure"][realattr].values;

	} else if (realattr === "Respiration Rate-" || realattr === "etCO2") {
		var curratr = realattr.split("-")[0];
		linedict[realattr].yScale.domain([minmax["Airway"][curratr].min, 
										minmax["Airway"][curratr].max]);
		linedict[realattr].line.y(function(d) {
			var currdata = d["Airway"][curratr];
			return (currdata !== null && currdata !== "Not a number") ? linedict[realattr].yScale(currdata) : (height - 5);});
	} else {
	  	linedict[realattr].yScale.domain([minmax[realattr].min, minmax[realattr].max]);
	  	linedict[realattr].line.y(function(d) {
			var currdata = d[realattr]
			return (currdata !== null && currdata !== "Not a number") ? linedict[realattr].yScale(currdata) : (height - 5);});
	  	// tobepushed.values = minmax[realattr].values;
	  	// thedict = minmax[realattr].values;
	}

		// for (var key in thedict){
		// 	if (thedict.hasOwnProperty(key))
		// 		tobepushed.values.push({"timestamp": key, 
		// 								"value": thedict[key]});
		// }
	// processeddata.push(tobepushed);
	// jj += 50;

});
 
// var y = d3.scale.linear()
//     .domain([minmax["Heart Rate"].minmax.min, 
// 			minmax["Heart Rate"].minmax.max])
//     .range([height - 15 , 0]);

var x = d3.time.scale()
			.domain([xmin, xmax])
			.range([0, width]);
	
var xAxis = d3.svg.axis()
    .scale(x)
	.tickSize(-height)
	.tickPadding(10)	
	.tickSubdivide(true)
	.tickFormat(d3.time.format("%d-%H:%M:%S:%L"))	
    .orient("bottom");	
	
// var yAxis = d3.svg.axis()
//     .scale(y)
// 	.tickPadding(10)
// 	.tickSize(-width)
// 	.tickSubdivide(true)	
//     .orient("left");
	
var zoom = d3.behavior.zoom()
    .x(x)
    // .y(y)
    // .scaleExtent([1, 10])
    // .on("end", function() {
    // 	console.log("here");
    // 	flag = 1;
    // })
    .on("zoom", zoomed);	
	
	
 
	
	
//************************************************************
// Generate our SVG object
//************************************************************	
var svg = d3.select("#td4").append("svg")
	.on("mousedown", function(){
	    flag = 1;
	})
	.call(zoom)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
 
// svg.selectAll("y axis").data(fakedata)
// 	.enter()
// 	.append("g")
//     .attr("class", "y axis")
//     .call(function(d) {
//     	console.log(d);
//     	return d3.svg.axis().scale(linedict[d].yScale);});
 
// svg.append("g")
// 	.attr("class", "y axis")
// 	.append("text")
// 	.attr("class", "axis-label")
// 	.attr("transform", "rotate(-90)")
// 	.attr("y", (-margin.left) + 10)
// 	.attr("x", -height/2)
// 	.text('Axis Label');	
 
svg.append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);
	
	
// var line = d3.svg.line()
//     .interpolate("linear")
// 	// .defined(function(d) {
// 	// 	// if (notrecorded)
// 	// 	// 	actdict[realattr][d.timestamp] = d.value;
// 	// 	// console.log(d.value);
// 	// 	return (d.value != null && d.value !== "Not a number"); })
// 	.x(function(d) { 
// 		return x(new Date(Date.parse(d.timestamp))); })
// 	.y(function(d) { 
// 		return (d.value !== null && d.value !== "Not a number") ? y(d.value) : height - 5; 
// 	}); 		

// var jj = 9;
var lines = svg.selectAll('.lines')
	.data( fakedata )
	.enter()
	.append("g")
		.attr("class", "lines" 
			// + function(d) {return d.name.split(' ').join('_');}
			)
    	// .attr("id", function(d) {return d.name.split(' ').join('_');})
	.attr("clip-path", "url(#clip)");

var oneline = lines.selectAll(".line")
	.data(function(d) {return [{"name": d, "data": data}];})
	.enter();

oneline.append("path")
    .attr("class", "line " 
    	+ function(d) {return d.name.split(' ').join('_');}
    	)
    .attr("id", function(d){return d.name.split(' ').join('_');})
	// .attr("clip-path", "url(#clip)")
	.attr('stroke', 
		function(d,i){
		// console.log(d.name + ': ' + color(d.name)); 			
		return color(d.name);
	})
    .attr("d", 
    	function(d) {
    		return linedict[d.name].line(d.data);
    	});

var svg2 = d3.select("#td11").append("svg")
    .attr("width", 266)
    .attr("height", 90)
	.append("g")
    .attr("transform", "translate(" + 5 + "," + 5 + ")");



var legend = svg2.append("g")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", 10)
                     // .attr("text-anchor", "end")
                     .selectAll("g")
                     .data(fakedata)
                     .enter();

    legend.append("rect")
        .attr("x", function(d, i) {
        	if (i < 5)
        		return 5;
        	return $("#td11").width()/2;	
        })
        .attr("y", function(d, i) {
        	if (i < 5)
        		return i * 18;
        	return (i-5) * 18;	
        })
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d) {return color(d);});

    legend.append("text")
        .attr("x", function(d, i) {
        	if (i < 5)
        		return 20;
        	return ($("#td11").width()/2) + 15;	
        })
        .attr("y", function(d, i) {
        	if (i < 5)
        		return (i * 18) + 5;
        	return ((i-5) * 18) + 5;	
        })
        .attr("dy", "0.32em")
        .text(function(d) { return d; });




svg.append('line')
	.attr('class', '.defining')
	.style("stroke-dasharray", ("3, 3"))
	.attr("x1", 0)
    .attr("y1", height	- 30)
    .attr("x2", width)
    .attr("y2", height - 30)
    .attr('stroke', 'black');


// var points = svg.selectAll('.dots')
// 	.data(fakedata)
// 	.enter()
// 	.append("g")
//     .attr("class", "dots")
// 	.attr("clip-path", "url(#clip)");


// console.log(actdict["Pleth"]["1982-06-25T00:18:52.496000"])
// minmax.alarms.times.forEach(function(tt) {
// 	console.log(actdict["ECG"][tt]);
// });
// console.log(minmax.alarms.times);	
// console.log((actdict["Pleth"]["1982-06-25T02:16:45.720000"] 
	// ? actdict["Pleth"]["1982-06-25T02:16:45.720000"].stats.mean : minmax["Pleth"].mean.min) === minmax["Pleth"].mean.min);
// console.log(x(new Date(Date.parse("1982-06-25T02:16:45.720000"))));

// var dotlist = [];
// var alarmdict = {};

// fakedata.forEach(function(d){		
// 	minmax.alarms.times.forEach(function(el){
// 		var elem = el.timestamp;
// 		alarmdict[elem] = {"alarms": el.alarms, "qos": el.qos};
// 		var tbp = {"attribute": d,
// 					"point": {"x": elem,"y": null}};
// 		if (d === "ECG" || d === "Pleth")
// 			tbp.point.y = actdict[d][elem] ? linedict[d].yScale(actdict[d][elem].stats.mean) : height - 5;
// 		else 
// 			tbp.point.y = (actdict[d][elem] && actdict[d][elem] !== "Not a number") ? linedict[d].yScale(actdict[d][elem]) : height - 5;

// 		dotlist.push(tbp);
// 	})
// })

// fakedata.forEach(function(currattr) {
	
// })

var alarmlist = [];
var filled = false

lines.selectAll('.dot')
	.data(function(d) {
		var a = [];
		data.forEach(function(currdot) {
			if (currdot.alarms !== null) //change w predicate
			{
				if (!filled)
					alarmlist.push({"timestamp": currdot.timestamp, "data": currdot});
				a.push({"name": d, "data": currdot});
			}
		});
		filled = true;
		return a;})
	.enter()
	.append("circle")
	.attr("class", function(d) {return "dot " + d.name.split(' ').join('_');})
	.attr("id", function(d) {return d.name.split(' ')[0] + 'L' + d.data.timestamp.split(/\.|:/).join("-");})
	.attr("r", 2.5
		// function(d) {return 8 - fakedata.indexOf(d.attribute);}
		)
	.attr('fill', "red" 
	// 	function(d){ 	
	// 	return color(d.attribute);
	// }
	)	
	.attr("transform", function(d) { 
		return "translate(" + x(new Date(Date.parse(d.data.timestamp))) + "," + linedict[d.name].line.y()(d.data) + ")";});
	
	svg.selectAll('.alarm')
	.data(alarmlist)
	.enter()
	.append('line')
	.attr('class', 'alarm')
	.attr('id', function(d) {return "L" + d.timestamp.split(/\.|:/).join("-");})
	.attr("x1", function(d) {return x(new Date(Date.parse(d.timestamp)));})
    .attr("y1", 0)
    .attr("x2", function(d) {return x(new Date(Date.parse(d.timestamp)));})
    .attr("y2", height)
    .attr('stroke', 'red')
    .attr('stroke-width', '5px')
    .attr('display', 'none');

// console.log(d3.select("#etCO2L1982-06-25T02-17-54-264000").data());


function infodisplay(iden) {
	var str = "<ul style=\"list-style: none; margin-left: 0px;\"><li>timestamp: " + iden.timestamp + "</li>";
	var noninvasive = "<li><ul style=\"list-style: none;\">Non-invasive Blood Pressure:";
	var airway = "<li><ul style=\"list-style: none;\">Airway:";

	fakedata.forEach(function(atr) {
		if (atr === "ECG" || atr === "Pleth") {
			var dictionary = iden[atr] ? iden[atr].stats : null;
			if (dictionary !== null) {
				var scstr = "<li><ul style=\"list-style: none;\">" + atr + ":";
				for (var key in dictionary) {
			    // if (dictionary.hasOwnProperty(key)) {
			        scstr += "<li>" + key + ": " + dictionary[key] + "</li>";
			    // }
			}
			str += scstr + "</ul></li>";
			} else
				str += "<li>" + atr + ": null</li>";
		} else if (atr === "mean" || atr === "systolic" || atr === "diastolic")
			noninvasive += "<li style=\"margin-left: 10px;\">" + atr + ": " + iden["Non-invasive Blood Pressure"][atr] + "</li>";
		else if (atr === "Respiration Rate-" || atr === "etCO2")
			airway += "<li style=\"margin-left: 10px;\">" + atr + ": " + iden["Airway"][atr.split('-')[0]] + "</li>";
		else
			str += "<li>" + atr + ": " + iden[atr] + "</li>";
	});

	$("#td121").append(str + noninvasive + "</ul></li>" + airway + "</ul></li></ul>");

	var str2 = "<ul style=\"list-style: none; margin-left: 0px;\">";
	for (var key in iden.alarms) {
		str2 += "<li>" + key + ":</li>";
		for (var sekey in iden.alarms[key])
			str2 += "<li style=\"margin-left: 10px;\">" + sekey + ": " + iden.alarms[key][sekey] + "</li>";	
	}
	$("#td131").append(str2 + "<li>qos: " + iden.qos + "</li></ul>");

	if (iden.ECG !== null)
		drawgraph(iden.ECG.val, "ECG", "#s2");

	if (iden.Pleth !== null) 
		drawgraph(iden.Pleth.val, "Pleth", "#s3");
}

// function turnitback(str) {
// 	var arr = str.split("T")
// 	var tim = arr[1].split("-");
// 	return arr[0] + "T" + [tim[0], tim[1], tim[2] + "." + tim[3]].join(":");
// }

$(".alarm, circle.dot").hover(function() {
	// console.log("hover-in before: " + $(this).attr("fill"));
	var claz = $(this).attr("class");
	var tim = $(this).attr("id");
	if (clicked === null) 
		infodisplay(d3.select("#" + $(this).attr("id")).data()[0].data);
	(claz !== "alarm") ? $(this).attr("fill", "blue") : $(this).attr("stroke", "blue");
	// console.log("hover-in after: " + $(this).attr("fill"));
}, function() {
	// console.log("hover-out before: " + $(this).attr("fill"));
	var claz = $(this).attr("class");
	var tim = $(this).attr("id");
	if (clicked === null) {
		$("#td121, #td131").find("ul").remove();
		$("#s2, #s3").find("path").remove();
	}
	if (tim !== clicked)
		(claz !== "alarm") ? $(this).attr("fill", "red") : $(this).attr("stroke", "red");
	// console.log("hover-out after: " + $(this).attr("fill"));
});

$(".alarm, circle.dot").click(function() {
	// console.log("just clicked: " + $(this).attr("id") + ". Color was " + $(this).attr("stroke"));
	
	if (clicked !== null) {

		var claz = $("#" + clicked).attr("class");
		// console.log(claz);
		// console.log("click (" + clicked + ") before: " + $("#" + clicked).attr("stroke"));
		(claz !== "alarm") ? $("#" + clicked).attr("fill", "red") : $("#" + clicked).attr("stroke", "red");
		// console.log("click (" + clicked + ") after: " + $("#" + clicked).attr("stroke"));
		// console.log("R ids equal: " + ($(this).attr("id") === clicked))
	}

	var tim = $(this).attr("id");
	if (clicked !== tim) {
		$("#td121, #td131").find("ul").remove();
		$("#s2, #s3").find("path").remove();
		clicked = tim;
		infodisplay(d3.select("#" + $(this).attr("id")).data()[0].data);
	} else {
		clicked = null;
		// $("#td121, #td131").find("ul").remove();
	}
});
	


function zoomed() {

	// console.log(notrecorded);
	notrecorded = false;
	svg.select(".x.axis").call(xAxis);

	// svg.selectAll("circle.datapoint").remove();
	// svg.selectAll(".y.axis").call(function(d) {
	// 	return d3.svg.axis().scale(linedict[d].yScale);
	// });   
	svg.selectAll('path.line').attr('d', function(d) {
		return linedict[d.name].line(d.data);
	});  
 
	svg.selectAll('.alarm')
		.attr("x1", function(d) {return x(new Date(Date.parse(d.timestamp)));})
	    // .attr("y1", 0)
	    .attr("x2", function(d) {return x(new Date(Date.parse(d.timestamp)));});
	    // .attr("y2", height);  

	svg.selectAll('circle.dot')
	// .attr("style", "z-index: 1;")
	.attr("transform", function(d) { 
		return "translate(" + x(new Date(Date.parse(d.data.timestamp))) + "," + linedict[d.name].line.y()(d.data) + ")"; }
	);
}
		

	});
};
var themainfunc = graph();