// ToastBot version 1.0.6, Read-only - discord.js version 13.0.0
// GitHub: https://github.com/Toasted-Den/ToastBot
// Application ID: 918673030417379369

// Import modules
const fs = require('fs'); // Import the 'file system' module
const path = require('path'); // Import the 'path' module
const Discord = require('discord.js'); // Import the 'discord.js' module

// Logging
// Define the logs directory and log file path
const logsDir = path.join(__dirname, '../logs'); // Set the logging path to ./logs
const logFilePath = path.join(logsDir, 'toastbot.log'); // Set log file name to "toastbot.log"

// Ensure the ./logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Function to write to the log file
function writeLog(message) {
    const logMessage = `[${new Date().toLocaleString()}] - ${message}\n`; // Add [date] at beginning of log entry, followed by the message
    fs.appendFileSync(logFilePath, logMessage, 'utf8');  
}

// Load environment variables from a .env file
require('dotenv').config();

// Create a new Discord client instance with specific intents
const client = new Discord.Client({
    intents: [
        "GUILDS",             // Intent for guild-related events
        "GUILD_MESSAGES",     // Intent for guild message-related events
        "GUILD_MEMBERS",      // Intent for guild member-related events
        "GUILD_PRESENCES",    // Intent for guild presences-related events
    ]
});

// Executions on startup
client.once('ready', () => {
    // Logging
    const logMessage = `ToastBot is online (1.0.6)`; // Set the startup log message
    console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // Log successful startup to console, [date] followed by logMessage
    writeLog(logMessage); // Write successful startup to log file

    // Set the bots rich-presence
    // // Set rich-presence status to "Watching Toasted Den Videos"
    // client.user.setActivity("Toasted Den Videos", { type: "WATCHING" });
    // Ensure bot status refreshes every hour
    // setInterval(function() {
    //     client.user.setActivity("Toasted Den Videos", { type: "WATCHING" }); // Set the bots rich presence to "Watching Toasted Den Videos"
    // }, 3600 * 1000); // Set timer to one hour
});

// Event listener for when a new member joins the guild
client.on("guildMemberAdd", async (member) => {
    // Define variables
    let welcomeMessage = Math.floor(Math.random() * 30); // Pick a random number between 0 and 29 to determine the user's welcome message
    const welcomeChannel = member.guild.channels.cache.get('1048718163610701906'); // Get the #welcome channel by its ID  
    const botlogsChannel = member.guild.channels.cache.get('904137214965981255'); // Get the #bot-logs channel by its ID

    // Check to make sure we're sending in the #welcome channel
    if (welcomeChannel) {
        // Welcome Messages
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
            `<@${member.user.id}> has found us...`,
        ];
        
        // Send messages through Discord
        // Send message in #welcome channel, or send rare welcome message in the event the RNG fails
        welcomeChannel.send(messages[welcomeMessage] || `That's odd, it appears my random number generator failed. You've got an ultra rare welcome message <@${member.user.id}>!`);
        // Send message in #bot-logs that a user has joined the server.
        botlogsChannel.send(`<@${member.user.id}> - UID: \`${member.user.id}\`\nhas joined the server with welcome message #${welcomeMessage}`);

        // Logging
        const logMessage = `${member.user.username} (UID: ${member.user.id}) has joined the server with welcome message #${welcomeMessage}`; // Set the user joining log message
        console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // Log the user joining with their welcome message number in the console [date] followed by logMessage
        writeLog(logMessage); // Write user joined info to the log file
    }
});

// Event listener for when a member leaves the guild
client.on('guildMemberRemove', async (member) => {
    // Define variables
    const botlogsChannel = member.guild.channels.cache.get('904137214965981255'); // Get the #bot-logs channel by its ID

    // Check to make sure we're sending in the #bot-logs channel
    if (botlogsChannel) {
        // Send a message saying a user has left.
        botlogsChannel.send(`**${member.user.username}** - UID: \`${member.user.id}\`\nhas left the server.`);

        // Logging
        const logMessage = `${member.user.username} (UID: ${member.user.id}) has left the server.`; // Set user has left log message
        console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // Log the user leaving in the console
        writeLog(logMessage); // Write user has left info to the log file
    }
});

// login using .env
client.login(process.env.TOKEN);