// Import the discord.js module
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

// Define your constants
const MAIN_GUILD_ID = '1212505045653000216'; // The main server ID where users will be checked
const VERIFIED_ROLE_ID = 'YOUR_VERIFIED_ROLE_ID'; // The role ID to be given if verified
const CHECK_ROLE_ID = '1212505045845672024'; // The role ID to check in the main server

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async (member) => {
    try {
        // Fetch the main guild
        const mainGuild = await client.guilds.fetch(MAIN_GUILD_ID);
        const mainMember = await mainGuild.members.fetch(member.id);

        // Check if the user has the required role in the main guild
        if (mainMember.roles.cache.has(CHECK_ROLE_ID)) {
            // Add the verified role in the current guild
            await member.roles.add(VERIFIED_ROLE_ID);
            console.log(`Added verified role to ${member.user.tag}`);
        } else {
            console.log(`${member.user.tag} does not have the verified role in the main guild`);
        }
    } catch (error) {
        console.error('Error fetching member or adding role:', error);
    }
});

// Log in to Discord with your app's token
client.login('YOUR_DISCORD_BOT_TOKEN');
