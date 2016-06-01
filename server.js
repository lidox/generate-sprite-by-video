var express = require('express');
var app = express();
var path = require('path');
var port = 443;

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
	// "C:\Program Files\ImageMagick\ffmpeg.exe" -i C:\Users\artur\Desktop\testing\video.mp4 -r 1/15 -vf scale=400:-1 C:\Users\artur\Desktop\testing\example-video%03d.png
	// "C:\Program Files\ImageMagick\montage.exe" C:\Users\artur\Desktop\testing\example-video*.png -tile x1 -geometry +0+0 C:\Users\artur\Desktop\testing\example-video-sprite.png
	var im = require('imagemagick');
	im.montage(['C:\\Users\\artur\\Desktop\\testing\\example-video*.png', '-tile', 'x1', '-geometry', '+0+0', 'C:\\Users\\artur\\Desktop\\testing\\example-video-sprite-node.png'],
	function(err, metadata){
		if (err) throw err
		console.log('stdout:', stdout);
	});
});

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