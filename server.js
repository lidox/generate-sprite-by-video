var config = require('./config/config.json');
var express = require('express');
var app = express();
var path = require('path');
var port = config.port;
var VTTCreator = require('./core/vtt-creator.js');
var Canvas2PNG = require('./core/canvas-to-png.js');
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
	var path2thumbnails = 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs';
    var path2videos = 'C:\\Users\\schaefa\\Desktop\\Testing\\movies';
	var imgCountPerVideo = '10';
	var spriteName = 'sprite.png';
	
	generateThumbs(path2thumbnails, path2videos, imgCountPerVideo);
	generateSprite(path2thumbnails, path2videos, spriteName);
	//TODO: DELETE thumbs
});

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function generateThumbs(path2thumbnails, path2videos, imgCountPerVideo){
	//var PATH2SPRITE = 'C:\\Users\\russland\\Desktop\\Testing\\thumbs';
    //var PATH2VIDEO = 'C:\\Users\\russland\\Desktop\\Testing\\movies';
    var PATH2SPRITE = path2thumbnails; //'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs';
    var PATH2VIDEO = path2videos; //'C:\\Users\\schaefa\\Desktop\\Testing\\movies';
	var imgPerSecond = imgCountPerVideo;//'10';
	
	var IMAGENAME = config.thumbName;
	var logFile = config.logFile;
	var widthPerImage = config.thumbImageWidth;
    var VIDEO_NAME = config.videoName;
	
	//iterate over all folders inside movie folder:
	var guidList = getDirectories(PATH2VIDEO);
	var index;
	for (index = 0; index < guidList.length; ++index) {
        var VIDEO = path.join(path.join(PATH2VIDEO , guidList[index]), VIDEO_NAME); 
        var PATH_TO_THUMBS = path.join(PATH2SPRITE, guidList[index]);
        if (!fs.existsSync(PATH_TO_THUMBS)){
            fs.mkdirSync(PATH_TO_THUMBS);
            console.log('create new folder: ' + PATH_TO_THUMBS);
        }
        
        // check if video exists   
        if (!fs.existsSync(VIDEO)){
			var logMessage = 'video does not exist: ' + VIDEO;
            console.log(logMessage);
            // npm install simple-node-logger --save
			var log = require('simple-node-logger').createSimpleFileLogger(logFile);
			log.info(logMessage);
	
        }
        else {         
            var imageMagickDir = config.imagemagickDirectory;
            var FFMPEG = imageMagickDir+'\\ffmpeg.exe\"';
            var pathToFfmpeg = path.join(path.dirname(FFMPEG) , path.basename(FFMPEG));
            var pathToVideo = path.join(path.dirname(VIDEO) , path.basename(VIDEO));
            var imagesToUse = path.join(PATH_TO_THUMBS , path.basename(IMAGENAME +'%03d.png'));
            console.log('------------------');
            console.log(index+ '. Versuch');
            im.execCLI(pathToFfmpeg,  pathToVideo, imgPerSecond, widthPerImage, imagesToUse);
        }

	}
    console.log('generate pngs finished!');
}
4// command: "C:\Program Files\ImageMagick-6.9.3-Q16\montage.exe" C:\Users\schaefa\Videos\example-video*.png -tile x1 -geometry +0+0 C:\Users\schaefa\Videos\example-video-sprite.png
function generateSprite(path2thumbnails, path2videos, spriteName){ 
    var PATH2THUMBS = path2thumbnails;
    var PATH2VIDEO = path2videos;
	
	var IMAGENAME = config.thumbName;
	var logFile = config.logFile;
	var widthPerImage = config.thumbImageWidth;
    var VIDEO_NAME = config.videoName;
	
	//iterate over all folders inside movie folder:
	var guidList = getDirectories(PATH2VIDEO);
	var index;
	for (index = 0; index < guidList.length; ++index) {
        //var VIDEO = path.join(path.join(PATH2VIDEO , guidList[index]), VIDEO_NAME); 
        var PATH_TO_THUMBS = path.join(PATH2THUMBS, guidList[index]);                    
		var imageMagickDir = config.imagemagickDirectory;
		var MONTAGE = path.join(imageMagickDir, 'montage.exe'); 
		var pathToMontage = path.join(path.dirname(MONTAGE) , path.basename(MONTAGE));
		var pathToThumbs = path.join(PATH_TO_THUMBS , path.basename(IMAGENAME +'*.png'));
		//var pathToVideo = path.join(path.dirname(VIDEO) , path.basename(VIDEO));
		var pathToSprite = path.join(PATH_TO_THUMBS , path.basename(spriteName));
		console.log('------------------');
		console.log(index+ '. Versuch für montage');
		im.runMontage(pathToMontage, pathToThumbs, pathToSprite);
	}
    console.log('generate pngs finished!');
}