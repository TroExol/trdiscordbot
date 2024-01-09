require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { renamedChannels } = require('./commands/rename-channel.js');
const {channelEdit, usersRedirected} = require('./utils.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// client.on('voiceStateUpdate', async (oldMember, newMember) => {
//   const oldUserChannelId = oldMember.channelId;
//   const newUserChannelId = newMember.channelId;
//   const userId = newMember.id;
//   const isLoh = newMember.member.roles.cache.find(({id}) => id === '1115254552359354379');
//
//   if (newUserChannelId && isLoh && !usersRedirected[userId]) {
//     let channels = await newMember.guild.channels.fetch();
//     let voiceChannels = channels.filter(ch => ch.type === 2);
//     let randomVoiceChannel = voiceChannels.random();
//     usersRedirected[userId] = true;
//
//     newMember.setChannel(randomVoiceChannel)
//     return;
//   }
//
//   if (usersRedirected[userId]) {
//     delete usersRedirected[userId];
//   }
//
//   if (!oldUserChannelId) {
//     return;
//   }
//
//   const channel = client.channels.cache.get(oldUserChannelId);
//
//   if (renamedChannels[oldUserChannelId] && !channel.members.size) {
//     await channel.edit({ name: renamedChannels[oldUserChannelId] });
// 		channelEdit.increase(oldUserChannelId);
//     delete renamedChannels[oldUserChannelId];
//   }
// });
//
// client.on('messageCreate', function (message) {
//   const lohsReplies = ['ХА! ЛОХ', 'я тебя услышал', 'держи в курсе', 'всем похуй'];
//   const adminReplies = ['Да, Великий!', 'Привет, сексуалка💋', 'Чел, а ты хорош'];
//
//   const isLoh = message.member.roles.cache.find(({id}) => id === '1115254552359354379');
//   const isAdmin = message.member.roles.cache.find(({id}) => id === '910645220197150731');
//   const chance = Math.random();
//
//   if (isLoh && chance < 0.5) {
// 	  message.reply(lohsReplies[Math.floor(Math.random() * lohsReplies.length)]);
//   }
//
//   if (!isLoh && isAdmin && chance < 0.3) {
// 	  message.reply(adminReplies[Math.floor(Math.random() * adminReplies.length)]);
//   }
// });

client.on('channelCreate', (channel) => {
	setTimeout(() => {
		channel.setUserLimit(0);
	}, 1000);
});

client.login(process.env.TOKEN);