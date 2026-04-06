import Book from "../models/book.ts";
import  {readData, writeData} from "../utils/fileManager.ts";
import User from "../models/user.ts";
import borrowrecord from "../models/borrowrecord.ts";

class Library{
    book: Book[];
    user: User[];
    borrowRecord: borrowrecord[];

    constructor(book: Book[], user: User[], borrowRecord: borrowrecord[]){
        this.book = book.map(books => new Book(books.id, books.title, books.author, books.category, books.quantity, books.availableQuantity));
        this.user = user.map(users => new User(users.id, users.name, users.email, users.phone));
        this.borrowRecord = borrowRecord.map(records => new borrowrecord(records.id, records.userID, records.bookID));

    }

    addBook(book: Book){
        if(this.book.some(b => b.id === book.id)){
            console.log("Sách đã tồn tại");
            return;
        }
        this.book.push(book);
        writeData("./data/book.json", JSON.stringify(this.book, null, 2));
        console.log("Thêm sách thành công");
    }

    addUser(user: User){
        if(this.user.some(u => u.id === user.id)){
            console.log("User đã tồn tại");
            return;
        }
        this.user.push(user);
        writeData("./data/user.json", JSON.stringify(this.user, null, 2));
        console.log("Thêm user thành công");
    }

    showBook(){
        console.log("Danh sách sách: ");
        readData("./data/book.json").forEach((book: Book) => {
            console.log(`ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Category: ${book.category}, Quantity: ${book.quantity}, Available Quantity: ${book.availableQuantity}`);
        });
    }

    showUser(){
        console.log("Danh sách user: ");
        readData("./data/user.json").forEach((user: User) => {
            console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Phone: ${user.phone}, Borrowed Books: ${user.borrowbook.join(", ")}`);
        });
    }

    borrowBook(userID: number, bookID: number){
        const user = this.user.find(u => u.id === userID);
        const book = this.book.find(b => b.id === bookID);

        if(!user){
            console.log("User không tồn tại");
            return;
        }
        if(!book){
            console.log("Sách không tồn tại");
            return;
        }
        if(book.availableQuantity <= 0){
            console.log("Sách đã hết");
            return;
        }
        book.availableQuantity--;
        const borrowRecord = new borrowrecord(this.borrowRecord.length + 1, userID, bookID);
        this.borrowRecord.push(borrowRecord);
        user.borrowbook.push(book.title);
        writeData("./data/borrowrecord.json", JSON.stringify(this.borrowRecord, null, 2));
        writeData("./data/user.json", JSON.stringify(this.user, null, 2));
        console.log("Mượn sách thành công");

        
    }

    returnBook(userID: number, bookID: number){
        const user = this.user.find(u => u.id === userID);
        const book = this.book.find(b => b.id === bookID);
        const record = this.borrowRecord.find(r => r.userID === userID && r.bookID === bookID && r.status === "borrowed");

        if(!user){
            console.log("User không tồn tại");
            return;
        }
        if(!book){
            console.log("Sách không tồn tại");
            return;
        }
        if(!record){
            console.log("Không tìm thấy thông tin mượn sách");
            return;
        }
        book.availableQuantity++;
        record.returnBook();
        user.borrowbook = user.borrowbook.filter(title => title !== book.title);
        writeData("./data/borrowrecord.json", JSON.stringify(this.borrowRecord, null, 2));
        writeData("./data/user.json", JSON.stringify(this.user, null, 2));
        console.log("Trả sách thành công");

    }

    deleteBook(bookID: number){
        const book = this.book.find(b => b.id === bookID);
        const record = this.borrowRecord.find(r => r.bookID ===bookID && r.status === "borrowed");
        if(!book){
            console.log("Sách không tồn tại");
            return;
        }
        if(record){
            console.log("Sách đang được mượn không thể  xoá");
            return;
        }
        this.book = this.book.filter(b => b.id !== bookID);
        writeData("./data/book.json", JSON.stringify(this.book, null, 2));
        console.log("Xoá sách thành công");

    }

    deleteBookByQuantity(bookID: number, amount: number){
        const book = this.book.find(b => b.id === bookID);
        if(!book){
            console.log("Sách không tồn tại");
            return;
        }
        if(amount <=0){
            console.log("Số lượng xoá không hợp lệ. Số lượng xoá phải lớn hơn 0");
            return;
        }
        if(amount > book.availableQuantity){
            console.log("Sách đang được mượn hết, không thể xoá");
            return;
        }
        book.quantity-= amount;
        book.availableQuantity -= amount;
        writeData("./data/book.json", JSON.stringify(this.book, null, 2));
        console.log(`Đã xoá ${amount} sách thành công`);

    }

    deleteUser(userID: number){
        const user = this.user.find(u => u.id === userID);
        const record = this.borrowRecord.find(r => r.userID ===userID && r.status === "borrowed");
        if(!user){
            console.log("User không tồn tại");
            return;
        }
        if(record){
            console.log("User đang mượn sách, không thể xoá");
            return;
        }
        this.user = this.user.filter(u => u.id !== userID);
        writeData("./data/user.json", JSON.stringify(this.user, null, 2));
        console.log("Xoá user thành công");
    }

    showRecords(){
        console.log("Lịch sử mượn sách");
        this.borrowRecord.forEach(record => {
            const user = this.user.find(u => u.id === record.userID);
            const book = this.book.find(b => b.id === record.bookID);
            console.log(`User: ${user ? user.name : 'Unknown'}, Book: ${book ? book.title : 'Unknown'}, Borrow Date: ${record.borrowDate.toLocaleDateString('vi-VN')}, Return Date: ${record.returnDate ? record.returnDate.toLocaleDateString('vi-VN') : 'Not returned'}, Status: ${record.status}`);
        })
    }

    findBookByTile(title: string){
        const found = this.book.filter(f => f.title.toLowerCase().includes(title.toLowerCase()));
        if(found.length === 0){
            console.log("Không tìm thấy sách");
            return;
        }
        console.log("Kết quả tìm: ");
        found.forEach(book => {
            console.log(`ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Category: ${book.category}, Quantity: ${book.quantity}, Available Quantity: ${book.availableQuantity}`);

        });

    }

}

export default Library;

