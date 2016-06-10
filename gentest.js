var fs = require('fs');
var Canvas2PNG = require('./core/canvas-to-png');
console.log('-------------------dataURL:');
var urls = Canvas2PNG.dummyThumbs(300,150,1);
console.log(urls);
console.log('-------------------dataURL:');

console.log('-------------------base64:');
var test = new Canvas2PNG(urls);
var images = test.getImgList();
console.log(images);
console.log('-------------------base64:');

/*
for(var i = 0; i<6; i++){
	imgs.push(fs.readFileSync('C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_00' + i + '.jpg'));
}
*/

/*var urls = ['C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_000.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_001.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_002.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_003.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_004.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_005.jpg']*/

var sprite = new Canvas2PNG(images);
sprite.writeFile('test.png');