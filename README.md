#Generate sprite by video

Example sprite:
![spritename](https://cloud.githubusercontent.com/assets/7879175/16196433/3208a47c-36fe-11e6-8bd5-06393ddbfca6.png)

#Introduction

The "generate-sprite-by-video" can be used to generate sprites by video file using ImageMagick.

#Requirements

1. Install [Node.js](https://nodejs.org/en/download/)
2. If your command line does not support ['grep' command](http://www.tutorialspoint.com/unix_commands/grep.htm), install [Git Bash](https://git-scm.com/downloads)
3. Install [ImageMagick] (http://www.imagemagick.org/script/binary-releases.php) and check 'install legacy utilities'-checkbox

---------------


Install: 
----
        1. git clone https://github.com/lidox/generate-sprite-by-video.git
        2. 'npm install' in order to install dependecies
        3. Edit config/config.json
        
Proper Use:
----

```javascript
node generate-thumbs.js [path-to-movies] [path-to-thumbs] [thumbnail-count]

example: node generate-thumbs.js C:\\Users\\bob\\Desktop\\Testing\\movies C:\\Users\\bob\\Desktop\\Testing\\thumbs 50
```


