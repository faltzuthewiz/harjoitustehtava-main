import fs from "fs";
import Database from "better-sqlite3";
import csvParser from "csv-parser";

export function loadCSV(file, table, columns, separator = ",") {
    const db = new Database("orderdata.db");

    try {
        const values = columns.map(() => "?").join(",");
        const insert = db.prepare(
            `INSERT INTO ${table} (${columns.join(",")}) VALUES (${values})`
        );

        // For missing column in products
        const defaultValues = {
            products: { reorder_point: 0 }
        };

        const insertMany = db.transaction((rows) => {
            for (const row of rows) {
                const preparedValues = columns.map((col) => row[col] ?? defaultValues[table]?.[col]);
                insert.run(preparedValues);
            }
        });

        const rows = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(file)
                .pipe(csvParser({ separator }))
                .on("data", (row) => {
                    rows.push(row);
                    //console.log(row);
                })
                .on("end", () => {
                    insertMany(rows);
                    console.log(`${file} is uploaded to table ${table}`);
                    db.close();
                    resolve();
                })
                .on("error", (err) => {
                    reject(err);
                    db.close();
                })
        });
    } catch (err) {
        db.close();
        return Promise.reject(err);
    }

}

