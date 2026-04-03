class User{
    constructor(id, name, email, phone){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.borrowbook = [];
    
    
    }

    static isValidEmail(email){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);

    }

    static isValidPhone(phone){
        const regex = /^(0[35789])[0-9]{8}$/;
        return regex.test(phone);
    }

    borrowBook(bookID){
        this.borrowbook.push(bookID);
    }

    returnBook(bookID){
        this.borrowbook = this.borrowbook.filter(id => id !== bookID)
    }
    
}

export default User;
