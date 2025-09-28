import { createObjectCsvWriter } from "csv-writer";

export function writeCSV(orders) {

    const csvWriter = createObjectCsvWriter({
        path: 'order_report.csv',
        header: [
            { id: 'orderId', title: 'order_id' },
            { id: 'customerName', title: 'customer_name' },
            { id: 'netTotal', title: 'net_total' },
            { id: 'vatTotal', title: 'vat_total' },
            { id: 'grossTotal', title: 'gross_total' },
            { id: 'isFullyInStock', title: 'is_fully_in_stock' }
        ]
    });

    csvWriter.writeRecords(orders)
        .then(() => {
            console.log('...order_report.csv exported.');
        });
}