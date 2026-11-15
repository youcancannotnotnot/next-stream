'use strict';

const E=window.StreamLife,app=document.querySelector('#app'),dialog=document.querySelector('#dialog'),content=document.querySelector('#dialog-content'),KEY='nextstream-save-v1';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const num=n=>Math.round(n).toLocaleString('zh-TW');

const labels={wellbeingMood:'心情',physical:'健康',fans:'追蹤',money:'資金',health:'體力',joy:'熱情',skill:'實力',bond:'熟客關係',network:'人脈'};

let state=null,saved=null,saveOK=true;

try{let v=JSON.parse(localStorage.getItem(KEY));if(E.valid(v))saved=E.parseSave(JSON.stringify(v))}catch(e){saveOK=false}

document.querySelector('.brand-icon').innerHTML=SweetArt.icon('rabbit');

const THEME_KEY='nextstream-theme';

if(!document.querySelector('#theme-toggle')){let b=document.createElement('button');b.id='theme-toggle';b.className='quiet';document.querySelector('.header-right').prepend(b);}

function applyTheme(dark){document.documentElement.dataset.theme=dark?'dark':'light';document.querySelector('#theme-toggle').textContent=dark?'☀ 淺色模式':'☾ 深色模式';document.querySelector('#theme-toggle').setAttribute('aria-pressed',String(dark));document.querySelector('meta[name="theme-color"]').content=dark?'#211c30':'#bba6df';let roomButton=document.querySelector('#room-theme');if(roomButton){roomButton.textContent=dark?'☀ 切換明亮背景':'☾ 切換深色背景';roomButton.setAttribute('aria-pressed',String(dark));}}

function toggleTheme(){let dark=document.documentElement.dataset.theme!=='dark';applyTheme(dark);try{localStorage.setItem(THEME_KEY,dark?'dark':'light')}catch(e){toast('外觀已切換，但瀏覽器無法記住設定。');}}

try{applyTheme(localStorage.getItem(THEME_KEY)==='dark')}catch(e){applyTheme(false)}

document.querySelector('#theme-toggle').onclick=toggleTheme;

function toast(t){let el=document.querySelector('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3500)}

function save(){
 saved=structuredClone(state);
 try{localStorage.setItem(KEY,JSON.stringify(saved));saveOK=true;}
 catch(e){saveOK=false;toast('最新進度只保留在這個分頁，關閉或重新整理前請匯出 JSON 存檔。');}
}

function modal(html){content.innerHTML=html;if(!dialog.open)dialog.showModal()}

function eventOdds(){

 const percent=value=>new Intl.NumberFormat('zh-TW',{style:'percent',maximumFractionDigits:1}).format(value);

 const tiers=[...E.weeklyTiers].reverse();

 return [...tiers.map(t=>[t.name,percent(t.chance)]),['沒抽中',percent(1-tiers.reduce((sum,t)=>sum+t.chance,0))]];

}

function showEventOdds(){

 modal(`<h2>每週事件機率</h2><table class="event-odds"><thead><tr><th>抽取結果</th><th>機率</th></tr></thead><tbody>${eventOdds().map(([name,chance])=>`<tr><td>${name}</td><td>${chance}</td></tr>`).join('')}</tbody></table><p>抽中後會在當週隨機一天出現。固定節日照日期觸發；傳說另有 12 個遊戲月保底。</p>`);

}

function showEventCounts(){

 const counts=state.weeklyEventCounts||{};

 const rows=[...E.weeklyTiers].reverse().map(t=>[t.name,counts[t.id]||0]);

 rows.push(['保底傳說',counts.guaranteed||0]);

 const total=rows.reduce((sum,[,value])=>sum+value,0);

 modal(`<h2>事件抽中紀錄</h2><p>共遇到 ${num(total)} 個抽選或保底事件。舊存檔從更新後開始統計。</p><table class="event-odds"><thead><tr><th>等級</th><th>出現次數</th></tr></thead><tbody>${rows.map(([label,value])=>`<tr><td>${label}</td><td>${num(value)}</td></tr>`).join('')}</tbody></table>`);

}

function productEffects(p){

 const scoped=p.topics||[];

 const names=E.contents.filter(c=>scoped.includes(c.id)).map(c=>c.name).join('、');

 const base=E.equipmentStats(p);

 const matched=E.equipmentStats(p,scoped[0]);

 const labels={health:'體力',wellbeingMood:'心情',joy:'熱情'};

 const signed=n=>(n>0?'+':'')+n;

 const effects=[];

 for(const key of Object.keys(labels)){

  if(base[key])effects.push(labels[key]+' '+signed(base[key]));

  if(matched[key]!==base[key])effects.push(names+' '+labels[key]+' '+signed(matched[key]-base[key]));

 }

 for(const [value,label,topic] of [[p.income,'廣告分成',true],[p.reach,'新增訂閱',false],[p.topicReach,'新增訂閱',true]]){

  if(value)effects.push((topic&&names?names+' ':'')+label+' +'+Math.round(value*E.equipmentMultiplier*1000)/10+'%');

 }

 if(p.upkeep)effects.push('每日維護 '+num(p.upkeep));

 if(p.id==='archive')effects.push('休息或退休時額外恢復 2 熱情');

 if(['ups','backup','license','moderator'].includes(p.id))effects.push('降低對應事故發生機會');

 return effects.join('、')||'企劃完成後生效。';

}

function showProductShop(){

 const rows=E.shopProducts(state);

 modal(`<h2>商品商店</h2>${rows.length?`<div class="expense-details cash-history"><ul>${rows.map(({product:p,status})=>`<li><span><b>${esc(p.name)}</b><br>${num(p.cost)} · ${esc(productEffects(p))}${status?`<br>${esc(status)}`:''}</span><button class="secondary" data-shop-buy="${esc(p.id)}" ${status?'disabled':''}>購買</button></li>`).join('')}</ul></div>`:'<p>推薦過且尚未購買的商品會出現在這裡。</p>'}`);

 content.querySelectorAll('[data-shop-buy]').forEach(button=>button.onclick=()=>{

  if(E.buyShopProduct(state,button.dataset.shopBuy)){save();render();showProductShop();}

  else showProductShop();

 });

}

function showPurchasedProducts(){

 const life=E.upgradeLife(state), order=life.project;

 const products=E.projects.filter(p=>life.completed.includes(p.id)||order?.id===p.id);

 modal(`<h2>已購商品</h2><p>設備的正向直播加成按基礎效果的 ${Math.round(E.equipmentMultiplier*100)}% 計算。</p>${products.length?`<div class="expense-details cash-history"><ul>${products.map(p=>`<li><span><b>${esc(p.name)}</b><br>${esc(productEffects(p))}</span><b>${order?.id===p.id?'交付中 · 第 '+(order.due+1)+' 天':'已啟用'}</b></li>`).join('')}</ul></div>`:'<p class="fine">買下的商品與企劃會列在這裡。</p>'}`);

}

function guide(){modal(`<h2>決定方向，讓人生往前走。</h2><p>選生活重心，按「繼續人生」。每天的開台、練習與休息依方針安排。「照顧心情」每週安排兩天休息，心情低於 55 也會優先休息。開啟兼職才會排班；體力、熱情與生活資金不足時會優先調整。</p><p>隨機事件、固定節日、生日與初配信週年會暫停並在頁面上顯示選項。做出決定後會先顯示增減，按「繼續人生」再前進；你仍可手動暫停。每次可前進 7／14／21／30 天，約每 1.5 秒處理一批，逐日結算；遇到事件就停下等待選擇。</p><p>每週抽一次隨機事件，抽中後在當週隨機一天出現。${eventOdds().map(([name,chance])=>name+' '+chance).join('、')}。收集未完成時，連續 12 個遊戲月（360 天）沒有傳說就會安排一個尚未遇過的傳說。生涯滿五年時會先補齊所需的傳說，再解鎖隱藏週年事件。若抽到的等級沒有符合條件的事件，這週照常度過。直播主題可從生活方針隨時更改。商品推薦獨立於每週抽選，最早在第 30 個遊戲日後出現，兩次至少相隔 30 天。投資、生活照顧與借款會透過其他事件出現。生日、節日、交付和少見事故另有事件。開啟視窗或離開分頁時，時間暫停；重新開啟遊戲後需手動繼續。</p><p>輸入的初配信日期是遊戲日曆起點，每年對應月日觸發事件。生日取月日，2 月 29 日在非閏年改為 2 月 28 日。角色年齡、投資配息等既有規則仍以 360 個生涯日為一年。</p>`);}



document.querySelector('#guide').onclick=guide;document.querySelector('#close-dialog').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){let r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

function returnHome(){stopLife();if(state)save();state=null;landing();}
document.querySelector('#brand').onclick=e=>{e.preventDefault();returnHome();};
document.querySelector('#return-home').onclick=returnHome;

function openingControls(){

 return `<div class="opening-controls">${[['background','出身'],['talent','天賦'],['challenge','開局難題'],['gift','開台禮物']].map(([key,label])=>`<label>${label}<select name="${key}">${key==='challenge'?'<option value="none" selected>無</option>':''}<option value="">隨機抽取</option>${E.openingOptions[key].map(option=>`<option value="${esc(option.id)}">${esc(option.name)}${option.description?' · '+esc(option.description):''}</option>`).join('')}</select></label>`).join('')}</div>`;

}

function landing(){document.querySelector('#return-home').hidden=true;app.innerHTML=`<section class="landing"><div><div class="eyebrow">VTuber 人生模擬</div><h1>下一次開台</h1><p class="intro">從一個觀眾也沒有的夜晚，到有人記得你的晚安。<br>你想成為什麼樣的主播，又想過什麼樣的生活？</p><div class="start-form">${saved?`<div class="resume"><span>${esc(saved.name)}的故事<br><small>已走過 ${saved.day??saved.season*90} 天 · ${num(saved.fans)} 人追蹤</small></span><button id="resume" class="secondary">繼續故事</button></div>`:''}<button type="button" class="quiet" id="landing-slots">存檔管理／匯入</button><form id="start"><label for="name">你的頻道名稱</label><input id="name" name="name" maxlength="16" placeholder="替這個小小的世界取個名字" autocomplete="off"><div class="row"><div><label for="gender">角色性別</label><select id="gender" name="gender"><option value="male">男</option><option value="female">女</option></select></div></div><div class="row"><div><label for="birthday">角色生日</label><input type="date" id="birthday" name="birthday" value="2000-06-21" required></div><div><label for="debut">初配信日期</label><input type="date" id="debut" name="debut" value="2026-11-08" required></div></div>${openingControls()}<p class="fine">起始年齡依角色生日與初配信日期計算。初配信日是遊戲日曆起點。</p><button class="primary wide" type="submit">確認我的人生起點　↗</button><p class="fine">不需要下載 · 手機也能玩 · 可隨時離開，下次接續人生</p></form></div></div><figure class="dream-cover"><img src="dream-studio.svg" alt="低彩度粉灰工作室，窗邊夜景、直播設備與日常書桌" width="1100" height="760"><figcaption><span>AFTER HOURS / MY STUDIO</span><b>今晚，也有人等著你的晚安。</b></figcaption></figure></section><section class="features"><div><strong>01　每個人，都有不同起點</strong><p>生活背景、創作資金與天賦隨機抽取。</p></div><div><strong>02　人氣之外，還有生活</strong><p>平衡工作、健康、熱情與願意留下的人。</p></div><div><strong>03　留下你自己的故事</strong><p>結束時回顧一路走來的選擇，下載生涯日記。</p></div></section>`;

 document.querySelector('#landing-slots').onclick=()=>slotsPanel();

 if(saved)document.querySelector('#resume').onclick=()=>{

 state=structuredClone(saved);

 if(!state.gender){modal('<h2>補上角色設定</h2><p>原本的進度會保留。舊版故事將轉成每日人生模式，已結束的舊生涯也能接續。</p><label for="legacy-gender">角色性別</label><select id="legacy-gender"><option value="male">男</option><option value="female">女</option></select><button class="primary" id="upgrade-save">保留進度並繼續</button>');document.querySelector('#upgrade-save').onclick=()=>{E.migrate(state,document.querySelector('#legacy-gender').value);dialog.close();save();render()};}

 else {E.migrate(state,state.gender);save();render();}

 };

 document.querySelector('#start').onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),o=Object.fromEntries(f);if(E.ageAtDebut(o.birthday,o.debut)===null){toast('初配信日期須在角色生日當天或之後。');return;}let begin=()=>{state=E.make(o,crypto.getRandomValues(new Uint32Array(1))[0]);E.setWorkMode(state,'salary');clockDays=7;fastMode=false;save();render();if(!state.secretEnding&&state.eventId!=='secret_anniversary_invite')intro()};if(saved){modal('<h2>開始另一段人生？</h2><p>新故事會取代這個瀏覽器的目前存檔。原本的故事可以先繼續遊玩或匯出。</p><button class="primary" id="confirm-start">開始新故事</button>');document.querySelector('#confirm-start').onclick=()=>{dialog.close();begin()}}else begin()};}

function intro(){

 const living=E.livingInfo(state), zodiac=E.zodiacProfile(state);

 const stats=[['現金',state.money],['訂閱數',state.fans],['心情',living.mood],['體力',state.health],['健康',living.physical],['熱情',state.joy]];

 const strengths=zodiac?E.contents.filter(c=>zodiac.topics.includes(c.id)).map(c=>esc(c.name)).join('、'):'';

 modal(`<div class="eyebrow">VTuber · ${E.ageNow(state)} 歲</div><h2>${esc(state.background)}</h2><p>${esc(state.bio)}</p>

 ${state.opening?`<p><b>開局難題</b> ${esc(state.opening.challenge?.name||'無')}<br><b>開台禮物</b> ${esc(state.opening.gift.name)} · ${esc(state.opening.gift.description)}</p>`:''}

 <h3>初始狀態</h3><dl class="intro-stats">${stats.map(([label,value])=>`<div><dt>${label}</dt><dd>${num(value)}</dd></div>`).join('')}</dl>

 <p>每月基本支出約 <b>${num(living.monthly)}</b>。</p>

 <section class="outcome"><strong>${esc(state.trait[0])}</strong><p>${esc(state.trait[1])}</p>

 ${zodiac?`<strong>${esc(zodiac.name)} · ${esc(zodiac.personality)}</strong><p>${esc(zodiac.description)}${zodiac.action==='rest'?' 休息時額外恢復 1 點心情。':''}</p><p>擅長 ${strengths}。播這些主題時新增追蹤 +18%、直播收入 +12%，對應主題的機率選項成功率 +10 個百分點。</p>`:''}</section>

 <p><b>預設每週行程</b> · 正職工作 5 天、開播 1 天、休息 1 天。狀態偏低時會優先安排休息。</p><h3>怎麼玩</h3><ol><li>設定直播主題、生活重心，並選擇是否兼職。</li><li>按「繼續人生」，每批推進 7 至 30 天。每週可能抽到隨機事件，固定事件按日期出現。遇到事件會停下，選完先查看增減，再繼續人生。</li><li>留意每月支出和角色狀態。心情偏低時，可切換「照顧心情」。</li></ol>

 <button class="primary" id="enter">走進我的直播間　→</button>`);

 content.querySelector('#enter').onclick=()=>dialog.close();

}

function profile(){let s=state;return `<aside class="profile"><div class="profile-top"><div class="avatar">${SweetArt.portrait(s.name)}</div><div><h2>${esc(s.name)}</h2><div class="meta">${esc(s.route)} · ${s.gender==='female'?'女':'男'} · ${esc(s.genre)}</div></div></div><p class="bio">${esc(s.background)}<br>${E.ageNow(s)} 歲 · ${s.flags.includes('agency')?'團隊所屬':'個人創作者'}</p><hr><div class="label">創作資金 · </div><div class="money ${s.money<0?'low':''}">${num(s.money)}</div><div class="profile-meters">${['health','joy','skill','bond'].map(k=>`<div><div class="stat-row"><span>${labels[k]}</span><span>${num(s[k])} / 100</span></div><div class="meter ${k}"><i style="width:${s[k]}%"></i></div></div>`).join('')}</div><p class="trait">✦ ${esc(s.trait[0])}<br>${esc(s.trait[1])}</p></aside>`}

function rail(){let s=state,max=Math.max(100,...s.graph),points=s.graph.map((n,i)=>`${i*180/Math.max(1,s.graph.length-1)},${55-n/max*48}`).join(' ');return `<aside class="right-rail"><section class="side-card"><div class="label">願意按下追蹤的人</div><div class="fan-number">${num(s.fans)}</div><div class="label">一個名字，就是一個相遇。</div><svg viewBox="0 0 180 60" role="img" aria-label="追蹤數變化"><polyline points="${points}" fill="none" stroke="#d28eb8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></section><section class="side-card"><h3>你的頻道足跡</h3><p>主要觀眾偏好：${esc(E.audienceInfo(s,E.contents[0].id).dominant)}</p><p>商譽 ${s.life.reputation} / 100 · 已完成 ${s.life.completed.length} 項企劃</p><p>${s.life.project?'進行中：'+esc(E.projects.find(p=>p.id===s.life.project.id).name):'在「人生與企劃」選一個想完成的目標。'}</p></section><section class="side-card"><h3>和你同時出發的人</h3><div class="label">虛構同期主播 · 各自的節奏</div><div class="peers">${s.peers.map(p=>`<div class="peer"><div class="peer-name"><span class="peer-art">${SweetArt.portrait(p.name)}</span><b>${esc(p.name)}</b><span>${num(p.fans)}</span></div><p>${esc(p.note)}</p></div>`).join('')}</div></section></aside>`}

function finance(){let f=state.finance;if(!f)return '';return `<div class="finance">今日頻道收益 ＋${num(f.income)}（含設備額外收益 ${num(f.equipmentBonus||0)}）　／　設備維護 −${num(f.cost)}　／　利息 −${num(f.interest||0)}　／　臨時支出 −${num(f.accident||0)}<br>生活安排資金變化 ${f.action>=0?'＋':''}${num(f.action)}　／　追蹤變化 ${f.growth>=0?'＋':''}${num(f.growth)}<br>事件帶來的變化另列於上方結果。</div>`}

function panel(){let s=state;

if(s.stage==='broadcast')return livePanel();

if(s.stage==='content')return `<section class="card"><div class="chapter">開台企劃 · 這次想做什麼？</div><h2>你的頻道，不必只有一種樣子。</h2><p class="body">選擇今天的節目重心。內容會改變成長與遇到的事件，下次開台仍能換方向。</p><div class="options">${E.contents.map(c=>`<button class="option" data-content="${c.id}"><span class="num art-action">${SweetArt.icon(c.id)}</span><span><strong>${c.name}</strong><small>${c.desc}<br>設備收益加成 +${Math.round(E.equipmentEffect(s,c.id).income*100)}%<br>目前偏好占比 ${E.audienceInfo(s,c.id).share}% · 契合度 ${Math.round(E.audienceInfo(s,c.id).fit*100)}%</small></span><span class="arrow">→</span></button>`).join('')}</div><button class="quiet" id="cancel-content" style="margin-top:18px">返回生活安排</button><p class="fine">還沒確認內容前，不會消耗今天的資源。政治事件為虛構情境，選擇任何立場都不保證流量。</p></section>`;

if(s.stage==='focus')return `<section class="card"><div class="chapter">今天，把時間留給什麼？</div><h2>${s.day===0?'一個空白的直播間。':'在下一次開台之前。'}</h2><p class="body">${s.day===0?'設備不一定完美，企劃也還在摸索。但這次，故事的主角是你。':'你不能同時把每件事都做到最好。今天，挑一件對現在的你重要的事。'}</p><div class="options">${E.actions.filter(a=>!a.minAge||E.ageNow(s)>=a.minAge).map((a,i)=>`<button class="option" data-focus="${a.id}" ${a.money<0&&s.money+a.money<0?'disabled':''}><span class="num art-action">${SweetArt.icon(a.id)}</span><span><strong>${a.title}</strong><small>${a.desc}<br>${a.preview}${a.money<0&&s.money+a.money<0?' · 資金不足':''}</small></span><span class="arrow">↗</span></button>`).join('')}</div><p class="fine">今日生活費 ${num(E.costs(s))} 。可能有額外利息與臨時支出。${s.notice?'<br>'+esc(s.notice):''}</p></section>`;

if(s.stage==='event'){let e=E.event(s);let title=e.title;const product=e.id==='monthly_equipment'?E.projects.find(p=>e.choices.some(c=>c.opportunity?.type==='equipment'&&c.opportunity.id===p.id)):null;return `<section class="card"><div class="event-symbol">${SweetArt.icon(e.id==='first'?'mic':e.arcStart||e.arcEnd?'letter':'star')}</div><div class="chapter">${e.tag} · ${esc(s.lastFocus)}</div><h2>${title}</h2><p class="body">${product?esc(productEffects(product)):e.body}</p>${e.letter?`<blockquote class="birthday-letter"><p>${esc(e.letter.message)}</p><cite>${esc(e.letter.signature)}</cite></blockquote>`:''}${e.links?`<nav class="birthday-links" aria-label="夢寐愛姆的頻道">${e.links.map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join('')}</nav>`:''}<div class="options">${e.choices.map((c,i)=>{let disabled=(c.requiredCash||0)>Math.max(0,s.money)||(c.delta.money||0)<0&&s.money+c.delta.money<0;return `<button class="option" data-choice="${i}" ${disabled?'disabled':''}><span class="num">0${i+1}</span><span><strong>${c.label}</strong>${!e.concealOutcomes?`<small>${c.note}${c.chance?' · 結果不一定如預期':''}${disabled?' · 資金不足':''}</small>`:disabled?'<small>資金不足</small>':''}</span><span class="arrow">→</span></button>`}).join('')}</div></section>`}

if(s.stage==='result'){let last=s.history.at(-1);return `<section class="card"><div class="event-symbol">${SweetArt.icon('moon')}</div><div class="chapter">今天，成為了回憶</div><h2>${esc(last.choice)}</h2><div class="outcome">${esc(s.lastResult)}</div><div class="changes">${Object.entries(s.lastChanges).map(([k,v])=>`<span class="change ${v<0?'negative':''}">${labels[k]} ${v>0?'+':''}${num(v)}</span>`).join('')||'<span class="fine">有些影響，沒有寫在數字裡。</span>'}</div><p class="body">${s.bond>=70?'聊天室裡熟悉的名字，慢慢變成你生活的一部分。':s.health<30?'疲憊已經很明顯。明天，也許可以先照顧自己。':s.money<1800?'生活資金有點緊，安排兼職可能讓你更有餘裕。':'你把今天的故事收進回憶，留一點空間給未來。'}</p><button class="primary wide" id="advance">走向明天　→</button>${s.channelNote?`<p class="fine">${esc(s.channelNote)}</p>`:''}${finance()}</section>`}

return `<section class="card end-card" data-ending-score="${endingIndex(s.summary.title)}"><div class="eyebrow">一段主播人生，暫時落幕</div>${endingIllustration(s.summary.title)}<h2>${esc(s.summary.title)}</h2><p class="body">${esc(s.summary.body)}</p>${recapPanel()}${memoryPanel()}<div class="end-stats"><div><b>${s.day}</b><span>一起走過的天數</span></div><div><b>${num(s.peak)}</b><span>最多訂閱人數</span></div></div><button class="primary" id="export">下載我的故事</button> <button class="secondary" id="new-life">另一段人生</button><p class="fine">留下來的，是曾經創作與陪伴的日子。</p></section>`}

function renderLegacy(){if(!state)return landing();E.simplifyShop(state);app.innerHTML=`<section class="game-top"><div><div class="time">${esc(E.dateLabel(state.day))} · ${E.ageNow(state)} 歲 ／ ${esc(state.route)} · 終身生涯</div><div class="season-note">${esc(E.calendar(state.season))} · 一年 360 天，行情每日更新</div><h1>${state.stage==='end'?'謝謝你，曾經按下開台。':'把今天的光，留在下一場夢裡。'}</h1></div><div><button class="secondary" id="studio-life">節目與生活</button> <button class="quiet" id="save-slots">存檔管理</button> <button class="secondary" id="career">人生與企劃</button> <button class="secondary" id="market">投資與資產</button> <button class="quiet" id="achievements">生涯目標</button> <button class="secondary" id="shop">設備商店</button> <button class="quiet" id="journal">生涯日記</button> <button class="secondary" id="dream-room">我的直播房間</button> <button class="quiet" id="keepsake">人生紀念卡</button><div class="save-label">${saveOK?'已保存在這個瀏覽器':'目前無法保存'}</div></div></section>${tutorialPanel()}${state.stage==='focus'?`<section class="autobar"><strong>日常代管</strong><span>自動安排工作、開台與休息，僅代選日常小事；重大決定與健康警訊會暫停。不操作投資或啟動企劃。</span><button class="quiet" data-auto="7">7 天</button><button class="quiet" data-auto="30">30 天</button><button class="quiet" data-auto="360">1 年</button></section>`:''}${state.market.daily?`<section class="journey-strip"><b>今日生活與產業</b><p>${esc(state.market.daily.text)}${state.market.daily.cost?' 今日額外支出 '+state.market.daily.cost+'。':''}</p><small>產業消息影響相關公司；個人買設備不會拉抬股價。${state.market.daily.topic?'相關節目今日曝光與收益也會受到影響。':''}</small></section>`:''}${todayPanel()}<div class="life-chapter"><b>${esc(E.lifePhase(state).name)}</b><span>${esc(E.lifePhase(state).text)}</span></div>${journeyPanel()}<div class="game-grid">${profile()}<div id="story-panel" tabindex="-1">${panel()}</div>${rail()}</div>`;

app.querySelector('#dream-room').onclick=roomPanel;app.querySelector('#keepsake').onclick=keepsakePanel;let dt=app.querySelector('#live-details');if(dt)dt.onchange=()=>{E.storyState(state).details=dt.checked;save();render()};app.querySelector('#achievements').onclick=()=>achievementPanel();let skip=app.querySelector('#tutorial-skip');if(skip)skip.onclick=()=>{E.dismissTutorial(state);save();render()};app.querySelectorAll('[data-live-choice]').forEach(b=>b.onclick=()=>{if(E.chooseLive(state,Number(b.dataset.liveChoice)))commit()});

app.querySelectorAll('[data-today]').forEach(b=>b.onclick=()=>{let t=b.dataset.today;if(t==='studio')studioPanel();else if(t==='career')careerPanel();else if(t==='market')marketPanel();else if(t==='saves')slotsPanel();else document.querySelector('#story-panel').scrollIntoView({block:'start'})});

app.querySelector('#studio-life').onclick=()=>studioPanel();app.querySelector('#save-slots').onclick=()=>slotsPanel();

app.querySelector('#career').onclick=()=>careerPanel();

app.querySelector('#market').onclick=()=>marketPanel();

app.querySelectorAll('[data-auto]').forEach(b=>b.onclick=()=>{if(E.simulate(state,Number(b.dataset.auto))){save();render();let r=state.autoReport;modal(`<h2>${r.paused?'代管已暫停':'代管完成'}</h2><p>已走過 ${r.days} 天${state.stage==='event'?'；今天的安排已進行，故事正等待你的選擇。':'。'}</p><p>現金變化 ${num(r.money)} · 追蹤變化 ${num(r.fans)}</p><p>持倉未買賣，行情已逐日結算。</p><div class="timeline">${r.stories.map(t=>`<p>${esc(t)}</p>`).join('')||'這段時間以日常安排為主。'}</div>`);}});

app.querySelectorAll('[data-content]').forEach(b=>b.onclick=()=>{programmePanel(b.dataset.content)});let cancel=app.querySelector('#cancel-content');if(cancel)cancel.onclick=()=>{E.cancelContent(state);commit()};app.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{if(E.focus(state,b.dataset.focus))commit()});app.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(E.choose(state,Number(b.dataset.choice)))commit()});let next=app.querySelector('#advance');if(next)next.onclick=()=>{E.advance(state);commit()};app.querySelector('#shop').onclick=shopPanel;app.querySelector('#journal').onclick=journal;let ex=app.querySelector('#export');if(ex)ex.onclick=download;let nl=app.querySelector('#new-life');if(nl)nl.onclick=()=>{state=null;landing()};}

function commit(){save();render();const panel=document.querySelector('#choice-result, #story-panel');const result=document.querySelector('#choice-result');(result||panel).focus({preventScroll:true});if(result||innerWidth<701)(result||panel).scrollIntoView({behavior:'auto',block:'nearest'})}

function journal(){modal(`<div class="eyebrow">YOUR STREAM DIARY</div><h2>${esc(state.name)}的生涯日記</h2><p>保留最近 1,000 筆；匯出可自行留存。</p>${memoryPanel()}<div class="timeline">${state.history.length?state.history.slice().reverse().map(h=>`<article class="entry"><time>${E.dateLabel(h.day??h.season*90)}</time><strong>${esc(h.title)}</strong><p>${h.content?esc(h.content)+' · ':''}${esc(h.choice)}<br>${esc(h.text)}</p></article>`).join(''):'還沒有寫下第一段回憶。'}</div><button class="secondary" id="download-journal" style="margin-top:20px">下載文字日記</button>`);document.querySelector('#download-journal').onclick=download}

function download(){let s=state,text=`下一次開台｜${s.name}的主播人生\n${s.route} · ${s.gender==='female'?'女':'男'} · ${s.genre}\n${s.background}｜${s.trait[0]}\n${s.summary?.title||'故事仍在繼續'}\n追蹤 ${s.fans}｜熟客關係 ${s.bond}\n\n`+s.history.map(h=>`${E.dateLabel(h.day??h.season*90)}｜${h.title}\n${h.content||''}\n${h.choice}\n${h.text}`).join('\n\n');let url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='我的主播人生.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已匯出生涯日記。')}





let marketAsset='steady',chartRange=30,chartMode='candle';

const moneyText=n=>Number(n).toLocaleString('zh-TW',{maximumFractionDigits:0});

function priceChart(m,id){

 const all=m.bars[id],bars=all.slice(-chartRange),offset=all.length-bars.length;

 const maValues=[5,20].flatMap(n=>bars.map((b,i)=>{let j=offset+i;return j<n-1?b.close:all.slice(j-n+1,j+1).reduce((v,d)=>v+d.close,0)/n}));let low=Math.min(...bars.map(b=>b.low??b.close),...maValues),high=Math.max(...bars.map(b=>b.high??b.close),...maValues);let pad=Math.max((high-low)*.12,high*.005);low-=pad;high+=pad;

 const y=p=>180-(p-low)/(high-low)*150,x=i=>48+(i+.5)*540/Math.max(1,bars.length),vmax=Math.max(1,...bars.map(b=>b.volume||0));

 let grid=[0,1,2,3].map(i=>{let p=low+(high-low)*i/3;return `<line x1="48" x2="588" y1="${y(p)}" y2="${y(p)}" stroke="#dedee7"/><text x="595" y="${y(p)+4}" font-size="10" fill="#707488">${p.toFixed(2)}</text>`}).join('');

 let candles=bars.map((b,i)=>{let color=b.close>=(b.open??b.close)?'#c16885':'#418d83',w=Math.max(2,Math.min(9,540/bars.length*.65));return `<g><title>${E.dateLabel(b.day)} · 收 ${b.close.toFixed(2)}${b.legacy?' · 舊版僅有收盤資料':` · 開 ${b.open} 高 ${b.high} 低 ${b.low} 量 ${b.volume}`}</title>${!b.legacy&&chartMode==='candle'?`<line x1="${x(i)}" x2="${x(i)}" y1="${y(b.high)}" y2="${y(b.low)}" stroke="${color}"/><rect x="${x(i)-w/2}" y="${Math.min(y(b.open),y(b.close))}" width="${w}" height="${Math.max(1,Math.abs(y(b.open)-y(b.close)))}" fill="${color}"/>`:''}<rect x="${x(i)-w/2}" y="${240-(b.volume||0)/vmax*40}" width="${w}" height="${(b.volume||0)/vmax*40}" fill="${color}" opacity=".4"/></g>`}).join('');

 let line=`<polyline points="${bars.map((b,i)=>x(i)+','+y(b.close)).join(' ')}" fill="none" stroke="#b393d8" stroke-width="${chartMode==='line'?2:1}" opacity="${chartMode==='line'?1:.35}"/>`;

 let averages=[5,20].map((n,k)=>{let points=bars.map((b,i)=>{let j=offset+i;if(j<n-1)return '';return x(i)+','+y(all.slice(j-n+1,j+1).reduce((v,d)=>v+d.close,0)/n)}).filter(Boolean);return `<polyline points="${points.join(' ')}" fill="none" stroke="${k?'#6487b6':'#c2933e'}" stroke-width="1.7"/>`}).join('');

 return `<svg class="price-chart" viewBox="0 0 660 275" role="img" aria-label="${E.assets.find(a=>a.id===id).name}的價格、五日與二十日均線、成交量"><text x="48" y="16" font-size="11" fill="#767b87">價格</text>${grid}${line}${candles}${averages}<text x="48" y="198" font-size="10" fill="#767b87">成交量 · 最高 ${num(vmax)}</text><text x="48" y="264" font-size="10" fill="#767b87">${E.dateLabel(bars[0].day)}</text><text x="588" y="264" text-anchor="end" font-size="10" fill="#767b87">${E.dateLabel(bars.at(-1).day)}</text></svg>`;

}

function barReadout(b){return `${E.dateLabel(b.day)} ｜ ${b.legacy?'舊版僅保存收盤價':`開 ${moneyText(b.open)} ／ 高 ${moneyText(b.high)} ／ 低 ${moneyText(b.low)} ／ 量 ${num(b.volume)}${b.halt?' ／ 停牌':''}`} ／ 收 ${moneyText(b.close)}`;}

function marketPanel(message=''){

 let s=state,m=s.market,a=E.assets.find(a=>a.id===marketAsset),id=a.id,p=m.positions[id],price=m.prices[id],q=m.quotes[id],bars=m.bars[id].slice(-chartRange),value=E.marketValue(s),basis=E.assets.reduce((v,a)=>v+m.positions[a.id].cost,0),change=(price/m.previous[id]-1)*100;

 modal(`<div class="market-head"><span class="eyebrow">夢境證券 · 模擬交易室</span><h2>市場與我的資產</h2><p>${esc(E.dateLabel(s.day))} · 市場階段：${m.regime}</p></div><div class="portfolio-grid"><div>可用現金<b>${moneyText(s.money)}</b></div><div>持倉市值<b>${moneyText(value)}</b></div><div>淨資產<b>${moneyText(E.netWorth(s)+E.upgradeLife(s).fund.balance)}</b></div><div>未實現損益<b>${moneyText(value-basis)}</b></div><div>已實現損益<b>${moneyText(m.realized)}</b></div><div>累計配息<b>${moneyText(m.dividends)}</b></div></div><div class="market-tabs">${E.assets.map(v=>`<button class="${v.id===id?'primary':'quiet'}" data-asset-tab="${v.id}" aria-pressed="${v.id===id}">${v.name}${v.sector?' · '+v.sector:''}</button>`).join('')}</div><section class="chart-card"><div class="chart-art-heading">${SweetArt.icon('coin')}<span>慢慢累積，讓夢想有地方發芽。</span></div><div class="chart-tools"><div><strong>${a.name}</strong><p class="quote-price">${moneyText(price)} <small class="${change>=0?'stock-up':'stock-down'}">${change>=0?'+':''}${change.toFixed(2)}%</small></p><span class="fine">${a.risk} · ${q.halted?'今日停牌':'可交易'} · 今日成交量 ${num(q.volume)}</span></div><div>${[30,90].map(n=>`<button class="quiet" data-range="${n}" aria-pressed="${chartRange===n}">${n} 天</button>`).join('')}<button class="quiet" id="chart-mode">切換${chartMode==='candle'?'折線':'K 線'}</button></div></div>${priceChart(m,id)}<p class="chart-legend">紅：收盤 ≥ 開盤　綠：收盤 &lt; 開盤　<span>金：MA5</span>　藍：MA20</p><label for="chart-day">查閱日期</label><input id="chart-day" type="range" min="0" max="${bars.length-1}" value="${bars.length-1}" step="1"><p id="bar-readout" class="fine" aria-live="polite">${barReadout(bars.at(-1))}</p><p class="fine">未還原配息的價格圖。舊版只有收盤價，升級後才開始記錄 K 線與成交量；沒有足夠天數時不顯示均線。</p></section><section class="trade-ticket"><h3>市價委託 · ${a.name}</h3><p>持有 ${p.qty} 單位 ／ 平均成本 ${p.qty?moneyText(p.cost/p.qty):'—'} ／ 持倉損益 ${moneyText(p.qty*price-p.cost)}</p><p class="fine">成本包含買入費用；損益未扣未來賣出費用。手續費 0.15%，最低 1；另計買賣價差及滑價。</p>${s.stage!=='end'?`<label for="trade-qty">交易單位</label><input id="trade-qty" type="number" min="1" max="1000000" step="1" value="1"><div id="order-preview" class="order-preview"></div><button class="primary" data-trade="buy" ${q.halted?'disabled':''}>市價買入</button> <button class="secondary" data-trade="sell" ${q.halted?'disabled':''}>市價賣出</button>`:'<p>人生已結束，資產僅供回顧。</p>'}<p role="status">${esc(message)}</p></section><section class="market-news"><h3>市場快訊</h3><p>${esc(m.news)}</p>${m.newsFeed.slice(0,8).map(n=>`<p class="fine">${E.dateLabel(n.day)} · ${esc(n.text)}</p>`).join('')}</section><details><summary>最近交易</summary>${m.log.slice(0,10).map(t=>`<p class="fine">${E.dateLabel(t.day)} · ${E.assets.find(a=>a.id===t.id).name} ${t.side==='buy'?'買':'賣'} ${t.qty} × ${t.price.toFixed(2)} · 費用 ${t.fee.toFixed(2)}</p>`).join('')||'尚無交易。'}</details><p class="fine">虛構市場，每個遊戲日均交易；價格、流動性、費率與事件是遊戲規則，不連接真實市場。價格只在遊戲日期前進時更新。</p>`);



 content.querySelectorAll('[data-asset-tab]').forEach(b=>b.onclick=()=>{marketAsset=b.dataset.assetTab;marketPanel()});content.querySelectorAll('[data-range]').forEach(b=>b.onclick=()=>{chartRange=Number(b.dataset.range);marketPanel()});document.querySelector('#chart-mode').onclick=()=>{chartMode=chartMode==='candle'?'line':'candle';marketPanel()};document.querySelector('#chart-day').oninput=e=>document.querySelector('#bar-readout').textContent=barReadout(bars[Number(e.target.value)]);

 let input=document.querySelector('#trade-qty');if(input){let preview=()=>{let qty=Number(input.value),buy=E.quote(s,id,'buy',qty),sell=E.quote(s,id,'sell',qty);document.querySelector('#order-preview').textContent=(buy.ok?`買入估計支出 ${moneyText(buy.cash)}（單價 ${moneyText(buy.price)}、費用 ${moneyText(buy.fee)}）`:buy.message)+' ／ '+(sell.ok?`賣出估計入帳 ${moneyText(sell.cash)}（單價 ${moneyText(sell.price)}、費用 ${moneyText(sell.fee)}）`:sell.message);};input.oninput=preview;preview();}

 content.querySelectorAll('[data-trade]').forEach(b=>b.onclick=()=>{let result=E.trade(state,id,b.dataset.trade,Number(input.value));if(result.ok){save();render();}marketPanel(result.message);});

}

landing();



function legacyCareerPanel(message=''){

 const s=state,l=E.upgradeLife(s),active=l.project,p=active&&E.projects.find(p=>p.id===active.id);

 modal(`<div class="eyebrow">不只是一場直播</div><h2>人生、關係與創作企劃</h2><p>現金 ${num(s.money)} · 投資市值 ${num(E.marketValue(s))} · 商譽 ${l.reputation} / 100</p><p class="fine">以下為價格與虛構效果，不是設備的現實售價。購買直接扣現金；設備與服務有交付時間。</p>${message?`<div role="status" class="outcome">${esc(message)}</div>`:''}

 <nav class="career-nav"><button class="quiet" data-section="people">長期關係</button><button class="quiet" data-section="channel">觀眾與轉型</button><button class="quiet" data-section="goals">創作目標</button></nav>

 <section id="career-people"><h3>值得花時間的人</h3><p class="fine">每次相處占用一天；事件待選時會排到之後執行（最多四件），基本支出 80，另計生活費。60 天未聯絡後，每 30 天關係下降 2。</p><div class="career-grid">${l.contacts.map(p=>`<article class="career-card"><div class="contact-portrait">${SweetArt.portrait(p.name)}</div><h3>${esc(p.name)} <small>${esc(p.role)}</small></h3><strong>${p.trust>=70?'信任的夥伴':p.trust>=40?'熟悉的朋友':'慢慢認識'} · ${p.trust} / 100</strong><div class="meter"><i style="width:${p.trust}%"></i></div><p>${esc(p.memory)}</p><p class="fine">上次聯絡：${E.dateLabel(p.lastDay)}</p><div class="career-buttons">${[['talk','聊聊近況',80],['help','協助創作 ＋200',280],...(p.role==='熟客'?[]:[['collab','小型聯動 ＋500',580]])].map(([id,label,cost])=>`<button class="secondary" data-social="${p.id}" data-kind="${id}" ${!['focus','event','result'].includes(s.stage)||s.money<cost||id==='collab'&&p.trust<40?'disabled':''}>${label}</button>`).join('')}</div>${p.role!=='熟客'?'<p class="fine">關係 40 以上才能聯動；聯動能引出後續合作。</p>':''}</article>`).join('')}</div></section>

 <section id="career-channel"><h3>觀眾會記得你做過的內容</h3><p>現在的主要偏好：<b>${esc(E.audienceInfo(s,'chat').dominant)}</b>。連續製作同類內容會逐漸培養喜好；低於 15% 偏好的突然轉型，會額外流失 1.2% 追蹤。</p>${l.transition?`<p class="outcome">漸進轉型中：還有 ${l.transition} 次開台享有較低流失。</p>`:''}<div class="audience-bars">${E.contents.map(c=>{let a=E.audienceInfo(s,c.id);return `<div><span>${esc(c.name)} <b>${a.share}%</b></span><div class="meter"><i style="width:${a.share}%"></i></div></div>`}).join('')}</div><p class="fine">偏好影響新增追蹤，並非保證每場成長。轉型事件可換取 10 場緩衝期。</p></section>

 <section id="career-goals"><h3>設備與製作服務</h3><p>設備購買已集中到商店，直接用現金付款。</p></section>

 <section><h3>還在發展中的故事</h3>${l.queue.length?l.queue.map(q=>`<p>◷ ${esc(E.events.find(e=>e.id===q.id)?.title)} · ${E.dateLabel(q.due)} 起</p>`).join(''):'<p>相處、接案和不同年齡的決定，都可能留下後續。</p>'}</section>`);



 content.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>content.querySelector('#career-'+b.dataset.section).scrollIntoView({block:'start',behavior:'smooth'}));

 content.querySelectorAll('[data-goal]').forEach(b=>b.onclick=()=>{if(E.setGoal(s,b.dataset.goal)){save();render();careerPanel('已更新目標；投資頁也能追蹤同一筆創作預算。')}});

 content.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>{if(E.startProject(s,b.dataset.project)){save();render();careerPanel('企劃已啟動。每天推進時間，準備進度也會前進。')}else careerPanel('目前無法開始，請確認現金與進行中的企劃。')});

 content.querySelectorAll('[data-social]').forEach(b=>b.onclick=()=>{if(E.social(s,b.dataset.social,b.dataset.kind)){dialog.close();commit()}else careerPanel('今天還不能進行這次相處。')});

}



function shopPanel(message=''){E.simplifyShop(state);save();let l=state.life;modal(`<div class="eyebrow">創作者商店</div><h2>設備與製作服務</h2><p>現金 ${num(state.money)}  · 每日維護 ${E.goalInfo(state).upkeep}</p><p>買下後需要交付時間；同時可訂購一件。${l.project?'正在交付：'+esc(E.projects.find(p=>p.id===l.project.id).name):''}</p>${message?`<p role="status">${esc(message)}</p>`:''}<div class="career-grid">${E.projects.filter(p=>!p.route||p.route===state.route).map(p=>{let reason=E.projectStatus(state,p).replace('現金與創作專款不足','現金不足');return `<article class="career-card">${SweetArt.icon(p.id,'equipment-art')}<h3>${esc(p.name)}</h3><b>${num(p.cost)} </b><p>${esc(p.desc)}</p><p class="fine">交付 ${p.days} 天 · 每日維護 ${p.upkeep||0}</p><button class="primary" data-buy="${p.id}" ${reason?'disabled':''}>${reason||'購買'}</button></article>`}).join('')}</div>`);content.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{if(E.startProject(state,b.dataset.buy)){save();render();shopPanel('已付款，設備／服務準備交付中。');}});}



function studioPanel(message=''){

 let s=state,c=E.upgradeCareer(s),w=c.production,p=w&&E.shows.find(v=>v.id===w.id),plan=w&&E.showPlan(s),focus=['focus','event','result'].includes(s.stage);

 modal(`<div class="studio-head"><div class="eyebrow">讓設備變成作品，讓人生有自己的節奏</div><h2>節目與生活</h2></div><p role="status">${esc(message)}</p><nav class="career-nav"><button class="quiet" data-life-section="shows">製作節目</button><button class="quiet" data-life-section="life">生活安排</button><button class="quiet" data-life-section="wall">作品牆</button></nav>

 <section id="studio-shows"><h3>我的製作桌</h3><p>準備、排練、播出各占一天，仍有日常故事；生活帳單每 30 天結算。準備與排練另收 120；最多排練兩次。</p>${w?`<div class="outcome"><b>${esc(p.name)}</b> · 合作者：${esc(w.crew?E.crewInfo(s,w.crew).name:'獨立製作')}<label for="show-direction">節目設計（開始準備後固定）</label><select id="show-direction" ${w.prep>0||!focus?'disabled':''}>${E.directions[w.id].map(t=>`<option value="${t.id}" ${plan.id===t.id?'selected':''}>${t.name}</option>`).join('')}</select><p>${esc(plan.desc)}</p><p>準備 ${w.prep}/${plan.need} · 排練 ${w.rehearsal}/2 · 製作累計支出 ${num(w.spent)}</p>${[['prepare','準備內容',w.prep>=plan.need||s.money<120],['rehearse','排練一次',w.prep<plan.need||w.rehearsal>=2||s.money<120],['publish','正式播出',w.prep<plan.need],['cancel','取消企劃（不退款）',false]].map(([id,name,off])=>`<button class="secondary" data-show-work="${id}" ${!focus||off?'disabled':''}>${name}</button>`).join(' ')}</div>`:`<label for="show-crew">這次和誰合作？</label><select id="show-crew"><option value="">獨立製作</option>${['qing','milo','star'].map(id=>{let m=E.crewInfo(s,id);return `<option value="${id}" ${m.trust<40||!m.available?'disabled':''}>${esc(m.name)} · ${m.style} · 擅長${esc(E.contents.find(v=>v.id===m.topic).name)} · ${m.available?'有檔期':'忙碌中'} · 關係 ${m.trust}</option>`}).join('')}</select><p class="fine">關係 40 以上且今天有檔期才能邀約；確認合作後會保留本次製作檔期。排練與專長影響作品評價，結果會改變關係。</p><div class="career-grid">${E.shows.map(p=>{let reason=E.showStatus(s,p.id);return `<article class="career-card illustrated-card">${SweetArt.icon(p.id,'equipment-art')}<h3>${p.name}</h3><p>${p.desc}</p><p>製作費 ${num(p.cost)} · 準備 ${p.need} 天</p><button class="secondary" data-start-show="${p.id}" ${reason?'disabled':''}>${reason||'開始製作'}</button></article>`}).join('')}</div>`}</section>

 <section><h3>聊天室裡的人</h3>${c.viewers.map(v=>`<p><b>${esc(v.name)} · ${esc(v.status)}</b> · 熟悉度 ${v.loyalty}<br>${esc(v.memory)}</p>`).join('')}<p>${c.promise?'已預告：'+esc(E.contents.find(v=>v.id===c.promise.topic).name)+'，期限 '+E.dateLabel(c.promise.due):'可以答應觀眾在兩週內播一場特定內容；兌現或失約都會影響熟客關係。'}</p><select id="promise-topic">${E.contents.filter(v=>!s.flags.includes('agency')||v.id!=='current').map(v=>`<option value="${v.id}">${v.name}</option>`).join('')}</select> <button class="secondary" id="promise-submit" ${!focus||c.promise?'disabled':''}>預告下次節目</button>${c.feedback.map(t=>`<p class="fine">${esc(t)}</p>`).join('')}</section>

 <section id="studio-life"><h3>選擇自己的生活方式</h3><p>目前：${E.workModes.find(m=>m.id===c.mode).name} · ${s.flags.includes('agency')?'團隊所屬':'個人勢'}。調整工作／團隊後需等 30 天才能再調整。</p><div class="career-grid">${E.workModes.map(m=>`<article class="career-card"><h3>${m.name}</h3><p>${m.desc}</p><button class="secondary" data-life-kind="mode" data-value="${m.id}" ${!focus||c.mode===m.id||s.day-c.changed<30||m.id==='semi'&&E.ageNow(s)<50?'disabled':''}>${c.mode===m.id?'目前安排':'改為'+m.name}</button></article>`).join('')}</div><p>企業勢：需 300 追蹤，曝光 +25%，頻道與節目收入分成 25%；時事節目會改為雜談。離開團隊需 3,000 整理費。</p><button class="secondary" data-life-kind="agency" data-value="${s.flags.includes('agency')?'leave':'join'}" ${!focus||s.day-c.changed<30?'disabled':''}>${s.flags.includes('agency')?'離開團隊':'加入團隊'}</button>

 <h3>鏡頭之外</h3><p>住處：${c.home==='quiet'?'安靜的新住處':'原本的生活角落'} · 伴侶關係 ${c.partner}/100 · 家人陪伴 ${c.care}/100</p><p class="fine">25 歲可開始安排伴侶相處；陪伴各占一天，恢復熱情。關係每月自然下降 2；伴侶關係 40 以上每日額外恢復 1 熱情，家人陪伴 40 以上休息額外恢復 1 熱情。搬家支出 8,000，每月住處加費 +750，休息額外恢復 2 體力。</p><button class="secondary" data-life-kind="home" data-value="quiet" ${!focus||c.home==='quiet'?'disabled':''}>搬進安靜住處</button> <button class="secondary" data-life-kind="family" data-value="partner" ${!focus||E.ageNow(s)<25?'disabled':''}>和伴侶相處</button> <button class="secondary" data-life-kind="family" data-value="care" ${!focus?'disabled':''}>陪伴與照顧家人</button><p>投資市值 ${num(E.marketValue(s))} · 可用生活現金 ${num(s.money)} · 每日基本生活費 ${num(E.costs(s))}。半退休仍需負擔生活與設備費，可用配息或自行賣出持倉支持生活。</p></section>

 <section id="studio-wall"><h3>生涯作品牆 · 累計 ${c.totalWorks} 件</h3>${recapPanel()}<p class="fine">保存最近 100 件節目與里程碑。原有存檔從本版本開始累積；完整 JSON 備份包含作品。</p><div class="career-grid">${c.works.map(w=>`<article class="career-card"><span class="eyebrow">${esc(w.kind)} · ${E.dateLabel(w.day)}</span><h3>${esc(w.title)}</h3><p>${esc(w.review)}</p>${w.live?.choices?`<details><summary>現場選擇與結果</summary>${w.live.choices.map(t=>`<p>${esc(t)}</p>`).join('')}</details>`:''}${w.score!==undefined?`<p>評價 ${w.score}/100 · ${esc(w.crew)}<br>節目收入 ${num(w.revenue)} ／ 製作成本 ${num(w.cost)}</p>`:''}</article>`).join('')||'<p>你的下一場作品，會留在這裡。</p>'}</div></section>`);

 let direction=content.querySelector('#show-direction');if(direction)direction.onchange=()=>{if(E.chooseDirection(s,direction.value)){save();render();studioPanel()}};

 content.querySelectorAll('[data-life-section]').forEach(b=>b.onclick=()=>content.querySelector('#studio-'+b.dataset.lifeSection).scrollIntoView({block:'start'}));

 content.querySelectorAll('[data-start-show]').forEach(b=>b.onclick=()=>{if(E.startShow(s,b.dataset.startShow,content.querySelector('#show-crew').value)){save();render();studioPanel('製作已開始。')}else studioPanel('目前條件不足，請確認現金、設備與合作者檔期。')});

 content.querySelectorAll('[data-show-work]').forEach(b=>b.onclick=()=>{if(E.workShow(s,b.dataset.showWork)){if(b.dataset.showWork==='publish'||s.stage==='end'||s.secretEnding){dialog.close();commit();return;}save();render();studioPanel('已更新製作進度。完成今天後，明天才能繼續。')}});

 content.querySelectorAll('[data-life-kind]').forEach(b=>b.onclick=()=>{let ok=E.careerAction(s,b.dataset.lifeKind,b.dataset.value);if(ok){save();render();}studioPanel(ok?'已更新生活安排。':'目前不能更改，請確認年齡、現金、追蹤與 30 天調整間隔。')});

 content.querySelector('#promise-submit').onclick=()=>{if(E.makePromise(s,content.querySelector('#promise-topic').value)){save();render();studioPanel('觀眾記住了你的預告。')}};

}

function jsonDownload(s){let url=URL.createObjectURL(new Blob([JSON.stringify({format:'nextstream-save',edition:'0.35',state:s})],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='主播人生-'+s.day+'天.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}

function slotsPanel(message=''){

 let slots=[];for(let i=1;i<=3;i++){try{let raw=localStorage.getItem(KEY+'-slot-'+i);slots.push(raw?E.parseSave(raw):null)}catch{slots.push(null)}}let current=state||saved;

 modal(`<h2>存檔管理</h2><p>目前自動存檔之外，另有三個手動存檔欄位。JSON 能完整接續人生；文字日記僅供閱讀。</p><p role="status">${esc(message)}</p><div class="career-grid">${slots.map((v,i)=>`<article class="career-card"><h3>欄位 ${i+1}</h3><p>${v?esc(v.name)+' · '+v.day+' 天 · '+v.fans+' 追蹤':'尚無存檔'}</p><button class="secondary" data-slot-save="${i+1}" ${!current?'disabled':''}>${v?'覆寫此欄位':'存入此欄位'}</button> <button class="quiet" data-slot-load="${i+1}" ${!v?'disabled':''}>載入</button></article>`).join('')}</div><button class="primary" id="save-export" ${!current?'disabled':''}>匯出完整 JSON 存檔</button><p>匯入或載入會替換目前自動進度；先存進欄位或下載備份。</p><label for="save-import">匯入 JSON（最大 8 MB）</label><input type="file" id="save-import" accept=".json,application/json"><div id="import-preview"></div>`);

 content.querySelector('#save-export').onclick=()=>jsonDownload(current);

 content.querySelectorAll('[data-slot-save]').forEach(b=>b.onclick=()=>{let i=+b.dataset.slotSave;let write=()=>{try{localStorage.setItem(KEY+'-slot-'+i,JSON.stringify(current));slotsPanel('已存入欄位 '+i)}catch{slotsPanel('瀏覽器空間不足，請改用 JSON 匯出。')}};if(slots[i-1]){b.textContent='再按一次確認覆寫';b.onclick=write;}else write()});

 let load=v=>{state=v;save();dialog.close();render()};

 content.querySelectorAll('[data-slot-load]').forEach(b=>b.onclick=()=>{b.textContent='再按一次載入並替換目前進度';b.onclick=()=>load(structuredClone(slots[+b.dataset.slotLoad-1]))});

 content.querySelector('#save-import').onchange=async e=>{let file=e.target.files[0],el=content.querySelector('#import-preview');if(!file)return;try{if(file.size>8000000)throw Error('檔案超過 8 MB。');let v=E.parseSave(await file.text());el.innerHTML=`<p>${esc(v.name)} · 已走過 ${v.day} 天。確認後替換目前進度。</p><button class="primary" id="import-confirm">確認匯入</button>`;el.querySelector('button').onclick=()=>load(v)}catch(err){el.textContent='無法匯入：'+err.message}};

}



function todayPanel(){return `<section class="dream-dashboard"><div class="dream-heading"><span>☾ 今日夢境手帳</span><strong>${esc(E.channelStyle(state).name)}</strong></div><div class="today-grid">${E.dreamToday(state).map(v=>`<button class="today-item" data-today="${v.target}"><b>${esc(v.title)}</b><span>${esc(v.text)}</span></button>`).join('')}</div><p class="fine">風格會隨開台內容與作品累積變化；每 10 次相關經驗提升一級（最多三級），每級增加 4% 新增追蹤。</p></section>`;}

function recapPanel(){let r=E.dreamRecap(state);return `<details class="dream-recap"><summary>☾ 我的生涯星圖 · ${esc(r.style)}</summary><p>最熟悉的夥伴：${esc(r.friend.name)} · 關係 ${r.friend.trust}</p><p>最近保留作品的節目收入減製作費：${num(r.profit)}（未扣生活費與設備購置）</p>${r.best.map(w=>`<p>✦ ${esc(w.title)} · ${w.score}/100 · ${esc(w.review)}</p>`).join('')||'<p>代表作還在下一場直播裡等你。</p>'}${r.turns.map(t=>`<p>${E.dateLabel(t.day)} · ${esc(t.title)}：${esc(t.choice)}</p>`).join('')}</details>`;}



function livePanel(){let scene=E.liveScene(state),l=state.career.live,w=state.career.production,p=E.shows.find(p=>p.id===w.id);return `<section class="card live-card"><div class="chapter"><i class="live-dot"></i> LIVE · ${esc(p.name)} · ${l.step+1} / 3</div><div class="live-phases">${['開場','節目中','收尾'].map((t,i)=>`<span class="${i===l.step?'current':''}">${i<l.step?'✓ ':''}${t}</span>`).join('')}</div><div class="live-meters"><div>現場氣氛<b>${l.atmosphere}</b></div><div>留存指標<b>${l.retention}</b></div><div>目前體力<b>${num(state.health)}</b></div></div><h2>${esc(scene.title)}</h2><p class="body">${esc(scene.body)}</p><label class="detail-toggle"><input id="live-details" type="checkbox" ${E.storyState(state).details?'checked':''}> 顯示詳細數值</label><div class="options">${scene.options.map((o,i)=>`<button class="option" data-live-choice="${i}"><span class="num">0${i+1}</span><span><strong>${esc(o.label)}</strong><small>${esc(o.hint)}${E.storyState(state).details?`<br>${esc(o.detail)}`:''}</small></span><span class="arrow">→</span></button>`).join('')}</div><p class="fine">熟客、風格與設備影響開場狀態。留存指標用於結算新增追蹤，不代表真實觀眾百分比。三段共用同一天，選擇即存檔；完成後仍須處理今天可能發生的故事。</p>${l.log.length?`<details><summary>今晚已做的選擇</summary>${l.log.map(t=>`<p>${esc(t)}</p>`).join('')}</details>`:''}</section>`;}

function tutorialPanel(){let t=E.tutorial(state);if(!t)return '';return `<section class="tutorial-card"><div class="chapter">新手七日手帳 · ${t.day} / 7</div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p><button class="secondary" data-today="${t.target}">帶我看看</button> <button class="quiet" id="tutorial-skip">我已熟悉，收起引導</button><p class="fine">不限制功能，也不要求照表完成。每天前進後會介紹下一項；第七天後自動收起。</p></section>`;}

function achievementPanel(){let rows=E.achievementRows(state);save();modal(`<div class="studio-head"><div class="eyebrow">每一個小小的開始，都值得留下</div><h2>生涯目標與成就</h2></div><p>已完成 ${rows.filter(r=>r.earned!==undefined).length} / ${rows.length}。成就記錄在這段人生，不額外發放金錢。舊存檔可由仍保留的資料判定，其餘從更新後累積。</p><div class="career-grid">${rows.map(r=>`<article class="career-card achievement ${r.earned!==undefined?'earned':''}">${SweetArt.icon(r.id,'badge-art')}<h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p><div class="meter"><i style="width:${Math.min(100,r.value/r.goal*100)}%"></i></div><p>${r.earned!==undefined?'完成於 '+E.dateLabel(r.earned):`${r.value} / ${r.goal}`}</p></article>`).join('')}</div>`);}



function memoryPanel(){let st=E.storyState(state);return `<section class="memory-list"><h3>那些後來的回信</h3>${st.memories.map(m=>`<article><b>${esc(m.name)} · ${E.dateLabel(m.day)}</b><p>${esc(m.text)}</p></article>`).join('')||'<p>相遇還在慢慢累積。開台與朋友相處，會帶來新的故事。</p>'}<p class="fine">更新後兌現 ${st.kept} 次預告 · 錯過 ${st.missed} 次。回信獨立保留，不會被日常訊息洗掉。</p></section>`;}



function roomArt(prefix='room'){return SweetArt.room(state.life.completed,state.career.home==='quiet',E.projects.filter(p=>state.life.completed.includes(p.id))).replaceAll('sweet-wall',prefix+'-wall').replaceAll('sweet-floor',prefix+'-floor');}

function roomPanel(){modal(`<section class="room-view"><div class="room-heading"><div><div class="eyebrow">A PLACE TO CREATE</div><h2>${esc(state.name)}的直播房間</h2></div><button class="quiet" id="room-theme" aria-pressed="${document.documentElement.dataset.theme==='dark'}">${document.documentElement.dataset.theme==='dark'?'☀ 切換明亮背景':'☾ 切換深色背景'}</button><button class="quiet" id="room-zoom" aria-pressed="false">放大細節</button></div><p class="room-intro">窗外的城市慢下來了，這裡還亮著一盞屬於你的燈。</p><div class="room-picture">${roomArt()}</div><div class="room-caption"><span>粉灰工作室 · 夜景窗邊 · 日常創作</span><span>${state.life.completed.length} 項企劃已完成</span></div><div class="room-inventory">${E.projects.filter(p=>state.life.completed.includes(p.id)).map(p=>`<span>✦ ${esc(p.name)}</span>`).join('')||'<span>起始桌椅、螢幕與電腦已就位。下一件設備，由你慢慢添上。</span>'}</div><p class="fine">設備外觀隨已完成企劃更新。雙耳收音、螢幕、機殼與動捕以簡潔平面插畫呈現；人物為原創示意肖像。</p>${memoryPanel()}</section>`);document.querySelector('#room-theme').onclick=toggleTheme;document.querySelector('#room-zoom').onclick=e=>{let enlarged=document.querySelector('.room-view').classList.toggle('room-large');e.currentTarget.textContent=enlarged?'查看全景':'放大細節';e.currentTarget.setAttribute('aria-pressed',String(enlarged));};}

function keepsakePanel(){let r=E.souvenir(state);modal(`<div class="eyebrow">ONE LIFE · MANY GOOD NIGHTS</div><h2>主播人生紀念卡</h2><p>現在就能留下旅途中的一張，結局時再收藏完整人生。</p><canvas id="life-card" width="1000" height="1320" style="width:100%;max-width:480px;height:auto;display:block;margin:auto" role="img" aria-label="${esc(r.name)}的人生紀念卡"></canvas><button class="primary" id="save-card">下載 PNG 紀念卡</button><p class="fine">卡片只含頻道名稱、生涯摘要與遊戲內故事；完整進度請另外匯出 JSON。</p>`);let canvas=document.querySelector('#life-card'),ctx=canvas.getContext('2d');let g=ctx.createLinearGradient(0,0,1000,1320);g.addColorStop(0,'#ede5fa');g.addColorStop(.5,'#fff3f7');g.addColorStop(1,'#dbeaf3');ctx.fillStyle=g;ctx.fillRect(0,0,1000,1320);ctx.fillStyle='#fffaf1';ctx.beginPath();ctx.roundRect(48,48,904,1224,38);ctx.fill();ctx.strokeStyle='#d1c8d3';ctx.lineWidth=2;ctx.strokeRect(78,78,844,1164);ctx.fillStyle='#a68b9d';ctx.fillRect(110,1080,80,4);let y=115;function line(t,size=25,color='#574866'){ctx.font=`${size>=34?'600 ':''}${size}px "Microsoft JhengHei",sans-serif`;ctx.fillStyle=color;let row='';for(const ch of String(t)){if(ctx.measureText(row+ch).width>780){ctx.fillText(row,110,y);y+=size*1.5;row='';}row+=ch;}ctx.fillText(row,110,y);y+=size*1.5;}line('☾  下一次開台',27,'#9978aa');y+=25;line(r.name,46);line(r.ending+' · '+r.phase,24);y+=25;line(`一起走過 ${r.days} 天 · 最高 ${num(r.peak)} 人追蹤`,28);line('第一次開台：'+(r.first===null?'尚未留下紀錄':E.dateLabel(r.first)),23);y+=22;line('留下的代表作',30,'#a47599');line(r.best,25);y+=22;line('最熟悉的夥伴',30,'#a47599');line(r.friend+' · 關係 '+num(r.friendTrust),25);y+=22;line('一封後來的回信',30,'#a47599');line(r.memories[0]?r.memories[0].name+'：'+r.memories[0].text:'回信還在路上。曾經按下開台，就是故事的開始。',24);y+=22;line('還留在心裡的約定',30,'#a47599');line(r.pending.length?r.pending.slice(0,2).join('、')+(r.pending.length>2?'等 '+r.pending.length+' 個約定':''):'沒有待續的回信或預告。把晚安留給下一次相遇。',24);line(`更新後兌現 ${r.kept} 次預告 · 錯過 ${r.missed} 次`,21);ctx.font='22px "Microsoft JhengHei",sans-serif';ctx.fillStyle='#9a81a5';ctx.fillText('每一個被看見的名字背後，都有一段生活。',110,1215);document.querySelector('#save-card').onclick=()=>canvas.toBlob(blob=>{if(!blob){toast('圖片產生失敗，請再試一次。');return;}let url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='主播人生紀念卡.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已產生 PNG 紀念卡。');},'image/png');}



function programmePanel(topic){let c=E.contents.find(c=>c.id===topic),j=E.journeyInfo(state);if(state.flags.includes('agency')&&topic==='current'){topic='chat';c=E.contents.find(c=>c.id===topic);}modal(`<div class="eyebrow">今天的節目做法</div><h2>${esc(c.name)}</h2><p>嗓子負荷 ${j.voice}/100 · 隱私壓力 ${j.privacy}/100<br>休息能降低負荷；換題材或安排其他生活能中斷重複題材。</p><div class="options">${E.programmeOptions(state,topic).map(p=>`<button class="option" data-programme="${p.id}" ${p.locked?'disabled':''}><span><strong>${esc(p.name)}</strong><small>${esc(p.desc)}${p.locked?'<br>需完成：'+esc(p.locked):p.gear.length?'<br>設備已解鎖':''}${p.warning?'<br>'+esc(p.warning):''}</small></span><span class="arrow">→</span></button>`).join('')}</div><p class="fine">確認後才消耗今天的安排。此處的嗓子與隱私壓力為遊戲指標；設備正式企劃仍可在「節目與生活」準備、排練與播出。</p>`);content.querySelectorAll('[data-programme]').forEach(b=>b.onclick=()=>{if(E.selectContent(state,topic,b.dataset.programme)){dialog.close();commit();}});}

function journeyPanel(){let j=E.journeyInfo(state);return `<section class="journey-strip"><div><b>${j.next?'第一個月 · 下一個轉折':'我的開台節奏'}</b><p>${j.next?'第 '+j.next.day+' 天起：'+esc(j.next.title):'內容取向由每次開台慢慢累積。'} · 嗓子負荷 ${j.voice}/100 · 隱私壓力 ${j.privacy}/100</p></div>${j.last?`<div><b>最近一場：${esc(j.last.title)}</b><p>${esc(j.last.text)} 節目做法額外帶來 ${j.last.gain} 人追蹤。</p></div>`:''}${j.chat.length?`<div class="remembered-chat"><b>熟悉的聊天室</b>${j.chat.map(m=>`<p><strong>${esc(m.name)}</strong>　${esc(m.text)}</p>`).join('')}</div>`:''}<details><summary>節目經驗、設備玩法與相處記憶</summary><div class="journey-columns"><div><h3>做過的內容</h3>${E.contents.map(c=>`<p>${esc(c.name)} · ${j.counts[c.id]||0} 場</p>`).join('')}<p class="fine">從本版開始記錄，不回推舊紀錄。</p></div><div><h3>設備開啟的新做法</h3>${j.unlocks.map(p=>`<p>${p.available?'已解鎖':'尚未解鎖'} · ${esc(p.name)}<br><small>${esc(p.gear.map(id=>E.projects.find(p=>p.id===id).name).join('、'))}</small></p>`).join('')}</div><div><h3>他們記得的事</h3>${j.memories.slice(0,8).map(m=>`<p><b>${esc(m.name)}</b> · ${esc(E.dateLabel(m.day))}<br>${esc(m.text)}</p>`).join('')||'<p>開台、聯絡朋友與完成約定，都會留下記憶。</p>'}</div></div></details></section>`;}



let clockRunning=false,clockDays=7,fastMode=false,clockReason='設定方針後，開始人生。';

function stopLife(reason='時間已暫停'){clockRunning=false;clockReason=reason;}

function workPolicyEffect(){

 const work=E.actions.find(action=>action.id==='work');

 const lower=Math.round((1-E.partTimeStreamIncome)*100);

 const mode=state.career.mode;

 return mode==='salary'

  ?`狀態偏低時優先休息。廣告分成與斗內金額基準少 ${lower}%。`

  :mode==='full'

   ?'以直播為主，不排兼職。一般開台廣告分成 +15%、新增訂閱 +25%。'

   :mode==='semi'?'開台收益與新增訂閱較低，依生活方針安排兼職。':`兼職每班 ${num(work.money)}。一般開台廣告分成 +15%、新增訂閱 +25%。`;

}

function showActiveBonuses(){

 const s=state, plan=E.lifePlan(s), life=E.upgradeLife(s), career=s.career;

 const zodiac=E.zodiacProfile(s), style=E.channelStyle(s), management=E.managementState(s);

 const topics=ids=>E.contents.filter(c=>ids.includes(c.id)).map(c=>c.name).join('、');

 const percent=value=>Math.round(value*1000)/10+'%';

 const signed=value=>(value>0?'+':'')+Math.round(value*100)/100;

 const rows=[

  ['生活重心',E.lifePolicies.find(p=>p.id===plan.pace)?.desc||''],

  ['工作安排',workPolicyEffect()],

  [s.trait[0],{bond:'開台時熱情 +1。',skill:'練習時心情 +1。',reach:'開台基礎新增訂閱 +15%。'}[s.trait[2]]||s.trait[1]],

  ['經營方向',{community:'開台時熱情 +1。',craft:'開台心情 +2、體力 −1。',business:'開台廣告分成 +12%、熱情 −1、體力 −1。'}[management.focus]],

 ];

 if(zodiac)rows.push([zodiac.name,zodiac.description+' 擅長 '+topics(zodiac.topics)+'，新增訂閱 +18%、廣告分成 +12%，相關機率選項成功率 +10 個百分點。'+(zodiac.action==='rest'?' 休息額外恢復 1 點心情。':'')]);

 if(style.level)rows.push([style.name,'一般開台新增訂閱加成 +'+percent(style.level*.04)+'。']);

 if(s.flags.includes('agency'))rows.push(['團隊合作','一般開台基礎新增訂閱 +25%，廣告分成扣除團隊抽成 25%。']);

 if(career.partner>=40)rows.push(['伴侶陪伴','每次日常安排額外恢復 1 熱情。']);

 if(career.care>=40)rows.push(['家人支持','休息額外恢復 1 熱情。']);

 if(career.home==='quiet')rows.push(['安靜住處','休息額外恢復 2 體力。']);

 if(life.transition>0)rows.push(['轉型緩衝','降低轉換直播主題時的訂閱流失。']);

 const trend=s.market.daily;

 if(trend?.day===s.day&&trend.boost)rows.push(['今日話題','播 '+topics([trend.topic])+' 時，廣告與新增訂閱 '+signed(trend.boost*100)+'%。']);

 if(management.contract)rows.push(['合作長約','一般開台額外消耗 2 體力。']);

 for(const effect of s.dream?.effects||[]){

  if(effect.until>s.day)rows.push([effect.name,`剩 ${effect.until-s.day} 天。廣告分成 ${signed((effect.income||0)*100)}%、新增訂閱 ${signed((effect.gain||0)*100)}%。`]);

 }

 const donation=E.donationInfo(s);

 if(donation.festival)rows.push([donation.festival,'今天開台有節慶斗內加成。']);

 const equipment=E.projects.filter(p=>life.completed.includes(p.id)).map(p=>[p.name,productEffects(p)]);

 const list=items=>`<dl class="active-bonuses">${items.filter(([,description])=>description).map(([label,description])=>`<div><dt>${esc(label)}</dt><dd>${esc(description)}</dd></div>`).join('')}</dl>`;

 modal(`<h2>目前加成與效果</h2>${list(rows)}<h3>已啟用設備</h3>${equipment.length?list(equipment):'<p>目前還沒有啟用設備。</p>'}`);

}

function showFastSettings(){

 const selected=new Set(state.fastStops??['rare','epic','legendary','fixed','product','hidden']);

 modal(`<h2>快速模式停留設定</h2><p>勾選要自己決定的事件。其餘事件會隨機選擇可執行的選項。</p><div class="fast-options">${E.fastStopOptions().map(({id,name})=>`<label><input type="checkbox" value="${id}" ${selected.has(id)?'checked':''}> ${name}</label>`).join('')}</div><button class="primary" id="save-fast-settings">儲存設定</button>`);

 content.querySelector('#save-fast-settings').onclick=()=>{


  state.fastStops=[...content.querySelectorAll('.fast-options input:checked')].map(input=>input.value);

  save();dialog.close();render();

 };

}

function planControls(){

 const p=E.lifePlan(state);

 const bonus=E.lifePolicyEffect(state);

 const streamBonus=bonus.ads?`廣告 +${Math.round((bonus.ads-1)*100)}% · 新增訂閱 +${Math.round((bonus.subscribers-1)*100)}%`:'';

 const weeklyEffect=[['health','體力'],['wellbeingMood','心情'],['physical','健康'],['joy','熱情']]

  .filter(([key])=>bonus.weekly?.[key]).map(([key,label])=>`${label} ${bonus.weekly[key]>0?'+':''}${bonus.weekly[key]}`).join(' · ');

 const workEffect=workPolicyEffect();

 const topicEffect=p.topic==='mixed'?'每天開台時隨機挑選主題。':'開台採用這個主題，影響事件與適用的設備。';

 const schedule=E.estimateWeeklySchedule(state);
 const scheduleText=`接下來 7 天預估 · 開播 ${schedule.live} 天 · 工作 ${schedule.work} 天 · 休息 ${schedule.rest} 天 · 準備 ${schedule.learn} 天`;
 return `<section class="life-controls"><div class="control-title"><b>生活方針</b><span>${clockRunning?'時間流逝中':esc(clockReason)}</span></div><div class="policy-fields"><label>直播主題<select id="policy-topic" ${state.stage==='end'?'disabled':''}>${[{id:'mixed',name:'綜合'},...E.contents].map(c=>`<option value="${c.id}" ${c.id===p.topic?'selected':''}>${esc(c.name)}</option>`).join('')}</select><small>${esc(topicEffect)}</small></label><label>生活重心<select id="policy-pace">${E.lifePolicies.map(v=>`<option value="${v.id}" ${v.id===p.pace?'selected':''}>${v.name}</option>`).join('')}</select><small>${weeklyEffect?'每週固定 · '+esc(weeklyEffect):'依每週日常結算'}${streamBonus?'<br>'+streamBonus:''}</small></label><label>工作安排<select id="policy-work" ${state.stage==='end'?'disabled':''}><option value="part" ${!['full','salary'].includes(state.career.mode)?'selected':''}>全職直播＋兼職工作</option><option value="salary" ${state.career.mode==='salary'?'selected':''}>正職工作＋兼職直播</option><option value="full" ${state.career.mode==='full'?'selected':''}>全職直播</option></select><small class="weekly-schedule">${scheduleText}。實際行程會隨事件與狀態變動。<br>${esc(workEffect)}</small></label><label>每次前進<select id="policy-speed">${[7,14,21,30].map(v=>`<option value="${v}" ${!fastMode&&clockDays===v?'selected':''}>${v} 天</option>`).join('')}<option value="fast" ${fastMode?'selected':''}>快速模式 · 30 天</option></select><small>快速模式自動選擇未勾選的事件。</small></label></div><div class="clock-actions"><button class="primary" id="life-clock" ${['event','broadcast','end'].includes(state.stage)?'disabled':''}>${clockRunning?'暫停時間':'繼續人生 ▶'}</button><button class="quiet" id="fast-settings">快速模式設定</button><button class="quiet" id="personal-dates">生日與初配信設定</button></div></section>`;

}

const endingArtTitles=["把麥克風收進抽屜", "聊天室的最後一盞燈", "一段留給自己的日子", "這次先不加播", "窗外的早晨", "沒有下一次預告", "仍然走過的路", "學會慢下來", "尋回自己的聲音", "百萬人的晚安", "謝幕前的最後一舞", "被很多人記住的頻道", "把長夜留在錄音裡", "把頻道做成一座遊樂場", "每封回信都留了下來", "留下一座作品室", "有人一起走的路", "有餘裕的下一章", "把生活也過好了", "平凡而完整的晚安", "五週年後｜把晚安說給彼此", "五週年後｜一起過平凡的日子", "只播給還醒著的人", "今晚也有人等你說晚安", "二十週年｜只留給彼此的婚禮", "20＋5｜五週年快樂", "你不行與愛姆｜白頭偕老"];
function endingIndex(title){return endingArtTitles.indexOf(title.replace(/^退休 · /,''));}
function endingIllustration(title){
 const index=endingIndex(title);
 return index<0?'':`<figure class="ending-illustration"><img src="ending-${index+1}.webp" alt="${esc(title)}的結局插畫" width="400" height="220"></figure>`;
}
function renderSecretEnding(){
 const ending=E.secretEndingFor(state);
 stopLife('隱藏結局');
 app.innerHTML=`<section class="card secret-ending" data-ending-score="${endingIndex(ending.title)}" id="story-panel" tabindex="-1"><h1>${esc(ending.title)}</h1>
 ${endingIllustration(ending.title)}<div class="secret-ending-lines">${ending.lines.map((line,i)=>`<p style="--line-delay:${i*.8}s">${esc(line)}</p>`).join('')}</div>
 <button class="primary" data-ending-continue="yes">繼續遊戲</button>
 <button class="secondary" data-ending-continue="no">結束這局</button></section>`;
 app.querySelectorAll('[data-ending-continue]').forEach(button=>button.onclick=()=>{
  const continuing=button.dataset.endingContinue==='yes';
  const showIntro=continuing&&state.day===0&&state.stage==='focus'&&['anniversary','wedding'].includes(state.secretEnding);
  E.resolveSecretEnding(state,continuing);
  save();render();
  if(showIntro)intro();
 });
}
function recentStory(){
 const rows=state.history.slice(-6).reverse();
 return `<section class="card story-log"><h2>生涯紀錄</h2>${rows.length?`<ol>${rows.map(row=>`<li><time>第 ${(row.day??0)+1} 天</time><div><b>${esc(row.title)}</b>${row.text?`<p>${esc(row.text)}</p>`:''}</div></li>`).join('')}</ol>`:'<p>開始生涯後，開台和事件會記在這裡。</p>'}</section>`;
}
function render(){

 if(!state){stopLife();return landing();}
 document.querySelector('#return-home').hidden=false;
 if(E.secretEndings[state.secretEnding])return renderSecretEnding();

 E.simplifyShop(state);

 if(E.checkExhaustion(state))stopLife(state.stage==='event'?E.eventPauseReason(state):state.summary?.title||'人生已結束');
 if(E.secretEndings[state.secretEnding])return renderSecretEnding();

 updateStatChanges();

 const date=state.personalCalendar?E.realDay(state):'尚未設定日曆';

 const topic=E.contents.find(c=>c.id===E.lifePlan(state).topic)?.name||'綜合';

 const zodiac=E.zodiacProfile(state);

 const anniversary=E.anniversaryProgress(state);

 const estimate=E.estimateChannelIncome(state);

 const decision=['event','broadcast','end'].includes(state.stage);

 app.innerHTML=`<section class="life-top"><div><div class="eyebrow">${esc(date)} · 生涯第 ${state.day+1} 天</div><h1>${esc(state.name)}</h1><p>${E.ageNow(state)} 歲 · ${esc(state.route)}</p></div></section>

 <nav class="life-records" aria-label="生涯工具"><button class="quiet" id="event-odds">事件機率</button><button class="quiet" id="event-counts">抽中紀錄</button><button class="quiet" id="product-shop">商品商店</button><button class="quiet" id="purchased-products">已購商品</button><button class="quiet" id="active-bonuses">目前加成</button><button class="quiet" id="journal">生涯日記</button><button class="quiet" id="life-more">成就、紀念與存檔</button></nav>
 ${planControls()}

 <div class="simple-life">

 <section class="card character-status"><h2>角色狀態</h2><p>主要內容 · ${esc(topic)}</p>${zodiac?`<p class="fine"><b>${esc(zodiac.name)} · ${esc(zodiac.personality)}</b><br>${esc(zodiac.description)}<br>擅長 ${E.contents.filter(c=>zodiac.topics.includes(c.id)).map(c=>esc(c.name)).join('、')} · 新增追蹤 +18%、直播收入 +12%<br>對應主題的機率選項成功率 +10 個百分點${zodiac.action==='rest'?' · 休息時心情額外 +1':''}</p>`:''} ${liveStats()}${monthlyBudget()}${subscriptionDetails()}${expenseDetails()}</section>

 <section class="studio-column">

 <button class="card main-room" id="main-room" aria-label="放大直播房間"><span class="room-label">我的直播房間 <small>放大 ↗</small></span><span class="embedded-room">${roomArt('main-room')}</span></button>

 <section class="card anniversary-progress"><h2>20＋5 · 夢寐愛姆五週年</h2><p>${anniversary.complete?`第五盞夢燈已點亮 · 傳說 ${anniversary.count} ／ ${anniversary.total}`:`傳說 ${anniversary.count} ／ ${anniversary.total} · 夢燈 ${Math.min(anniversary.count,anniversary.required)} ／ ${anniversary.required} · 生涯 ${Math.min(anniversary.years,anniversary.yearsRequired)} ／ ${anniversary.yearsRequired} 年`}</p><progress aria-label="夢燈解鎖進度" value="${Math.min(anniversary.count,anniversary.required)}" max="${anniversary.required}"></progress></section>

 <section class="card channel-income"><h2>頻道收入</h2><p class="fine">上次開台實收</p><dl><div><dt>廣告分成</dt><dd>${num(state.lastChannelIncome?.platform||0)}</dd></div><div><dt>斗內分成</dt><dd>${num(state.lastChannelIncome?.donation||0)}</dd></div></dl><p class="fine">一般開台預估實收</p><dl><div><dt>廣告分成基準</dt><dd>${num(estimate.platform)}</dd></div><div><dt>平均斗內</dt><dd>${num(estimate.donation)}</dd></div><div><dt>預估合計</dt><dd>${num(estimate.total)}</dd></div></dl><p class="fine">以今天的頻道狀況估算。設備與其他臨時加成另計，當場可能沒有斗內。</p></section>

 </section>

 <section id="story-panel" tabindex="-1">${state.stage==='event'&&state.weeklyDraw?.id===state.eventId&&!state.calendarPending&&state.eventId!=='cash_lifeline'?`<span class="event-tier" data-tier="${state.weeklyDraw.tier}">${E.weeklyTiers.find(t=>t.id===state.weeklyDraw.tier)?.name||''}事件</span>`:''}${decision?panel():`<section class="card"><h2>日常生活</h2><p>${esc(state.stage==='result'&&!state.lastChoiceResult?state.lastResult:'時間前進後，事件會出現在這裡。')}</p></section>`}${state.lastChoiceResult?.day===state.day&&['result','end'].includes(state.stage)?choiceResultPanel():''}${dailyResultPanel()}${weeklyResultPanel()}${recentStory()}</section>

 </div>

`;

 app.querySelector('#subscription-history').onclick=()=>modal(`<h2>訂閱明細</h2><section class="expense-details cash-history">${cashRows(subscriptionRows())}</section>`);

 app.querySelectorAll('[data-stat-history]').forEach(button=>button.onclick=()=>showStatHistory(button.dataset.statHistory));

 app.querySelector('#cash-history').onclick=()=>modal(`<h2>收支明細</h2><section class="expense-details cash-history">${cashRows(cashEntries())}</section>`);

 app.querySelector('#event-odds').onclick=showEventOdds;

 app.querySelector('#event-counts').onclick=showEventCounts;

 app.querySelector('#product-shop').onclick=showProductShop;

 app.querySelector('#purchased-products').onclick=showPurchasedProducts;

 app.querySelector('#active-bonuses').onclick=showActiveBonuses;

 const continueButton=app.querySelector('#continue-after-choice');

 if(continueButton)continueButton.onclick=()=>app.querySelector('#life-clock').click();

 app.querySelector('#journal').onclick=journal;

 app.querySelector('#life-more').onclick=morePanel;

 app.querySelector('#personal-dates').onclick=datesPanel;

 app.querySelector('#fast-settings').onclick=showFastSettings;

 app.querySelector('#policy-topic').onchange=e=>{E.setLifePlan(state,{...E.lifePlan(state),topic:e.target.value,secondary:''});save();render();};

 app.querySelector('#policy-pace').onchange=e=>{E.setLifePlan(state,{...E.lifePlan(state),pace:e.target.value});save();render();};

 app.querySelector('#policy-work').onchange=e=>{if(E.setWorkMode(state,e.target.value)){save();render();}};

 app.querySelector('#main-room').onclick=roomPanel;

 app.querySelector('#policy-speed').onchange=e=>{

  fastMode=e.target.value==='fast';

  clockDays=fastMode?30:Number(e.target.value);

 };

 app.querySelector('#life-clock').onclick=()=>{if(clockRunning)stopLife();else if(!state.personalCalendar){datesPanel();return;}else{clockRunning=true;clockReason='時間流逝中';}render();};

 app.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{

  const openingInvite=state.eventId==='secret_anniversary_invite';
  if(E.choose(state,Number(b.dataset.choice))){

   stopLife('選項已結算');commit();
   if(openingInvite&&!state.secretEnding)intro();

  }else toast('目前無法執行這個選項。');

 });

 app.querySelectorAll('[data-live-choice]').forEach(b=>b.onclick=()=>{if(E.chooseLive(state,Number(b.dataset.liveChoice))){clockRunning=['result','focus'].includes(state.stage);clockLast=Date.now();commit();}});

 const details=app.querySelector('#live-details');if(details)details.onchange=()=>{E.storyState(state).details=details.checked;save();render();};

 const ex=app.querySelector('#export');if(ex)ex.onclick=download;

 const nl=app.querySelector('#new-life');if(nl)nl.onclick=()=>{state=null;stopLife();landing();};

}



function morePanel(){modal(`<h2>成就、紀念與存檔</h2><div class="more-menu">${[['goals','生涯目標'],['card','人生紀念卡'],['save','存檔管理']].map(([id,n])=>`<button class="secondary" data-more="${id}">${n}</button>`).join('')}</div>`);let handlers={relationships:careerPanel,production:studioPanel,room:roomPanel,goals:achievementPanel,card:keepsakePanel,save:slotsPanel,retire:retirePanel};content.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>handlers[b.dataset.more]());}

function datesPanel(){let c=state.personalCalendar||{birthday:'2000-06-21',debut:'2026-11-08'};modal(`<h2>生日與初配信</h2><p>每年生日、初配信週年與固定節日會停下來，讓你安排怎麼度過。生日的月日也會決定角色星座與性格效果。角色年齡沿用人生設定。</p><label for="date-birth">角色生日</label><input type="date" id="date-birth" value="${esc(c.birthday)}"><label for="date-debut">初配信日期</label><input type="date" id="date-debut" value="${esc(c.debut)}"><p class="fine">修改後以目前生涯日重新對應初配信日期，已發生的故事保留。西曆節日依日期觸發；市場與角色年齡仍沿用每年 360 天的遊戲規則。</p><button class="primary" id="save-dates">儲存日期</button><p role="status" id="dates-message"></p>`);content.querySelector('#save-dates').onclick=()=>{if(E.setDates(state,content.querySelector('#date-birth').value,content.querySelector('#date-debut').value)){stopLife('日期已更新，準備好後繼續。');dialog.close();save();render();}else content.querySelector('#dates-message').textContent='請輸入有效日期。';};}

let clockLast=0;setInterval(()=>{if(!clockRunning||!state||dialog.open||document.hidden||Date.now()-clockLast<(fastMode?400:1500))return;clockLast=Date.now();try{let result=fastMode?E.fastLifeBatch(state,clockDays,state.fastStops??['rare','epic','legendary','fixed','product','hidden']):E.autoLifeBatch(state,clockDays);if(result.paused)stopLife(result.reason);save();render();}catch(e){stopLife('時間暫停，請保留存檔。');render();console.error(e);}},200);



function memberPanel(){let m=E.membershipInfo(state);return `<section class="card"><h3>頻道會員</h3>${m.unlocked?`<p><b>${m.count} 位會員</b> · 預估每期 ${num(m.monthly)} </p><p class="fine">會員至少為目前追蹤數的 1%；超出的會員繼續保留。每位每 30 天實收 ${num(m.netPay)}，累計收到 ${num(m.total)}。下次結算：生涯第 ${m.due+1} 天。開台與會員事件可增加會員。</p>`:`<p>追蹤達 <b>1,000</b> 後開放</p><p class="fine">目前 ${num(state.fans)}／1,000。會員獨立於熟客，不使用好感度或熟客人數換算。</p>`}</section>`;}





let displayedStats=null,statDelta=null;

function updateStatChanges(){let keys=['money','fans','wellbeingMood','health','physical','joy'],current=Object.fromEntries(keys.map(k=>[k,statNumber(k)]));if(displayedStats?.seed===state.seed){let differences=Object.fromEntries(keys.map(k=>[k,Math.round(current[k])-Math.round(displayedStats.values[k])]));if(Object.values(differences).some(v=>v!==0))statDelta=differences;}else statDelta=null;displayedStats={seed:state.seed,values:current};}

function liveStats(){return `<section class="life-stats" aria-label="角色數值與本次增減">${[['money','現金'],['fans','訂閱數'],['wellbeingMood','心情'],['health','體力'],['physical','健康'],['joy','熱情']].map(([key,label])=>{let value=statNumber(key).toLocaleString('zh-TW',{maximumFractionDigits:0}),d=statDelta?.[key],delta=d===undefined?'':`${d>0?'+':''}${d.toLocaleString('zh-TW',{maximumFractionDigits:0})}`;return `<div>${['money','fans'].includes(key)?`<span>${label}</span>`:`<button type="button" class="stat-history-button" data-stat-history="${key}">${label} ↗</button>`}<div class="stat-value"><b>${value}${['health','joy','skill','bond','wellbeingMood','physical'].includes(key)?'<small> / 100</small>':''}</b>${delta?`<span class="stat-delta ${d>0?'gain':d<0?'loss':'flat'}" aria-label="本次變化 ${delta}">${delta}</span>`:''}</div>${['money','fans'].includes(key)?'':`<meter class="status-meter" min="0" max="100" value="${statNumber(key)}" aria-label="${label}"></meter>`}</div>`}).join('')}<p class="delta-note">數字旁為最近一次前進或操作的實際淨變化，包含收入、支出與事件效果。</p></section>`;}



let shownDecision='';

function decisionKey(){return state&&['event','broadcast'].includes(state.stage)?[state.seed,state.day,state.stage,state.eventId,state.career.live?.step||0].join(':'):'';}

function maybeShowDecision(){let key=decisionKey();if(key&&key!==shownDecision&&!dialog.open)showDecision();}

function showDecision(){if(!decisionKey())return;shownDecision=decisionKey();modal(`<div class="decision-modal"><div class="decision-heading"><b>${state.stage==='broadcast'?'直播現場':'人生的轉折'}</b><button class="quiet" id="hide-decision">先收起</button></div>${panel()}</div>`);content.querySelector('#hide-decision').onclick=()=>dialog.close();content.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(E.choose(state,Number(b.dataset.choice))){dialog.close();stopLife('選項已結算');commit();}else toast('目前無法執行這個選項，可以選擇維持現況。');});content.querySelectorAll('[data-live-choice]').forEach(b=>b.onclick=()=>{if(E.chooseLive(state,Number(b.dataset.liveChoice))){dialog.close();if(['result','focus'].includes(state.stage)){clockRunning=true;clockLast=Date.now();}commit();}});let details=content.querySelector('#live-details');if(details)details.onchange=()=>{E.storyState(state).details=details.checked;save();showDecision();};}

function holdingsPanel(){let rows=E.assets.filter(a=>state.market.positions[a.id].qty>0);return `<section class="card main-holdings"><h3>我的股票</h3>${rows.length?`<div class="holdings-list">${rows.map(a=>{let p=state.market.positions[a.id],price=state.market.prices[a.id],value=price*p.qty,profit=value-p.cost,daily=(price-state.market.previous[a.id])*p.qty;return `<article><b>${esc(a.name)}</b><span>${p.qty} 單位 · 現價 ${moneyText(price)}</span><strong>市值 ${moneyText(value)}</strong><span class="${profit>=0?'gain':'loss'}">持倉損益 ${profit>=0?'+':''}${moneyText(profit)}</span><small>今日價格變動 ${daily>=0?'+':''}${moneyText(daily)}</small></article>`}).join('')}</div>`:'<p class="fine">目前沒有持股。買入後會在這裡顯示市值與損益，隨每日行情更新。</p>'}<p class="fine">持倉損益含買入成本，未扣未來賣出費；今日價格變動以目前持股數量估算，不是今日交易收益。</p></section>`;}

function careerPanel(message=''){let m=E.managementState(state),l=E.upgradeLife(state);modal(`<div class="eyebrow">經營你的創作生活</div><h2>人生與關係</h2><p>選擇長期經營方向，再透過相處累積信任。方針隨時可調整，效果從下一場一般開台開始。</p><div class="management-options">${[['community','社群與陪伴','每場熱情 +1。'],['craft','作品與技術','每場心情 +2，體力 −1。'],['business','商業合作','一般開台收入 +12%，熱情 −1、體力 −1。']].map(([id,n,d])=>`<button class="option ${m.focus===id?'selected-management':''}" data-manage="${id}" aria-pressed="${m.focus===id}"><span><strong>${n}</strong><small>${d}</small></span></button>`).join('')}</div>${message?`<p role="status">${esc(message)}</p>`:''}<h3>長期關係</h3><p class="fine">相處需要一天；有事件時可先排隊。信任 40 解鎖聯動，60 提高正式合作默契；60 天未聯絡後會慢慢疏遠。</p><div class="career-grid">${l.contacts.map(c=>`<article class="career-card"><div class="contact-portrait">${SweetArt.portrait(c.name)}</div><h3>${esc(c.name)} · ${esc(c.role)}</h3><p>信任 ${c.trust}/100 · ${c.trust>=60?'默契夥伴':c.trust>=40?'可以聯動':'慢慢認識'}</p><div class="meter"><i style="width:${c.trust}%"></i></div><p>${esc(c.memory)}</p><div class="career-buttons">${[['talk','聊近況 · 80'],['help','幫助創作 · 280'],...(c.role==='熟客'?[]:[['collab','小型聯動 · 580']])].map(([id,n])=>`<button class="secondary" data-contact="${c.id}" data-contact-action="${id}" ${state.stage==='end'||id==='collab'&&c.trust<40?'disabled':''}>${n}</button>`).join('')}</div></article>`).join('')}</div><h3>熟客關係</h3>${state.career.viewers.map(v=>`<p><b>${esc(v.name)}</b> · 好感 ${v.loyalty}/100 · ${esc(v.status)}<br>${esc(v.memory)}</p>`).join('')}<h3>合作責任</h3>${m.contract?`<p>長約交付：${(state.tally.live||0)-m.contract.started}/10 場，剩 ${Math.max(0,m.contract.due-state.day)} 天。未達成需付 18,000。</p>`:'<p>目前沒有密集長約。</p>'}<details><summary>生活轉折紀錄</summary>${m.riskLog.map(r=>`<p>第 ${r.day+1} 天 · ${esc(r.title)}${r.loss?' · 損失 '+num(r.loss):''}</p>`).join('')||'還沒有罕見轉折。'}</details>`);content.querySelectorAll('[data-manage]').forEach(b=>b.onclick=()=>{if(E.setManagement(state,b.dataset.manage)){save();render();careerPanel('經營方向已更新。');}});content.querySelectorAll('[data-contact]').forEach(b=>b.onclick=()=>{let ok=E.social(state,b.dataset.contact,b.dataset.contactAction);if(ok){save();render();}careerPanel(ok?'已安排相處；若有待選事件會排在之後。':'目前無法安排，請確認資金、信任與排程。');});}



function statNumber(k){return k==='subscribers'?E.membershipInfo(state).count:k==='wellbeingMood'?E.livingState(state).mood:k==='physical'?E.livingState(state).physical:state[k];}

function livingSummary(){let l=E.livingInfo(state);return `<section class="card"><h3>基本支出</h3><p><b>${num(l.monthly)} ／30 天</b></p><p class="fine">下次：生涯第 ${l.nextBill+1} 天（剩 ${Math.max(0,l.nextBill-state.day)} 天）</p><div class="expense-summary">${l.rows.map(c=>`<span>${c.name} ${num(c.cost)}</span>`).join('')}</div>${l.extra?`<p class="fine">安靜住處加費 ${l.extra}</p>`:''}<p class="fine">基本生活費集中按月扣款；設備維護、交易費及臨時支出另計。</p></section>`;}

function livingPanel(message=''){let l=E.livingInfo(state),auto=E.careAutomation(state);modal(`<div class="eyebrow">食衣住行育樂</div><h2>生活預算與照顧</h2><p>心情 ${Math.round(l.mood)}/100 · 健康 ${Math.round(l.physical)}/100 · 現金 ${num(state.money)}</p><p>預計每月固定支出 <b>${num(l.monthly)}</b>，生涯第 ${l.nextBill+1} 天扣款。調整預算會影響下一張帳單，並逐日影響生活狀態。</p>${message?`<p role="status">${esc(message)}</p>`:''}<div class="living-budget">${l.rows.map(c=>`<label>${c.name}<select data-budget="${c.id}" ${state.stage==='end'?'disabled':''}>${c.labels.map((n,i)=>`<option value="${i}" ${i===c.level?'selected':''}>${n} · 約 ${num(c.prices[i])}/月</option>`).join('')}</select></label>`).join('')}</div><p class="fine">飲食與交通預算影響健康，住處、衣著與娛樂影響心情，教育預算每週累積實力。價格隨生涯年資緩慢變動，總額以本頁預計帳單為準；無法付款時會形成原有欠款並影響心情。心情／健康低於 25，會逐日影響創作熱情／體力。</p><h3>額外的照顧安排</h3><p>每項可設定每 7／14／30 天自動安排。不占用創作日；自動花費會先保留下一期生活費與貸款還款，現金不足時略過並記錄。手動安排仍需間隔 7 天。</p><div class="career-grid">${E.lifeServices.map(p=>{let cfg=auto[p.id]||{on:false,every:7,due:state.day+7},used=l.services[p.id],wait=used===undefined?0:Math.max(0,7-state.day+used);return `<article class="career-card"><h3>${p.name}</h3><b>${num(p.cost)} </b><p>心情 +${p.mood} · 健康 +${p.physical}</p><button class="secondary" data-care="${p.id}" ${state.stage==='end'||wait||state.money<p.cost?'disabled':''}>${wait?'還需 '+wait+' 天':'安排'}</button><label class="auto-care-toggle"><input type="checkbox" data-auto-care="${p.id}" ${cfg.on?'checked':''} ${state.stage==='end'?'disabled':''}>定期自動安排</label><label>安排間隔<select data-care-period="${p.id}">${[7,14,30].map(n=>`<option value="${n}" ${n===cfg.every?'selected':''}>每 ${n} 天</option>`).join('')}</select></label>${cfg.on?`<p class="fine">下次：生涯第 ${cfg.due+1} 天</p>`:''}</article>`}).join('')}</div>${l.lastBill?`<details><summary>最近帳單：${num(l.lastBill.total)}</summary>${l.lastBill.rows.map(r=>`<p>${r.name} ${num(r.cost)}</p>`).join('')}</details>`:''}`);for(let selector of ['[data-auto-care]','[data-care-period]'])content.querySelectorAll(selector).forEach(b=>b.onchange=()=>{let id=b.dataset.autoCare||b.dataset.carePeriod;E.setAutoCare(state,id,content.querySelector('[data-auto-care="'+id+'"]').checked,Number(content.querySelector('[data-care-period="'+id+'"]').value));save();render();livingPanel('定期照顧設定已儲存。');});content.querySelectorAll('[data-budget]').forEach(b=>b.onchange=()=>{if(E.setLivingLevel(state,b.dataset.budget,Number(b.value))){save();render();livingPanel('生活預算已更新，下一張帳單採用目前設定。');}});content.querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{if(E.buyLifeService(state,b.dataset.care)){save();render();livingPanel('照顧安排已完成，數值已更新。');}});}

function retirePanel(){modal(`<h2>正式退休</h2><p>65 歲後可正式退休，結束這段人生並查看結局；也能繼續創作直到自然離世。正式退休會結束當前生涯。</p><p>目前 ${E.ageNow(state)} 歲。結局會參考財務、作品、人際、心情及健康。</p><button class="primary" id="confirm-retire" ${E.ageNow(state)<65||state.stage==='end'||state.stage==='broadcast'?'disabled':''}>確定退休並查看結局</button>`);content.querySelector('#confirm-retire').onclick=()=>{if(E.retireLife(state)){stopLife('這段人生已結束。');dialog.close();save();render();}};}



function creditSummary(){let c=E.loanInfo(state);return `<section class="card"><h3>房屋與還款</h3><p>${c.home?'自有住處 · 免租屋費':'目前租屋中'}</p><p class="fine">貸款餘額 ${num(c.balance)} · 每期約 ${num(c.monthly)}<br>淨資產 ${num(E.netWorth(state))}（含房屋並扣貸款）</p></section>`;}

function creditPanel(message=''){let c=E.loanInfo(state);modal(`<div class="eyebrow">住宅與資金規劃</div><h2>房屋與貸款</h2><p>可用現金 ${num(state.money)} · 貸款餘額 ${num(c.balance)} · 每期還款約 ${num(c.monthly)}</p>${message?`<p role="status">${esc(message)}</p>`:''}<h3>買房</h3><p>買房後「住」的租金為 0；採房貸時每 30 天仍需還本付息。可持有一間住處，房價以購入價格計算遊戲淨資產。</p>${c.home?`<p>已持有 ${esc(E.homes.find(h=>h.id===c.home.id).name)}，原價 ${num(c.home.price)}。</p>`:`<label>付款方式<select id="home-down"><option value="20">頭期款 20%，貸款 80%</option><option value="40">頭期款 40%，貸款 60%</option><option value="100">全額付款</option></select></label><div class="career-grid">${E.homes.map(h=>`<article class="career-card"><h3>${h.name}</h3><p>房價 ${num(h.price)}<br>20% 頭期款 ${num(h.price*.2)}<br>貸款年利率 3%，240 期；20% 頭期時每期約 ${num(E.loanPayment(h.price*.8,.03,240))}</p><button class="primary" data-home="${h.id}" ${state.stage==='end'?'disabled':''}>查看付款確認</button></article>`).join('')}</div>`}<h3>一般貸款</h3><p>可借上限 ${num(c.limit)}，年利率 9%；同時限一筆一般貸款。累積三期逾期會暫停新貸款。</p><div class="living-budget"><label>借款金額<input id="borrow-amount" type="number" min="1000" max="${c.limit}" step="1000" value="5000"></label><label>還款期數<select id="borrow-months"><option value="12">12 期</option><option value="24">24 期</option><option value="36">36 期</option></select></label><label>用途<select id="borrow-purpose"><option>生活週轉</option><option>設備購買</option><option>節目製作</option><option>其他用途</option></select></label></div><p id="loan-preview"></p><button class="secondary" id="borrow-submit" ${state.stage==='end'?'disabled':''}>借款確認</button><h3>現有還款</h3>${c.loans.map(l=>`<article class="loan-row"><b>${esc(l.purpose)}</b><p>本金 ${num(l.balance)} · 每期 ${num(l.payment)}<br>下次第 ${l.due+1} 天 · 逾期 ${l.missed} 期</p><input type="number" min="1" step="1" value="1000" aria-label="提前還款 ${l.id}" data-repay-amount="${l.id}"><button class="quiet" data-repay="${l.id}" ${state.stage==='end'?'disabled':''}>提前還本金</button></article>`).join('')||'<p>目前沒有貸款。</p>'}<p class="fine">每 30 天自動扣款；資金不足只扣可用現金，未還本金與利息保留，另有最高 100 的逾期費。提前還款可減少未來利息，沒有提前清償費。</p>`);

let preview=()=>{let amount=Number(content.querySelector('#borrow-amount').value),months=Number(content.querySelector('#borrow-months').value);content.querySelector('#loan-preview').textContent=amount>=1000&&amount<=c.limit?'每期約 '+num(E.loanPayment(amount,.09,months))+'，共 '+months+' 期。':'請輸入範圍內金額。';};preview();content.querySelector('#borrow-amount').oninput=preview;content.querySelector('#borrow-months').onchange=preview;

content.querySelector('#borrow-submit').onclick=()=>{let amount=Number(content.querySelector('#borrow-amount').value),months=Number(content.querySelector('#borrow-months').value),purpose=content.querySelector('#borrow-purpose').value;if(E.borrow(state,amount,months,purpose)){save();render();creditPanel('貸款已入帳，請預留每期還款。');}else creditPanel('無法借款，請確認金額、既有貸款或逾期狀況。');};content.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>{let h=E.homes.find(h=>h.id===b.dataset.home),down=Number(content.querySelector('#home-down').value),cash=h.price*down/100;modal(`<h2>確認購買 ${h.name}</h2><p>立即支出 ${num(cash)}，貸款 ${num(h.price-cash)}，每期約 ${down===100?0:num(E.loanPayment(h.price-cash,.03,240))}。買房後不再扣租屋費。</p><button class="primary" id="confirm-home">確認付款</button><button class="quiet" id="cancel-home">返回</button>`);content.querySelector('#cancel-home').onclick=()=>creditPanel();content.querySelector('#confirm-home').onclick=()=>{if(E.buyHome(state,h.id,down)){save();render();creditPanel('已購入住處，下張生活帳單不再收租屋費。');}else creditPanel('購買未完成，請確認頭期款與借款條件。');};});content.querySelectorAll('[data-repay]').forEach(b=>b.onclick=()=>{let id=Number(b.dataset.repay),amount=Number(content.querySelector('[data-repay-amount="'+id+'"]').value);if(E.repayLoan(state,id,amount)){save();render();creditPanel('已提前還款。');}else creditPanel('還款未完成，請確認金額與現金。');});}



function cashEntries(){

 return [

  ...(state.expenses||[]).map(row=>({...row,amount:-row.amount})),

  ...(state.incomeEntries||[])

 ].sort((a,b)=>b.day-a.day||(b.order||0)-(a.order||0));

}

function cashRows(entries){

 return entries.length?`<ul>${entries.map(row=>`<li><span>第 ${row.day+1} 天 · ${esc(row.reason.startsWith('每月生活帳單')?'基本支出':row.reason==='會員月費'?'平台分成 · 會員月費':row.reason)}</span><b class="${row.amount>0?'gain':'loss'}">${row.amount>0?'+':'−'}${num(Math.abs(row.amount))}</b></li>`).join('')}</ul>`:'<p class="fine">收支發生後會在這裡顯示。</p>';

}

function resultChanges(values){

 const keys=['money','fans','wellbeingMood','health','physical','joy'];

 const changes=keys.filter(key=>Math.round(values?.[key]||0)!==0);

 return changes.length?`<div class="changes">${changes.map(key=>{

  const value=Math.round(values[key]);

  return `<span class="change ${value<0?'negative':''}">${labels[key]} ${value>0?'+':''}${num(value)}</span>`;

 }).join('')}</div>`:'<p class="fine">這次沒有數值變動。</p>';

}

function dailyResultPanel(){

 const daily=state.lastDailyChanges;

 if(!daily)return '';

 const earlier=(state.dailyChangesHistory||[]).slice(0,-1).reverse();

 const changes=Object.entries(daily.changes).filter(([key,value])=>key!=='money'&&Math.round(value)!==0);

 const summary=Object.fromEntries(changes.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3));

 return `<section class="card activity-result"><h3>第 ${daily.day+1} 天 · 日常增減</h3>${resultChanges(summary)}

 ${changes.length>3||earlier.length?`<details><summary>查看完整日常紀錄</summary>${changes.length>3?resultChanges({...daily.changes,money:0}):''}${earlier.map(row=>`<p>第 ${row.day+1} 天</p>${resultChanges({...row.changes,money:0})}`).join('')}</details>`:''}</section>`;

}

function weeklyResultPanel(){

 const weekly=state.lastWeeklyChanges;

 return weekly?`<section class="card activity-result"><h3>第 ${weekly.week} 週 · 狀態結算</h3>${resultChanges(weekly.changes)}</section>`:'';

}

function choiceResultPanel(){

 const result=state.lastChoiceResult;

 return `<section class="card activity-result" id="choice-result" tabindex="-1"><h3>選項結果</h3><b>${esc(result.label)}</b><p>${esc(result.text)}</p>${resultChanges(result.changes)}${state.stage==='result'?'<button class="primary" id="continue-after-choice">繼續人生</button>':''}</section>`;

}

function showStatHistory(key){

 const rows=(state.statEntries?.[key]||[]).slice().reverse();

 modal(`<h2>${esc(labels[key])}明細</h2><p>目前 ${num(statNumber(key))}／100</p><section class="expense-details cash-history">${rows.length?cashRows(rows):'<p class="fine">狀態變動後會列在這裡。</p>'}</section>`);

}

function subscriptionRows(){

 return (state.subscriptionEntries||[]).slice().reverse();

}

function subscriptionDetails(){

 const rows=subscriptionRows();

 return `<section class="expense-details"><div class="cash-heading"><h3>最近訂閱增減</h3><button class="quiet" id="subscription-history">查看明細</button></div>${rows.length?cashRows(rows.slice(0,2)):'<p class="fine">開台與事件造成的訂閱增減會列在這裡。</p>'}</section>`;

}

function monthlyBudget(){

 const living=E.livingInfo(state);

 const loans=E.loanInfo(state);

 const maintenance=state.life.completed.reduce((total,id)=>total+(E.projects.find(p=>p.id===id)?.upkeep||0),0)*30;

 const incidental=E.estimateIncidentalExpenses(state);

 const expense=living.monthly+loans.monthly+maintenance+incidental;

 const income=E.estimateMonthlyChannelIncome(state);

 return `<section class="expense-details"><h3>每月預計收支</h3><dl class="monthly-budget">

 <div><dt>預計收入</dt><dd>${num(income.total)}</dd></div>

 <div><dt>預計支出</dt><dd>${num(expense)}</dd></div>

 </dl><details class="cash-budget"><summary>查看每月明細</summary>

 <p>以目前方針估算 30 天約開台 ${income.streams} 場、${income.paidShifts} 個有薪兼職班。</p>

 <ul><li><span>廣告分成</span><b>${num(income.platform)}</b></li><li><span>斗內分成</span><b>${num(income.donation)}</b></li><li><span>會員收入</span><b>${num(income.membership)}</b></li><li><span>兼職薪資</span><b>${num(income.partTime)}</b></li><li><span>正職薪資</span><b>${num(income.salary)}</b></li>${income.authorSupport?`<li><span>你不行的每月斗內</span><b>${num(income.authorSupport)}</b></li>`:''}<li><span>基本支出</span><b>${num(living.monthly)}</b></li><li><span>還款</span><b>${num(loans.monthly)}</b></li><li><span>設備維護</span><b>${num(maintenance)}</b></li><li><span>預估零星支出</span><b>${num(incidental)}</b></li></ul></details>

 </section>`;

}

function expenseDetails(){

 const recent=cashEntries();

 return `<section class="expense-details"><div class="cash-heading"><h3>最近收支</h3><button class="quiet" id="cash-history">查看明細</button></div>

 ${cashRows(recent.slice(0,4))}

 <p class="fine">剩餘資金轉機 ${Math.max(0,2-(state.cashLifelinesUsed||0))} 次</p></section>`;

}





