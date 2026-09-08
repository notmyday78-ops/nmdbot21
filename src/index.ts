import { ShardingManager, REST, Routes } from "discord.js";
import { createServer } from "http";

const token = process.env.BOT_TOKEN;

if (!token) {
    console.error("BOT_TOKEN is missing!");
    process.exit(1);
}

console.log("BOT_TOKEN detected!");

// Render health server
const PORT = Number(process.env.PORT) || 10000;

const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("NMDBot is online!");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("Health server listening on port " + PORT);
});

async function main() {
    console.log("Checking Discord Gateway...");

    const rest = new REST({ version: "10" }).setToken(token);

    const gateway = await rest.get(Routes.gatewayBot());

    const shards = gateway.shards || 1;

    console.log("Discord recommends " + shards + " shard(s).");
    console.log("Starting NMDBot...");

    const manager = new ShardingManager("./src/core/bot.ts", {
        token: token,
        totalShards: shards,
        respawn: true
    });

    manager.on("shardCreate", function (shard) {
        console.log("Shard #" + shard.id + " spawned.");

        shard.on("ready", function () {
            console.log("Shard #" + shard.id + " is READY!");
        });

        shard.on("error", function (error) {
            console.error("Shard #" + shard.id + " error:");
            console.error(error);
        });

        shard.on("disconnect", function () {
            console.log("Shard #" + shard.id + " disconnected.");
        });

        shard.on("reconnecting", function () {
            console.log("Shard #" + shard.id + " reconnecting.");
        });
    });

    await manager.spawn({
        amount: shards,
        delay: 5500,
        timeout: 60000
    });

    console.log("All shards spawned successfully!");
}

main().catch(function (error) {
    console.error("NMDBot failed to start:");
    console.error(error);
    process.exit(1);
});
