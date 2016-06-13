var config = require('./config/config.json');
var express = require('express');
var app = express();
var path = require('path');
var port = config.port;
var VTTCreator = require('./core/vtt-creator.js');
//ar Canvas2PNG = require('./core/canvas-to-png.js');
var im = require('./core/imagemagick-cli.js');
var fs = require('fs');

// middleware
app.use(express.static(__dirname + '/public'));

// index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});


app.listen(port, function () {
    console.log('App listening on port ' + port);	
    // generate thumbs by video
    	
		/*
		var firstArgument = process.argv[2]; //  -> node server.js firstArgument secondArgument
		if ( typeof firstArgument === 'undefined')
		{
		  //do stuff if firstArgument is defined
		}
		*/
    	// generateSprite('C:\\path-to-movies-folder' , 'path-to-thumbs-folder', 10)
	var path2thumbnails = 'C:\\Users\\artur\\Desktop\\Testing\\thumbs';
    var path2videos = 'C:\\Users\\artur\\Desktop\\Testing\\movies';
	var imgCountPerVideo = '10';
	imgCountPerVideo = imgCountPerVideo - 2;
	var spriteName = 'sprite.png';
	
	im.generateThumbs(path2thumbnails, path2videos, imgCountPerVideo);
	im.generateSprite(path2thumbnails, path2videos, spriteName);
	//TODO: DELETE thumbs
});