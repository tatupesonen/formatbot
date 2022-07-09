import { Client } from 'discord.js';
import prometheus from 'prom-client';
import { DITypes, Container } from '../container/container';
import { languageNameMappings } from '../formatters/FormatterMappings';

const customPromNames = {
  'C++': 'cpp',
  'C#': 'csharp',
} as const;

export const formats = new prometheus.Counter({
  name: 'formatbot_formats',
  help: 'Counter of formats for FormatBot',
  labelNames: ['language'] as const,
});

// Yeah I know this is dirty, I should stop using the container altogether. Makes life hard.
export const metrics = {};

export const getMetricLangList = () => {
  return [...new Set(Object.values(languageNameMappings))].map((e) => {
    return customPromNames[e] ? customPromNames[e] : e.toLowerCase();
  });
};

export const zeroLanguageMetrics = () => {
  // get all languages
  const langs = getMetricLangList();
  langs.forEach((lang) => {
    formats.inc({ language: lang }, 0);
  });
};
export const createCallbackMetrics = (container: Container) => {
  const client = container.getByKey<Client>(DITypes.client);
  const guildCountGauge = new prometheus.Gauge({
    name: 'formatbot_guild_count',
    help: 'Count of the current amount of guilds that FormatBot is in',
    collect() {
      const count = client.guilds.cache.size;
      this.set(count);
    },
  });
  metrics['guildCount'] = guildCountGauge;
};

export const getMetricFromKey = (
  language: keyof typeof languageNameMappings
): string => {
  // Get the formatter name from the language
  const lang = languageNameMappings[language];
  const checked = customPromNames[lang]
    ? customPromNames[lang]
    : lang.toLowerCase();
  return checked;
};
