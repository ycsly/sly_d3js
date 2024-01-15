// 读取数据
var Data = [];
function readfile(filename){
	var str;
	$.ajax({
		type: "GET",
		async: false,
		url: filename,
		dataType: "text",
		success: function(s){
			str = s;
		}
	});
    console.log(str);
	var str = str.split("\n");
	for(var k=1; k<str.length; k++)
	{
		var s = str[k];
		re = s.split(",")
		console.log(re);
		var ele = {};
		ele["name"] = re[0];
		ele["economy (mpg)"] = parseFloat(re[1]);
		ele["cylinders"] = parseInt(re[2]);
		ele["displacement (cc)"] = parseFloat(re[3]);
		ele["power (hp)"] = parseFloat(re[4]);
		ele["weight (lb)"] = parseFloat(re[5]);
		ele["0-60 mph (s)"] = parseFloat(re[6]);
		ele["year"] = parseInt(re[7]);
		Data.push(ele);
	}
}


readfile("data\\cars.csv");
console.log(Data)

// 定义画布大小
var main_svg_w = 1280;
var main_svg_h = 800;

// 定义边距
var margin = {top: 50, right: 50, bottom: 50, left: 50};

// 定义绘图区域大小
var width = main_svg_w - margin.left - margin.right;
var height = main_svg_h - margin.top - margin.bottom;

// 创建画布
var vis = d3.select(".container")
            .append("svg")
            .attr("class","main_svg")
            .attr("width", main_svg_w)
            .attr("height",main_svg_h)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 定义颜色比例尺
var color = d3.scaleOrdinal(d3.schemeCategory10);

// 定义平行坐标的维度
var dimensions = ["economy (mpg)", "cylinders", "displacement (cc)", "power (hp)", "weight (lb)", "0-60 mph (s)", "year"];

// 定义每个维度的比例尺
var x = d3.scalePoint()
          .range([0, width])
          .padding(1)
          .domain(dimensions);

var y = {};
dimensions.forEach(function(d) {
  y[d] = d3.scaleLinear()
           .domain(d3.extent(Data, function(p) { return +p[d]; }))
           .range([height, 0]);
});

// 定义每个维度的轴
var axis = d3.axisLeft();

// 绘制每个维度的轴
vis.selectAll(".dimension")
   .data(dimensions)
   .enter()
   .append("g")
   .attr("class", "dimension")
   .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
   .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
   .append("text")
   .style("text-anchor", "middle")
   .attr("y", -9)
   .text(function(d) { return d; });

// 定义线条生成器
var line = d3.line()
             .defined(function(d) { return !isNaN(d[1]); });

// 绘制数据线条
vis.append("g")
   .attr("class", "lines")
   .selectAll("path")
   .data(Data)
   .enter()
   .append("path")
   .attr("d", function(d) {
     return line(dimensions.map(function(p) { return x(p), y[p]; }));
   })
   .style("fill", "none")
   .style("stroke", function(d) { return color(d.name); })
   .style("opacity", 0.5);

// 添加图例
var legend = vis.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (width + 20) + "," + 0 + ")");

legend.selectAll(".legend-item")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.selectAll(".legend-item")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

legend.selectAll(".legend-item")
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });
