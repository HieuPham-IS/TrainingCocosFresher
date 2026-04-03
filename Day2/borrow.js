class BorrowRecord{
    constructor(id, userID, bookID){
        this.id = id;
        this.userID = userID;
        this. bookID = bookID;
        this.borrowDate = new Date();
        this.returnDate = null;
        this.status = "Đã Mượn";
    }

    returnBook(){
        this.returnDate = new Date();
        this.status = "Đã Trả";
    }

    isReturned(){
        return this.status === "Đã Trả";
    }


}

export default BorrowRecord;