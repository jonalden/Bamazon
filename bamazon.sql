DROP DATABASE IF EXISTS Bamazon_db;
CREATE DATABASE Bamazon_db;
USE Bamazon_db;

CREATE TABLE products(
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price INTEGER(10),
  quantity INTEGER(10),
  product_sales DECIMAL(10, 2),
  PRIMARY KEY (id)
);



