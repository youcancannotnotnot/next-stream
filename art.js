'use strict';
window.SweetArt=(()=>{
const ink='#706b7e',rose='#bc949f',paper='#f2efeb',violet='#a9a0be';
function body(kind){let k=({rabbit:'mic',live:'mic',audio:'mic',asmr:'mic',learn:'book',art:'book',work:'coin',market:'coin',connect:'letter',chat:'letter',talk:'letter',rest:'moon',retire:'moon',mentor:'book',game:'pad',dualpc:'pc',film:'camera',ku100:'head',model3d:'cube',mocap:'cube',dance:'cube',concert:'mic',music:'mic',outfit:'shirt',bow:'shirt',set:'camera',archive:'book',editor:'book',acoustic:'house',studio:'house',first:'mic',week:'moon',living:'coin',fans:'people',heart:'people',show:'mic',ku:'head',stage:'mic',decade:'letter',star:'cube'})[kind]||kind;
let shapes={
mic:`<rect x="39" y="14" width="26" height="48" rx="13" fill="${rose}"/><path d="M31 45v9a21 21 0 0 0 42 0v-9M52 75v15M37 90h30M44 26h16M44 33h16"/>`,
book:`<path d="M19 19h55l10 8v60H19Z" fill="${paper}"/><path d="M30 19v68M42 39h29M42 49h24M42 59h18"/><path d="M64 19v15l6-4 6 4V20" fill="${rose}"/>`,
coin:`<ellipse cx="52" cy="73" rx="31" ry="13" fill="${violet}"/><path d="M21 62v11M83 62v11"/><ellipse cx="52" cy="62" rx="31" ry="13" fill="${paper}"/><circle cx="52" cy="38" r="25" fill="#d5c3a5"/><path d="M52 23v30M61 29H48q-13 8 4 10t-5 9H43"/>`,
letter:`<rect x="16" y="28" width="72" height="51" rx="3" fill="${paper}"/><path d="M18 31l34 25 34-25M18 76l25-23M86 76L61 53"/>`,
moon:`<path d="M64 16A36 36 0 1 0 86 67A35 35 0 0 1 64 16Z" fill="${violet}"/>`,
pad:`<path d="M29 32h46q12 0 17 40q-1 14-12 4L67 64H37L23 76q-12 10-11-4q4-40 17-40Z" fill="${violet}"/><path d="M30 40v21M20 50h20"/><circle cx="72" cy="44" r="3" fill="${rose}"/><circle cx="81" cy="54" r="3" fill="${paper}"/>`,
pc:`<rect x="11" y="18" width="82" height="57" rx="4" fill="${ink}"/><rect x="17" y="24" width="70" height="44" rx="1" fill="${violet}"/><path d="M44 76v12M60 76v12M32 89h40"/><path d="M25 55l14-12 12 5 23-16" stroke="${paper}"/>`,
camera:`<path d="M16 32h20l6-10h23l7 10h17v48H16Z" fill="${violet}"/><circle cx="54" cy="55" r="19" fill="${paper}"/><circle cx="54" cy="55" r="12" fill="${ink}"/><path d="M23 41h11"/>`,
head:`<path d="M41 73v16h22V73" fill="${violet}"/><ellipse cx="24" cy="50" rx="5" ry="10" fill="${rose}"/><ellipse cx="80" cy="50" rx="5" ry="10" fill="${rose}"/><rect x="28" y="15" width="48" height="62" rx="23" fill="${paper}"/><path d="M52 39v15l6 3M44 65h16"/>`,
cube:`<path d="M52 15l33 19v38L52 91 19 72V34Z" fill="${violet}"/><path d="M19 34l33 20 33-20M52 54v37M35 25l34 20v16"/>`,
people:`<circle cx="52" cy="34" r="17" fill="${paper}"/><path d="M23 87V74q0-23 29-23t29 23v13Z" fill="${violet}"/>`,
shirt:`<path d="M35 21l17 6 17-6 23 18-12 19-10-6v35H34V52L24 58 12 39Z" fill="${rose}"/><path d="M41 24q11 18 22 0"/>`,
house:`<path d="M13 46l39-30 39 30M24 40v47h56V40" fill="${paper}"/><path d="M43 87V58h19v29M31 50h7"/>`
};return `<g fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${shapes[k]||shapes.book}</g>`;}
function icon(k,cls=''){return `<svg class="sweet-icon ${cls}" viewBox="0 0 104 104" aria-hidden="true">${body(k)}</svg>`;}
function portrait(name){let n=[...String(name)].reduce((a,c)=>a+c.charCodeAt(0),0),h=['#706377','#626477','#637772','#8a776d'][n%4];return `<svg class="sweet-portrait" viewBox="0 0 104 104" aria-hidden="true"><rect x="3" y="3" width="98" height="98" rx="20" fill="#e3dfe7"/><path d="M17 100v-9q2-25 35-25t35 25v9" fill="${h}"/><path d="M29 58V33q0-24 24-24t24 24v36H29Z" fill="${h}"/><ellipse cx="53" cy="45" rx="21" ry="27" fill="#e7c7b8"/><path d="M31 37q2-29 24-26q23 2 22 28q-13-1-20-18q-5 17-26 16" fill="${h}"/><path d="M42 44h3M61 44h3M49 58q5 3 10 0" stroke="${ink}" stroke-width="2" fill="none"/></svg>`;}
function room(completed=[],quiet=false,products=[]){const has=k=>completed.includes(k);
 const rendered=new Set(['acoustic','model3d','dualpc','mic','ku100','pc','camera','mocap']);
 const custom={
  desk_lamp:'<path d="M720 423h38m-19 0v-98l-29-18" stroke="#78687a" stroke-width="5" fill="none"/><path d="M697 299h26l9 19h-45Z" fill="#cb9caf"/>',
  mic_arm:'<path d="M353 423v-72l58-38" stroke="#756b7f" stroke-width="5" fill="none"/><rect x="404" y="310" width="12" height="27" rx="4" fill="#ac849c"/>',
  desk_mat:'<path d="M425 407h230l32 23H397Z" fill="#a687a7" opacity=".55"/>'
 };
 const additions=products.filter(p=>!rendered.has(p.id));
return `<svg xmlns="http://www.w3.org/2000/svg" class="studio-scene editorial-room" viewBox="0 0 1100 760" role="img" aria-label="粉灰色直播工作室，設備依完成企劃更新"><defs><linearGradient id="sweet-wall" x2="0" y2="1"><stop stop-color="#e5dfe5"/><stop offset="1" stop-color="#d8d2dc"/></linearGradient><linearGradient id="sweet-floor" x2="0" y2="1"><stop stop-color="#c6bdc4"/><stop offset="1" stop-color="#bab0bc"/></linearGradient></defs>
<rect width="1100" height="760" fill="url(#sweet-wall)"/><path d="M0 534h1100v226H0Z" fill="url(#sweet-floor)"/><path d="M0 534h1100" stroke="#b6adb9" stroke-width="5"/>
<rect x="69" y="68" width="270" height="321" fill="#aaa2b5"/><rect x="81" y="80" width="246" height="296" fill="#555b75"/>
<circle cx="271" cy="131" r="21" fill="#d5c9bf"/><path d="M81 286h31v-53h46v82h27v-113h50v77h34v-48h58v145H81Z" fill="#454a61"/><g fill="#b9a8a0" opacity=".6">${[122,142,197,218,281,303].map((x,i)=>`<path d="M${x} ${i%2?258:279}v6m0 12v6" stroke="#c2b0a2" stroke-width="5"/>`).join('')}</g><path d="M205 80v296M81 217h246" stroke="#ded5d9" stroke-width="7"/><path d="M57 389h295" stroke="#b8a7ae" stroke-width="12"/>
${has('acoustic')?`<g fill="#aaa0b4">${[0,1,2].map(i=>`<rect x="${404+i*83}" y="99" width="64" height="154" rx="3"/>`).join('')}</g>`:`<rect x="440" y="105" width="170" height="132" fill="#f1eeea"/><path d="M467 207l43-64 37 64Z" fill="#b3a6b9"/><circle cx="563" cy="142" r="14" fill="#bf9da5"/>`}
<path d="M789 224h228" stroke="#918895" stroke-width="8"/><g fill="#b398a6"><rect x="803" y="162" width="16" height="58"/><rect x="824" y="151" width="22" height="69"/><rect x="851" y="171" width="14" height="49"/></g><path d="M961 192v-42m0 21q-30-29-33-5q2 16 33 19m0-27q27-32 32-7q-3 17-32 19" stroke="#748b83" stroke-width="4" fill="#8b9f92"/><path d="M941 190h40l-6 30h-28Z" fill="#c4afa6"/>
${has('model3d')?`<g transform="translate(886 164) scale(.5)">${body('cube')}</g>`:''}
<ellipse cx="592" cy="670" rx="334" ry="44" fill="#a79aa9" opacity=".35"/>
<path d="M305 450v198M866 450v198" stroke="#77717e" stroke-width="15"/><rect x="273" y="429" width="640" height="20" rx="3" fill="#a98d96"/><path d="M283 430h620" stroke="#d4b9bd" stroke-width="4"/>
<rect x="359" y="277" width="268" height="148" rx="6" fill="#575665"/><rect x="369" y="287" width="248" height="126" fill="#aaa3bc"/><path d="M380 300h94v98h-94Z" fill="#878097"/><path d="M488 303h116v61H488Z" fill="#d4c2cc"/><g stroke="#e8dee1" stroke-width="3"><path d="M490 377h103M490 386h76M390 317h51M390 329h67M390 341h56"/></g><path d="M484 425v8M465 432h58" stroke="#666270" stroke-width="8"/>
${has('dualpc')?`<rect x="642" y="316" width="157" height="105" rx="4" fill="#575665"/><rect x="650" y="324" width="141" height="87" fill="#8b839d"/><path d="M665 347h70M665 361h108M665 375h88M716 422v10" stroke="#c7bccd" stroke-width="4"/>`:''}
<path d="M425 420h162l13 7H418Z" fill="#e0d9de"/><path d="M437 422h137" stroke="#a69cae" stroke-width="2"/><ellipse cx="635" cy="424" rx="13" ry="5" fill="#bda6b3"/>
 ${additions.filter(p=>custom[p.id]).map(p=>custom[p.id]).join('')}
 ${additions.filter(p=>!custom[p.id]).map((p,i)=>`<g transform="translate(${74+(i%8)*46} ${682-Math.floor(i/8)*36})"><title>${String(p.name).replace(/[<>&]/g,'')}</title><rect width="42" height="29" rx="4" fill="#e7d8e7"/><g transform="translate(9 2) scale(.48)">${body(({game_capture:'camera',music_interface:'mic',art_tablet:'book',wired_earphones:'head',asmr_binaural:'head'})[p.id]||'cube')}</g></g>`).join('')}
${has('mic')?`<path d="M318 431v-91l39-29" stroke="#6c6675" stroke-width="5" fill="none"/><rect x="346" y="306" width="18" height="43" rx="8" fill="#a78394"/><path d="M352 312h6m-6 6h6m-6 6h6" stroke="#e0ced7"/>`:''}
${has('ku100')?`<g transform="translate(811 340) scale(.85)">${body('head')}</g>`:`<path d="M835 405h29v23h-29Z" fill="#e5dcd5"/><path d="M864 409q17-3 12 10h-12" stroke="#c1a8ac" fill="none" stroke-width="3"/>`}
${has('pc')?`<rect x="924" y="463" width="97" height="171" rx="5" fill="#eee8e8"/><rect x="937" y="476" width="71" height="143" fill="#8b8499"/>${[514,578].map(y=>`<circle cx="972" cy="${y}" r="23" fill="none" stroke="#b8adc5" stroke-width="5"/><circle cx="972" cy="${y}" r="5" fill="#cdc1d0"/>`).join('')}`:''}
${has('camera')?`<path d="M966 347v83m0-20-25 39m25-39 25 39" stroke="#797180" stroke-width="4"/><g transform="translate(927 275) scale(.75)">${body('camera')}</g>`:''}
${has('mocap')?`<path d="M193 400v231m0-47-27 47m27-47 27 47" stroke="#77717e" stroke-width="4"/><rect x="180" y="380" width="26" height="24" rx="3" fill="#736d7c"/><circle cx="193" cy="392" r="6" fill="#b8acbe"/>`:''}
<path d="M571 598v73m0-7-66 23m66-23 66 23m-66-23v38" stroke="#706a7a" stroke-width="9" fill="none"/><path d="M487 585q84-13 168 0v22q-84 13-168 0Z" fill="#9b8195"/><rect x="497" y="447" width="148" height="141" rx="20" fill="#aa8b9f"/><rect x="510" y="460" width="122" height="112" rx="13" fill="#b89aab"/><path d="M508 581v-34h-28M634 581v-34h28" stroke="#787080" stroke-width="7" fill="none"/>
<text x="70" y="708" fill="#6b6174" font-size="12" font-family="sans-serif" letter-spacing="3">AFTER HOURS / MY STUDIO</text><text x="70" y="731" fill="#6b6174" font-size="12" font-family="sans-serif">${quiet?'安靜的新住處':'從這張桌子，開始自己的故事。'}</text></svg>`;}
return {icon,portrait,room};})();
