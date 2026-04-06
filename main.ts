import realine from 'readline';
import Library from './context/library.ts'; 
import Book from "./models/book.ts";
import  { readData} from "./utils/fileManager.ts";
import User from "./models/user.ts";



const rl = realine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let booksData = readData('./data/book.json');
if (!booksData) booksData = [];

let usersData = readData('./data/user.json');
if (!usersData) usersData = [];

let borrowRecordsData = readData('./data/borrowrecord.json');
if (!borrowRecordsData) borrowRecordsData = [];

const library = new Library(booksData, usersData, borrowRecordsData);   

function inputEmail(callback: (email: string) => void){
    rl.question("Nhập email: ", email => {
        if (!User.isValidEmail(email)){
            console.log("Email không hợp lệ, nhập lại");
            inputEmail(callback);

        }
        else{
            callback(email);
        }
    })
}

function inputPhone(callback: (phone: string) => void){
    rl.question("Nhập số điện thoại: ", phone => {
        if (!User.isValidPhone(phone)){
            console.log("Số điện thoại không hợp lệ, nhập lại");
            inputPhone(callback);

        }
        else{
            callback(phone);
        }
    })
}

function inputBookId(callback: (id: number) => void){
    rl.question("Nhập ID sách: ", id => {
        if (library.book.some(b => b.id === parseInt(id))){
            console.log("ID sách đã tồn tại, nhập lại");
            inputBookId(callback);
        }
        else{
            callback(parseInt(id));
        }
    })
}

function inputUserId(callback: (id: number) => void){
    rl.question("Nhập ID user: ", id => {
        if (library.user.some(u => u.id === parseInt(id))){
            console.log("ID user đã tồn tại, nhập lại");
            inputUserId(callback);
        }
        else{
            callback(parseInt(id));
        }
    })
}



function menu(){
    console.log('\n======MENU======');
    console.log('1. Thêm sách');
    console.log('2. Thêm user');
    console.log('3. Xem sách');
    console.log('4. Xem user');
    console.log('5. Mượn sách');
    console.log('6. Trả sách');
    console.log('7. Xoá sách');
    console.log('8. Xoá sách theo số lượng');
    console.log('9. Xoá user');
    console.log('10. Lịch sử mượn sách');
    console.log('11. Tìm kiếm sách theo tên sách');
    console.log('0. Thoát');
    rl.question('Chọn chức năng: ', choice =>{
        switch(choice){
            case '1':
                inputBookId(bookId => {
                    rl.question("Nhập tên sách: ", title => {
                        rl.question("Nhập tác giả: ", author => {
                            rl.question("Nhập thể loại: ", category => {
                                rl.question("Nhập số lượng: ", quantity => {
                                    const book = new Book(bookId, title, author, category, parseInt(quantity), parseInt(quantity));
                                    library.addBook(book);
                                    menu();
                                })
                            })
                        })
                    })
                })
                break;
            
            case '2':
                inputUserId(userId => {
                    rl.question("Nhập tên: ", name => {
                        inputEmail(email =>{
                            inputPhone(phone =>{
                                const user = new User(userId, name, email, phone);
                                library.addUser(user);
                                menu();
                            })
                        })
                    })
                })
                break;

            case '3':
                library.showBook();
                menu();
                break;
            
            case '4':
                library.showUser();
                menu();
                break;
            
            case '5':
                rl.question("Nhập ID user: ", userID => {
                    rl.question("Nhập ID sách: ", bookID => {
                        library.borrowBook(parseInt(userID), parseInt(bookID));
                        menu();
                    })
                })
                break;

            case '6':
                rl.question('Nhập id user:', userID => {
                    rl.question('Nhập id sách:', bookID => {
                        library.returnBook(parseInt(userID), parseInt(bookID));
                        menu();
                    });
                });
                break;
            
            case '7':
                rl.question('Nhập id sách:', bookID => {
                    library.deleteBook(parseInt(bookID));
                    menu();
                });
                break;
            
            case '8':
                rl.question("Nhập ID sách: ", bookID => {
                    rl.question("Nhập số lượng cần xoá: ", amount => {
                        library.deleteBookByQuantity(parseInt(bookID), parseInt(amount));
                        menu();
                    })
                });
                break;
            
            case '9':
                rl.question('Nhập id user:', userID => {
                    library.deleteUser(parseInt(userID));
                    menu();
                });
                break;
            
            case '10':
                library.showRecords();
                menu();
                break;
            
            case '11':
                rl.question("Nhập tên sách cần tìm: ", title => {
                    library.findBookByTile(title);
                    menu();
                })
                break;
            
            case '0':
                console.log('Thoát chương trình');
                rl.close();
                return;
            default:
                console.log('Lựa chọn không hợp lệ');
            }
    });
}

menu();