import {config} from "dotenv";
import * as process from "node:process";

config();

export default {
    ADMIN: {
        JWT_SECRET: process.env.ADMIN_JWT_SECRET || "",
    }
};
