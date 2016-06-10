var fs = require('fs');
var c2p = require('./core/canvas-to-png');
var urls = c2p.dummyThumbs(300,150,50);
var imgs = [];

/*
for(var i = 0; i<6; i++){
	imgs.push(fs.readFileSync('C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_00' + i + '.jpg'));
}
*/

/*var urls = ['C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_000.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_001.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_002.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_003.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_004.jpg', 'C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8\\thumb_005.jpg']*/
var sprite = new c2p(urls);
sprite.writeFile('2c14cc7b-636b-4d8e-ab8b-7f3f21f89ae8.png');