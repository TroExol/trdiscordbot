import { GuildMember } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';

import type { TCommand } from '../types/command';

const command: TCommand = {
  data: new SlashCommandBuilder()
    .setName('join-voice-channel')
    .setDescription('Присоединяет к голосовому каналу'),

  async execute(interaction, client, player) {
    if (!(interaction.member instanceof GuildMember)) {
      return;
    }
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return;
    }

    const queue = player.createQueue(voiceChannel.guild.id);
    await queue.join(voiceChannel);

    await interaction.reply({ content: 'Готово!', ephemeral: true });
  },
};

module.exports = command;
