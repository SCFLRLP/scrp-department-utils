require('dotenv').config({ path: '/home/mason/DEPARTMENTCODEHERE/.env' });

if (!process.env.TOKEN) {
  console.error("TOKEN is not defined in the .env file");
  process.exit(1);
}

console.log(`Bot token: ${process.env.TOKEN}`); // Verify token is loaded

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const version = require("../package.json").version;
const { Logger } = require("term-logger");
const { readdir } = require("fs");

process.title = `SCRP Department Utilities | ${version}`;
console.clear();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  allowedMentions: {
    parse: ["everyone", "roles", "users"],
  },
});

// Use term-logger globally
client.log = Logger;

readdir("./src/events", (err, files) => {
  let eventFiles = files.filter((t) => t.split(".").pop() === "js");

  if (err) {
    return Logger.error(err);
  }

  eventFiles.forEach((file) => {
    let eventName = file.split(".")[0];
    let event = require(`./events/${eventName}`);
    client.on(eventName, event.bind(null, client));

    Logger.event(`Successfully registered event ${eventName}.js`);
  });
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: 'scflrlp.com/dhs' }],
    status: 'online',
  });
});

client.login(process.env.TOKEN);
