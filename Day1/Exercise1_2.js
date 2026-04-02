/* 2. Write a function for format money in shorten :
1000 => 1K, 1123400000 => 1.12B , 1342222 => 1.34M */

function formatShortMoney(n) {
    if (n >= 1e9) {
        return (n /1e9).toFixed(2) + 'B';
    }
    if (n >= 1e6) {
        return (n /1e6).toFixed(2) + 'M';
    }
    if (n === 1e3) {
        return (n /1e3) + 'K';
    }
    if (n > 1e3){
        return (n / 1e3).toFixed(2) + 'K';
    }
    return n.toString();
}

console.log(formatShortMoney(1000)); 
console.log(formatShortMoney(1123400000)); 
console.log(formatShortMoney(1342222)); 