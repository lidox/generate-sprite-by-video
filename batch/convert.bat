echo hallo welt

REM variables
set pathToImagaMagick = C:\Program Files\ImageMagick-6.9.3-Q16\
set pathToVideo = C:\Users\schaefa\Videos\

REM https://gist.github.com/lidox/514cd589805944bb31258f856f8cc21f
%pathToImagaMagick%ffmpeg.exe -i %pathToVideo%example-video.mp4 -r 1/0.78 -vf scale=400:-1 %pathToVideo%example-video%03d.png

Rem C:\Users\schaefa>"C:\Program Files\ImageMagick-6.9.3-Q16\montage.exe" C:\Users\schaefa\Videos\example-video*.png -tile x1 -geometry +0+0 C:\Users\schaefa\Videos\example-video-sprite.png
