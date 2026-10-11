import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const path=new URL('lib/client.js',root);
const start='\t\t// BEGIN GENERATED MODEL CONTROLS';
const end='\t\t// END GENERATED MODEL CONTROLS';
const body=['lib/model-controls.js','src/controls-client.js'].map(name=>readFileSync(new URL(name,root),'utf8').replace(/^export /gm,'')).join('\n');
const generated=`${start}\n${body}\n${end}`;
const original=readFileSync(path,'utf8');
const next=original.includes(start)?original.slice(0,original.indexOf(start))+generated+original.slice(original.indexOf(end)+end.length):original.replace('\t\tfunction ModelCard(props)',generated+'\n\t\tfunction ModelCard(props)');
if(process.argv.includes('--check')){if(next!==original)throw new Error('模型控制客户端未构建：node scripts/build-controls-client.mjs');}
else writeFileSync(path,next);
