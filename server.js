var config = require('./config/config.json');
var express = require('express');
var app = express();
var path = require('path');
var port = config.port;
var VTTCreator = require('./core/vtt-creator.js');
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
    
    var PATH2SPRITE = 'C:\\Users\\russland\\Desktop\\Testing\\thumbs';
    var PATH2VIDEO = 'C:\\Users\\russland\\Desktop\\Testing\\movies';
    //var PATH2SPRITE = 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs';
    //var PATH2VIDEO = 'C:\\Users\\schaefa\\Desktop\\Testing\\movies';
	
	var IMAGENAME = 'example-thumb';
	var imgPerSecond = '10';
	var widthPerImage = '400';
    var VIDEO_NAME = 'v_1_50.mp4';
	

	
	//iterate over all folders inside movie folder:
	var guidList = getDirectories(PATH2VIDEO);
	var index;
	for (index = 0; index < guidList.length; ++index) {
		//console.log('guiid:' + guidList[index]);
        //var VIDEO = PATH2VIDEO + '\\5ca7a557-4085-4a15-9e84-eea45927e9b1\\v_1_50.mp4';
        var VIDEO = path.join(path.join(PATH2VIDEO , guidList[index]), VIDEO_NAME); 
        var PATH_TO_THUMBS = path.join(PATH2SPRITE, guidList[index]);
        //console.log('PATH_TO_THUMBS: ' + PATH_TO_THUMBS);
        if (!fs.existsSync(PATH_TO_THUMBS)){
            fs.mkdirSync(PATH_TO_THUMBS);
            console.log('create new folder: ' + PATH_TO_THUMBS);
        }
        
        // check if video exists   
        if (!fs.existsSync(VIDEO)){
            console.log('video does not exist: ' + VIDEO);
            // TODO: create log file
        }
        else {         
            //console.log(VIDEO);
            var imageMagickDir = config.imagemagickDirectory;
            var FFMPEG = imageMagickDir+'\\ffmpeg.exe\"';
            var pathToFfmpeg = path.join(path.dirname(FFMPEG) , path.basename(FFMPEG));
            var pathToVideo = path.join(path.dirname(VIDEO) , path.basename(VIDEO));
            var imagesToUse = path.join(PATH_TO_THUMBS , path.basename(IMAGENAME +'%03d.png'));
            console.log('------------------');
            console.log(index+ '. Versuch');
            //console.log('pathToFfmpeg: ' + pathToFfmpeg + ' | pathToVideo:' + pathToVideo + ' | imgPerSecond:' + imgPerSecond+ ' | widthPerImage: ' + widthPerImage+ ' | imagesToUse:' + imagesToUse);
            im.execCLI(pathToFfmpeg,  pathToVideo, imgPerSecond, widthPerImage, imagesToUse);
        }

	}

	
	
	
	//get Video length
	//var videoLength = execCommand(pathToFfmpeg +' -i \"' + pathToVideo + '\" 2>&1');
	//console.log('videoLength: ' + videoLength);
	
	// get seconds per video
	
	//var vtt = new VTTCreator();
	//var secsPerImgae = vtt.getSecondsPerImageByImgNr(50,25);
	//console.log('seconds per image: ' + secsPerImgae);
});

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}