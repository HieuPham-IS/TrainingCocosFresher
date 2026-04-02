/* 4. Write the function get the get the Extension of file:
“image.png” => “png”. “Sound.mp3” => “mp3” */

function getFileExtension(filename){
    const part = filename.split('.');
    if (part.length > 1) {
        return part.pop();
    }
    else {        
        return '';
    }
}

console.log(getFileExtension("image.png"));
console.log(getFileExtension("Sound.mp3"));