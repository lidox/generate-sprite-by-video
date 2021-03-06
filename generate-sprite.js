var config = require('./config/config.json');
var path = require('path');
var VTTCreator = require('./core/vtt-creator.js');
var im = require('./core/imagemagick-cli.js');
var fs = require('fs');

/* GENERATE THUMBS BY VIDEO */

var path2videos = process.argv[2]; //  -> node server.js firstArgument secondArgument
var path2thumbnails = process.argv[3];
var imgCountPerVideo = process.argv[4];

if ( (typeof path2videos === 'undefined')  && (typeof path2thumbnails === 'undefined') && (typeof imgCountPerVideo !== 'number') )
{
  console.log('Invalid! Use for example:  node generate-sprite.js C:\\\\Users\\\\artur\\\\Desktop\\\\Testing\\\\movies C:\\\\Users\\\\artur\\\\Desktop\\\\Testing\\\\thumbs 10');
}
else{
	imgCountPerVideo = imgCountPerVideo - 2;
	im.generateSprite(path2thumbnails, path2videos, "sprite.png");
	//TODO: DELETE thumbs
	console.log('generating sprites should finish in some seconds...');
}


/* CANVAS: GENERATE SPRITE BY THUMBS
// boring stuff
var urls = Canvas2PNG.dummyThumbs(300,150,1);
var test = new Canvas2PNG(urls);

// Pfad zu den dateien
var imagaPaths = test.getAllImagePathsByFolderPath('C:\\Users\\schaefa\\Desktop\\Testing\\thumbs\\061bba2b-cb06-4814-8b61-16d5483ad7c6', 'example-thumb')

// read images to memory
var images = test.getImgList(imagaPaths);

// create sprite via  canvas
var sprite = new Canvas2PNG(images);

// write sprite to disc
sprite.writeFile('test.png');
*/