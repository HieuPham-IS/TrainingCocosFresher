class User{
    id: number;
    name: string;
    email: string;
    phone: string;
    borrowbook: string[];

    constructor(id: number, name: string, email: string, phone: string, borrowbook: string[] = []){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.borrowbook = borrowbook;

    }

    static isValidEmail(email: string){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static isValidPhone(phone: string){
        const regex = /^(0[35789])[0-9]{8}$/;
        return regex.test(phone);
    }
   
}

export default User;