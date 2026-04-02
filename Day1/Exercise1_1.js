/*1. Write a function to format money string 
10000000 => “10,000,000" || 123456 => “123,456" || 12000.02 => "12,000.02" */

function formatMoney(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

console.log(formatMoney(10000000));
console.log(formatMoney(123456));
console.log(formatMoney(12000.02));


