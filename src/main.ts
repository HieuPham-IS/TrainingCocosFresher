import readline from "readline";
import { AccountServices } from "./services/account.services";
import { CustomerServices } from "./services/customer.services";
import { ProductServices } from "./services/product.services";
import { InvoiceServices } from "./services/invoice.services";
import { TransactionServices } from "./services/transaction.services";
import { AccountModel } from "./models/Account";
import { CustomerModel } from "./models/Customer";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const service = new AccountServices();
const customerService = new CustomerServices();
const productService = new ProductServices();
const invoiceService = new InvoiceServices();
const transactionService = new TransactionServices();

function start() {
    console.log("\n===== LOGIN =====");

    rl.question("Username: ", (username) => {
        rl.question("Password: ", (password) => {
        const user = service.loginAccount(username, password);

        if (!user) {
            return start();
        }

        menu(user);
        });
    });
}

function menu(user: AccountModel) {
    console.log(`\n===== MENU (${user.role}) =====`);

    if (user.role === "ADMIN" || user.role === "MANAGER") {
        console.log("1. Create Account");
        console.log("2. Manage (Staff work)");
        console.log("3. Logout");
        console.log("0. Exit");

    rl.question("Choose: ", (choice) => {
    switch (choice) {
        case "1":
            createAccount(user);
            break;
        case "2":
            manageMenu(user);
            break;
        case "3":
            start();
            break;
        case "0":
            rl.close();
            break;
        default:
            menu(user);
      }
    });

    } else {
    console.log("1. Manage (Staff work)");
    console.log("2. Logout");
    console.log("0. Exit");

    rl.question("Choose: ", (choice) => {
      switch (choice) {
        case "1":
          manageMenu(user);
          break;
        case "2":
          start();
          break;
        case "0":
          rl.close();
          break;
        default:
          menu(user);
      }
    });
  }
}

function createAccount(currentUser: AccountModel) {
    console.log("\n=== CREATE ACCOUNT ===");

    rl.question("Username: ", (username) => {
        rl.question("Password: ", (password) => {
        rl.question("Role (ADMIN/MANAGER/STAFF): ", (roleInput) => {

            const role = roleInput.toUpperCase() as "ADMIN" | "MANAGER" | "STAFF";
            if (!["ADMIN", "MANAGER", "STAFF"].includes(role)) {
                console.log("Invalid role. Try again.");
                return createAccount(currentUser);
            }
            service.registerAccount(currentUser, {
            id: "",
            staffId: "",
            username,
            password,
            role
            });

            menu(currentUser);
        });
        });
    });
}

function manageMenu(user: AccountModel) {
    console.log("\n=== STAFF MANAGEMENT ===");
    console.log("1. Manage Customers");
    console.log("2. Manage Products");
    console.log("3. Create Invoice");
    console.log("4. Process Return");
    console.log("5. Manage Transactions");
    console.log("0. Back");

    rl.question("Choose: ", (choice) => {
        switch (choice) {
        case "1":
            customerMenu(user);
            break;
        case "2":
            productMenu(user);
            break;
        case "3":
            createInvoiceMenu(user);
            break;
        case "4":
            processReturnMenu(user);
            break;
        case "5":
            transactionMenu(user);
            break;
        case "0":
            menu(user);
            break;
        default:
            manageMenu(user);
        }
    });
}

function addCustomerMenu(user: AccountModel) {
    console.log("\n=== ADD CUSTOMER ===");

    rl.question("Name: ", (name) => {
        if (!name.trim()) {
            console.log("Name cannot be empty. Try again.");
            return addCustomerMenu(user);
        }

        rl.question("Phone: ", (phone) => {
            if(!CustomerModel.isValidPhone){
                console.log("Invalid email, please re-enter");
                return addCustomerMenu(user);
            }

            customerService.addCustomer({
                name: name.trim(),
                phone: phone.trim(),
                totalSpent: 0,
                rank: "NORMAL"
            });

            manageMenu(user);
        });
    });
}

function deleteCustomerMenu(user: AccountModel) {
    console.log("\n=== DELETE CUSTOMER ===");

    rl.question("Customer ID: ", (id) => {
        if (!id.trim()) {
            console.log("ID cannot be empty. Try again.");
            return deleteCustomerMenu(user);
        }

        customerService.deleteCustomer(id.trim());
        customerMenu(user);
    });
}

function customerMenu(user: AccountModel) {
    console.log("\n=== CUSTOMER MANAGEMENT ===");
    console.log("1. Add Customer");
    console.log("2. Delete Customer");
    console.log("3. List Customers");
    console.log("0. Back");

    rl.question("Choose: ", (choice) => {
        switch (choice) {
        case "1":
            addCustomerMenu(user);
            break;
        case "2":
            deleteCustomerMenu(user);
            break;
        case "3":
            listCustomers(user);
            break;
        case "0":
            manageMenu(user);
            break;
        default:
            customerMenu(user);
        }
    });
}

function listCustomers(user: AccountModel) {
    console.log("\n=== CUSTOMERS ===");
    const customers = customerService.getAllCustomers();
    if (customers.length === 0) {
        console.log("No customers found.");
    } else {
        customers.forEach(cus => {
            console.log(`ID: ${cus.id}, Name: ${cus.name}, Phone: ${cus.phone}, Total Spent: ${cus.totalSpent}, Rank: ${cus.rank}`);
        });
    }
    customerMenu(user);
}

function productMenu(user: AccountModel) {
    console.log("\n=== PRODUCT MANAGEMENT ===");
    console.log("1. Add Product");
    console.log("2. Add the quantity of the existing product")
    console.log("3. Delete Product");
    console.log("4. List Products");
    console.log("0. Back");

    rl.question("Choose: ", (choice) => {
        switch (choice) {
        case "1":
            addProductMenu(user);
            break;
        case "2":
            
        case "3":
            deleteProductMenu(user);
            break;
        case "4":
            listProducts(user);
            break;
        case "0":
            manageMenu(user);
            break;
        default:
            productMenu(user);
        }
    });
}

function addProductMenu(user: AccountModel) {
    console.log("\n=== ADD PRODUCT ===");

    rl.question("Name: ", (name) => {
        if (!name.trim()) {
            console.log("Name cannot be empty. Try again.");
            return addProductMenu(user);
        }

        rl.question("Category: ", (category) => {
            if (!category.trim()) {
                console.log("Category cannot be empty. Try again.");
                return addProductMenu(user);
            }

            rl.question("Size (S/M/L/XL): ", (size) => {
                const validSizes = ["S", "M", "L", "XL"];
                if (!validSizes.includes(size.toUpperCase())) {
                    console.log("Invalid size. Try again.");
                    return addProductMenu(user);
                }

                rl.question("Color: ", (color) => {
                    if (!color.trim()) {
                        console.log("Color cannot be empty. Try again.");
                        return addProductMenu(user);
                    }

                    rl.question("Material: ", (material) => {
                        if (!material.trim()) {
                            console.log("Material cannot be empty. Try again.");
                            return addProductMenu(user);
                        }

                        rl.question("Price: ", (priceStr) => {
                            const price = parseFloat(priceStr);
                            if (isNaN(price) || price <= 0) {
                                console.log("Invalid price. Try again.");
                                return addProductMenu(user);
                            }

                            rl.question("Cost Price: ", (costStr) => {
                                const costPrice = parseFloat(costStr);
                                if (isNaN(costPrice) || costPrice <= 0) {
                                    console.log("Invalid cost price. Try again.");
                                    return addProductMenu(user);
                                }

                                rl.question("Stock: ", (stockStr) => {
                                    const stock = parseInt(stockStr);
                                    if (isNaN(stock) || stock < 0) {
                                        console.log("Invalid stock. Try again.");
                                        return addProductMenu(user);
                                    }

                                    rl.question("Min Threshold: ", (minStr) => {
                                        const minThreshold = parseInt(minStr);
                                        if (isNaN(minThreshold) || minThreshold < 0) {
                                            console.log("Invalid min threshold. Try again.");
                                            return addProductMenu(user);
                                        }

                                        productService.addProduct({
                                            name: name.trim(),
                                            category: category.trim(),
                                            size: size.toUpperCase() as "S" | "M" | "L" | "XL",
                                            color: color.trim(),
                                            material: material.trim(),
                                            price,
                                            costPrice,
                                            stock,
                                            minThreshold
                                        });

                                        productMenu(user);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function deleteProductMenu(user: AccountModel) {
    console.log("\n=== DELETE PRODUCT ===");

    rl.question("Product ID: ", (id) => {
        if (!id.trim()) {
            console.log("ID cannot be empty. Try again.");
            return deleteProductMenu(user);
        }

        productService.deleteProduct(id.trim());
        productMenu(user);
    });
}

function listProducts(user: AccountModel) {
    console.log("\n=== PRODUCTS ===");
    const products = productService.getAllProducts();
    if (products.length === 0) {
        console.log("No products found.");
    } else {
        products.forEach(prod => {
            console.log(`ID: ${prod.id}, Name: ${prod.name}, Category: ${prod.category}, Size: ${prod.size}, Price: ${prod.price}, Stock: ${prod.stock}`);
        });
    }
    productMenu(user);
}

function createInvoiceMenu(user: AccountModel) {
    console.log("\n=== CREATE INVOICE ===");

    rl.question("Customer ID (leave empty for no customer): ", (customerId) => {
        const cusId = customerId.trim() || undefined;

        rl.question("Product ID: ", (productId) => {
            if (!productId.trim()) {
                console.log("Product ID cannot be empty. Try again.");
                return createInvoiceMenu(user);
            }

            const product = productService.getProductById(productId.trim());
            if (!product) {
                console.log("Product not found. Try again.");
                return createInvoiceMenu(user);
            }

            rl.question("Quantity: ", (qtyStr) => {
                const quantity = parseInt(qtyStr);
                if (isNaN(quantity) || quantity <= 0 || quantity > product.stock) {
                    console.log("Invalid quantity. Try again.");
                    return createInvoiceMenu(user);
                }

                rl.question("Payment Method (CASH/BANK_TRANSFER/CARD/E_WALLET): ", (method) => {
                    const validMethods = ["CASH", "BANK_TRANSFER", "CARD", "E_WALLET"];
                    if (!validMethods.includes(method.toUpperCase())) {
                        console.log("Invalid payment method. Try again.");
                        return createInvoiceMenu(user);
                    }

                    const totalAmount = product.price * quantity;
                    const discount = 0; 
                    const finalAmount = totalAmount - discount;

                    const invoice = invoiceService.createInvoice({
                        customerId: cusId,
                        staffId: user.staffId,
                        items: [{
                            productId: product.id,
                            quantity,
                            price: product.price,
                            cost: product.costPrice
                        }],
                        totalAmount,
                        discount,
                        finalAmount,
                        paymentMethod: method.toUpperCase() as any,
                        createdAt: new Date()
                    });

                    productService.updateStock(product.id, -quantity);

                    // Create transaction for sales
                    transactionService.createTransaction(
                        "SALES",
                        finalAmount,
                        method.toUpperCase() as "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET",
                        invoice.id,
                        user.staffId
                    );

                    if (cusId) {
                        customerService.updateTotalSpent(cusId, finalAmount);
                    }

                    console.log(`Invoice ${invoice.id} created.`);
                    manageMenu(user);
                });
            });
        });
    });
}

function processReturnMenu(user: AccountModel) {
    console.log("\n=== PROCESS RETURN ===");

    rl.question("Invoice ID: ", (invoiceId) => {
        if (!invoiceId.trim()) {
            console.log("Invoice ID cannot be empty. Try again.");
            return processReturnMenu(user);
        }

        const invoice = invoiceService.getInvoiceById(invoiceId.trim());
        if (!invoice) {
            console.log("Invoice not found. Try again.");
            return processReturnMenu(user);
        }

        invoice.items.forEach(item => {
            productService.updateStock(item.productId, item.quantity);
        });

        if (invoice.customerId) {
            customerService.updateTotalSpent(invoice.customerId, -invoice.finalAmount);
        }

        console.log("Return processed.");
        manageMenu(user);
    });
}

function transactionMenu(user: AccountModel) {
    console.log("\n=== TRANSACTION MANAGEMENT ===");
    console.log("1. Create Manual Transaction");
    console.log("2. View All Transactions");
    console.log("3. View Transactions Summary");
    console.log("4. View My Transactions");
    console.log("5. View Monthly Report");
    console.log("6. View Yearly Report");
    console.log("7. Delete Transaction");
    console.log("0. Back");

    rl.question("Choose: ", (choice) => {
        switch (choice) {
        case "1":
            createManualTransactionMenu(user);
            break;
        case "2":
            viewAllTransactions(user);
            break;
        case "3":
            viewTransactionSummary(user);
            break;
        case "4":
            viewMyTransactions(user);
            break;
        case "5":
            viewMonthlyReportMenu(user);
            break;
        case "6":
            viewYearlyReportMenu(user);
            break;
        case "7":
            deleteTransactionMenu(user);
            break;
        case "0":
            manageMenu(user);
            break;
        default:
            transactionMenu(user);
        }
    });
}

function createManualTransactionMenu(user: AccountModel) {
    console.log("\n=== CREATE MANUAL TRANSACTION ===");

    rl.question("Category (SALES/PURCHASE/SALARY/RENT/MARKETING/REFUND): ", (category) => {
        const validCategories = ["SALES", "PURCHASE", "SALARY", "RENT", "MARKETING", "REFUND"];
        if (!validCategories.includes(category.toUpperCase())) {
            console.log("Invalid category. Try again.");
            return createManualTransactionMenu(user);
        }

        rl.question("Amount: ", (amountStr) => {
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount <= 0) {
                console.log("Invalid amount. Try again.");
                return createManualTransactionMenu(user);
            }

            rl.question("Payment Method (CASH/BANK_TRANSFER/CARD/E_WALLET): ", (method) => {
                const validMethods = ["CASH", "BANK_TRANSFER", "CARD", "E_WALLET"];
                if (!validMethods.includes(method.toUpperCase())) {
                    console.log("Invalid payment method. Try again.");
                    return createManualTransactionMenu(user);
                }

                rl.question("Description/Reference: ", (description) => {
                    if (!description.trim()) {
                        console.log("Description cannot be empty. Try again.");
                        return createManualTransactionMenu(user);
                    }

                    transactionService.createManualTransaction(
                        category.toUpperCase() as any,
                        amount,
                        method.toUpperCase() as any,
                        description.trim(),
                        user.staffId
                    );

                    transactionMenu(user);
                });
            });
        });
    });
}

function viewAllTransactions(user: AccountModel) {
    console.log("\n=== ALL TRANSACTIONS ===");
    const transactions = transactionService.getAllTransactions();
    if (transactions.length === 0) {
        console.log("No transactions found.");
    } else {
        transactions.forEach(trans => {
            const date = new Date(trans.createdAt).toLocaleString();
            console.log(`ID: ${trans.id}, Category: ${trans.category}, Amount: ${trans.amount}, Method: ${trans.paymentMethod}, Staff: ${trans.createdBy}, Date: ${date}`);
            console.log(`  Reference: ${trans.referenceId}`);
        });
    }
    transactionMenu(user);
}

function viewTransactionSummary(user: AccountModel) {
    console.log("\n=== TRANSACTION SUMMARY ===");
    const summary = transactionService.getSummary();
    console.log(`Total Sales (after refunds): ${summary.totalSales}`);
    console.log(`Total Purchases: -${summary.totalPurchases}`);
    console.log(`Total Salaries: -${summary.totalSalaries}`);
    console.log(`Total Rent: -${summary.totalRent}`);
    console.log(`Total Marketing: -${summary.totalMarketing}`);
    const netIncome = summary.totalSales - summary.totalPurchases - summary.totalSalaries - summary.totalRent - summary.totalMarketing;
    console.log(`Net Income: ${netIncome}`);
    transactionMenu(user);
}

function viewMyTransactions(user: AccountModel) {
    console.log("\n=== MY TRANSACTIONS ===");
    const myTransactions = transactionService.getTransactionsByStaff(user.staffId);
    if (myTransactions.length === 0) {
        console.log("No transactions created by you.");
    } else {
        myTransactions.forEach(trans => {
            const date = new Date(trans.createdAt).toLocaleString();
            console.log(`ID: ${trans.id}, Category: ${trans.category}, Amount: ${trans.amount}, Method: ${trans.paymentMethod}, Date: ${date}`);
        });
    }
    transactionMenu(user);
}

function viewMonthlyReportMenu(user: AccountModel) {
    console.log("\n=== MONTHLY REPORT ===");

    rl.question("Year (e.g., 2024): ", (yearStr) => {
        const year = parseInt(yearStr);
        if (isNaN(year) || year < 2000 || year > 2100) {
            console.log("Invalid year. Try again.");
            return viewMonthlyReportMenu(user);
        }

        rl.question("Month (1-12): ", (monthStr) => {
            const month = parseInt(monthStr);
            if (isNaN(month) || month < 1 || month > 12) {
                console.log("Invalid month. Try again.");
                return viewMonthlyReportMenu(user);
            }

            const report = transactionService.getMonthlyReport(year, month);
            console.log(`\n=== MONTHLY REPORT ${report.period} ===`);
            console.log(`Total Income: ${report.totalIncome}`);
            console.log(`Total Expenses: ${report.totalExpenses}`);
            console.log(`Net Income: ${report.netIncome}`);
            console.log(`Total Transactions: ${report.transactions}`);
            console.log("\nBreakdown:");
            console.log(`  Sales: ${report.breakdown.sales}`);
            console.log(`  Refunds: -${report.breakdown.refunds}`);
            console.log(`  Purchases: -${report.breakdown.purchases}`);
            console.log(`  Salaries: -${report.breakdown.salaries}`);
            console.log(`  Rent: -${report.breakdown.rent}`);
            console.log(`  Marketing: -${report.breakdown.marketing}`);

            transactionMenu(user);
        });
    });
}

function viewYearlyReportMenu(user: AccountModel) {
    console.log("\n=== YEARLY REPORT ===");

    rl.question("Year (e.g., 2024): ", (yearStr) => {
        const year = parseInt(yearStr);
        if (isNaN(year) || year < 2000 || year > 2100) {
            console.log("Invalid year. Try again.");
            return viewYearlyReportMenu(user);
        }

        const report = transactionService.getYearlyReport(year);
        console.log(`\n=== YEARLY REPORT ${report.year} ===`);
        console.log(`Total Income: ${report.totalIncome}`);
        console.log(`Total Expenses: ${report.totalExpenses}`);
        console.log(`Net Income: ${report.netIncome}`);

        console.log("\nMonthly Breakdown:");
        report.monthlyReports.forEach(monthReport => {
            if (monthReport.transactions > 0) {
                console.log(`  ${monthReport.period}: Income: ${monthReport.totalIncome}, Expenses: ${monthReport.totalExpenses}, Net: ${monthReport.netIncome}`);
            }
        });

        transactionMenu(user);
    });
}

function deleteTransactionMenu(user: AccountModel) {
    console.log("\n=== DELETE TRANSACTION ===");

    rl.question("Transaction ID: ", (id) => {
        if (!id.trim()) {
            console.log("ID cannot be empty. Try again.");
            return deleteTransactionMenu(user);
        }

        const success = transactionService.deleteTransaction(id.trim());
        if (success) {
            console.log("Transaction deleted successfully.");
        }
        transactionMenu(user);
    });
}

start();

