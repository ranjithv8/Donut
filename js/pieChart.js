var data = [];
CONSTANTS = {
	barBorderRadius: 5,
	barWidth: 40,
	barSpacing: 40,
	barChartHeight: 380,
	pieGrapghRadius:180,
	pieStrokeWidth:5,
	pieChartWidth: 200,
	pieChartHeight: 200,
    pieCenterX:200,
    pieCenterY:200
};
init = function() {
 	data = [
  		{
  			key:"x",
  			value: 200,
  			color:"#00DF8C"
  		},
  		{
  			key:"y",
  			value: 300,
  			color:"#FFBD4C"
  		},
  		{
  			key:"z",
  			value: 200,
  			color:"#E26AE5"
  		},
  		{
  			key:"t",
  			value:400,
  			color:"#C52C00"
  		},
  		{
  			key:"t",
  			value:500,
  			color:"#02C1D4"
  		},
  		{
  			key:"t",
  			value:350,
  			color:"#0EEEEE"
  		},

  	]
  	calculateAngle();
  	plotPieChart();
  	plotbargraph();
 };

calculateAngle = function() {
 	var sum=0,angle,percent,rotationAngle=0;
  	for(var i = 0; i < data.length; ++i) {
   		sum += data[i].value;
	}
	data[0].rotationAngle = 0;
	for(var i = 0; i < data.length; ++i) {
   		angle = (data[i].value/sum)*Math.PI * 2;
   		rotationAngle += angle*(360/(Math.PI*2));
   		data[i].angle = angle;
   		if(i<data.length-1) {
   			data[i+1].rotationAngle = rotationAngle;
   		}
	}
	console.log(data);
  };

function drawPath(d, fill, id) {
	var path = document.createElementNS("http://www.w3.org/2000/svg","path");
	path.setAttribute("d", d);
	path.setAttribute("stroke", "white");
	path.setAttribute("fill",fill);
	path.setAttribute("id", id);
	path.setAttribute("stroke-width",CONSTANTS.pieStrokeWidth);
	return path;
}

plotPieChart = function() {
    startangle = 0;
    var svg = document.getElementById("svg-pie");
	for (var i = 0; i < data.length; i++) {
		cx=CONSTANTS.pieCenterX;
		cy=CONSTANTS.pieCenterY;
		r= CONSTANTS.pieGrapghRadius;
		var endangle = startangle + data[i].angle;
		var x1 = cx + r * Math.sin(startangle);
		var y1 = cy - r * Math.cos(startangle);
		var x2 = cx + r * Math.sin(endangle);
		var y2 = cy - r * Math.cos(endangle);
		var big = 0;
		if (endangle - startangle > Math.PI)
			big = 1;
		var d = "M " + cx + " " + cy + " L " + x1 + " " + y1 + " A " + r
					+ " " + r + " 0 " + big + " 1 " + x2 + " " + y2 + "L"+cx+" "+cy+ " z";                  
		var path = drawPath(d,data[i].color,i);
		svg.appendChild(path);
		startangle = endangle;
 	}
};

$(document).ready(function(){
	init();
	$(".svg-pie-container path").click(moveBarAndPie);
	$(".svg-bar-container rect").click(moveBarAndPie);
    document.getElementById("1").addEventListener("touchmove",rotateOnTouch,false);
    document.getElementById("2").addEventListener("touchmove",rotateOnTouch,false);
    document.getElementById("3").addEventListener("touchmove",rotateOnTouch,false);
    document.getElementById("4").addEventListener("touchmove",rotateOnTouch,false);
    document.getElementById("5").addEventListener("touchmove",rotateOnTouch,false);
    
    //$(".svg-pie-container path").touchmove(rotateOnTouch);
});

moveBarAndPie = function() {
	var id = $(this).attr("id") || $(this).attr("data-id"); 
	rotatePie(id);
	moveBar(id);
}

plotbargraph = function() {
	var svgBar = document.getElementById("svg-bar");
	for(i=0;i<data.length;++i) {
		data[i].scaledValue = data[i].value/5;
	}
	var svg = document.getElementById("svg-bar");
	cx=CONSTANTS.barSpacing;
	
	for (var i = 0; i < data.length; i++) {
			cy=CONSTANTS.barChartHeight-data[i].scaledValue
			var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
			rect.setAttribute("x", cx);
			rect.setAttribute("y", cy);
			rect.setAttribute("width", CONSTANTS.barWidth);
			rect.setAttribute("height", data[i].scaledValue);
			rect.setAttribute('fill', data[i].color);
			rect.setAttribute('rx', 5);
			rect.setAttribute("data-id",i);
			cx+=CONSTANTS.barSpacing+CONSTANTS.barWidth;
 			svgBar.appendChild(rect);
 	}

}
moveBar = function(id) {
	var id;
	if(data.length%2) {
		id = Math.floor(data.length/2)-parseInt(id);
	}
	else {
		id = Math.floor(data.length/2)-1-parseInt(id);
	}
	$(".scrollable").css("-webkit-transform","translate("+((id*(CONSTANTS.barWidth+CONSTANTS.barSpacing))-(CONSTANTS.barWidth/2))+"px)");
}
 
rotatePie = function(id) {
	var id = parseInt(id);
	var angleToRotate;
	console.log(data);
	angleToRotate = 180-(data[id].rotationAngle+(((data[id].angle)*(360/(Math.PI*2))))/2);
	$(".rotatable").css("-webkit-transform","rotate("+angleToRotate+"deg)");
}

var prevAngle=0;
rotateOnTouch = function(e) {
    console.log(e);
    var x = CONSTANTS.pieCenterX - e.touches[0].pageX;
    var y = CONSTANTS.pieCenterY - e.touches[0].pageY;
    angle = Math.atan(x/y)*(360/(Math.PI*2));
    var angleToRotate = prevAngle-angle;
    prevAngle=angle;
    console.log(e);
    console.log(x+" "+y+" "+angleToRotate);
    $(".rotatable").css("-webkit-transform","rotate("+angleToRotate+"deg)");
}