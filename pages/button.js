var MARGIN = 10;

var page = new tabris.Page({
    title: 'Home',
    topLevel: true
});

var button = new tabris.ToggleButton({
    height: 100,
    width: 300,
    text: 'loading'
}).on('select', function(button, selection, options) {
    status.set('text', '<i>Changing status...</i>');
    var home;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    if (selection) {
        home = 'args=home';
    } else {
        home = 'args=away';
    }
    fetch('https://api.particle.io/v1/devices/390034000847343232363230/home_status?access_token=7291b37ef9c8ed1fdf1e210bd25cdbe398469665', {
        headers: myHeaders,
        method: 'POST',
        body: home
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        status.set('text', '');
        if (json.return_value == 1) {
            button.set("text", "home");
        } else if (json.return_value == 2) {
            button.set("text", "away");
        } else {
            button.set("text", "error");
        }
    }).catch(function(err) {
        status.set('text', err);
    });
    
}).appendTo(page);

var status = new tabris.TextView({
    markupEnabled: true,
    layoutData: { top: [button, MARGIN], left: MARGIN, right: MARGIN },
}).appendTo(page);

fetch('https://api.particle.io/v1/devices/390034000847343232363230/home_var?access_token=7291b37ef9c8ed1fdf1e210bd25cdbe398469665').then(function(response) {
    return response.json();
}).then(function(json) {
    button.set("text", json.result ? "home" : "away");
}).catch(function(err) {
    status.set('text', err);
});