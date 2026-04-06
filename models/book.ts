class Book{
    id: number;
    title: string;
    author: string;
    category: string;
    quantity: number;
    availableQuantity: number;
    
    constructor(id: number, title: string,author: string, category: string, quantity: number, availaleQuantity: number){
        this.id = id;
        this.title = title;
        this.author = author;
        this.category = category;
        this.quantity = quantity;
        this.availableQuantity = availaleQuantity;
        
    }
}

export default Book;