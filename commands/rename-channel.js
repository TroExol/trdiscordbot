const { SlashCommandBuilder, ChannelType } = require('discord.js');

const renamedChannels = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename-channel')
		.setDescription('Переименовывает госоловой канал, пока он не пуст')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Канал для изменения')
				.addChannelTypes(ChannelType.GuildVoice)
				.setRequired(true))
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Новое название канала')
				.setRequired(true)),

	async execute(interaction, client) {
		const channel = interaction.options.getChannel('channel');
		const oldChannelName = channel.name;
		const name = interaction.options.getString('name');
		
		if (!channel.members.size) {
			await interaction.reply({ content: 'Канал не должен быть пуст!', ephemeral: true });
			return;
		}
		
		channel.setName(name);
		renamedChannels[channel.id] = oldChannelName;
		await interaction.reply({ content: 'Готово!', ephemeral: true });
	},

	renamedChannels,
};