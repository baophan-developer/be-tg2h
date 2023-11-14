import mongoose from "mongoose";
import httpServer from "./app";
import configs from "./configs";

const server = async () => {
    try {
        await mongoose.connect(configs.db.url);
        console.log("[Server]: Connect database successfully!");

        const port = configs.port;
        httpServer.listen(port, () => {
            console.log(`[Server]: Run PORT: ${port}`);
        });
    } catch (error) {
        console.log("[Server]: Cannot connect database!\n", error);
        process.exit();
    }
};

server();
