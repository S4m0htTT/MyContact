import server from "./server/server.js";
import "./server/database.js";
import chalk from "chalk";

async function main() {
    const PORT = process.env.PORT || 5002;
    server.listen(PORT, () => {
        console.log(chalk.green(`App running on port ${PORT}`));
    });
}

main();
