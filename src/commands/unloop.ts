import { RepeatMode } from 'discord-music-player';
import { GuildMember, SlashCommandBuilder } from 'discord.js';

import type { TCommand } from '../types/command';

const command: TCommand = {
  data: new SlashCommandBuilder()
    .setName('unloop')
    .setDescription('Убирает цикл с песни'),

  async execute(interaction, client, player) {
    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
      return;
    }

    const guildQueue = player.getQueue(member.guild.id);

    if (!guildQueue) {
      await interaction.reply({ content: 'Нет музыки', ephemeral: true });
      return;
    }

    guildQueue.setRepeatMode(RepeatMode.DISABLED);
    await interaction.reply({ content: 'Готово!', ephemeral: true });
  },
};

module.exports = command;
