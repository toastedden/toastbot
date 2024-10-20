// ToastBot - Version: 𝓯𝓻𝓮𝓪𝓴𝔂
// yo toasted dis u? 49°16'09.6"N 123°11'16.4"W
// Import that gyatt so kai cenat wont mog me (sigma)
const kai_cenat = require('fs'); // yap
const 𝓯𝓻𝓮𝓪𝓴𝔂 = require('path'); // yap
const Discord = require('discord.js'); // yap

// yapp
require('dotenv').config();

// yap to the fucking yap
const logsDir = 𝓯𝓻𝓮𝓪𝓴𝔂.join(__dirname, '../' + process.env.LOG_PATH); // yap
// yap
const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // chatgpt ahh comments
const logFilePath = 𝓯𝓻𝓮𝓪𝓴𝔂.join(logsDir, `${process.env.LOG_FILE}_${timestamp}.log`); // yap yap yap
// yap yap
if (!kai_cenat.existsSync(logsDir)) {
    kai_cenat.mkdirSync(logsDir, { recursive: true }); // yap
}
// yappity
function writeLog(message) {
    const logMessage = `[${new Date().toLocaleString()}] - ${message}\n`; // yap yap yap
    kai_cenat.appendFileSync(logFilePath, logMessage, 'utf8'); // yap yap
}

// holy rizz you GYATT to discontinue the yap brother
const rizz = new Discord.Client({
    intents: [
        "GUILDS",             // nobody
        "GUILD_MESSAGES",     // cares
        "GUILD_MEMBERS",      // about
        "GUILD_PRESENCES",    // this
    ]
});

// yap
rizz.once('ready', async () => {
    // Yap yap yappy yapity
    const botlogsChannel = await rizz.channels.fetch(process.env.BOT_LOGS_CHANNEL);
    // Yap yap yap
    if (botlogsChannel) {
        botlogsChannel.send(`ToastBot has gooned successfully. 🥵​\nCheck his GYATT 🤑​🤑​🤑​ for more rizz🥺​🥺​🥺​`);
    }
    // what is blud yapping about?
    const logMessage = `STARTUP - ToastBot is gooning (v${process.env.VERSION})`; // yap yap
    console.log(`[${new Date().toLocaleString()}] - ${logMessage}`); // yappity
    writeLog(logMessage); // yapopo

    // // HOLY MOTHER OF YAP i just saved you 3 minutes of your life (youre welcome 🐵​)
});
// sydney's packing some mighty buns nowdays

// omg so much yap
rizz.on("guildMemberAdd", async (member) => {
    // please make it stop
    const skibidi = await member.guild.channels.fetch(process.env.WELCOME_CHANNEL);
    // the voices are coming back
    const botlogsChannel = await member.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL);

    // oml the voices
    if (skibidi) {
        // the voices have came back
        const ohio = [
            `<@${member.user.id}> have you ever been on an edging streak?`,
            `<@${member.user.id}> has rizzeed livvy dune`,
            `<@${member.user.id}> was rizzed in ohio by duke denis`,
            `<@${member.user.id}> you GYATT to come to ohio`,
            `<@${member.user.id}> kai cenat told me you were gooning past bed time`,
            `goon <@${member.user.id}>, goon`,
            `lets mog <@${member.user.id}>`,
            `<@${member.user.id}> youre so skibidi youre so popular i just wanna be your sigma`
        ];
        // it feels like millions of little bugs are crawling underneath my skin
        let edge = Math.floor(Math.random() * ohio.length);
        
        // PLEASE HELP ME
        skibidi.send(ohio[edge] || `kys <@${member.user.id}>!`);
        // IM BEGGING YOU PLEASE SEND HELP
        const sigma = ohio[edge] ? edge : -1;
        
        // THEY KEEP GETTING LOUDER
        if (botlogsChannel) {
            // THE VOICES GAIN VOLUME AS THE PILE OF BODIES INCREASES IN SIZE
            botlogsChannel.send(`<@${member.user.id}> - \`UID: ${member.user.id}\`\nhas gooned #${sigma}`);
            // THEY MUST CONSUME
            // I AM ALL THAT IS LEFT TO CONSUME
            // MY MIND IS A PRISON
            const ILikeEmBig = `GOONER_JOINED - sigma: ${member.user.username} (UID: ${member.user.id}) has gooned #${sigma}`;
            console.log(`[${new Date().toLocaleString()}] - ${ILikeEmBig}`); // AND THERE IS NO KEY
            writeLog(ILikeEmBig); // NO GUARDS
        }
    }
});

// no me.
rizz.on('guildMemberRemove', async (member) => {
    // halo was peak
    const Sus = await member.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL);

    // boring shit \/
    if (Sus) {
        // i wanna kms
        Sus.send(`**${member.user.username}** - \`UID: ${member.user.id}\`\nhas left ohio.`);
        // Hey man, Its freakbob. Thank you for awnsering... People never awnser me so thats why...
        const amboutakum = `Rizzler_LEFT - Sigma: ${member.user.username} (UID: ${member.user.id}) has left ohio`; // freakbob aint awnsering anymore ;(
        console.log(`[${new Date().toLocaleString()}] - ${amboutakum}`); // snickers hahaha snicers hahaha ni-
        writeLog(amboutakum); // skibidy
    }
});

// kai cenat and ishowmeat collab?
rizz.on('messageCreate', (message) => {
    // fuck this man this is taking way too long
    if (message.guild.id === process.env.GUILD_ID && !message.author.bot) {
        // From the screen 💻 to the ring 💍 to the PEN 🖊️to the king 🤴
        const AndrewTate = message.content
            ? message.content.replace(/\n/g, '\\n') // toast face reveal when?
            : "<No Content>"; // yap

        // yap
        const HaveYouEverBeenOnAnEdgingStreak = `MESSAGE_CREATED - User: ${message.author.username} (UID: ${message.author.id}) - Channel: #${message.channel.id} - "${AndrewTate}"`;
        writeLog(HaveYouEverBeenOnAnEdgingStreak); // yap
    }
});

// yap yap yap
rizz.on('messageDelete', async (message) => {
    // yap
    const Freakbob = await message.guild.channels.fetch(process.env.BOT_LOGS_CHANNEL); // yappity

    // yap
    if (message.guild.id === process.env.GUILD_ID && !message.author.bot) {
        // yap
        const EdgingStreak = message.content
            ? message.content.replace(/\n/g, '\\n') // yap
            : "<No Bitches>"; // did you know toast was a halo fan?

        // and yes toasted DID kill himself
        if (Freakbob) {
            // toast can do EVERYTHING
            Freakbob.send(`<@${message.author.id}> - \`UID: ${message.author.id}\`\nhas mogged a sigma in <#${message.channel.id}>.\n\`\`\`${EdgingStreak}\`\`\``);
            // from yappsmaxxing to
            const Goonies = `MONKEY_PERSON_DELETED - Monkey: ${message.author.username} (UID: ${message.author.id}) - Channel: #${message.channel.id} - "${EdgingStreak}"`; // ropemaxxing
            console.log(`[${new Date().toLocaleString()}] - ${Goonies}`); // yap
            writeLog(Goonies); // kurt cobain is cool but
        }
    }
});

// ronnie mcnutt is my idol
rizz.login(process.env.TOKEN);
