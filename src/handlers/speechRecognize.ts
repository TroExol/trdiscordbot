import type { VoiceMessage } from 'discord-speech-recognition';
import type { Player } from 'discord-music-player';

import * as console from 'console';

type TSpeechRecognizeHandler = (player: Player) => (msg: VoiceMessage) => void;

const BOT_NAME = 'тюбик';

export const speechRecognize: TSpeechRecognizeHandler = player => async msg => {
  // If bot didn't recognize speech, content will be empty
  if (!msg.content) {
    return;
  }

  const content = msg.content.toLowerCase();
  const member = msg.member;
  const channel = member?.voice.channel;

  if (!content.includes(BOT_NAME) || !member || !channel) {
    return;
  }

  console.log(content);

  if (content.includes('выключи звук')) {
    await member.voice.setDeaf(true);
  } else if (content.includes('включи звук')) {
    await member.voice.setDeaf(false);
  } else if (content.includes('звук')) {
    await member.voice.setDeaf(!member.voice.deaf);
  } else if (content.includes('включи музыку')) {
    const query = content
      .replace('включи музыку', '')
      .replace(BOT_NAME, '')
      .trim();

    try {
      const guildQueue = player.getQueue(msg.guild.id);

      if (!guildQueue) {
        return;
      }

      guildQueue.skip();
      guildQueue.setVolume(10);
      await guildQueue.play(query);
    } catch (e) {
      return channel.send(`Ошибка при воспроизведении музыки: ${e}`);
    }
  } else if (content.includes('выключи музыку')) {
    const guildQueue = player.getQueue(msg.guild.id);
    if (!guildQueue) {
      return;
    }

    guildQueue.skip();
  } else if (content.includes('мут влада')) {
    const vlad = msg.guild.members.cache.find(m => m.id === '407894304271499264');
    if (!vlad) {
      return;
    }
    await vlad.voice.setMute(!vlad.voice.mute);
  } else if (content.includes('пираты')) {
    try {
      const guildQueue = player.getQueue(msg.guild.id);

      if (!guildQueue) {
        return;
      }

      guildQueue.skip();
      guildQueue.setVolume(20);
      await guildQueue.play('https://www.youtube.com/watch?v=aeBsl8feQao');
    } catch (e) {
      return channel.send(`Ошибка при воспроизведении музыки: ${e}`);
    }
  }
};
