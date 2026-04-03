import BorrowRecord from './borrow.js'

class Library{
    constructor(){
        this.user = [];
        this.book = [];
        this.borrowRecord = [];

    }

    addUser(user){
        if(this.user.some(u => u.id === user.id)){
            console.log("User đã tồn tại");
            return;
        }
        this.user.push(user);
        console.log("Thêm user thành công");
    }

    addBook(book){
        this.book.push(book);
        console.log("Thêm sách thành công");
    }

    showBooks(){
        console.log("\nDanh sách sách:");
        this.book.forEach(book => {
            console.log(`ID: ${book.id}, Tên sách: ${book.title}, Tác giả: ${book.author}, Thể loại: ${book.category}, Số lượng: ${book.quantity}, Có sẵn: ${book.availableQuantity}`);
        })

    }

    showUsers(){
        console.log("\nDanh sách user:");
        this.user.forEach(user =>{
            console.log(`ID: ${user.id}, Tên: ${user.name}, Email: ${user.email}, SĐT: ${user.phone}, Sách đã mượn: ${user.borrowbook.join(', ')}`);
        })
    }

    borrowBook(userID, bookID){
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

        const borrowRecord = new BorrowRecord(this.borrowRecord.length + 1, userID, bookID);
        this.borrowRecord.push(borrowRecord);
        user.borrowBook(bookID);
        book.availableQuantity--;
        console.log("Mượn sách thành công");
    }

    returnBook(userID, bookID){
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

        const borrowRecord = this.borrowRecord.find(br => br.userID === userID && br.bookID === bookID && !br.isReturned());

        if(!borrowRecord){
            console.log("Không tìm thấy bản ghi mượn sách");
            return;
        }

        borrowRecord.returnBook();
        user.returnBook(bookID);
        book.availableQuantity++;
        console.log("Trả sách thành công");
    }

    deleteBook(bookID){
        this.book = this.book.filter(b => b.id !== bookID);
        console.log("Xoá sách thành công");
    }

    deleteBook(userID){
        this.user = this.user.filter(u => u.id !== userID);
        console.log("Xoá user thành công");
    }

    showRecords(){
        console.log('\nLịch sử mượn sách:');
        this.borrowRecord.forEach(record => {
            const user = this.user.find(u => u.id === record.userID);
            const book = this.book.find(b => b.id === record.bookID);
            console.log(`User: ${user ? user.name : 'Unknown'}, Book: ${book ? book.title : 'Unknown'}, Borrow Date: ${record.borrowDate.toLocaleDateString()}, Return Date: ${record.returnDate ? record.returnDate.toLocaleDateString() : 'Not returned'}, Status: ${record.status}`);
        })
    }
}

export default Library;

