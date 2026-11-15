(() => {
 'use strict';
 const button=document.querySelector('#sound-toggle');
 const key='nextstream-audio-v1';
 const settings={musicEnabled:true,effectsEnabled:true,music:45,effects:65};
 try{
  const saved=JSON.parse(localStorage.getItem(key));
  for(const id of ['music','effects']){
   if(typeof saved?.[id+'Enabled']==='boolean')settings[id+'Enabled']=saved[id+'Enabled'];
   if(Number.isFinite(saved?.[id]))settings[id]=Math.max(0,Math.min(100,saved[id]));
  }
 }catch{}
 let ctx,musicBus,effectsBus,timer,step=0,endingIndex=-1;
 const musicVoices=new Set();
 const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66];
 // Original ending motifs in illustration order. Values are MIDI pitches.
 const scores=[
  [48,60,63,67,65,60],[45,64,60,57,59,57],[50,62,65,69,67,65],
  [47,66,62,59,62,54],[48,60,64,67,72,76],[45,69,64,60,62,57],
  [50,65,62,57,60,62],[43,59,62,67,62,59],[53,60,65,69,67,72],
  [48,64,67,72,76,79],[50,69,74,77,76,74],[43,62,67,71,69,74],
  [46,58,65,62,60,58],[48,72,67,76,74,79],[45,60,64,71,69,64],
  [52,64,67,71,74,71],[53,65,69,72,69,65],[48,60,67,74,72,67],
  [45,57,61,64,69,71],[43,55,59,62,67,62],[53,69,72,77,76,72],
  [48,67,64,72,74,76],[45,57,64,60,59,64],[50,62,66,69,71,66],
  [46,65,70,74,77,74],[48,67,72,76,79,84],[53,65,72,69,74,77]
 ];
 const hz=midi=>440*2**((midi-69)/12);
 function stopMusic(){
  if(timer)clearInterval(timer);
  timer=null;
  for(const voice of musicVoices)voice.stop();
 }
 const game=document.querySelector('#app');
 new MutationObserver(()=>{
  const value=game.querySelector('[data-ending-score]')?.dataset.endingScore;
  const next=value===undefined?-1:Number(value);
  if(next===endingIndex)return;
  endingIndex=next;
  step=0;
  stopMusic();
  sync();
 }).observe(game,{childList:true,subtree:true});
 function tone(bus,freq,at,duration,volume,type='sine'){
  const oscillator=ctx.createOscillator(), envelope=ctx.createGain();
  oscillator.type=type;oscillator.frequency.value=freq;
  envelope.gain.setValueAtTime(0,at);
  envelope.gain.linearRampToValueAtTime(volume,at+.08);
  envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);
  oscillator.connect(envelope);envelope.connect(bus);
  oscillator.start(at);oscillator.stop(at+duration+.1);
  if(bus===musicBus)musicVoices.add(oscillator);
  oscillator.onended=()=>{musicVoices.delete(oscillator);oscillator.disconnect();envelope.disconnect();};
 }
 function music(){
  if(ctx?.state!=='running'||document.hidden||!settings.musicEnabled||!settings.music)return;
  const at=ctx.currentTime,score=scores[endingIndex];
  if(score){
   const [bass,...phrase]=score;
   const beat=endingIndex<6?.68:endingIndex>=20?.55:.46;
   const phase=step++%4;
   tone(musicBus,hz(bass-(phase===2?5:0)),at,3.9,.011);
   phrase.forEach((note,i)=>tone(musicBus,hz(note-(phase===3?12:0)),at+i*beat,1.3,.014,endingIndex>=20?'triangle':'sine'));
   return;
  }
  const note=notes[step++%notes.length];
  tone(musicBus,note,at,3,.018);tone(musicBus,note/2,at,4,.009);tone(musicBus,note*1.5,at+1.3,2,.006);
 }
 function sync(){
  if(!ctx)return;
  musicBus.gain.value=settings.musicEnabled?settings.music/100:0;
  effectsBus.gain.value=settings.effectsEnabled?settings.effects/100:0;
  const active=ctx.state==='running'&&!document.hidden&&settings.musicEnabled&&settings.music>0;
  if(active&&!timer){music();timer=setInterval(music,4500);}
  if(!active&&timer)stopMusic();
 }
 async function unlock(){
  if(document.hidden||(!settings.musicEnabled&&!settings.effectsEnabled))return;
  try{
   if(!ctx){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return;
    ctx=new Audio();
    musicBus=ctx.createGain();effectsBus=ctx.createGain();
    musicBus.connect(ctx.destination);effectsBus.connect(ctx.destination);
   }
   if(ctx.state==='suspended')await ctx.resume();
   sync();
  }catch{}
 }
 function persist(){
  try{localStorage.setItem(key,JSON.stringify(settings));}catch{}
  sync();
  unlock();
 }
 button.onclick=()=>{
  modal(`<h2>聲音設定</h2><div class="audio-settings">${[['music','背景音樂'],['effects','操作音效']].map(([id,label])=>`<section><label><input data-audio-toggle="${id}" type="checkbox" ${settings[id+'Enabled']?'checked':''}> ${label}</label><label>音量 <input data-audio-volume="${id}" type="range" min="0" max="100" value="${settings[id]}"> <output data-audio-output="${id}">${settings[id]}%</output></label></section>`).join('')}</div>`);
  const panel=document.querySelector('#dialog-content');
  panel.querySelectorAll('[data-audio-toggle]').forEach(input=>input.onchange=()=>{
   settings[input.dataset.audioToggle+'Enabled']=input.checked;
   persist();
  });
  panel.querySelectorAll('[data-audio-volume]').forEach(input=>input.oninput=()=>{
   const id=input.dataset.audioVolume;
   settings[id]=Number(input.value);
   panel.querySelector('[data-audio-output="'+id+'"]').textContent=input.value+'%';
   persist();
  });
 };
 document.addEventListener('click',async e=>{
  await unlock();
  if(ctx?.state==='running'&&settings.effectsEnabled&&settings.effects&&e.target.closest?.('button')&&!e.target.closest('#sound-toggle')){
   tone(effectsBus,659.25,ctx.currentTime,.18,.012);
  }
 });
 document.addEventListener('keydown',unlock);
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){sync();ctx?.suspend().catch(()=>{});}
  else if(ctx)unlock();
 });
 window.addEventListener('pagehide',event=>{
  stopMusic();
  if(!ctx)return;
  if(event.persisted)ctx.suspend().catch(()=>{});
  else{ctx.close().catch(()=>{});ctx=null;}
 });
 window.addEventListener('pageshow',event=>{
  if(event.persisted&&ctx)unlock();
 });
})();
