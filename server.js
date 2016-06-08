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
    generatePNGs();
	
	//var generator = new Canvas2PNG();
	//generator.generatePNG();
	
});

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function generatePNGs(){
	//var PATH2SPRITE = 'C:\\Users\\russland\\Desktop\\Testing\\thumbs';
    //var PATH2VIDEO = 'C:\\Users\\russland\\Desktop\\Testing\\movies';
    var PATH2SPRITE = 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs';
    var PATH2VIDEO = 'C:\\Users\\schaefa\\Desktop\\Testing\\movies';
	var logFile = config.logFile;
	
	var IMAGENAME = 'example-thumb';
	var imgPerSecond = '10';
	var widthPerImage = '400';
    var VIDEO_NAME = 'v_1_50.mp4';
	
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
	
	
	
	//get Video length
	//var videoLength = execCommand(pathToFfmpeg +' -i \"' + pathToVideo + '\" 2>&1');
	//console.log('videoLength: ' + videoLength);
	
	// get seconds per video
	
	//var vtt = new VTTCreator();
	//var secsPerImgae = vtt.getSecondsPerImageByImgNr(50,25);
	//console.log('seconds per image: ' + secsPerImgae);
}