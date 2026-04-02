/* 3. Write the function to count how many words appear in a string:
 oneTwoThree => 3 */

function countWords(str){
    
    return str.split(/(?=[A-Z])/).length;

}

console.log(countWords("oneTwoThree"));      


