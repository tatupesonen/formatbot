import { IFormatter } from './BaseFormatter';
import { PrettierFormatter } from './prettier/PrettierFormatter';

const formatters: Map<string, IFormatter> = new Map([
  ['prettier', new PrettierFormatter({ semi: true, parser: 'babel' })],
  ['prettier_ts', new PrettierFormatter({ semi: true, parser: 'babel-ts' })],
  ['css', new PrettierFormatter({ semi: true, parser: 'css' })],
  ['html', new PrettierFormatter({ semi: true, parser: 'html' })],
]);

export const languageMappings: Record<string, IFormatter> = {
  javascript: formatters.get('prettier'),
  jsx: formatters.get('prettier'),
  js: formatters.get('prettier'),
  typescript: formatters.get('prettier_ts'),
  tsx: formatters.get('prettier_ts'),
  ts: formatters.get('prettier_ts'),
  css: formatters.get('css'),
  html: formatters.get('html'),
};

export const languageNameMappings: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'JavaScript',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  tsx: 'TypeScript',
  ts: 'TypeScript',
  css: 'CSS',
  html: 'HTML',
};
