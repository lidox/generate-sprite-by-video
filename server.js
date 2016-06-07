var config = require('./config/config.json');
var express = require('express');
var app = express();
var path = require('path');
var port = config.port;
var VTTCreator = require('./core/vtt-creator.js');
var im = require('./core/imagemagick-cli.js');

// middleware
app.use(express.static(__dirname + '/public'));

// index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});


app.listen(port, function () {
    console.log('App listening on port ' + port);
	
	var imageMagickDir = config.imagemagickDirectory;
	var FFMPEG = imageMagickDir+'\\ffmpeg.exe\"';
	
	var VIDEO = 'C:\\Users\\schaefa\\Desktop\\Testing\\movies\\5ca7a557-4085-4a15-9e84-eea45927e9b1\\v_1_50.mp4';
	var PATH2SPRITE = 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs';
	
	var IMAGENAME = 'example-thumb';
	var imgPerSecond = '10';
	var widthPerImage = '400';
	
	var pathToFfmpeg = path.join(path.dirname(FFMPEG) , path.basename(FFMPEG));
	var pathToVideo = path.join(path.dirname(VIDEO) , path.basename(VIDEO));
	var imagesToUse = path.join(path.dirname(PATH2SPRITE) , path.basename(IMAGENAME +'%03d.png'));
	//im.execCLI(pathToFfmpeg,  pathToVideo, imgPerSecond, widthPerImage, imagesToUse);
	
	//iterate over all folders inside movie folder:
	var guidList = getDirectories(PATH2SPRITE);
	console.log('getDirectories: '+guidList);
	var index;
	for (index = 0; index < guidList.length; ++index) {
		console.log(guidList[index]);
	}

	
	
	
	//get Video length
	//var videoLength = execCommand(pathToFfmpeg +' -i \"' + pathToVideo + '\" 2>&1');
	//console.log('videoLength: ' + videoLength);
	
	// get seconds per video
	
	//var vtt = new VTTCreator();
	//var secsPerImgae = vtt.getSecondsPerImageByImgNr(50,25);
	//console.log('seconds per image: ' + secsPerImgae);
});

var fs = require('fs');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}