import type { Player } from 'discord-music-player';
import type {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface TCommand {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute(
      interaction: ChatInputCommandInteraction<CacheType>,
      client: Client<boolean>,
      player: Player,
    ): Promise<void>;
}
