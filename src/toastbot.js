// ToastBot version 1.0.4, Read-only - discord.js version 13.0.0
// GitHub: https://github.com/Toasted-Den/ToastBot
// Application ID: 918673030417379369

// Import the 'discord.js' module
const Discord = require('discord.js');

// Load environment variables from a .env file
require('dotenv').config();

// Create a new Discord client instance with specific intents
const client = new Discord.Client({
    intents: [
        "GUILDS",             // Intent for guild-related events
        "GUILD_MESSAGES",     // Intent for guild message-related events
        "GUILD_MEMBERS"       // Intent for guild member-related events
    ]
});

// Executions on startup
client.once('ready', () => {
    const now = new Date(); // get the current date and time
    console.log(`ToastBot is online - ${now.toLocaleString()}`); // Log that the bot is online
    // Ensure bot status refreshes every hour
    // setInterval(function() {
    //     client.user.setActivity("Toasted Den Videos", { type: "WATCHING" }); // Set bot status to "Watching Toasted Den Videos"
    // }, 3600 * 1000);
    // // Set initial status to "Watching Toasted Den Videos"
    // client.user.setActivity("Toasted Den Videos", { type: "WATCHING" });
});

// Event listener for when a new member joins the guild
client.on("guildMemberAdd", async(member) => {
    let welcomeMessage = Math.floor(Math.random() * 30);  // Pick a random number between 0 and 29 to determine the user's welcome message   
    const welcomeChannel = member.guild.channels.cache.get('1048718163610701906'); // Get the welcome channel by its ID  
    const logChannel = member.guild.channels.cache.get('904137214965981255'); // Get the log channel by its ID

    // Log the user joining with their welcome message number in the console
    console.log(`${member.user.username} has joined with welcome message #${welcomeMessage}`);

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
            `<@${member.user.id}> has found us...?`
        ];

        // Send message in #welcome channel, or send rare welcome message in the event the RNG fails
        welcomeChannel.send(messages[welcomeMessage] || `That's odd, it appears my random number generator failed. You've got an ultra rare welcome message <@${member.user.id}>!`);

        // Send message in #bot-logs that a user has joined the server.
        logChannel.send(`<@${member.user.id}> (\`${member.user.id}\`) has joined the server.`);
    }
});

// Event listener for when a member leaves the guild
client.on('guildMemberRemove', async(member) => {
    const logChannel = member.guild.channels.cache.get('904137214965981255'); // Get the log channel by its ID
    
    // Log the user leaving in the console
    console.log(`${member.user.username} has left the server.`);
    
    // Check to make sure we're sending in the #bot-logs channel
    if (logChannel) {
        // Send a message saying a user has left.
        logChannel.send(`**${member.user.username}** (\`${member.user.id}\`) has left the server.`);
    }
});

// login using .env
client.login(process.env.TOKEN);