import User from './user.js'
import Book from './book.js'
import Library from './library.js'
import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const library = new Library();

function menu(){
    console.log('\n======MENU======');
    console.log('1. Thêm sách');
    console.log('2. Thêm user');
    console.log('3. Xem sách');
    console.log('4. Xem user');
    console.log('5. Mượn sách');
    console.log('6. Trả sách');
    console.log('7. Xoá sách');
    console.log('8. Xoá user');
    console.log('9. Lịch sử mượn sách');
    console.log('0. Thoát');

    rl.question("Chọn chức năng: ", choice => {
        switch(choice){
            case '1':
                rl.question('Nhập id sách:', id => {
                    rl.question('Nhập tên sách:', title => {
                        rl.question('Nhập tác giả:', author => {
                            rl.question('Nhập thể loại:', category => {
                                rl.question('Nhập số lượng:', quantity => {
                                    const book = new Book(id, title, author, category, parseInt(quantity), parseInt(quantity));
                                    library.addBook(book);
                                    menu();
                                });
                            });
                        });
                    });
                })
                break;
            case '2':
                rl.question('Nhập id user:', id => {
                    rl.question('Nhập tên:', name => {
                        rl.question('Nhập email:', email => {
                            rl.question('Nhập số điện thoại:', phone => {
                                if(!User.isValidEmail(email)){
                                    console.log("Email không hợp lệ");
                                    return menu();
                                    
                                }

                                if(!User.isValidPhone(phone)){
                                    console.log("Số điện thoại không hợp lệ");
                                    return menu();
                                    
                                }

                                const user = new User(id, name, email, phone);
                                library.addUser(user);
                                menu();
                            
                            })
                        })
                    })
                })
                break;
            case '3':
                library.showBooks();
                break;
            case '4':
                library.showUsers();
                break;
            case '5':
                rl.question('Nhập id user:', userID => {
                    rl.question('Nhập id sách:', bookID => {
                        library.borrowBook(userID, bookID);
                        menu();
                    });
                });
                break;
            case '6':
                rl.question('Nhập id user:', userID => {
                    rl.question('Nhập id sách:', bookID => {
                        library.returnBook(userID, bookID);
                        menu();
                    });
                });
                break;
            case '7':
                rl.question('Nhập id sách:', bookID => {
                    library.deleteBook(bookID);
                    menu();
                });
                break;
            case '8':
                rl.question('Nhập id user:', userID => {
                    library.deleteUser(userID);
                    menu();
                });
                break;
            case '9':
                library.showRecords();
                menu();
                break;
            case '0':
                console.log('Thoát chương trình');
                rl.close();
                return;
            default:
                console.log('Lựa chọn không hợp lệ');
        }
        menu();
    });
}

menu()