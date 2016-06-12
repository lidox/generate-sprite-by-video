var path = require('path');

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

exports.execCLI = function(pathToFfmpeg, pathToVideo, imgPerSecond, widthPerImage, imagesToUse) {
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
}
exports.execCLI.path = 'execCLI';

//"C:\Program Files\ImageMagick-6.9.3-Q16\montage.exe" C:\Users\schaefa\Videos\example-video*.png -tile x1 -geometry +0+0 C:\Users\schaefa\Videos\example-video-sprite.png
exports.runMontage = function(pathToMontage, pathToThumbs, pathToSprite) {
	const exec = require('child_process').exec;
	var cliCommand = pathToMontage + ' ' + pathToThumbs + ' -tile x1 -geometry +0+0 ' + pathToSprite;
	console.log('cliCommand: ' + cliCommand);
	const child = exec(cliCommand,
		(error, stdout, stderr) => {
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			if (error !== null) {
				console.log(`exec error: ${error}`);
			}
	});
	// TODO: delete png after sprite done
}
exports.runMontage.path = 'runMontage';


exports.execCommand = function(command, callback) {
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