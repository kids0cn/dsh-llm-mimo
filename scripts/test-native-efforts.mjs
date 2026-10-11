import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
import {realpathSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {selectionFor,nativeControls,routeKey,NATIVE_DEFAULT_EFFORT} from '../lib/model-controls.js';
const require=createRequire(realpathSync(process.env.DSH_RUNTIME_BIN));
const pi=await import(pathToFileURL(require.resolve('@deepseek-ai/dsh-llm-pi-ai')));
const ds=await import(pathToFileURL(require.resolve('@deepseek-ai/dsh-llm-deepseek')));
test('baseline native DeepSeek advertisements preserve configured auto effort, including disabled thinking',async()=>{
  for(const [thinking,effort,expected] of [['enabled',undefined,'high'],['enabled','low','low'],['disabled','max','off']]){
    const adapter=new ds.DeepSeekAdapter({options:()=>({models:[{id:'deepseek-v4-flash',name:'DeepSeek'}],defaultContextWindow:100,maxTokens:100,defaults:{thinking,reasoningEffort:effort}})});
    const model=await adapter.resolveModel('deepseek-official','deepseek-v4-flash');
    assert.equal(selectionFor(model,{provider:'mimo',model:'a',reasoningEffort:'mimo:off'}).reasoningEffort,expected);
    const slider=nativeControls(model);
    assert.deepEqual(slider.stops.filter(s=>s.kind!=='auto').map(s=>s.id),model.reasoning.efforts.map(s=>s.id));
    const staged=new Map([[routeKey(model.provider,model.id),NATIVE_DEFAULT_EFFORT]]);
    assert.equal(selectionFor(model,{provider:'mimo',model:'a'},staged).reasoningEffort,expected);
  }
});
test('baseline native pi-ai advertisements: target defaults, supported enums and no effort on non-reasoning models',async()=>{
  let adapter;
  const ctx={fiber:{entry:{options:{id:'llm-pi-ai'}}},get(){return undefined;},inject(){},on(){},logger:{info(){},warn(){},error(){}},llm:{registerAdapter(routes,value){adapter=value;return {replace(){}};},registerConfigurableProviders(){return {replace(){}};},registerModelDiscovery(){}}};
  await pi.apply(ctx,pi.Config({providers:{openai:{reasoning:'medium'}}}));
  const models=await adapter.listModels('openai');
  const model=await adapter.resolveModel('openai',models.find(m=>m.id==='gpt-5')?.id||models.find(m=>m.id.includes('gpt-5')).id);
  assert.equal(model.reasoning.defaultEffort,'medium');
  assert.equal(selectionFor(model,{provider:'mimo',model:'a',reasoningEffort:'mimo:off'}).reasoningEffort,'medium');
  assert.deepEqual(nativeControls(model).stops.filter(s=>s.kind!=='auto').map(s=>s.id),model.reasoning.efforts.map(s=>s.id));
  assert.equal(selectionFor(model,undefined,new Map([[routeKey(model.provider,model.id),NATIVE_DEFAULT_EFFORT]])).reasoningEffort,'medium');
  const plain=await adapter.resolveModel('openai','gpt-4o');assert.equal(plain.reasoning,undefined);
  assert.deepEqual(selectionFor(plain,{provider:'mimo',model:'a',reasoningEffort:'one'}),{provider:'openai',model:'gpt-4o'});
});
