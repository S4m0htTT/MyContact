import mongoose from "mongoose";
import { config } from 'dotenv';
import chalk from "chalk";
config();
class Connection {
    constructor() {
        const url = process.env.MONGODB_URI || "";
        console.log(chalk.blue(`Establish new connection with url ${url}`));
        mongoose.Promise = global.Promise;
        mongoose.connect(url).then((resp) => {
            console.log(chalk.blue("Database connection has been established..."))
        });
    }
}

export default new Connection();