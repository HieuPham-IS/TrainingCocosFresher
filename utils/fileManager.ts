import fs from 'fs';

function readData(path: string){
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (error: any) {
        console.log("Lỗi đọc file", error.message);
    }
}

function writeData(path:string, data: any){
    try {
        fs.writeFileSync(path, data, 'utf-8');
        return true;
    } catch (error: any) {
        console.log("Lỗi ghi file", error.message);
        return false;
    }
}



export { readData, writeData};

