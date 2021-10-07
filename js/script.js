/*

    PROJECT NAME: 'EMPIRES' PODCASAT VISUAL
    CREATED BY: JAMES BAYLISS
    CREATED BETWEEN: APRIL 2020 -> JUNE 2020
    TECHNOLOGIES USED: d3 v5, JS, JQuery, HTML5, CSS3

    USEFUL LINKS:
    
    D3 Focus+Context charts
    https://bl.ocks.org/emilyinamillion/fc1593aea93089bab61b2c71ef2e9544
    http://bl.ocks.org/sebg/581e23a26c1074b9865e878873e880b3
    https://observablehq.com/@d3/focus-context
*/

/*
    NAME:
    DESCRIPTION:
    ARGUMENTS TAKEN:
    ARGUMENTS RETURNED:
    CALLED FROM: 
    CALLS: 
*/

/* var color = d3.scaleOrdinal(d3.schemeCategory10); */ // https://github.com/d3/d3-scale-chromatic/blob/master/README.md
/* ALEPH INSTIGHTS INSPIRED - FROM 06/05/20 */
// color[continents.indexOf(HyphenToSpace(X))]
var color = [
  "#5F8AC7",
  "#9F86C0",
  "#E5BEED",
  "#FE938C",
  "#A6D8D4",
  "#94C9A9",
  "#C6ECAE",
];

var srcbandWidth = 0;

/* 
    Africa
    Asia
    Central America
    Europe
    Middle East
    North America
    South America
 */
var continents = [
  "Africa",
  "Asia",
  "Central America",
  "Europe",
  "Middle East",
  "North America",
  "South America",
];

var tokeep = [
  "Africa",
  "Asia",
  "Central America",
  "Europe",
  "Middle East",
  "North America",
  "South America",
];

// margin set for main focus visual
var margin = {
  left: 25,
  right: 25,
  top: 300,
  bottom: 50,
};

// margin set for secondary context visual
var margin2 = {
  left: 25,
  right: 25,
  top: 0,
  bottom: 50,
};

// Setup isScrolling variable
var xAxisOffset = 100;
var chapterNumber = 0;
var myVar;
var lineCount = 0;
var isScrolling;
var globalMax = -1;
var mainGradient;
var idleTimeout;
var extent = null;
var fullData = [];
var svgDefs;
var colourise = false;
var sort = false;
var sortField = "Empire";
var sortMechanisms = ["Empire", "Length", "Start"];
var dataToUse = [];
var y;
var yAxis;
var x;
var xAxis;
var y2;
var yAxis2;
var x2;
var xAxis2;
var y3;
var empirePolygon;
var context, /* storyContext,  */ focus;
var storyContext = d3.selectAll(".divVisualBaseStatic");
var svg;
var xDomainSrc = [];
var empireLineData = [];
var legendyMini, legendxMini;
var visualWidth = document.getElementById("visual").clientWidth;
var width = visualWidth - margin.left - margin.right;
var height = 3250 - margin.top - margin.bottom;
var height2 = 210;
/* var tooltip; */
var selection /*  = d3.event.selection */;
var tickClickCounter = 0;

var brush = d3
  .brushX() // Add the brush feature using the d3.brush function
  .extent([
    [0, 0],
    [width - margin2.left, height2],
  ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  .on("brush", updateClose) // Each time the brush handle is released to end brushing changes, trigger the 'updateClose' function
  .on("end", brushed); // Each time the brush selection changes, trigger the 'brushed' function

var empirePolygon_lineFunction_Legend = d3
  .line()
  .x(function (d) {
    return legendxMini(d.x);
  })
  .y(function (d) {
    return legendyMini(d.y);
  })
  .curve(d3.curveLinear);

var empirePolygon_lineFunction_Linear = d3
  .line()
  .x(function (d) {
    return x(d.x);
  })
  .y(function (d) {
    return yMini(d.y);
  })
  .curve(d3.curveLinear);

var empirePolygon_lineFunction_Curved = d3
  .line()
  .x(function (d) {
    return x(d.x);
  })
  .y(function (d) {
    return yMini(d.y);
  })
  .curve(d3.curveMonotoneX);

var story = [
  /* 
    { start: -3000, end: 2500, hightlight: [0], title: "Chapter 0", chapter: "Story/Podcast introduction. " },
    { start: 0, end: 1900, hightlight: [1], title: "Chapter 1", chapter: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis ac magna sed placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum convallis lacus tincidunt mattis porttitor. Donec malesuada facilisis fermentum. Proin pharetra ligula sit amet enim vulputate, venenatis aliquet diam posuere. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras condimentum consectetur quam, vitae viverra purus ultricies a. Morbi gravida arcu fermentum elit ornare consequat. Integer eget nisl maximus, dapibus nibh sit amet, commodo nisl. Praesent vitae risus id nibh tincidunt tincidunt congue vulputate justo. Integer euismod tortor id nulla posuere iaculis. Nunc ut diam ut augue eleifend lobortis iaculis gravida odio. Morbi quis imperdiet nisi. " },
    { start: 1950, end: 1976, hightlight: [25], title: "Chapter 2", chapter: "Ut ultrices scelerisque sapien, eget porta dui tempor sed. Praesent at sapien ac sapien condimentum eleifend. Integer lectus orci, sollicitudin fermentum felis in, fringilla cursus elit. Vivamus sit amet mollis sapien. Proin sit amet eros eget mi ultrices viverra consectetur a mi. In vel justo eget odio porta consectetur eu id magna. Fusce ac nisl auctor, ultrices risus vitae, faucibus nibh. Etiam sollicitudin arcu nec purus consequat dictum. Phasellus placerat quis arcu id iaculis. Aliquam dui eros, aliquet nec tristique in, mollis vel nisi. Suspendisse nisl nulla, sodales ac ultrices ut, bibendum eget sem. Donec tempus tellus eu arcu cursus ornare. Fusce eu ipsum eu eros ullamcorper sodales. Duis sollicitudin leo dolor, non finibus sapien egestas vitae. Integer venenatis ipsum in scelerisque placerat. Integer fermentum consequat accumsan. " },
    { start: 0, end: 1900, hightlight: [10], title: "Chapter 3", chapter: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis ac magna sed placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum convallis lacus tincidunt mattis porttitor. Donec malesuada facilisis fermentum. Proin pharetra ligula sit amet enim vulputate, venenatis aliquet diam posuere. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras condimentum consectetur quam, vitae viverra purus ultricies a. Morbi gravida arcu fermentum elit ornare consequat. Integer eget nisl maximus, dapibus nibh sit amet, commodo nisl. Praesent vitae risus id nibh tincidunt tincidunt congue vulputate justo. Integer euismod tortor id nulla posuere iaculis. Nunc ut diam ut augue eleifend lobortis iaculis gravida odio. Morbi quis imperdiet nisi. " }
 */
];

window.onresize = reportWindowSize;
window.onpaint = preloadFunc();

/*
    NAME: preloadFunc
    DESCRIPTION: initial PRELOAD function to handle some operations before loading page
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: script.js
    CALLS: alertSize
*/
function preloadFunc() {
  alertSize();

  // modify button style and labeing based on small window width
  if (vis.width < 1200) {
    d3.selectAll(".btn.filter")
      .text(function () {
        var str = this.value;

        if (this.id.indexOf("-") != -1) {
          var ind = this.id.indexOf("-");
          str =
            this.id.substr(0, 1) +
            ". " +
            this.id.substr(ind + 1, this.id.length - 1);
        }
        return HyphenToSpace(str);
      })
      .style("opacity", 1.0);
  } else {
    d3.selectAll(".btn.filter").style("opacity", 1.0);
  }

  return;
} // end function preloadFunc

/*
    NAME:onload
    DESCRIPTION: initial function called by DOM body at point of page load
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: index.html
    CALLS:  pageVisualSetup();
            loadData();
*/
function onload() {
  // call function to load CSV data file
  loadData();

  // call function to make basic page dimension formatting
  pageVisualSetup();

  return;
} // end function onload

/*
    NAME: loadData
    DESCRIPTION: function to load data and add additional value-added information
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: onload
    CALLS: drawChart
*/
function loadData() {
  // load CSV data file
  d3.csv("data/data.csv")
    .then(function (data) {
      console.log("data");
      console.log(data);

      // for each data row ... process and add infomation needed
      data.forEach(function (d) {
        //   console.log(d);

        d.FID = +d.FID;
        d.Length = +d.Length;
        d.Start = +d.Start;
        d.End = +d.End;

        d.heightArea = +d.heightArea;
        d.heightYear = +d.heightYear;
        d.percHeightYear = ((d.heightYear - d.Start) / (d.End - d.Start)) * 100;
        d.pop0 = +d.pop0;
        d.pop25 = +d.pop25;
        d.pop50 = +d.pop50;
        d.pop75 = +d.pop75;
        d.pop100 = +d.pop100;

        d.yearpop25 = d.Start + (d.End - d.Start) * 0.25;
        d.yearpop50 = d.Start + (d.End - d.Start) * 0.5;
        d.yearpop75 = d.Start + (d.End - d.Start) * 0.75;

        // polygon line coordinates
        d.empireLineData = [
          /* top half */
          { x: d.Start, y: d.pop0 },
          { x: d.yearpop25, y: d.pop25 },
          { x: d.yearpop50, y: d.pop50 },
          { x: d.yearpop75, y: d.pop75 },
          { x: d.End, y: d.pop100 },

          /* bottom half */
          { x: d.End, y: 0 },
          { x: d.yearpop75, y: 0 },
          { x: d.yearpop50, y: 0 },
          { x: d.yearpop25, y: 0 },
          { x: d.Start, y: 0 },
          { x: d.Start, y: d.pop0 },
        ];
      });

      // create an array of key, value objects

      globalMax = d3.max([
        (maxpop0 = d3.extent(
          data.map(function (item) {
            return item.pop0;
          })
        )[1]),
        (maxpop25 = d3.extent(
          data.map(function (item) {
            return item.pop25;
          })
        )[1]),
        (maxpop50 = d3.extent(
          data.map(function (item) {
            return item.pop50;
          })
        )[1]),
        (maxpop75 = d3.extent(
          data.map(function (item) {
            return item.pop75;
          })
        )[1]),
        (maxpop100 = d3.extent(
          data.map(function (item) {
            return item.pop100;
          })
        )[1]),
      ]);

      // save copy of full data to use elsewhere
      console.log(data);
      fullData = data;

      // call function to initially draw chart
      drawChart(fullData);
    })
    .catch(function (error) {
      console.log(error);
    });

  return;
} // end function loadData

/*
    NAME: pageVisualSetup
    DESCRIPTION: function to build initial basis for page visual
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: onload
    CALLS: none
*/
function pageVisualSetup() {
  // select DOM div base for building, attach SVG panel and group element
  d3.selectAll(".visualStatic")
    .append("div")
    .attr("class", "divVisualBaseStatic")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

  visualWidth = document.getElementById("visual").clientWidth;

  d3.selectAll(".visual")
    .append("svg")
    .attr("class", "svgVisualBaseStatic")
    .attr("transform", "translate(" + margin2.left + "," + 0 + ")")
    .append("g")
    .attr("class", "svgVisualBaseStatic-G")
    .attr("transform", "translate(" + 0 + "," + 125 + ")");

  // select DOM div base for building, attach SVG panel and group element
  d3.selectAll(".visual")
    .append("svg")
    .attr("class", "svgVisualBase")
    .attr(
      "transform",
      "translate(" + margin.left + "," + /* 125 */ /* 75 */ 100 + ")"
    )
    .append("g")
    .attr("class", "svgVisualBase-G")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

  if (story.length > 0) {
    d3.selectAll(".svgVisualBaseStatic").classed("hidden", true);
    d3.selectAll(".divVisualBaseStatic").classed("hidden", false);

    d3.selectAll(".divVisualBaseStatic")
      .append("p")
      .attr("class", "chapterTitle")
      .text(story[chapterNumber].title);
    d3.selectAll(".divVisualBaseStatic")
      .append("p")
      .attr("class", "chapter")
      .text(story[chapterNumber].chapter);
    d3.selectAll(".divVisualBaseStatic")
      .append("p")
      .attr("class", "chapterNumber")
      .text("[" + (chapterNumber + 1) + "/" + story.length + "]");

    play();
  } else {
    d3.selectAll(".legend").classed("hidden", false);
    d3.selectAll(".controls").classed("hidden", false);

    d3.selectAll(".svgVisualBaseStatic").classed("hidden", false);
    d3.selectAll(".divVisualBaseStatic").classed("hidden", true);
    d3.selectAll(".storyControls").classed("hidden", true);
  }

  return;
} // end function pageVisualSetup

/*
    NAME: peaks
    DESCRIPTION: function make show peaks only or polygons with peaks
    ARGUMENTS TAKEN: fid -  button infomration
    ARGUMENTS RETURNED: none
    CALLED FROM: index.html
    CALLS: none
*/
function peaks(fid) {
  //
  if (d3.select("#" + fid.id).classed("peaks")) {
    d3.select("#" + fid.id).text("Polygons");
    d3.select("#" + fid.id)
      .classed("peaks", false)
      .classed("polygons", true);
    d3.selectAll(".empirePolygon").style("display", "none");

    d3.selectAll(".polygonMarkers")
      /*             .attr("x1", function (d) { return margin2.left + (x2(d.Start) + ((x2(d.End) - x2(d.Start)) / 2)); })
                        .attr("x2", function (d) { return margin2.left + (x2(d.Start) + ((x2(d.End) - x2(d.Start)) / 2)); }) */
      .attr("x1", function (d) {
        return margin2.left + x2(d.heightYear);
      })
      .attr("x2", function (d) {
        return margin2.left + x2(d.heightYear);
      })
      .attr("y1", function (d) {
        return y2(d.Empire) - 1;
      })
      .attr("y2", function (d) {
        return y2(d.Empire) + 2;
      });
  } // end if ...

  //
  else if (d3.select("#" + fid.id).classed("polygons")) {
    d3.select("#" + fid.id).text("Peaks");
    d3.select("#" + fid.id)
      .classed("peaks", true)
      .classed("polygons", false);
    d3.selectAll(".empirePolygon").style("display", "inline");

    d3.selectAll(".polygonMarkers")
      .attr("x1", function (d) {
        return margin2.left + x2(d.Start);
      })
      .attr("x2", function (d) {
        return margin2.left + x2(d.End);
      })
      .attr("y1", function (d) {
        return y2(d.Empire);
      })
      .attr("y2", function (d) {
        return y2(d.Empire);
      });
  }

  return;
} // end function peaks()

/*
    NAME: showAll
    DESCRIPTION: function make any hidden empire polygons and associated HTML buttons visible again if hidden by user
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: index.html
    CALLS: none
*/
function showAll(fid) {
  // make all empire polygons, heightMarkers and ticks visible
  d3.selectAll(".empirePolygonBase").style("opacity", 1.0);
  d3.selectAll(".empirePolygon-G")
    .classed("hidden", false)
    .style("opacity", 1.0);
  d3.selectAll(".polygonMarkers").style("opacity", 1.0);

  d3.selectAll(".tick").style("opacity", 1.0);
  svg.selectAll(".heightMarker").style("opacity", 1.0);

  // make all HTML buttons visuble
  d3.selectAll(".btn.filter")
    .style("opacity", 1.0)
    .classed("filtered", false)
    .classed("btn-outline-light", false)
    .classed("btn-light", true);
  d3.selectAll(".btn.filter")
    .style("border-color", function () {
      return color[continents.indexOf(HyphenToSpace(this.id))];
    })
    .style("background-color", function () {
      return color[continents.indexOf(HyphenToSpace(this.id))];
    });

  tokeep = [
    "Africa",
    "Asia",
    "Central America",
    "Europe",
    "Middle East",
    "North America",
    "South America",
  ];

  var data = fullData;
  change(fid, data);

  return;
} // end function showAll()

/*
    NAME: display_yAxisTicks
    DESCRIPTION: function called if user clicks on a y-axis tick label to display y-axis ticks (helps user read acrossfrom y-axis to polygons)
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: drawChart
    CALLS: none
*/
function display_yAxisTicks(fid) {
  tickClickCounter = 0;

  if (d3.select("#" + fid.id).classed("checked")) {
    d3.select("#" + fid.id).classed("checked", false);
  } else {
    d3.select("#" + fid.id).classed("checked", true);
    /* 
    myFocusWindow = window.open(
      fullData[fid.attributes.value.nodeValue].WikiURL,
      "_blank"
    ); */
  }

  d3.selectAll(".y.axis")
    .selectAll(".tick")
    .style("opacity", function () {
      if (
        d3
          .selectAll(".tick.FID-" + this.attributes.value.nodeValue)
          .classed("checked")
      ) {
        d3.selectAll(
          ".empirePolygon-G.empirePolygon-G-" + this.attributes.value.nodeValue
        ).style("opacity", 1.0);
        d3.selectAll(
          ".polygonMarkers.FID-" + this.attributes.value.nodeValue
        ).style("opacity", 1.0);
        tickClickCounter++;

        return 1.0;
      } else {
        d3.selectAll(
          ".empirePolygon-G.empirePolygon-G-" + this.attributes.value.nodeValue
        ).style("opacity", 0.1);
        d3.selectAll(
          ".polygonMarkers.FID-" + this.attributes.value.nodeValue
        ).style("opacity", 0.1);
        return 0.1;
      }
    });

  if (tickClickCounter == 0) {
    d3.selectAll(".empirePolygon-G").style("opacity", 1.0);
    d3.selectAll(".y.axis").selectAll(".tick").style("opacity", 1.0);
    d3.selectAll(".polygonMarkers").style("opacity", 1.0);
  }

  return;
} // end function display_yAxisTicks

/*
    NAME: outline_fill
    DESCRIPTION: function called to modify polygon display based on if user wants polygons to display outline of fill only
    ARGUMENTS TAKEN: button information
    ARGUMENTS RETURNED: none
    CALLED FROM: index.html
    CALLS: none
*/
function outline_fill(fid) {
  // if has class="fill" , user wants to display polygons as outlines ...
  if (d3.select("#" + fid.id).classed("fill")) {
    d3.select("#" + fid.id).text("Fill");
    d3.select("#" + fid.id)
      .classed("fill", false)
      .classed("outline", true);
    d3.selectAll(".empirePolygon")
      .classed("fill", false)
      .classed("outline", true);
  }

  // if has class="outline" , user wants to display polygons as fills ...
  else if (d3.select("#" + fid.id).classed("outline")) {
    d3.select("#" + fid.id).text("Outline");
    d3.select("#" + fid.id)
      .classed("fill", true)
      .classed("outline", false);
    d3.selectAll(".empirePolygon")
      .classed("fill", true)
      .classed("outline", false);
  }

  return;
} // end function outline_fill

/*
    NAME: colourize
    DESCRIPTION: function called to modify the colour styling of the polygons (stroke colour and fill colour)
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: index.html
    CALLS: none
*/
function colourize() {
  /* IF USER IS GOING TO COLOUR */
  if ((colourise = !colourise)) {
    // modify polygon gradient fill to continent colours
    svg.selectAll(".mainGradient.stop-left").style("stop-color", function () {
      return color[
        continents.indexOf(HyphenToSpace(this.attributes.value.nodeValue))
      ];
    });

    svg.selectAll(".mainGradient.stop-middle").style("stop-color", function () {
      return color[
        continents.indexOf(HyphenToSpace(this.attributes.value.nodeValue))
      ];
    });

    svg.selectAll(".mainGradient.stop-right").style("stop-color", function () {
      return color[
        continents.indexOf(HyphenToSpace(this.attributes.value.nodeValue))
      ];
    });

    // modify classes and text label of button
    d3.selectAll(".btn.coloured")
      .classed("colour", false)
      .classed("decolour", true)
      .text("Decolour");

    // modify stroke colour of empire polygons
    d3.selectAll(".empirePolygon").style("stroke", function (d) {
      return color[continents.indexOf(HyphenToSpace(d.Continent))];
    });

    d3.selectAll(".heightMarker")
      .style("fill", function (d) {
        return color[continents.indexOf(HyphenToSpace(d.Continent))];
      })
      .style("stroke", function (d) {
        return color[continents.indexOf(HyphenToSpace(d.Continent))];
      });

    // modify colour style of continent filter buttons
    d3.selectAll(".btn.filter")
      .style("border-color", function () {
        if (d3.select("#" + this.id).classed("btn-outline-light")) {
          return "none";
        } else {
          return color[continents.indexOf(HyphenToSpace(this.id))];
        }
      })
      .style("background-color", function () {
        if (d3.select("#" + this.id).classed("btn-outline-light")) {
          return "none";
        } else {
          return color[continents.indexOf(HyphenToSpace(this.id))];
        }
      });

    // modify colour style of y-axis tick labels
    d3.selectAll(".y.axis")
      .selectAll(".tick")
      .selectAll("text")
      .style("fill", function (d) {
        var empire = d;
        var continent = "";

        fullData.forEach(function (d, i) {
          var line = d;
          if (empire == line.Empire) {
            continent = line.Continent;
          }
        });

        return color[continents.indexOf(HyphenToSpace(continent))];
      });
  } else {
    /* IF USER IS GOING TO LIGHT GREY */
    // modify polygon gradient fill to continent colours
    svg.selectAll(".mainGradient.stop-left").style("stop-color", function () {
      return "#FFFFFF";
    });

    svg.selectAll(".mainGradient.stop-middle").style("stop-color", function () {
      return "#FFFFFF";
    });

    svg.selectAll(".mainGradient.stop-right").style("stop-color", function () {
      return "#FFFFFF";
    });

    // modify classes and text label of button
    d3.selectAll(".btn.coloured")
      .classed("colour", true)
      .classed("decolour", false)
      .text("Colour");

    // modify colour style of y-axis tick labels
    d3.selectAll(".tick").selectAll("text").style("fill", "#FFFFFF");

    // modify stroke colour of empire polygons
    d3.selectAll(".empirePolygon").style("stroke", function () {
      return "#FFFFFF";
    });

    d3.selectAll(".heightMarker")
      .style("fill", function () {
        return "#FFFFFF";
      })
      .style("stroke", function () {
        return "#FFFFFF";
      });

    // modify colour style of continent filter buttons
    d3.selectAll(".btn.filter")
      .style("border-color", function (d) {
        return "#f8f9fa";
      })
      .style("background-color", function (d) {
        return "#f8f9fa";
      });

    d3.selectAll(".btn.filter.btn-outline-light")
      .style("border-color", function (d) {
        return "#f8f9fa";
      })
      .style("background-color", function (d) {
        return "transparent";
      });
  }

  return;
} // end function colourize

// selection call to display style of floating DIV
d3.selectAll(".storyControls")
  .on("mouseover", function () {
    d3.select(this).classed("visible", true);
  })
  .on("mouseout", function () {
    d3.select(this).classed("visible", false);
  });

/*
    NAME: pathTween
    DESCRIPTION: library function called to tween SVG geometeries. 
    ARGUMENTS TAKEN: - d1: SVG polygon information
                        - precision: precison tolerance to tween to
    ARGUMENTS RETURNED: none
    CALLED FROM: transitionShapes
    CALLS: none

    Mike Bostock pathTween function from http://bl.ocks.org/mbostock/3916621
*/
function pathTween(d1, precision) {
  return function () {
    var path0 = this,
      path1 = path0.cloneNode(),
      n0 = path0.getTotalLength(),
      n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

    // Uniform sampling of distance based on specified precision.
    var distances = [0],
      i = 0,
      dt = precision / Math.max(n0, n1);
    while ((i += dt) < 1) distances.push(i);
    distances.push(1);

    // Compute point-interpolators at each distance.
    var points = distances.map(function (t) {
      var p0 = path0.getPointAtLength(t * n0),
        p1 = path1.getPointAtLength(t * n1);
      return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
    });

    return function (t) {
      return t < 1
        ? "M" +
        points
          .map(function (p) {
            return p(t);
          })
          .join("L")
        : d1;
    };
  };
} // end function pathTween

// selection call to modify domain of mini y axes. Originianlly called fucntion to transtion polygons from shapes to lines.
d3.selectAll(".form-check-input").on("click", function () {
  //transitonGraphType(this);
  transitonAxisType(this);
});

/*
    NAME: transitonGraphType                                        - CURRENTLY UNUSED
    DESCRIPTION: function to transition between geometry shapes
    ARGUMENTS TAKEN: - fid: radio button inormation
    ARGUMENTS RETURNED: none
    CALLED FROM: selection call on radio buttons
    CALLS: none
*/
function transitonGraphType /* transitonAxisType */(fid) {
  // if user selects 'area', display polygons
  if (document.getElementById("area").checked) {
    // select all empire polygons
    svg
      .selectAll(".polygon-G")
      .selectAll(".empirePolygon")
      .transition()
      .duration(1250)
      .attr("d", function (d) {
        // transtion to shape displayed using straight or curved line based on user selection
        if (document.getElementById("curved").checked) {
          return empirePolygon_lineFunction_Curved(d.empireLineData);
        } else if (document.getElementById("straight").checked) {
          return empirePolygon_lineFunction_Linear(d.empireLineData);
        }
      });

    // transition height markers
    svg
      .selectAll(".heightMarker")
      .transition()
      .duration(1250)
      .attr("y1", function (d) {
        return yMini(-100);
      })
      .attr("y2", function (d) {
        return yMini(100);
      });
  }

  // if user selects 'line', display lines
  else if (document.getElementById("line").checked) {
    // select all empire polygons
    svg
      .selectAll(".polygon-G")
      .selectAll(".empirePolygon")
      .transition()
      .duration(1250)
      .attr("d", function (d) {
        var yearpop25 = d.Start + (d.End - d.Start) * 0.25;
        var yearpop50 = d.Start + (d.End - d.Start) * 0.5;
        var yearpop75 = d.Start + (d.End - d.Start) * 0.75;

        empireLineData = [
          /* top half */
          { x: d.Start, y: -d.pop0 },
          { x: d.yearpop25, y: -d.pop25 },
          { x: d.yearpop50, y: -d.pop50 },
          { x: d.yearpop75, y: -d.pop75 },
          { x: d.End, y: -d.pop100 },

          /* bottom half */
          { x: d.End, y: 0 },
          { x: yearpop75, y: 0 },
          { x: yearpop50, y: 0 },
          { x: yearpop25, y: 0 },
          { x: d.Start, y: 0 },
          { x: d.Start, y: -d.pop0 },
        ];

        // transtion to shape displayed using straight or curved line based on user selection
        if (document.getElementById("curved").checked) {
          return empirePolygon_lineFunction_Curved(empireLineData);
        } else if (document.getElementById("straight").checked) {
          return empirePolygon_lineFunction_Linear(empireLineData);
        }
      });

    // transition height markers
    svg
      .selectAll(".heightMarker")
      .transition()
      .duration(1250)
      .attr("y1", function (d) {
        return yMini(-100);
      })
      .attr("y2", function (d) {
        return yMini(0);
      });
  }

  return;
} // end function transitonGraphType

/*
    NAME: drawLegend 
    DESCRIPTION: function to generate legend
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: drawChart
    CALLS: none

    https://thenounproject.com/search/?q=close&i=3318594
    https://thenounproject.com/search/?q=close&i=3318594
   
*/
function drawLegend() {
  // get dimensions of legend DIV for sizing SVG content
  var dimensions = [
    d3.selectAll(".legend").style("width").replace("px", ""),
    d3.selectAll(".legend").style("height").replace("px", ""),
  ];

  // select SVG base
  var legendSVG = d3.selectAll(".legendSVG");
  var svgDefs = legendSVG.append("defs");

  // append icon for opening and closing DIV
  legendSVG
    .append("svg:image")
    .attr("class", "cross closeLegend")
    .attr("id", "cross")
    .attr("xlink:href", "image/openBox.svg")
    .attr("x", dimensions[0] - 32.5)
    .attr("y", 10)
    .attr("width", 30)
    .attr("height", 30)
    .on("click", function () {
      if (d3.selectAll(".legend").classed("closeLegend")) {
        d3.selectAll(".legend")
          .classed("closeLegend", false)
          .classed("openLegend", true);
        d3.selectAll(".legendSVG")
          .selectAll("#cross")
          .attr("xlink:href", "image/openBox.svg");
      } else {
        d3.selectAll(".legend")
          .classed("closeLegend", true)
          .classed("openLegend", false);
        d3.selectAll(".legendSVG")
          .selectAll("#cross")
          .attr("xlink:href", "image/closeBox.svg");
      }
      var sel = d3.selectAll(".legend");
      sel.moveToFront();
      return;
    });

  // append title label for legend
  legendSVG
    .append("g")
    .append("svg:text")
    .attr("transform", "translate(290,190)rotate(270)")
    .style("font-weight", "lighter")
    .attr("class", "titlelegendTitle")
    .text("Legend");

  // define and append mini legend x axis
  legendxMini = d3.scaleLinear().range([10, 235]).domain([10, 235]);
  legendSVG
    .append("g")
    .attr("class", "legendxMini miniAxis")
    .attr("transform", "translate(" + 35 + "," + 125 + ")")
    .call(d3.axisTop(legendxMini).tickFormat(d3.format(".0d")));

  // define and append mini legend y-axis
  legendyMini = d3.scaleLinear().range([-80, 80]).domain([-100, 100]);
  legendSVG
    .append("g")
    .attr("class", "legendyMini miniAxis")
    .attr("transform", "translate(" + 35 + "," + 125 + ")")
    .style("display", "inline")
    .call(d3.axisLeft(legendyMini));

  // hide all mini axes
  d3.selectAll(".miniAxis").style("display", "none");

  // define dummy curve data
  var legendLineData = [
    /* top half */
    { x: 0, y: 0 },
    { x: 75, y: -13 },
    { x: 125, y: -45 },
    { x: 175, y: -68 },
    { x: 235, y: 0 },

    /* bottom half */
    { x: 235, y: 0 },
    { x: 175, y: 0 },
    { x: 125, y: 0 },
    { x: 75, y: 0 },
    { x: 0, y: 0 },
  ];

  // define var for attachign curve <group> element
  var LG = legendSVG
    .append("g")
    .attr("class", "legendCurve-G")
    .attr("transform", "translate(25," + "125" + ")");

  // append clip path to group
  LG.append("clipPath")
    .attr("transform", "translate(25px,100px)")
    .attr("id", "legend_polyClip")
    .append("svg:path")
    .attr("class", "legendpolyClip")
    .attr("d", empirePolygon_lineFunction_Legend(legendLineData));

  // append text labels to group
  LG.append("svg:text")
    .attr(
      "transform",
      "translate(" + legendxMini(175) + "," + legendyMini(-75) + ")"
    )
    .attr("class", "legendHelpLabel")
    .text("Peak Population Year");

  LG.append("svg:text")
    .attr(
      "transform",
      "translate(" + legendxMini(0) + "," + (legendyMini(0) + 25) + ")"
    )
    .attr("class", "legendHelpLabel")
    .style("text-anchor", "start")
    .text("Start of Empire");

  LG.append("svg:line")
    .attr("class", "dateMarker")
    .attr("x1", legendxMini(0))
    .attr("x2", legendxMini(0))
    .attr("y1", 0)
    .attr("y2", 10);

  LG.append("svg:line")
    .attr("class", "dateMarker")
    .attr("x1", legendxMini(legendxMini.domain()[1]))
    .attr("x2", legendxMini(legendxMini.domain()[1]))
    .attr("y1", 0)
    .attr("y2", 10);

  LG.append("svg:text")
    .attr(
      "transform",
      "translate(" +
      legendxMini(legendxMini.domain()[1]) +
      "," +
      (legendyMini(0) + 25) +
      ")"
    )
    .attr("class", "legendHelpLabel")
    .style("text-anchor", "end")
    .text("End of Empire");

  // append curve path
  LG.append("svg:path")
    .attr("class", "filled")
    .attr("clip-path", "url(#legend_polyClip)")
    .attr("transform", "translate(25px,100px)")
    .attr("fill", "none")
    .attr("id", function () {
      var gradientPeak = (200 - 0) / (250 - 0);

      // append exmaple gradient
      mainGradient = svgDefs
        .selectAll("linearGradient")
        .data(legendLineData)
        .enter()
        .append("linearGradient")
        .attr("class", "mainGradient")
        .attr("id", "mainGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      // Create the stops of the main gradient. Each stop will be assigned
      // a class to style the stop using CSS.
      mainGradient
        .append("stop")
        .attr("class", "stop-left")
        .style("stop-color", "#FFF")
        .style("stop-opacity", 0.0)
        .attr("offset", 0);

      mainGradient
        .append("stop")
        .attr("class", "stop-middle")
        .style("stop-color", "#FFF")
        .style("stop-opacity", 1.0)
        .attr("offset", gradientPeak);

      mainGradient
        .append("stop")
        .attr("class", "stop-right")
        .style("stop-color", "#FFF")
        .style("stop-opacity", 0.0)
        .attr("offset", 1);

      d3.selectAll(".filled").style("fill", "url(#mainGradient)");
      return "legendCurve";
    })
    .attr("d", empirePolygon_lineFunction_Legend(legendLineData));

  // append example hight marker line
  LG.append("svg:line")
    .attr("transform", "translate(25px,100px)")
    .attr("clip-path", "url(#legend_polyClip)")
    .attr("class", "legendHeightMarker")
    .attr("x1", 0 + legendxMini(175))
    .attr("x2", 0 + legendxMini(175))
    .attr("y1", 0 + legendyMini(-100))
    .attr("y2", 0 + legendyMini(100));

  return;
} // end function drawLegend()

/*
    NAME: drawControls 
    DESCRIPTION: function to generate controls interface
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: drawChart
    CALLS: none

    https://thenounproject.com/search/?q=close&i=3318594
    https://thenounproject.com/search/?q=close&i=3318594
   
*/
function drawControls() {
  d3.selectAll(".controls")
    .on("click", function () {
      if (d3.selectAll(".controls").classed("closeControls")) {
        d3.selectAll(".controls")
          .classed("closeControls", false)
          .classed("openControls", true);
        d3.selectAll(".controlsSVG")
          .selectAll("#cross")
          .attr("xlink:href", "image/openBox.svg");
      } else {
        d3.selectAll(".controls")
          .classed("closeControls", true)
          .classed("openControls", false);
        d3.selectAll(".controlsSVG")
          .selectAll("#cross")
          .attr("xlink:href", "image/closeBox.svg");
      }

      var sel = d3.selectAll(".controls");
      sel.moveToFront();

      return;
    })

  // append open/close icon
  // d3.selectAll(".controlsSVG")
  //   .append("svg:image")
  //   .attr("class", "cross closeControls")
  //   .attr("id", "cross")
  //   .attr("xlink:href", "image/openBox.svg")
  //   .attr("x", 2.5)
  //   .attr("y", 10)
  //   .attr("width", 30)
  //   .attr("height", 30)

  // append label
  d3.selectAll(".controlsSVG")
    .append("g")
    .append("svg:text")
    .attr("transform", function () {
      return "translate(25,15)rotate(270)";
    })
    .style("font-weight", "lighter")
    .attr("class", "title controlsTitle")
    .text("Change view...");

  return;
} // end function drawControls()

/*
    NAME: updateTickInformation 
    DESCRIPTION: function to extract FID and contient data to update DOM element values, IDs and classes
    ARGUMENTS TAKEN: data - d: data row from file
    ARGUMENTS RETURNED: none
    CALLED FROM: drawChart
    CALLS:  none   
*/
function updateTickInformation(d) {
  var empire = d;
  var continent = "";
  var FID;

  fullData.forEach(function (d) {
    var line = d;
    if (empire == line.Empire) {
      continent = line.Continent;
      FID = line.FID;
    }
  });
  return {
    continent: continent,
    FID: FID,
  };
} // end function updateTickInformation

d3.select("#hideShowBtn").on("click", function () {
  if (d3.select(this).classed("hideMap")) {
    d3.select(this)
      .classed("hideMap", false)
      .classed("showMap", true)
      .text("Show Map");
    d3.select(".svgVisualBaseStatic")
      .transition()
      .duration(1250)
      .style("height", "105px");
    d3.selectAll(".svgVisualBase-G")
      .transition()
      .duration(1250)
      .attr("transform", "translate(0,-250)");
  } else {
    d3.select(this)
      .classed("hideMap", true)
      .classed("showMap", false)
      .text("Hide Map");
    d3.select(".svgVisualBaseStatic")
      .transition()
      .duration(1250)
      .style("height", "350px");
    d3.selectAll(".svgVisualBase-G")
      .transition()
      .duration(1250)
      .attr("transform", "translate(0,0)");
  }
  return;
});

/*
    NAME: drawChart 
    DESCRIPTION: function to intiailly draw chart
    ARGUMENTS TAKEN: data - all data from CSV files
    ARGUMENTS RETURNED: none
    CALLED FROM: loadData
    CALLS:  drawLegend
            drawControls
            alertSize

    https://thenounproject.com/search/?q=close&i=3318594
    https://thenounproject.com/search/?q=close&i=3318594
   
*/
function drawChart(data) {
  // locally store variables relating to SVG groups elements
  svg = d3.selectAll(".svgVisualBase-G");
  svgStatic = d3.selectAll(".svgVisualBaseStatic-G");

  // call functions to draw controls and legends and find key screen dimensions
  drawLegend();
  drawControls();
  alertSize();

  // get width of base DIV on which to build chart
  visualWidth = document.getElementById("visual").clientWidth;

  if (visualWidth < 575) {
    console.log("visualWidth < 575");
    /*     margin.left = 25;
    margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;

    d3.selectAll(".legend").classed("hidden", true);
  } else if (visualWidth < 768) {
    console.log("visualWidth < 768");
    /*     margin.left = 25;
margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;

    d3.selectAll(".legend").classed("hidden", true);
  } else if (visualWidth < 992) {
    console.log("visualWidth < 992");
    /*     margin.left = 25;
margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;
  } else if (visualWidth < 1200) {
    console.log("visualWidth < 1200");
    /*     margin.left = 25;
margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;
  } /*  if (visualWidth >= 1200) */ else {
    console.log("visualWidth >= 1200");
    margin.left = 65;
    margin2.left = 65;
  }

  // update chart width value accordingly
  width = visualWidth - margin.left - margin.right;

  context = svgStatic
    .append("g")
    .attr("class", "context")
    .classed("hidden", function () {
      if (story.length > 0 && vis.width > 575) {
        return true;
      } else {
        return false;
      }
    })
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  /*   d3.selectAll(".visual")
    .append("btn")
    .attr("class", "showAll2 btn btn btn-success")
    .attr("id", "showAll2")
    .attr("value", "showAll2")
    .style("right", margin2.right * 3 + "px")
    .text("Show All")
    .on("click", function () {
      showAll(this);
      return;
    }); */
  /*   d3.selectAll(".visual")
    .append("btn")
    .attr("class", "hideShow btn btn btn-success hideMap")
    .attr("id", "hideShowBtn")
    .attr("value", "hideShow")
    .style("right", margin2.right + "px")
    .text("Hide Map"); */
  // .on("click", function () {
  //   if (d3.select(this).classed("hideMap")) {
  //     d3.select(this)
  //       .classed("hideMap", false)
  //       .classed("showMap", true)
  //       .text("Show Map");
  //     d3.select(".svgVisualBaseStatic")
  //       .transition()
  //       .duration(1250)
  //       .style("height", "105px");
  //     d3.selectAll(".svgVisualBase-G")
  //       .transition()
  //       .duration(1250)
  //       .attr("transform", "translate(0,-250)");
  //   } else {
  //     d3.select(this)
  //       .classed("hideMap", true)
  //       .classed("showMap", false)
  //       .text("Hide Map");
  //     d3.select(".svgVisualBaseStatic")
  //       .transition()
  //       .duration(1250)
  //       .style("height", "350px");
  //     d3.selectAll(".svgVisualBase-G")
  //       .transition()
  //       .duration(1250)
  //       .attr("transform", "translate(0,0)");
  //   }
  //   return;
  // });

  focus = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");

  // append clip paths to SVG panel
  svgDefs = focus.append("defs");
  focus
    .append("clipPath")
    .attr("id", "mainVisualClip")
    .append("svg:rect")
    .attr("id", "mainVisualClipRect")
    .attr("x", 0)
    .attr("y", -xAxisOffset)
    .attr("width", width - margin.left)
    .attr(
      "height",
      height +
      margin.top +
      margin.bottom +
      xAxisOffset +
      xAxisOffset +
      xAxisOffset
    );

  // set up selction option on sort option buttons
  d3.selectAll(".btn.sort").on("click", function () {
    var data = fullData.filter(function (d) {
      return tokeep.indexOf(d.Continent) >= 0;
    });

    /* console.log(this); */
    d3.selectAll(".btn.sort")
      .classed("selectedSortOrder", false)
      .classed("btn-primary", false)
      .classed("btn-secondary", true);
    d3.selectAll(".btn.sort." + this.id)
      .classed("selectedSortOrder", true)
      .classed("btn-secondary", false)
      .classed("btn-primary", true);

    change(this, data);
  });

  // set up selection option on filter option buttons
  d3.selectAll(".btn.filter")
    .on("click", function () {
      // locally store selected filter button as variable. modify classes according to selection/deselction
      var oneBar = d3.select(this);
      oneBar
        .classed("btn-outline-light", !oneBar.classed("btn-outline-light"))
        .classed("btn-light", !oneBar.classed("btn-light"));

      // if button filter was turned on (i.e. user decided to filter out of display selected continent)...
      if (oneBar.classed("btn-outline-light")) {
        tokeep.splice(tokeep.indexOf(this.value), 1);

        d3.selectAll(".polygonMarkers." + this.id).style("opacity", 0.1);
        d3.selectAll(".empirePolygon." + this.id).style("opacity", 0.1);
        d3.selectAll(".tick." + SpaceToHyphen(this.id)).style("opacity", 0.1);
        svg
          .selectAll(".heightMarker." + SpaceToHyphen(this.id))
          .style("opacity", 0.1);

        oneBar
          .style("border-color", function () {
            return "#f8f9fa";
          })
          .style("background-color", function () {
            return "transparent";
          });
      }

      // if button filter was turned on (i.e. user decided to filter IN to display selected continent)...
      else {
        tokeep.push(this.value);

        d3.selectAll(".polygonMarkers." + this.id).style("opacity", 1.0);
        d3.selectAll(".empirePolygon." + this.id).style("opacity", 1.0);
        d3.selectAll(".tick." + SpaceToHyphen(this.id)).style("opacity", 1.0);
        svg
          .selectAll(".heightMarker." + SpaceToHyphen(this.id))
          .style("opacity", 1.0);
        oneBar
          .style("border-color", function () {
            return color[continents.indexOf(HyphenToSpace(this.id))];
          })
          .style("background-color", function () {
            return color[continents.indexOf(HyphenToSpace(this.id))];
          });
      }

      var data = fullData.filter(function (d) {
        return tokeep.indexOf(d.Continent) >= 0;
      });

      change(/* d3.selectAll(".showAll") */ this, data);
    })
    .style("border-color", function () {
      return color[continents.indexOf(HyphenToSpace(this.id))];
    })
    .style("background-color", function () {
      return color[continents.indexOf(HyphenToSpace(this.id))];
    });

  //define main x axis
  x = d3
    .scaleLinear()
    .range([0, width - margin.left])
    .domain([
      Math.floor(
        d3.min(data, function (d) {
          return d.Start;
        }) / 500
      ) * 500,
      Math.ceil(
        d3.max(data, function (d) {
          return d.End;
        }) / 500
      ) * 500,
    ]);

  //define main x2 axis
  x2 = d3
    .scaleLinear()
    .range([0, width - margin.left])
    .domain([
      Math.floor(
        d3.min(data, function (d) {
          return d.Start;
        }) / 500
      ) * 500,
      Math.ceil(
        d3.max(data, function (d) {
          return d.End;
        }) / 500
      ) * 500,
    ]);

  // store as global variable the domain extent of the x axis
  xDomainSrc = x.domain();

  // append main x axis
  focus
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(
      d3.axisTop(x).tickFormat(function (d, i) {
        var str = "";

        if (d < 0) {
          str = Math.abs(d) + " BC";
        } else {
          str = d + " AD";
        }

        if (visualWidth > 575) {
          return str;
        } else {
          return i % 2 !== 0 ? " " : str;
        }
      })
    );

  // draw tick grid lines extending from y-axis ticks on axis across scatter graph
  var xticks = focus.selectAll(".x.axis").selectAll(".tick");
  xticks
    .append("svg:line")
    .attr("class", "xAxisTicks")
    .attr("y0", 0)
    .attr("y1", height + xAxisOffset + xAxisOffset)
    .attr("x1", 0)
    .attr("x2", 0)
    .style("opacity", 0.1);

  // define main y-axis
  y = d3
    .scaleBand()
    .range([0, height])
    .paddingInner(0.0)
    .paddingOuter(0)
    .domain(
      fullData.map(function (d) {
        return d.Empire;
      })
    );

  // append main y-axis
  focus
    .append("g")
    .attr("class", "y axis")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top + xAxisOffset) + ")"
    )
    .call(d3.axisLeft(y));

  x2.domain(x.domain());

  context
    .append("g")
    .attr("class", "context_XAxis")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
    .call(
      d3.axisTop(x2).tickFormat(function (d, i) {
        var str = "";

        if (d < 0) {
          str = Math.abs(d) + " BC";
        } else {
          str = d + " AD";
        }

        if (visualWidth > 575) {
          return str;
        } else {
          return i % 2 !== 0 ? " " : str;
        }
      })
    );

  xticks = context.selectAll(".context_XAxis").selectAll(".tick");
  xticks
    .append("svg:line")
    .attr("class", "context_xAxisTicks")
    .attr("y0", 0)
    .attr("y1", height2)
    .attr("x1", 0)
    .attr("x2", 0)
    .style("opacity", 0.1)
    .style("stroke", "#FFF")
    .style("stroke-width", 1)
    .style("fill", "#FFF");

  y2 = d3.scaleBand().rangeRound([0, height2]).padding(0.0);

  y2.domain(y.domain());

  context
    .append("g")
    .attr("class", "context_YAxis")
    .attr("transform", "translate(" + margin2.left + "," + 0 + ")")
    .style("display", "none")
    .call(d3.axisLeft(y2));

  var polygonMarkersG = context.append("g").attr("class", "polygonMarkers-G");
  polygonMarkersG
    .selectAll(".polygonMarkers")
    .data(fullData)
    .enter()
    .append("line")
    .attr("class", function (d) {
      return (
        "polygonMarkers" +
        " " +
        SpaceToHyphen(d.Continent) +
        " " +
        SpaceToHyphen(d.Empire) +
        " FID-" +
        d.FID
      );
    })
    .attr("id", function (d) {
      return "polygonMarker-" + d.FID;
    })
    .attr("value", function (d) {
      return d.FID;
    })
    .attr("x1", function (d) {
      return margin2.left + x2(d.Start);
    })
    .attr("x2", function (d) {
      return margin2.left + x2(d.End);
    })
    .attr("y1", function (d) {
      return y2(d.Empire);
    })
    .attr("y2", function (d) {
      return y2(d.Empire);
    })
    .style("stroke-width", 1.5)
    .style("stroke", function (d) {
      return color[continents.indexOf(HyphenToSpace(d.Continent))];
    })
    .style("fill", function (d) {
      return color[continents.indexOf(HyphenToSpace(d.Continent))];
    });

  // append vertical X=0 reference line
  context
    .append("line")
    .attr("class", "zeroLine")
    .attr("x1", margin2.left + x2(0) + 0.75)
    .attr("y1", margin2.top)
    .attr("x2", margin2.left + x2(0) + 0.75)
    .attr(
      "y2",
      height2 + margin2.top
    ); /* 

  // append vertical X=0 reference line
  focus
    .append("line")
    .attr("class", "zeroLine")
    .attr("clip-path", "url(#mainVisualClip)")
    .attr("x1", margin.left + x(0) + 0.75)
    .attr("y1", margin.top - 6)
    .attr("x2", margin.left + x(0) + 0.75)
    .attr("y2", height + margin.top + xAxisOffset + xAxisOffset); */

  // select y-axis ticks and handle user mouse interaction with label.
  focus
    .selectAll(".y.axis")
    .selectAll(".tick")
    .on("click", function () {
      display_yAxisTicks(this);
    });

  // dynamically define the value , ID and class attached to each tick
  var yticks = focus
    .selectAll(".y.axis")
    .selectAll(".tick")
    .attr("value", function (d) {
      var values = updateTickInformation(d);
      return values.FID;
    })
    .attr("id", function (d) {
      var values = updateTickInformation(d);
      return (
        "tick" + "-" + SpaceToHyphen(values.continent) + "-FID-" + values.FID
      );
    })
    .attr("class", function (d) {
      var values = updateTickInformation(d);
      return (
        "tick" + " " + SpaceToHyphen(values.continent) + " FID-" + values.FID
      );
    });

  // modify text anchoring of y-axis labelling based on display width
  focus
    .selectAll(".y.axis")
    .selectAll(".tick")
    .selectAll("text")
    .attr("x", function () {
      if (visualWidth < 575) {
        return 10;
      } else if (visualWidth < 768) {
        return 10;
      } else if (visualWidth < 992) {
        return 10;
      } else if (visualWidth < 1200) {
        return 10;
      } /*  if (visualWidth >= 1200) */ else {
        return -10;
      }
    })
    .style("text-anchor", function () {
      if (visualWidth < 575) {
        return "start";
      } else if (visualWidth < 768) {
        return "start";
      } else if (visualWidth < 992) {
        return "start";
      } else if (visualWidth < 1200) {
        return "start";
      } /*  if (visualWidth >= 1200) */ else {
        return "end";
      }
    })
    .style("fill", function (d) {
      var empire = d;
      var continent = "";

      fullData.forEach(function (d, i) {
        var line = d;
        if (empire == line.Empire) {
          continent = line.Continent;
        }
      });

      return color[continents.indexOf(HyphenToSpace(continent))];
    });

  // append and hide chart wide ticks.
  yticks
    .append("svg:line")
    .attr("class", "yAxisTicks hide")
    .attr("y0", 0)
    .attr("y1", 0)
    .attr("x1", 0)
    .attr("x2", width - margin.left);

  // append group element to attach mainVisualClip clippath
  focus
    .append("g")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top + xAxisOffset) + ")"
    )
    .attr("clip-path", "url(#mainVisualClip)")
    .attr("class", "polygon-G");

  // use file data to attach individual group elements to base polygon group for each empire.
  focus
    .selectAll(".polygon-G")
    .selectAll(".empirePolygon-G")
    /* .data(data) */
    .data(fullData)
    .enter()
    .append("g")
    .attr("class", function (d) {
      return (
        "empirePolygon-G empirePolygon-G-" +
        d.FID +
        " " +
        SpaceToHyphen(d.Continent)
      );
    })
    .attr("transform", function (d) {
      return "translate(0," + (y(d.Empire) - 50 + y.bandwidth() / 2) + ")";
    });

  srcbandWidth = y.bandwidth();

  // define min y axes to attach to each empirep =olygon group
  yMini = d3.scaleLinear().range([0, 50]).domain([globalMax, 0]);

  // append group element to append min y-axis.
  focus
    .selectAll(".empirePolygon-G")
    .append("g")
    .attr("class", "yMini axis")
    .attr("transform", function (d) {
      return "translate(" + x(d.Start) + "," + 0 + ")";
    })
    .call(d3.axisLeft(yMini).ticks(2).tickFormat(d3.format(".0d")));

  // append polygon-level clip path to plygon group.
  // clippath is exact shape of visible polygon. helps to clip height marker to polygon geometry
  focus
    .selectAll(".empirePolygon-G")
    .append("clipPath")
    .attr("id", function (d) {
      return "polyClip-" + d.FID;
    })
    .attr("class", "polyClip")
    .append("svg:path")
    .attr("class", "polyClip")
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  // append SVG PATH to individual polygon path
  focus
    .selectAll(".empirePolygon-G")
    .append("svg:path")
    .on("click", function (d) {
      window.open(d.WikiURL, "_blank");
    })
    .attr("clip-path", function (d) {
      return "url(#polyClip-" + d.FID + ")";
    })
    .attr("transform", "translate(0," + 0 + ")")
    .attr("class", function (d) {
      return (
        "fill empirePolygon empirePolygonBase empirePolygonBase-" +
        d.FID +
        " " +
        SpaceToHyphen(d.Continent)
      );
    })
    .style("stroke", function (d) {
      return color[continents.indexOf(HyphenToSpace(d.Continent))];
    })
    .attr("id", function (d) {
      // define polygon-level gradient, specific to empire
      mainGradient = svgDefs
        .append("linearGradient")
        .attr("class", function () {
          return "mainGradient-" + d.FID + " " + SpaceToHyphen(d.Continent);
        })
        .attr("value", function () {
          return SpaceToHyphen(d.Continent);
        })
        .attr("id", "mainGradient-" + d.FID)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      // Create the stops of the main gradient. Each stop will be assigned
      // a class to style the stop using CSS.
      mainGradient
        .append("stop")
        .attr("class", "mainGradient stop-left stop-left-" + d.FID)
        .attr("value", function () {
          return SpaceToHyphen(d.Continent);
        })
        .style("stop-color" /* , "#FFFFFF") */, function () {
          return color[continents.indexOf(HyphenToSpace(d.Continent))];
        })
        .style("stop-opacity", 0)
        .attr("offset", 0);

      mainGradient
        .append("stop")
        .attr("class", "mainGradient stop-middle stop-middle-" + d.FID)
        .attr("value", function () {
          return SpaceToHyphen(d.Continent);
        })
        .style("stop-color" /* , "#FFFFFF") */, function () {
          return color[continents.indexOf(HyphenToSpace(d.Continent))];
        })
        .style("stop-opacity", 1.0)
        .attr("offset", d.percHeightYear);

      mainGradient
        .append("stop")
        .attr("class", "mainGradient stop-right stop-right-" + d.FID)
        .attr("value", function () {
          return SpaceToHyphen(d.Continent);
        })
        .style("stop-color" /* , "#FFFFFF") */, function () {
          return color[continents.indexOf(HyphenToSpace(d.Continent))];
        })
        .style("stop-opacity", 0)
        .attr("offset", 1);

      d3.select(this).classed("filled-" + d.FID, true);
      d3.selectAll(".filled-" + d.FID).style(
        "fill",
        "url(#mainGradient-" + d.FID + ")"
      );
      return "empirePolygonBase-base-" + d.FID;
    })
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    })
    .on("mouseover", function (d) {
      var coordinates = getMouseCoordinates(this);

      d3.selectAll(
        ".empirePolygon-G.empirePolygon-G-" +
        d.FID +
        "." +
        SpaceToHyphen(d.Continent)
      )
        .append("g")
        .attr("class", "tooltipG")
        .attr(
          "transform",
          "translate(" + (coordinates.x + 10) + "," + (coordinates.y + 10) + ")"
        )
        .append("rect")
        .attr("class", "tooltipGrect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 300)
        .attr("height", 200);

      var ttwidth = d3.selectAll(".tooltipGrect").attr("width");
      var ttmargin = 25;

      d3.selectAll(".tooltipG")
        .append("text")
        .attr("class", "tooltipText title")
        .attr("x", 25)
        .attr("y", 25)
        .text(d.Empire);
      d3.selectAll(".tooltipG")
        .append("text")
        .attr("class", "tooltipText subtitle")
        .attr("x", 25)
        .attr("y", 50)
        .text(
          d.Continent +
          " (" +
          d.Start +
          " to " +
          d.End +
          ") [" +
          d.Length +
          " years]"
        );
      d3.selectAll(".tooltipG")
        .append("text")
        .attr("class", "tooltipText information")
        .attr("x", 25)
        .attr("y", 75)
        .text(d.Information)
        .call(wrapToolTip, ttwidth - ttmargin * 2, 25);

      d3.selectAll(".tooltipG").attr("transform", function () {
        if (coordinates.x > vis.width / 2) {
          return (
            "translate(" +
            (coordinates.x - d3.selectAll(".tooltipGrect").attr("width") - 10) +
            "," +
            (coordinates.y + 10) +
            ")"
          );
        } else {
          return (
            "translate(" +
            (coordinates.x + 10) +
            "," +
            (coordinates.y + 10) +
            ")"
          );
        }
      });

      var sel = d3.selectAll(
        ".empirePolygon-G.empirePolygon-G-" +
        d.FID +
        "." +
        SpaceToHyphen(d.Continent)
      );
      sel.moveToFront();

      var sel = d3.selectAll(".tooltipG");
      sel.moveToFront();
    })
    .on("mousemove", function () {
      var coordinates = getMouseCoordinates(this);

      d3.selectAll(".tooltipG").attr("transform", function () {
        if (coordinates.x > vis.width / 2) {
          return (
            "translate(" +
            (coordinates.x - d3.selectAll(".tooltipGrect").attr("width") - 10) +
            "," +
            (coordinates.y + 10) +
            ")"
          );
        } else {
          return (
            "translate(" +
            (coordinates.x + 10) +
            "," +
            (coordinates.y + 10) +
            ")"
          );
        }
      });

      var sel = d3.selectAll(".tooltipG");
      sel.moveToFront();
    })
    .on("mouseout", function () {
      d3.selectAll(".tooltipG").remove();
    });

  // attach empire specific marker line
  focus
    .selectAll(".empirePolygon-G")
    .append("svg:line")
    .attr("clip-path", function (d) {
      return "url(#polyClip-" + d.FID + ")";
    })
    .attr("class", function (d) {
      return "heightMarker" + " " + SpaceToHyphen(d.Continent);
    })
    .attr("x1", function (d) {
      return x(d.heightYear);
    })
    .attr("x2", function (d) {
      return x(d.heightYear);
    })
    .attr("y1", function (d) {
      return yMini(0);
    })
    .attr("y2", function (d) {
      return yMini(100);
    })
    .style("fill", function (d) {
      return color[continents.indexOf(HyphenToSpace(d.Continent))];
    })
    .style("stroke", function (d) {
      return color[continents.indexOf(HyphenToSpace(d.Continent))];
    });

  // update brush extent
  brush.extent([
    [0, 0],
    [width - margin2.left, height2],
  ]);

  //modify the brush overlay
  context
    .selectAll(".overlay")
    .attr("x", 0)
    .attr("width", width - margin2.left);

  // Add the brushing
  context
    .append("g")
    .attr("class", "brush")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
    .call(brush);

  // attach closing rect/cross groups to brush
  d3.selectAll(".brush")
    .append("g")
    .attr("transform", function () {
      return "translate(" + 10 + "," + (height2 - 30) + ")";
    })
    .attr("class", "cross-G")
    .style("display", "none")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", 30)
    .attr("rx", 3)
    .attr("ry", 3);

  // attach closing /cross image to cross grouph
  d3.selectAll(".cross-G")
    .append("svg:image")
    .attr("class", "cross")
    .attr("id", "cross")
    .attr("xlink:href", "image/close.svg")
    .attr("x", 5)
    .attr("y", 5)
    .attr("width", 20)
    .attr("height", 20)
    .on("click", function () {
      d3.selectAll(".selection").style("display", "none");
      d3.selectAll(".handle").style("display", "none");
      d3.selectAll(".cross-G").style("display", "none");

      defaultAxis();
      return;
    });

  // modify handles
  d3.selectAll(".handle")
    .attr("width", 5)
    .attr("height", height2 / 2)
    .attr("y", 10)
    .attr("x", 3)
    .attr("rx", 3)
    .attr("ry", 3);

  // append vertical X=0 reference line
  focus
    .append("line")
    .attr("class", "zeroLine")
    .attr("clip-path", "url(#mainVisualClip)")
    .attr("x1", margin.left + x(0) + 0.75)
    .attr("y1", margin.top - 6)
    .attr("x2", margin.left + x(0) + 0.75)
    .attr("y2", height + margin.top + xAxisOffset + xAxisOffset);

  // append proxy rectangle mask
  context
    .append("rect")
    .attr("class", "redBox")
    .attr("id", "redBox")
    .attr("x", margin2.left)
    .attr("y", margin2.top)
    .attr("width", width - margin2.left)
    .attr("height", height2);

  // append proxy rectangle mask
  focus
    .append("rect")
    .attr("class", "redBox")
    .attr("id", "redBox")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", width - margin.left)
    .attr("height", height + xAxisOffset + xAxisOffset);

  return;
} // end function drawChart();

d3.selectAll(".controlButton")
  .on("mouseover", function () {
    d3.selectAll(".controlButton").classed("hover", false);
    d3.select(this).classed("hover", true);
  })
  .on("mouseout", function () {
    d3.selectAll(".controlButton").classed("hover", false);
  })
  .on("click", function () {
    d3.selectAll(".controlButton").classed("hover", false);
    d3.select(this).classed("hover", true);
    if (d3.select(this).classed("play")) {
      play();
    } else if (d3.select(this).classed("pause")) {
      pause();
    } else if (d3.select(this).classed("closeStory")) {
      stop();
    } else if (d3.select(this).classed("stepBack")) {
      stepBack();
    } else if (d3.select(this).classed("stepForward")) {
      stepForward();
    } else if (d3.select(this).classed("replay")) {
      replay();
    }
  });

/*
    NAME: replay 
    DESCRIPTION: function to restart and reply enite story board
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: play button press
    CALLS:  displayChapter
*/
function replay() {
  // d3.selectAll(".divVisualBaseStatic").classed("hidden", false);
  // d3.selectAll(".svgVisualBaseStatic").classed("hidden", true);

  // d3.selectAll(".storyControls").style("width" , "135px");
  // d3.selectAll(".controlButton.set1").style("display" , "inline");
  // d3.selectAll(".controlButton.replay").style("display" , "none");

  chapterNumber = -1;

  setTimeout(function () {
    play();
  }, 250);

  return;
} // end function replat

/*
    NAME: stepBack 
    DESCRIPTION: function to step backwards one chapter view manuually
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: play button press
    CALLS:  displayChapter
*/
function stepBack() {
  chapterNumber--;
  setTimeout(function () {
    displayChapter();
  }, 250);

  return;
} // end function stepBack()

/*
    NAME: stepForward 
    DESCRIPTION: function to step forward one chapter view manuually
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: play button press
    CALLS:  displayChapter
*/
function stepForward() {
  setTimeout(function () {
    chapterNumber++;
    displayChapter();
  }, 250);

  return;
} // end function stepForward()

/*
    NAME: play 
    DESCRIPTION: function to start auto-play visual through story array
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: play button press
    CALLS:  displayChapter
            clearInterval
*/
function play() {
  d3.selectAll(".stepBack").style("visibility", "hidden");
  d3.selectAll(".stepForward").style("visibility", "hidden");
  d3.selectAll(".storyControls").style("width", "125px");

  myVar = setInterval(myTimer, 4000);

  function myTimer() {
    chapterNumber++;
    displayChapter();
    if (chapterNumber == story.length - 1) {
      clearInterval(myVar);

      d3.selectAll(".stepBack").style("visibility", "visible");
      d3.selectAll(".stepForward").style("visibility", "visible");
      d3.selectAll(".replay").style("visibility", "visible");
      d3.selectAll(".closeStory").style("visibility", "visible");
      d3.selectAll(".storyControls").style("width", "345px");
    }
  }

  return;
} // end function play()

/*
    NAME: displayChapter 
    DESCRIPTION: function to display each individual story page
    ARGUMENTS TAKEN: number - page number of story array
    ARGUMENTS RETURNED: none
    CALLED FROM: play
    CALLS: none
*/
function displayChapter() {
  // update focus x domain to story start and end year
  x.domain([story[chapterNumber].start, story[chapterNumber].end]);

  // refresh and transition x axis
  focus
    .selectAll(".x.axis")
    .transition()
    .duration(1250)
    .call(
      d3.axisTop(x).tickFormat(function (d, i) {
        var str = "";

        if (d < 0) {
          str = Math.abs(d) + " BC";
        } else {
          str = d + " AD";
        }

        if (visualWidth > 575) {
          return str;
        } else {
          return i % 2 !== 0 ? " " : str;
        }
      })
    );

  // select and update x axis ticks according to brush change.
  var xticks = focus.selectAll(".x.axis").selectAll(".tick");
  xticks
    .append("svg:line")
    .attr("class", "xAxisTicks")
    .attr("y0", 0)
    .attr("y1", height + xAxisOffset + xAxisOffset)
    .attr("x1", 0)
    .attr("x2", 0)
    .style("opacity", 0.1);

  // select and update zeroLine according to brush change.
  focus
    .selectAll(".zeroLine")
    .transition()
    .duration(1250)
    .attr("x1", margin.left + x(0) + 0.25)
    .attr("x2", margin.left + x(0) + 0.25);

  // select and update heightMarker according to brush change.
  focus
    .selectAll(".heightMarker")
    .transition()
    .duration(1250)
    .attr("x1", function (d) {
      return x(d.heightYear);
    })
    .attr("x2", function (d) {
      return x(d.heightYear);
    });

  // select and update polygon clips according to brush change.
  focus
    .selectAll(".polygon-G")
    .selectAll(".polyClip")
    .transition()
    .duration(1250)
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  var fids = story[chapterNumber].hightlight;

  fids.forEach(function (d, i) {
    d3.selectAll(".empirePolygon.empirePolygonBase").classed(
      "highlighted",
      false
    );

    d3.selectAll(
      ".empirePolygon.empirePolygonBase.empirePolygonBase-" + d
    ).classed("highlighted", true);
  }); // end forEach

  // select and update polygons according to brush change.
  focus
    .selectAll(".empirePolygonBase")
    .transition()
    .duration(1250)
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  d3.selectAll(".chapterTitle").text(story[chapterNumber].title);
  d3.selectAll(".chapter").text(story[chapterNumber].chapter);
  d3.selectAll(".chapterNumber").text(
    "[" + (chapterNumber + 1) + "/" + story.length + "]"
  );

  return;
} /// end function displayChapter

/*
    NAME: pause 
    DESCRIPTION: function to pause story telling
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: pause button press
    CALLS: clearInterval
*/
function pause() {
  d3.selectAll(".stepBack").style("visibility", "visible");
  d3.selectAll(".stepForward").style("visibility", "visible");
  d3.selectAll(".replay").style("visibility", "visible");
  d3.selectAll(".closeStory").style("visibility", "visible");
  d3.selectAll(".storyControls").style("width", "345px");

  clearInterval(myVar);

  return;
} // end function pause()

/*
    NAME: stop 
    DESCRIPTION: function to stop story telling
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: stop button press
    CALLS: clearInterval
*/
function stop() {
  // hide play controls to avoid/prevent any further use
  d3.selectAll(".storyControls").classed(
    "hidden",
    true
  ) /* .style("width" , "70px") */;
  // d3.selectAll(".controlButton.set0")/* .classed("hidden", true) */.style("display" , "none");
  // d3.selectAll(".controlButton")/* .classed("hidden", true) */.style("display" , "inline");
  d3.selectAll(".divVisualBaseStatic").classed("hidden", true);
  d3.selectAll(".svgVisualBaseStatic").classed("hidden", false);

  d3.selectAll(".legend").classed("hidden", false);
  d3.selectAll(".controls").classed("hidden", false);

  // clear timeinterla to stop auto play
  clearInterval(myVar);

  // updte focus x domain to that of full x2 domain
  x.domain(x2.domain());

  focus.selectAll(".x.axis").call(
    d3.axisTop(x).tickFormat(function (d, i) {
      var str = "";

      if (d < 0) {
        /* return */ str = Math.abs(d) + " BC";
      } else {
        /* return */ str = d + " AD";
      }

      if (/* vis.width */ visualWidth > 575) {
        return str;
      } else {
        return i % 2 !== 0 ? " " : str;
      }
    })
  );

  // select and update x axis ticks according to brush change.
  var xticks = focus.selectAll(".x.axis").selectAll(".tick");
  xticks
    .append("svg:line")
    .attr("class", "xAxisTicks")
    .attr("y0", 0)
    .attr("y1", height + xAxisOffset + xAxisOffset)
    .attr("x1", 0)
    .attr("x2", 0)
    .style("opacity", 0.1);

  // select and update zeroLine according to brush change.
  focus
    .selectAll(".zeroLine")
    .attr("x1", margin.left + x(0) + 0.25)
    .attr("x2", margin.left + x(0) + 0.25);

  // select and update heightMarker according to brush change.
  focus
    .selectAll(".heightMarker")
    .attr("x1", function (d) {
      return x(d.heightYear);
    })
    .attr("x2", function (d) {
      return x(d.heightYear);
    });

  // select and update polygon clips according to brush change.
  focus
    .selectAll(".polygon-G")
    .selectAll(".polyClip")
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  // select and update polygons according to brush change.
  focus.selectAll(".empirePolygonBase").attr("d", function (d) {
    return empirePolygon_lineFunction_Linear(d.empireLineData);
  });

  // remove 'highlighted' polygon styling
  d3.selectAll(".empirePolygon.empirePolygonBase").classed(
    "highlighted",
    false
  );

  storyContext.classed("hidden", true);
  context.classed("hidden", false);

  return;
} // end function stop()

/*
    NAME: wrapToolTip 
    DESCRIPTION: function to wrap long lines to defined width. can be used for labels, strings, axis titles etc.
    ARGUMENTS TAKEN:    text - text strong to modify
                        content_width -
                        ttmargin - margin to apply left and right of SVG rect and text
    ARGUMENTS RETURNED: none
    CALLED FROM: drawChart
    CALLS: none
*/
function wrapToolTip(text, content_width, ttmargin) {
  lineCount = 0;
  var lineHeight = 12.5;

  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      y = text.attr("y"),
      dy = 1,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", ttmargin)
        .attr("y", y)
        .attr("dy", dy /* + "em"*/);

    while ((word = words.pop())) {
      line.push(word);

      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > content_width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", ttmargin)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy)
          .text(word);

        lineCount++;
      }
    }
  });

  // update SVG base rect hight based on number of lines being written
  d3.selectAll(".tooltipGrect").attr("height", lineCount * lineHeight + 100);

  return;
} // end function wrap()

/*
    NAME: getMouseCoordinates 
    DESCRIPTION: function to ascertain pixel coordinates of mouse cursor
    ARGUMENTS TAKEN: ev - fid
    ARGUMENTS RETURNED:  { x: x, y: y } - object contianing coorsinates of mouse cursor. updated with mouse move
    CALLED FROM: on mouseover of polygon geom.
    CALLS:  none
*/
function getMouseCoordinates(fid) {
  var coordinates = d3.mouse(fid);

  var x = coordinates[0];
  var y = coordinates[1];

  return { x: x, y: y };
} // end function getMouseCoordinates

/*
    NAME: onscroll 
    DESCRIPTION: anonymous function to handle vertical user scrolling
    ARGUMENTS TAKEN:    ev: scorll event
    ARGUMENTS RETURNED: none
    CALLED FROM: on scrolling
    CALLS:  none

    http://bl.ocks.org/johangithub/97a186c551e7f6587878
*/
window.onscroll = function (ev) {
  if (window.scrollY == 0) {
    // you're at the TOP of the page
    console.log("you're at the TOP of the page");
  } else if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight
  ) {
    // you're at the BOTTOM of the page
    console.log("you're at the BOTTOM of the page");
  } else {
    // you're in the MIDDLE of the page
    console.log("you're at the MIDDLE of the page");
  }

  return;
}; // end function onscroll

// Listen for scroll events
window.addEventListener(
  "scroll",
  function (event) {
    d3.selectAll(".scroll").classed("stopped", false).classed("moving", true);

    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
      // Run the callback
      /*   console.log('Scrolling has stopped.'); */
      d3.selectAll(".scroll").classed("stopped", true).classed("moving", false);
    }, 50);
  },
  false
);

/*
    NAME: idled 
    DESCRIPTION: A function that set idleTimeOut to null
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: none
    CALLS: none
   
*/
function idled() {
  idleTimeout = null;

  return;
} // end function idled()

/*
    NAME: defaultAxis 
    DESCRIPTION: A function that reset all content of focus x axis once user closes/removes context brush. 
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: none
    CALLS:  none
   
*/
function defaultAxis() {
  // remove x axis ticks
  d3.selectAll(".xAxisTicks").remove();

  // update focus x domain based on context x domain
  x.domain(x2.domain());
  focus.selectAll(".x.axis").call(
    d3.axisTop(x).tickFormat(function (d, i) {
      var str = "";

      if (d < 0) {
        /* return */ str = Math.abs(d) + " BC";
      } else {
        /* return */ str = d + " AD";
      }

      if (/* vis.width */ visualWidth > 575) {
        return str;
      } else {
        return i % 2 !== 0 ? " " : str;
      }
    })
  );

  // select and update x axis ticks according to brush change.
  var xticks = focus.selectAll(".x.axis").selectAll(".tick");
  xticks
    .append("svg:line")
    .attr("class", "xAxisTicks")
    .attr("y0", 0)
    .attr("y1", height + xAxisOffset + xAxisOffset)
    .attr("x1", 0)
    .attr("x2", 0)
    .style("opacity", 0.1);

  // select and update heightMarker according to brush change.
  focus
    .selectAll(".heightMarker")
    .attr("x1", function (d) {
      return x(d.heightYear);
    })
    .attr("x2", function (d) {
      return x(d.heightYear);
    });

  // select and update polygon clips according to brush change.
  focus
    .selectAll(".polygon-G")
    .selectAll(".polyClip")
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  // select and update polygons according to brush change.
  focus.selectAll(".empirePolygonBase").attr("d", function (d) {
    return empirePolygon_lineFunction_Linear(d.empireLineData);
  });

  // select and update zeroLine according to brush change.
  focus
    .selectAll(".zeroLine")
    .attr("x1", margin.left + x(0) + 0.25)
    .attr("x2", margin.left + x(0) + 0.25);

  return;
} // end function defaultAxis()

/*
    NAME: brushed 
    DESCRIPTION: A function that update the chart for given boundaries of the svg.brush
    ARGUMENTS TAKEN: data - none
    ARGUMENTS RETURNED: none
    CALLED FROM: brush interaction
    CALLS:  none
   
*/
function updateClose() {
  /* var */ selection = d3.event.selection;

  if (selection) {
    d3.selectAll(".cross-G")
      .attr("transform", function () {
        var newX = parseInt(d3.selectAll(".handle.handle--w").attr("x"));
        return "translate(" + (newX + 15) + "," + (height2 - 40) + ")";
      })
      .style("display", "none");
  }
  return;
} // end function updateClose

/*
    NAME: brushed 
    DESCRIPTION: A function that update the chart for given boundaries of the svg.brush
    ARGUMENTS TAKEN: data - none
    ARGUMENTS RETURNED: none
    CALLED FROM: brush interaction
    CALLS:  none
   
*/
function brushed() {
  d3.selectAll(".xAxisTicks").remove();

  // update brush selection detail
  selection = d3.event.selection;

  // if selection is made, reposition close x on brush selcection, but do not display until stopped brushing
  if (selection) {
    d3.selectAll(".cross-G")
      .attr("transform", function () {
        var newX = parseInt(d3.selectAll(".handle.handle--w").attr("x"));
        return "translate(" + (newX + 15) + "," + (height2 - 40) + ")";
      })
      .style("display", "inline");
  }

  // update x domain of main focus chart based on new selection of brush on minor chart
  x.domain(selection.map(x2.invert, x2));

  // Update axis and circle position
  focus
    .selectAll(".x.axis")
    .transition()
    .duration(1250)
    .call(
      d3.axisTop(x).tickFormat(function (d, i) {
        var str = "";

        if (d < 0) {
          /* return */ str = Math.abs(d) + " BC";
        } else {
          /* return */ str = d + " AD";
        }

        if (/* vis.width */ visualWidth > 575) {
          return str;
        } else {
          return i % 2 !== 0 ? " " : str;
        }
      })
    );

  // select and update x axis ticks according to brush change.
  var xticks = focus.selectAll(".x.axis").selectAll(".tick");
  xticks
    .append("svg:line")
    .attr("class", "xAxisTicks")
    .attr("y0", 0)
    .attr("y1", height + xAxisOffset + xAxisOffset)
    .attr("x1", 0)
    .attr("x2", 0)
    .style("opacity", 0.1);

  // select and update heightMarker according to brush change.
  focus
    .selectAll(".heightMarker")
    .transition()
    .duration(1250)
    .attr("x1", function (d) {
      return x(d.heightYear);
    })
    .attr("x2", function (d) {
      return x(d.heightYear);
    });

  // select and update polygon clips according to brush change.
  focus
    .selectAll(".polygon-G")
    .selectAll(".polyClip")
    .transition()
    .duration(1250)
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  // select and update polygons according to brush change.
  focus
    .selectAll(".empirePolygonBase")
    .transition()
    .duration(1250)
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  // select and update zeroLine according to brush change.
  focus
    .selectAll(".zeroLine")
    .transition()
    .duration(1250)
    .attr("x1", margin.left + x(0) + 0.25)
    .attr("x2", margin.left + x(0) + 0.25);

  return;
} // end function brushed

/*
    NAME: change 
    DESCRIPTION: A function that update the chart for given sort order change
    ARGUMENTS TAKEN:    fid: information on button selcted
                        data - none
    ARGUMENTS RETURNED: none
    CALLED FROM: filter button interaction
    CALLS:  none

    http://bl.ocks.org/johangithub/97a186c551e7f6587878
*/
function change(fid, newData) {
  var id;
  id = d3.selectAll(".selectedSortOrder").attr("id");

  var newheight = newData.length * srcbandWidth;
  y.paddingInner(0.0).paddingOuter(0.0).range([0, newheight]);

  // modify false y-axis according to slected sort mechanism for y a-axis
  if (id == "Start") {
    y0 = y
      .domain(
        newData
          .sort(function (a, b) {
            return a.Start - b.Start;
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();

    y3 = y2
      .domain(
        newData
          .sort(function (a, b) {
            return a.Start - b.Start;
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();
  } else if (id == "Empire") {
    y0 = y
      .domain(
        newData
          .sort(function (a, b) {
            return d3.ascending(a.Empire, b.Empire);
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();

    y3 = y2
      .domain(
        newData
          .sort(function (a, b) {
            return d3.ascending(a.Empire, b.Empire);
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();
  } else if (id == "Length") {
    y0 = y
      .domain(
        newData
          .sort(function (a, b) {
            return b.Length - a.Length;
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();

    y3 = y2
      .domain(
        newData
          .sort(function (a, b) {
            return b.Length - a.Length;
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();
  } else if (id == "ContinentStart") {
    y0 = y
      .domain(
        newData
          .sort(function (a, b) {
            return (
              d3.ascending(a.Continent, b.Continent) ||
              d3.ascending(a.Start, b.Start)
            );
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();

    y3 = y2
      .domain(
        newData
          .sort(function (a, b) {
            return (
              d3.ascending(a.Continent, b.Continent) ||
              d3.ascending(a.Start, b.Start)
            );
          })
          .map(function (d) {
            return d.Empire;
          })
      )
      .copy();
  }

  // define sort transition state
  var transitionFocus = focus.transition().duration(2500);
  var transitionContext = context.transition().duration(2500);

  // resort all empire polygons groups
  // this handles all heightmarkers, polygons, mini y-axis.
  focus
    .selectAll(".empirePolygon-G")
    .sort(function (a, b) {
      return y0(a.Empire) - y0(b.Empire);
    })
    .classed("hidden", function (d) {
      if (tokeep.indexOf(d.Continent) >= 0) {
        return false;
      } else {
        return true;
      }
    });

  context
    .selectAll(".polygonMarkers")
    .sort(function (a, b) {
      return y3(a.Empire) - y3(b.Empire);
    })
    .classed("hidden", function (d) {
      if (tokeep.indexOf(d.Continent) >= 0) {
        return false;
      } else {
        return true;
      }
    });

  // apply transtion to all empire plygon groups.
  transitionFocus.selectAll(".empirePolygon-G").attr("transform", function (d) {
    return "translate(0," + (y(d.Empire) - 50 + y.bandwidth() / 2) + ")";
  });

  // apply transtion to all empire plygon groups.
  transitionContext
    .selectAll(".polygonMarkers")
    .attr("y1", function (d) {
      if (d3.select("#peaks").classed("polygons")) {
        return y2(d.Empire) - 1;
      } else {
        return y2(d.Empire);
      }
    })
    .attr("y2", function (d) {
      if (d3.select("#peaks").classed("polygons")) {
        return y2(d.Empire) + 2;
      } else {
        return y2(d.Empire);
      }
    });

  // apply transition to all y-axis.
  transitionFocus.selectAll(".y.axis").call(d3.axisLeft(y)).selectAll("g");

  // apply transition to all y-axis.
  transitionContext
    .selectAll(".context_YAxis")
    .call(d3.axisLeft(y2))
    .selectAll("g");

  transitionFocus
    .selectAll(".y.axis")
    .selectAll(".tick")
    .attr("value", function (d) {
      var values = updateTickInformation(d);
      return values.FID;
    })
    .attr("id", function (d) {
      var values = updateTickInformation(d);
      return (
        "tick" + "-" + SpaceToHyphen(values.continent) + "-FID-" + values.FID
      );
    })
    .attr("class", function (d) {
      var values = updateTickInformation(d);
      return (
        "tick" + " " + SpaceToHyphen(values.continent) + " FID-" + values.FID
      );
    });

  // modify text anchoring of y-axis labelling based on display width
  transitionFocus
    .selectAll(".y.axis")
    .selectAll("g")
    .selectAll("text")
    .attr("x", function () {
      if (visualWidth < 1200) {
        return 10;
      } else {
        return -10;
      }
    })
    .style("fill", function (d) {
      var empire = d;
      var continent = "";

      fullData.forEach(function (d) {
        var line = d;
        if (empire == line.Empire) {
          continent = line.Continent;
        }
      });

      return color[continents.indexOf(HyphenToSpace(continent))];
    })
    .style("text-anchor", function () {
      if (visualWidth < 1200) {
        return "start";
      } else {
        return "end";
      }
    });
  focus
    .selectAll(".y.axis")
    .selectAll(".tick")
    .on("click", function () {
      display_yAxisTicks(this);
    });

  d3.select("#visual")
    .transition()
    .duration(2500)
    .style("height", newheight + margin.top + xAxisOffset * 3 + "px");

  transitionFocus
    .select("#redBox")
    .attr("height", newheight + xAxisOffset + xAxisOffset);

  transitionFocus
    .selectAll(".zeroLine")
    .attr("y2", newheight + margin.top + xAxisOffset + xAxisOffset);

  transitionFocus
    .selectAll(".xAxisTicks")
    .attr("y1", newheight + xAxisOffset + xAxisOffset);

  return;
} // end function change

window.twttr = (function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function (f) {
    t._e.push(f);
  };

  return t;
})(document, "script", "twitter-wjs");

/*
    NAME: reportWindowSize 
    DESCRIPTION: function called when user resizes window. handles updating of content reliant on dimension of window
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: none
    CALLS:  none

    http://bl.ocks.org/johangithub/97a186c551e7f6587878
*/
function reportWindowSize() {
  // update glvbal wisdth varaible based on new window dimensions
  // accommodarte small window size for left margin
  visualWidth = document.getElementById("visual").clientWidth;
  // d3.selectAll(".svgVisualBaseStatic").attr("width", visualWidth);

  if (visualWidth < 575) {
    console.log("visualWidth < 575");
    /*     margin.left = 25;
    margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;
    d3.selectAll(".legend").classed("hidden", true);
  } else if (visualWidth < 768) {
    console.log("visualWidth < 768");
    /*     margin.left = 25;
    margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;
    d3.selectAll(".legend").classed("hidden", true);
  } else if (visualWidth < 992) {
    console.log("visualWidth < 992");
    /*     margin.left = 25;
    margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;
  } else if (visualWidth < 1200) {
    console.log("visualWidth < 1200");
    /*     margin.left = 25;
    margin2.left = 25; */
    margin.left = 15;
    margin2.left = 15;
  } /*  if (visualWidth >= 1200) */ else {
    console.log("visualWidth >= 1200");
    margin.left = 65;
    margin2.left = 65;
  }

  // update width value of visual DIV after updating margins based on screen size
  width = visualWidth - margin.left - margin.right;

  // update width of slected DOM elements
  focus.attr("transform", "translate(" + margin.left + "," + 0 + ")");
  focus
    .select("#mainVisualClipRect")
    .attr("x", 0)
    .attr("width", width - margin.left);

  // append proxy rectangle mask
  context
    .selectAll(".redBox")
    .attr("x", margin2.left)
    .attr("width", width - margin2.left);

  // append proxy rectangle mask
  focus
    .selectAll(".redBox")
    .attr("x", margin.left)
    .attr("width", width - margin.left);

  //modify the brush and its overlay
  context.attr(
    "transform",
    "translate(" + margin2.left + "," + margin2.top + ")"
  );
  brush.extent([
    [0, 0],
    [width - margin2.left, height2],
  ]); // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area

  context
    .selectAll(".overlay")
    .attr("x", 0)
    .attr("width", width - margin2.left);

  context
    .selectAll(".brush")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
    .call(brush);

  // udpate positoning of d3 brush selction and handles
  d3.selectAll(".selection")
    .attr("x", x2(x.domain()[0]))
    .attr("width", x2(x.domain()[1]) - x2(x.domain()[0]));
  d3.selectAll(".handle.handle--w").attr("x", x2(x.domain()[0]) - 3);
  d3.selectAll(".handle.handle--e").attr("x", x2(x.domain()[1]) - 3);

  if (!selection) {
    x = d3
      .scaleLinear()
      .range([0, width - margin.left])
      .domain([
        Math.floor(
          d3.min(fullData, function (d) {
            return d.Start;
          }) / 500
        ) * 500,
        Math.ceil(
          d3.max(fullData, function (d) {
            return d.End;
          }) / 500
        ) * 500,
      ]);
  } else {
    x = d3
      .scaleLinear()
      .range([0, width - margin.left])
      .domain([x.domain()[0], x.domain()[1]]);
  }

  d3.selectAll(".cross-G").attr("transform", function () {
    var newX = parseInt(d3.selectAll(".handle.handle--w").attr("x"));
    return "translate(" + (newX + 15) + "," + (height2 - 40) + ")";
  });

  x2 = d3
    .scaleLinear()
    .range([0, width - margin2.left])
    .domain([
      Math.floor(
        d3.min(fullData, function (d) {
          return d.Start;
        }) / 500
      ) * 500,
      Math.ceil(
        d3.max(fullData, function (d) {
          return d.End;
        }) / 500
      ) * 500,
    ]);

  // update and transtion main x axis
  focus
    .selectAll(".x.axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(
      d3.axisTop(x).tickFormat(function (d, i) {
        var str = "";

        if (d < 0) {
          str = Math.abs(d) + " BC";
        } else {
          str = d + " AD";
        }

        if (visualWidth > 575) {
          return str;
        } else {
          return i % 2 !== 0 ? " " : str;
        }
      })
    );

  // update and transtion main x axis
  context
    .selectAll(".context_XAxis")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
    .call(
      d3.axisTop(x2).tickFormat(function (d, i) {
        var str = "";

        if (d < 0) {
          str = Math.abs(d) + " BC";
        } else {
          str = d + " AD";
        }

        if (visualWidth > 575) {
          return str;
        } else {
          return i % 2 !== 0 ? " " : str;
        }
      })
    );

  // update and transtion main y-axis
  focus
    .selectAll(".y.axis")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top + xAxisOffset) + ")"
    )
    .call(d3.axisLeft(y));

  // update and transtion main y-axis ticks
  focus.selectAll(".yAxisTicks").attr("x2", width - margin.left);
  focus
    .selectAll(".y.axis")
    .selectAll(".tick")
    .selectAll("text")
    .attr("x", function () {
      if (visualWidth < 1200) {
        return 9;
      } else {
        return -9;
      }
    })
    .style("text-anchor", function () {
      if (visualWidth < 1200) {
        return "start";
      } else {
        return "end";
      }
    });

  // modify transform of poylgons.
  focus
    .selectAll(".polygon-G")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top + xAxisOffset) + ")"
    );

  // modify clips of poylgons.
  focus
    .selectAll(".polygon-G")
    .selectAll(".polyClip")
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  // modify poylgons.
  focus
    .selectAll(".polygon-G")
    .selectAll(".empirePolygon")
    .attr("d", function (d) {
      return empirePolygon_lineFunction_Linear(d.empireLineData);
    });

  /*   d3.select("#hideShowBtn")
    .style("right", margin2.right + "px"); */

  context
    .selectAll(".polygonMarkers")
    .attr("x1", function (d) {
      if (d3.select("#peaks").classed("peaks")) {
        return margin2.left + x2(d.Start);
      } else {
        return margin2.left + x2(d.heightYear);
      }
    })
    .attr("x2", function (d) {
      if (d3.select("#peaks").classed("peaks")) {
        return margin2.left + x2(d.End);
      } else {
        return margin2.left + x2(d.heightYear);
      }
    })
    .attr("y1", function (d) {
      if (d3.select("#peaks").classed("peaks")) {
        return y2(d.Empire);
      } else {
        return y2(d.Empire) - 1;
      }
    })
    .attr("y2", function (d) {
      if (d3.select("#peaks").classed("peaks")) {
        return y2(d.Empire);
      } else {
        return y2(d.Empire) + 2;
      }
    });

  // modify heightMarker.
  focus
    .selectAll(".polygon-G")
    .selectAll(".heightMarker")
    .attr("x1", function (d) {
      return x(d.heightYear);
    })
    .attr("x2", function (d) {
      return x(d.heightYear);
    });

  // modify zeroLine.
  focus
    .selectAll(".zeroLine")
    .attr("x1", margin.left + x(0) + 0.75)
    .attr("x2", margin.left + x(0) + 0.75);

  // modify zeroLine.
  context
    .selectAll(".zeroLine")
    .attr("x1", margin2.left + x2(0) + 0.75)
    .attr("x2", margin2.left + x2(0) + 0.75);

  return;
} // end function reportWindowSize

/*
    NAME: share 
    DESCRIPTION: function show or hide eternal sharing DIV with buttons
    ARGUMENTS TAKEN: none
    ARGUMENTS RETURNED: none
    CALLED FROM: none
    CALLS:  none
*/
function share() {
  if (d3.select("#external-embed").classed("hidden")) {
    d3.select("#external-embed")
      .classed("hidden", false)
      .classed("visible", true);
    d3.select("#external-embed-mini")
      .classed("hidden", false)
      .classed("visible", true);

    d3.select("#external-embed")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .style("top", "60px");

    d3.select("#external-embed-mini")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .style("top", "60px");
  } else {
    d3.select("#external-embed")
      .classed("hidden", true)
      .classed("visible", false);
    d3.select("#external-embed-mini")
      .classed("hidden", true)
      .classed("visible", false);

    d3.select("#external-embed")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .style("top", "-60px");

    d3.select("#external-embed-mini")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .style("top", "-60px");
  }

  return;
} // end function share

function scroll() {
  return;
} // end function share

$(function () {
  $("#slider").slider();
});
