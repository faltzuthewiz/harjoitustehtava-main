import { loadCSV } from "./loadCSv.js";
import { calculateOrders } from "./calculateOrders.js";
import fs from "fs";

async function main() {
    // Step 1: load CSV files and update them to database

    await loadCSV("customers.csv", "customers", ["customer_id", "customer_name"]);
    await loadCSV("products.csv", "products", ["sku", "name", "unit_price", "vat_code", "reorder_point"]);
    await loadCSV("stock_levels.csv", "stock_levels", ["sku", "warehouse", "qty_on_hand"]);
    await loadCSV("orders.csv", "orders", ["order_id", "customer_id", "order_date"]);
    await loadCSV("order_lines.csv", "order_lines", ["order_id", "sku", "qty"]);

    // Step 2: read tax-rules.json
    const data = fs.readFileSync("tax_rules.json");
    const taxData = JSON.parse(data);

    /* Checking tax-rules
    console.log(taxData.vat.STANDARD);
    console.log(taxData.vat.REDUCED);
    console.log(taxData.vat.ZERO);
    */


    // Step 3: count  net_total, vat_total, gross_total, is_fully_in_stock
    calculateOrders(taxData);

}

main();