var drawer = new tabris.Drawer();

new tabris.PageSelector({
	layoutData: {left: 0, top: 0, right: 0, bottom: 0}
}).appendTo(drawer);

new tabris.TextView({
	layoutData: {centerX: 0, bottom: 0},
	text: 'Version 1.0.0 / ' + tabris.version
}).appendTo(drawer);

require('./pages/weather.js');
require('./pages/about.js');

tabris.ui.children('Page')[0].open();