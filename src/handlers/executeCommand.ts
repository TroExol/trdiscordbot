import type { Player } from 'discord-music-player';

import path from 'node:path';
import fs from 'node:fs';
import {
  type ClientEvents, Collection, type Events,
} from 'discord.js';

import type { TCommand } from '../types/command';

type TExecuteCommandHandler = (player: Player) => (...args: ClientEvents[Events.InteractionCreate]) => void;

const commands = new Collection<string, TCommand>();
const commandsPath = path.join(__dirname, '../commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

export const executeCommand: TExecuteCommandHandler = player => async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction, interaction.client, player);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
};
