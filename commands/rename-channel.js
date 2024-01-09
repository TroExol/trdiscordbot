const { SlashCommandBuilder, ChannelType } = require('discord.js');
const {channelEdit} = require('../utils.js');

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
		
		const leftTime = channelEdit.getLeftTime(channel.id);
		if (channelEdit.count[channel.id] > 0 && leftTime > 0) {
			const minutes = Math.floor((leftTime % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((leftTime % (1000 * 60)) / 1000);
			await interaction.reply({content: `Перед возможностью изменения должно пройти ${minutes} мин. ${seconds} сек.`, ephemeral: true});
			return;
		}

		await channel.edit({name});
		channelEdit.increase(channel.id);

		if (!renamedChannels[channel.id]) {
			renamedChannels[channel.id] = oldChannelName;
		}

		await interaction.reply({ content: 'Готово!', ephemeral: true });
	},

	renamedChannels,
};