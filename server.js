var express = require('express');
var app = express();
var path = require('path');
var port = 443;
var VTTCreator = require('./vtt-creator.js');

// middleware
app.use(express.static(__dirname + '/public'));

// index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

//C:/Users/schaefa/Desktop/convert.bat
app.listen(port, function () {
    console.log('App listening on port ' + port);
    //executeBatch();
	var FFMPEG = '\"C:\\Program Files\\ImageMagick-6.9.3-Q16\\ffmpeg.exe\"';
	var VIDEO = 'C:\\Users\\schaefa\\Desktop\\Testing\\movies\\5ca7a557-4085-4a15-9e84-eea45927e9b1\\v_1_50.mp4';
	var IMAGENAME = 'example-thumb';
	
	var pathToFfmpeg = path.join(path.dirname(FFMPEG) , path.basename(FFMPEG));
	var pathToVideo = path.join(path.dirname(VIDEO) , path.basename(VIDEO));
	var imgPerSecond = '10';
	var widthPerImage = '400';
	var imagesToUse = path.join(path.dirname(VIDEO) , path.basename(IMAGENAME +'%03d.png'));
	//execCLI(pathToFfmpeg,  pathToVideo,imgPerSecond, widthPerImage, imagesToUse);
	
	//get Video length
	var videoLength = execCommand(pathToFfmpeg +' -i \"' + pathToVideo + '\" 2>&1');
	console.log('videoLength: ' + videoLength);
	
	// get seconds per video
	var vtt = new VTTCreator();
	var secsPerImgae = vtt.getSecondsPerImageByImgNr(50,25);
	console.log('seconds per image: ' + secsPerImgae);
});

function createSpriteByPNGs(srcToImages, dstToSprite) {
	var im = require('imagemagick');
	im.montage([srcToImages, '-tile', 'x1', '-geometry', '+0+0', dstToSprite],
	function(err, metadata){
		if (err) throw err
		console.log('stdout:', stdout);
	});
}

function executeBatch() {
    var batchFileWithPath = 'batch/convert.bat';
    var spawn = require('child_process').spawn,
    ls = spawn('cmd.exe', ['/c', batchFileWithPath]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
}

function execCLI(pathToFfmpeg, pathToVideo, imgPerSecond, widthPerImage, imagesToUse) {
	var pathToFfmpegIsAbsolute = path.isAbsolute(pathToFfmpeg)  // true
	console.log('pathToFfmpegIsAbsolute: ' + pathToFfmpegIsAbsolute);
	const exec = require('child_process').exec;
	var cliCommand = pathToFfmpeg + ' -i ' + pathToVideo + ' -r 1/' + imgPerSecond + ' -vf scale=' + widthPerImage + ':-1 ' + imagesToUse;
	console.log('cliCommand: ' + cliCommand);
	const child = exec(cliCommand,
		(error, stdout, stderr) => {
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			if (error !== null) {
				console.log(`exec error: ${error}`);
			}
	});
	
	// delete png after sprite done
}

// "ffmpeg -i \"{$videofile}\" 2>&1"
function execCommand(command, callback) {
	const exec = require('child_process').exec;
	const child = exec(command,
		(error, stdout, stderr) => {
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			if (error !== null) {
				console.log(`exec error: ${error}`);
			}
		callback();
	});
	// delete png after sprite done
}
