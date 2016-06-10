var fs = require('fs');
var Canvas2PNG = require('./core/canvas-to-png');

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

