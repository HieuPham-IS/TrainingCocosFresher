import fs from 'fs'

function readData(path: string){
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (error: any) {
        console.log("File reading error", error.message);
    }
}

function writeData(path: string, data: any){
    try {
        fs.writeFileSync(path, data, 'utf8');
        return true;
    } catch (error: any) {
        console.log("File writing error", error.message);
        return false;
    }
}

export {readData, writeData};