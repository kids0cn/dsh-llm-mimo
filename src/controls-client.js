// Inlined by scripts/build-controls-client.mjs. No relative browser imports.
const mc = react.createElement;
const CONTROL_CSS = `
/* Portal cards resolve the host's body theme. */
.mm-effort-card,.mm-menu,.mm-hover-card,.mm-slider-tip-card,.mm-type-menu{--mm-card-shadow-color:rgba(0,0,0,.18);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);box-shadow:0 8px 28px var(--mm-card-shadow-color),0 0 0 1px var(--dsw-alias-border-l2)}
body[data-ds-dark-theme] :is(.mm-effort-card,.mm-menu,.mm-hover-card,.mm-slider-tip-card,.mm-type-menu){--mm-card-shadow-color:rgba(0,0,0,.4)}
.llm-mimo-mcard.collapsed:hover:has(.mm-star-zone:hover){padding:5px 4px}
.mm-name-slot{position:relative;min-width:0;height:28px;display:flex;align-items:center}
.mm-name-slot .llm-mimo-nameinput{width:100%;min-width:0;transition:margin-left 160ms ease,width 160ms ease;box-sizing:border-box}
.mm-name-slot.is-default .llm-mimo-nameinput,.mm-name-slot:has(.mm-star-zone:hover) .llm-mimo-nameinput,.mm-name-slot:has(.mm-star:focus-visible) .llm-mimo-nameinput{margin-left:24px;width:calc(100% - 24px)}
.mm-star-zone{position:absolute;left:0;top:0;width:24px;height:28px;z-index:3;display:grid;place-items:center}
/* ★ 与名字文本同高(16px)同法居中; top -2px 把星心对到文本中心(★ 墨迹天生比拉丁文本低 ~2px,
   IAB 文字层不同步 transform, 用相对定位). 位移在内层字形上, 按钮盒子不动 → 旅行框不受影响 */
.mm-star{opacity:0;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#9299a2);width:24px;height:28px;cursor:pointer;font-size:16px;padding:0;display:grid;place-items:center;line-height:normal}
.mm-star-glyph{position:relative;top:-2px}
.mm-star-zone:hover .mm-star,.mm-star:focus-visible,.is-default .mm-star{opacity:1}.is-default .mm-star{color:#c5942d}
.mm-controls{position:relative;grid-column:1/4;display:flex;align-items:center;gap:12px;height:30px;padding-left:5px;margin-top:2px}
.mm-edit-track{height:16px;border-radius:12px;background:var(--dsw-alias-interactive-bg-hover,#dfe2e5);position:relative;flex:1;margin:0 11px}
.mm-travel{position:absolute;top:-3px;width:22px;height:22px;border-radius:50%;background:var(--dsw-alias-interactive-bg-active,#c6ccd3);transform:translateX(-50%);transition:left 130ms ease;pointer-events:none}
.mm-dot{position:absolute;z-index:3;top:-7px;transform:translateX(-50%);width:30px;height:30px;border:0;border-radius:50%;background:transparent;cursor:grab;touch-action:none;padding:0;display:grid;place-items:center}
.mm-dot::after{content:'';width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-label-tertiary,#a2a8b1)}
.mm-dot.special{cursor:default}.mm-dot.dragging::after{background:var(--dsw-alias-button-primary-fill,#477de6)}
.mm-add-stop{padding:0;transition:transform 100ms ease}
.mm-add-stop.deleting{background:var(--llm-mimo-danger-fill);color:var(--llm-mimo-danger-icon)}
.mm-add-stop.deleting:hover,.mm-add-stop.over{background:var(--llm-mimo-danger-fill-hover);color:var(--llm-mimo-danger-icon-hover)}.mm-add-stop.over{transform:scale(1.12)}
.mm-glyph-out{animation:llm-mimo-glyph-out 140ms ease forwards}.mm-glyph-in{animation:llm-mimo-glyph-in 140ms ease}
.mm-drag-surface{position:fixed;width:30px;height:30px;z-index:10022;pointer-events:none;border-radius:50%}
.mm-drag-handle{position:absolute;inset:4px;border-radius:50%;background:var(--dsw-alias-interactive-bg-active,#c6ccd3);display:grid;place-items:center}
.mm-drag-handle::after{content:'';position:relative;z-index:3;width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-button-primary-fill,#477de6)}
.mm-effort-card,.mm-menu,.mm-hover-card{box-sizing:border-box;position:fixed;z-index:10020;border-radius:14px;font-family:inherit;font-size:14px;line-height:1.4}
.mm-effort-card{width:238px;padding:12px;touch-action:none}.mm-effort-card input,.mm-type-trigger,.mm-effort-card summary,.mm-effort-grip{position:relative;z-index:3}.mm-effort-card input{font:inherit;min-width:0;color:inherit;box-sizing:border-box}
.mm-effort-name{border:0;outline:none;background:transparent;width:100%;padding:5px 6px;font-size:14px;border-radius:6px}
.mm-effort-value{border:1px solid var(--dsw-alias-border-l2,#cbd0d7);outline:none;background:transparent;border-radius:7px;width:100%;padding:5px 6px;margin:5px 0 2px;font-size:14px}
.mm-effort-value:focus{border-color:var(--dsw-alias-state-business-primary)}.mm-effort-value.invalid{border-color:var(--dsw-alias-state-error-primary)}.mm-effort-card small{font-size:11px;color:var(--dsw-alias-label-secondary,#9299a2)}
.mm-mapping{margin-top:7px;font-size:12px;interpolate-size:allow-keywords}.mm-mapping summary{cursor:pointer;color:var(--dsw-alias-label-secondary,#7f8792)}.mm-mapping input{width:100%;border:1px solid var(--dsw-alias-border-l2,#cbd0d7);background:transparent;border-radius:6px;padding:4px;margin-top:6px}.mm-mapping::details-content{overflow:hidden;transition:height .26s cubic-bezier(.2,0,0,1),content-visibility .26s allow-discrete}.mm-mapping:not([open])::details-content{height:0;content-visibility:hidden}
.mm-type-trigger{display:flex;align-items:center;gap:6px;box-sizing:border-box;width:100%;margin:6px 0;font:inherit;font-size:13px;color:inherit;background:transparent;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:3px 10px;cursor:pointer;text-align:left}.mm-type-trigger>span:first-child{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mm-type-caret{font-size:10px;color:var(--dsw-alias-label-tertiary)}.mm-type-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}.mm-type-trigger:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}
.mm-type-menu{box-sizing:border-box;position:fixed;z-index:10024;border-radius:12px;padding:6px;font:inherit;font-size:13px;line-height:1.4;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}.mm-type-head{font-size:12px;color:var(--dsw-alias-label-tertiary);padding:2px 10px 4px}.mm-type-option{display:block;box-sizing:border-box;width:100%;border:1px solid transparent;border-radius:8px;background:transparent;font:inherit;color:inherit;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:4px 7px;cursor:pointer;transition:padding .26s cubic-bezier(.2,0,0,1),background .15s ease}.mm-type-option[aria-selected=true]{background:var(--dsw-alias-interactive-bg-hover)}.mm-type-option:hover,.mm-type-option:focus-visible{position:relative;z-index:1;width:max-content;min-width:100%;max-width:var(--mm-type-row-limit);padding:4px 13px;outline:none;background:var(--dsw-alias-bg-module-platform);border-color:var(--dsw-alias-border-l2);box-shadow:0 10px 28px var(--mm-card-shadow-color)}
.mm-effort-grip{height:9px;cursor:grab;user-select:none;margin-bottom:3px;text-align:center;color:var(--dsw-alias-label-tertiary,#9ca4af);font-size:10px;line-height:9px}
.mm-selector{font:inherit;position:relative}.mm-trigger{border:0;background:transparent;border-radius:8px;padding:4px 8px;color:var(--dsw-alias-label-secondary,#89929e);font:inherit;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:6px;max-width:240px;min-height:28px}.mm-trigger>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mm-trigger:hover{background:var(--dsw-alias-interactive-bg-hover,#edf0f4)}
.mm-menu{padding:6px;max-height:min(460px,70vh);overflow:auto;min-width:120px;border-radius:12px;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}.mm-provider{padding:0;border-radius:0;margin:0;position:relative;transition:border-radius .26s cubic-bezier(.2,0,0,1),margin .26s cubic-bezier(.2,0,0,1),padding .26s cubic-bezier(.2,0,0,1),background-color .26s cubic-bezier(.2,0,0,1)}.mm-provider.expanded{padding:4px;margin:8px 0;border-radius:9px;background:var(--dsw-alias-interactive-bg-hover,#f0f1f3)}
.mm-provider-row{display:flex;align-items:center;position:relative;border-radius:7px}.mm-provider-name,.mm-model-row{flex:1;min-width:0;display:block;background:transparent;border:0;cursor:pointer;color:inherit;font:inherit;font-size:12px;text-align:left;height:32px;padding:0 9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:7px}.mm-provider-name{flex:0 0 62%;width:62%;border-radius:0}.mm-provider-arrow{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#85909d);width:26px;height:30px;cursor:pointer}.mm-provider-expand{flex:1;min-width:32px;height:32px;width:auto;display:flex;align-items:center;justify-content:flex-end;padding:0 9px}.mm-provider-expand>span{opacity:0;transition:opacity .15s ease}.mm-provider-row:hover .mm-provider-expand>span,.mm-provider-expand:focus-visible>span,.expanded .mm-provider-expand>span{opacity:1}
.mm-provider-models{display:grid;grid-template-rows:0fr;transition:grid-template-rows .26s cubic-bezier(.2,0,0,1);pointer-events:none}.mm-provider.expanded .mm-provider-models{grid-template-rows:1fr;pointer-events:auto}.mm-provider-models-clip{min-height:0;overflow:hidden}.mm-provider-models .mm-model-row{width:100%}
.mm-model-row:hover{background:var(--dsw-alias-interactive-bg-active,#e4e7eb)}.mm-model-row.selected{color:var(--dsw-alias-state-business-primary)}
.mm-menu-message{font-size:12px;padding:8px;color:var(--dsw-alias-label-secondary,#808894)}.mm-menu-error{font-size:12px;padding:8px;color:var(--dsw-alias-state-error-primary)}
.mm-hover-card{padding:5px 10px;display:flex;gap:12px;align-items:center;min-height:34px;max-width:calc(100vw - 16px);white-space:nowrap;border-radius:12px;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}
.mm-hover-card.closing,.mm-slider-tip-card.closing,.mm-type-menu.closing{pointer-events:none;opacity:0;transform:scaleY(.96);transform-origin:top;transition:opacity .2s ease,transform .2s cubic-bezier(.2,0,0,1)}
@keyframes mm-pop-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.mm-hover-name{border:0;padding:2px 0;background:transparent;font:inherit;font-size:12px;cursor:pointer;color:inherit;white-space:normal;overflow-wrap:anywhere;min-width:var(--mm-hover-name-width,80px);text-align:left}.mm-hover-card.supplier .mm-hover-name{min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mm-slider-wrap{position:relative;width:204px;min-width:80px;height:30px;flex:0 1 204px;display:flex;align-items:center}.mm-slider-rail{position:absolute;left:0;right:0;height:16px;border-radius:12px;background:var(--dsw-alias-interactive-bg-hover,#e3e6eb)}.mm-slider-dots{position:absolute;left:11px;right:11px;height:30px;pointer-events:none}.mm-slider-dots>i{position:absolute;top:13px;width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-label-tertiary,#a3abb6);transform:translateX(-50%)}
.mm-slider-wrap input{appearance:none;position:absolute;left:0;width:100%;height:30px;background:transparent;cursor:pointer;margin:0;z-index:1;touch-action:none}.mm-slider-wrap input::-webkit-slider-thumb{appearance:none;width:22px;height:22px;border-radius:50%;background:transparent;box-shadow:none}.mm-slider-wrap input::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:transparent;box-shadow:none}.mm-slider-wrap input::-moz-range-track{background:transparent;border:0}
.mm-slider-thumb{position:absolute;z-index:2;width:22px;height:22px;top:4px;transform:translateX(-50%);border-radius:50%;background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv1),0 0 0 1px var(--dsw-alias-border-l2);pointer-events:none;transition:left .26s cubic-bezier(.2,0,0,1)}.mm-slider-wrap:has(input:focus-visible) .mm-slider-thumb{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.mm-slider-tip{position:absolute;bottom:38px;transform:translateX(-50%);pointer-events:none;transition:left .26s cubic-bezier(.2,0,0,1)}.mm-slider-tip-card{box-shadow:0 4px 18px var(--mm-card-shadow-color);border:1px solid var(--dsw-alias-border-l2);border-radius:9px;padding:6px 10px;text-align:center;font-size:12px;white-space:nowrap;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}.mm-slider-tip small{display:block;color:var(--dsw-alias-label-secondary,#84909e);font-size:11px}
@media(prefers-reduced-motion:reduce){.mm-travel,.mm-name-slot .llm-mimo-nameinput,.mm-add-stop,.mm-slider-thumb,.mm-slider-tip,.mm-provider,.mm-provider-models,.mm-provider-expand>span,.mm-hover-card.closing,.mm-slider-tip-card.closing,.mm-type-menu.closing,.mm-type-option,.mm-mapping::details-content{transition:none}.mm-glyph-in,.mm-glyph-out,.mm-menu,.mm-hover-card,.mm-slider-tip-card,.mm-type-menu{animation:none}.mm-glyph-out{display:none}}
`;
function controlsPortal(node, anchor) {
  const root = anchor?.getRootNode();
  return react_dom.createPortal(mc(react.Fragment, null, mc('style', null, CONTROL_CSS), node), root && root !== document ? root : document.body);
}
function freshStopId() { return `mimo:level:${crypto.randomUUID()}`; }
function controlsError(rows, format) {
  for (let index = 0; index < rows.length; index++) { const issue = modelControlsIssue(rows[index], format); if (issue) return { ...issue, index, seq: Date.now() }; }
}
// The default belongs to a draft card, even while its API ID is temporarily empty.
function useDefaultDraft(rows, configured, keys) {
  const ref=react.useRef({configured:Symbol('initial'),key:null,manual:false});
  if(ref.current.configured!==configured){const id=defaultModelId(rows,configured);ref.current={configured,key:keys[rows.findIndex(r=>r.id===id)],manual:!!configured&&rows.some(r=>r.id===id)};}
  return {key:ref.current.manual?ref.current.key:keys[0],
    select(index,value){ref.current={configured:value,key:keys[index],manual:true};},
    rename(index,value){if(ref.current.manual&&ref.current.key===keys[index]){ref.current.configured=value;return true;}return false;},
    remove(index){const removed=ref.current.manual&&ref.current.key===keys[index];if(removed)ref.current={configured:'',key:null,manual:false};return removed;},
    reset(){ref.current.configured=Symbol('reset');}
  };
}
function DefaultName({row,isDefault,onDefault,t,onPatch,index,placeholder}) {
  return mc('div',{className:'mm-name-slot'+(isDefault?' is-default':'')},
    mc('div',{className:'mm-star-zone'},mc('button',{type:'button',className:'mm-star','data-travel-spot':true,'aria-label':`${row.name||row.id}：${isDefault?'供应商默认模型':'设为供应商默认模型'}`,'aria-pressed':isDefault,onClick:e=>{e.stopPropagation();onDefault();}},mc('span',{className:'mm-star-glyph'},isDefault?'★':'☆'))),
    mc('input',{className:'llm-mimo-nameinput','aria-label':t('modelName'),title:t('modelName'),placeholder,value:row.name,onChange:e=>onPatch(index,{name:e.target.value})}));
}
function StopActionGlyph({deleting}) {
  const previous=react.useRef(deleting), sequence=react.useRef(0);
  const [departing,setDeparting]=react.useState(null);
  react.useLayoutEffect(()=>{
    if(previous.current===deleting)return;
    setDeparting({deleting:previous.current,sequence:++sequence.current});previous.current=deleting;
    const timer=setTimeout(()=>setDeparting(null),140);
    return()=>clearTimeout(timer);
  },[deleting]);
  const glyph=trash=>trash?mc(_primitives.IconTrashOutlineRegular,{width:14,height:14}):'+';
  return mc('span',{className:'llm-mimo-trash-birth','aria-hidden':true},
    departing&&mc('span',{key:`out:${departing.sequence}`,className:'llm-mimo-trash-glyph mm-glyph-out'},glyph(departing.deleting)),
    mc('span',{key:deleting?'trash':'plus',className:'llm-mimo-trash-glyph'+(departing?' mm-glyph-in':'')},glyph(deleting)));
}
const VALUE_TYPES=[['auto','自动解析数字 / JSON，否则文本'],['string','文本'],['number','数字'],['json','JSON']];
// Match Promptbook's selected-row alignment and independent hover cards, while
// keeping the portaled menu inside the effort editor's dismissal boundary.
function ValueTypePicker({value,onChange,disabled,menuRef,keep,leave}) {
  const [open,setOpen]=react.useState(false),[closing,setClosing]=react.useState(false),[pos,setPos]=react.useState(null);
  const trigger=react.useRef(null),closeTimer=react.useRef(0),focusOnOpen=react.useRef(false);
  const id=react.useId();
  const close=(restoreFocus=false)=>{
    clearTimeout(closeTimer.current);setClosing(true);
    closeTimer.current=setTimeout(()=>{setOpen(false);setClosing(false);},200);
    if(restoreFocus)trigger.current?.focus();
  };
  const show=(focus=false)=>{keep();clearTimeout(closeTimer.current);focusOnOpen.current=focus;setClosing(false);setOpen(true);};
  react.useLayoutEffect(()=>{
    if(!open)return;
    const place=()=>{
      const anchor=trigger.current?.getBoundingClientRect(),menu=menuRef.current;if(!anchor||!menu)return;
      const selected=menu.querySelector('[aria-selected="true"]');
      const width=Math.min(innerWidth-16,anchor.width+12),left=Math.max(8,Math.min(innerWidth-width-8,anchor.left-6));
      setPos({left,width,top:Math.max(8,Math.min(innerHeight-menu.offsetHeight-8,anchor.top-(selected?.offsetTop||22))),'--mm-type-row-limit':`${innerWidth-left-8}px`});
    };
    place();
    if(focusOnOpen.current){menuRef.current?.querySelector('[aria-selected="true"]')?.focus();focusOnOpen.current=false;}
    window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
    const observer=new ResizeObserver(place);if(trigger.current)observer.observe(trigger.current);if(menuRef.current)observer.observe(menuRef.current);
    return()=>{window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);observer.disconnect();};
  },[open,value]);
  react.useEffect(()=>{
    if(!open||closing)return;
    const outside=e=>{if(!trigger.current?.contains(e.target)&&!menuRef.current?.contains(e.target))close();};
    const escape=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close(true);}};
    document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',escape,true);
    return()=>{document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',escape,true);};
  },[open,closing]);
  react.useEffect(()=>{if(disabled){clearTimeout(closeTimer.current);setOpen(false);setClosing(false);}},[disabled]);
  react.useEffect(()=>()=>clearTimeout(closeTimer.current),[]);
  const navigate=e=>{
    if(e.key==='Tab'){close();return;}
    if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
    e.preventDefault();
    const options=Array.from(menuRef.current?.querySelectorAll('[role="option"]')||[]),current=options.indexOf(document.activeElement);
    const next=e.key==='Home'?0:e.key==='End'?options.length-1:(current+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;
    options[next]?.focus();
  };
  return mc(react.Fragment,null,
    mc('button',{ref:trigger,type:'button',className:'mm-type-trigger','data-travel-spot':true,'aria-label':'强度值类型','aria-haspopup':'listbox','aria-expanded':open&&!closing,'aria-controls':open?id:undefined,disabled,
      onClick:()=>open&&!closing?close():show(),onKeyDown:e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();show(true);}}},
      mc('span',null,VALUE_TYPES.find(([type])=>type===value)?.[1]||value),mc('span',{className:'mm-type-caret','aria-hidden':true},'▾')),
    open&&controlsPortal(mc('div',{id,ref:menuRef,className:'mm-type-menu'+(closing?' closing':''),role:'listbox','aria-label':'强度值类型',style:{...pos,visibility:pos?undefined:'hidden'},onPointerEnter:keep,onPointerLeave:leave,onPointerDown:e=>e.stopPropagation(),onClick:e=>e.stopPropagation(),onKeyDown:navigate},
      mc('div',{className:'mm-type-head'},'值类型'),
      ...VALUE_TYPES.map(([type,label])=>mc('button',{key:type,type:'button',className:'mm-type-option',role:'option','aria-selected':type===value,tabIndex:closing?-1:0,onClick:()=>{onChange(type);close(true);}},label))),trigger.current));
}
function EffortEditor({row,index,onPatch,issue,disabled,apiFormat='chat'}) {
  const controls = controlsForFormat(row,apiFormat);
  const validation = controlsIssue(controls);
  const [active,setActive] = react.useState(null);
  const [pos,setPos] = react.useState(null);
  const [drag,setDrag] = react.useState(null);
  const [overTrash,setOverTrash] = react.useState(false);
  const track = react.useRef(null), plus = react.useRef(null), popup = react.useRef(null), valueInput = react.useRef(null), dragPoint = react.useRef(null), typeMenu = react.useRef(null);
  const leaveTimer=react.useRef(0), holdTimer=react.useRef(0), dragging=react.useRef(null), focusNew=react.useRef(false);
  const wasDragging=react.useRef(false);
  const live=react.useRef(null); live.current={controls,row,onPatch,index,apiFormat};
  const patch = next => onPatch(index,controlsPatch(row,apiFormat,next));
  const keep = () => clearTimeout(leaveTimer.current);
  const cancelHold = () => {clearTimeout(holdTimer.current);holdTimer.current=0;};
  const leave = () => {keep();leaveTimer.current=setTimeout(()=>{if(!dragging.current && !popup.current?.contains(document.activeElement)&&!typeMenu.current?.contains(document.activeElement))setActive(null);},240);};
  const open = id => {keep();if(!dragging.current||dragging.current.id===id)setActive(id);};
  const activeStop=controls.stops.find(s=>s.id===active);
  const orderingKey=controls.stops.map(s=>s.id).join('|');
  const place = () => {
    if(dragging.current?.active)return;
    const rect=track.current?.getBoundingClientRect(); if(!rect||!activeStop)return;
    const fraction=controls.stops.findIndex(s=>s.id===active)/(controls.stops.length-1);
    const x=rect.left+rect.width*fraction;
    // 底边锚定:卡体随折叠区展开长高自然向上生长,无需逐帧重锚(top 定位会逐帧
    // 滞后抖动)。拖拽态仍用 top 跟手,React 切换样式对象时会清掉另一侧,无拉伸。
    setPos({left:Math.max(8,Math.min(innerWidth-246,x-119)),bottom:Math.max(8,innerHeight-(rect.top-12))});
  };
  react.useLayoutEffect(()=>{place();},[active,orderingKey,controls.parameter,drag]);
  // Notify the existing shared travel frame after React has moved a point/card.
  // ResizeObserver alone cannot see a change of position at constant size.
  react.useLayoutEffect(()=>{
    const ended=wasDragging.current&&!drag;wasDragging.current=!!drag;
    const target=drag?(overTrash?null:dragPoint.current):ended?Array.from(track.current?.children||[]).find(el=>el.dataset.effortId===active):undefined;
    track.current?.dispatchEvent(new CustomEvent('llm-mimo-travel-layout',{bubbles:true,detail:{target,dragging:!!drag,clear:!!drag&&overTrash||ended&&!target}}));
  },[drag,pos,overTrash,active,controls.stops.length]);
  react.useEffect(()=>{
    if(!active)return;
    const reposition=()=>place(); window.addEventListener('resize',reposition);window.addEventListener('scroll',reposition,true);
    const observer=new ResizeObserver(reposition);if(popup.current)observer.observe(popup.current);
    const outside=e=>{if(!dragging.current&&!popup.current?.contains(e.target)&&!typeMenu.current?.contains(e.target)&&!track.current?.contains(e.target)&&!plus.current?.contains(e.target))setActive(null);};
    const key=e=>{if(e.key==='Escape'&&!typeMenu.current){if(dragging.current){e.preventDefault();cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);}else setActive(null);}};
    document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',key,true);
    return()=>{window.removeEventListener('resize',reposition);window.removeEventListener('scroll',reposition,true);document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',key,true);observer.disconnect();};
  },[active,orderingKey,!!pos]);
  react.useLayoutEffect(()=>{
    const anchor=track.current;
    return()=>anchor?.dispatchEvent(new CustomEvent('llm-mimo-travel-layout',{bubbles:true,detail:{dragging:false,clear:true}}));
  },[]);
  react.useEffect(()=>{if(focusNew.current&&activeStop&&valueInput.current){valueInput.current.focus();focusNew.current=false;}},[active,!!pos,issue?.seq]);
  react.useEffect(()=>{if(issue?.id){focusNew.current=true;open(issue.id);}},[issue?.seq]);
  react.useEffect(()=>()=>{clearTimeout(leaveTimer.current);cancelHold();},[]);
  const activate = d => {
    if(dragging.current!==d||d.active)return;
    cancelHold();keep();d.active=true;
    // A held point may have just opened its card. Start from its actual position
    // so entering drag mode does not jump to the pre-popup fallback rectangle.
    if(popup.current?.dataset.effortId===d.id){const card=popup.current.getBoundingClientRect();d.card={left:card.left,top:card.top};}
    setDrag({id:d.id,stops:d.preview,point:d.point,card:d.card});
  };
  react.useEffect(()=>{
    const move=e=>{
      const d=dragging.current;if(!d||e.pointerId!==d.pointerId)return;
      if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>4)d.moved=true;
      if(!d.active&&!d.moved)return;
      activate(d);
      e.preventDefault();
      const rect=track.current?.getBoundingClientRect(), bin=plus.current?.getBoundingClientRect();if(!rect)return;
      const trash=!!bin&&e.clientX>=bin.left-5&&e.clientX<=bin.right+5&&e.clientY>=bin.top-8&&e.clientY<=bin.bottom+8;
      const dx=e.clientX-d.x,dy=e.clientY-d.y;
      const target=Math.max(2,Math.min(d.stops.length-1,Math.round((d.point.x+dx-rect.left)/rect.width*(d.stops.length-1))));
      const preview=d.stops.filter(s=>s.id!==d.id);preview.splice(target,0,d.stops.find(s=>s.id===d.id));
      d.preview=preview;d.trash=trash;setOverTrash(trash);
      // Only the other points snap to equally spaced slots. The grabbed point
      // and card keep their original grab offset and follow both pointer axes.
      setDrag({id:d.id,stops:preview,point:{x:d.point.x+dx,y:d.point.y+dy},card:{left:d.card.left+dx,top:d.card.top+dy}});
    };
    const end=e=>{const d=dragging.current;if(!d||e.pointerId!==d.pointerId)return;cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);if(e.type==='pointercancel'||!d.moved)return;
      const {controls,row,onPatch,index,apiFormat}=live.current;const stops=d.trash?d.stops.filter(s=>s.id!==d.id):d.preview;
      onPatch(index,controlsPatch(row,apiFormat,{...controls,stops}));if(d.trash)setActive(null);
    };
    const cancel=()=>{cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);};
    window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);window.addEventListener('blur',cancel);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end);window.removeEventListener('blur',cancel);cancelHold();dragging.current=null;};
  },[]);
  react.useEffect(()=>{cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);},[apiFormat,disabled]);
  const start=(e,stop)=>{
    if(disabled||stop.kind!=='level'||e.button!==0||e.target.closest('input,select,summary,details,button:not(.mm-dot)'))return;
    const rect=track.current?.getBoundingClientRect();if(!rect)return;
    const x=rect.left+rect.width*controls.stops.findIndex(s=>s.id===stop.id)/(controls.stops.length-1);
    const card=popup.current?.getBoundingClientRect();
    cancelHold();
    const d=dragging.current={id:stop.id,pointerId:e.pointerId,x:e.clientX,y:e.clientY,point:{x,y:rect.top+rect.height/2},
      card:{left:card?.left??Math.max(8,Math.min(innerWidth-246,x-119)),top:card?.top??Math.max(8,rect.top-140)},
      stops:controls.stops,preview:controls.stops,moved:false,active:false,trash:false};open(stop.id);
    holdTimer.current=setTimeout(()=>activate(d),200);
  };
  const shown=drag?.stops||controls.stops, slot=Math.max(0,shown.findIndex(s=>s.id===active));
  const edit=(fields)=>patch({...controls,stops:controls.stops.map(s=>s.id===active?{...s,...fields}:s)});
  const editor=activeStop&&pos&&mc('div',{ref:popup,className:'mm-effort-card','data-travel-surface':true,'data-effort-id':activeStop.id,style:drag?.card||pos,onPointerEnter:keep,onPointerLeave:leave,onPointerDown:e=>start(e,activeStop),onClick:e=>e.stopPropagation()},
    activeStop.kind==='level'&&mc('div',{className:'mm-effort-grip','data-travel-spot':true,title:'拖动排序；拖到右侧垃圾桶删除'},'⋮⋮'),
    mc('input',{className:'mm-effort-name','data-travel-input':true,'aria-label':'强度显示名',value:activeStop.name||'',placeholder:activeStop.value,onChange:e=>edit({name:e.target.value||undefined}),disabled}),
    mc('input',{ref:valueInput,className:'mm-effort-value'+(validation?.id===active?' invalid':''),'data-travel-input':true,'aria-label':'强度值',required:true,value:activeStop.value,onChange:e=>edit({value:e.target.value}),disabled}),
    activeStop.kind==='omit'?mc('small',null,'不传递思考参数，包括思考开关'):mc('details',{className:'mm-mapping',onToggle:place},
      mc('summary',{'data-travel-spot':true},'请求字段'),
      mc('input',{'data-travel-input':true,'aria-label':'思考参数字段',placeholder:activeStop.kind==='off'?(apiFormat==='responses'?'reasoning.effort':'thinking.type'):apiFormat==='chat'?'如 reasoning_effort 或 thinking_budget':apiFormat==='anthropic'?'如 output_config.effort 或 thinking.budget_tokens':'如 reasoning.effort',value:activeStop.kind==='off'?controls.offParameter:controls.parameter,onChange:e=>patch({...controls,[activeStop.kind==='off'?'offParameter':'parameter']:e.target.value}),disabled}),
      activeStop.kind==='level'&&mc(ValueTypePicker,{key:`${apiFormat}:${activeStop.id}`,value:controls.valueType,onChange:valueType=>patch({...controls,valueType}),disabled:disabled||!!drag,menuRef:typeMenu,keep,leave}),
      mc('small',null,`${API_FORMAT_NAMES[apiFormat]} · 仅按此格式的配置发送。`)),
    validation?.id===active&&mc('small',{style:{color:'#e65a6c'}},validation.message));
  return mc(react.Fragment,null,mc('style',null,CONTROL_CSS),mc('div',{className:'mm-controls','aria-label':'思考强度配置','data-api-format':apiFormat,title:`${API_FORMAT_NAMES[apiFormat]} 思考配置`},
    mc('div',{ref:track,className:'mm-edit-track',onPointerEnter:keep,onPointerLeave:leave},
      active&&!drag&&mc('div',{className:'mm-travel',style:{left:`${100*slot/(shown.length-1)}%`}}),
      ...shown.map((stop,i)=>mc('button',{key:stop.id,type:'button',className:'mm-dot'+(stop.kind!=='level'?' special':'')+(drag?.id===stop.id?' dragging':''),style:{left:`${100*i/(shown.length-1)}%`,visibility:drag?.id===stop.id?'hidden':undefined},'data-travel-spot':true,'data-frame-inset':4,'aria-label':stop.name||stop.value,'data-effort-id':stop.id,disabled,onPointerEnter:()=>open(stop.id),onFocus:()=>open(stop.id),onClick:()=>open(stop.id),onPointerDown:e=>start(e,stop),onKeyDown:e=>{
        if(stop.kind==='level'&&e.altKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();const j=Math.max(2,Math.min(controls.stops.length-1,i+(e.key==='ArrowLeft'?-1:1)));const stops=[...controls.stops];stops.splice(i,1);stops.splice(j,0,stop);patch({...controls,stops});}
        if(stop.kind==='level'&&e.key==='Delete'){e.preventDefault();patch({...controls,stops:controls.stops.filter(s=>s.id!==stop.id)});setActive(null);}
      }}))),
    mc('button',{ref:plus,type:'button',className:'llm-mimo-plusbtn mm-add-stop'+(drag?' deleting':'')+(overTrash?' over':''),'aria-label':drag?'删除思考档位':'添加思考档位',disabled,onClick:()=>{if(drag||dragging.current)return;const stop={id:freshStopId(),kind:'level',value:''};patch({...controls,stops:[...controls.stops,stop]});focusNew.current=true;open(stop.id);}},mc(StopActionGlyph,{deleting:!!drag}))),
    (editor||drag)&&controlsPortal(mc(react.Fragment,null,editor,drag&&mc('div',{ref:dragPoint,className:'mm-drag-surface','data-travel-surface':true,'data-travel-spot':true,'data-frame-inset':4,style:{left:drag.point.x-15,top:drag.point.y-15}},mc('div',{className:'mm-drag-handle'}))),track.current));
}
// Retain a leaving card for the same 200 ms fade used by Promptbook.
function useClosingCard(content) {
  const [retained,setRetained]=react.useState(content);
  react.useLayoutEffect(()=>{
    if(content){setRetained(content);return;}
    const timer=setTimeout(()=>setRetained(null),200);
    return()=>clearTimeout(timer);
  },[content]);
  return {content:content||retained,closing:!content};
}
function effortDescription(stop,controls) {
  return stop.hint||(stop.kind==='off'?'关闭思考':stop.kind==='omit'?'不传递思考参数':!controls.native&&/^\d+$/.test(stop.value)?`${stop.value} token`:stop.value);
}
function ModelEffortSlider({controls,selected,onPreview,onCommit,disabled}) {
  const defaultIndex=Math.max(0,controls.stops.findIndex(s=>s.kind==='omit'||s.kind==='auto'));
  const [value,setValue]=react.useState(()=>{const i=controls.stops.findIndex(s=>s.id===selected);return i<0?defaultIndex:i;});
  const [hovered,setHovered]=react.useState(null), [keyboardTip,setKeyboardTip]=react.useState(false);
  const rail=react.useRef(null), thumb=react.useRef(null), liveValue=react.useRef(value), pointerOrigin=react.useRef(null);
  react.useEffect(()=>{const i=controls.stops.findIndex(s=>s.id===selected);setValue(i<0?defaultIndex:i);liveValue.current=i<0?defaultIndex:i;},[selected,JSON.stringify(controls.stops)]);
  const stop=controls.stops[value]||controls.stops[defaultIndex];
  const count=Math.max(1,controls.stops.length-1);
  const tipIndex=hovered??(keyboardTip?value:null), tipStop=controls.stops[tipIndex];
  const tip=useClosingCard(tipStop?tipStop.id:null), shownTip=controls.stops.find(s=>s.id===tip.content), shownIndex=controls.stops.indexOf(shownTip);
  const position=i=>`calc(11px + (100% - 22px) * ${i/count})`;
  const inspect=e=>{
    const rect=rail.current?.getBoundingClientRect();if(!rect)return;
    const handle=thumb.current?.getBoundingClientRect();
    if(handle&&Math.abs(e.clientX-(handle.left+11))<=12&&Math.abs(e.clientY-(handle.top+11))<=12){setHovered(liveValue.current);return;}
    const spacing=(rect.width-22)/count, i=Math.max(0,Math.min(count,Math.round((e.clientX-rect.left-11)/spacing)));
    const x=rect.left+11+spacing*i;
    // Inspecting another point never stages or commits a selection.
    setHovered(Math.abs(e.clientX-x)<=Math.min(12,spacing/2)&&Math.abs(e.clientY-(rect.top+15))<=12?i:null);
  };
  const commit=()=>{pointerOrigin.current=null;onCommit(controls.stops[liveValue.current].id);};
  return mc('div',{ref:rail,className:'mm-slider-wrap',onPointerEnter:inspect,onPointerMove:inspect,onPointerLeave:()=>setHovered(null)},
    mc('div',{className:'mm-slider-rail'}),mc('div',{className:'mm-slider-dots'},...controls.stops.map((s,i)=>mc('i',{key:s.id,style:{left:`${100*i/Math.max(1,controls.stops.length-1)}%`}}))),
    mc('input',{type:'range',disabled,min:0,max:controls.stops.length-1,step:1,value,'aria-label':'思考强度','aria-valuetext':`${stop.name||stop.value}，${effortDescription(stop,controls)}`,onChange:e=>{const i=+e.target.value;liveValue.current=i;setValue(i);if(pointerOrigin.current)setHovered(i);else{setHovered(null);setKeyboardTip(true);}onPreview(controls.stops[i].id);},onPointerDown:()=>{pointerOrigin.current={selected};setKeyboardTip(false);},onPointerUp:commit,onPointerCancel:()=>{const i=controls.stops.findIndex(s=>s.id===(pointerOrigin.current?.selected??selected));liveValue.current=i<0?defaultIndex:i;pointerOrigin.current=null;setValue(liveValue.current);onPreview(controls.stops[liveValue.current].id);},onKeyUp:e=>{if(['ArrowLeft','ArrowRight','Home','End','ArrowUp','ArrowDown'].includes(e.key))commit();},onFocus:e=>{if(e.currentTarget.matches(':focus-visible'))setKeyboardTip(true);},onBlur:()=>setKeyboardTip(false)}),
    mc('div',{ref:thumb,className:'mm-slider-thumb',style:{left:position(value)},'aria-hidden':true}),
    shownTip&&mc('div',{className:'mm-slider-tip',style:{left:position(shownIndex)}},mc('div',{key:shownTip.id,className:'mm-slider-tip-card'+(tip.closing?' closing':''),role:'tooltip','aria-hidden':tip.closing,'data-effort-id':shownTip.id},shownTip.name||shownTip.value,mc('small',null,effortDescription(shownTip,controls)))));
}
function selectPress(action) { return { onPointerDown: e => { if(e.button===0){e.preventDefault();action();} }, onClick: e => { if(e.detail===0)action(); } }; }
function HostedModelSelect({ctx,sessionId,locked,available,directory,select,refreshControls,controlsStore}) {
  const state=react.useSyncExternalStore(fn=>directory.subscribe(fn),()=>directory.getSnapshot());
  const metadata=react.useSyncExternalStore(fn=>controlsStore.subscribe(fn),()=>controlsStore.getSnapshot());
  const [open,setOpen]=react.useState(false), [expanded,setExpanded]=react.useState(()=>new Set()), [hover,setHover]=react.useState(null), [geometry,setGeometry]=react.useState(null), [hoverGeometry,setHoverGeometry]=react.useState(null), [stagingRevision,setStagingRevision]=react.useState(0), [error,setError]=react.useState(null);
  const {content:shownHover,closing:hoverClosing}=useClosingCard(hover);
  const root=react.useRef(null), menu=react.useRef(null), floating=react.useRef(null), leaveTimer=react.useRef(0), staged=react.useMemo(()=>new Map(),[sessionId]), hoverSource=react.useRef(null), activeSession=react.useRef(sessionId), suppressFocus=react.useRef(false);
  activeSession.current=sessionId;
  // 供应商行的悬浮高亮走设置卡同一台旅行悬浮框机器（行为唯一）。
  const travel=useTravelFrames(menu);
  react.useEffect(()=>{setOpen(false);setHover(null);setExpanded(new Set());setError(null);},[sessionId]);
  // A committed selection, including /model, takes precedence over an older preview.
  react.useEffect(()=>{
    if(!state.current)return;
    const key=routeKey(state.current.provider,state.current.model);
    const model=state.groups.find(g=>g.id===state.current.provider)?.models.find(m=>m.id===state.current.model);
    // A native reset is a UI choice; its committed wire selection is the advertised default.
    if(staged.get(key)===NATIVE_DEFAULT_EFFORT&&state.current.reasoningEffort===model?.reasoning?.defaultEffort)return;
    if(staged.delete(key))setStagingRevision(x=>x+1);
  },[staged,state.current?.provider,state.current?.model,state.current?.reasoningEffort]);
  const controlsRevision=JSON.stringify(metadata.map(m=>[m.provider,m.id,m.apiFormat,m.reasoningControls]));
  react.useEffect(()=>{staged.clear();setHover(null);setStagingRevision(x=>x+1);},[staged,controlsRevision]);
  const hosted=metadata.find(m=>m.provider===state.current?.provider&&m.id===state.current?.model);
  const currentModel=state.groups.flatMap(g=>g.models.map(m=>({...m,provider:g.id}))).find(m=>m.provider===state.current?.provider&&m.id===state.current?.model);
  const busy=state.status==='selecting', disabled=locked||!available||busy;
  const keep=()=>clearTimeout(leaveTimer.current), leave=()=>{keep();leaveTimer.current=setTimeout(()=>setHover(null),180);};
  const place=()=>{
    const trigger=root.current?.getBoundingClientRect(), composer=root.current?.closest('[data-composer-card]')?.getBoundingClientRect();if(!trigger)return;
    const right=Math.min(innerWidth-8,composer?.right??trigger.right), left=Math.max(8,Math.min(trigger.left,right-120));
    setGeometry({left,right:innerWidth-right,bottom:innerHeight-trigger.top+8,maxHeight:Math.max(80,trigger.top-16)});
    const source=hover&&hoverSource.current?.getBoundingClientRect();if(source){const supplier=hover.kind==='provider', text=supplier?(hover.group.name||hover.group.id):(hover.model.name||hover.model.id||'');const textWidth=Math.max(Array.from(text).reduce((n,c)=>n+(c.charCodeAt(0)>255?12:6),16),supplier?hoverSource.current.scrollWidth-18:0);const nameWidth=Math.max(right-left-20,textWidth);
      // The supplier's full-name card grows leftward, leaving the entire
      // right-hand expansion target unobstructed.
      const edge=supplier?source.right:right, width=supplier?Math.max(source.width,textWidth+20):Math.min(innerWidth-16,nameWidth+236);const h=floating.current?.offsetHeight||(supplier?34:40);
      setHoverGeometry({left:Math.max(8,edge-width),width:Math.min(width,edge-8),'--mm-hover-name-width':`${Math.min(nameWidth,Math.max(80,right-244))}px`,top:Math.max(8,Math.min(innerHeight-h-8,hover.current?trigger.top-h-8:source.top-(h-source.height)/2))});}
  };
  const show=(data,el)=>{keep();hoverSource.current=el;setHover(data);};
  react.useLayoutEffect(()=>{place();},[open,hover,expanded,state.groups,stagingRevision]);
  react.useEffect(()=>{
    const reposition=()=>place();window.addEventListener('resize',reposition);window.addEventListener('scroll',reposition,true);
    const observer=new ResizeObserver(reposition);if(root.current?.closest('[data-composer-card]'))observer.observe(root.current.closest('[data-composer-card]'));if(menu.current)observer.observe(menu.current);if(floating.current)observer.observe(floating.current);
    const outside=e=>{if(!root.current?.contains(e.target)&&!menu.current?.contains(e.target)&&!floating.current?.contains(e.target)){setOpen(false);setHover(null);}};
    const key=e=>{if(e.key==='Escape'&&(open||hover)){setOpen(false);setHover(null);suppressFocus.current=true;root.current?.querySelector('button')?.focus();suppressFocus.current=false;}};
    document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',key);
    return()=>{window.removeEventListener('resize',reposition);window.removeEventListener('scroll',reposition,true);observer.disconnect();document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',key);};
  },[open,hover,!!hoverGeometry]);
  react.useEffect(()=>()=>{clearTimeout(leaveTimer.current);},[]);
  react.useEffect(()=>{void refreshControls();},[]);
  const choose=async(model,effort)=>{
    if(disabled)return;
    if(effort!==undefined)staged.set(routeKey(model.provider,model.id),effort);
    const result=await select(selectionFor(model,state.current,staged));
    if(activeSession.current!==sessionId)return;
    if(result?.ok===false)setError(result.error?.message||'选择失败');else{setOpen(false);setHover(null);setError(null);}
  };
  const expand=(id)=>{setHover(null);setExpanded(prev=>{const next=new Set(prev);next.has(id)?next.delete(id):next.add(id);return next;});};
  const selectedEffort=model=>staged.get(routeKey(model.provider,model.id))===NATIVE_DEFAULT_EFFORT?NATIVE_DEFAULT_EFFORT:selectionFor(model,state.current,staged).reasoningEffort;
  const controlsFor=model=>metadata.find(m=>m.provider===model?.provider&&m.id===model?.id)?.reasoningControls||nativeControls(model);
  const remember=(model,effort)=>{staged.set(routeKey(model.provider,model.id),effort);setStagingRevision(x=>x+1);};
  const foreignEntry=react.useSyncExternalStore(fn=>ctx.slots.subscribe('conversation.input.model',fn),()=>ctx.slots.entries('conversation.input.model'));
  const fallback=foreignEntry.find(e=>e.options.key!=='llm-mimo-model-controls');
  if(!hosted&&!currentModel&&!state.groups.length&&fallback){const injected=fallback.inject?.(sessionId)||{};return mc(fallback.component,{...injected,locked,t:ctx.locale.bind(fallback.locale||NS)});}
  const hoverMeta=shownHover?.model&&metadata.find(m=>m.provider===shownHover.model.provider&&m.id===shownHover.model.id);
  const hoverControls=shownHover?.kind==='model'&&controlsFor(shownHover.model);
  const popupKey=shownHover&&`${shownHover.kind}:${routeKey(shownHover.model.provider,shownHover.model.id)}:${shownHover.current?'current':'menu'}`;
  const modelPopup=hoverControls&&hoverGeometry&&mc('div',{key:popupKey,ref:floating,className:'mm-hover-card'+(hoverClosing?' closing':''),style:hoverGeometry,'aria-hidden':hoverClosing,inert:hoverClosing?'':undefined,onPointerEnter:keep,onPointerLeave:leave},
    mc(ModelEffortSlider,{key:routeKey(shownHover.model.provider,shownHover.model.id)+':'+(hoverMeta?.apiFormat||'native'),controls:hoverControls,disabled,selected:selectedEffort(shownHover.model),onPreview:effort=>remember(shownHover.model,effort),onCommit:effort=>{
      if(disabled)return;
      remember(shownHover.model,effort);if(state.current?.provider===shownHover.model.provider&&state.current.model===shownHover.model.id){void select(selectionFor(shownHover.model,state.current,staged)).then(result=>{if(result?.ok===false){staged.delete(routeKey(shownHover.model.provider,shownHover.model.id));setStagingRevision(x=>x+1);setError(result.error?.message||'选择失败');}});}
    }}),mc('button',{type:'button',className:'mm-hover-name',disabled,...selectPress(()=>choose(shownHover.model))},shownHover.model.name||shownHover.model.id));
  const supplierPopup=shownHover?.kind==='provider'&&hoverGeometry&&mc('div',{key:popupKey,ref:floating,className:'mm-hover-card supplier'+(hoverClosing?' closing':''),style:hoverGeometry,'aria-hidden':hoverClosing,inert:hoverClosing?'':undefined,onPointerEnter:keep,onPointerLeave:()=>{leave();travel.onMouseLeave();}},
    mc('button',{type:'button',className:'mm-hover-name',disabled,...selectPress(()=>choose(shownHover.model))},(shownHover.group.name||shownHover.group.id)));
  const groups=state.groups.filter(group=>group.models.length);
  const menuNode=open&&geometry&&mc('div',{ref:menu,className:'mm-menu',style:geometry,'aria-label':'选择模型',onMouseOverCapture:travel.onMouseOverCapture,onMouseDownCapture:travel.onMouseDownCapture,onMouseLeave:()=>{if(shownHover?.kind==='provider')return;travel.onMouseLeave();}},
    ...travel.overlays,
    state.status==='loading'&&mc('div',{className:'mm-menu-message'},'正在加载模型…'),
    ...groups.map(group=>{
      const models=group.models.map(m=>({...m,provider:group.id}));
      const preferred=metadata.find(m=>m.provider===group.id&&m.isDefault)?.id;
      const defaultModel=models.find(m=>m.id===preferred)||models[0]; if(!defaultModel)return null;
      const isExpanded=expanded.has(group.id);
      return mc('div',{className:'mm-provider'+(isExpanded?' expanded':''),key:group.id},
        mc('div',{className:'mm-provider-row','data-travel-spot':true},
          mc('button',{type:'button',className:'mm-provider-name',disabled,onPointerEnter:e=>show({kind:'provider',group,model:defaultModel},e.currentTarget),onPointerLeave:leave,onFocus:e=>{if(e.currentTarget.matches(':focus-visible'))show({kind:'provider',group,model:defaultModel},e.currentTarget);},...selectPress(()=>choose(defaultModel))},(group.name||group.id)||group.id),
          mc('button',{type:'button',className:'mm-provider-arrow mm-provider-expand','aria-label':`${isExpanded?'收起':'展开'} ${(group.name||group.id)||group.id}`,'aria-expanded':isExpanded,onPointerEnter:()=>{keep();setHover(null);},onFocus:()=>{keep();setHover(null);},onClick:()=>expand(group.id)},mc('span',null,isExpanded?'⌃':'⌄'))),
        mc('div',{className:'mm-provider-models','aria-hidden':!isExpanded,inert:!isExpanded?'':undefined},mc('div',{className:'mm-provider-models-clip'},
          models.map(model=>mc('button',{key:model.id,type:'button',className:'mm-model-row'+(state.current?.provider===group.id&&state.current.model===model.id?' selected':''),disabled:disabled||!isExpanded,tabIndex:isExpanded?undefined:-1,onPointerEnter:e=>{if(controlsFor(model))show({kind:'model',model},e.currentTarget);else setHover(null);},onPointerLeave:leave,onFocus:e=>{if(controlsFor(model))show({kind:'model',model},e.currentTarget);},...selectPress(()=>choose(model))},model.name||model.id)))));
    }),
    state.failures?.length>0&&mc('div',{className:'mm-menu-message'},'部分供应商加载失败',mc('button',{type:'button',onClick:()=>{void ctx.modelDirectories.directoryFor(sessionId).load();void refreshControls();}},'重试')),
    (error||state.error)&&mc('div',{className:'mm-menu-error'},error||state.error),
    !state.groups.length&&state.status!=='loading'&&mc('div',{className:'mm-menu-message'},'暂无可用模型'));
  return mc(react.Fragment,null,mc('style',null,CONTROL_CSS),mc('div',{ref:root,className:'mm-selector'},
    mc('button',{type:'button',className:'mm-trigger','aria-label':'选择模型','aria-expanded':open,disabled,onPointerEnter:e=>{if(currentModel&&controlsFor(currentModel)&&!open)show({kind:'model',model:currentModel,current:true},e.currentTarget);},onPointerLeave:leave,onFocus:e=>{if(!suppressFocus.current&&currentModel&&controlsFor(currentModel)&&!open)show({kind:'model',model:currentModel,current:true},e.currentTarget);},onClick:()=>{setHover(null);setOpen(x=>!x);void ctx.modelDirectories.directoryFor(sessionId).load();void refreshControls();}},mc('span',null,currentModel?.name||state.current?.model||'选择模型'),mc('span',null,open?'⌃':'⌄'))),
    menuNode&&controlsPortal(menuNode,root.current),(supplierPopup||modelPopup)&&controlsPortal(supplierPopup||modelPopup,root.current),
    (error||hosted&&state.current?.reasoningEffort&&!currentModel?.reasoning?.efforts?.some(e=>e.id===state.current.reasoningEffort))&&!open&&mc('span',{className:'mm-menu-error',role:'alert'},error||'所选思考档位已删除，请重新选择'));
}
function installModelControls(ctx) {
  ctx.inject(['modelDirectories','sessions','remote.session'],scope=>{
    let models=[],listeners=new Set(),pending=null,disposed=false;
    const controlsStore={getSnapshot:()=>models,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);}};
    const refreshControls=()=>{
      if(pending)return pending;
      pending=(async()=>{try{const result=await scope.remote.settings.describe();const ns=(result?.value?.namespaces||[]).find(n=>n.ns===ENTRY_ID);const next=JSON.parse(ns?.value?.modelControlsViewJson||'[]');if(!disposed&&Array.isArray(next)){models=next;for(const fn of listeners)fn();}}catch{if(!disposed){models=[];for(const fn of listeners)fn();}}finally{pending=null;}})();return pending;
    };
    scope.effect(()=>{void refreshControls();return()=>{disposed=true;listeners.clear();};},'llm-mimo: model controls metadata');
    scope.effect(()=>scope.remote.$on('settings/document-updated',()=>{void refreshControls();}),'llm-mimo: controls settings refresh');
    scope.effect(()=>scope.remote.$on('llm/adapters-updated',()=>{void refreshControls();}),'llm-mimo: controls adapter refresh');
    scope.slots.inject('conversation.input.model',()=>scope.slots.register({name:'conversation.input.model',key:'llm-mimo-model-controls',priority:-10,locale:NS,inject:sessionId=>{
      const directory=scope.modelDirectories.directoryFor(sessionId);
      const available=scope.sessions.subagentAddress(sessionId)===undefined;
      return {ctx:scope,sessionId,available,directory:directory.store,select:selection=>available?directory.select(selection):Promise.resolve(undefined),refreshControls,controlsStore};
    }},HostedModelSelect),'llm-mimo: model selector and native effort controls');
  });
}
