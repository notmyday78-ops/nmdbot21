```ts
import "./core/functions/colors.js";

import config from "./files/config.js";
import logger from "./core/logger.js";

import { ShardingManager, REST, Routes } from "discord.js";
import { writeVersionFile } from "./core/modules/releaseNotifier.js";
import pkg from "../package.json";

const token = process.env.BOT_TOKEN || config.discord.token;

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

async function getOptimalShardCount(): Promise<number> {
    const rest = new REST({ version: "10" }).setToken(token);

    const gateway = (await rest.get(
        Routes.gatewayBot()
    )) as GatewayBotInfo;

    const discordRecommended = gateway.shards;
    const remaining = gateway.session_start_limit.remaining;
    const total = gateway.session_start_limit.total;
    const concurrency = gateway.session_start_limit.max_concurrency;

    logger.log(
        `[Gateway] Discord recommends: ${discordRecommended} shards`.cyan
    );

    logger.log(
        `[Gateway] Session starts remaining: ${remaining}/${total}`.cyan
    );

    logger.log(
        `[Gateway] Max concurrency: ${concurrency}`.cyan
    );

    if (remaining < 10) {
        logger.warn(
            `[Gateway] ⚠️ Only ${remaining} IDENTIFY tokens left — resets in ${Math.round(
                gateway.session_start_limit.reset_after / 1000
            )}s`.yellow
        );
    }

    // Optional manual shard override
    if (process.env.TOTAL_SHARDS) {
        const parsed = Number(process.env.TOTAL_SHARDS);

        if (!isNaN(parsed) && parsed >= 1) {
            logger.log(
                `[Gateway] Using TOTAL_SHARDS override: ${parsed}`.yellow
            );

            return parsed;
        }
    }

    // Use Discord's recommended shard count.
    // Do NOT artificially multiply it.
    const final = Math.max(1, discordRecommended);

    logger.log(
        `[Gateway] Using Discord recommended shard count: ${final}`.green
    );

    return final;
}

// Check token before starting
if (!token) {
    logger.err(
        "[Gateway] ❌ No Discord bot token was provided.".red
    );

    logger.err(
        "[Gateway] Set BOT_TOKEN in Render Environment Variables.".red
    );

    process.exit(1);
}

// Get shard count
const totalShards = await getOptimalShardCount();

// Create shard manager
const manager = new ShardingManager("./src/core/bot.ts", {
    totalShards,
    token,
    respawn: true
});

// Write version
await writeVersionFile(pkg.version);

// Shard events
manager.on("shardCreate", (shard) => {
    const tag = `[Shard #${shard.id}]`.cyan;

    logger.log(
        `${config.console.emojis.HOST} >> ${tag} Spawning...`.green
    );

    shard.on("ready", () => {
        logger.log(`${tag} ✅ Ready`.green);
    });

    shard.on("disconnect", () => {
        logger.warn(`${tag} ⚠️ Disconnected`.yellow);
    });

    shard.on("reconnecting", () => {
        logger.log(`${tag} 🔄 Reconnecting...`.blue);
    });

    shard.on("death", () => {
        logger.err(`${tag} 💀 Died`.red);
    });

    shard.on("error", (err) => {
        logger.err(
            `${tag} Error: ${err.message}`.red
        );
    });
});

// Spawn shards
await manager.spawn({
    amount: totalShards,
    delay: 5500,
    timeout: 60_000
});

logger.log(
    `✅ All ${totalShards} shards spawned`.green
);
```
