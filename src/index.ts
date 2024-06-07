import { speechRecognize } from './handlers/speechRecognize';

require('dotenv').config();
import fs from 'node:fs';
import { SpeechEvents, addSpeechEvent } from 'discord-speech-recognition';
import { Player } from 'discord-music-player';
import { Client, Events, GatewayIntentBits } from 'discord.js';

import { executeCommand } from './handlers/executeCommand';
import { clearUserLimit } from './handlers/clearUserLimit';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

// Инициализация плеера
const player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: false,
  volume: 10,
});

// Подключение распознавания речи
addSpeechEvent(client, { lang: 'ru-RU' });

client.once(Events.ClientReady, () => {
  console.log('Ready!');
});

client.on(Events.InteractionCreate, executeCommand(player));
client.on(Events.ChannelCreate, clearUserLimit);
client.on(Events.Error, error => fs.writeFile('./error.json', JSON.stringify(error), 'utf8', () => {}));
client.on(SpeechEvents.speech, speechRecognize(player));
player.on('error', error => console.error('Ошибка плеера', error));

void client.login(process.env.TOKEN);
