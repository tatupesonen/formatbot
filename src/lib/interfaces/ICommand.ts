import {
  ApplicationCommandData,
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from 'discord.js';
import { Container } from '../container/container';

type ApplicationCommandBase<T extends BaseCommandInteraction> =
  ApplicationCommandData & {
    execute(interaction: T, container: Container): Promise<unknown>;
  };

export type ContextMenuCommand = ApplicationCommandBase<
  ContextMenuInteraction<'cached'>
> &
  (UserApplicationCommandData | MessageApplicationCommandData);

export type SlashCommand = ApplicationCommandBase<
  CommandInteraction<'cached'>
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
