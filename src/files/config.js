import { ConfigData } from "../../types/configDatad.js";

const config = {
    discord: {
        token: process.env.BOT_TOKEN,

        phonePresence: false,

        messageCommandsMention: true,

        defaultMessageCommandsPrefix: "?"
    },

    lavalink: {
        nodes: [
            {
                id: "example_node",
                host: "lavalink.example.com",
                port: 2333,
                authorization: "password",
                secure: false
            }
        ]
    },

    core: {
        devMode: true,

        blacklistPictureInEmbed: "A .png URL",

        guildLogsChannelID: "The Discord Channel ID for logs when guildCreate/guildRemove",

        lavalinkLogsChannelID: "The Discord Channel ID for logs when lavalink throws an error",

        reportChannelID: "The Discord Channel ID for logs when bugs are reported"
    },

    command: {
        always100: ["USER_ID_ONExUSER_ID_TWO"]
    },

    owners: {
        users: ["User ID", "User ID"]
    },

    api: {
        apiToken: "The API token"
    },

    lastfm: {
        apiKey: "Last.fm API key",
        sharedSecret: "Last.fm shared secret"
    },

    console: {
        emojis: {
            OK: "✅",
            ERROR: "❌",
            HOST: "💻",
            KISA: "👩",
            LOAD: "🔄"
        }
    },

    database: {
        method: "sqlite",

        mySQL: [
            {
                host: "",
                password: "",
                database: "",
                user: "",
                port: 3306
            }
        ]
    }
};

export default config;
