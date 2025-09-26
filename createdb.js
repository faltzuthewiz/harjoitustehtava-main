import Database from "better-sqlite3";
import fs from "fs";

function createDB() {
    const db = new Database("orderdata.db");

    const schema = fs.readFileSync("db-schema.sql", "utf-8");

    db.exec(schema);

    console.log("Database formatted according to schema");

    db.close();
}

createDB();