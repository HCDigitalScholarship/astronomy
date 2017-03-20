// Various accessors that specify the dimensions of data to svgualize.
function x(d) { return d.xPos; }
function y(d) { return d.yPos; }
function size(d) {
    var sizeScale = d3.scale.linear().domain([0, 11.2]).range([4, 70]);
    return sizeScale(d.size);
}
function radius(d) { return d.number; }
function color(d) { return d.region; }
function key(d) { return d.name; }
function magnitude(d) { return d.magnitude; }
function imageURL(d) {return d.image; }
function caption(d) {return d.caption; }


// Chart dimensions.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 0},
    width = 850 - margin.right,
    height = 500 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.linear().domain([0, 1]).range([0, width]),
    yScale = d3.scale.linear().domain([0, 1]).range([height, 0]),
    radiusScale = d3.scale.pow().exponent(.2).domain([0, 319000000]).range([0, 250]),
    colorScale = d3.scale.category20();

// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(0),
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(0);

// Create the SVG container and set the origin.
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the y-axis.
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

/*
// Add an x-axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("X-Axis");


// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Y-Axis");
*/

// Add the year label.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 16)
    .attr("x", width)
    .text(1600);

d3.json("telescope_text.json", function(teleData) {

  var bisect = d3.bisector(function(d) { return d[0]; });

  var titles = d3.select("#toolName")
      .data(interpolateTeleData(1600))
      .html(function(d) {return d.title ; });

  var texts = d3.select("#description")
      .data(interpolateTeleData(1600))
      .html(function(d) {return '<p>' + d.text + '</p>'; });

  function interpolateTeleData (year) {
    return teleData.map(function(d) {
      return {
        title: interpolateText(d.title, year),
        text: interpolateText(d.text, year)
      };
    });   
  }

  function interpolateText(texts, year) {
    var i = bisect.left(texts, year, 0, texts.length);
    if (i != 0) { i -= 1; }
    var a = texts[i];
    return a[1];
  }

  function changeText(textObj) {
    textObj. html(function(d) {return d.text});
  }

  function changeTitle(textObj) {
    textObj. html(function(d) {return d.title});
  }



    // Load the data.
  d3.json("test_data_image.json", function(testData) {


    d3.ns.qualify("xlink:href");
      
      var pattern = svg.append("defs")
        .selectAll(".URL")
          .data(interpolateData(1600))
        .enter().append("pattern")
          .attr("class", "URL")
          .attr("id", function(d) { return d.name; })
          .attr("x", function(d) { return xScale(x(d)) - size(d); })
          .attr("y", function(d) { return yScale(y(d)) - size(d); })
          .attr("width", function(d) {return size(d)*2;})
          .attr("height", function(d) {return size(d)*2;})
          .attr("patternUnits", "userSpaceOnUse")
        .append("image")
          .attr("xlink:href", function(d) { return d.image; } )
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", function(d) {return size(d)*2;})
          .attr("height", function(d) {return size(d)*2;});

      // Add a dot per nation. Initialize the data at 1600, and set the colors.
      var dot = svg.append("g")
          .attr("class", "dots")
        .selectAll(".dot")
          .data(interpolateData(1600))
        .enter().append("circle")
          .attr("class", "dot")
          .style("fill", function(d) {
            if (typeof(imageURL(d)) == 'undefined') {
                return colorScale(color(d));
            }
            else { return "url(#" + key(d) + ")"; }
          })
          .call(position)
          .sort(order);

      // Add a title.
      dot.append("title")
          .text(function(d) { return d.name; });

      // Add a name to be displayed for each dot.
      var dotNames = svg.append("g")
          .attr("class", "dotNames")
        .selectAll(".dotNames")
          .data(interpolateData(1600))
        .enter().append("text")
          .attr("class", "dotNames")
          .attr("x", function(d) { return xScale(x(d)) - 30; })
          .attr("y", function(d) { return yScale(y(d)) - 8; })
          .text(function(d) { return d.textLabel; })
          .attr("style","font-size: 0.9em; fill:black;");

      // Show number when mouse is on
      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function(d) { 
            if (typeof(caption(d))!="undefined") { return "<span>" + caption(d) +"</span>"; }
            else if (Math.floor(radius(d)) > 1) { return "<span> Number: " + Math.floor(radius(d)) +"</span>"; }
            else { return "<span> Apparent magnitude: " + magnitude(d) +"</span>"; }
          })
          .direction('e');
      svg.data(testData).call(tip);


      // Show and hide the tooltip
      dot.on('mouseover', tip.show)
          .on('mouseout', tip.hide);


      // Add an overlay for the year label.
      var box = label.node().getBBox();

      var overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("x", box.x)
            .attr("y", box.y + 40)
            .attr("width", box.width)
            .attr("height", box.height - 70)
            .on("mouseover", enableInteraction);

      /*
      // Start a transition that interpolates the data based on year.
      svg.transition()
          .duration(30000)
          .ease("linear")
          .tween("year", tweenYear)
          .each("end", enableInteraction);
      */


      // Positions the dots based on data.
      function position(dot) {
        dot .attr("cx", function(d) { return xScale(x(d)); })
            .attr("cy", function(d) { return yScale(y(d)); })
            .attr("r", function(d) { 
                if (typeof(imageURL(d))=="undefined" || radius(d) == 0)
                    {return radiusScale(radius(d)); }
                else if (key(d) == "Saturn+Rings") { return size(d)*1.1; }
                else { return size(d); }
            })
            .attr("opacity", function(d) {
                if (typeof(imageURL(d))=="undefined")
                    { return 0.7; }
                else { return 1.0; }
            });
      }

      function showLabel(dotName) {
        dotName .text(function(d) {return d.textLabel});
      }

      // Defines a sort order so that the smallest dots are drawn on top.
      function order(a, b) {
        return radius(b) - radius(a);
      }

      // After the transition finishes, you can mouseover to change the year.
      function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([1600, 1900])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);

        // Cancel the current transition, if any.
        svg.transition().duration(0);

        overlay
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
          label.classed("active", true);
        }

        function mouseout() {
          label.classed("active", false);
        }

        function mousemove() {
          displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
      }

      // Tweens the entire chart by first tweening the year, and then the data.
      // For the interpolated data, the dots and label are redrawn.
      function tweenYear() {
        var year = d3.interpolateNumber(1600, 1900);
        return function(t) { displayYear(year(t)); };
      }

      // Updates the display to show the specified year.
      function displayYear(year) {
        dot.data(interpolateData(Math.round(year)), key).call(position).sort(order);
        label.text(Math.round(year));
        dotNames.data(interpolateData(Math.round(year)), key).call(showLabel);

        // Updates texts in sidebar.
        titles.data(interpolateTeleData(year), key).call(changeTitle);
        texts.data(interpolateTeleData(year), key).call(changeText);
        if ( year >= 1842 && year < 1847) {
          document.getElementById("description").style.height = "285px";
        }
        else {
          document.getElementById("description").style.height = "350px";
        }
      }

      // Interpolates the dataset for the given (fractional) year.
      function interpolateData(year) {
        return testData.map(function(d) {
            return {
              xPos: d.xPos,
              yPos: d.yPos,
              name: d.name,
              size: d.size,
              region: d.region,
              number: interpolateValues(d.number, year),
              textLabel: setLabel(d.name, d.number, year),
              magnitude: d.magnitude,
              image: d.image,
              caption: d.caption
            };
        });
      }

      function setLabel(name, value, year) {
        if (interpolateValues(value, year) >= 1) { return name; }
        else { return ""; }
      }


      // Finds (and possibly interpolates) the value for the specified year.
      function interpolateValues(values, year) {
        var i = bisect.right(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
          var b = values[i - 1],
              t = (year - a[0]) / (b[0] - a[0]);
          if (b[1] == 0) { return 0; }
          else { return a[1] * (1 - t) + b[1] * t; }
        }
        return a[1];
      }


    // Add the slider

    var sliderContainer = d3.select("#slider-time"),
        margin = {right: 50, left: 30},
        width = sliderContainer.attr("width") - margin.left - margin.right,
        height = sliderContainer.attr("height");

    var xSlider = d3.scale.linear()
        .domain([0, 300])
        .range([0, width])
        .clamp(true);

    var slider = sliderContainer.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + margin.left + "," + height / 5 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", xSlider.range()[0])
        .attr("x2", xSlider.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
      .call(d3.behavior.drag()
        .on("dragstart", function() { slider.interrupt(); })
        .on("drag", function() { update(xSlider.invert(d3.event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 23 + ")")
      .selectAll("text")
      .data(xSlider.ticks(10))
      .enter().append("text")
        .attr("x", xSlider)
        .attr("text-anchor", "middle")
        .text(function(d) { return d + 1600; })
        .style('fill', '#ddd');

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    function update(h) {
      handle.attr("cx", xSlider(h));
      displayYear(h + 1600);
    }

  });
});
