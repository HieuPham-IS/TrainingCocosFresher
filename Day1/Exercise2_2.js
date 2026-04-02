// 2. Write the function to get a random integer between 2 numbers: min, max;

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomInt(1, 10));