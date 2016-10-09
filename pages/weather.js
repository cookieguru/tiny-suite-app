var page = new tabris.Page({
	title: 'Weather',
	topLevel: true
});
var scrollView = new tabris.ScrollView({
	layoutData: { top: 0, left: 0, right: 0, bottom: 0 }
}).appendTo(page);

var activityIndicator = new tabris.ActivityIndicator({
	visible: true,
	centerX: 0,
	centerY: 0
}).appendTo(page);

fetch('http://api.openweathermap.org/data/2.5/forecast?q=Seattle&APPID=c9fe82bb94d0e335f9f3fd7dbfd48a30&units=imperial').then(function(response) {
	return response.json();
}).then(function(json) {
	new tabris.TextView({
		layoutData: { top: ['prev()', 0], left: 0, right: 0 },
		markupEnabled: true,
		text: '<b>Forecast for ' + json.city.name + '</b>'
	}).appendTo(scrollView);
	for(var i = 0; i < json.list.length; i++) {
		var item = json.list[i];
		var composite = new tabris.Composite({
			layoutData: { top: ['prev()', 10], left: 0, right: 0 }
		}).appendTo(scrollView);
		new tabris.TextView({
			layoutData: { top: 0, left: 0 },
			text: friendlyTimestamp(item.dt)
		}).appendTo(composite);
		new tabris.TextView({
			layoutData: { top: ['prev()', 0], left: 0 },
			text: 'Temperature: ' + item.main.temp.toFixed() + '°F'
		}).appendTo(composite);
		new tabris.TextView({
			layoutData: { top: ['prev()', 0], left: 0 },
			text: 'Humidity: ' + item.main.humidity + '%'
		}).appendTo(composite);
		new tabris.TextView({
			layoutData: { top: ['prev()', 0], left: 0 },
			text: ucfirst(item.weather[0].description)
		}).appendTo(composite);
		new tabris.ImageView({
			layoutData: { right: 0, centerY: 0 },
			image: {
				src: 'http://openweathermap.org/img/w/' + item.weather[0].icon + '.png',
				height: 25 * tabris.device.get('scaleFactor'),
				width: 25 * tabris.device.get('scaleFactor')
			}
		}).appendTo(composite);
	}
	activityIndicator.dispose();
}).catch(function(err) {
	new tabris.TextView({
		layoutData: { top: 0, left: 0, right: 0 },
		text: err
	}).appendTo(scrollView);
	activityIndicator.dispose();
});

function friendlyTimestamp(timestamp) {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	var offset = new Date().getTimezoneOffset() * 60 * 1000;

	var d = new Date(timestamp * 1000 + offset),
	  day = days[d.getDay()],
	  mm = months[d.getMonth()],
	  dd = d.getDate(),
	  hh = ('0' + d.getHours()).slice(-2),
	  min = ('0' + d.getMinutes()).slice(-2);

	return day + ' ' + mm + ' ' + dd + ' ' + hh + ':' + min;
}

function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}