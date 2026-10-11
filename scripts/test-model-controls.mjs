import assert from 'node:assert/strict';
import test from 'node:test';
import {apply} from '../lib/index.js';
import {controlsOf,controlsIssue,controlsForFormat,controlsPatch,withReasoningFormats,modelControlsIssue,nativeControls,reasoningParameters,selectionFor,defaultModelId,routeKey,OFF_EFFORT,OMIT_EFFORT,NATIVE_DEFAULT_EFFORT,mimoReasoningPresets,API_FORMATS} from '../lib/model-controls.js';
const controls={version:1,parameter:'reasoning_effort',valueType:'string',stops:[{id:'one',kind:'level',value:'low'},{id:'two',kind:'level',value:'high',name:'深入'}]};
function fixture(format='chat'){
  let adapter,api; const events={};
  const config={apiKeyEnv:'TEST_KEY',baseURL:'https://controls-unit.invalid/v1',apiFormat:format,modelsJson:JSON.stringify([{id:'a',name:'A',description:'kept',inputModalities:['text'],reasoningControls:controls},{id:'b',inputModalities:['text']}]),defaultModelId:'b',customProviders:{custom:{baseURL:'https://custom-unit.invalid/v1',modelsJson:JSON.stringify([{id:'a',inputModalities:['text'],reasoningControls:{...controls,parameter:'thinking.budget_tokens',valueType:'number',stops:[{id:'one',kind:'level',value:'4096'}]}}])}},maxTokens:100,thinking:'enabled'};
  const ctx={fiber:{entry:{options:{id:'llm-mimo'}}},provide(name,value){api=value;},on(name,fn){events[name]=fn;},logger:{info(){},error(){}},get(name){return name==='credentials'?{async resolve(){return {value:'unit-test-placeholder'};}}:{};},llm:{registerAdapter(routes,value){adapter=value;return {replace(){}};},registerConfigurableProviders(){return {replace(){}};},registerModelDiscovery(){}}};
  apply(ctx,config);return {config,adapter,api,events};
}
async function wire(adapter,provider,model,effort,prepared){
  let payload,url;
  const fetchBefore=globalThis.fetch;
  globalThis.fetch=async(target,init)=>{url=target;payload=JSON.parse(init.body);const events=String(target).endsWith('/responses')?[{type:'response.completed',response:{status:'completed',output:[{id:'msg-test',type:'message',role:'assistant',content:[{type:'output_text',text:'ok'}]}],usage:{input_tokens:1,output_tokens:1}}}]:String(target).endsWith('/messages')?[{type:'message_start',message:{id:'test',model:'a',usage:{input_tokens:1,output_tokens:0}}},{type:'content_block_start',index:0,content_block:{type:'text',text:'ok'}},{type:'content_block_stop',index:0},{type:'message_delta',delta:{stop_reason:'end_turn'},usage:{output_tokens:1}},{type:'message_stop'}]:[{choices:[{delta:{content:'ok'},finish_reason:'stop'}]}];return new Response(events.map(e=>'data: '+JSON.stringify(e)+'\n\n').join('')+(String(target).endsWith('/messages')?'':'data: [DONE]\n\n'),{headers:{'content-type':'text/event-stream'}});};
  try{const options={provider,model,messages:[{role:'user',content:[{type:'text',text:'ok'}]}],...(effort===undefined?{}:{reasoningEffort:effort}),signal:new AbortController().signal};for await(const _chunk of (prepared?prepared.stream(options):adapter.stream(options))){};}finally{globalThis.fetch=fetchBefore;}
  return {payload,url};
}
test('off/omit remain first two and all control IDs survive edits/reordering',()=>{
  const initial=controlsOf(controls);assert.deepEqual(initial.stops.map(s=>s.id),[OFF_EFFORT,OMIT_EFFORT,'one','two']);
  const reordered=controlsOf({...initial,stops:[initial.stops[3],initial.stops[1],initial.stops[2],initial.stops[0]]});assert.deepEqual(reordered.stops.map(s=>s.id),[OFF_EFFORT,OMIT_EFFORT,'two','one']);
  assert.equal(controlsIssue({...controls,stops:[{id:'one',kind:'level',value:''}]}).id,'one');
  assert.equal(controlsIssue({...controls,stops:[{id:'one',kind:'level',value:'low'},{id:'one',kind:'level',value:'high'}]}).message,'思考档位 ID 为空或重复');
});
test('omission bypasses mapping, off is editable, typed paths cannot overwrite contracts/pollute prototypes',()=>{
  assert.deepEqual(reasoningParameters(undefined,undefined),{});assert.deepEqual(reasoningParameters(controls,OMIT_EFFORT),{});
  assert.deepEqual(reasoningParameters({...controls,offParameter:'thinking',stops:[{kind:'off',value:'false'}]},OFF_EFFORT),{thinking:false});
  assert.deepEqual(reasoningParameters({...controls,parameter:'thinking.budget_tokens',valueType:'number',stops:[{id:'one',kind:'level',value:'4096'}]},'one'),{thinking:{budget_tokens:4096}});
  for(const parameter of ['__proto__.polluted','thinking.constructor.x','max_tokens','max_output_tokens','tools','messages','input','input.text']){
    assert.throws(()=>reasoningParameters({...controls,parameter},'one'));
    assert.throws(()=>reasoningParameters({...controls,offParameter:parameter},OFF_EFFORT));
  }
  assert.throws(()=>reasoningParameters(controls,'deleted'),/已删除/);
});
test('default references follow configuration or first catalog model',()=>{
  const models=[{id:'a'},{id:'b'}];assert.equal(defaultModelId(models,'b'),'b');assert.equal(defaultModelId(models,'deleted'),'a');assert.equal(defaultModelId([],undefined),undefined);
  assert.equal(defaultModelId([{id:' a '},{id:' b '}],'b'),' b ');
});
test('model switch uses target native effort/default or no effort; staged selection is route exact',()=>{
  const previous={provider:'mimo',model:'a',reasoningEffort:'one'};
  const deepseek={provider:'deepseek',id:'deepseek-v4',reasoning:{efforts:['off','low','high','max'].map(id=>({id})),defaultEffort:'high'}};
  const pi={provider:'pi-openai',id:'gpt-reasoning',reasoning:{efforts:['minimal','low','medium','high'].map(id=>({id})),defaultEffort:'medium'}};
  assert.equal(selectionFor(deepseek,previous).reasoningEffort,'high');assert.equal(selectionFor(pi,previous).reasoningEffort,'medium');
  assert.deepEqual(selectionFor({provider:'pi-ai',id:'plain'},previous),{provider:'pi-ai',model:'plain'});
  assert.equal(selectionFor(deepseek,{provider:'deepseek',model:deepseek.id,reasoningEffort:'max'}).reasoningEffort,'max');
  assert.equal(selectionFor(deepseek,{provider:'deepseek',model:deepseek.id,reasoningEffort:'deleted'}).reasoningEffort,'high');
  const staged=new Map([[routeKey('custom','a'),'one']]);assert.equal(selectionFor({...pi,id:'a'},previous,staged).reasoningEffort,'medium');
  assert.deepEqual(previous,{provider:'mimo',model:'a',reasoningEffort:'one'});
});
test('hosted metadata/default/refresh contain no secrets and reflect capability snapshots',async()=>{
  const {config,adapter,api,events}=fixture();const list=api.listHostedModels();assert.equal(list.find(m=>m.provider==='mimo'&&m.id==='b').isDefault,true);
  assert.equal(list.find(m=>m.provider==='mimo'&&m.id==='a').description,'kept');assert.equal(JSON.stringify(list).includes('TEST_KEY'),false);
  assert.deepEqual((await adapter.resolveModel('mimo','a')).reasoning.defaultEffort,OMIT_EFFORT);
  config.defaultModelId='a';events['loader/volatile-update']();assert.equal(JSON.parse(config.modelControlsViewJson).find(m=>m.provider==='mimo'&&m.id==='a').isDefault,true);
});
test('Chat wire: default omits every thinking field, off/levels use exact types, no cross-route residue',async()=>{
  const {adapter}=fixture();
  for(const effort of [undefined,OMIT_EFFORT]){const {payload}=await wire(adapter,'mimo','a',effort);assert.equal('thinking' in payload,false);assert.equal('reasoning_effort' in payload,false);}
  assert.deepEqual((await wire(adapter,'mimo','a',OFF_EFFORT)).payload.thinking,{type:'disabled'});
  assert.equal((await wire(adapter,'mimo','a','one')).payload.reasoning_effort,'low');assert.equal((await wire(adapter,'mimo','a','two')).payload.reasoning_effort,'high');
  const custom=await wire(adapter,'custom','a','one');assert.equal(custom.url,'https://custom-unit.invalid/v1/chat/completions');assert.deepEqual(custom.payload.thinking,{budget_tokens:4096});assert.equal('reasoning_effort' in custom.payload,false);
  assert.equal('thinking' in (await wire(adapter,'custom','a',OMIT_EFFORT)).payload,false);
  await assert.rejects(wire(adapter,'mimo','a','deleted'),error=>error.code==='INVALID_REQUEST'&&/已删除/.test(error.message));
});
test('Anthropic default also omits thinking; off and user fields remain explicit',async()=>{
  const {adapter}=fixture('anthropic');
  const result=await wire(adapter,'mimo','a',OMIT_EFFORT);assert.equal('thinking' in result.payload,false);assert.equal(result.url,'https://controls-unit.invalid/v1/messages');
  assert.deepEqual((await wire(adapter,'mimo','a',OFF_EFFORT)).payload.thinking,{type:'disabled'});
});
test('prepareCall keeps model metadata and outgoing mapping on one connection snapshot',async()=>{
  const {config,adapter}=fixture();
  const prepared=await adapter.prepareCall('mimo','a');
  config.modelsJson=JSON.stringify([{id:'a',inputModalities:['text'],reasoningControls:{...controls,parameter:'thinking.type',stops:[{id:'one',kind:'level',value:'enabled'}]}}]);
  assert.equal((await wire(adapter,'mimo','a','one',prepared)).payload.reasoning_effort,'low');
  assert.deepEqual((await wire(adapter,'mimo','a','one')).payload.thinking,{type:'enabled'});
});
test('legacy controls migrate only to their original format; format edits preserve every other bucket',()=>{
  const legacy={id:'a',description:'keep',reasoningControls:controls};
  const migrated=withReasoningFormats(legacy,'chat');
  assert.equal(migrated.reasoningControls,undefined);assert.equal(migrated.description,'keep');
  assert.equal(controlsForFormat(migrated,'chat').parameter,'reasoning_effort');
  assert.equal(controlsForFormat(migrated,'anthropic').stops.length,2);
  const responses=controlsForFormat(migrated,'responses');
  assert.equal(responses.offParameter,'reasoning.effort');assert.equal(responses.stops[0].value,'none');
  const edited={...migrated,...controlsPatch(migrated,'anthropic',{...controls,parameter:'output_config.effort'})};
  assert.equal(controlsForFormat(edited,'chat').parameter,'reasoning_effort');
  assert.equal(controlsForFormat(edited,'anthropic').parameter,'output_config.effort');
  assert.equal(controlsForFormat(edited,'responses').stops.length,2);
  const invalid={...edited,...controlsPatch(edited,'responses',{...responses,stops:[...responses.stops,{id:'blank',kind:'level',value:''}]})};
  assert.deepEqual(modelControlsIssue(invalid,'chat'),{id:'blank',message:'强度值不能为空',format:'responses'});
  const duplicate={...migrated,...controlsPatch(migrated,'anthropic',{...controls,stops:[{id:'same',kind:'level',value:'low'},{id:'same',kind:'level',value:'high'}]})};
  assert.deepEqual(modelControlsIssue(duplicate,'chat'),{message:'思考档位 ID 为空或重复',format:'anthropic'});
  assert.deepEqual(legacy.reasoningControls,controls);
});
test('API format switches project independent capabilities and requests; prepared calls retain the old format',async()=>{
  const {config,adapter,api,events}=fixture();
  const model={id:'a',inputModalities:['text'],reasoningControlsByFormat:{
    chat:controls,
    anthropic:{parameter:'output_config.effort',valueType:'string',stops:[{id:'anthro-high',kind:'level',value:'high'}]},
    responses:{parameter:'reasoning.effort',valueType:'string',offParameter:'reasoning.effort',stops:[{kind:'off',value:'none'},{id:'response-low',kind:'level',value:'low'}]},
  }};
  config.modelsJson=JSON.stringify([model]);
  const prepared=await adapter.prepareCall('mimo','a');
  config.apiFormat='anthropic';events['loader/volatile-update']();
  assert.deepEqual((await adapter.resolveModel('mimo','a')).reasoning.efforts.map(s=>s.id),[OFF_EFFORT,OMIT_EFFORT,'anthro-high']);
  assert.equal(api.listHostedModels().find(m=>m.provider==='mimo').apiFormat,'anthropic');
  const anthro=(await wire(adapter,'mimo','a','anthro-high')).payload;
  assert.deepEqual(anthro.output_config,{effort:'high'});assert.equal('reasoning_effort' in anthro,false);
  assert.equal((await wire(adapter,'mimo','a','one',prepared)).payload.reasoning_effort,'low');
  await assert.rejects(wire(adapter,'mimo','a','one'),e=>e.code==='INVALID_REQUEST');
  assert.equal('thinking' in (await wire(adapter,'mimo','a',OMIT_EFFORT)).payload,false);
  config.apiFormat='responses';events['loader/volatile-update']();
  const meta=api.listHostedModels().find(m=>m.provider==='mimo');
  assert.deepEqual(meta.reasoning.efforts.map(s=>s.id),[OFF_EFFORT,OMIT_EFFORT,'response-low']);
  assert.deepEqual(reasoningParameters(meta.reasoningControls,OFF_EFFORT),{reasoning:{effort:'none'}});
  // Each custom route owns its format too, independent of the main route's selection.
  assert.deepEqual((await wire(adapter,'custom','a','one')).payload.thinking,{budget_tokens:4096});
  config.customProviders.custom={...config.customProviders.custom,apiFormat:'anthropic',modelsJson:JSON.stringify([model])};
  assert.deepEqual((await wire(adapter,'custom','a','anthro-high')).payload.output_config,{effort:'high'});
  assert.equal(api.listHostedModels().find(m=>m.provider==='custom').apiFormat,'anthropic');
  assert.equal(api.listHostedModels().find(m=>m.provider==='mimo').apiFormat,'responses');
  const responsesWire=await wire(adapter,'mimo','a','response-low');
  assert.equal(responsesWire.url,'https://controls-unit.invalid/v1/responses');
  assert.deepEqual(responsesWire.payload.reasoning,{effort:'low'});
  assert.equal('thinking' in responsesWire.payload,false);assert.equal('reasoning_effort' in responsesWire.payload,false);
  assert.equal('reasoning' in (await wire(adapter,'mimo','a',OMIT_EFFORT)).payload,false);
  assert.deepEqual((await wire(adapter,'mimo','a',OFF_EFFORT)).payload.reasoning,{effort:'none'});
  config.apiFormat='chat';assert.equal((await wire(adapter,'mimo','a','two')).payload.reasoning_effort,'high');
});
test('native slider offers only advertised IDs and maps its reset to the adapter default',()=>{
  const model={provider:'native',id:'reasoning',reasoning:{efforts:[{id:'low',name:'Low'},{id:'high',name:'High'}],defaultEffort:'high'}};
  const slider=nativeControls(model);assert.equal(slider.native,true);
  assert.deepEqual(slider.stops.map(s=>s.id),[NATIVE_DEFAULT_EFFORT,'low','high']);
  assert.equal(slider.stops.some(s=>s.kind==='off'),false);
  const staged=new Map([[routeKey(model.provider,model.id),NATIVE_DEFAULT_EFFORT]]);
  assert.equal(selectionFor(model,{provider:'native',model:'reasoning',reasoningEffort:'low'},staged).reasoningEffort,'high');
  assert.equal(nativeControls({id:'plain'}),undefined);
  assert.deepEqual(selectionFor({...model,reasoning:{efforts:[{id:'high'}]}},undefined,staged),{provider:'native',model:'reasoning'});
});

test('stock MiMo presets use documented format fields, stable IDs and omission defaults for all three models',async()=>{
  const {config,adapter,api}=fixture();
  // Catalog fallback and first-install schema use the same stock catalog.
  config.modelsJson='{}';
  const ids=['mimo-v2.6-flash','mimo-v2.6-pro','mimo-v2.6-pro-ultraspeed'];
  const presetIds=new Set();
  for(const id of ids){
    const preset=mimoReasoningPresets(id);
    assert.deepEqual(mimoReasoningPresets(id),preset);
    for(const format of API_FORMATS){
      config.apiFormat=format;
      const meta=api.listHostedModels().find(m=>m.provider==='mimo'&&m.id===id);
      assert.deepEqual(meta.reasoningControls,preset[format]);
      assert.equal(meta.reasoning.defaultEffort,OMIT_EFFORT);
      const levels=meta.reasoningControls.stops.slice(2),on=levels.at(-1);
      assert.deepEqual(meta.reasoningControls.stops.map(s=>s.kind),format==='responses'?['off','omit','level','level']:['off','omit','level']);
      for(const level of levels){
        assert.match(level.id,/^mimo:level:[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/);
        assert.equal(presetIds.has(level.id),false);presetIds.add(level.id);
      }
      assert.equal(controlsIssue(meta.reasoningControls,format),undefined);
      assert.deepEqual(reasoningParameters(meta.reasoningControls,undefined),{});
      assert.deepEqual(reasoningParameters(meta.reasoningControls,OMIT_EFFORT),{});
      if(format==='responses'){
        assert.deepEqual(levels.map(s=>s.value),['low','high']);
        assert.equal(levels.some(s=>s.name),false);
        assert.deepEqual(reasoningParameters(meta.reasoningControls,OFF_EFFORT),{reasoning:{effort:'none'}});
        assert.deepEqual(reasoningParameters(meta.reasoningControls,levels[0].id),{reasoning:{effort:'low'}});
        assert.deepEqual(reasoningParameters(meta.reasoningControls,on.id),{reasoning:{effort:'high'}});
        for(const [effort,value] of [[undefined,undefined],[OMIT_EFFORT,undefined],[OFF_EFFORT,'none'],...levels.map(s=>[s.id,s.value])]){
          const {payload,url}=await wire(adapter,'mimo',id,effort);
          assert.equal(payload.model,id);assert.equal(url,'https://controls-unit.invalid/v1/responses');
          if(value===undefined)assert.equal('reasoning' in payload,false);
          else assert.deepEqual(payload.reasoning,{effort:value});
          for(const root of ['thinking','reasoning_effort','output_config'])assert.equal(root in payload,false);
        }
      }else{
        for(const [effort,value] of [[undefined,undefined],[OMIT_EFFORT,undefined],[OFF_EFFORT,'disabled'],[on.id,'enabled']]){
          const {payload}=await wire(adapter,'mimo',id,effort);
          assert.equal(payload.model,id);
          if(value===undefined)assert.equal('thinking' in payload,false);
          else assert.deepEqual(payload.thinking,{type:value});
          for(const root of ['reasoning','reasoning_effort','output_config'])assert.equal(root in payload,false);
        }
      }
    }
  }
  assert.equal(presetIds.size,12);
  assert.equal(mimoReasoningPresets('unlisted-model'),undefined);
  assert.equal(mimoReasoningPresets('toString'),undefined);
});

test('saved MiMo edits/deletions and custom endpoint catalogs are not replaced by stock presets',async()=>{
  const {config,adapter,api}=fixture();
  const id='mimo-v2.6-flash';
  config.modelsJson=JSON.stringify([{id,inputModalities:['text'],reasoningControlsByFormat:{chat:{parameter:'thinking.budget_tokens',valueType:'number',stops:[{id:'my-budget',kind:'level',value:'2048'}]},anthropic:controlsOf(undefined,'anthropic')}}]);
  assert.deepEqual((await wire(adapter,'mimo',id,'my-budget')).payload.thinking,{budget_tokens:2048});
  config.apiFormat='anthropic';
  assert.equal(api.listHostedModels().find(m=>m.provider==='mimo').reasoningControls.stops.length,2);
  config.apiFormat='responses';
  assert.equal(api.listHostedModels().find(m=>m.provider==='mimo').reasoningControls.stops.length,2);
  config.modelsJson=JSON.stringify([{id,inputModalities:['text']}]);
  assert.equal(api.listHostedModels().find(m=>m.provider==='mimo').reasoningControls.stops.length,2);
  config.customProviders.custom.modelsJson=JSON.stringify([{id,inputModalities:['text']}]);
  assert.equal(api.listHostedModels().find(m=>m.provider==='custom').reasoningControls.stops.length,2);
});
