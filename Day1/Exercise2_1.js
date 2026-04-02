// 1. Write the function to calculate the combination (Cnk)

function factorial(n){
    if (n === 0 || n === 1) {
        return 1;
    }
    else {
        return n * factorial(n - 1);
    }
}

function combination(n, k){
    if (k > n || k < 0) {
        return 0;
    }
    else {
        return factorial(n) / (factorial(k) * factorial(n - k));
    }
    
}

console.log(combination(6, 0));