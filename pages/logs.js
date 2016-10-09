var Chart = require('chart.js/Chart.min.js');

var MARGIN = 16;

var page = new tabris.Page({
	title: 'Logs',
	topLevel: true
});

var activityIndicator = new tabris.ActivityIndicator({
	visible: false,
	centerX: 0,
	centerY: 0
}).appendTo(page);

function getDefaultDataStructure() {
	return {
		labels: [],
		datasets: [
			{
				label: '',
				fillColor: 'rgba(110,142,158,0.5)',
				strokeColor: '#263238',
				pointColor: '#263238',
				pointStrokeColor: '#FFF',
				pointHighlightFill: '#FFF',
				pointHighlightStroke: 'rgba(220,220,220)',
				data: []
			}
		]
	}
}

var datasets = [
	{"id": "57f9bb0476254226b6e969f6", "name": "Light"},
	{"id": "57f9bb0476254226b6e969f7", "name": "Humidity"},
	{"id": "57f9bb04762542269a22e1d8", "name": "Temperature"},
	{"id": "57f9bb07762542269a22e1ee", "name": "Gas vs. Air ratio"},
	{"id": "57f9bb07762542269a22e1ef", "name": "Motion"}
];
var picker = new tabris.Picker({
	layoutData: {left: MARGIN, top: MARGIN},
	items: datasets,
	itemText: function(airport) {
		return airport.name;
	}
}).appendTo(page);
var button = new tabris.Button({
	text: 'Fetch Data',
	layoutData: {left: [picker, MARGIN], top: MARGIN}
}).appendTo(page);
var canvas = new tabris.Canvas({
	layoutData: {left: MARGIN, top: [button, MARGIN], right: MARGIN, bottom: MARGIN}
}).appendTo(page);
var createCanvasContext = function() {
	var bounds = canvas.get('bounds');
	var width = bounds.width;
	var height = Math.min(bounds.height, width);
	return canvas.getContext('2d', width, height);
};
button.on('select', function() {
	activityIndicator.set('visible', true);
	fetch('http://things.ubidots.com/api/v1.6/variables/' + picker.get('selection').id + '/values?token=JHsMUIu6LR6uCnWRl7uqqe8hmVAmwi&format=json').then(function(response) {
		return response.json();
	}).then(function(json) {
		var chartData = getDefaultDataStructure();

		var max = Math.min(1000, json.results.length);
		var start = json.results.length - max;
		for(var i = start; i < start + max; i++) {
			chartData.labels.push(json.results[i].created_at);
			chartData.datasets[0].data.push(json.results[i].value);
		}

		var ctx = createCanvasContext();
		// workaround for scaling to native pixels by chart.js
		ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
		new Chart(ctx)['Line'](chartData, {
			animation: true,
			showScale: true,
			showTooltips: false,
			scaleShowLabels: true
		});
		activityIndicator.set('visible', false);
	}).catch(function(err) {
		new tabris.TextView({
			layoutData: { top: [button, MARGIN], left: MARGIN, right: MARGIN },
			text: err
		}).appendTo(page);
		activityIndicator.set('visible', false);
	});
});