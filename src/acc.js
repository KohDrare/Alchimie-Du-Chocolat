/* =====================================================================
   PIED DE PAGE & PAGES LÉGALES
   ===================================================================== */
const SOC={
  instagram:['Instagram','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>'],
  facebook:['Facebook','<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.7c0-.9.3-1.5 1.5-1.5h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.3H8.1v3h2.5V21z"/></svg>'],
  googleReview:['Avis Google','<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.8 6.4.8-4.7 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3L2.8 9.4l6.4-.8z"/></svg>'],
  maps:['Google Maps','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>'],
  mail:['E-mail','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>'],
};
function socialHref(k){if(k==="maps")return mapsUrl(SHOP(S.shop));if(k==="mail")return`mailto:${CONFIG.legal.email}`;return CONFIG.links[k]||""}
function renderFooter(){
  const L=CONFIG.legal,yr=new Date().getFullYear(),sh=SHOP(S.shop);
  const soc=Object.keys(SOC).map(k=>{const h=socialHref(k);return h?`<a href="${h}" target="_blank" rel="noopener" aria-label="${SOC[k][0]}" title="${SOC[k][0]}">${SOC[k][1]}</a>`:`<a class="off" aria-label="${SOC[k][0]} (bientôt)" title="${SOC[k][0]} — bientôt">${SOC[k][1]}</a>`}).join("");
  const missing=Object.keys(CONFIG.links).filter(k=>!CONFIG.links[k]).length;
  $("#footer").innerHTML=`<div class="fshops">${CONFIG.shops.map(s=>{const st=openState(s.id);return `<a class="fshop" href="${mapsUrl(s)}" target="_blank" rel="noopener"><span class="pin">${SOC.maps[1]}</span><span class="t"><b>${s.name}</b><span>${esc(s.address)}</span><small class="${st.open?"o":""}">${st.text}</small></span><span class="go">${I.arrow}</span></a>`}).join("")}</div>
    <div class="lg2">${LOGO_LIGHT}</div>
    <p class="tg">Chocolaterie artisanale. Pralines, ganaches d'origine, macarons et thés, à Waterloo et Ixelles.</p>
    <div class="soc">${soc}</div>${missing?`<div class="soon">Certains réseaux arrivent bientôt.</div>`:""}
    <div class="cols">
      ${CONFIG.shops.map(s=>`<div><h5>${s.name}</h5><a href="${mapsUrl(s)}" target="_blank" rel="noopener">${esc(s.address).replace(", ","<br>")}</a><a href="tel:+${s.phone}">${s.phoneDisplay}</a></div>`).join("")}
      <div><h5>Infos</h5><a href="#infos">Horaires & boutiques</a><button data-lg="allergenes">Allergènes</button><button data-lg="cgv">Conditions de vente</button></div>
      <div><h5>Légal</h5><button data-lg="mentions">Mentions légales</button><button data-lg="privacy">Confidentialité</button></div>
    </div>
    <div class="bt">© ${yr} ${esc(CONFIG.name)} · ${esc(L.bce)}</div>`;
  $("#footer").querySelectorAll("[data-lg]").forEach(b=>b.onclick=()=>openLegal(b.dataset.lg));
}
const mk=v=>/^\[.*\]$/.test(v)?`<mark>${esc(v)}</mark>`:esc(v);
function legalHTML(k){
  const L=CONFIG.legal,shops=CONFIG.shops.map(s=>`${esc(s.name)} : ${esc(s.address)} · ${esc(s.phoneDisplay)}`).join("<br>");
  const T={
    mentions:["Mentions légales",`
      <h4>Exploitant du site</h4><p>${mk(L.company)}<br>${mk(L.form)}<br>Numéro d'entreprise (BCE) : ${mk(L.bce)}<br>E-mail : ${mk(L.email)}</p>
      <h4>Boutiques</h4><p>${shops}</p>
      <h4>Hébergement</h4><p>Site hébergé par GitHub Pages (GitHub, Inc.).${CONFIG.account.supabaseUrl?" Commandes et comptes clients hébergés par Supabase (serveurs en Europe).":""}</p>
      <h4>Propriété</h4><p>Le nom ${esc(CONFIG.name)}, le logo, les photos et les textes appartiennent à l'exploitant.</p>`],
    privacy:["Confidentialité",`
      <p>Nous collectons uniquement ce qui est nécessaire pour préparer votre commande.</p>
      <h4>Données utilisées</h4><ul><li>Nom et téléphone : pour vous contacter au sujet de votre commande.</li><li>Contenu de la commande, boutique, jour et heure de retrait, petit mot éventuel pour la carte.</li><li>Si vous créez un compte : votre adresse e-mail, votre profil, l'historique de vos commandes et vos points.</li></ul>
      <h4>Où vont ces données ?</h4><ul><li>La commande est enregistrée chez notre prestataire (Supabase, serveurs en Europe) et transmise à la boutique ; seul notre personnel peut la consulter.</li><li>Sans compte, votre profil et votre historique restent uniquement sur votre appareil.</li><li>Avec un compte, ils sont protégés : vous seul pouvez lire vos données.</li></ul>
      <h4>Durée</h4><p>Les données de compte sont conservées tant que le compte existe. Vous pouvez les effacer à tout moment depuis « Mon profil ».</p>
      <h4>Vos droits (RGPD)</h4><p>Accès, rectification, effacement, opposition : écrivez-nous à ${mk(L.email)}. Vous pouvez aussi introduire une plainte auprès de l'Autorité de protection des données (autoriteprotectiondonnees.be).</p>
      <h4>Cookies</h4><p>Aucun cookie publicitaire ni outil de suivi. Le site utilise seulement le stockage local de votre navigateur pour votre panier, votre profil et votre connexion.</p>`],
    cgv:["Conditions de vente",`
      <h4>Commande</h4><p>La commande passée sur le site est transmise directement à la boutique choisie. Son avancement (reçue, en préparation, prête, récupérée) est visible en direct sur la page de suivi.</p>
      <h4>Retrait</h4><p>Les commandes sont à retirer dans la boutique choisie, le jour et à l'heure indiqués. Les commandes du jour demandent au minimum ${CONFIG.prepMinutes} minutes de préparation ; les précommandes sont possibles jusqu'à ${CONFIG.preorderDays} jours à l'avance.</p>
      <h4>Prix & paiement</h4><p>Prix en euros, TVA comprise. ${esc(CONFIG.payment)}. Le poids des ballotins est indicatif (environ 12 g par praline).</p>
      <h4>Ballotins composés</h4><p>Les pralines sont faites maison en petites séries. Si l'une d'elles venait à manquer, nous la remplaçons par une praline proche et vous prévenons au retrait.</p>
      <h4>Annulation</h4><p>Pour annuler ou modifier une commande, contactez la boutique au plus vite. S'agissant de denrées préparées à la demande et périssables, le droit de rétractation ne s'applique pas.</p>`],
    allergenes:["Allergènes",`
      <p>Nos chocolats sont fabriqués dans un atelier qui utilise du lait, du soja, des fruits à coque, du gluten, des œufs et de l'alcool : des traces sont possibles dans toutes nos créations.</p>
      <p>Ci-dessous, les allergènes indiqués pour chaque praline (G = gluten, N = fruits à coque). En cas d'allergie, demandez-nous conseil en boutique avant de commander.</p>
      <table class="alt">${PR.map(c=>`<tr><th colspan="2">${esc(c.name)}</th></tr>${c.items.map(i=>`<tr><td>${esc(i.full)}</td><td>${(i.al||"").split("").filter(x=>AL_L[x]).map(x=>AL_L[x]).join(", ")||"—"}</td></tr>`).join("")}`).join("")}</table>
      <p><mark>[Liste à faire vérifier par l'atelier avant la mise en ligne]</mark></p>`],
  };
  return T[k];
}
function openLegal(k){const [t,body]=legalHTML(k);view="legal";
  sheet.innerHTML=head(t,"")+`<div class="sb legal">${body}${/<mark>/.test(body)?`<div class="warn">Les éléments surlignés sont à compléter. Modèle de texte à faire relire avant la mise en ligne définitive.</div>`:""}</div>`;
  bindClose();openSheet()}

/* =====================================================================
   COMPTES (Supabase) — connexion par code reçu par e-mail
   ===================================================================== */
const ACC={sb:null,user:null,profile:null,points:null,ledger:[],team:false,step:"choose",channel:"email",ident:"",busy:false,orders:null,prov:{email:true,phone:false,google:false,apple:false}};
const accOn=()=>!!ACC.sb;
async function accInit(){
  const c=CONFIG.account;
  if(!(c.supabaseUrl&&c.supabaseAnonKey)&&!window.__SUPA_MOCK)return;
  try{
    const sb=window.__SUPA_MOCK||(await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")).createClient(c.supabaseUrl,c.supabaseAnonKey,{auth:{persistSession:true,storageKey:"alchimie-auth",detectSessionInUrl:true}});
    ACC.sb=sb;
    try{const st=window.__SUPA_MOCK?window.__SUPA_MOCK.settings:await (await fetch(c.supabaseUrl+"/auth/v1/settings",{headers:{apikey:c.supabaseAnonKey}})).json();
      const x=(st&&st.external)||{};ACC.prov={email:x.email!==false,phone:!!x.phone,google:!!x.google,apple:!!x.apple}}catch(e){}
    const {data}=await sb.auth.getSession();await accSetUser(data&&data.session?data.session.user:null);
    sb.auth.onAuthStateChange((_e,session)=>{const u=session?session.user:null;if((u&&u.id)!==(ACC.user&&ACC.user.id))accSetUser(u)});
  }catch(e){console.warn("Comptes indisponibles",e);ACC.sb=null}
  if(view==="profile")drawProfile();
  try{if(sessionStorage.getItem("alchimie-oauth")){sessionStorage.removeItem("alchimie-oauth");if(ACC.user){drawProfile();openSheet();toast("Connecté")}}}catch(e){}
}
async function accSetUser(u){
  ACC.user=u;ACC.orders=null;ACC.profile=null;
  if(u){
    try{const {data}=await ACC.sb.from("profiles").select("*").eq("id",u.id).maybeSingle();ACC.profile=data||null}catch(e){}
    const c=getClient(),md=u.user_metadata||{};
    if(!c.name&&(md.full_name||md.name)){c.name=md.full_name||md.name;setClient(c)}
    if(!c.tel&&u.phone){c.tel="+"+u.phone.replace(/^\+/,"");setClient(c)}
    if(ACC.profile){const p=ACC.profile;setClient({name:p.name||c.name||"",tel:p.phone||c.tel||""});if(p.shop&&CONFIG.shops.some(s=>s.id===p.shop))S.shop=p.shop}
    else if(c.name||c.tel){accSaveProfile()}
    await accSyncLocal();await accLoadOrders();await accLoadPoints();
    try{const {data}=await ACC.sb.rpc("is_team");ACC.team=!!data}catch(e){ACC.team=false}
  }
  update();renderStatus();if(view==="profile")drawProfile();
}
async function accLoadOrders(){
  if(!ACC.user)return;
  try{const {data,error}=await ACC.sb.from("orders").select("*").order("created_at",{ascending:false}).limit(30);if(error)throw error;
    ACC.orders=(data||[]).map(r=>({num:r.num,ts:Date.parse(r.created_at),when:r.when_label,shop:r.shop,total:+r.total,items:r.items}))}catch(e){console.warn(e)}
}
async function accSyncLocal(){
  const H=getOrders();if(!H.length||!ACC.user)return;
  try{const {data}=await ACC.sb.from("orders").select("num");const have=new Set((data||[]).map(r=>r.num));
    const rows=H.filter(h=>!have.has(h.num)&&!String(h.track||"").startsWith("DEMO")).map(h=>({user_id:ACC.user.id,num:h.num,shop:h.shop,when_label:h.when,total:h.total,items:h.items,created_at:new Date(h.ts).toISOString()}));
    if(rows.length)await ACC.sb.from("orders").insert(rows)}catch(e){console.warn(e)}
}
async function accSaveOrder(rec){
  if(!ACC.user)return;
  try{await ACC.sb.from("orders").insert({user_id:ACC.user.id,num:rec.num,shop:rec.shop,when_label:rec.when,total:rec.total,items:rec.items});await accLoadOrders()}catch(e){console.warn(e)}
}
async function accSaveProfile(){
  if(!ACC.user)return;const c=getClient();
  try{await ACC.sb.from("profiles").upsert({id:ACC.user.id,name:c.name||null,phone:c.tel||null,shop:S.shop,updated_at:new Date().toISOString()})}catch(e){console.warn(e)}
}
const toE164=v=>{let d=v.replace(/[^\d+]/g,"");if(d.startsWith("00"))d="+"+d.slice(2);if(d.startsWith("+"))return d;if(d.startsWith("0"))return"+32"+d.slice(1);return"+32"+d};
const prettyPhone=p=>{const d=String(p||"").replace(/^\+?/,"+");return d.startsWith("+32")?"0"+d.slice(3).replace(/(\d{3})(\d{2})(\d{2})(\d{2})/,"$1 $2 $3 $4"):d};
async function accSendCode(channel,ident){
  ACC.busy=true;drawProfile();
  const {error}=await ACC.sb.auth.signInWithOtp(channel==="phone"?{phone:ident,options:{shouldCreateUser:true}}:{email:ident,options:{shouldCreateUser:true}});
  ACC.busy=false;
  if(error){toast(channel==="phone"?"SMS impossible, vérifiez le numéro":"Envoi impossible, réessayez",false);drawProfile();return}
  ACC.channel=channel;ACC.ident=ident;ACC.step="code";drawProfile();toast(channel==="phone"?"Code envoyé par SMS":"Code envoyé par e-mail");
  setTimeout(()=>{const i=$("#accCode");i&&i.focus()},350);
}
async function accVerify(code){
  ACC.busy=true;drawProfile();
  const {data,error}=await ACC.sb.auth.verifyOtp(ACC.channel==="phone"?{phone:ACC.ident,token:code,type:"sms"}:{email:ACC.ident,token:code,type:"email"});
  ACC.busy=false;
  if(error||!data||!data.user){toast("Code incorrect ou expiré",false);drawProfile();return}
  ACC.step="choose";toast("Connecté");await accSetUser(data.user);
}
async function accOAuth(provider){
  try{sessionStorage.setItem("alchimie-oauth","1")}catch(e){}
  const {error}=await ACC.sb.auth.signInWithOAuth({provider,options:{redirectTo:location.href.split("#")[0]}});
  if(error){try{sessionStorage.removeItem("alchimie-oauth")}catch(e){}toast("Connexion impossible pour le moment",false)}
}
async function accLogout(){try{await ACC.sb.auth.signOut()}catch(e){}ACC.user=null;ACC.orders=null;ACC.profile=null;ACC.points=null;ACC.ledger=[];ACC.team=false;update();drawProfile();toast("Déconnecté")}
async function accDeleteData(){
  if(ACC.user){try{await ACC.sb.from("orders").delete().eq("user_id",ACC.user.id);await ACC.sb.from("profiles").delete().eq("id",ACC.user.id)}catch(e){}}
  try{["alchimie-orders","alchimie-client","alchimie-track","alchimie-demo"].forEach(k=>localStorage.removeItem(k))}catch(e){}
  if(ACC.user)await accLogout();renderLive();
}

/* =====================================================================
   PROFIL : compte, points, historique
   ===================================================================== */
const getClient=()=>{try{return JSON.parse(localStorage.getItem("alchimie-client")||"{}")}catch(e){return{}}};
const setClient=c=>{try{localStorage.setItem("alchimie-client",JSON.stringify(c))}catch(e){}};
const getOrders=()=>{try{return JSON.parse(localStorage.getItem("alchimie-orders")||"[]")}catch(e){return[]}};
const histList=()=>ACC.user&&ACC.orders?ACC.orders:getOrders();
const PTS=CONFIG.points;
const loadScript=src=>new Promise((ok,ko)=>{if(document.querySelector(`script[src="${src}"]`))return ok();const sc=document.createElement("script");sc.src=src;sc.onload=ok;sc.onerror=ko;document.head.appendChild(sc)});
const fmtTok=t=>String(t||"").replace(/(.{3})(?=.)/g,"$1-");
async function accLoadPoints(){
  if(!ACC.user||!PTS.enabled)return;
  try{const {data,error}=await ACC.sb.rpc("my_points");if(error)throw error;ACC.points=+data||0}catch(e){ACC.points=null;console.warn(e)}
  try{const {data}=await ACC.sb.from("points_ledger").select("delta,reason,created_at").order("created_at",{ascending:false}).limit(6);ACC.ledger=data||[]}catch(e){ACC.ledger=[]}
}
function nextReward(n){return PTS.rewards.find(r=>r.pts>n)||null}
function pointsCardHTML(n,on){
  const R=PTS.rewards,max=R[R.length-1].pts,pct=Math.min(100,n/max*100);
  return `<div class="fwrap"><div class="fcard pcard3" id="fcard" role="img" aria-label="Carte de points : ${n} points">
    <div class="tp">${LOGO_LIGHT}<span>Carte de points</span></div>
    <div class="md"><span class="n">${on&&ACC.points===null?"–":n}<small>pts</small></span>
      <span class="trk2"><i style="width:${pct}%"></i>${R.map(r=>`<span class="mk ${n>=r.pts?"on":""}" style="left:${r.pts/max*100}%">${r.icon}</span>`).join("")}</span></div>
    <div class="ft2"><span>1 € = ${PTS.perEuro} point${PTS.perEuro>1?"s":""}</span><span>Waterloo · Ixelles</span></div>
    <span class="fglare"></span></div></div>`;
}
function pointsHTML(){
  const R=PTS.rewards;
  if(!ACC.user)return `<div class="mc-title" style="margin-top:22px">Mes points</div>${pointsCardHTML(0,false)}
    <div class="pc-info"><p>1 point par euro dépensé. Montrez votre QR en boutique.</p>
    <b style="color:var(--or-d)">${accOn()?"Connectez-vous ci-dessus pour avoir votre carte et cumuler des points.":"Bientôt disponible."}</b></div>`;
  const n=ACC.points??0,nx=nextReward(n),prev=[...R].reverse().find(r=>r.pts<=n);
  const dt=ts=>new Date(ts).toLocaleDateString("fr-BE",{day:"numeric",month:"short"});
  return `<div class="mc-title" style="margin-top:22px">Mes points</div>${pointsCardHTML(n,true)}
  <div class="fhint">Touchez la carte et faites-la bouger du doigt</div>
  <div class="pc-info"><p>${nx?`Encore <b>${nx.pts-n} pts</b> pour : ${nx.icon} ${esc(nx.label.toLowerCase())}`:`Bravo, tout est débloqué !`}</p>
    ${prev?`<p class="pc-ok">${prev.icon} <b>${esc(prev.label)}</b> disponible : demandez-le en boutique</p>`:""}</div>
  <button class="pts-big pc-btn" id="ptsQr">${QR_ICON}Montrer mon QR en boutique</button>
  ${ACC.ledger.length?`<div class="pts-h">${ACC.ledger.map(l=>`<div><span>${esc(l.reason||(l.delta>0?"Points gagnés":"Récompense"))}<small>${dt(l.created_at)}</small></span><b class="${l.delta>0?"p":"m"}">${l.delta>0?"+":""}${l.delta}</b></div>`).join("")}</div>`:""}`;
}
const QR_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/></svg>';
let qrT=null,qrPoll=null,qrExp=0,qrTok=null;
function stopQR(){clearInterval(qrT);clearInterval(qrPoll);qrT=qrPoll=null}
async function openQR(){
  view="qr";stopQR();qrTok=null;
  sheet.innerHTML=head("Ma carte "+CONFIG.short,"À montrer en boutique")+`<div class="sb"><div class="qrw">
    <div class="qrbox" id="qrBox"><div class="qrload">Création de votre QR…</div></div>
    <div class="qrtok" id="qrTok"></div><div class="qrexp" id="qrExp"></div>
    <div class="qrbal"><span>Votre solde</span><b id="qrBal">${ACC.points??"–"} pts</b></div>
    <p class="qrhint">Le QR change toutes les 10 minutes : une capture d'écran ne fonctionne pas longtemps. Augmentez la luminosité si le scan a du mal.</p>
    <button class="btn btn-light" id="qrBack">Retour au profil</button></div></div>`;
  bindClose();$("#qrBack").onclick=()=>{stopQR();drawProfile()};
  if(!sheet.classList.contains("open"))openSheet();
  try{await loadScript("assets/vendor/qrcode.min.js")}catch(e){$("#qrBox").innerHTML='<div class="qrload">QR indisponible, réessayez.</div>';return}
  const make=async()=>{
    let data=null,error=null;try{({data,error}=await ACC.sb.rpc("my_qr_token"))}catch(e){error=e}
    if(view!=="qr")return;
    if(error||!data){
      const m=String((error&&error.message)||"");console.warn("QR",error);qrExp=Date.now()+15e3;
      $("#qrBox").innerHTML=`<div class="qrload">${/function|schema cache|does not exist/i.test(m)?"Le système de points n'est pas encore activé sur le serveur.":/JWT|auth|non connect/i.test(m)?"Votre session a expiré : reconnectez-vous dans Mon profil.":"Impossible de créer le QR pour le moment."}<br><button class="lk" id="qrRetry" style="margin-top:10px;color:var(--or-d);font-weight:700">Réessayer</button></div>`;
      $("#qrTok").textContent="";const rb=$("#qrRetry");if(rb)rb.onclick=()=>{$("#qrBox").innerHTML='<div class="qrload">Création de votre QR…</div>';make()};
      return}
    qrTok=data;qrExp=Date.now()+9.5*60e3;
    const q=qrcode(0,"M");q.addData("ALCHIMIE:"+data);q.make();
    $("#qrBox").innerHTML=q.createSvgTag({cellSize:8,margin:2,scalable:true});$("#qrTok").textContent=fmtTok(data);
  };
  await make();
  qrT=setInterval(()=>{if(view!=="qr"){stopQR();return}const r=Math.max(0,qrExp-Date.now());
    const el=$("#qrExp");if(el)el.textContent=!qrTok?"":`Se renouvelle dans ${Math.floor(r/60e3)}:${String(Math.floor(r/1e3)%60).padStart(2,"0")}`;if(r<=0)make()},1000);
  qrPoll=setInterval(async()=>{if(view!=="qr"||document.hidden)return;const before=ACC.points;
    try{const {data}=await ACC.sb.rpc("my_points");const n=+data||0;if(before!==null&&n!==before){ACC.points=n;celebrate(n-before);accLoadPoints()}else ACC.points=n;const b=$("#qrBal");if(b)b.textContent=n+" pts"}catch(e){}},4000);
}
function celebrate(d){
  const el=document.createElement("div");el.className="ptsfx "+(d>0?"p":"m");el.innerHTML=`<b>${d>0?"+":""}${d}</b><span>${d>0?"points ajoutés !":"points utilisés"}</span>`;
  sheet.appendChild(el);setTimeout(()=>el.remove(),2600);if(navigator.vibrate)try{navigator.vibrate([20,60,30])}catch(e){}
}
const AI={
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
  email:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
  google:'<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>', apple:'',
};
function accCardHTML(){
  if(!accOn())return `<div class="acc"><h4>Compte ${esc(CONFIG.short)}</h4><p>Bientôt : connectez-vous pour retrouver vos commandes et vos points sur tous vos appareils. En attendant, votre historique est gardé sur ce téléphone.</p></div>`;
  if(ACC.user){const u=ACC.user,via=(u.app_metadata&&u.app_metadata.provider)||"email";
    const viaL={google:"Google",apple:"Apple",phone:"numéro",email:"e-mail"}[via]||via;
    return `<div class="acc in"><span><h4 style="font-size:15px">Connecté${viaL?` via ${viaL}`:""}</h4><p style="margin-top:2px">${esc(u.email||prettyPhone(u.phone)||"")}</p><span class="sync"><i></i>Historique et points synchronisés</span></span></div>`}
  const back=`<button class="lk" id="accBack">← Autres options</button>`;
  if(ACC.step==="code")return `<div class="acc"><h4>Entrez votre code</h4><p>Nous venons d'envoyer un code ${ACC.channel==="phone"?"par SMS au":"à"} <b style="color:#fff">${esc(ACC.channel==="phone"?prettyPhone(ACC.ident):ACC.ident)}</b>. Il peut mettre une minute à arriver.</p>
    <div class="af"><input class="code" id="accCode" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="••••••"><button class="ab ${ACC.busy?"dis":""}" id="accVerify">${ACC.busy?"…":"Valider"}</button></div>
    ${back} · <button class="lk" id="accResend">Renvoyer le code</button></div>`;
  if(ACC.step==="email")return `<div class="acc"><h4>Avec votre e-mail</h4><p>Nous vous envoyons un code, pas besoin de mot de passe.</p>
    <div class="af"><input id="accEmail" type="email" inputmode="email" autocomplete="email" placeholder="vous@email.com" value="${ACC.channel==="email"?esc(ACC.ident):""}"><button class="ab ${ACC.busy?"dis":""}" id="accSend">${ACC.busy?"…":"Recevoir"}</button></div>${back}</div>`;
  if(ACC.step==="phone")return `<div class="acc"><h4>Avec votre numéro</h4><p>Nous vous envoyons un code par SMS.</p>
    <div class="af"><input id="accPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0470 12 34 56" value="${esc(getClient().tel||"")}"><button class="ab ${ACC.busy?"dis":""}" id="accSendP">${ACC.busy?"…":"Recevoir"}</button></div>${back}</div>`;
  const P=ACC.prov,btns=[
    P.apple?`<button class="sso ap" data-sso="apple">${AI.apple}Continuer avec Apple</button>`:"",
    P.google?`<button class="sso go" data-sso="google">${AI.google}Continuer avec Google</button>`:"",
    P.phone?`<button class="sso" data-step="phone">${AI.phone}Continuer avec mon numéro</button>`:"",
    P.email?`<button class="sso" data-step="email">${AI.email}Continuer avec mon e-mail</button>`:"",
  ].join("");
  return `<div class="acc"><h4>Connectez-vous en 10 secondes</h4><p>Pas de mot de passe à retenir.</p>
    <div class="perksA"><span>Historique partout</span><span>Points fidélité</span><span>Recommander en 1 geste</span></div>
    <div class="ssos">${btns}</div></div>`;
}
function drawProfile(){
  view="profile";const c=getClient(),H=histList();
  const ini=(c.name||"").trim().charAt(0).toUpperCase();
  const dt=ts=>new Date(ts).toLocaleDateString("fr-BE",{day:"numeric",month:"short"});
  const sc=sheet.querySelector(".sb")?.scrollTop||0;
  sheet.innerHTML=head("Mon profil","")+`<div class="sb">
    <div class="pfh"><span class="av">${ini?esc(ini):`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/></svg>`}</span>
      <span><b>${c.name?`Bonjour ${esc(c.name.split(" ")[0])}`:"Bienvenue"}</b><span>${H.length?`${H.length} commande${H.length>1?"s":""}`:"Pas encore de commande"}</span></span></div>
    ${ACC.user&&ACC.team?`<a class="staff-go" href="staff/"><span class="ic">${QR_ICON}</span><span><b>Espace personnel</b><span>Commandes en direct et points clients</span></span><span class="ar">${I.arrow}</span></a>`:""}
    ${ACC.user?"":accCardHTML()}
    ${PTS.enabled?pointsHTML():""}
    <div class="mc-title" style="margin-top:22px">Mes commandes</div>
    ${H.length?H.slice(0,10).map((h,i)=>`<div class="ord"><div class="oh"><b>#${esc(h.num)}</b><span>${dt(h.ts)} · ${esc(SHOP(h.shop).name)}</span></div>
      <div class="oi">${(h.items||[]).map(l=>`${l.qty}× ${esc(l.name)}`).join(" · ")}</div>
      <div class="of"><b>${fmt(h.total)}</b><span>${h.track&&getTracks().some(t=>t.track===h.track&&t.status!=="done"&&t.status!=="cancelled")?`<button data-trk="${esc(h.track)}" style="margin-right:12px">Suivre</button>`:""}<button data-re="${i}">Recommander</button></span></div></div>`).join("")
      :`<div class="pempty">Vos commandes apparaîtront ici. Vous pourrez les recommander en un geste.</div>`}
    <div class="mc-title" style="margin-top:22px">Ma boutique</div>
    ${shopSegHTML()}
    ${ACC.user?`<div class="mc-title" style="margin-top:22px">Mon compte</div>${accCardHTML()}`:""}
    <div style="margin-top:14px">
      <a class="plink" href="#infos" id="pfInfos">Horaires, adresses & contact <span>›</span></a>
      <button class="plink" data-lg="privacy">Confidentialité <span>›</span></button>
      ${ACC.user?`<button class="plink" id="accOut"><span style="color:inherit;font-weight:600;font-size:15px">Se déconnecter</span> <span>›</span></button>`:""}
      ${H.length||c.name||ACC.user?`<button class="plink" id="pfClear" style="color:#c4302b"><span style="color:inherit;font-weight:600;font-size:15px">Effacer mes données</span> <span>›</span></button>`:""}
    </div>
  <div style="height:calc(20px + var(--sb))"></div></div>`;
  sheet.querySelector(".sb").scrollTop=sc;bindClose();bindTilt($("#fcard"));
  const pq=$("#ptsQr");if(pq)pq.onclick=openQR;
  sheet.querySelectorAll("[data-shop]").forEach(b=>b.onclick=()=>{S.shop=b.dataset.shop;update();renderStatus();renderFooter();accSaveProfile();drawProfile()});
  sheet.querySelectorAll("[data-trk]").forEach(b=>b.onclick=()=>openTrack(b.dataset.trk,false));
  sheet.querySelectorAll("[data-re]").forEach(b=>b.onclick=()=>{const h=histList()[+b.dataset.re];if(!h)return;h.items.forEach(l=>{const same=S.cart.find(x=>x.id===l.id&&x.opts===l.opts&&x.note===l.note&&x.name===l.name);if(same)same.qty+=l.qty;else S.cart.push({...l})});update();toast("Ajouté au panier");view="cart";drawCart()});
  $("#pfInfos").onclick=()=>closeSheet();
  sheet.querySelectorAll("[data-lg]").forEach(b=>b.onclick=()=>openLegal(b.dataset.lg));
  const cl=$("#pfClear");if(cl)cl.onclick=async()=>{if(cl.dataset.c){await accDeleteData();toast("Données effacées");drawProfile()}else{cl.dataset.c=1;cl.firstChild.textContent=ACC.user?"Confirmer : effacer compte et historique":"Confirmer l'effacement"}};
  sheet.querySelectorAll("[data-sso]").forEach(b=>b.onclick=()=>accOAuth(b.dataset.sso));
  sheet.querySelectorAll("[data-step]").forEach(b=>b.onclick=()=>{ACC.step=b.dataset.step;drawProfile();setTimeout(()=>{const i=$(ACC.step==="phone"?"#accPhone":"#accEmail");i&&i.focus()},200)});
  const em=$("#accEmail"),sd=$("#accSend");
  if(sd)sd.onclick=()=>{const v=em.value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){toast("Adresse e-mail invalide",false);return}accSendCode("email",v)};
  if(em)em.onkeydown=e=>{if(e.key==="Enter")sd.click()};
  const ph=$("#accPhone"),sp=$("#accSendP");
  if(sp)sp.onclick=()=>{const v=toE164(ph.value);if(v.replace(/\D/g,"").length<10){toast("Numéro invalide",false);return}accSendCode("phone",v)};
  if(ph)ph.onkeydown=e=>{if(e.key==="Enter")sp.click()};
  const cd=$("#accCode"),vf=$("#accVerify");
  if(vf)vf.onclick=()=>{const v=cd.value.replace(/\D/g,"");if(v.length<6){toast("Entrez le code reçu",false);return}accVerify(v)};
  if(cd){cd.oninput=()=>{cd.value=cd.value.replace(/\D/g,"")};cd.onkeydown=e=>{if(e.key==="Enter")vf.click()}}
  const bk=$("#accBack");if(bk)bk.onclick=()=>{ACC.step="choose";drawProfile()};
  const rs2=$("#accResend");if(rs2)rs2.onclick=()=>accSendCode(ACC.channel,ACC.ident);
  const out=$("#accOut");if(out)out.onclick=accLogout;
}
function bindTilt(el){
  if(!el)return;let rect=null,raf=0,last=null;
  const apply=()=>{raf=0;if(!last||!rect)return;
    const px=Math.min(1,Math.max(0,(last.x-rect.left)/rect.width)),py=Math.min(1,Math.max(0,(last.y-rect.top)/rect.height));
    const ry=(px-.5)*30,rx=(.5-py)*22;
    el.style.transform=`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.04)`;
    el.style.boxShadow=`${(-ry*.8).toFixed(1)}px ${(14+rx*.6).toFixed(1)}px 34px #2b1a0f40,0 0 0 1px #00000008`;
    el.style.setProperty("--gx",(px*100).toFixed(1)+"%");el.style.setProperty("--gy",(py*100).toFixed(1)+"%");};
  const move=e=>{last={x:e.clientX,y:e.clientY};if(!raf)raf=requestAnimationFrame(apply)};
  el.addEventListener("pointerdown",e=>{rect=el.getBoundingClientRect();el.classList.add("drag");try{el.setPointerCapture(e.pointerId)}catch(_){}move(e)});
  el.addEventListener("pointermove",e=>{if(el.classList.contains("drag"))move(e)});
  const end=()=>{el.classList.remove("drag");last=null;el.style.transform="";el.style.boxShadow=""};
  el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);el.addEventListener("lostpointercapture",end);
}
$("#pfBtn").onclick=()=>{drawProfile();openSheet()};
addEventListener("scroll",()=>$("#hdr").classList.toggle("stuck",scrollY>4),{passive:true});

/* =====================================================================
   UPDATE & INIT
   ===================================================================== */
document.fonts&&document.fonts.ready.then(setHH);
function update(){
  save();const t=totals();
  $("#cbar").classList.toggle("show",t.count>0);$("#cbN").textContent=t.count;$("#cbT").textContent=fmt(t.total);
  $("#pfBtn").classList.toggle("logged",!!ACC.user);
  renderBadges();
  if(view==="cart")drawCart();
}
setHH();renderHome();renderMenu();renderInfos();renderFooter();renderStatus();setInterval(renderStatus,60000);update();route();renderLive();Promise.resolve(accInit()).then(refreshLive);
