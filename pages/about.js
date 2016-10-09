var MARGIN = 10;

var page = new tabris.Page({
	title: 'About',
	topLevel: true
});

new tabris.TextView({
	layoutData: { top: MARGIN, left: MARGIN, right: MARGIN },
	text: 'App to demonstrate the Tiny Suite project for the Seattle Interactive IOT Hackathon - Tiny Home & Automotive'
}).appendTo(page);

new tabris.TextView({
	layoutData: { top: ['prev()', MARGIN], left: MARGIN, right: MARGIN },
	text: 'Weather data from OpenWeatherMap'
}).appendTo(page);

module.exports = page;