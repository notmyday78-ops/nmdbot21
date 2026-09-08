```ts
import { ShardingManager, REST, Routes } from "discord.js";

const token = process.env.BOT_TOKEN;

if (!token) {
    console.error("❌ BOT_TOKEN ontbreekt in Render Environment Variables.");
    process.exit(1);
}

interface GatewayBotInfo {
    url: string;
    shards: number;
    session_start_limit: {
        total: number;
        remaining: number;
        reset_after: number;
        max_concurrency: number;
    };
}

async function getShardCount(): Promise<number> {
    console.log("🔎 Checking Discord Gateway...");

    const rest = new REST({ version: "10" }).setToken(token);

    const gateway = (await rest.get(
        Routes.gatewayBot()
    )) as GatewayBotInfo;

    console.log(`Discord recommends ${gateway.shards} shard(s).`);

    return Math.max(1, gateway.shards);
}

const totalShards = await getShardCount();

console.log(`🚀 Starting ${totalShards} shard(s)...`);

const manager = new ShardingManager("./src/core/bot.ts", {
    token,
    totalShards,
    respawn: true
});

manager.on("shardCreate", (shard) => {
    console.log(`Shard #${shard.id} spawned.`);

    shard.on("ready", () => {
        console.log(`✅ Shard #${shard.id} is READY!`);
    });

    shard.on("error", (error) => {
        console.error(`❌ Shard #${shard.id} error:`, error);
    });

    shard.on("disconnect", () => {
        console.log(`⚠️ Shard #${shard.id} disconnected.`);
    });

    shard.on("reconnecting", () => {
        console.log(`🔄 Shard #${shard.id} reconnecting...`);
    });
});

await manager.spawn({
    amount: totalShards,
    delay: 5500,
    timeout: 60000
});

console.log(`✅ All ${totalShards} shard(s) spawned.`);
```
