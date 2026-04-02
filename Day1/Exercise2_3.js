// 3. Write the function get a random element from an arrays.

function randomElement(arr){
    const random = Math.floor(Math.random() * arr.length);
    return arr[random];
}

console.log(randomElement([1, 2, 3, 4, 5]));