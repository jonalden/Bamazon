const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const Table = require('cli-table');



const connection = mysql.createConnection({
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

    inquirer.prompt(
        {
            type: "list",
            name: "options",
            message: "what would you like to do?",
            choices: ["View product sales by department", "Create new department"]
        }
    ).then(function (answers) {
        if (answers.options === "View product sales by department") {
            viewDepartment();
        }
        else {
            createDepartment();
        }
    })
});

function viewDepartment() {

    connection.query("SELECT * FROM departments", function (err, res) {
        console.log(res);

        // instantiate
        const table = new Table({
            head: ['department_id', 'department_name', "over_head_costs", "product_sales"]
            , colWidths: [100, 200]
        });

        // table is an Array, so you can `push`, `unshift`, `splice` and friends
        table.push(
            ['First value', 'Second value']
            , ['First value', 'Second value']
        );

        console.log(table.toString());
    })
}