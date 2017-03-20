
function prepareEventHandlers() {
	var tlButton = document.getElementById("showTimeline");
	tlButton.onclick =  function() {
		replaceContent(tlContainer, timeline);
        removeCSS(tlContainer);
	}

    var chartButton = document.getElementById("showChart");
    chartButton.onclick =  function() {
        replaceContent(chartContainer, interactive);
        removeCSS(chartContainer);
    }
}

window.onload = function() {
	prepareEventHandlers();
};

var timeline = "<div id='timeline'><iframe src='timeline/AstronomyTimeline.html' height='500' style='position:relative; left:10%; margin-bottom:3em; width:80%; padding: 0px;'></iframe></div>";
var interactive = "<div id='interactive'><iframe src='Chart.html' height='570' style='position:relative; left:10%; margin-bottom:3em; width:80%; padding: 0px;'></iframe></div>";

var tlContainer = document.getElementById("GreenBox");
var chartContainer = document.getElementById("BlueBox");

function replaceContent(container, content) {
    container.innerHTML = content;
}

function removeCSS(container){
    container.removeAttribute('class');
}