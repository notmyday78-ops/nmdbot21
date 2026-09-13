/*
・ NMDBot
・ Based on iHorizon
*/

import { Guild } from "discord.js";

// Discord endpoint for modifying the current bot member in a guild
export const GUILD_ME_WITH_GUILD_ID_ENDPOINT_URL =
	"https://discord.com/api/v10/guilds/{guild.id}/members/@me";

export async function changeGuildBotName(
	guild: Guild,
	nick: string
): Promise<boolean> {
	const res = await fetch(
		GUILD_ME_WITH_GUILD_ID_ENDPOINT_URL.replace("{guild.id}", guild.id),
		{
			method: "PATCH",
			headers: {
				Authorization: `Bot ${client.token}`,
				"X-Audit-Log-Reason": "NMDBot profile update",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				nick
			})
		}
	);

	return res.status === 200;
}

export async function changeGuildBotBanner(
	guild: Guild,
	banner: string
): Promise<boolean> {
	const res = await fetch(
		GUILD_ME_WITH_GUILD_ID_ENDPOINT_URL.replace("{guild.id}", guild.id),
		{
			method: "PATCH",
			headers: {
				Authorization: `Bot ${client.token}`,
				"X-Audit-Log-Reason": "NMDBot profile update",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				banner
			})
		}
	);

	return res.status === 200;
}

export async function changeGuildBotAvatar(
	guild: Guild,
	avatar: string
): Promise<boolean> {
	const res = await fetch(
		GUILD_ME_WITH_GUILD_ID_ENDPOINT_URL.replace("{guild.id}", guild.id),
		{
			method: "PATCH",
			headers: {
				Authorization: `Bot ${client.token}`,
				"X-Audit-Log-Reason": "NMDBot profile update",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				avatar
			})
		}
	);

	return res.status === 200;
}

export async function changeGuildBotBio(
	guild: Guild,
	bio: string
): Promise<boolean> {
	const sanitizeBio =
		bio.length <= 190 ? bio : bio.split("\n").slice(0, 2).join("\n");

	const finalBio = [...sanitizeBio].slice(0, 190).join("");

	const res = await fetch(
		GUILD_ME_WITH_GUILD_ID_ENDPOINT_URL.replace("{guild.id}", guild.id),
		{
			method: "PATCH",
			headers: {
				Authorization: `Bot ${client.token}`,
				"X-Audit-Log-Reason": "NMDBot profile update",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				bio: finalBio
			})
		}
	);

	return res.status === 200;
}
