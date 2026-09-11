import {
	ApplicationCommandType,
	ChannelType,
	PermissionFlagsBits,
	PermissionsBitField,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	Role,
	GuildChannel,
	CategoryChannel,
	TextChannel,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} from "discord.js";

import { Command } from "../../../../types/command.js";
import { metasTable } from "../../../Events/client/ready.js";

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

const OWNER_ROLE = "👑 SERVER OWNER";
const CO_OWNER_ROLE = "Co Owner";
const MANAGEMENT_ROLE = "Management";
const ADMIN_ROLE = "Admin";
const MOD_ROLE = "Moderator";
const SUPPORT_ROLE = "Support";
const HELPER_ROLE = "Helper";

const LOG_CHANNELS = {
	voice: "voice-logs",
	moderation: "moderation-logs",
	message: "message-logs",
	roles: "role-logs",
	channel: "channel-logs",
	antispam: "security-logs",
	boost: "server-logs",
	confession: "server-logs",
	economy: "bot-logs"
};

const CATEGORY_NAMES = [
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

const ROLE_DEFINITIONS: RoleDefinition[] = [
	{
		name: OWNER_ROLE,
		color: "#F1C40F",
		permissions: [PermissionFlagsBits.Administrator]
	},
	{
		name: CO_OWNER_ROLE,
		color: "#E74C3C",
		permissions: [PermissionFlagsBits.Administrator]
	},
	{
		name: MANAGEMENT_ROLE,
		color: "#9B59B6",
		permissions: [
			PermissionFlagsBits.ManageGuild,
			PermissionFlagsBits.ManageChannels,
			PermissionFlagsBits.ManageRoles,
			PermissionFlagsBits.ViewAuditLog,
			PermissionFlagsBits.ManageMessages,
			PermissionFlagsBits.ManageNicknames
		]
	},
	{
		name: ADMIN_ROLE,
		color: "#E67E22",
		permissions: [
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
		name: "Head Moderator",
		color: "#E74C3C",
		permissions: [
			PermissionFlagsBits.KickMembers,
			PermissionFlagsBits.BanMembers,
			PermissionFlagsBits.ModerateMembers,
			PermissionFlagsBits.ManageMessages,
			PermissionFlagsBits.ViewAuditLog
		]
	},
	{
		name: MOD_ROLE,
		color: "#C0392B",
		permissions: [
			PermissionFlagsBits.KickMembers,
			PermissionFlagsBits.ModerateMembers,
			PermissionFlagsBits.ManageMessages,
			PermissionFlagsBits.ViewAuditLog
		]
	},
	{
		name: "Trial Moderator",
		color: "#E74C3C",
		permissions: [
			PermissionFlagsBits.ModerateMembers,
			PermissionFlagsBits.ManageMessages
		]
	},
	{
		name: SUPPORT_ROLE,
		color: "#3498DB",
		permissions: [
			PermissionFlagsBits.ManageMessages,
			PermissionFlagsBits.ViewChannel
		]
	},
	{
		name: HELPER_ROLE,
		color: "#2ECC71",
		permissions: [
			PermissionFlagsBits.ManageMessages,
			PermissionFlagsBits.ViewChannel
		]
	},
	{
		name: "Event Team",
		color: "#F39C12",
		permissions: [
			PermissionFlagsBits.ManageEvents,
			PermissionFlagsBits.SendMessages
		]
	},
	{
		name: "Giveaway Team",
		color: "#1ABC9C",
		permissions: [
			PermissionFlagsBits.SendMessages,
			PermissionFlagsBits.ManageMessages
		]
	},
	{
		name: "Developer",
		color: "#5865F2",
		permissions: [
			PermissionFlagsBits.ViewChannel,
			PermissionFlagsBits.SendMessages,
			PermissionFlagsBits.ManageMessages
		]
	},
	{
		name: "Content Creator",
		color: "#E91E63",
		permissions: [
			PermissionFlagsBits.ViewChannel,
			PermissionFlagsBits.SendMessages,
			PermissionFlagsBits.AttachFiles,
			PermissionFlagsBits.EmbedLinks
		]
	},
	{
		name: "Verified",
		color: "#2ECC71",
		permissions: [PermissionFlagsBits.ViewChannel]
	},
	{
		name: "Muted",
		color: "#7F8C8D",
		permissions: []
	},
	{
		name: "VIP",
		color: "#F1C40F",
		permissions: [PermissionFlagsBits.ViewChannel]
	},
	{
		name: "Booster",
		color: "#FF73FA",
		permissions: [PermissionFlagsBits.ViewChannel]
	},

	{
		name: "Level 1",
		color: "#95A5A6",
		permissions: []
	},
	{
		name: "Level 2",
		color: "#95A5A6",
		permissions: []
	},
	{
		name: "Level 3",
		color: "#95A5A6",
		permissions: []
	},
	{
		name: "Level 5",
		color: "#3498DB",
		permissions: []
	},
	{
		name: "Level 10",
		color: "#2ECC71",
		permissions: []
	},
	{
		name: "Level 15",
		color: "#1ABC9C",
		permissions: []
	},
	{
		name: "Level 20",
		color: "#9B59B6",
		permissions: []
	},
	{
		name: "Level 25",
		color: "#8E44AD",
		permissions: []
	},
	{
		name: "Level 30",
		color: "#E67E22",
		permissions: []
	},
	{
		name: "Level 40",
		color: "#D35400",
		permissions: []
	},
	{
		name: "Level 50",
		color: "#E74C3C",
		permissions: []
	},
	{
		name: "Level 75",
		color: "#F1C40F",
		permissions: []
	},
	{
		name: "Level 100",
		color: "#FFD700",
		permissions: []
	},
	{
		name: "Max Level",
		color: "#FF0000",
		permissions: []
	},

	{
		name: "Gamer",
		color: "#5865F2",
		permissions: []
	},
	{
		name: "Streamer",
		color: "#9146FF",
		permissions: []
	},
	{
		name: "YouTuber",
		color: "#FF0000",
		permissions: []
	},
	{
		name: "Artist",
		color: "#E91E63",
		permissions: []
	},
	{
		name: "Music Lover",
		color: "#1DB954",
		permissions: []
	},
	{
		name: "Developer",
		color: "#5865F2",
		permissions: []
	},
	{
		name: "Community Member",
		color: "#95A5A6",
		permissions: []
	}
];

const CHANNEL_DEFINITIONS: ChannelDefinition[] = [
	// INFORMATION
	{ name: "welcome", category: "📌 INFORMATION", readonly: true },
	{ name: "rules", category: "📌 INFORMATION", readonly: true },
	{ name: "server-info", category: "📌 INFORMATION", readonly: true },
	{ name: "server-guide", category: "📌 INFORMATION", readonly: true },
	{ name: "faq", category: "📌 INFORMATION", readonly: true },
	{ name: "getting-started", category: "📌 INFORMATION", readonly: true },
	{ name: "server-links", category: "📌 INFORMATION", readonly: true },
	{ name: "important-info", category: "📌 INFORMATION", readonly: true },

	// WELCOME
	{ name: "introductions", category: "👋 WELCOME" },
	{ name: "say-hi", category: "👋 WELCOME" },
	{ name: "new-member-chat", category: "👋 WELCOME" },
	{ name: "verification", category: "👋 WELCOME" },
	{ name: "roles", category: "👋 WELCOME" },
	{ name: "role-info", category: "👋 WELCOME", readonly: true },

	// ANNOUNCEMENTS
	{ name: "announcements", category: "📢 ANNOUNCEMENTS", readonly: true },
	{ name: "updates", category: "📢 ANNOUNCEMENTS", readonly: true },
	{ name: "news", category: "📢 ANNOUNCEMENTS" },
	{ name: "maintenance", category: "📢 ANNOUNCEMENTS", readonly: true },
	{ name: "changelog", category: "📢 ANNOUNCEMENTS", readonly: true },
	{ name: "bot-updates", category: "📢 ANNOUNCEMENTS", readonly: true },

	// COMMUNITY
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

	// EVENTS
	{ name: "events", category: "🎉 EVENTS" },
	{ name: "event-info", category: "🎉 EVENTS", readonly: true },
	{ name: "event-chat", category: "🎉 EVENTS" },
	{ name: "event-planning", category: "🎉 EVENTS", staffOnly: true },
	{ name: "event-results", category: "🎉 EVENTS", readonly: true },
	{ name: "calendar", category: "🎉 EVENTS", readonly: true },

	// GIVEAWAYS
	{ name: "giveaways", category: "🎁 GIVEAWAYS" },
	{ name: "giveaway-info", category: "🎁 GIVEAWAYS", readonly: true },
	{ name: "giveaway-winners", category: "🎁 GIVEAWAYS" },
	{ name: "giveaway-staff", category: "🎁 GIVEAWAYS", staffOnly: true },

	// SUGGESTIONS
	{ name: "suggestions", category: "💡 SUGGESTIONS" },
	{ name: "suggestion-discussion", category: "💡 SUGGESTIONS" },
	{ name: "feedback", category: "💡 SUGGESTIONS" },
	{ name: "ideas", category: "💡 SUGGESTIONS" },
	{ name: "approved-ideas", category: "💡 SUGGESTIONS", readonly: true },

	// SUPPORT
	{ name: "create-ticket", category: "🎫 SUPPORT", readonly: true },
	{ name: "support", category: "🎫 SUPPORT" },
	{ name: "help", category: "🎫 SUPPORT" },
	{ name: "technical-support", category: "🎫 SUPPORT" },
	{ name: "bug-reports", category: "🎫 SUPPORT" },
	{ name: "report-user", category: "🎫 SUPPORT" },
	{ name: "appeals", category: "🎫 SUPPORT" },
	{ name: "ticket-info", category: "🎫 SUPPORT", readonly: true },

	// MODERATION
	{ name: "mod-chat", category: "🛡️ MODERATION", staffOnly: true },
	{ name: "mod-reports", category: "🛡️ MODERATION", staffOnly: true },
	{ name: "mod-actions", category: "🛡️ MODERATION", staffOnly: true },
	{ name: "user-reports", category: "🛡️ MODERATION", staffOnly: true },
	{ name: "appeal-review", category: "🛡️ MODERATION", staffOnly: true },
	{ name: "automod", category: "🛡️ MODERATION", staffOnly: true },
	{ name: "raid-protection", category: "🛡️ MODERATION", staffOnly: true },
	{ name: "security", category: "🛡️ MODERATION", staffOnly: true },

	// STAFF
	{ name: "staff-chat", category: "🔐 STAFF", staffOnly: true },
	{ name: "staff-announcements", category: "🔐 STAFF", staffOnly: true },
	{ name: "staff-meetings", category: "🔐 STAFF", staffOnly: true },
	{ name: "staff-planning", category: "🔐 STAFF", staffOnly: true },
	{ name: "staff-feedback", category: "🔐 STAFF", staffOnly: true },
	{ name: "staff-resources", category: "🔐 STAFF", staffOnly: true },
	{ name: "recruitment", category: "🔐 STAFF", staffOnly: true },
	{ name: "training", category: "🔐 STAFF", staffOnly: true },

	// LOGGING
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

	// BOTS
	{ name: "bot-commands", category: "🤖 BOTS" },
	{ name: "bot-help", category: "🤖 BOTS", readonly: true },
	{ name: "bot-status", category: "🤖 BOTS", readonly: true },
	{ name: "bot-testing", category: "🤖 BOTS", staffOnly: true },
	{ name: "bot-suggestions", category: "🤖 BOTS" },
	{ name: "commands", category: "🤖 BOTS" },

	// LEVELING
	{ name: "level-up", category: "⭐ LEVELING", readonly: true },
	{ name: "xp-chat", category: "⭐ LEVELING" },
	{ name: "level-info", category: "⭐ LEVELING", readonly: true },
	{ name: "level-rewards", category: "⭐ LEVELING", readonly: true },
	{ name: "xp-leaderboard", category: "⭐ LEVELING", readonly: true },

	// ECONOMY
	{ name: "economy", category: "💰 ECONOMY" },
	{ name: "shop", category: "💰 ECONOMY" },
	{ name: "market", category: "💰 ECONOMY" },
	{ name: "trading", category: "💰 ECONOMY" },
	{ name: "economy-news", category: "💰 ECONOMY", readonly: true },

	// LEADERBOARDS
	{ name: "leaderboards", category: "🏆 LEADERBOARDS", readonly: true },
	{ name: "top-members", category: "🏆 LEADERBOARDS", readonly: true },
	{ name: "top-levels", category: "🏆 LEADERBOARDS", readonly: true },
	{ name: "top-economy", category: "🏆 LEADERBOARDS", readonly: true },
	{ name: "top-activity", category: "🏆 LEADERBOARDS", readonly: true },

	// GAMING
	{ name: "gaming-chat", category: "🎮 GAMING" },
	{ name: "game-discussion", category: "🎮 GAMING" },
	{ name: "looking-for-group", category: "🎮 GAMING" },
	{ name: "game-news", category: "🎮 GAMING" },
	{ name: "game-clips", category: "🎮 GAMING" },
	{ name: "game-screenshots", category: "🎮 GAMING" },
	{ name: "game-guides", category: "🎮 GAMING" },
	{ name: "game-reviews", category: "🎮 GAMING" },

	// ESPORTS
	{ name: "esports", category: "🏅 ESPORTS" },
	{ name: "tournaments", category: "🏅 ESPORTS" },
	{ name: "tournament-info", category: "🏅 ESPORTS", readonly: true },
	{ name: "team-finder", category: "🏅 ESPORTS" },
	{ name: "match-results", category: "🏅 ESPORTS", readonly: true },

	// MEDIA
	{ name: "media", category: "🎨 MEDIA" },
	{ name: "memes", category: "🎨 MEDIA" },
	{ name: "art", category: "🎨 MEDIA" },
	{ name: "photography", category: "🎨 MEDIA" },
	{ name: "clips", category: "🎨 MEDIA" },
	{ name: "screenshots", category: "🎨 MEDIA" },
	{ name: "videos", category: "🎨 MEDIA" },
	{ name: "creative-showcase", category: "🎨 MEDIA" },

	// CREATOR
	{ name: "creator-chat", category: "🎥 CREATOR" },
	{ name: "creator-news", category: "🎥 CREATOR", readonly: true },
	{ name: "creator-showcase", category: "🎥 CREATOR" },
	{ name: "streamers", category: "🎥 CREATOR" },
	{ name: "youtube", category: "🎥 CREATOR" },
	{ name: "content-ideas", category: "🎥 CREATOR" },
	{ name: "creator-support", category: "🎥 CREATOR" },

	// DEVELOPMENT
	{ name: "development", category: "💻 DEVELOPMENT" },
	{ name: "coding", category: "💻 DEVELOPMENT" },
	{ name: "programming", category: "💻 DEVELOPMENT" },
	{ name: "developers", category: "💻 DEVELOPMENT" },
	{ name: "projects", category: "💻 DEVELOPMENT" },
	{ name: "github", category: "💻 DEVELOPMENT" },
	{ name: "documentation", category: "💻 DEVELOPMENT", readonly: true },
	{ name: "dev-help", category: "💻 DEVELOPMENT" },

	// TESTING
	{ name: "testing", category: "🧪 TESTING", staffOnly: true },
	{ name: "bug-testing", category: "🧪 TESTING", staffOnly: true },
	{ name: "feature-testing", category: "🧪 TESTING", staffOnly: true },
	{ name: "beta-testing", category: "🧪 TESTING", staffOnly: true },
	{ name: "development-testing", category: "🧪 TESTING", staffOnly: true },

	// NEWS
	{ name: "daily-news", category: "📰 NEWS" },
	{ name: "technology-news", category: "📰 NEWS" },
	{ name: "gaming-news", category: "📰 NEWS" },
	{ name: "community-news", category: "📰 NEWS" },
	{ name: "news-discussion", category: "📰 NEWS" },

	// MUSIC
	{ name: "music-chat", category: "🎵 MUSIC" },
	{ name: "music-recommendations", category: "🎵 MUSIC" },
	{ name: "now-playing", category: "🎵 MUSIC" },
	{ name: "music-news", category: "🎵 MUSIC" },

	// EDUCATION
	{ name: "education", category: "📚 EDUCATION" },
	{ name: "homework", category: "📚 EDUCATION" },
	{ name: "study-chat", category: "📚 EDUCATION" },
	{ name: "resources", category: "📚 EDUCATION" },

	// SOCIAL
	{ name: "social", category: "🌍 SOCIAL" },
	{ name: "introduce-yourself", category: "🌍 SOCIAL" },
	{ name: "meetups", category: "🌍 SOCIAL" },
	{ name: "friends", category: "🌍 SOCIAL" },
	{ name: "community-events", category: "🌍 SOCIAL" },

	// VOICE
	{ name: "General Voice", category: "🔊 VOICE", voice: true },
	{ name: "Gaming Voice", category: "🔊 VOICE", voice: true },
	{ name: "Chill Voice", category: "🔊 VOICE", voice: true },
	{ name: "Music Voice", category: "🔊 VOICE", voice: true },
	{ name: "Study Voice", category: "🔊 VOICE", voice: true },
	{ name: "Event Voice", category: "🔊 VOICE", voice: true },
	{ name: "Private Voice", category: "🔊 VOICE", voice: true },
	{ name: "AFK", category: "🔊 VOICE", voice: true },

	// PRIVATE
	{ name: "private-staff", category: "🔒 PRIVATE", staffOnly: true },
	{ name: "private-management", category: "🔒 PRIVATE", staffOnly: true },
	{ name: "private-security", category: "🔒 PRIVATE", staffOnly: true },
	{ name: "private-development", category: "🔒 PRIVATE", staffOnly: true },

	// ARCHIVE
	{ name: "archive", category: "🗄️ ARCHIVE", staffOnly: true },
	{ name: "old-announcements", category: "🗄️ ARCHIVE", staffOnly: true },
	{ name: "old-events", category: "🗄️ ARCHIVE", staffOnly: true },
	{ name: "old-tickets", category: "🗄️ ARCHIVE", staffOnly: true }
];

const STAFF_ROLE_NAMES = [
	OWNER_ROLE,
	CO_OWNER_ROLE,
	MANAGEMENT_ROLE,
	ADMIN_ROLE,
	"Head Moderator",
	MOD_ROLE,
	"Trial Moderator",
	SUPPORT_ROLE,
	HELPER_ROLE,
	"Event Team",
	"Giveaway Team",
	"Developer"
];

function unique<T>(items: T[]): T[] {
	return [...new Set(items)];
}

function safeName(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9-_]/g, "-").slice(0, 90);
}

async function ensureRole(
	guild: any,
	definition: RoleDefinition
): Promise<Role> {
	let role = guild.roles.cache.find(
		(existing: Role) => existing.name === definition.name
	) as Role | undefined;

	if (!role) {
		role = await guild.roles.create({
			name: definition.name,
			color: definition.color || "#95A5A6",
			permissions: definition.permissions || [],
			reason: "NMDBot Server Maker"
		});
	} else {
		try {
			await role.edit({
				color: definition.color || "#95A5A6",
				permissions: definition.permissions || [],
				reason: "NMDBot Server Maker synchronization"
			});
		} catch {
			// Managed/integration roles cannot always be edited.
		}
	}

	return role;
}

async function ensureCategory(
	guild: any,
	name: string
): Promise<CategoryChannel> {
	let category = guild.channels.cache.find(
		(channel: GuildChannel) =>
			channel.type === ChannelType.GuildCategory &&
			channel.name === name
	) as CategoryChannel | undefined;

	if (!category) {
		category = await guild.channels.create({
			name,
			type: ChannelType.GuildCategory,
			reason: "NMDBot Server Maker"
		});
	}

	return category;
}

async function syncChannelPermissions(
	channel: GuildChannel,
	readonly: boolean,
	staffOnly: boolean,
	staffRoles: Role[]
) {
	try {
		const everyone = channel.guild.roles.everyone;

		if (staffOnly) {
			await channel.permissionOverwrites.edit(everyone, {
				ViewChannel: false
			});

			for (const role of staffRoles) {
				await channel.permissionOverwrites.edit(role, {
					ViewChannel: true,
					SendMessages: true,
					ReadMessageHistory: true
				});
			}
		} else {
			await channel.permissionOverwrites.edit(everyone, {
				ViewChannel: true,
				ReadMessageHistory: true
			});
		}

		if (readonly && !staffOnly) {
			await channel.permissionOverwrites.edit(everyone, {
				ViewChannel: true,
				ReadMessageHistory: true,
				SendMessages: false
			});
		}
	} catch {
		// Administrator bots can still operate if Discord rejects a redundant overwrite.
	}
}

async function ensureChannel(
	guild: any,
	definition: ChannelDefinition,
	category: CategoryChannel,
	staffRoles: Role[]
): Promise<GuildChannel> {
	const type = definition.voice
		? ChannelType.GuildVoice
		: ChannelType.GuildText;

	let channel = guild.channels.cache.find(
		(existing: GuildChannel) =>
			existing.name === definition.name &&
			existing.parentId === category.id &&
			existing.type === type
	) as GuildChannel | undefined;

	if (!channel) {
		channel = await guild.channels.create({
			name: definition.voice ? definition.name : safeName(definition.name),
			type,
			parent: category.id,
			topic: !definition.voice ? definition.topic : undefined,
			reason: "NMDBot Server Maker"
		});
	}

	if (channel.type !== ChannelType.GuildVoice) {
		await syncChannelPermissions(
			channel,
			!!definition.readonly,
			!!definition.staffOnly,
			staffRoles
		);
	}

	return channel;
}

async function configureLogging(
	client: Client,
	guildId: string,
	channels: Map<string, GuildChannel>
) {
	for (const [key, channelName] of Object.entries(LOG_CHANNELS)) {
		const channel = channels.get(channelName);

		if (!channel) continue;

		await client.db.set(
			`${guildId}.GUILD.SERVER_LOGS.${key}`,
			channel.id
		);
	}

	const ticketLogs = channels.get("ticket-logs");

	if (ticketLogs) {
		await client.db.set(
			`${guildId}.GUILD.TICKET.logs`,
			ticketLogs.id
		);
	}
}

async function configureXP(
	client: Client,
	guildId: string,
	xpChannel: GuildChannel,
	levelUpChannel: GuildChannel,
	levelRoles: Role[]
) {
	await client.db.set(
		`${guildId}.GUILD.XP_LEVELING.xpchannels`,
		xpChannel.id
	);

	// Native iHorizon XP switch: true = enabled.
	await client.db.set(
		`${guildId}.GUILD.XP_LEVELING.disable`,
		true
	);

	// Server Maker metadata used by our generated server structure.
	await client.db.set(
		`${guildId}.GUILD.SERVER_MAKER.leveling`,
		{
			enabled: true,
			xpChannel: xpChannel.id,
			levelUpChannel: levelUpChannel.id,
			levelRoles: levelRoles.map((role) => role.id)
		}
	);
}

async function configureTicketSystem(
	client: Client,
	guild: any,
	ticketCategory: CategoryChannel,
	ticketPanelChannel: TextChannel,
	ticketLogs: GuildChannel,
	staffRole: Role
) {
	/*
	 * This matches the native ticket system.
	 *
	 * The native panel command expects:
	 *
	 * GUILD.TICKET_PANEL.<panelCode>
	 *
	 * and then maps:
	 *
	 * GUILD.TICKET_PANEL.<sentMessageId> -> panelCode
	 */

	await client.db.set(
		`${guild.id}.GUILD.TICKET.category`,
		ticketCategory.id
	);

	await client.db.set(
		`${guild.id}.GUILD.TICKET.logs`,
		ticketLogs.id
	);

	// false means tickets are enabled in the native ticket module.
	await client.db.set(
		`${guild.id}.GUILD.TICKET.disable`,
		false
	);

	const panelCode = "NMD-AUTO-TICKET";

	const relatedEmbedId = `NMD-TICKET-${guild.id}`;

	const panelEmbed = new EmbedBuilder()
		.setColor("#5865F2")
		.setTitle("🎫 NMDBot Support")
		.setDescription(
			"Need help? Select the type of ticket you want to create below.\n\n" +
			"**Available support:**\n" +
			"🛠️ Technical Support\n" +
			"🐞 Bug Report\n" +
			"👤 User Report\n" +
			"⚖️ Appeal\n" +
			"💬 General Support"
		)
		.addFields(
			{
				name: "📌 Before opening a ticket",
				value:
					"Please choose the correct category and explain your issue clearly.",
				inline: false
			},
			{
				name: "⏱️ Response time",
				value: "A member of the support team will help you as soon as possible.",
				inline: false
			}
		)
		.setFooter({
			text: "NMDBot • Universal Server System"
		})
		.setTimestamp();

	/*
	 * The native ticket panel uses metasTable.get("EMBED.<id>").
	 *
	 * We therefore create the embed in the actual metas table rather than
	 * putting it only in SERVER_MAKER metadata.
	 */
	await metasTable.set(`EMBED.${relatedEmbedId}`, {
		embedSource: panelEmbed.toJSON()
	});

	const makeOption = (
		name: string,
		description: string,
		value: string,
		emoji: string
	) => ({
		name,
		desc: description,
		value,
		emoji,
		categoryId: ticketCategory.id,
		rolesToPing: [staffRole.id],
		form: []
	});

	const panelData = {
		panelCode,
		relatedEmbedId,
		placeholder: "🎫 Select a ticket type...",
		category: ticketCategory.id,
		ticketChannelPanel: null,
		config: {
			rolesToPing: [staffRole.id],
			optionFields: [
				makeOption(
					"Technical Support",
					"Get help with technical problems.",
					"ticket_technical",
					"🛠️"
				),
				makeOption(
					"Bug Report",
					"Report a bug or broken feature.",
					"ticket_bug",
					"🐞"
				),
				makeOption(
					"User Report",
					"Report a member to the staff team.",
					"ticket_report",
					"👤"
				),
				makeOption(
					"Appeal",
					"Appeal a moderation action.",
					"ticket_appeal",
					"⚖️"
				),
				makeOption(
					"General Support",
					"Ask the support team a general question.",
					"ticket_general",
					"💬"
				)
			],
			pingUser: true,
			form: [],
			userSelectPanel: true,
			deleteButton: true,
			transcriptButton: true
		}
	};

	await client.db.set(
		`${guild.id}.GUILD.TICKET_PANEL.${panelCode}`,
		panelData
	);

	/*
	 * If an old automatically generated panel exists, reuse it.
	 */
	let existingPanel: TextChannel | null = null;
	let existingMessage: any = null;

	try {
		const messages = await ticketPanelChannel.messages.fetch({
			limit: 50
		});

		existingMessage =
			messages.find((message: any) =>
				message.components?.some((row: any) =>
					row.components?.some(
						(component: any) =>
							component.customId === "ticket-open-selection-v2"
					)
				)
			) || null;
	} catch {
		// Ignore message fetch failure.
	}

	const selectMenu = new StringSelectMenuBuilder()
		.setCustomId("ticket-open-selection-v2")
		.setPlaceholder("🎫 Select a ticket type...")
		.addOptions(
			panelData.config.optionFields.map((option: any) =>
				new StringSelectMenuOptionBuilder()
					.setLabel(option.name)
					.setDescription(option.desc)
					.setValue(option.value)
					.setEmoji(option.emoji)
			)
		);

	const row =
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			selectMenu
		);

	if (existingMessage) {
		await existingMessage.edit({
			embeds: [panelEmbed],
			components: [row]
		});
	} else {
		existingMessage = await ticketPanelChannel.send({
			embeds: [panelEmbed],
			components: [row]
		});
	}

	/*
	 * This is exactly what the native !panel sender does:
	 *
	 * GUILD.TICKET_PANEL.<messageId> = panelCode
	 */
	await client.db.set(
		`${guild.id}.GUILD.TICKET_PANEL.${existingMessage.id}`,
		panelCode
	);

	await client.db.set(
		`${guild.id}.GUILD.SERVER_MAKER.ticket`,
		{
			enabled: true,
			panelCode,
			panelChannel: ticketPanelChannel.id,
			category: ticketCategory.id,
			logs: ticketLogs.id,
			staffRole: staffRole.id,
			panelMessage: existingMessage.id
		}
	);
}

async function sendWelcomeMessages(
	channels: Map<string, GuildChannel>,
	guild: any
) {
	const welcome = channels.get("welcome");

	if (welcome?.type === ChannelType.GuildText) {
		const messages = await welcome.messages.fetch({ limit: 20 });

		const alreadySent = messages.some((message: any) =>
			message.author?.id === guild.client.user?.id &&
			message.embeds?.[0]?.title === "👋 Welcome to the server!"
		);

		if (!alreadySent) {
			const embed = new EmbedBuilder()
				.setColor("#5865F2")
				.setTitle("👋 Welcome to the server!")
				.setDescription(
					`Welcome to **${guild.name}**!\n\n` +
					"Please read the rules, introduce yourself and check out the available channels."
				)
				.addFields(
					{
						name: "📜 Rules",
						value: "#rules",
						inline: true
					},
					{
						name: "🎫 Support",
						value: "#create-ticket",
						inline: true
					},
					{
						name: "⭐ Leveling",
						value: "#xp-chat",
						inline: true
					}
				)
				.setTimestamp();

			await welcome.send({ embeds: [embed] });
		}
	}
}

async function sendRules(
	channels: Map<string, GuildChannel>
) {
	const channel = channels.get("rules");

	if (channel?.type !== ChannelType.GuildText) return;

	const messages = await channel.messages.fetch({ limit: 20 });

	const alreadySent = messages.some(
		(message: any) =>
			message.author?.id === channel.client.user?.id &&
			message.embeds?.[0]?.title === "📜 Server Rules"
	);

	if (alreadySent) return;

	const embed = new EmbedBuilder()
		.setColor("#E74C3C")
		.setTitle("📜 Server Rules")
		.setDescription(
			"Please follow these rules to keep the server safe and enjoyable."
		)
		.addFields(
			{
				name: "1️⃣ Respect",
				value: "Treat other members with respect."
			},
			{
				name: "2️⃣ No spam",
				value: "Do not spam, flood or abuse mentions."
			},
			{
				name: "3️⃣ No harassment",
				value: "Harassment, threats and targeted abuse are not allowed."
			},
			{
				name: "4️⃣ Follow Discord rules",
				value: "You must follow Discord's Terms of Service and Community Guidelines."
			},
			{
				name: "5️⃣ Listen to staff",
				value: "Staff decisions must be respected."
			}
		)
		.setFooter({
			text: "NMDBot • Server Rules"
		});

	await channel.send({ embeds: [embed] });
}

const command: Command = {
	name: "server_maker",
	description:
		"Builds and automatically configures a complete universal Discord server.",
	type: ApplicationCommandType.ChatInput,
	options: [],
	permissions: [PermissionFlagsBits.Administrator],

	run: async (
		client: Client,
		interaction: ChatInputCommandInteraction
	) => {
		if (!interaction.guild) {
			return interaction.reply({
				content: "❌ This command can only be used inside a server.",
				ephemeral: true
			});
		}

		const guild = interaction.guild;

		const me =
			guild.members.me ||
			(await guild.members.fetch(client.user!.id));

		if (
			!me.permissions.has(PermissionFlagsBits.Administrator) &&
			!(
				me.permissions.has(PermissionFlagsBits.ManageRoles) &&
				me.permissions.has(PermissionFlagsBits.ManageChannels)
			)
		) {
			return interaction.reply({
				content:
					"❌ NMDBot needs **Administrator** or at least **Manage Roles + Manage Channels**.",
				ephemeral: true
			});
		}

		await interaction.deferReply({ ephemeral: true });

		const createdRoles = new Map<string, Role>();
		const categories = new Map<string, CategoryChannel>();
		const channels = new Map<string, GuildChannel>();

		try {
			/*
			 * =========================================================
			 * STEP 1 — ROLES
			 * =========================================================
			 */

			for (const definition of ROLE_DEFINITIONS) {
				const role = await ensureRole(guild, definition);
				createdRoles.set(definition.name, role);
			}

			/*
			 * Give the actual Discord server owner the visible
			 * SERVER OWNER role.
			 */
			const owner = await guild.members.fetch(guild.ownerId);
			const ownerRole = createdRoles.get(OWNER_ROLE);

			if (
				ownerRole &&
				!owner.roles.cache.has(ownerRole.id)
			) {
				await owner.roles.add(
					ownerRole,
					"NMDBot Server Maker: assign Server Owner role"
				);
			}

			/*
			 * =========================================================
			 * STEP 2 — ROLE HIERARCHY
			 * =========================================================
			 */

			const botHighest = me.roles.highest.position;

			const hierarchy = [
				OWNER_ROLE,
				CO_OWNER_ROLE,
				MANAGEMENT_ROLE,
				ADMIN_ROLE,
				"Head Moderator",
				MOD_ROLE,
				"Trial Moderator",
				SUPPORT_ROLE,
				HELPER_ROLE,
				"Event Team",
				"Giveaway Team",
				"Developer",
				"Content Creator",
				"VIP",
				"Booster",
				"Verified",
				"Max Level",
				"Level 100",
				"Level 75",
				"Level 50",
				"Level 40",
				"Level 30",
				"Level 25",
				"Level 20",
				"Level 15",
				"Level 10",
				"Level 5",
				"Level 3",
				"Level 2",
				"Level 1",
				"Streamer",
				"YouTuber",
				"Artist",
				"Music Lover",
				"Gamer",
				"Community Member"
			];

			let position = Math.max(1, botHighest - 1);

			for (const roleName of hierarchy) {
				const role = createdRoles.get(roleName);

				if (!role) continue;
				if (role.managed) continue;

				try {
					if (role.position < botHighest) {
						await role.setPosition(position);
						position--;
					}
				} catch {
					// Continue if Discord rejects one position update.
				}
			}

			/*
			 * =========================================================
			 * STEP 3 — CATEGORIES
			 * =========================================================
			 */

			for (const categoryName of CATEGORY_NAMES) {
				const category = await ensureCategory(
					guild,
					categoryName
				);

				categories.set(categoryName, category);
			}

			/*
			 * =========================================================
			 * STEP 4 — CHANNELS
			 * =========================================================
			 */

			const staffRoles = STAFF_ROLE_NAMES
				.map((name) => createdRoles.get(name))
				.filter(Boolean) as Role[];

			for (const definition of CHANNEL_DEFINITIONS) {
				const category = categories.get(definition.category);

				if (!category) continue;

				const channel = await ensureChannel(
					guild,
					definition,
					category,
					staffRoles
				);

				channels.set(definition.name, channel);
			}

			/*
			 * =========================================================
			 * STEP 5 — LOGGING
			 * =========================================================
			 */

			await configureLogging(
				client,
				guild.id,
				channels
			);

			/*
			 * =========================================================
			 * STEP 6 — TICKETS
			 * =========================================================
			 */

			const ticketCategory =
				categories.get("🎫 SUPPORT");

			const ticketPanelChannel =
				channels.get("create-ticket");

			const ticketLogs =
				channels.get("ticket-logs");

			const supportRole =
				createdRoles.get(SUPPORT_ROLE);

			if (
				ticketCategory &&
				ticketPanelChannel?.type === ChannelType.GuildText &&
				ticketLogs &&
				supportRole
			) {
				await configureTicketSystem(
					client,
					guild,
					ticketCategory,
					ticketPanelChannel,
					ticketLogs,
					supportRole
				);
			}

			/*
			 * =========================================================
			 * STEP 7 — XP / LEVELING
			 * =========================================================
			 */

			const xpChannel = channels.get("xp-chat");
			const levelUpChannel = channels.get("level-up");

			const levelRoleNames = [
				"Level 1",
				"Level 2",
				"Level 3",
				"Level 5",
				"Level 10",
				"Level 15",
				"Level 20",
				"Level 25",
				"Level 30",
				"Level 40",
				"Level 50",
				"Level 75",
				"Level 100",
				"Max Level"
			];

			const levelRoles = levelRoleNames
				.map((name) => createdRoles.get(name))
				.filter(Boolean) as Role[];

			if (xpChannel && levelUpChannel) {
				await configureXP(
					client,
					guild.id,
					xpChannel,
					levelUpChannel,
					levelRoles
				);
			}

			/*
			 * =========================================================
			 * STEP 8 — SERVER MAKER MASTER CONFIG
			 * =========================================================
			 */

			await client.db.set(
				`${guild.id}.GUILD.SERVER_MAKER`,
				{
					version: 2,
					enabled: true,
					completedAt: Date.now(),

					ownerRole:
						createdRoles.get(OWNER_ROLE)?.id,

					roles: Object.fromEntries(
						[...createdRoles.entries()].map(
							([name, role]) => [name, role.id]
						)
					),

					categories: Object.fromEntries(
						[...categories.entries()].map(
							([name, category]) => [name, category.id]
						)
					),

					channels: Object.fromEntries(
						[...channels.entries()].map(
							([name, channel]) => [name, channel.id]
						)
					),

					staffRoles:
						staffRoles.map((role) => role.id),

					ticket: {
						enabled: true,
						channel: channels.get("create-ticket")?.id,
						category: ticketCategory?.id,
						logs: ticketLogs?.id
					},

					leveling: {
						enabled: true,
						xpChannel: xpChannel?.id,
						levelUpChannel: levelUpChannel?.id,
						levelRoles: levelRoles.map(
							(role) => role.id
						)
					},

					logging: Object.fromEntries(
						Object.entries(LOG_CHANNELS).map(
							([key, channelName]) => [
								key,
								channels.get(channelName)?.id
							]
						)
					),

					features: {
						welcome: true,
						suggestions: true,
						giveaways: true,
						moderation: true,
						economy: true,
						leaderboards: true,
						announcements: true,
						tickets: true,
						leveling: true,
						logging: true
					}
				}
			);

			/*
			 * =========================================================
			 * STEP 9 — DEFAULT CONTENT
			 * =========================================================
			 */

			await sendWelcomeMessages(
				channels,
				guild
			);

			await sendRules(channels);

			/*
			 * =========================================================
			 * DONE
			 * =========================================================
			 */

			const ownerMention =
				owner.toString();

			await interaction.editReply({
				content:
					"## ✅ NMDBot Server Maker klaar!\n\n" +
					`👑 **Server Owner:** ${ownerMention}\n` +
					`🎭 **Rollen:** ${createdRoles.size}\n` +
					`📁 **Categorieën:** ${categories.size}\n` +
					`💬 **Kanalen:** ${channels.size}\n` +
					`🎫 **Tickets:** geconfigureerd\n` +
					`⭐ **XP/Levels:** geconfigureerd\n` +
					`📊 **Logging:** geconfigureerd\n` +
					`♻️ **Rerun-safe:** ja\n\n` +
					"### 🚀 Belangrijk\n" +
					"De NMDBot-rol staat boven de door Server Maker aangemaakte rollen. " +
					"Je kunt `/server_maker` later opnieuw uitvoeren om de structuur opnieuw te synchroniseren."
			});
		} catch (error) {
			console.error(
				"[SERVER_MAKER]",
				error
			);

			await interaction.editReply({
				content:
					"❌ **Server Maker is gedeeltelijk uitgevoerd, maar er trad een fout op.**\n\n" +
					"Controleer de Render logs voor `[SERVER_MAKER]`.\n\n" +
					"De aangemaakte onderdelen blijven bestaan; je kunt `/server_maker` opnieuw uitvoeren."
			});
		}
	}
};

export default command;
