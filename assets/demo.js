const $=s=>document.querySelector(s),vp=$('#vp');
const LOCKU='chrome-extension://browser-lock/lock.html';
const SETUP={t:'Browser Lock - Settings',u:'chrome-extension://browser-lock/options.html',k:'setup'};
const fresh=()=>({pw:'',ans:[],locked:false,view:'unlock',cur:0,fails:0,rf:0,rlock:false,tabs:[{...SETUP},{t:'Padlock - Wikipedia',u:'https://en.wikipedia.org/wiki/Padlock',k:'wiki'}]});
let S=fresh();
const QS=[{id:'name',n:0,l:'What would your other name be, if you had the chance to name yourself?',p:'The name you would give yourself'},{id:'years',n:1,l:'Approximately how many years will you live in this world?',p:'Whole number only, e.g. 80'},{id:'crush',n:0,l:'Who is your crush?',p:'Their name'}];
const HINTS=['Fill in the real settings page: choose a password and answer the 3 security questions, then press Save.','Locked. Every tab now shows the lock screen. Type your password, or try Forgot Password and Change Password.','Unlocked. The shackle opened and your tabs are back. Click the Browser Lock icon in the toolbar, or press Alt+L, to lock again.'];
const norm=s=>s.trim().toLowerCase().replace(/\s+/g,' ');
const isInt=s=>/^\d{1,4}$/.test(s.trim());
const EYE='<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>';
const NUM=' inputmode="numeric" maxlength="4" data-int="1"';
const ig=(id,l,p,o={})=>`<div class="input-group">${l?`<label${o.q?' class="q-label"':''} for="${id}">${l}</label>`:''}<div class="input-box"><input type="password" id="${id}" placeholder="${p}" autocomplete="off" spellcheck="false"${o.n?NUM:''}>${o.e?`<button type="button" class="toggle-btn" data-a="eye" data-t="${id}" title="Show/Hide Password">${EYE}</button>`:''}</div></div>`;
const fld=(id,l,p,t,n)=>`<div class="field"><label for="${id}">${l}</label><input type="${t}" id="${id}" placeholder="${p}" autocomplete="off" spellcheck="false"${n?NUM:''}></div>`;
const btn=(a,t)=>`<button type="button" class="secondary-btn" data-a="${a}">${t}</button>`;
const BALL='<div class="xb-ball"><div class="xb-orb"><i class="xb-orb-sh"></i><div class="xb-shackle"></div><div class="xb-orb-b"><div class="xb-keyhole"></div></div></div></div>';
const NEWPW=ig('np','New Password','At least 4 characters')+ig('nc','Confirm New Password','Re-enter new password');
const VIEWS={
unlock:()=>`<h1>Browser Locked</h1><p class="subtitle">Enter your master password to unlock your session and restore your tabs.</p><form data-f="unlock" novalidate>${ig('pi','','Enter master password',{e:1})}<button class="primary-btn">Unlock Browser</button><div class="btn-row">${btn('chg','Change Password')}${btn('fgt','Forgot Password?')}</div><div class="status-msg" id="m"></div></form>`,
change:()=>`<h1>Change Password</h1><p class="subtitle">Verify your current password to set a new master password.</p><form data-f="change" novalidate>${ig('op','Current Password','Enter current password')}${NEWPW}<button class="primary-btn">Update Password</button>${btn('back','Back to Unlock')}<div class="status-msg" id="m"></div></form>`,
forgot:()=>`<h1>Forgot Password</h1><p class="subtitle">Answer all 3 security questions correctly to unlock your browser.</p><form data-f="verify" novalidate>${QS.map(q=>ig('answer-'+q.id,q.l,q.p,{q:1,n:q.n})).join('')}<button class="primary-btn"${S.rlock?' disabled':''}>Verify Answers</button><button type="button" class="link-btn" data-a="showans">Show answers</button>${btn('back','Back to Unlock')}<div class="status-msg" id="m">${S.rlock?'Recovery is locked for 5 minutes.':''}</div></form>`,
reset:()=>`<h1>Forgot Password</h1><p class="subtitle">Answers verified. You can set a new password now, or just unlock.</p><form data-f="reset" novalidate>${NEWPW}<button class="primary-btn">Set New Password &amp; Unlock</button>${btn('skip','Unlock Without Changing Password')}<div class="status-msg" id="m"></div></form>`};
const lockHTML=()=>`<div class="xl"><i class="glow"></i><main class="lock-card">${BALL}${VIEWS[S.view]()}<div class="footer-note">Account data &amp; active sessions are safely preserved.</div></main></div>`;
const optHTML=()=>`<div class="xo"><div class="container"><div class="header"><h1>Browser Lock</h1><button class="quick-lock-btn" data-a="now">Lock Browser Now (Alt+L)</button></div>
<section class="card"><h2>Create Master Password</h2><p class="desc">Your password hash is stored locally on this device only and never modifies your Google Account sync.</p><form data-f="save" novalidate>${fld('np','New Password','At least 4 characters','password')}${fld('nc','Confirm New Password','Re-enter new password','password')}
<div class="info-box"><strong>Security questions</strong> are the only way to get back in if you forget your password.<ol><li>Answer all 3 questions below. Pick answers you will always remember.</li><li>If you forget your password, click <strong>Forgot Password?</strong> on the lock screen.</li><li>Answer the same 3 questions correctly to unlock, then set a new password if you want.</li></ol></div>
${QS.map((q,i)=>fld('setup-'+q.id,`${i+1}. ${q.l}`,q.p,'text',q.n)).join('')}<div class="hint">Answers are saved only as one-way hashes on this device. Capital letters and extra spaces do not matter.</div><button class="btn-primary">Save Password &amp; Lock Browser</button><div class="alert" id="m"></div></form></section>
<section class="card"><h2>Lock Preferences</h2><p class="desc">Customize when your browser locks automatically.</p><div class="row-setting"><div><strong>Lock When Profile Opens / Reopens</strong><div class="sub">Require password on browser startup or when reopening this Chrome profile</div></div><input type="checkbox" checked></div><div class="field" style="margin-top:1rem"><label for="al">Auto-Lock When Idle</label><select id="al"><option>Disabled</option><option>After 1 minute of inactivity</option><option>After 5 minutes of inactivity</option><option>After 15 minutes of inactivity</option><option>After 30 minutes of inactivity</option></select></div><div class="alert" id="pm" style="color:#22c55e"></div></section></div></div>`;
const WIKI='<div class="pg"><h2>Padlock</h2><p class="mut">From Wikipedia, the free encyclopedia</p><p>A padlock is a portable lock with a U-shaped shackle that passes through a hasp or ring and then locks shut.</p><i class="sk"></i><i class="sk"></i><i class="sk s"></i></div>';
const NT='<div class="nt"><div class="gl">Search</div><div class="sb">Search the web or type a URL</div></div>';
function step(n){document.querySelectorAll('.st li').forEach((li,i)=>li.classList.toggle('on',i<n));$('#hint').textContent=HINTS[n-1]}
function render(){
 const T=S.tabs[S.cur];
 $('#tabs').innerHTML=S.tabs.map((t,i)=>`<div class="tab${i==S.cur?' act':''}" data-i="${i}">${t.k=='wiki'&&!S.locked?'<b class="w">W</b>':'<b></b>'}<span>${S.locked?'Browser Locked':t.t}</span><u>&#10005;</u></div>`).join('');
 $('#url').textContent=S.locked?LOCKU:T.u;
 $('#bd').textContent=S.locked?'LOCK':'';
 vp.innerHTML=S.locked?lockHTML():T.k=='setup'?optHTML():T.k=='wiki'?WIKI:NT;
 const f=vp.querySelector('input:not([type=checkbox])');f&&f.focus({preventScroll:true});
}
const val=i=>vp.querySelector('#'+i).value;
const msg=(t,ok,id='m')=>{const m=vp.querySelector('#'+id);m.textContent=t;m.style.color=ok?'#22c55e':''};
const shake=t=>{msg(t);const c=vp.querySelector('.lock-card');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake')};
function lock(){S.locked=true;S.view='unlock';S.fails=S.rf=0;S.rlock=false;step(2);render()}
function restore(){S.locked=false;S.tabs.forEach(t=>{if(t.k=='setup'){t.k='newtab';t.t='New Tab';t.u='chrome://newtab'}});step(3);render()}
function openLock(){const b=vp.querySelector('.xb-ball');b&&b.classList.add('opening');setTimeout(restore,1250)}
function press(){
 if(S.locked)return;
 if(!S.pw){if(!S.tabs.some(t=>t.k=='setup'))S.tabs.unshift({...SETUP});S.cur=S.tabs.findIndex(t=>t.k=='setup');render();return}
 lock();
}
const FORMS={
save(){
 const a=val('np'),q=QS.map(x=>val('setup-'+x.id));
 if(a.length<4)return msg('Password must be at least 4 characters long.');
 if(a!==val('nc'))return msg('New passwords do not match.');
 if(q.some(x=>!x.trim()))return msg('Please answer all 3 security questions.');
 if(!isInt(q[1]))return msg('Question 2 needs a whole number (1 to 4 digits).');
 S.pw=a;S.ans=q;msg('Password saved! Locking your browser...',1);setTimeout(lock,800);
},
unlock(){
 if(val('pi')===S.pw){S.fails=0;msg('Unlocked! Restoring your tabs...',1);openLock()}
 else{S.fails++;shake(`Incorrect password (${Math.max(0,5-S.fails)} attempts remaining)`)}
},
change(){
 const n=val('np');
 if(val('op')!==S.pw){S.fails++;return shake(`Current password incorrect (${Math.max(0,5-S.fails)} tries left)`)}
 if(n.length<4)return shake('Password must be at least 4 characters long.');
 if(n!==val('nc'))return shake('New passwords do not match.');
 S.pw=n;msg('Password updated! Unlocking browser...',1);openLock();
},
verify(){
 const r=QS.map(q=>val('answer-'+q.id));
 if(norm(r[0])==norm(S.ans[0])&&isInt(r[1])&&+r[1]==+S.ans[1]&&norm(r[2])==norm(S.ans[2])){S.view='reset';return render()}
 QS.forEach(q=>{vp.querySelector('#answer-'+q.id).value=''});vp.querySelector('#answer-name').focus();
 const left=3-++S.rf;
 if(left<=0){S.rlock=true;vp.querySelector('.primary-btn').disabled=true;shake('3 wrong attempts. Recovery is locked for 5 minutes.')}
 else shake(`One or more answers are incorrect (${left} ${left==1?'try':'tries'} left).`);
},
reset(){
 const n=val('np');
 if(n.length<4)return shake('New password must be at least 4 characters.');
 if(n!==val('nc'))return shake('New passwords do not match.');
 S.pw=n;msg('Password updated! Unlocking browser...',1);openLock();
}};
vp.addEventListener('submit',e=>{e.preventDefault();FORMS[e.target.dataset.f]()});
vp.addEventListener('click',e=>{
 const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a=='eye'){const i=vp.querySelector('#'+b.dataset.t);i.type=i.type=='password'?'text':'password'}
 else if(a=='showans'){const hide=b.textContent=='Hide answers';vp.querySelectorAll('input[id^=answer-]').forEach(i=>{i.type=hide?'password':'text'});b.textContent=hide?'Show answers':'Hide answers'}
 else if(a=='now')S.pw?lock():msg('Please set a master password first before locking.');
 else if(a=='skip')openLock();
 else{S.view={chg:'change',fgt:'forgot',back:'unlock'}[a];render()}
});
vp.addEventListener('input',e=>{if(e.target.dataset.int)e.target.value=e.target.value.replace(/\D/g,'')});
vp.addEventListener('change',e=>{if(e.target.closest('.row-setting')||e.target.id=='al'){msg('Preferences saved.',1,'pm');setTimeout(()=>{const m=vp.querySelector('#pm');m&&(m.textContent='')},1500)}});
$('#tabs').addEventListener('click',e=>{
 const t=e.target.closest('.tab');if(!t)return;const i=+t.dataset.i;
 if(e.target.tagName=='U'&&S.tabs.length>1){S.tabs.splice(i,1);S.cur=Math.max(0,Math.min(i<S.cur?S.cur-1:S.cur,S.tabs.length-1))}else S.cur=i;
 render();
});
$('#nt').onclick=()=>{S.tabs.push({t:'New Tab',u:'chrome://newtab',k:'newtab'});S.cur=S.tabs.length-1;render()};
$('#bl').onclick=press;
$('#rs').onclick=()=>{S=fresh();step(1);render()};
addEventListener('keydown',e=>{if(e.altKey&&e.key.toLowerCase()=='l'){e.preventDefault();press()}});
/* Padlock follows the pointer and looks around when idle (port of lock-anim.js) */
const cl=v=>Math.max(-1,Math.min(1,v));
let tx=0,ty=0,cx=0,cy=0,last=0,nx=0;
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
addEventListener('pointermove',e=>{const o=vp.querySelector('.xb-orb');if(!o)return;const r=o.getBoundingClientRect();tx=cl((e.clientX-r.left-r.width/2)/420);ty=cl((e.clientY-r.top-r.height/2)/420);last=performance.now()},{passive:true});
(function f(n){
 requestAnimationFrame(f);
 const b=vp.querySelector('.xb-orb-b');if(!b||calm)return;
 if(n-last>3500&&n>nx){tx=Math.random()-.5;ty=(Math.random()-.5)*.6;nx=n+1600+Math.random()*1800}
 cx+=(tx-cx)*.1;cy+=(ty-cy)*.1;
 const t=`rotateY(${cx*8}deg) rotateX(${-cy*7}deg)`,s=vp.querySelector('.xb-shackle');
 b.style.transform=t;
 if(!s.closest('.xb-ball').classList.contains('opening'))s.style.transform=t;
})(0);
step(1);render();