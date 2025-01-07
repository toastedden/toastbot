// ToastBot - discord.js version 13.17.1
// GitHub: https://github.com/toastedden/ToastBot

// Import core modules and libraries
const fs = require('fs');         // Handles file system operations (read/write to files)
const path = require('path');     // Provides utilities for working with file and directory paths
const Discord = require('discord.js'); // Discord.js library to interact with the Discord API

// Load environment variables from .env file
require('dotenv').config();       // Makes configuration variables accessible throughout the app

/* 
// TODO:  Function to fetch older messages
// Function to fetch recent messages from specified channels after restart
async function fetchRecentMessages() {
    const channelIds = [process.env.CHANNEL_1_ID, process.env.CHANNEL_2_ID]; // Add desired channel IDs here
    const messagesToFetch = 100; // Define how many messages to fetch per channel

    for (const channelId of channelIds) {
        try {
            const channel = await client.channels.fetch(channelId);
            if (channel && channel.isTextBased()) {
                const fetchedMessages = await channel.messages.fetch({ limit: messagesToFetch });
                fetchedMessages.forEach(msg => {
                    console.log(`[${msg.createdAt}] ${msg.author.username}: ${msg.content}`);
                    // Process or log messages as needed
                });
            }
        } catch (error) {
            console.error(`Error fetching messages for channel ${channelId}:`, error);
        }
    }
}
*/

// Configure and set bot's rich presence using settings from the JSON file
function setRichPresence() {
    // Load presence settings from the configuration file
    const richPresenceConfig = require('../data/set-rich-presence.json');
    
    // Update the bot's presence (status and activity) based on loaded settings
    client.user.setPresence({
        activities: [{ name: richPresenceConfig.activity, type: richPresenceConfig.type }],
        status: richPresenceConfig.status // Status options: online, idle, dnd, invisible
    });

    // Clear cached config file to allow reloading on next call
    delete require.cache[require.resolve('../data/set-rich-presence.json')];
}

// Logging configuration and setup

// Define the directory for log files and create it if it doesn't exist
const logsDir = path.join(__dirname, '../' + process.env.LOG_PATH);
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true }); // Recursively create the logs directory if needed
}

// Generate the log file path based on the current date (formatted as YYYY-MM-DD)
function getLogFilePath() {
    const date = new Date().toISOString().split('T')[0];
    return path.join(logsDir, `${process.env.LOG_FILE}_${date}.log`); // Construct full path with date
}

// Initialize log file path for today's date
let logFilePath = getLogFilePath();

// Write a message to the current log file with a timestamp
function writeLog(message) {
    const logMessage = `[${new Date().toLocaleString()}] - ${message}\n`; // Format: timestamp - message
    fs.appendFileSync(logFilePath, logMessage, 'utf8'); // Append to the log file
}

// Update the log file path daily at midnight to ensure each day has a separate log file
function updateLogFilePathDaily() {
    const currentDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    if (!logFilePath.includes(currentDate)) {
        logFilePath = getLogFilePath(); // Update path if date has changed
    }
}

// Set interval to check and update the log file path daily
setInterval(updateLogFilePathDaily, 60 * 1000); // Runs every 1 minute

// Initialize Discord client instance with required intents
const client = new Discord.Client({
    intents: [
        "GUILDS",             // Enables bot to receive guild-related events
        "GUILD_MESSAGES",     // Enables bot to receive message-related events in guilds
        "GUILD_MEMBERS",      // Enables bot to receive events related to guild members
        "GUILD_PRESENCES",    // Enables bot to receive presence events (e.g., online/offline status)
    ]
});

// Actions to perform when the bot is fully ready and online
client.once('ready', async () => {
    // Retrieve the bot logs channel from environment variable BOT_LOGS_CHANNEL
    const botlogsChannel = await client.channels.fetch(process.env.BOT_LOGS_CHANNEL);

    // If the bot logs channel exists, send a startup confirmation message
    if (botlogsChannel) {
        botlogsChannel.send(`ToastBot has started successfully and is online. (v${process.env.VERSION})\nCheck the node's console logs for more details.`);
    }

    // Log bot startup event locally
    const logMessage = `STARTUP - ToastBot is online (v${process.env.VERSION})`;
    console.log(`${logMessage}`); // Log to console
    writeLog(logMessage); // Log to file

    // TODO: Implement older message fetch functionality
    // fetchRecentMessages();

    // Initialize bot's rich presence display
    setRichPresence(); // Set rich presence based on configuration
    setInterval(setRichPresence, 60 * 1000); // Refresh presence display every minute

    // Rich Presence Activity Types:
    // Playing = 0, Streaming = 1, Listening = 2, Watching = 3, Custom = 4, Competing = 5
});

// Event handler for when a new member joins the guild
client.on("guildMemberAdd", async (member) => {
    // Fetch the welcome and bot logs channels from environment variables
    const welcomeChannel = await member.guild.channels.fetch(process.env.WELCOME_CHANNEL);
    const botlogsChannel = await member.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL);

    // Reload the welcome messages to ensure fresh data
    delete require.cache[require.resolve('../data/welcome-messages.json')];
    const welcomeMessages = require('../data/welcome-messages.json').welcomeMessages;

    // Send a welcome message in the designated channel if it exists
    if (welcomeChannel) {
        // Randomly select a welcome message from the array
        const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
        let welcomeMessage = welcomeMessages[randomIndex];

        // Replace placeholder with the actual member ID for personalized greeting
        welcomeMessage = welcomeMessage.replace("{{user_id}}", member.user.id);

        // Send the personalized welcome message, or fallback if selection fails
        welcomeChannel.send(welcomeMessage || `Unexpected error in welcome selection. Welcome, ultra-rare <@${member.user.id}>!`);

        // Log the member join event in the bot logs channel, if available
        if (botlogsChannel) {
            // Create Discord embed for member join
            const embed = {
                color: 0x00ff00, // Green color for joins
                author: {
                    name: `Member Joined`,
                    icon_url: member.user.avatarURL()
                },
                description: `**Username:** ${member.user.username}\n**User ID:** ${member.user.id}\n**Welcome Message:** #${randomIndex}`,
                footer: {
                    text: `Account Created: ${member.user.createdAt.toLocaleString()}`
                },
                timestamp: new Date()
            };

            // Send embed to the logs channel
            await botlogsChannel.send({ embeds: [embed] });
            
            // Log the join event with username, UID, and message index
            const logMessage = `MEMBER_JOINED - User: ${member.user.username} (UID: ${member.user.id}) has joined the server with welcome message #${randomIndex}`;
            console.log(logMessage);
            writeLog(logMessage); // Write to log file
        }
    }
});

// Event handler for when a member leaves the guild
client.on('guildMemberRemove', async (member) => {
    // Retrieve the bot logs channel using the BOT_LOGS_CHANNEL environment variable
    const botlogsChannel = await member.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL);

    // Log the member leave event if the bot logs channel is accessible
    if (botlogsChannel) {
        // Create Discord embed for member leave
        const embed = {
            color: 0xff0000, // Red color for leaves
            author: {
                name: `Member Left`,
                icon_url: member.user.avatarURL()
            },
            description: `**Username:** ${member.user.username}\n**User ID:** ${member.user.id}`,
            footer: {
                text: `Account Created: ${member.user.createdAt.toLocaleString()}`
            },
            timestamp: new Date()
        };

        // Send embed to the logs channel
        await botlogsChannel.send({ embeds: [embed] });
        
        // Define and log the event details locally
        const logMessage = `MEMBER_LEFT - User: ${member.user.username} (UID: ${member.user.id}) has left the server`;
        console.log(`${logMessage}`); // Output to console with timestamp
        writeLog(logMessage); // Append the log entry to the log file
    }
});

// Event handler for when a message is sent in the guild
client.on('messageCreate', (message) => {
    // Check if the message is from the specified guild and not from a bot
    if (message.guild.id === process.env.GUILD_ID && !message.author.bot) {
        // Format message content for readability, replacing newlines with '\\n'
        const messageContent = message.content
            ? message.content.replace(/\n/g, '\\n') // Replace newlines with visible '\\n'
            : "<No Content or Media File>"; // Placeholder for messages with no text

        // Log the message event locally with details about the sender, channel, and content
        const logMessage = `MESSAGE_CREATED - User: ${message.author.username} (UID: ${message.author.id}) - Channel: #${message.channel.id} - "${messageContent}"`;
        writeLog(logMessage); // Append the log entry to the log file
    }
});

// Event handler for when a message is deleted in the guild
client.on('messageDelete', async (message) => {
    try {
        if (message.author?.bot) return;

        const botlogsChannel = await message.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL);
        if (!botlogsChannel) return;

        const messageContent = message.content
            ? message.content.replace(/\n/g, '\\n')
            : "*No Content or Media File*";

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });

        const deletionLog = fetchedLogs.entries.first();
        let deleter = null;

        if (deletionLog) {
            const { executor, target, createdTimestamp } = deletionLog;
            if (target.id === message.author.id && 
                Date.now() - createdTimestamp < 5000) {
                deleter = executor;
            }
        }

        // Log message format fixed to not include timestamp
        const logMessage = deleter
            ? `MESSAGE_DELETED - Message Author: ${message.author.username} (UID: ${message.author.id}) - Deleted By: ${deleter.username} (UID: ${deleter.id}) - Channel: #${message.channel.id} - Content: "${messageContent}"`
            : `MESSAGE_DELETED - Message Author: ${message.author.username} (UID: ${message.author.id}) - Self Deleted - Channel: #${message.channel.id} - Content: "${messageContent}"`;

        console.log(logMessage);
        writeLog(logMessage); // writeLog function will add the timestamp

        const embed = {
            color: 0xFF6600,
            author: {
                name: deleter 
                    ? `Message Deleted by ${deleter.username}` 
                    : 'Message Self-Deleted',
                icon_url: deleter?.avatarURL() || message.author.avatarURL()
            },
            description: `**Message Author:** <@${message.author.id}>\n**Message Author ID:** ${message.author.id}\n**Channel:** <#${message.channel.id}>\n**Channel ID:** ${message.channel.id}\n**Message Content:**\n${messageContent}`,
            footer: {
               text: deleter ? `Deleted by ${deleter.username} (${deleter.id})` : 'Self-Deleted'
            },
            timestamp: new Date()
        };

        await botlogsChannel.send({ embeds: [embed] });

    } catch (err) {
        console.error('Error handling message deletion:', err);
        writeLog(`Error in messageDelete event: ${err.message}\n${err.stack}`);
    }
});

// Log in using the token from the .env file
client.login(process.env.TOKEN);
