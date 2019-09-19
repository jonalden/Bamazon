const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");

const connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    managerOptions();
});

function managerOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (answers) {
        if (answers.options === "View Products for Sale") {
            displayItems();
        }
        else if (answers.options === "View Low Inventory") {
            viewLowInv();
        }
        else if (answers.options === "Add to Inventory") {
            addToInv();
        }
        else if (answers.options === "Add New Product") {
            newProduct();
        }
        else if(answers.option === "Exit") {
            connection.end();
        }
    })
}

function displayItems() {

    connection.query("SELECT id, product_name, price, quantity FROM products", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            console.log(colors.yellow(`\n--------------------------------
            \nItem ID: ${res[i].id}\nName: ${res[i].product_name.cyan} \nPrice: $${res[i].price}\nIn Stock: ${res[i].quantity} \n\n--------------------------------`));
        }
        managerOptions();
    })
}

function viewLowInv() {

    connection.query("SELECT product_name, quantity FROM products WHERE quantity < 5", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {

            console.log(colors.magenta(`\n--------------------------------
            \nName: ${res[i].product_name.cyan} \nIn Stock: ${res[i].quantity} \n\n--------------------------------`));
        }
        managerOptions();
    })
}

function addToInv() {

    inquirer.prompt(
        [{
            type: "input",
            name: "product_name",
            message: "What is the name of the item you would like to update?"
        }, {
            type: "number",
            name: "quantity",
            message: "What should the new total inventory be?"
        }]
    ).then(function (answers) {
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    quantity: answers.quantity
                },
                {
                    product_name: answers.product_name
                }
            ],
            function (err, res) {
                if (err) throw err;
            }
        );
        console.log(colors.green(`\n---------------------------------------\n${answers.product_name} now has ${answers.quantity} in stock!\n---------------------------------------\n`));

        managerOptions();
    })
}

function newProduct() {

    inquirer.prompt(
        [{
            type: "input",
            name: "product_name",
            message: "Name of product to be added?"
        }, {
            type: "list",
            name: "department_name",
            message: "What department does the product belong to?",
            choices: ["electronics", "tools", "video games", "home"]
        }, {
            type: "number",
            name: "price",
            message: "Price of product to be added?"
        }, {
            type: "input",
            name: "quantity",
            message: "Quantity of product to be added?"
        }]
    ).then(function (answers) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answers.product_name,
                department_name: answers.department_name,
                price: answers.price,
                quantity: answers.quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(colors.green(`\n---------------------------------------------------------\n\n${answers.quantity} x ${answers.product_name.cyan} has been added to your database!\n\n---------------------------------------------------------\n`));

                managerOptions();
            })
    })
}



