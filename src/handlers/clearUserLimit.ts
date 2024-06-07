import type { Events } from 'discord.js';

import { ChannelType, type ClientEvents } from 'discord.js';

type TClearUserLimitHandler = (...args: ClientEvents[Events.ChannelCreate]) => void;

export const clearUserLimit: TClearUserLimitHandler = channel => {
  if (channel.type !== ChannelType.GuildVoice) {
    return;
  }

  setTimeout(() => {
    try {
      const isChannelExists = !!channel.guild.channels.cache.find(({ name }) => name === channel.name);
      if (isChannelExists) {
        channel.setUserLimit(0);
      }
    } catch (error) {
      console.error('Ошибка изменения канала', error);
    }
  }, 3000);
};
