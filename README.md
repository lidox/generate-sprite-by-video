#Generate sprite by video

#Introduction

The "generate-sprite-by-video" can be used to generate sprites by video file using ImageMagick.

#Requirements

- [Node.js](https://nodejs.org/en/download/)
- ['grep' command](http://www.tutorialspoint.com/unix_commands/grep.htm)
- [ImageMagick] (http://www.imagemagick.org/script/binary-releases.php)

---------------


Install: 
----
        1. git clone https://github.com/lidox/generate-sprite-by-video.git
        2. npm install
        
Proper Use:
----
You need to be in a Fiber to be able to use wait.for. The ideal place to launch a fiber
is when a request arrives, to handle it:

```javascript
node generate-thumbs.js [path-to-movies] [path-to-thumbs] [thumbnail-count]

example: node generate-thumbs.js C:\\Users\\bob\\Desktop\\Testing\\movies C:\\Users\\bob\\Desktop\\Testing\\thumbs 50
```


