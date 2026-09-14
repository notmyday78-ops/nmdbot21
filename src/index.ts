import { ShardingManager, REST, Routes } from "discord.js";
import { createServer, IncomingMessage, ServerResponse } from "http";

const token = process.env.BOT_TOKEN;

if (!token) {
console.error("BOT_TOKEN is missing!");
process.exit(1);
}

console.log("BOT_TOKEN detected!");

const PORT = Number(process.env.PORT) || 10000;

const WEBHOOK_PATH =
process.env.SUBSCRIPTION_WEBHOOK_PATH ||
"/webhooks/subscription";

const WEBHOOK_SECRET =
process.env.SUBSCRIPTION_WEBHOOK_SECRET ||
"";

function sendJson(
res: ServerResponse,
status: number,
data: unknown
) {
res.writeHead(status, {
"Content-Type": "application/json"
});

```
res.end(JSON.stringify(data));
```

}

/**

* Make the bot leave a specific Discord guild.
  */
  async function leaveGuild(
  manager: ShardingManager,
  guildId: string
  ) {
  try {
  const results = await manager.broadcastEval(
  async (client, context) => {
  const guild = client.guilds.cache.get(
  context.guildId
  );

  ```
           if (!guild) {
               return {
                   found: false,
                   success: false
               };
           }

           try {
               await guild.leave();

               return {
                   found: true,
                   success: true
               };
           } catch (error) {
               return {
                   found: true,
                   success: false,
                   error: "Failed to leave guild"
               };
           }
       },
       {
           context: {
               guildId
           }
       }
   );

   const foundResult = results.find(
       (result) => result.found
   );

   if (!foundResult) {
       return {
           guildId,
           success: false,
           error: "Guild not found on any shard"
       };
   }

   return {
       guildId,
       success: foundResult.success,
       ...(foundResult.error
           ? { error: foundResult.error }
           : {})
   };
  ```

  } catch (error) {
  console.error(
  "[SubscriptionWebhook] Failed to leave guild:",
  guildId,
  error
  );

  ```
   return {
       guildId,
       success: false,
       error: "Failed to leave guild"
   };
  ```

  }
  }

/**

* Get every guild the bot is currently in,
* across all shards.
  */
  async function getAllGuilds(
  manager: ShardingManager
  ) {
  const shardResults = await manager.broadcastEval(
  (client) => {
  return client.guilds.cache.map((guild) => ({
  id: guild.id,
  name: guild.name
  }));
  }
  );

  return shardResults.flat();
  }

async function handleWebhook(
manager: ShardingManager,
req: IncomingMessage,
res: ServerResponse
) {
if (!WEBHOOK_SECRET) {
console.error(
"[SubscriptionWebhook] SUBSCRIPTION_WEBHOOK_SECRET is missing!"
);

```
    return sendJson(res, 500, {
        ok: false,
        error: "Webhook secret is not configured"
    });
}

const authorization =
    req.headers.authorization;

if (
    authorization !==
    `Bearer ${WEBHOOK_SECRET}`
) {
    return sendJson(res, 401, {
        ok: false,
        error: "Unauthorized"
    });
}

let body = "";

req.on("data", (chunk) => {
    body += chunk.toString();

    if (body.length > 1_000_000) {
        req.destroy();
    }
});

req.on("end", async () => {
    try {
        const payload = JSON.parse(body);

        const event = payload.event;

        console.log(
            `[SubscriptionWebhook] Received event: ${
                event || "unknown"
            }`
        );

        /*
         * Subscription deactivated/cancelled:
         * Leave the affected Discord server.
         */
        if (
            event ===
                "subscription.deactivated" ||
            event ===
                "subscription.cancelled" ||
            event ===
                "subscription.canceled" ||
            (
                event ===
                    "subscription.updated" &&
                payload.active === false
            )
        ) {
            const guildIds = [
                ...(payload.guild_id
                    ? [payload.guild_id]
                    : []),

                ...(payload.guildId
                    ? [payload.guildId]
                    : []),

                ...(Array.isArray(
                    payload.guild_ids
                )
                    ? payload.guild_ids
                    : []),

                ...(Array.isArray(
                    payload.guildIds
                )
                    ? payload.guildIds
                    : [])
            ];

            const uniqueGuildIds = [
                ...new Set(guildIds)
            ];

            if (
                uniqueGuildIds.length === 0
            ) {
                return sendJson(res, 400, {
                    ok: false,
                    error:
                        "No guild ID supplied"
                });
            }

            const results = [];

            for (
                const guildId
                of uniqueGuildIds
            ) {
                results.push(
                    await leaveGuild(
                        manager,
                        guildId
                    )
                );
            }

            return sendJson(res, 200, {
                ok: true,
                event,
                results
            });
        }

        /*
         * Launch cleanup:
         *
         * Keep paid servers and remove the bot
         * from every server that is not in the paid list.
         */
        if (
            event ===
            "launch.cleanup"
        ) {
            if (
                !Array.isArray(
                    payload.paid_guild_ids
                )
            ) {
                return sendJson(res, 400, {
                    ok: false,
                    error:
                        "paid_guild_ids must be an array"
                });
            }

            const paidGuildIds =
                new Set(
                    payload.paid_guild_ids.map(
                        String
                    )
                );

            const guilds =
                await getAllGuilds(
                    manager
                );

            const results = [];

            for (
                const guild of guilds
            ) {
                if (
                    paidGuildIds.has(
                        guild.id
                    )
                ) {
                    results.push({
                        guildId: guild.id,
                        guildName:
                            guild.name,
                        action: "kept"
                    });

                    continue;
                }

                const result =
                    await leaveGuild(
                        manager,
                        guild.id
                    );

                results.push({
                    guildId: guild.id,
                    guildName:
                        guild.name,
                    action:
                        result.success
                            ? "left"
                            : "failed",
                    ...result
                });
            }

            return sendJson(res, 200, {
                ok: true,
                event,
                results
            });
        }

        /*
         * Subscription activation.
         */
        if (
            event ===
                "subscription.activated" ||
            event ===
                "subscription.created" ||
            event ===
                "subscription.updated"
        ) {
            return sendJson(res, 200, {
                ok: true,
                event,
                message:
                    "Subscription event received"
            });
        }

        return sendJson(res, 400, {
            ok: false,
            error:
                `Unsupported event: ${
                    event || "unknown"
                }`
        });
    } catch (error) {
        console.error(
            "[SubscriptionWebhook] Invalid request:",
            error
        );

        return sendJson(res, 400, {
            ok: false,
            error:
                "Invalid JSON payload"
        });
    }
});
```

}

/*

* Render health + subscription webhook server
  */
  const server = createServer(
  async (req, res) => {
  if (
  req.method === "GET" &&
  req.url === "/"
  ) {
  res.writeHead(200, {
  "Content-Type":
  "text/plain"
  });

  ```
       return res.end(
           "NMDBot is online!"
       );
   }

   if (
       req.method === "GET" &&
       req.url === "/health"
   ) {
       return sendJson(res, 200, {
           ok: true,
           service: "NMDBot21"
       });
   }

   if (
       req.method === "POST" &&
       req.url === WEBHOOK_PATH
   ) {
       if (!manager) {
           return sendJson(
               res,
               503,
               {
                   ok: false,
                   error:
                       "Discord bot is still starting"
               }
           );
       }

       return handleWebhook(
           manager,
           req,
           res
       );
   }

   res.writeHead(404, {
       "Content-Type":
           "application/json"
   });

   res.end(
       JSON.stringify({
           ok: false,
           error: "Not found"
       })
   );
  ```

  }
  );

server.listen(
PORT,
"0.0.0.0",
() => {
console.log(
`Health/Webhook server listening on port ${PORT}`
);

```
    console.log(
        `Subscription webhook: ${WEBHOOK_PATH}`
    );
}
```

);

const rest = new REST({
version: "10"
}).setToken(token);

let manager: ShardingManager;

async function main() {
console.log(
"Checking Discord Gateway..."
);

```
const gateway =
    await rest.get(
        Routes.gatewayBot()
    );

const shards =
    gateway.shards || 1;

console.log(
    "Discord recommends " +
    shards +
    " shard(s)."
);

console.log(
    "Starting NMDBot..."
);

manager =
    new ShardingManager(
        "./src/core/bot.ts",
        {
            token: token,
            totalShards: shards,
            respawn: true
        }
    );

manager.on(
    "shardCreate",
    function (shard) {
        console.log(
            "Shard #" +
            shard.id +
            " spawned."
        );

        shard.on(
            "ready",
            function () {
                console.log(
                    "Shard #" +
                    shard.id +
                    " is READY!"
                );
            }
        );

        shard.on(
            "error",
            function (error) {
                console.error(
                    "Shard #" +
                    shard.id +
                    " error:"
                );

                console.error(
                    error
                );
            }
        );

        shard.on(
            "disconnect",
            function () {
                console.log(
                    "Shard #" +
                    shard.id +
                    " disconnected."
                );
            }
        );

        shard.on(
            "reconnecting",
            function () {
                console.log(
                    "Shard #" +
                    shard.id +
                    " reconnecting."
                );
            }
        );
    }
);

await manager.spawn({
    amount: shards,
    delay: 5500,
    timeout: 60000
});

console.log(
    "All shards spawned successfully!"
);
```

}

main().catch(
function (error) {
console.error(
"NMDBot failed to start:"
);

```
    console.error(
        error
    );

    process.exit(1);
}
```

);
