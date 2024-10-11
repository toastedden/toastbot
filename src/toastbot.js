// ToastBot - discord.js version 13.17.1
// GitHub: https://github.com/toastedden/ToastBot

// Import modules
const fs = require('fs'); // Import the 'fs' (file system) module
const path = require('path'); // Import the 'path' module for working with file and directory paths
const Discord = require('discord.js'); // Import the 'discord.js' module for interacting with the Discord API

// Load environment variables from the .env file
require('dotenv').config();

// Logging
// Define the logs directory and log file path based on environment variables
const logsDir = path.join(__dirname, '../' + process.env.LOG_PATH); // Set the logs directory based on LOG_PATH from .env
// Define the log file with the current timestamp in the title
const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format timestamp and replace unsupported characters
const logFilePath = path.join(logsDir, `${process.env.LOG_FILE}_${timestamp}.log`); // Set the log file name using LOG_FILE from .env with timestamp appended
// Ensure the logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true }); // Create the logs directory if it doesn't exist
}
// Function to write to the log file
function writeLog(message) {
    const logMessage = `[${new Date().toLocaleString()}] - ${message}\n`; // Prefix [date] at the beginning of log entry, followed by the message
    fs.appendFileSync(logFilePath, logMessage, 'utf8'); // Append new entries to the log file with UTF-8 encoding
}

// Create a new Discord client instance with select intents
const client = new Discord.Client({
    intents: [
        "GUILDS",             // Intent for guild-related events
        "GUILD_MESSAGES",     // Intent for guild message-related events
        "GUILD_MEMBERS",      // Intent for guild member-related events
        "GUILD_PRESENCES",    // Intent for guild presences-related events
    ]
});

// Executions on startup
client.once('ready', async () => {
    // Fetch the bot logs channel based on BOT_LOGS_CHANNEL from .env
    const botlogsChannel = await client.channels.fetch(process.env.BOT_LOGS_CHANNEL);
    // Logging
    // Send startup message to botLogsChannel channel
    if (botlogsChannel) {
        botlogsChannel.send(`ToastBot has started up successfully and is online. (v${process.env.VERSION})\nCheck the nodes console logs for more details.`);
    }
    // Log startup locally
    // Log format: EVENT - Details (VERSION)
    const logMessage = `STARTUP - ToastBot is online (v${process.env.VERSION})`; // Set the startup log message
    console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // Log successful startup to the console, [date] followed by logMessage
    writeLog(logMessage); // Write successful startup to log file

    // // Set the bots rich-presence
    // // Set rich-presence status to "Watching Toasted Den Videos"
    // client.user.setActivity("Toasted Den Videos", { type: "WATCHING" });
    // // Ensure bot status refreshes every hour
    // setInterval(function() {
    //     client.user.setActivity("Toasted Den Videos", { type: "WATCHING" }); // Set the bots rich presence to "Watching Toasted Den Videos"
    // }, 3600 * 1000); // Set timer to one hour
    // // For custom rich-presence:
    // client.user.setActivity(`i see you`, {type: 4});
    // Playing: 0 = 0
    // Streaming: 1 = 1
    // Listening: 2 = 2
    // Watching: 3 = 3
    // Custom: 4 = 4
    // Competing: 5 = 5
});

// Event listener for when a new member joins the guild
client.on("guildMemberAdd", async (member) => {
    // Fetch the welcome channel based on WELCOME_CHANNEL from .env
    const welcomeChannel = await member.guild.channels.fetch(process.env.WELCOME_CHANNEL);
    // Fetch the bot logs channel based on BOT_LOGS_CHANNEL from .env
    const botlogsChannel = await member.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL);

    // Check to ensure the welcome message is sent in the correct channel
    if (welcomeChannel) {
        // Welcome Messages - Array
        const messages = [
            `<@${member.user.id}> is here!`,
            `Salutations <@${member.user.id}>!`,
            `<@${member.user.id}> just dropped in from orbit!`,
            `Great Scott! It's <@${member.user.id}>!`,
            `We've been expecting you <@${member.user.id}>...`,
            `Took you long enough <@${member.user.id}>...`,
            `You finally arrived <@${member.user.id}>.`,
            `Make yourself at home <@${member.user.id}>.`,
            `Stay a while <@${member.user.id}>.`,
            `Wake the fuck up <@${member.user.id}>, we got a city to burn!`,
            `You've made it <@${member.user.id}>.`,
            `<@${member.user.id}> has entered the server.`,
            `Have you ever wondered why we're here <@${member.user.id}>?`,
            `<@${member.user.id}> you've made it to safety, your soul will not be harvested tonight.`,
            `It's <@${member.user.id}>!`,
            `Hit the deck, it's <@${member.user.id}>!`,
            `Somebody get <@${member.user.id}> a drink!`,
            `<@${member.user.id}> just appeared through a slipspace portal.`,
            `Good to see you, <@${member.user.id}>.`,
            `<@${member.user.id}> dug straight down and landed in the server.`,
            `Paint me yellow and call me fucking sunshine, It's <@${member.user.id}>!`,
            `Hey <@${member.user.id}>, you're finally awake. You were trying to cross the border, right?`,
            `<@${member.user.id}> just clocked in.`,
            `Welcome <@${member.user.id}>, stay awhile.`,
            `Hello, friend <@${member.user.id}>.`,
            `I need your clothes, your boots, and your motorcycle <@${member.user.id}>.`,
            `The Fog is coming, <@${member.user.id}>...`,
            `Back there <@${member.user.id}>`,
            `Well I'll be a sonofabitch, <@${member.user.id}> is here!`,
            `Please enjoy each server channel equally, <@${member.user.id}>.`,
            `<@${member.user.id}> has found us...`
        ];
        // Pick a random number between 0 and messages.length to determine which welcome message to use
        let welcomeMessage = Math.floor(Math.random() * messages.length);
        
        // Send welcome message in the welcomeChannel or a fallback message if RNG fails
        welcomeChannel.send(messages[welcomeMessage] || `That's odd, it appears my random number generator failed. You've got an ultra rare welcome message <@${member.user.id}>!`);
        // Determine the index of the welcome message for logging
        const welcomeMessageIndex = messages[welcomeMessage] ? welcomeMessage : -1;
        
        // Logging
        if (botlogsChannel) {
            // Send a log message in the botlogsChannel that a user has joined the guild
            botlogsChannel.send(`<@${member.user.id}> - \`UID: ${member.user.id}\`\nhas joined the server with welcome message #${welcomeMessageIndex}`);
            // Log the user joining event locally with the welcome message index
            // Log event locally
            // Log format: EVENT - User: AuthorUsername (AuthorUserID) - Details #welcomeMessageIndex
            const logMessage = `MEMBER_JOINED - User: ${member.user.username} (UID: ${member.user.id}) has joined the server with welcome message #${welcomeMessageIndex}`;
            console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // Log to console with date and logMessage
            writeLog(logMessage); // Write the log entry to the log file
        }
    }
});

// Event listener for when a member leaves the guild
client.on('guildMemberRemove', async (member) => {
    // Fetch the bot logs channel based on BOT_LOGS_CHANNEL from .env
    const botlogsChannel = await member.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL);

    // Logging
    // Ensure the log message is sent to the correct channel
    if (botlogsChannel) {
        // Send a message in the botLogsChannel that a user has left the guild
        botlogsChannel.send(`**${member.user.username}** - \`UID: ${member.user.id}\`\nhas left the server.`);
        // Log event locally
        // Log format: EVENT - User: AuthorUsername (AuthorUserID) - Details
        const logMessage = `MEMBER_LEFT - User: ${member.user.username} (UID: ${member.user.id}) has left the server`; // Set the user leaving log message
        console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // Log the user leaving in the console with date and logMessage
        writeLog(logMessage); // Write user leaving info to the log file
    }
});

// Event listener for when a message is sent in the guild
client.on('messageCreate', (message) => {
    // Ensure the message is from the specified guild and not sent by a bot
    if (message.guild.id === process.env.GUILD_ID && !message.author.bot) {
        // Format message content to make multiline messages more readable
        const messageContent = message.content
            ? message.content.replace(/\n/g, '\\n') // Replace newlines with visible \n
            : "<No Content>"; // Use a placeholder if message.content is empty

        // Logging
        // Log the event locally
        // Log format: EVENT - User: AuthorUsername (AuthorUserID) - Channel: #ChannelID - "MessageContents"
        const logMessage = `MESSAGE_CREATED - User: ${message.author.username} (UID: ${message.author.id}) - Channel: #${message.channel.id} - "${messageContent}"`;
        writeLog(logMessage); // Write the logMessage to the log file
    }
});

// Event listener for when a message is deleted in the guild
client.on('messageDelete', async (message) => {
    // Define variables
    const botlogsChannel = await message.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL); // Fetch the bot logs channel ID based on BOT_LOGS_CHANNEL from .env

    // Ensure the message is from the specified guild and not sent by a bot
    if (message.guild.id === process.env.GUILD_ID && !message.author.bot) {
        // Format message content to handle cases where the content might be empty
        const messageContent = message.content
            ? message.content.replace(/\n/g, '\\n') // Replace newlines with visible \n
            : "<No Content>"; // Use a placeholder if message.content is empty

        // Logging
        // Verify that we're sending in the botLogsChannel
        if (botlogsChannel) {
            // Send a message to the botLogsChannel that a user has deleted a message
            botlogsChannel.send(`<@${message.author.id}> - \`UID: ${message.author.id}\`\nhas deleted a message in <#${message.channel.id}>.\n\`\`\`${messageContent}\`\`\``);
            // Log event locally
            // Log format: EVENT - User: AuthorUsername (AuthorUserID) - Channel: #ChannelID - "MessageContent"
            const logMessage = `MESSAGE_DELETED - User: ${message.author.username} (UID: ${message.author.id}) - Channel: #${message.channel.id} - "${messageContent}"`; // Set deleted message log message
            console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // Log the deleted message in the console
            writeLog(logMessage); // Write deleted message info to the log file
        }
    }
});

// Login using the token from .env
client.login(process.env.TOKEN);