import { ChannelType, SlashCommandBuilder, VoiceChannel } from 'discord.js';

import type { TCommand } from '../types/command';

import { channelEdit } from '../utils';

const renamedChannels: { [channelId: string]: string } = {};

const command: TCommand = {
  data: new SlashCommandBuilder()
    .setName('rename-channel')
    .setDescription('Переименовывает голосовой канал, пока он не пуст')
    .addChannelOption(option => option.setName('channel')
      .setDescription('Канал для изменения')
      .addChannelTypes(ChannelType.GuildVoice)
      .setRequired(true))
    .addStringOption(option => option.setName('name')
      .setDescription('Новое название канала')
      .setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!(channel instanceof VoiceChannel)) {
      return;
    }

    const oldChannelName = channel.name;
    const name = interaction.options.getString('name');

    if (!name) {
      await interaction.reply({ content: 'Укажите новое название', ephemeral: true });
      return;
    }

    if (!channel.members.size) {
      await interaction.reply({ content: 'Канал не должен быть пуст', ephemeral: true });
      return;
    }

    const leftTime = channelEdit.getLeftTime(channel.id);
    if (channelEdit.count[channel.id] > 0 && leftTime > 0) {
      const minutes = Math.floor((leftTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((leftTime % (1000 * 60)) / 1000);
      await interaction.reply({ content: `Перед возможностью изменения должно пройти ${minutes} мин. ${seconds} сек.`, ephemeral: true });
      return;
    }

    await channel.edit({ name });
    channelEdit.increase(channel.id);

    if (!renamedChannels[channel.id]) {
      renamedChannels[channel.id] = oldChannelName;
    }

    await interaction.reply({ content: 'Готово!', ephemeral: true });
  },
};

module.exports = command;
