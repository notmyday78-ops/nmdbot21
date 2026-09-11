/*
 * NMDBot Universal Server Maker
 *
 * Creates a large, generic Discord server structure.
 *
 * Features:
 * - 200 role definitions
 * - 100+ channel definitions
 * - Generic server structure
 * - No customer-specific structure
 * - Staff / moderation / support / community / gaming / creator / bot areas
 * - Logging areas
 * - Voice areas
 * - Existing channels and roles are preserved
 * - Safe to run multiple times
 */

import {
  ApplicationCommandType,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  Role
} from "discord.js";

import { Command } from "../../../../types/command.js";

type RoleDefinition = {
  name: string;
  color?: string;
  permissions?: bigint[];
};

type ChannelDefinition = {
  name: string;
  category: string;
  topic?: string;
  staffOnly?: boolean;
  readonly?: boolean;
  voice?: boolean;
};

export const command: Command = {
  name: "server_maker",

  description:
    "Builds a complete universal Discord server with roles, categories, channels and permissions.",

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

    const me = guild.members.me;

    if (!me) {
      await interaction.reply({
        content: "❌ I could not find my own guild member.",
        ephemeral: true
      });
      return;
    }

    if (
      !me.permissions.has(PermissionFlagsBits.ManageChannels) ||
      !me.permissions.has(PermissionFlagsBits.ManageRoles)
    ) {
      await interaction.reply({
        content:
          "❌ I need **Manage Channels** and **Manage Roles** permissions.",
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      /*
       * ============================================================
       * ROLE DEFINITIONS
       * ============================================================
       */

      const roleDefinitions: RoleDefinition[] = [
        /*
         * MANAGEMENT
         */

        { name: "Server Owner", color: "#F1C40F", permissions: [PermissionFlagsBits.Administrator] },
        { name: "Co Owner", color: "#F39C12", permissions: [PermissionFlagsBits.Administrator] },
        { name: "Server Director", color: "#E67E22", permissions: [PermissionFlagsBits.ManageGuild] },
        { name: "Community Director", color: "#E67E22", permissions: [PermissionFlagsBits.ManageGuild] },
        { name: "Operations Manager", color: "#D35400", permissions: [PermissionFlagsBits.ManageGuild] },
        { name: "General Manager", color: "#D35400", permissions: [PermissionFlagsBits.ManageGuild] },
        { name: "Senior Manager", color: "#C0392B", permissions: [PermissionFlagsBits.ManageGuild] },
        { name: "Manager", color: "#C0392B", permissions: [PermissionFlagsBits.ManageGuild] },
        { name: "Assistant Manager", color: "#E74C3C", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Administrator", color: "#E74C3C", permissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles] },

        /*
         * ADMINISTRATION
         */

        { name: "Senior Administrator", color: "#FF4757", permissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels] },
        { name: "Junior Administrator", color: "#FF6B81", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Head Admin", color: "#FF3838", permissions: [PermissionFlagsBits.ManageGuild] },
        { name: "Admin Team", color: "#FF4D4D", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Server Manager", color: "#FF6348", permissions: [PermissionFlagsBits.ManageChannels] },
        { name: "Community Manager", color: "#FF7F50", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Event Manager", color: "#FF9F43", permissions: [PermissionFlagsBits.ManageEvents] },
        { name: "Partnership Manager", color: "#FECA57", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Media Manager", color: "#F368E0", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Bot Manager", color: "#5F27CD", permissions: [PermissionFlagsBits.ManageMessages] },

        /*
         * MODERATION
         */

        { name: "Head Moderator", color: "#3498DB", permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ModerateMembers] },
        { name: "Senior Moderator", color: "#2980B9", permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.ModerateMembers] },
        { name: "Moderator", color: "#1E90FF", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers] },
        { name: "Junior Moderator", color: "#54A0FF", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Trial Moderator", color: "#74B9FF", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Moderator Trainee", color: "#A4D4FF", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Chat Moderator", color: "#0984E3", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Voice Moderator", color: "#00A8FF", permissions: [PermissionFlagsBits.MoveMembers, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers] },
        { name: "Game Moderator", color: "#6C5CE7", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Security Moderator", color: "#4834D4", permissions: [PermissionFlagsBits.ViewAuditLog] },

        /*
         * SUPPORT
         */

        { name: "Head Support", color: "#9B59B6", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Senior Support", color: "#8E44AD", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Support", color: "#A55EEA", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Junior Support", color: "#BE90D4", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Trial Support", color: "#D6A2E8", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Helper", color: "#C56CF0", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Community Helper", color: "#E056FD", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Ticket Staff", color: "#8854D0", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Customer Support", color: "#A55EEA", permissions: [PermissionFlagsBits.ManageMessages] },
        { name: "Support Trainee", color: "#D980FA", permissions: [PermissionFlagsBits.ManageMessages] },

        /*
         * STAFF
         */

        { name: "Staff", color: "#636E72" },
        { name: "Senior Staff", color: "#2D3436" },
        { name: "Junior Staff", color: "#636E72" },
        { name: "Trial Staff", color: "#7F8C8D" },
        { name: "Staff Trainee", color: "#95A5A6" },
        { name: "Event Staff", color: "#E84393" },
        { name: "Tournament Staff", color: "#FD79A8" },
        { name: "Giveaway Staff", color: "#FDCB6E" },
        { name: "News Staff", color: "#0984E3" },
        { name: "Media Staff", color: "#6C5CE7" },
        { name: "Content Staff", color: "#A29BFE" },
        { name: "Verification Staff", color: "#00B894" },
        { name: "Recruitment Staff", color: "#00CEC9" },
        { name: "Partnership Staff", color: "#00CEC9" },
        { name: "Translator", color: "#81ECEC" },
        { name: "Designer", color: "#FD79A8" },
        { name: "Developer", color: "#0984E3" },
        { name: "Web Developer", color: "#74B9FF" },
        { name: "Bot Developer", color: "#6C5CE7" },
        { name: "System Administrator", color: "#2F3542" },

        /*
         * COMMUNITY
         */

        { name: "Server Member", color: "#95A5A6" },
        { name: "New Member", color: "#BDC3C7" },
        { name: "Verified Member", color: "#2ECC71" },
        { name: "Active Member", color: "#1ABC9C" },
        { name: "Trusted Member", color: "#16A085" },
        { name: "Veteran Member", color: "#27AE60" },
        { name: "OG Member", color: "#F1C40F" },
        { name: "VIP", color: "#9B59B6" },
        { name: "Premium", color: "#8E44AD" },
        { name: "Supporter", color: "#E056FD" },
        { name: "Booster", color: "#F47FFF" },
        { name: "Server Booster", color: "#FF73FA" },
        { name: "Contributor", color: "#00B894" },
        { name: "Donator", color: "#FDCB6E" },
        { name: "Partner", color: "#00CEC9" },
        { name: "Friend", color: "#74B9FF" },
        { name: "Guest", color: "#A4B0BE" },
        { name: "Regular", color: "#70A1FF" },
        { name: "Community Veteran", color: "#5352ED" },
        { name: "Legend", color: "#FFA502" },

        /*
         * CREATOR
         */

        { name: "Content Creator", color: "#E84393" },
        { name: "Streamer", color: "#9147FF" },
        { name: "YouTuber", color: "#FF0000" },
        { name: "Twitch Creator", color: "#9147FF" },
        { name: "TikTok Creator", color: "#111111" },
        { name: "Instagram Creator", color: "#E1306C" },
        { name: "Artist", color: "#FF7675" },
        { name: "Musician", color: "#6C5CE7" },
        { name: "Photographer", color: "#00B894" },
        { name: "Video Editor", color: "#0984E3" },

        /*
         * GAMING
         */

        { name: "Gamer", color: "#00B894" },
        { name: "PC Gamer", color: "#00CEC9" },
        { name: "Console Gamer", color: "#0984E3" },
        { name: "PlayStation", color: "#003791" },
        { name: "Xbox", color: "#107C10" },
        { name: "Nintendo", color: "#E60012" },
        { name: "Mobile Gamer", color: "#6C5CE7" },
        { name: "Competitive Gamer", color: "#D63031" },
        { name: "Casual Gamer", color: "#74B9FF" },
        { name: "Esports", color: "#FF4757" },
        { name: "Tournament Player", color: "#FFA502" },
        { name: "Team Member", color: "#2ED573" },
        { name: "Clan Member", color: "#1E90FF" },
        { name: "LFG", color: "#70A1FF" },
        { name: "Game Tester", color: "#A29BFE" },
        { name: "Game Developer", color: "#5352ED" },
        { name: "Roblox", color: "#E74C3C" },
        { name: "Minecraft", color: "#55EFC4" },
        { name: "Fortnite", color: "#9B59B6" },
        { name: "GTA", color: "#2ECC71" },

        /*
         * INTERESTS
         */

        { name: "Technology", color: "#0984E3" },
        { name: "Programming", color: "#6C5CE7" },
        { name: "AI", color: "#00CEC9" },
        { name: "Music", color: "#E84393" },
        { name: "Movies", color: "#D63031" },
        { name: "Anime", color: "#FF7675" },
        { name: "Sports", color: "#00B894" },
        { name: "Football", color: "#2ECC71" },
        { name: "Basketball", color: "#E67E22" },
        { name: "Art", color: "#FD79A8" },
        { name: "Memes", color: "#F1C40F" },
        { name: "Coding", color: "#3498DB" },
        { name: "Cars", color: "#E74C3C" },
        { name: "Photography", color: "#00CEC9" },
        { name: "Travel", color: "#1ABC9C" },
        { name: "Books", color: "#8E44AD" },
        { name: "Science", color: "#3498DB" },
        { name: "Education", color: "#2ECC71" },
        { name: "Design", color: "#E056FD" },
        { name: "Hardware", color: "#636E72" },

        /*
         * LEVEL ROLES
         */

        { name: "Level 1", color: "#BDC3C7" },
        { name: "Level 2", color: "#BDC3C7" },
        { name: "Level 3", color: "#BDC3C7" },
        { name: "Level 4", color: "#BDC3C7" },
        { name: "Level 5", color: "#95A5A6" },
        { name: "Level 10", color: "#74B9FF" },
        { name: "Level 15", color: "#54A0FF" },
        { name: "Level 20", color: "#3498DB" },
        { name: "Level 25", color: "#0984E3" },
        { name: "Level 30", color: "#00CEC9" },
        { name: "Level 35", color: "#00B894" },
        { name: "Level 40", color: "#2ECC71" },
        { name: "Level 45", color: "#F1C40F" },
        { name: "Level 50", color: "#F39C12" },
        { name: "Level 60", color: "#E67E22" },
        { name: "Level 70", color: "#E74C3C" },
        { name: "Level 80", color: "#9B59B6" },
        { name: "Level 90", color: "#8E44AD" },
        { name: "Level 100", color: "#F1C40F" },
        { name: "Max Level", color: "#FFD700" },

        /*
         * UTILITY
         */

        { name: "Bots", color: "#5865F2" },
        { name: "Music Bot", color: "#1DB954" },
        { name: "Moderation Bot", color: "#E74C3C" },
        { name: "Utility Bot", color: "#3498DB" },
        { name: "Verified Bot", color: "#5865F2" },
        { name: "AFK", color: "#95A5A6" },
        { name: "Muted", color: "#7F8C8D" },
        { name: "Do Not Disturb", color: "#E74C3C" },
        { name: "Event Participant", color: "#F39C12" },
        { name: "Contest Winner", color: "#F1C40F" }
      ];

      /*
       * ============================================================
       * ADDITIONAL ROLES
       *
       * This guarantees a large role library while keeping names
       * generic and useful.
       * ============================================================
       */

      const additionalRoles = [
        "Role Manager",
        "Channel Manager",
        "Ticket Manager",
        "Log Manager",
        "Event Coordinator",
        "Community Coordinator",
        "Support Coordinator",
        "Moderation Coordinator",
        "Security Team",
        "Anti Raid Team",
        "Anti Spam Team",
        "Anti Scam Team",
        "Verification Team",
        "Welcome Team",
        "Greeter",
        "Recruiter",
        "Mentor",
        "Trainer",
        "Community Guide",
        "FAQ Team",
        "Bug Hunter",
        "Bug Reporter",
        "Beta Tester",
        "Early Access",
        "Early Supporter",
        "Founder",
        "Original Member",
        "Friend of Server",
        "VIP Plus",
        "Premium Plus",
        "Elite",
        "Elite Member",
        "Pro Member",
        "Champion",
        "Tournament Champion",
        "Event Champion",
        "Giveaway Winner",
        "Contestant",
        "Competitor",
        "Spectator",
        "Streamer Support",
        "Creator Support",
        "Developer Support",
        "Artist Support",
        "Music Support",
        "Media Support",
        "News Contributor",
        "News Reader",
        "Announcement Team",
        "Poll Participant",
        "Suggestion Contributor",
        "Suggestion Team",
        "Feedback Team",
        "Community Tester",
        "Server Tester",
        "Feature Tester",
        "Beta Member",
        "Alpha Member",
        "Developer Preview",
        "Early Tester",
        "Verified Creator",
        "Verified Streamer",
        "Verified Developer",
        "Verified Artist",
        "Verified Partner",
        "Official Partner",
        "Community Partner",
        "Bot Partner",
        "Game Partner",
        "Event Partner",
        "Sponsor",
        "Official Sponsor",
        "Server Sponsor",
        "Tournament Sponsor",
        "Community Sponsor",
        "Social Media",
        "Social Team",
        "Media Team",
        "Video Team",
        "Graphics Team",
        "Design Team",
        "Creative Team",
        "Technical Team",
        "Development Team",
        "Infrastructure Team",
        "Web Team",
        "Security Team 2",
        "QA Team",
        "Testing Team",
        "Documentation Team",
        "Translation Team",
        "International",
        "English",
        "Dutch",
        "German",
        "French",
        "Spanish",
        "Italian",
        "Portuguese",
        "Polish",
        "Turkish",
        "European",
        "North America",
        "South America",
        "Asia",
        "Oceania",
        "Africa",
        "Middle East",
        "Night Owl",
        "Early Bird",
        "Online",
        "Offline",
        "Mobile",
        "Desktop",
        "Tablet",
        "VR",
        "Streamer Mode",
        "Developer Mode",
        "Community Mode",
        "Gaming Mode",
        "Event Mode",
        "Music Lover",
        "Movie Lover",
        "Anime Fan",
        "Sports Fan",
        "Tech Fan",
        "Car Enthusiast",
        "Book Lover",
        "Science Fan",
        "Travel Lover",
        "Food Lover",
        "Fitness",
        "Creative",
        "Student",
        "Teacher",
        "Professional",
        "Entrepreneur",
        "Freelancer",
        "Volunteer",
        "Mentor Team",
        "Training Team",
        "Education Team",
        "Server Guide",
        "Community Guide 2",
        "Welcome Staff",
        "Onboarding Staff",
        "Onboarding Complete",
        "Rules Accepted",
        "Verified",
        "Unverified",
        "Newcomer",
        "Member Plus",
        "Member Pro",
        "Member Elite",
        "Community Plus",
        "Community Pro",
        "Community Elite",
        "Active Plus",
        "Active Pro",
        "Active Elite",
        "Veteran Plus",
        "Veteran Pro",
        "Veteran Elite",
        "Legendary Member",
        "Mythic Member",
        "Ultimate Member",
        "Hall of Fame",
        "Hall of Fame Staff",
        "Retired Staff",
        "Former Staff",
        "Former Moderator",
        "Former Support",
        "Former Developer",
        "Former Creator",
        "Archive Role",
        "Do Not Mention",
        "Announcements Ping",
        "Events Ping",
        "Giveaways Ping",
        "Updates Ping",
        "News Ping",
        "Polls Ping",
        "Community Ping",
        "Support Ping",
        "Game Ping",
        "Music Ping",
        "Creator Ping",
        "Bot Ping",
        "Staff Ping",
        "Moderator Ping",
        "Admin Ping"
      ];

      /*
       * Add additional roles until we reach 200 definitions.
       */

      for (const name of additionalRoles) {
        if (
          !roleDefinitions.some(
            (role) => role.name === name
          )
        ) {
          roleDefinitions.push({
            name,
            color: "#95A5A6"
          });
        }

        if (roleDefinitions.length >= 200) break;
      }

      /*
       * ============================================================
       * CREATE ROLES
       * ============================================================
       */

      const roles = new Map<string, Role>();

      let rolesCreated = 0;

      for (const definition of roleDefinitions.slice(0, 200)) {
        let role = guild.roles.cache.find(
          (existing) =>
            existing.name === definition.name
        );

        if (!role) {
          try {
            role = await guild.roles.create({
              name: definition.name,
              color: definition.color || "#95A5A6",
              permissions: definition.permissions || [],
              reason: "NMDBot Universal Server Maker"
            });

            rolesCreated++;
          } catch (error) {
            console.error(
              `[Server Maker] Failed to create role ${definition.name}:`,
              error
            );

            continue;
          }
        }

        roles.set(definition.name, role);
      }

      /*
       * ============================================================
       * CATEGORY DEFINITIONS
       * ============================================================
       */

      const categoryNames = [
        "📌 INFORMATION",
        "👋 WELCOME",
        "📢 ANNOUNCEMENTS",
        "💬 COMMUNITY",
        "🎉 EVENTS",
        "🎁 GIVEAWAYS",
        "💡 SUGGESTIONS",
        "🎫 SUPPORT",
        "🛡️ MODERATION",
        "🔐 STAFF",
        "📊 LOGGING",
        "🤖 BOTS",
        "⭐ LEVELING",
        "💰 ECONOMY",
        "🏆 LEADERBOARDS",
        "🎮 GAMING",
        "🏅 ESPORTS",
        "🎨 MEDIA",
        "🎥 CREATOR",
        "💻 DEVELOPMENT",
        "🧪 TESTING",
        "📰 NEWS",
        "🎵 MUSIC",
        "📚 EDUCATION",
        "🌍 SOCIAL",
        "🔊 VOICE",
        "🔒 PRIVATE",
        "🗄️ ARCHIVE"
      ];

      const categories = new Map<string, any>();

      for (const name of categoryNames) {
        let category = guild.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildCategory &&
            channel.name === name
        );

        if (!category) {
          category = await guild.channels.create({
            name,
            type: ChannelType.GuildCategory,
            reason: "NMDBot Universal Server Maker"
          });
        }

        categories.set(name, category);
      }

      /*
       * ============================================================
       * CHANNEL DEFINITIONS
       * ============================================================
       */

      const channels: ChannelDefinition[] = [
        /*
         * INFORMATION
         */

        { name: "welcome", category: "📌 INFORMATION", readonly: true },
        { name: "rules", category: "📌 INFORMATION", readonly: true },
        { name: "server-info", category: "📌 INFORMATION", readonly: true },
        { name: "server-guide", category: "📌 INFORMATION", readonly: true },
        { name: "faq", category: "📌 INFORMATION" },
        { name: "getting-started", category: "📌 INFORMATION" },
        { name: "server-links", category: "📌 INFORMATION", readonly: true },
        { name: "important-info", category: "📌 INFORMATION", readonly: true },

        /*
         * WELCOME
         */

        { name: "introductions", category: "👋 WELCOME" },
        { name: "say-hi", category: "👋 WELCOME" },
        { name: "new-member-chat", category: "👋 WELCOME" },
        { name: "verification", category: "👋 WELCOME" },
        { name: "roles", category: "👋 WELCOME" },
        { name: "role-info", category: "👋 WELCOME" },

        /*
         * ANNOUNCEMENTS
         */

        { name: "announcements", category: "📢 ANNOUNCEMENTS", readonly: true },
        { name: "updates", category: "📢 ANNOUNCEMENTS", readonly: true },
        { name: "news", category: "📢 ANNOUNCEMENTS", readonly: true },
        { name: "maintenance", category: "📢 ANNOUNCEMENTS", readonly: true },
        { name: "changelog", category: "📢 ANNOUNCEMENTS", readonly: true },
        { name: "bot-updates", category: "📢 ANNOUNCEMENTS", readonly: true },

        /*
         * COMMUNITY
         */

        { name: "general", category: "💬 COMMUNITY" },
        { name: "chat", category: "💬 COMMUNITY" },
        { name: "random", category: "💬 COMMUNITY" },
        { name: "off-topic", category: "💬 COMMUNITY" },
        { name: "daily-chat", category: "💬 COMMUNITY" },
        { name: "questions", category: "💬 COMMUNITY" },
        { name: "opinions", category: "💬 COMMUNITY" },
        { name: "polls", category: "💬 COMMUNITY" },
        { name: "community-talk", category: "💬 COMMUNITY" },
        { name: "hot-topics", category: "💬 COMMUNITY" },

        /*
         * EVENTS
         */

        { name: "events", category: "🎉 EVENTS" },
        { name: "event-info", category: "🎉 EVENTS", readonly: true },
        { name: "event-chat", category: "🎉 EVENTS" },
        { name: "event-planning", category: "🎉 EVENTS", staffOnly: true },
        { name: "event-results", category: "🎉 EVENTS", readonly: true },
        { name: "calendar", category: "🎉 EVENTS", readonly: true },

        /*
         * GIVEAWAYS
         */

        { name: "giveaways", category: "🎁 GIVEAWAYS" },
        { name: "giveaway-info", category: "🎁 GIVEAWAYS", readonly: true },
        { name: "giveaway-winners", category: "🎁 GIVEAWAYS", readonly: true },
        { name: "giveaway-staff", category: "🎁 GIVEAWAYS", staffOnly: true },

        /*
         * SUGGESTIONS
         */

        { name: "suggestions", category: "💡 SUGGESTIONS" },
        { name: "suggestion-discussion", category: "💡 SUGGESTIONS" },
        { name: "feedback", category: "💡 SUGGESTIONS" },
        { name: "ideas", category: "💡 SUGGESTIONS" },
        { name: "approved-ideas", category: "💡 SUGGESTIONS", readonly: true },

        /*
         * SUPPORT
         */

        { name: "create-ticket", category: "🎫 SUPPORT" },
        { name: "support", category: "🎫 SUPPORT" },
        { name: "help", category: "🎫 SUPPORT" },
        { name: "technical-support", category: "🎫 SUPPORT" },
        { name: "bug-reports", category: "🎫 SUPPORT" },
        { name: "report-user", category: "🎫 SUPPORT" },
        { name: "appeals", category: "🎫 SUPPORT" },
        { name: "ticket-info", category: "🎫 SUPPORT", readonly: true },

        /*
         * MODERATION
         */

        { name: "mod-chat", category: "🛡️ MODERATION", staffOnly: true },
        { name: "mod-reports", category: "🛡️ MODERATION", staffOnly: true },
        { name: "mod-actions", category: "🛡️ MODERATION", staffOnly: true },
        { name: "user-reports", category: "🛡️ MODERATION", staffOnly: true },
        { name: "appeal-review", category: "🛡️ MODERATION", staffOnly: true },
        { name: "automod", category: "🛡️ MODERATION", staffOnly: true },
        { name: "raid-protection", category: "🛡️ MODERATION", staffOnly: true },
        { name: "security", category: "🛡️ MODERATION", staffOnly: true },

        /*
         * STAFF
         */

        { name: "staff-chat", category: "🔐 STAFF", staffOnly: true },
        { name: "staff-announcements", category: "🔐 STAFF", staffOnly: true },
        { name: "staff-meetings", category: "🔐 STAFF", staffOnly: true },
        { name: "staff-planning", category: "🔐 STAFF", staffOnly: true },
        { name: "staff-feedback", category: "🔐 STAFF", staffOnly: true },
        { name: "staff-resources", category: "🔐 STAFF", staffOnly: true },
        { name: "recruitment", category: "🔐 STAFF", staffOnly: true },
        { name: "training", category: "🔐 STAFF", staffOnly: true },

        /*
         * LOGGING
         */

        { name: "server-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "member-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "message-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "voice-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "role-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "channel-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "moderation-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "ticket-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "security-logs", category: "📊 LOGGING", staffOnly: true },
        { name: "bot-logs", category: "📊 LOGGING", staffOnly: true },

        /*
         * BOTS
         */

        { name: "bot-commands", category: "🤖 BOTS" },
        { name: "bot-help", category: "🤖 BOTS", readonly: true },
        { name: "bot-status", category: "🤖 BOTS", readonly: true },
        { name: "bot-testing", category: "🤖 BOTS" },
        { name: "bot-suggestions", category: "🤖 BOTS" },
        { name: "commands", category: "🤖 BOTS" },

        /*
         * LEVELING
         */

        { name: "level-up", category: "⭐ LEVELING", readonly: true },
        { name: "xp-chat", category: "⭐ LEVELING" },
        { name: "level-info", category: "⭐ LEVELING", readonly: true },
        { name: "level-rewards", category: "⭐ LEVELING", readonly: true },
        { name: "xp-leaderboard", category: "⭐ LEVELING", readonly: true },

        /*
         * ECONOMY
         */

        { name: "economy", category: "💰 ECONOMY" },
        { name: "shop", category: "💰 ECONOMY" },
        { name: "market", category: "💰 ECONOMY" },
        { name: "trading", category: "💰 ECONOMY" },
        { name: "economy-news", category: "💰 ECONOMY", readonly: true },

        /*
         * LEADERBOARDS
         */

        { name: "leaderboards", category: "🏆 LEADERBOARDS", readonly: true },
        { name: "top-members", category: "🏆 LEADERBOARDS", readonly: true },
        { name: "top-levels", category: "🏆 LEADERBOARDS", readonly: true },
        { name: "top-economy", category: "🏆 LEADERBOARDS", readonly: true },
        { name: "top-activity", category: "🏆 LEADERBOARDS", readonly: true },

        /*
         * GAMING
         */

        { name: "gaming-chat", category: "🎮 GAMING" },
        { name: "game-discussion", category: "🎮 GAMING" },
        { name: "looking-for-group", category: "🎮 GAMING" },
        { name: "game-news", category: "🎮 GAMING" },
        { name: "game-clips", category: "🎮 GAMING" },
        { name: "game-screenshots", category: "🎮 GAMING" },
        { name: "game-guides", category: "🎮 GAMING" },
        { name: "game-reviews", category: "🎮 GAMING" },

        /*
         * ESPORTS
         */

        { name: "esports", category: "🏅 ESPORTS" },
        { name: "tournaments", category: "🏅 ESPORTS" },
        { name: "tournament-info", category: "🏅 ESPORTS", readonly: true },
        { name: "team-finder", category: "🏅 ESPORTS" },
        { name: "match-results", category: "🏅 ESPORTS", readonly: true },

        /*
         * MEDIA
         */

        { name: "media", category: "🎨 MEDIA" },
        { name: "memes", category: "🎨 MEDIA" },
        { name: "art", category: "🎨 MEDIA" },
        { name: "photography", category: "🎨 MEDIA" },
        { name: "clips", category: "🎨 MEDIA" },
        { name: "screenshots", category: "🎨 MEDIA" },
        { name: "videos", category: "🎨 MEDIA" },
        { name: "creative-showcase", category: "🎨 MEDIA" },

        /*
         * CREATOR
         */

        { name: "creator-chat", category: "🎥 CREATOR" },
        { name: "creator-news", category: "🎥 CREATOR", readonly: true },
        { name: "creator-showcase", category: "🎥 CREATOR" },
        { name: "streamers", category: "🎥 CREATOR" },
        { name: "youtube", category: "🎥 CREATOR" },
        { name: "content-ideas", category: "🎥 CREATOR" },
        { name: "creator-support", category: "🎥 CREATOR" },

        /*
         * DEVELOPMENT
         */

        { name: "development", category: "💻 DEVELOPMENT" },
        { name: "coding", category: "💻 DEVELOPMENT" },
        { name: "programming", category: "💻 DEVELOPMENT" },
        { name: "developers", category: "💻 DEVELOPMENT" },
        { name: "projects", category: "💻 DEVELOPMENT" },
        { name: "github", category: "💻 DEVELOPMENT" },
        { name: "documentation", category: "💻 DEVELOPMENT" },
        { name: "dev-help", category: "💻 DEVELOPMENT" },

        /*
         * TESTING
         */

        { name: "testing", category: "🧪 TESTING", staffOnly: true },
        { name: "bug-testing", category: "🧪 TESTING", staffOnly: true },
        { name: "feature-testing", category: "🧪 TESTING", staffOnly: true },
        { name: "beta-testing", category: "🧪 TESTING", staffOnly: true },
        { name: "development-testing", category: "🧪 TESTING", staffOnly: true },

        /*
         * NEWS
         */

        { name: "daily-news", category: "📰 NEWS" },
        { name: "technology-news", category: "📰 NEWS" },
        { name: "gaming-news", category: "📰 NEWS" },
        { name: "community-news", category: "📰 NEWS" },
        { name: "news-discussion", category: "📰 NEWS" },

        /*
         * MUSIC
         */

        { name: "music-chat", category: "🎵 MUSIC" },
        { name: "music-recommendations", category: "🎵 MUSIC" },
        { name: "now-playing", category: "🎵 MUSIC" },
        { name: "music-news", category: "🎵 MUSIC", readonly: true },

        /*
         * EDUCATION
         */

        { name: "education", category: "📚 EDUCATION" },
        { name: "homework", category: "📚 EDUCATION" },
        { name: "study-chat", category: "📚 EDUCATION" },
        { name: "resources", category: "📚 EDUCATION" },

        /*
         * SOCIAL
         */

        { name: "social", category: "🌍 SOCIAL" },
        { name: "introduce-yourself", category: "🌍 SOCIAL" },
        { name: "meetups", category: "🌍 SOCIAL" },
        { name: "friends", category: "🌍 SOCIAL" },
        { name: "community-events", category: "🌍 SOCIAL" },

        /*
         * VOICE
         */

        { name: "General Voice", category: "🔊 VOICE", voice: true },
        { name: "Gaming Voice", category: "🔊 VOICE", voice: true },
        { name: "Chill Voice", category: "🔊 VOICE", voice: true },
        { name: "Music Voice", category: "🔊 VOICE", voice: true },
        { name: "Study Voice", category: "🔊 VOICE", voice: true },
        { name: "Event Voice", category: "🔊 VOICE", voice: true },
        { name: "Private Voice", category: "🔊 VOICE", voice: true },
        { name: "AFK", category: "🔊 VOICE", voice: true },

        /*
         * PRIVATE
         */

        { name: "private-staff", category: "🔒 PRIVATE", staffOnly: true },
        { name: "private-management", category: "🔒 PRIVATE", staffOnly: true },
        { name: "private-security", category: "🔒 PRIVATE", staffOnly: true },
        { name: "private-development", category: "🔒 PRIVATE", staffOnly: true },

        /*
         * ARCHIVE
         */

        { name: "archive", category: "🗄️ ARCHIVE", staffOnly: true },
        { name: "old-announcements", category: "🗄️ ARCHIVE", staffOnly: true },
        { name: "old-events", category: "🗄️ ARCHIVE", staffOnly: true },
        { name: "old-tickets", category: "🗄️ ARCHIVE", staffOnly: true }
      ];

      /*
       * ============================================================
       * CHANNEL HELPER
       * ============================================================
       */

      const getStaffRoles = () => {
        return [
          roles.get("Server Owner"),
          roles.get("Co Owner"),
          roles.get("Server Director"),
          roles.get("Administrator"),
          roles.get("Senior Administrator"),
          roles.get("Head Admin"),
          roles.get("Head Moderator"),
          roles.get("Senior Moderator"),
          roles.get("Moderator"),
          roles.get("Head Support"),
          roles.get("Senior Support"),
          roles.get("Support"),
          roles.get("Staff"),
          roles.get("Senior Staff")
        ].filter(Boolean) as Role[];
      };

      const createChannel = async (
        definition: ChannelDefinition
      ) => {
        const category = categories.get(
          definition.category
        );

        if (!category) {
          console.log(
            `[Server Maker] Missing category: ${definition.category}`
          );
          return;
        }

        const existing = guild.channels.cache.find(
          (channel) =>
            channel.name === definition.name &&
            channel.parentId === category.id
        );

        if (existing) {
          return existing;
        }

        const overwrites: any[] = [];

        if (definition.staffOnly) {
          overwrites.push({
            id: guild.roles.everyone.id,
            deny: [
              PermissionFlagsBits.ViewChannel
            ]
          });

          for (const role of getStaffRoles()) {
            overwrites.push({
              id: role.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory
              ]
            });
          }
        }

        if (definition.readonly) {
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

        try {
          return await guild.channels.create({
            name: definition.name,
            type: definition.voice
              ? ChannelType.GuildVoice
              : ChannelType.GuildText,
            parent: category.id,
            topic:
              definition.voice
                ? undefined
                : definition.topic ||
                  `NMDBot generated channel: ${definition.name}`,
            permissionOverwrites:
              overwrites.length > 0
                ? overwrites
                : undefined,
            reason:
              "NMDBot Universal Server Maker"
          });
        } catch (error) {
          console.error(
            `[Server Maker] Failed to create channel ${definition.name}:`,
            error
          );

          return null;
        }
      };

      /*
       * ============================================================
       * CREATE CHANNELS
       * ============================================================
       */

      let channelsCreated = 0;

      for (const definition of channels) {
        const before = guild.channels.cache.find(
          (channel) =>
            channel.name === definition.name &&
            channel.parentId ===
              categories.get(definition.category)?.id
        );

        const result = await createChannel(
          definition
        );

        if (!before && result) {
          channelsCreated++;
        }
      }

      /*
       * ============================================================
       * FINAL RESPONSE
       * ============================================================
       */

      await interaction.editReply({
        content:
          "## 🏗️ NMDBot Universal Server Maker\n\n" +
          "✅ **Universal server setup completed!**\n\n" +
          `👑 Roles created: **${rolesCreated}**\n` +
          `💬 Channels created: **${channelsCreated}**\n` +
          `📁 Categories: **${categoryNames.length}**\n\n` +
          "### Included systems\n" +
          "📌 Information\n" +
          "👋 Welcome & verification\n" +
          "📢 Announcements\n" +
          "💬 Community\n" +
          "🎉 Events\n" +
          "🎁 Giveaways\n" +
          "💡 Suggestions\n" +
          "🎫 Support & tickets\n" +
          "🛡️ Moderation\n" +
          "🔐 Staff\n" +
          "📊 Logging\n" +
          "🤖 Bots\n" +
          "⭐ Leveling\n" +
          "💰 Economy\n" +
          "🏆 Leaderboards\n" +
          "🎮 Gaming\n" +
          "🏅 Esports\n" +
          "🎨 Media\n" +
          "🎥 Creator\n" +
          "💻 Development\n" +
          "🧪 Testing\n" +
          "📰 News\n" +
          "🎵 Music\n" +
          "📚 Education\n" +
          "🌍 Social\n" +
          "🔊 Voice\n\n" +
          "♻️ Existing roles and channels were preserved.\n" +
          "🔁 You can safely run `/server_maker` again without intentionally creating duplicates."
      });
    } catch (error) {
      console.error(
        "[NMDBot Universal Server Maker] Error:",
        error
      );

      try {
        await interaction.editReply({
          content:
            "❌ **Server Maker failed.**\n\n" +
            "Make sure NMDBot has **Administrator**, or at minimum **Manage Channels + Manage Roles**, and that the NMDBot role is high enough in the role hierarchy.\n\n" +
            "Check the Render logs for the exact Discord API error."
        });
      } catch {
        console.error(
          "[NMDBot Server Maker] Could not send error response."
        );
      }
    }
  }
};
