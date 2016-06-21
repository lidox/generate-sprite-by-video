var config = require('./config/config.json');
var path = require('path');
var VTTCreator = require('./core/vtt-creator.js');
var im = require('./core/imagemagick-cli.js');
var fs = require('fs');

/* GENERATE THUMBS BY VIDEO */

var path2videos = process.argv[2]; //  -> node server.js firstArgument secondArgument
var path2thumbnails = process.argv[3];
var imgCountPerVideo = process.argv[4];

if(!isNumber(imgCountPerVideo)) {
	console.log('Invalid image count: '+imgCountPerVideo+' Use: node generate-sprite.js [path-to-movies] [path-to-thumbs] [thumbnail-count-per-sprite]');
}
else if ( (typeof path2videos === 'undefined')  && (typeof path2thumbnails === 'undefined') )
{
  console.log('Invalid input! node generate-sprite.js [path-to-movies] [path-to-thumbs] [thumbnail-count-per-sprite]');
}
else{
	imgCountPerVideo = imgCountPerVideo - 2;
	im.generateThumbs(path2thumbnails, path2videos, imgCountPerVideo);
}

function isNumber (o) {
  return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}
