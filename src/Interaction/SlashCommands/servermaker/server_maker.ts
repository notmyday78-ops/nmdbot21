/*
 * NMDBot Server Maker
 *
 * Creates a complete Discord server structure:
 * - Roles
 * - Categories
 * - Channels
 * - Permissions
 * - Ticket area
 * - Moderation area
 * - Logging area
 * - Community area
 * - Economy area
 * - Leveling area
 * - Staff area
 *
 * This command is designed for the NMDBot fork of iHorizon.
 */

import {
  ApplicationCommandType,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  Guild,
  Role,
  GuildBasedChannel
} from "discord.js";

import { Command } from "../../../../types/command.js";

export const command: Command = {
  name: "server_maker",

  description:
    "Automatically creates a complete NMDBot server structure with roles, channels and permissions.",

  type: ApplicationCommandType.ChatInput,

  permission: PermissionFlagsBits.Administrator,

  run: async (
    client: Client,
    interaction: ChatInputCommandInteraction<"cached">
  ) => {
    if (!interaction.guild) {
      await interaction.reply({
        content: "❌ This command can only be used inside a server.",
        ephemeral: true
      });
      return;
    }

    const guild = interaction.guild;

    if (
      !guild.members.me?.permissions.has(
        PermissionFlagsBits.ManageChannels
      ) ||
      !guild.members.me?.permissions.has(
        PermissionFlagsBits.ManageRoles
      )
    ) {
      await interaction.reply({
        content:
          "❌ I need **Manage Channels** and **Manage Roles** permissions to build this server.",
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      /*
       * =========================================================
       * ROLES
       * =========================================================
       */

      const roleDefinitions = [
        {
          name: "NMDB Owner",
          color: "#F1C40F",
          permissions: [
            PermissionFlagsBits.Administrator
          ]
        },

        {
          name: "NMDB Administrator",
          color: "#E74C3C",
          permissions: [
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.ModerateMembers,
            PermissionFlagsBits.ViewAuditLog
          ]
        },

        {
          name: "NMDB Moderator",
          color: "#3498DB",
          permissions: [
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.ModerateMembers,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.ManageThreads,
            PermissionFlagsBits.ViewAuditLog
          ]
        },

        {
          name: "NMDB Support",
          color: "#9B59B6",
          permissions: [
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.ManageThreads,
            PermissionFlagsBits.ViewChannel
          ]
        },

        {
          name: "Verified Customer",
          color: "#2ECC71",
          permissions: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },

        {
          name: "Customer",
          color: "#1ABC9C",
          permissions: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },

        {
          name: "Muted",
          color: "#95A5A6",
          permissions: []
        }
      ];

      const roles = new Map<string, Role>();

      for (const definition of roleDefinitions) {
        let role = guild.roles.cache.find(
          (r) => r.name === definition.name
        );

        if (!role) {
          role = await guild.roles.create({
            name: definition.name,
            color: definition.color,
            permissions: definition.permissions,
            reason: "NMDBot Server Maker"
          });
        }

        roles.set(definition.name, role);
      }

      /*
       * =========================================================
       * CATEGORY HELPER
       * =========================================================
       */

      const findCategory = (name: string) =>
        guild.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildCategory &&
            channel.name === name
        );

      const getOrCreateCategory = async (name: string) => {
        const existing = findCategory(name);

        if (existing) return existing;

        return await guild.channels.create({
          name,
          type: ChannelType.GuildCategory,
          reason: "NMDBot Server Maker"
        });
      };

      /*
       * =========================================================
       * CHANNEL HELPER
       * =========================================================
       */

      const getOrCreateChannel = async (
        name: string,
        categoryId: string,
        options: {
          topic?: string;
          private?: boolean;
          staffOnly?: boolean;
          customerOnly?: boolean;
          readonly?: boolean;
        } = {}
      ) => {
        let channel = guild.channels.cache.find(
          (c) =>
            c.type === ChannelType.GuildText &&
            c.name === name
        );

        if (!channel) {
          const overwrites: any[] = [];

          /*
           * Private channel
           */
          if (options.private) {
            overwrites.push({
              id: guild.roles.everyone.id,
              deny: [
                PermissionFlagsBits.ViewChannel
              ]
            });
          }

          /*
           * Staff-only channel
           */
          if (options.staffOnly) {
            overwrites.push({
              id: guild.roles.everyone.id,
              deny: [
                PermissionFlagsBits.ViewChannel
              ]
            });

            const staffRoles = [
              roles.get("NMDB Owner"),
              roles.get("NMDB Administrator"),
              roles.get("NMDB Moderator"),
              roles.get("NMDB Support")
            ].filter(Boolean);

            for (const role of staffRoles) {
              overwrites.push({
                id: role!.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory
                ]
              });
            }
          }

          /*
           * Customer-only channel
           */
          if (options.customerOnly) {
            overwrites.push({
              id: guild.roles.everyone.id,
              deny: [
                PermissionFlagsBits.ViewChannel
              ]
            });

            const customerRoles = [
              roles.get("Verified Customer"),
              roles.get("Customer"),
              roles.get("NMDB Owner"),
              roles.get("NMDB Administrator"),
              roles.get("NMDB Support")
            ].filter(Boolean);

            for (const role of customerRoles) {
              overwrites.push({
                id: role!.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory
                ]
              });
            }
          }

          /*
           * Read-only channel
           */
          if (options.readonly) {
            overwrites.push({
              id: guild.roles.everyone.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory
              ],
              deny: [
                PermissionFlagsBits.SendMessages
              ]
            });
          }

          channel = await guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: categoryId,
            topic: options.topic,
            permissionOverwrites:
              overwrites.length > 0 ? overwrites : undefined,
            reason: "NMDBot Server Maker"
          });
        } else {
          /*
           * Put existing channel inside the correct category
           */
          if (channel.parentId !== categoryId) {
            await channel.setParent(categoryId).catch(() => {});
          }
        }

        return channel;
      };

      /*
       * =========================================================
       * CATEGORIES
       * =========================================================
       */

      const information = await getOrCreateCategory(
        "📌 INFORMATION"
      );

      const community = await getOrCreateCategory(
        "💬 COMMUNITY"
      );

      const support = await getOrCreateCategory(
        "🎫 SUPPORT"
      );

      const moderation = await getOrCreateCategory(
        "🛡️ MODERATION"
      );

      const logging = await getOrCreateCategory(
        "📊 LOGGING"
      );

      const economy = await getOrCreateCategory(
        "💰 ECONOMY"
      );

      const leveling = await getOrCreateCategory(
        "⭐ LEVELING"
      );

      const customer = await getOrCreateCategory(
        "💎 CUSTOMER AREA"
      );

      const staff = await getOrCreateCategory(
        "🔐 STAFF"
      );

      /*
       * =========================================================
       * INFORMATION
       * =========================================================
       */

      await getOrCreateChannel(
        "welcome",
        information.id,
        {
          topic: "Welcome to the server!",
          readonly: true
        }
      );

      await getOrCreateChannel(
        "rules",
        information.id,
        {
          topic: "Server rules",
          readonly: true
        }
      );

      await getOrCreateChannel(
        "announcements",
        information.id,
        {
          topic: "Important server announcements",
          readonly: true
        }
      );

      await getOrCreateChannel(
        "server-status",
        information.id,
        {
          topic: "Bot and server status",
          readonly: true
        }
      );

      await getOrCreateChannel(
        "faq",
        information.id,
        {
          topic: "Frequently asked questions"
        }
      );

      await getOrCreateChannel(
        "getting-started",
        information.id,
        {
          topic: "Getting started with this server"
        }
      );

      /*
       * =========================================================
       * COMMUNITY
       * =========================================================
       */

      await getOrCreateChannel(
        "general",
        community.id,
        {
          topic: "General community chat"
        }
      );

      await getOrCreateChannel(
        "media",
        community.id,
        {
          topic: "Images, videos and media"
        }
      );

      await getOrCreateChannel(
        "suggestions",
        community.id,
        {
          topic: "Community suggestions"
        }
      );

      await getOrCreateChannel(
        "off-topic",
        community.id,
        {
          topic: "Off-topic discussions"
        }
      );

      /*
       * =========================================================
       * SUPPORT / TICKETS
       * =========================================================
       */

      await getOrCreateChannel(
        "create-ticket",
        support.id,
        {
          topic:
            "Use the ticket system to contact the support team."
        }
      );

      await getOrCreateChannel(
        "general-support",
        support.id,
        {
          topic: "General support"
        }
      );

      await getOrCreateChannel(
        "bug-reports",
        support.id,
        {
          topic: "Report bugs and problems"
        }
      );

      await getOrCreateChannel(
        "suggestions",
        support.id,
        {
          topic: "Feature suggestions"
        }
      );

      await getOrCreateChannel(
        "ticket-logs",
        support.id,
        {
          topic: "Ticket system logs",
          staffOnly: true
        }
      );

      /*
       * =========================================================
       * MODERATION
       * =========================================================
       */

      await getOrCreateChannel(
        "mod-chat",
        moderation.id,
        {
          topic: "Moderator discussion",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "mod-reports",
        moderation.id,
        {
          topic: "Moderation reports",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "appeals",
        moderation.id,
        {
          topic: "Moderation appeals"
        }
      );

      /*
       * =========================================================
       * LOGGING
       * =========================================================
       */

      await getOrCreateChannel(
        "server-logs",
        logging.id,
        {
          topic: "General server logs",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "mod-logs",
        logging.id,
        {
          topic: "Moderation logs",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "member-logs",
        logging.id,
        {
          topic: "Member join/leave logs",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "message-logs",
        logging.id,
        {
          topic: "Message deletion/edit logs",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "security-logs",
        logging.id,
        {
          topic: "Security and protection logs",
          staffOnly: true
        }
      );

      /*
       * =========================================================
       * ECONOMY
       * =========================================================
       */

      await getOrCreateChannel(
        "economy",
        economy.id,
        {
          topic: "Economy commands"
        }
      );

      await getOrCreateChannel(
        "market",
        economy.id,
        {
          topic: "Server economy and marketplace"
        }
      );

      await getOrCreateChannel(
        "leaderboard",
        economy.id,
        {
          topic: "Economy leaderboard",
          readonly: true
        }
      );

      /*
       * =========================================================
       * LEVELING
       * =========================================================
       */

      await getOrCreateChannel(
        "level-up",
        leveling.id,
        {
          topic: "Level-up announcements"
        }
      );

      await getOrCreateChannel(
        "leaderboards",
        leveling.id,
        {
          topic: "XP and level leaderboards",
          readonly: true
        }
      );

      await getOrCreateChannel(
        "xp-chat",
        leveling.id,
        {
          topic: "XP activity"
        }
      );

      /*
       * =========================================================
       * CUSTOMER AREA
       * =========================================================
       */

      await getOrCreateChannel(
        "customer-chat",
        customer.id,
        {
          topic: "Verified customer community",
          customerOnly: true
        }
      );

      await getOrCreateChannel(
        "customer-news",
        customer.id,
        {
          topic: "Customer announcements",
          customerOnly: true,
          readonly: true
        }
      );

      await getOrCreateChannel(
        "customer-support",
        customer.id,
        {
          topic: "Customer support",
          customerOnly: true
        }
      );

      /*
       * =========================================================
       * STAFF
       * =========================================================
       */

      await getOrCreateChannel(
        "staff-chat",
        staff.id,
        {
          topic: "Private staff chat",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "ticket-management",
        staff.id,
        {
          topic: "Ticket management",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "customer-logs",
        staff.id,
        {
          topic: "Customer-related logs",
          staffOnly: true
        }
      );

      await getOrCreateChannel(
        "security",
        staff.id,
        {
          topic: "Security management",
          staffOnly: true
        }
      );

      /*
       * =========================================================
       * SUCCESS
       * =========================================================
       */

      await interaction.editReply({
        content:
          "## 🏗️ NMDBot Server Maker\n\n" +
          "✅ **Server setup completed!**\n\n" +
          "### Created / checked\n" +
          "👑 Roles\n" +
          "📁 Categories\n" +
          "💬 Community channels\n" +
          "🎫 Ticket/support channels\n" +
          "🛡️ Moderation channels\n" +
          "📊 Logging channels\n" +
          "💰 Economy channels\n" +
          "⭐ Leveling channels\n" +
          "💎 Customer channels\n" +
          "🔐 Staff channels\n\n" +
          "Existing channels and roles were preserved, so running the command again should not create duplicates."
      });

    } catch (error) {
      console.error(
        "[NMDBot Server Maker] Error:",
        error
      );

      await interaction.editReply({
        content:
          "❌ **Server Maker failed.**\n\n" +
          "Check that NMDBot has **Administrator**, or at minimum **Manage Channels + Manage Roles**, and make sure the bot's role is high enough to manage the roles it creates."
      });
    }
  }
};
