import Database from "better-sqlite3";

export function calculateOrders(taxData) {
    const db = new Database("orderdata.db");

    // Get orders
    const rows = db.prepare("SELECT * FROM orders").all();

    const resultsMap = new Map();

    rows.forEach(row => {

        let orderLines = db.prepare("SELECT ol.sku, ol.qty FROM order_lines ol WHERE ol.order_id = ?").all(row.order_id);
        let customerNameRow = db.prepare("SELECT c.customer_name FROM customers c WHERE c.customer_id = ?").get(row.customer_id);

        let customerName = customerNameRow.customer_name;

        //console.log(orderLines);

        let netTotal = 0;
        let vatTotal = 0;
        let grossTotal = 0;
        let itemInStock = false;
        let fullyInStock = true;

        // Calculates orderlines
        orderLines.forEach(function (value) {
            let sku = value.sku;
            let qty = value.qty;
            // Finds the unit price
            let unitPriceRow = db.prepare("SELECT p.unit_price FROM products p WHERE p.sku = ?").get(sku);

            let unitPrice = unitPriceRow.unit_price;

            // console.log("product unit price is: " + unitPrice);
            // console.log("product quantity is: " + qty);

            // Calculates net total
            let lineTotal = unitPrice * qty;
            netTotal += lineTotal;
            // console.log("Linetotal: " + lineTotal);
            // console.log("net total: " + netTotal);

            // VAT for lines
            let vatRow = db.prepare("SELECT p.vat_code FROM products p WHERE p.sku = ?").get(sku);
            let vatCode = vatRow.vat_code;
            //console.log("Vat code is " + vatCode);

            let vat = taxData.vat[vatCode];
            //console.log("VAT " + vat);

            let vatLineTotal = lineTotal * vat;

            vatTotal += vatLineTotal;

            //console.log("Vatlinetotal is " + vatLineTotal);
            //console.log("VAT TOTAL is " + vatTotal);

            // Calculate gross total
            grossTotal = netTotal + vatTotal;
            //console.log("Gross total is " + grossTotal);

            // Check if the order is fully in stock
            let stockLevelRow = db.prepare("SELECT sl.qty_on_hand FROM stock_levels sl WHERE sl.sku = ?").get(sku);

            let stockLevel = stockLevelRow.qty_on_hand;

            if (stockLevel >= qty) {
                itemInStock = true;
            } else {
                itemInStock = false;
            }
            //console.log("Item in stock " + itemInStock);

            if (itemInStock === false) {
                fullyInStock = false;
            }

            let fullyInStockText = fullyInStock ? "YES" : "NO";

            // console.log("Fully in stock: " + fullyInStock);

            // Saves results to map by order_id
            resultsMap.set(row.order_id, {
                orderId: row.order_id,
                customerName: customerName,
                netTotal: Number(netTotal.toFixed(2)),
                vatTotal: Number(vatTotal.toFixed(2)),
                grossTotal: Number(grossTotal.toFixed(2)),
                isFullyInStock: fullyInStockText
            })
        });
    })
    console.log("Calculated net total, VAT, gross total & checked if the order is fully in stock");
    db.close();

    const results = Array.from(resultsMap.values());

    return results;

}
