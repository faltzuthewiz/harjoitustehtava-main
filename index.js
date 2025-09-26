import { loadCSV } from "./loadCSv.js";

console.log("Node.js + SQLite");


// Step 1: load CSV files and update them to database
loadCSV("customers.csv", "customers", ["customer_id", "customer_name"]);
loadCSV("products.csv", "products", ["sku", "name", "unit_price", "vat_code", "reorder_point"]);
loadCSV("stock_levels.csv", "stock_levels", ["sku", "warehouse", "qty_on_hand"]);
loadCSV("orders.csv", "orders", ["order_id", "customer_id", "order_date"]);
loadCSV("order_lines.csv", "order_lines", ["order_id", "sku", "qty"]);
