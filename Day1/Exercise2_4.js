// 4. Given two arrays of integers, find which elements in the second array are missing from the first array.


function findMissingElements(arr1, arr2){
    const missingElements = [];
    for (const element of arr2){
        if (!arr1.includes(element)){
            missingElements.push(element);
        }
    }
    return missingElements;

}

console.log(findMissingElements([1, 2, 3, 4], [2, 3, 4, 5]));