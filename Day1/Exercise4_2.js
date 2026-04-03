/* 2. print how to read number in vietnamese: n integer < 1,000,000
726503 : bảy mươi hai vạn sáu ngàn năm trăm linh ba. */

function readNumber(n){

    const units = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    if (n === 0) return units[0];

    if (n < 10) return units[n];

    if (n >= 10 && n < 100) {
        let rest = n % 10000;
        let last = rest % 1000;
        let result = '';
        result += readHundreds(last);
        return result.trim();
    }
    function readHundreds(n){
        let hundreds = Math.floor(n / 100);
        let tens = Math.floor((n % 100) / 10);
        let ones = n % 10;
        let result = '';
        
        if (hundreds > 0) {
            result += units[hundreds] + ' trăm ';
        }
        if (tens > 1){
            result += units[tens] + ' mươi ';
        }
        else if (tens === 1){
            result += 'mười ';
        }
        else if (tens === 0 && ones > 0 ){
            result += 'linh ';
        }
        if (ones > 0){
            result += units[ones] ;
        }
        return result.trim();

    }

    let van = Math.floor(n / 10000);
    let rest = n % 10000;
    let thousand = Math.floor(rest / 1000);
    let tram = n % 1000;
    let last = rest % 1000;
    let result = '';
    if (van > 0){
        result += readHundreds(van) + ' vạn ';
    }
    if (thousand > 0){
        result += units[thousand] + ' ngàn ';
    }
    if (0 < tram && tram < 100){
        result += units[0] + ' trăm ';
    }

    if (last > 0){
        result += readHundreds(last);
    }
    
    return result.trim();

    
}

console.log(readNumber(726003));
console.log(readNumber(5));
console.log(readNumber(25));
console.log(readNumber(105));
console.log(readNumber(10));
console.log(readNumber(1005));
console.log(readNumber(120021));
console.log(readNumber(100001));