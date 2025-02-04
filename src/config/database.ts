import dotenv from "dotenv";

class DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    dbname: string;

    constructor() {
        this.host = process.env.DB_HOST || "localhost";
        this.dbname=process.env.DB_NAME || "bookstore";
        this.port= process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3308;
        this.username=process.env.DB_USER || "root";
        this.password=process.env.DB_PASSWORD || "quixxy123";

        if (!this.username || !this.password || !this.dbname) {
            throw new Error("Missing required parameters.");
        }
    }
}

export default DatabaseConfig;