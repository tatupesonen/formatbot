import {
  ApplicationCommandData,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from 'discord.js';
import { Container } from '../container/container';

type ApplicationCommandBase<T extends CommandInteraction> =
  ApplicationCommandData & {
    execute(interaction: T, container: Container): Promise<unknown>;
  };

export type ContextMenuCommand = ApplicationCommandBase<
  ContextMenuCommandInteraction<'cached'>
> &
  (UserApplicationCommandData | MessageApplicationCommandData);

export type SlashCommand = ApplicationCommandBase<
  ChatInputCommandInteraction<'cached'>
> &
  ChatInputApplicationCommandData;

export type LegacyCommand = {
  name: string;
  description: string;
  type: 'LEGACY';
  execute(
    message: Message,
    args: string[],
    container: Container
  ): unknown | Promise<unknown>;
};

export type Command = ContextMenuCommand | SlashCommand | LegacyCommand;
