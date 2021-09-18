import { IFormatter } from './BaseFormatter';
import { PrettierFormatter } from './prettier/PrettierFormatter';
import { CppFormatter } from './prettier/CppFormatter';
import { PythonFormatter } from './prettier/PythonFormatter';
import { RustFormatter } from './prettier/RustFormatter';
import { CSharpFormatter } from './prettier/CSharpFormatter';
import { JavaFormatter } from './prettier/JavaFormatter';

const formatters: Map<string, IFormatter> = new Map([
  ['prettier', new PrettierFormatter({ semi: true, parser: 'babel' })],
  ['prettier_ts', new PrettierFormatter({ semi: true, parser: 'babel-ts' })],
  ['json', new PrettierFormatter({ semi: true, parser: 'json' })],
  ['yaml', new PrettierFormatter({ semi: true, parser: 'yaml' })],
  ['css', new PrettierFormatter({ semi: true, parser: 'css' })],
  ['html', new PrettierFormatter({ semi: true, parser: 'html' })],
  ['python', new PythonFormatter()],
  ['cpp', new CppFormatter()],
  ['c', new CppFormatter()], // Use clang-format for C aswell
  ['rust', new RustFormatter()],
  ['csharp', new CSharpFormatter()],
  ['java', new JavaFormatter()],
]);

export const languageMappings: Record<
  keyof typeof languageNameMappings,
  IFormatter
> = {
  javascript: formatters.get('prettier'),
  jsx: formatters.get('prettier'),
  js: formatters.get('prettier'),
  typescript: formatters.get('prettier_ts'),
  tsx: formatters.get('prettier_ts'),
  ts: formatters.get('prettier_ts'),
  css: formatters.get('css'),
  html: formatters.get('html'),
  python: formatters.get('python'),
  py: formatters.get('python'),
  c: formatters.get('c'),
  cpp: formatters.get('cpp'),
  rust: formatters.get('rust'),
  cs: formatters.get('csharp'),
  csharp: formatters.get('csharp'),
  java: formatters.get('java'),
  yaml: formatters.get('yaml'),
  yml: formatters.get('yaml'),
  json: formatters.get('json'),
  sqf: formatters.get('cpp'),
};

export const languageNameMappings = {
  js: 'JavaScript',
  jsx: 'JavaScript',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  tsx: 'TypeScript',
  ts: 'TypeScript',
  css: 'CSS',
  html: 'HTML',
  python: 'Python',
  py: 'Python',
  cpp: 'C++',
  rust: 'Rust',
  cs: 'C#',
  csharp: 'C#',
  java: 'Java',
  c: 'C',
  yml: 'YAML',
  yaml: 'YAML',
  json: 'JSON',
  sqf: 'SQF',
} as const;
