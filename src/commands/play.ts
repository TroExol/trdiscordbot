import { GuildMember, SlashCommandBuilder } from 'discord.js';

import type { TCommand } from '../types/command';

const command: TCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Включает музыку')
    .addStringOption(option => option.setName('name')
      .setDescription('Название песни или ссылка на YouTube')
      .setRequired(true)),

  async execute(interaction, client, player) {
    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
      return;
    }

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply({ content: 'Вы должны быть в голосовом канале', ephemeral: true });
      return;
    }

    const name = interaction.options.getString('name');

    if (!name) {
      await interaction.reply({ content: 'Укажите название или ссылку на YouTube', ephemeral: true });
      return;
    }

    if (!voiceChannel.members.size) {
      await interaction.reply({ content: 'Канал не должен быть пуст', ephemeral: true });
      return;
    }

    const guildQueue = player.getQueue(member.guild.id);

    const queue = player.createQueue(member.guild.id);
    await queue.join(voiceChannel);
    await interaction.reply({ content: 'Ищу', ephemeral: true });
    queue.setVolume(10);
    const song = await queue.play(name).catch(err => {
      console.log('Ошибка воспроизведения музыки:', err);
      if (!guildQueue) {
        queue.stop();
      }
    });

    if (!song) {
      await voiceChannel.send('Не удалось включить музыку');
      return;
    }

    await voiceChannel.send(`Включена музыка: ${song.name}`);
  },
};

module.exports = command;
