// Import the discord.js module
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Define your constants
const MAIN_GUILD_ID = '1212505045653000216'; // The main server ID where users will be checked
const DEPARTMENT_GUILD_ID = 'YOUR_DEPARTMENT_GUILD_ID'; // The department guild ID where roles will be assigned
const VERIFIED_ROLE_ID = 'YOUR_VERIFIED_ROLE_ID'; // The role ID to be given if verified
const CHECK_ROLE_ID = '1212505045845672024'; // The role ID to check in the main server

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Fetch the department guild
    const departmentGuild = client.guilds.cache.get(DEPARTMENT_GUILD_ID);
    if (!departmentGuild) return console.error('Department guild not found');

    // Fetch all members of the department guild
    const members = await departmentGuild.members.fetch();

    // Verify each member in the department guild
    members.forEach(member => {
        verifyMember(member);
    });
});

async function verifyMember(member) {
    try {
        // Fetch the main guild
        const mainGuild = await client.guilds.fetch(MAIN_GUILD_ID);
        const mainMember = await mainGuild.members.fetch(member.id);

        // Check if the user has the required role in the main guild
        if (mainMember.roles.cache.has(CHECK_ROLE_ID)) {
            // Add the verified role in the department guild
            await member.roles.add(VERIFIED_ROLE_ID);
            console.log(`Added verified role to ${member.user.tag}`);
        } else {
            console.log(`${member.user.tag} does not have the required role in the main guild`);
        }
    } catch (error) {
        console.error('Error fetching member or adding role:', error);
    }
}

client.on('guildMemberAdd', async (member) => {
    if (member.guild.id === DEPARTMENT_GUILD_ID) {
        await verifyMember(member);
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id === MAIN_GUILD_ID && oldMember.roles.cache.has(CHECK_ROLE_ID) !== newMember.roles.cache.has(CHECK_ROLE_ID)) {
        // Fetch the corresponding member in the department guild
        const departmentGuildMember = await client.guilds.cache.get(DEPARTMENT_GUILD_ID).members.fetch(newMember.id);
        await verifyMember(departmentGuildMember);
    }
});

// Log in to Discord with your app's token
client.login('YOUR_DISCORD_BOT_TOKEN');
