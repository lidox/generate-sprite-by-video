var Canvas = require('canvas'),
	Image = Canvas.Image,
	fs = require('fs'),
	path = require('path');
	//async = require('async');

// https://developer.mozilla.org/de/docs/Web/API/HTMLCanvasElement/toBlob
// https://github.com/Automattic/node-canvas
function Canvas2PNG(imgList) {
	/*if(typeof srcList !== 'object' || srcList.length <= 0 || typeof srcList[0] !== 'string'){
		throw new TypeError('Invalid arguments');
	}*/
	var img = new Image();
	img.src = imgList[0];
	//img.onload = function(){
	var baseWidth = img.width,
		baseHeight = img.height;

	var canvas = new Canvas(baseWidth * imgList.length, baseHeight);
	var ctx = canvas.getContext('2d');
	//console.log(imgList);

	/*
	async.forEachOf(imgList, function(i, element){
		console.log('...' + i + ':' + element);
	});
	*/

	for (var i = 0; i< imgList.length; i++) {
		img = new Image();
		img.src = imgList[i];
		ctx.drawImage(img,i * baseWidth, 0);
	}
	//}
	this.canvas = canvas;
	return canvas.toDataURL("image/png");
}

Canvas2PNG.prototype.canvas = undefined;

Canvas2PNG.prototype.toDataURL = function(type){
	if(typeof type === 'undefined'){
		type = 'image/png';
	}
	return this.canvas.toDataURL(type);
}

Canvas2PNG.prototype.pngStream = function(){
	return this.canvas.pngStream();
}

Canvas2PNG.prototype.writeFile = function(file){
	if(typeof file === 'string'){
		if(file[0] !== '/'){
			file = path.join(__dirname, file);
			console.log(file);
		}
		file = fs.createWriteStream(file);
	}
	var stream = this.canvas.pngStream();
	stream.on('data', function(chunk){
		file.write(chunk);
	});

	stream.on('end', function(){
		file.end();
		return true;
	});
}

Canvas2PNG.dummyThumbs = function(width, height, count) {
	var thumbList = [];
	
	var canvas = new Canvas(width, height),
		ctx = canvas.getContext('2d');
	
	for (var i = 0; i< count; i++) {
		ctx.fillStyle = "#0" + (i%2===0?"0":"f") + "0";
		ctx.fillRect(0,0,width,height)

		ctx.fillStyle = "#fff";
		ctx.fillText('Big Boom ' + (i+1), 150, 75);
		thumbList.push(canvas.toDataURL("image/png"));
	}
	return thumbList;
}

Canvas2PNG.prototype.getImgList = function (imagaPaths) {
	var pathToImageList = imagaPaths;//['C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\061bba2b-cb06-4814-8b61-16d5483ad7c6\\example-thumb001.png', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\061bba2b-cb06-4814-8b61-16d5483ad7c6\\example-thumb002.png'];
	
	var imgList = [];
	for (var i = 0; i < pathToImageList.length; ++i) {
		imgList.push(this.getBase64_encode(pathToImageList[i]));
	}
	return imgList;
};

Canvas2PNG.prototype.getBase64_encode = function (file) {
    var bitmap = fs.readFileSync(file);
	var dataURL = 'data:image/png;base64,' + new Buffer(bitmap).toString('base64')
    return dataURL;
}

Canvas2PNG.prototype.getAllImagePathsByFolderPath = function (folderPath, imageName) {
	var imagePaths = [];
	fs.realpath(folderPath, function(err, path) {
		if (err) {
			console.log(err);
		 return;
		}
		console.log('Path is : ' + path);
	});
	
	var files = fs.readdirSync(folderPath);
	files.forEach(function(f) {
		var imageFile = path.join(folderPath, f);
		if(f.startsWith(imageName)){
			imagePaths.push(imageFile);
			console.log(imageFile);
		}

	});
	/*fs.readdir(folderPath, function(err, files) {
		if (err) return;
		files.forEach(function(f) {
			var imageFile = path.join(folderPath, f);
			if(f.startsWith(imageName)){
				imagePaths.push(imageFile);
				console.log(imageFile);
			}
			
		});
	});*/
	return imagePaths;
}

// export the class
module.exports = Canvas2PNG;