import http from "node:http";
import type { Client } from "discord.js";

const PORT = Number(process.env.PORT || 10000);
const WEBHOOK_PATH =
  process.env.SUBSCRIPTION_WEBHOOK_PATH || "/webhooks/subscription";
const WEBHOOK_SECRET = process.env.SUBSCRIPTION_WEBHOOK_SECRET || "";

type SubscriptionEvent = {
  event?: string;
  guild_id?: string;
  guildId?: string;
  guild_ids?: string[];
  guildIds?: string[];
  active?: boolean;
  paid_guild_ids?: string[];
};

function sendJson(
  res: http.ServerResponse,
  status: number,
  data: unknown,
) {
  res.writeHead(status, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}

async function leaveGuild(client: Client, guildId: string) {
  try {
    const guild =
      client.guilds.cache.get(guildId) ??
      (await client.guilds.fetch(guildId).catch(() => null));

    if (!guild) {
      return {
        guildId,
        success: false,
        error: "Guild not found",
      };
    }

    await guild.leave();

    return {
      guildId,
      success: true,
    };
  } catch (error) {
    console.error(
      `[SubscriptionWebhook] Failed to leave guild ${guildId}:`,
      error,
    );

    return {
      guildId,
      success: false,
      error: "Failed to leave guild",
    };
  }
}

export function startSubscriptionWebhook(client: Client) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/health") {
        return sendJson(res, 200, {
          ok: true,
          service: "NMDBot21 subscription webhook",
        });
      }

      if (req.method !== "POST" || req.url !== WEBHOOK_PATH) {
        return sendJson(res, 404, {
          ok: false,
          error: "Not found",
        });
      }

      if (!WEBHOOK_SECRET) {
        console.error(
          "[SubscriptionWebhook] SUBSCRIPTION_WEBHOOK_SECRET is not configured.",
        );

        return sendJson(res, 500, {
          ok: false,
          error: "Webhook secret is not configured",
        });
      }

      const authorization = req.headers.authorization;

      if (authorization !== `Bearer ${WEBHOOK_SECRET}`) {
        return sendJson(res, 401, {
          ok: false,
          error: "Unauthorized",
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
          const payload = JSON.parse(body) as SubscriptionEvent;

          const event = payload.event;

          console.log(
            `[SubscriptionWebhook] Received event: ${event || "unknown"}`,
          );

          /*
           * Subscription cancelled/deactivated:
           * Remove the bot from the affected Discord server(s).
           */
          if (
            event === "subscription.deactivated" ||
            event === "subscription.cancelled" ||
            event === "subscription.canceled" ||
            (event === "subscription.updated" && payload.active === false)
          ) {
            const guildIds = [
              ...(payload.guild_id ? [payload.guild_id] : []),
              ...(payload.guildId ? [payload.guildId] : []),
              ...(payload.guild_ids || []),
              ...(payload.guildIds || []),
            ];

            const uniqueGuildIds = [...new Set(guildIds)];

            if (uniqueGuildIds.length === 0) {
              return sendJson(res, 400, {
                ok: false,
                error: "No guild ID supplied",
              });
            }

            const results = [];

            for (const guildId of uniqueGuildIds) {
              results.push(await leaveGuild(client, guildId));
            }

            return sendJson(res, 200, {
              ok: true,
              event,
              results,
            });
          }

          /*
           * Launch cleanup:
           *
           * Base44 can send the list of servers that have an active
           * paid subscription. NMDBot21 will leave every other server.
           */
          if (event === "launch.cleanup") {
            const paidGuildIds = new Set(
              payload.paid_guild_ids || [],
            );

            if (!Array.isArray(payload.paid_guild_ids)) {
              return sendJson(res, 400, {
                ok: false,
                error: "paid_guild_ids must be an array",
              });
            }

            const results = [];

            for (const guild of client.guilds.cache.values()) {
              if (paidGuildIds.has(guild.id)) {
                results.push({
                  guildId: guild.id,
                  guildName: guild.name,
                  action: "kept",
                });

                continue;
              }

              const result = await leaveGuild(client, guild.id);

              results.push({
                guildId: guild.id,
                guildName: guild.name,
                action: result.success ? "left" : "failed",
                ...result,
              });
            }

            return sendJson(res, 200, {
              ok: true,
              event,
              results,
            });
          }

          /*
           * Activation events do not require the bot to leave anything.
           */
          if (
            event === "subscription.activated" ||
            event === "subscription.created" ||
            event === "subscription.updated"
          ) {
            return sendJson(res, 200, {
              ok: true,
              event,
              message: "Subscription event received",
            });
          }

          return sendJson(res, 400, {
            ok: false,
            error: `Unsupported event: ${event || "unknown"}`,
          });
        } catch (error) {
          console.error(
            "[SubscriptionWebhook] Invalid request:",
            error,
          );

          return sendJson(res, 400, {
            ok: false,
            error: "Invalid JSON payload",
          });
        }
      });
    } catch (error) {
      console.error("[SubscriptionWebhook] Server error:", error);

      return sendJson(res, 500, {
        ok: false,
        error: "Internal server error",
      });
    }
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(
      `[SubscriptionWebhook] Listening on 0.0.0.0:${PORT}${WEBHOOK_PATH}`,
    );
  });

  server.on("error", (error) => {
    console.error("[SubscriptionWebhook] HTTP server error:", error);
  });

  return server;
}
