var path = require('path');
var fs = require('fs');
var config = require('../config/config.json');
var waitUntil = require('wait-until');
var port = config.port;
var VTTCreator = require('./vtt-creator.js');
var fs = require('fs');
var threadCounter = 0;
var threadLimit = config.threadLimit;


exports.executeBatch = function() {
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
exports.executeBatch.path = 'executeBatch';

function execCLI(pathToFfmpeg, pathToVideo, imgPerSecond, widthPerImage, imagesToUse) {
	var cliCommand = 'START \"\" '+pathToFfmpeg + ' -i ' + pathToVideo + ' -r 1/' + imgPerSecond + ' -vf scale=' + widthPerImage + ':-1 ' + imagesToUse;
	var exec = require('child_process').exec;
	threadCounter = threadCounter + 1;
	//console.log('threadCounter = ' + threadCounter);
	//console.log('Started FFMPEG for video ' + pathToVideo);
	exec(cliCommand, function(error, stdout, stderr) {
		threadCounter = threadCounter - 1;
		//console.log('threadCounter = ' + threadCounter);
		//console.log('stdout: ', stdout);
		//console.log('stderr: ', stderr);
		if (error !== null) {
			console.log('exec error: ', error);
		}
		var logFile = config.logFile;
		var log = require('simple-node-logger').createSimpleFileLogger(logFile);
		log.info('Finished FFMPEG for video ' + pathToVideo);
		console.log('Finished FFMPEG for video ' + pathToVideo);
	});
}

function runMontage(pathToMontage, pathToThumbs, pathToSprite) {
	var c = require('child_process');
	var cliCommand = 'START \"\" '+pathToMontage + ' ' + pathToThumbs + ' -tile x1 -geometry +0+0 ' + pathToSprite;
    var result = c.exec(cliCommand);
	var deleteCommantd = 'rm -rf ' + pathToThumbs;
	//var result = c.exec(deleteCommantd);
	//fs.unlinkSync(pathToThumbs);
	//console.log(deleteCommantd);
}

function getVideoDurationInSeconds(pathToFfmpeg, pathToVideo) {
	var c = require('child_process');
	var cliCommand = pathToFfmpeg + ' -i ' + pathToVideo + ' 2>&1 | grep \'Duration\' | cut -d \' \' -f 4 | sed s/,//';
	var duration = c.execSync(cliCommand);
	var a = duration.toString().split(':'); 
	var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    return seconds;
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

exports.generateThumbs = function(path2thumbnails, path2videos, imgCountPerVideo){
    var PATH2SPRITE = path2thumbnails;
    var PATH2VIDEO = path2videos;
	
	var IMAGENAME = config.thumbName;
	var logFile = config.logFile;
	var log = require('simple-node-logger').createSimpleFileLogger(logFile);
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
			log.info(logMessage);
        }
        else {         
            var imageMagickDir = config.imagemagickDirectory;
            var FFMPEG = path.join(imageMagickDir, 'ffmpeg.exe"');
            var pathToFfmpeg = path.join(path.dirname(FFMPEG) , path.basename(FFMPEG));
            var pathToVideo = path.join(path.dirname(VIDEO) , path.basename(VIDEO));
            var imagesToUse = path.join(PATH_TO_THUMBS , path.basename(IMAGENAME +'%03d.png'));	
			var vtt = new VTTCreator();
			var videoInSeconds = getVideoDurationInSeconds(pathToFfmpeg, pathToVideo);
			var imgPerSecond = vtt.getSecondsPerImageByImgNr(videoInSeconds, imgCountPerVideo);
			
			//console.log('global threadCount=' +threadCounter);
			//while(threadLimit===threadCounter){}
			waitUntil()
			.interval(1000)
			.times(Infinity)
			.condition(function() {
				return (threadLimit!==threadCounter ? true : false);
			})
			.done(function(result) {
				console.log('ThreadCounter=('+ threadCounter +') Started FFMPEG for video ' + pathToVideo);
				execCLI(pathToFfmpeg,  pathToVideo, imgPerSecond, widthPerImage, imagesToUse);
			});

        }
	}
}
exports.generateThumbs.path = 'generateThumbs';

exports.generateSprite = function(path2thumbnails, path2videos, spriteName){ 
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
        var PATH_TO_THUMBS = path.join(PATH2THUMBS, guidList[index]);                    
		var imageMagickDir = config.imagemagickDirectory;
		var MONTAGE = path.join(imageMagickDir, 'montage.exe"'); 
		var pathToMontage = path.join(path.dirname(MONTAGE) , path.basename(MONTAGE));
		var pathToThumbs = path.join(PATH_TO_THUMBS , path.basename(IMAGENAME +'*.png'));
		var pathToSprite = path.join(PATH_TO_THUMBS , path.basename(spriteName));
		runMontage(pathToMontage, pathToThumbs, pathToSprite);
	}
}
exports.generateSprite.path = 'generateSprite';


exports.execCommand = function(command, callback) {
	const exec = require('child_process').exec;
	const child = exec(command,
		(error, stdout, stderr) => {
			//console.log(`stdout: ${stdout}`);
			//console.log(`stderr: ${stderr}`);
			if (error !== null) {
				console.log(`exec error: ${error}`);
			}
		callback();
	});
}
exports.execCommand.path = 'execCommand';

exports.montage = function(args, timeout, callback) {
  var procopt = {encoding: 'binary'};
  if (typeof timeout === 'function') {
    callback = timeout;
    timeout = 0;
  } else if (typeof timeout !== 'number') {
    timeout = 0;
  }
  if (timeout && (timeout = parseInt(timeout)) > 0 && !isNaN(timeout))
    procopt.timeout = timeout;
  return exec2(exports.montage.path, args, procopt, callback);
}
exports.montage.path = 'montage';

function exec2(file, args /*, options, callback */) {
  var options = { encoding: 'utf8'
                , timeout: 0
                , maxBuffer: 500*1024
                , killSignal: 'SIGKILL'
                , output: null
                };

  var callback = arguments[arguments.length-1];
  if ('function' != typeof callback) callback = null;

  if (typeof arguments[2] == 'object') {
    var keys = Object.keys(options);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (arguments[2][k] !== undefined) options[k] = arguments[2][k];
    }
  }

  var child = childproc.spawn(file, args);
  var killed = false;
  var timedOut = false;

  var Wrapper = function(proc) {
    this.proc = proc;
    this.stderr = new Accumulator();
    proc.emitter = new EventEmitter();
    proc.on = proc.emitter.on.bind(proc.emitter);
    this.out = proc.emitter.emit.bind(proc.emitter, 'data');
    this.err = this.stderr.out.bind(this.stderr);
    this.errCurrent = this.stderr.current.bind(this.stderr);
  };
  Wrapper.prototype.finish = function(err) {
    this.proc.emitter.emit('end', err, this.errCurrent());
  };

  var Accumulator = function(cb) {
    this.stdout = {contents: ""};
    this.stderr = {contents: ""};
    this.callback = cb;

    var limitedWrite = function(stream) {
      return function(chunk) {
        stream.contents += chunk;
        if (!killed && stream.contents.length > options.maxBuffer) {
          child.kill(options.killSignal);
          killed = true;
        }
      };
    };
    this.out = limitedWrite(this.stdout);
    this.err = limitedWrite(this.stderr);
  };
  Accumulator.prototype.current = function() { return this.stdout.contents; };
  Accumulator.prototype.errCurrent = function() { return this.stderr.contents; };
  Accumulator.prototype.finish = function(err) { this.callback(err, this.stdout.contents, this.stderr.contents); };

  var std = callback ? new Accumulator(callback) : new Wrapper(child);

  var timeoutId;
  if (options.timeout > 0) {
    timeoutId = setTimeout(function () {
      if (!killed) {
        child.kill(options.killSignal);
        timedOut = true;
        killed = true;
        timeoutId = null;
      }
    }, options.timeout);
  }

  child.stdout.setEncoding(options.encoding);
  child.stderr.setEncoding(options.encoding);

  child.stdout.addListener("data", function (chunk) { std.out(chunk, options.encoding); });
  child.stderr.addListener("data", function (chunk) { std.err(chunk, options.encoding); });

  var version = process.versions.node.split('.');
  child.addListener(version[0] == 0 && version[1] < 7 ? "exit" : "close", function (code, signal) {
    if (timeoutId) clearTimeout(timeoutId);
    if (code === 0 && signal === null) {
      std.finish(null);
    } else {
      var e = new Error("Command "+(timedOut ? "timed out" : "failed")+": " + std.errCurrent());
      e.timedOut = timedOut;
      e.killed = killed;
      e.code = code;
      e.signal = signal;
      std.finish(e);
    }
  });

  return child;
};