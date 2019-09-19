const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
});


function displayItems() {

    //Select all customers and return the res object:
    connection.query("SELECT id, product_name, price FROM products", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            console.log(colors.yellow(`--------------------------------
            \nItem ID: ${res[i].id}\nName: ${res[i].product_name.cyan} \nPrice: $${res[i].price}
            \n--------------------------------`));
        }

        inquirer.prompt(
            {
                type: "confirm",
                name: "purchase",
                message: "Would you like to make a purchase?"
            }
        ).then(function (answers) {
            if (answers.purchase) {
                buyItem();
            }
            else {
                console.log(colors.magenta(`\n--------------------------------\n\nHave a wonderful day!\n\n--------------------------------\n`));
                connection.end();
            }
        })
    });
}

function buyItem() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the ID of the item you would like to buy?"
        }, {
            type: "input",
            name: "amount",
            message: "How many would you like?"
        }
    ]).then(function (answers) {
        connection.query("SELECT * FROM products WHERE id =" + answers.id, function (err, res) {
            if (err) throw err;

            if (answers.amount > res[0].quantity) {
                console.log(colors.red(`\n-----------------------------------------------
                \nSorry, We only have ${res[0].quantity} ${res[0].product_name.cyan} left in stock
                \n-----------------------------------------------\n`));
                buyItem();
            }
            else {
                let newAmount = res[0].quantity - answers.amount;
                let totalCost = res[0].price * answers.amount;
                let productSales = res[0].product_sales + totalCost
                
                console.log(colors.green(`\n------------------------------------------------------
                \nYou bought ${answers.amount.cyan} x ${res[0].product_name.cyan} for a total of $${totalCost}
                \n------------------------------------------------------\n\n`));

                connection.query(`UPDATE products SET ? WHERE ?;`,
                    [
                        {
                            quantity: `${newAmount}`,
                            product_sales: `${productSales}`
                        },
                        {
                            id: answers.id
                        }
                    ], 

                    function (err, res) {
                        if (err) throw err;

                        inquirer.prompt(
                            {
                                type: "confirm",
                                name: "buyMore",
                                message: "Would you like to make another purchase?"
                            }
                        ).then(function (answers) {
                            if (answers.buyMore) {
                                buyItem();
                            }
                            else {
                                console.log(colors.magenta(`\n--------------------------------\n\nHave a wonderful day!\n\n--------------------------------\n`));
                                connection.end();
                            }
                        })

                    })
            }
        })
    })
}