import { CodeBlock, Parser } from '../../../src/lib/util/MessageParser';
import { readFileSync } from 'fs';
import path from 'path';

const input = readFileSync(path.join(__dirname, 'input.txt'), {
  encoding: 'utf-8',
});
const parser = new Parser();

describe('Codeblock parser', () => {
  test('parseMessage is defined', () => {
    expect(parser.parseMessage(input)).toBeDefined();
  });
  test('Returns a properly parsed message', () => {
    const blocks = parser.parseMessage(input);
    expect(blocks).toStrictEqual<CodeBlock[]>(messageBlockToExpect);
  });
});

const messageBlockToExpect: CodeBlock[] = [
  {
    content: `const doCompany=async a=>try{const r=(await 
axios.get(baseUrl+companyurl)).data.find(r=>r.name===a);
if(r)return r;{let r={name:a};if(201===(await axios.post
(baseUrl+companyurl,r)).status)return Logger.info("Created new company: " + a
),r}}catch(a){Logger.error(a)}};`,
    order: 0,
    languageKey: 'js',
    type: 'code',
  },
  {
    content: 'if (r) return r;',
    order: 1,
    languageKey: 'js',
    type: 'code',
  },
  {
    content: '<div i="target"></div>',
    order: 2,
    languageKey: 'html',
    type: 'code',
  },
  {
    content: `body {
  background-color: lightblue;
}

h1 {
  color: white;
  text-align: center;
}

p {
  font-family: verdana;
  font-size: 20px;
}`,
    order: 3,
    languageKey: 'css',
    type: 'code',
  },
];
