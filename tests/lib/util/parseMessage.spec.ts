import { MessageBlock, parseMessage } from '@/lib/util/MessageParser';
import { readFileSync } from 'fs';
import path from 'path';

const input = readFileSync(path.join(__dirname, 'input.txt'), {
  encoding: 'utf-8',
});

describe('Codeblock parser', () => {
  test('parseMessage is defined', () => {
    console.log(input);
    expect(parseMessage).toBeDefined();
  });
  test('Returns a properly parsed message', () => {
    const blocks = parseMessage(input);
    expect(blocks).toStrictEqual<MessageBlock[]>(messageBlockToExpect);
  });
});

const messageBlockToExpect: MessageBlock[] = [
  {
    content:
      "Hey guys! I really need help with my code. I don't know what's wrong with it:",
    order: 0,
    type: 'text',
  },
  {
    content: `const doCompany=async a=>try{const r=(await 
    axios.get(baseUrl+companyurl)).data.find(r=>r.name===a);
    if(r)return r;{let r={name:a};if(201===(await axios.post
    (baseUrl+companyurl,r)).status)return Logger.info("Created new company: " + a
    ),r}}catch(a){Logger.error(a)}};`,
    order: 1,
    languageKey: 'js',
    type: 'code',
  },
  {
    content: 'I also tried this:',
    order: 2,
    type: 'text',
  },
  {
    content: 'if (r) return r;',
    order: 3,
    type: 'code',
  },
  {
    content: "Also my HTML is really messed up, idk what's up with it:",
    order: 4,
    type: 'text',
  },
  {
    content: '<div i="target"></div>',
    order: 5,
    languageKey: 'html',
    type: 'code',
  },
  {
    content: ` body {
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
    order: 6,
    languageKey: 'css',
    type: 'code',
  },
];
