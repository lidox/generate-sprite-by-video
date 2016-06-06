function VTTCreator() {}

VTTCreator.prototype.getTextOfVTT = function(spriteFile, singleImageWidth, singleImageHeight, videoLenghtInSeconds, imageRepetitionInPercent) {
  		var textToReturn = '';
		textToReturn = ('WEBVTT' + '\n');
		textToReturn += ('' + '\n');
		
		var secondsPerImage = this.getSecondsPerImage(videoLenghtInSeconds, imageRepetitionInPercent);
		var xPosition = 0;
		
		for (i = 0; i < (videoLenghtInSeconds) ;) { 
			
			textToReturn += (this.secondsTohhmmss(i) + ' --> ' + this.secondsTohhmmss( (i + secondsPerImage) ) + '\n');
			textToReturn += (spriteFile + '#xywh=' + xPosition + ',0,' + singleImageWidth + ',' + singleImageHeight + '\n');
			textToReturn += ('' + '\n');
			
			xPosition += singleImageWidth;
			i += secondsPerImage;
		}
	return textToReturn;
};

VTTCreator.prototype.secondsTohhmmss = function(totalSeconds) {
		var hours   = Math.floor(totalSeconds / 3600);
		var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  		var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

  		// round seconds
  		seconds = Math.round(seconds * 100) / 100

  		var result = (hours < 10 ? "0" + hours : hours);
    	result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    	result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
		
	    if (result.indexOf(".") == -1) {
	    	result += "." + ("000");
		}

  		return result;
};

VTTCreator.prototype.getSecondsPerImage = function(videoLenghtInSeconds, imageRepetitionInPercent) {
		var onePercentInSeconds = videoLenghtInSeconds / 100;
		var secondsPerImage = onePercentInSeconds * imageRepetitionInPercent;
  		return secondsPerImage;
};

VTTCreator.prototype.getSecondsPerImageByImgNr = function(videoLenghtInSeconds, imageByImgNr) {
		var seconds = videoLenghtInSeconds / imageByImgNr;
  		return seconds;
};

// export the class
module.exports = VTTCreator;