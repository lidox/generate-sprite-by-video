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

/*Canvas2PNG.prototype.generateSprite = function(srcList) {
	
	if(typeof srcList !== 'object' || srcList.length <= 0 || typeof srcList[0] !== 'string'){
		throw new TypeError('Invalid arguments');
	}
	
	var img = new Image();
	img.src = srcList[0];
	img.onload = function(){
	var baseWidth = img.width,
		baseHeight = img.height;
	
	var canvas = new Canvas(baseWidth * srcList.length, baseHeight);
	var ctx = canvas.getContext('2d');
	for (var i = 0; i< srcList.length; i++) {
		img = new Image();
		img.src = srcList[i];
		ctx.drawImage(img,i * baseWidth, 0);
	}
	return canvas.toDataURL("image/png");
	}
};*/

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

/*
Canvas2PNG.prototype.getDataUri = function(url, callback) {
    var image = new Image();
	image.src = url;
    image.onload = function () {
        var canvas = new Canvas(this.width, this.height),
			ctx = canvas.getContext('2d');
		ctx.drawImage(this, 0, 0, this.width, this.height);
		url = canvas.toDataURL('image/png')
        callback(url);
    };
}

Canvas2PNG.prototype.getImages = function() {
	var pathToImageList = ['C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_000.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_001.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_002.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_003.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_004.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_005.jpg'];
	
	var anImage = 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_000.jpg';
	
	// Usage
	this.getDataUri(anImage, function(dataUri) {
		console.log('result boom: ' + dataUri);
		// Do whatever you'd like with the Data URI!
	});
}
*/

Canvas2PNG.prototype.getImgList = function () {
	var pathToImageList = ['C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\061bba2b-cb06-4814-8b61-16d5483ad7c6\\example-thumb001.png', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\061bba2b-cb06-4814-8b61-16d5483ad7c6\\example-thumb002.png'];
	
	var imgList = [];
	for (var i = 0; i < pathToImageList.length; ++i) {
		imgList.push(this.getBase64_encode(pathToImageList[i]));
	}
	return imgList;
};

Canvas2PNG.prototype.readImage = function (divElem, callback) {
	var image = new Image();
    image.src = divElem;
    image.onload = function(){
        callback(image);
    };
};

// function to encode file data to base64 encoded string
Canvas2PNG.prototype.getBase64_encode = function (file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
	var dataURL = 'data:image/png;base64,' + new Buffer(bitmap).toString('base64')
    return dataURL;
}





// export the class
module.exports = Canvas2PNG;