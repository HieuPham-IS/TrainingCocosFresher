class borrowRecord {
    id: number;
    userID: number;
    bookID: number;
    borrowDate: Date;
    returnDate: Date | null;
    status: string;

    constructor(id: number, userID: number, bookID: number){
        this.id = id;
        this.userID = userID;
        this.bookID = bookID;
        this.borrowDate = new Date();
        this.returnDate = null;
        this.status = "borrowed";
    }

    returnBook(){
        this.returnDate = new Date();
        this.status = "returned";
    }

}

export default borrowRecord;