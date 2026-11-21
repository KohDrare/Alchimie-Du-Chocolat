/* =====================================================================
   CONFIG — à valider avec Jean-Sébastien et Géraldine
   ===================================================================== */
const CONFIG = {
  name: "L'alchimie du chocolat",
  short: "L'alchimie",
  /* Les deux boutiques. Horaires PROVISOIRES (fiche Waterloo : mardi → samedi 10:00–18:30), à confirmer pour Ixelles. */
  shops: [
    { id:"waterloo", name:"Waterloo", address:"Chaussée de Tervuren 12, 1410 Waterloo", phone:"3223544044", phoneDisplay:"02 354 40 44",
      hours:{ 0:null, 1:null, 2:["10:00","18:30"], 3:["10:00","18:30"], 4:["10:00","18:30"], 5:["10:00","18:30"], 6:["10:00","18:30"] } },
    { id:"ixelles", name:"Ixelles", address:"Rue des Hellènes 64, 1050 Ixelles", phone:"3226497766", phoneDisplay:"02 649 77 66",
      hours:{ 0:null, 1:null, 2:["10:00","18:30"], 3:["10:00","18:30"], 4:["10:00","18:30"], 5:["10:00","18:30"], 6:["10:00","18:30"] } },
  ],
  prepMinutes: 60,          // délai minimum pour une commande du jour
  slotStep: 30,             // créneaux de retrait toutes les 30 min
  preorderDays: 45,         // on peut réserver jusqu'à 45 jours à l'avance
  closedDates: [],          // jours de fermeture exceptionnelle, ex. ["2026-12-26","2027-01-01"]
  events: [                 // dates mises en avant dans le choix du jour
    { md:"12-06", label:"St-Nicolas" }, { md:"12-24", label:"Réveillon" }, { md:"12-25", label:"Noël" },
    { md:"12-31", label:"Nouvel An" }, { md:"02-14", label:"St-Valentin" },
  ],
  payment: "Bancontact, carte ou espèces, en boutique au moment du retrait",
  /* Points : le client montre son QR, le personnel scanne et ajoute des points (page /staff/).
     Mêmes valeurs à recopier en haut de staff/index.html. Récompenses PROVISOIRES. */
  points: {
    enabled: true,
    perEuro: 1,
    rewards: [
      { pts: 50,  label: "Un macaron offert",            icon: "✨" },
      { pts: 150, label: "Un écrin de 9 pralines offert", icon: "🎁" },
    ],
  },
  links: { instagram:"", facebook:"", googleReview:"" },   // "" = icône grisée « bientôt »
  legal: {
    company: "[Nom de la société exploitante]",
    form: "[Forme juridique — ex. SRL]",
    bce: "[Numéro d'entreprise BCE — ex. BE 0123.456.789]",
    email: "alchimieduchocolat@gmail.com",
  },
  /* Comptes clients + commandes en ligne (Supabase) — voir README.
     Vide = mode démo : le site fonctionne, mais les commandes ne partent pas en boutique. */
  account: { supabaseUrl: "https://istjezharogznveuhdlp.supabase.co", supabaseAnonKey: "sb_publishable_i7ccS-Up3k5PTbvP5Sd98w_xcE8YJL9" },
};

/* =====================================================================
   CARTE — prix PROVISOIRES, à valider
   ===================================================================== */
const SIZES=[
  {id:"e9",   label:"Écrin",  sub:"9 pralines",              n:9,  cols:3,rows:3,price:15},
  {id:"g250", label:"250 g",  sub:"≈ 20 pralines",           n:20, cols:5,rows:4,price:22},
  {id:"g500", label:"500 g",  sub:"≈ 40 pralines · 2 étages", n:40, cols:5,rows:4,price:42},
  {id:"g750", label:"750 g",  sub:"≈ 60 pralines · 3 étages", n:60, cols:5,rows:4,price:62},
  {id:"g1000",label:"1 kg",   sub:"≈ 80 pralines · 4 étages", n:80, cols:5,rows:4,price:80},
];
const o=(l,p=0)=>({label:l,price:p});
const SZ=Object.fromEntries(SIZES.map(s=>[s.id,s]));
const SIZEG=(from)=>({id:"taille",label:"Taille",type:"single",required:true,defaults:[SZ[from].label],
  options:SIZES.filter(s=>s.id!=="e9").map(s=>o(s.label,s.price-SZ[from].price))});
const PR=DATA.pralines, PRI={};PR.forEach(c=>c.items.forEach(i=>PRI[i.img]={...i,cat:c.id}));
const BALLO_CATS=PR.filter(c=>c.id!=="pdf");
const BALLO_KEYS=BALLO_CATS.flatMap(c=>c.items.map(i=>i.img));
const prImg=k=>`assets/p/${k}.webp`;
const prName=k=>{const p=PRI[k];if(!p)return k;return (p.ey&&!/^(Praliné|Praline|Gianduja|Origine|Manon|Pâte de fruits|Le classique)$/.test(p.ey)?p.ey+" ":"")+p.title+(p.cv?` (${p.cv})`:"")};
const prShort=k=>{const p=PRI[k];return p?p.title+(p.cv?` ${p.cv}`:""):k};
const T=(cat,img)=>{for(const c of DATA[cat])for(const i of c.items)if(i.img===img)return i;return{}};
const opts=(cat,ids)=>DATA[cat].filter(c=>!ids||ids.includes(c.id)).flatMap(c=>c.items.map(i=>o(i.title)));

const MENU=[
  {id:"fetes",title:"Fêtes & précommandes",hint:"Réservez maintenant, on prépare tout pour le jour choisi.",items:[
    {id:"x1",name:"Ballotin Saint-Nicolas",desc:"Pralinés speculoos noir et lait, Manon speculoos et craquentine. Environ 250 g.",price:22,tag:"6 décembre",until:"12-06",
     box:{s:"g250",mix:["speculoos-noir","speculoos-lait","manon-specu","craquentine-noir","craquentine-lait"]}},
    {id:"x2",name:"Ballotin des fêtes",desc:"L'assortiment de la maison, noué de son ruban de fêtes.",price:42,tag:"Noël",groups:[SIZEG("g500")],box:{s:"g500",mix:"all",seed:7}},
    {id:"x3",name:"Thé de Noël",desc:"Les éditions de fin d'année, en vrac. 100 g.",price:9.5,img:"assets/thes/the-noir-noel-a-paris-150x150-1.webp",sq:true,
     groups:[{id:"the",label:"Votre thé",type:"single",required:true,options:["Rooibos de Noël","Christmas tea vert","Noël à Pékin","Noël à Paris","Noël à St Pétersbourg","Christmas tea noir","Tisane de Noël"].map(l=>o(l))}]},
  ]},
  {id:"ballotins",title:"Ballotins",hint:"L'assortiment de la maison, ou le vôtre, composé à l'Atelier.",items:[
    {id:"b1",name:"Assortiment de la maison",desc:"Le choix du chocolatier : pralinés, ganaches, crème fraîche et confiseries.",price:22,tag:"Populaire",groups:[SIZEG("g250")],box:{s:"g250",mix:"all",seed:3}},
    {id:"b2",name:"Écrin découverte",desc:"9 pralines pour découvrir la maison. Idéal à offrir.",price:15,box:{s:"e9",mix:"all",seed:11}},
  ]},
  {id:"pralines",title:"Nos pralines",hint:"Touchez une praline pour la découvrir et l'ajouter à votre ballotin.",special:true,items:[]},
  {id:"napolitains",title:"Napolitains",hint:"Carrés fins de chocolat d'origine, du plus doux au plus intense.",items:[
    {id:"n1",name:"Boîte de napolitains",desc:"Six origines, du Ghana lait 40 % au Pérou 92 %.",price:12,img:"assets/napo/tanzanie.webp",c:"#66764a",
     groups:[{id:"napo",label:"Votre boîte",type:"single",required:true,defaults:["Assortiment des 6 origines"],options:[o("Assortiment des 6 origines"),...DATA.napo.map(n=>o(`${n.name} ${n.pct} %`))]}]},
  ]},
  {id:"palets",title:"Palets",hint:"Fins disques de chocolat relevés de fruits, d'épices ou de noix.",items:[
    {id:"pa1",name:"Palets chocolat noir 70 %",desc:"Gomashio, yuzu, gingembre, framboise, noix de pécan…",price:9,img:"assets/palets/mandarine.webp",c:T("palets","mandarine").color,
     groups:[{id:"pal",label:"Saveur",type:"single",required:true,options:opts("palets",["noir"])}]},
    {id:"pa2",name:"Palets chocolat au lait 38 %",desc:"Noisette du Piémont, amandes, sésame caramélisé.",price:9,img:"assets/palets/noisette-lait.webp",c:T("palets","noisette-lait").color,
     groups:[{id:"pal",label:"Saveur",type:"single",required:true,options:opts("palets",["lait"])}]},
  ]},
  {id:"macarons",title:"Macarons",hint:"",items:[
    {id:"m1",name:"Boîte de 6 macarons",desc:"Choisissez vos parfums, ou laissez-nous faire.",price:13,img:"assets/macarons/framboise.webp",c:T("macarons","framboise").color,
     groups:[{id:"mac",label:"Vos parfums",sub:"Jusqu'à 6 · sans choix = assortiment du chef",type:"multi",max:6,options:opts("macarons",["sucres"])}]},
    {id:"m2",name:"Boîte de 12 macarons",desc:"Pour partager.",price:25,img:"assets/macarons/pistache-1.webp",c:T("macarons","pistache-1").color,
     groups:[{id:"mac",label:"Vos parfums",sub:"Sans choix = assortiment du chef",type:"multi",max:10,options:opts("macarons",["sucres"])}]},
    {id:"m3",name:"Macarons apéritif",desc:"Figue & foie gras, saumon & aneth, tomate & basilic. Boîte de 12.",price:18,tag:"Salé",img:"assets/macarons/FFG-1-e1610026322241.webp",c:T("macarons","FFG-1-e1610026322241").color},
  ]},
  {id:"thes",title:"Thés & infusions",hint:"Thés Dammann en vrac, 100 g.",items:[
    {id:"t1",name:"Thés nature",desc:"Les grands crus, sans arôme ajouté.",price:8.5,img:"assets/thes/the-de-chine-yunnan-gfop-150x150-1.webp",sq:true,
     groups:[{id:"the",label:"Votre thé",type:"single",required:true,options:opts("thes",["nature"])}]},
    {id:"t2",name:"Thés aromatisés",desc:"Fruits, fleurs, épices et éditions de Noël.",price:9.5,img:"assets/thes/the-vert-miss-dammann-150x150-1.webp",sq:true,
     groups:[{id:"the",label:"Votre thé",type:"single",required:true,options:opts("thes",["aromatise"])}]},
    {id:"t3",name:"Infusions",desc:"Sans théine, à toute heure.",price:8,img:"assets/thes/tisane-du-roy-150x150-1.webp",sq:true,
     groups:[{id:"the",label:"Votre infusion",type:"single",required:true,options:opts("thes",["infusions"])}]},
  ]},
  {id:"pdf",title:"Pâtes de fruits",hint:"",items:[
    {id:"f1",name:"Pâtes de fruits",desc:"Abricot, groseille, poire, framboise, cassis et fruits exotiques.",price:10,img:"assets/p/pdf-framboise.webp",c:"#e7b8be"},
  ]},
];
/* Offres en grand sur l'accueil */
const OFFERS=[
  {kick:"Précommande",title:"Saint-Nicolas",sub:"Le ballotin speculoos, à retirer jusqu'au 6 décembre.",price:22,bg:"#6d2a1c",art:{imgs:["speculoos-noir","manon-specu","speculoos-lait"]},until:"12-06",go:{item:"x1"}},
  {kick:"L'Atelier",title:"Composez votre ballotin",sub:"Praline par praline, parmi plus de 45 créations.",bg:"#2b1a0f",art:{box:true},go:{view:"atelier"}},
  {kick:"Noël",title:"Les fêtes se préparent",sub:"Ballotins et thés de Noël : réservez votre jour de retrait.",bg:"#34452b",art:{fetes:true},until:"12-31",light:true,go:{cat:"fetes"}},
];
const PICKS=["x1","b1","b2","m1","n1","pa1"];
/* « Un petit plus ? » au moment de finaliser */
const EXTRAS=[
  {id:"b2",lab:"Écrin 9"},{id:"m1",lab:"6 macarons",opt:"Assortiment du chef"},
  {id:"f1",lab:"Pâtes de fruits"},{id:"n1",lab:"Napolitains",opt:"Assortiment des 6 origines"},{id:"pa1",lab:"Palets yuzu",opt:"Yuzu"},
];

/* =====================================================================
   HELPERS & STATE
   ===================================================================== */
const $=s=>document.querySelector(s);
const fmt=n=>new Intl.NumberFormat("fr-BE",{style:"currency",currency:"EUR"}).format(n);
const fmtS=n=>Number.isInteger(n)?n+" €":fmt(n);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const DAYS=["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const DAB=["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],MON=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const ITEMS=Object.fromEntries(MENU.flatMap(c=>c.items).map(i=>[i.id,i]));
const SHOP=id=>CONFIG.shops.find(s=>s.id===id)||CONFIG.shops[0];
const md=d=>String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const live=x=>!x.until||(md(new Date())<=x.until&&md(new Date())>=(x.from||"10-01")); // offre de saison : visible du 1er oct. à sa date limite
const I={
  plus:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 2v12M2 8h12"/></svg>',
  minus:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M2 8h12"/></svg>',
  x:'<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  arrow:'<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
  shop:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l1.5-5h13L20 10"/><path d="M4 10v9h16v-9"/><path d="M10 19v-4h4v4"/></svg>',
  spark:'<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
};
/* teinte claire pour les fonds des vignettes */
const tint=(hex,k=.62)=>{const n=parseInt((hex||"#c9a27e").slice(1),16),c=[n>>16,n>>8&255,n&255],b=[246,239,230];return"#"+c.map((v,i)=>Math.round(v*(1-k)+b[i]*k).toString(16).padStart(2,"0")).join("")};
const tile=(src,c,cls="",alt="")=>`<span class="tile ${cls}" style="--c:${tint(c)}"><img src="${src}" alt="${esc(alt)}" decoding="async" draggable="false"></span>`;

/* ---------- le ballotin, en SVG ---------- */
let rs=1;const rnd=s=>{rs=s;return()=>(rs=(rs*16807)%2147483647)/2147483647};
function mixPieces(n,pool,seed=1,skip){const r=rnd(seed*7919+n),P=(pool==="all"||!pool?BALLO_KEYS:pool).filter(k=>!skip||!skip(k)),out=[];
  if(!P.length)return out;
  if(pool&&pool!=="all"){for(let i=0;i<n;i++)out.push(P[i%P.length]);return out.sort(()=>r()-.5)}
  const bag=[...P].sort(()=>r()-.5);for(let i=0;i<n;i++)out.push(bag[i%bag.length]);return out}
const presetPieces=it=>{const s=SZ[it.box.s];return mixPieces(s.n,it.box.mix,it.box.seed||1)};
function boxSVG(sid,pieces,o={}){
  const s=SZ[sid],C=s.cols,R=s.rows,cell=56,pad=16,W=C*cell+pad*2,H=R*cell+pad*2,per=C*R,L=o.layer||0;
  let cells="";
  for(let j=0;j<per;j++){const idx=L*per+j;if(idx>=s.n)break;const cx=pad+cell/2+(j%C)*cell,cy=pad+cell/2+Math.floor(j/C)*cell,k=pieces&&pieces[idx];
    cells+=`<g class="slot" data-i="${idx}"><circle cx="${cx}" cy="${cy}" r="24.5" fill="url(#cupG)"/><circle cx="${cx}" cy="${cy}" r="25.5" fill="none" stroke="#cfb18b" stroke-width="2.6" stroke-dasharray="1.6 2.1"/>${k?`<image class="pc${o.drop===idx?" drop":""}" href="${prImg(k)}" x="${cx-23}" y="${cy-23}" width="46" height="46" preserveAspectRatio="xMidYMid meet"/>`:""}</g>`}
  const bow=`<g transform="translate(${W/2} ${H/2})"><path d="M0 0c-14-14-36-16-38-4s22 12 38 4z" fill="#b5c11a"/><path d="M0 0c14-14 36-16 38-4s-22 12-38 4z" fill="#b5c11a"/><path d="M-3 2l-14 22M3 2l14 22" stroke="#c6d41f" stroke-width="7" stroke-linecap="round"/><circle r="7.5" fill="#d4e03c"/></g>`;
  return `<svg class="box${o.closed?" closed":""}" viewBox="-4 -4 ${W+8} ${H+8}" ${o.id?`id="${o.id}"`:""} aria-hidden="true">
    <rect x="0" y="0" width="${W}" height="${H}" rx="16" fill="#4b2a00"/><rect x="6" y="6" width="${W-12}" height="${H-12}" rx="11" fill="#f6efe4" stroke="#c9a46a" stroke-width="1.5"/>
    ${cells}
    ${o.lid!==false?`<g class="lid"><rect x="0" y="0" width="${W}" height="${H}" rx="16" fill="#3d2717"/><rect x="8" y="8" width="${W-16}" height="${H-16}" rx="10" fill="none" stroke="#c9a46a" stroke-width="1.2" opacity=".7"/>
      <rect x="${W/2-8}" y="0" width="16" height="${H}" fill="#c6d41f"/><rect x="0" y="${H/2-8}" width="${W}" height="16" fill="#c6d41f"/>${bow}
      <text x="${W-18}" y="${H-16}" text-anchor="end" font-family="Allura,cursive" font-size="${Math.min(30,W/9)}" fill="#f3ece2">L'alchimie</text></g>`:""}
  </svg>`;
}
const boxMini=(sid,pieces)=>boxSVG(sid,pieces,{lid:false});
function media(it){
  if(it.box)return `<span class="tile" style="--c:${tint("#c9a27e",.5)}">${boxMini(it.box.s,presetPieces(it))}</span>`;
  return tile(it.img,it.c||"#c9a27e",it.sq?"sq":"",it.name);
}

let S={shop:"waterloo",cart:[],gift:false};
try{const s=JSON.parse(localStorage.getItem("alchimie-v1")||"null");if(s&&Array.isArray(s.cart))S={...S,...s};}catch(e){}
const save=()=>{try{localStorage.setItem("alchimie-v1",JSON.stringify(S))}catch(e){}};
const toMin=t=>{const[h,m]=t.split(":").map(Number);return h*60+m};
const toHM=m=>String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
function openState(shop){
  const H=SHOP(shop||S.shop).hours,d=new Date(),h=H[d.getDay()],n=nowMin();
  if(h&&n>=toMin(h[0])&&n<toMin(h[1]))return{open:true,text:`Ouvert · jusqu'à ${h[1]}`};
  if(h&&n<toMin(h[0]))return{open:false,text:`Ouvre à ${h[0]}`};
  for(let i=1;i<=7;i++){const dd=(d.getDay()+i)%7;if(H[dd])return{open:false,text:`Ouvre ${i===1?"demain":DAYS[dd].toLowerCase()} ${H[dd][0]}`}}
  return{open:false,text:"Fermé"};
}
function unitPrice(it,sel){let p=it.price;(it.groups||[]).forEach(g=>(sel[g.id]||[]).forEach(l=>{const x=g.options.find(o=>o.label===l);if(x)p+=x.price}));return p}
function totals(){const sub=S.cart.reduce((s,l)=>s+l.unit*l.qty,0);return{sub,total:sub,count:S.cart.reduce((s,l)=>s+l.qty,0)}}
let tt;function toast(m,ok=true){const el=$("#toast");el.innerHTML=(ok?I.check:"")+esc(m);el.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("show"),1800)}
const lineThumb=l=>l.box?`<span class="tile" style="--c:${tint("#c9a27e",.5)}">${boxMini(l.box.s,l.box.p)}</span>`:(ITEMS[l.id]?media(ITEMS[l.id]):"");

/* =====================================================================
   ROUTING
   ===================================================================== */
const VIEWS=["accueil","menu","infos"];
function route(){
  const h=(location.hash||"#accueil").slice(1);
  if(h==="atelier"){openAtelier();return}
  const fromAtl=$("#atl").classList.contains("on");closeAtelier();
  const v=VIEWS.includes(h)?h:(h.startsWith("c-")?"menu":"accueil");
  const changed=!$("#v-"+v).classList.contains("on");
  VIEWS.forEach(x=>$("#v-"+x).classList.toggle("on",x===v));
  document.querySelectorAll(".nav a").forEach(t=>t.classList.toggle("on",t.dataset.n===v));
  if(h.startsWith("c-"))setTimeout(()=>scrollToCat(h.slice(2)),30);
  else if(changed||!fromAtl)window.scrollTo(0,0);   // en revenant de l'atelier, on garde sa place
}
window.addEventListener("hashchange",route);
const go=v=>{if(location.hash==="#"+v)route();else location.hash=v};

/* =====================================================================
   ACCUEIL
   ===================================================================== */
function offerArt(f){
  if(f.art.box)return `<div class="collage"><span class="glow"></span>${boxSVG("g250",mixPieces(20,"all",5),{lid:false})}</div>`;
  if(f.art.imgs)return `<div class="collage"><span class="glow"></span>${f.art.imgs.map((k,i)=>`<img src="${prImg(k)}" alt="" style="transform:translate(${[-62,0,62][i]}%,${[8,-14,10][i]}%) rotate(${[-14,4,16][i]}deg) scale(${[1,1.18,1][i]})">`).join("")}</div>`;
  return `<div class="collage"><span class="glow"></span>${boxSVG("e9",mixPieces(9,"all",2),{closed:true})}<img class="side" src="assets/thes/the-noir-noel-a-paris-150x150-1.webp" alt=""></div>`;
}
function renderHome(){
  const OF=OFFERS.filter(live);
  $("#offers").innerHTML=OF.map((f,i)=>`<button class="offer art" style="--obg:${f.bg}" data-of="${i}">${offerArt(f)}
    <div class="in"><span class="kick${f.light?" lt":""}"><span class="dots" style="margin:0"><i></i><i></i></span>${f.kick}</span>
      <h2>${f.title}</h2><p>${f.sub}</p>
      <div class="foot">${f.price?`<span class="price"><b>${fmtS(f.price)}</b></span>`:"<span></span>"}<span class="go">${f.go.view==="atelier"?"Composer":f.go.item?"Réserver":"Découvrir"} ${I.arrow}</span></div></div></button>`).join("");
  $("#pager").innerHTML=OF.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("");
  const off=$("#offers");off.onscroll=()=>{const i=Math.round(off.scrollLeft/(off.firstElementChild.offsetWidth+12));[...$("#pager").children].forEach((d,j)=>d.classList.toggle("on",i===j))};
  off.querySelectorAll("[data-of]").forEach(b=>b.onclick=()=>{const g=OF[b.dataset.of].go;if(g.item)openItem(g.item);else if(g.cat)go("c-"+g.cat);else go(g.view)});
  const catImg={fetes:media(ITEMS.x2),ballotins:media(ITEMS.b2),pralines:tile(prImg("speculoos-noir"),PRI["speculoos-noir"].color),napolitains:media(ITEMS.n1),palets:media(ITEMS.pa1),macarons:media(ITEMS.m1),thes:media(ITEMS.t2),pdf:media(ITEMS.f1)};
  const short={fetes:"Fêtes",ballotins:"Ballotins",pralines:"Pralines",napolitains:"Napolitains",palets:"Palets",macarons:"Macarons",thes:"Thés",pdf:"Pâtes de fruits"};
  $("#homeCats").innerHTML=MENU.map(c=>`<a class="cat" href="#c-${c.id}"><span class="c">${catImg[c.id]}</span>${short[c.id]}</a>`).join("");
  $("#picks").innerHTML=PICKS.filter(id=>live(ITEMS[id])).map(id=>{const i=ITEMS[id];return `<button class="pick" data-i="${id}"><div class="im">${media(i)}${i.tag?`<span class="badge">${i.tag}</span>`:""}</div><div class="tx"><b>${i.name}</b><div class="row2"><span class="pr">${i.groups&&i.groups[0].id==="taille"?"dès ":""}${fmt(i.price)}</span><span class="plus">${I.plus}</span></div></div></button>`}).join("");
  $("#picks").querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>openItem(b.dataset.i));
  $("#atlTeaser").innerHTML=boxSVG("e9",mixPieces(9,"all",4),{lid:false});
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  const n=BALLO_KEYS.length;
  $("#proof").innerHTML=`<b>${n}</b><span>pralines faites maison, des pralinés aux ganaches d'origine.<br>Boutiques à Waterloo et Ixelles.</span>`;
}

/* =====================================================================
   CARTE
   ===================================================================== */
let prFilter="all";
function pralineCard(k,cnt){const p=PRI[k];return `<button class="pr-c" data-p="${k}">${tile(prImg(k),p.color,"",p.full)}${p.cv?`<span class="cvt">${p.cv}</span>`:""}${cnt?`<span class="cnt">${cnt}</span>`:""}<span class="ey">${esc(p.ey)}</span><b>${esc(p.title)}</b></button>`}
function pralinesHTML(){
  return `<div class="subpills" id="prSub">${[["all","Tout"],...PR.map(c=>[c.id,c.name])].map(([id,l])=>`<button data-sub="${id}" class="${prFilter===id?"on":""}">${l}</button>`).join("")}</div>
    <div class="pgrid">${PR.filter(c=>prFilter==="all"||c.id===prFilter).flatMap(c=>c.items.map(i=>pralineCard(i.img))).join("")}</div>`;
}
function bindPralines(root){
  root.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>openPraline(b.dataset.p));
  root.querySelectorAll("[data-sub]").forEach(b=>b.onclick=()=>{prFilter=b.dataset.sub;const w=$("#prWrap");w.innerHTML=pralinesHTML();bindPralines(w)});
}
function renderMenu(){
  $("#pills").innerHTML=MENU.map((c,i)=>`<a href="#c-${c.id}" data-c="${c.id}" class="${i?"":"on"}">${c.title.replace(" & précommandes","").replace("Thés & infusions","Thés")}</a>`).join("");
  $("#menuList").innerHTML=MENU.map(c=>`<section class="msec" id="c-${c.id}"><h2>${c.title}</h2>${c.hint?`<p class="hint">${c.hint}</p>`:""}
    ${c.id==="ballotins"?`<button class="atl-row" data-go="atelier">${boxSVG("e9",mixPieces(9,"all",8),{lid:false})}<span><b>Composez le vôtre</b><span>L'Atelier : choisissez chaque praline</span></span><span class="ar">${I.arrow}</span></button>`:""}
    ${c.special?`<div id="prWrap">${pralinesHTML()}</div>`:`<div class="list">${c.items.filter(live).map(i=>`<button class="row" data-i="${i.id}"><div class="txt"><h3>${i.name}${i.tag?`<span class="tag ${i.tag==="Populaire"?"":"ex"}">${i.tag}</span>`:""}</h3>${i.desc?`<p>${i.desc}</p>`:""}<div class="pr">${i.groups&&i.groups[0].id==="taille"?"dès ":""}${fmt(i.price)}</div></div>
      <span class="media"><span class="ph">${media(i)}</span><span class="add" aria-hidden="true">${I.plus}</span></span></button>`).join("")}</div>`}</section>`).join("");
  $("#menuList").querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>openItem(b.dataset.i));
  $("#menuList").querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  bindPralines($("#menuList"));
  $("#pills").querySelectorAll("a").forEach(a=>a.onclick=e=>{e.preventDefault();scrollToCat(a.dataset.c)});
  const links=[...document.querySelectorAll("#pills a")];
  let cur=null;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const id=e.target.id.slice(2);if(id===cur)return;cur=id;
    links.forEach(a=>a.classList.toggle("on",a.dataset.c===id));const on=links.find(a=>a.dataset.c===id),c=$("#pills");
    if(on)c.scrollTo({left:on.offsetLeft-c.clientWidth/2+on.clientWidth/2,behavior:"smooth"})}),{rootMargin:"-120px 0px -70% 0px"});
  document.querySelectorAll(".msec").forEach(s=>io.observe(s));
}
function scrollToCat(id){const t=document.getElementById("c-"+id);if(!t)return;const off=$("#hdr").offsetHeight+$("#pills").offsetHeight+8;window.scrollTo({top:t.getBoundingClientRect().top+scrollY-off,behavior:"smooth"})}
/* hauteur réelle de l'en-tête → la barre des catégories se colle juste dessous */
const setHH=()=>document.documentElement.style.setProperty("--hh",$("#hdr").offsetHeight+"px");
addEventListener("resize",setHH,{passive:true});
function renderBadges(){
  const q={};S.cart.forEach(l=>q[l.id]=(q[l.id]||0)+l.qty);
  document.querySelectorAll(".row[data-i]").forEach(b=>{const n=q[b.dataset.i];b.classList.toggle("in",!!n);b.querySelector(".add").innerHTML=n?n:I.plus});
  document.querySelectorAll(".pick[data-i]").forEach(b=>{const n=q[b.dataset.i];b.classList.toggle("in",!!n);b.querySelector(".plus").innerHTML=n?`<b style="font-size:13px">${n}</b>`:I.plus});
}

/* =====================================================================
   BOUTIQUES
   ===================================================================== */
const mapsUrl=s=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("L'alchimie du chocolat, "+s.address)}`;
function hoursList(s){const today=new Date().getDay();return [1,2,3,4,5,6,0].map(d=>`<li class="${d===today?"today":""} ${s.hours[d]?"":"off"}"><span>${DAYS[d]}</span><span>${s.hours[d]?s.hours[d].join(" – "):"Fermé"}</span></li>`).join("")}
function renderInfos(){
  $("#howSteps").innerHTML=[
    ["Composez votre commande","Ballotins, pralines, macarons, thés… ou un ballotin composé praline par praline à l'Atelier."],
    ["Choisissez la boutique, le jour et l'heure",`Waterloo ou Ixelles. Dès ${CONFIG.prepMinutes} min pour aujourd'hui, ou jusqu'à ${CONFIG.preorderDays} jours à l'avance.`],
    ["Passez la retirer","Votre commande vous attend, emballée. Vous suivez sa préparation en direct. Paiement sur place."],
  ].map((s,i)=>`<div class="st3"><span class="n">${i+1}</span><span><b>${s[0]}</b><p>${s[1]}</p></span></div>`).join("");
  $("#shopCards").innerHTML=CONFIG.shops.map(s=>{const st=openState(s.id);return `<div class="shopc"><div class="bd"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3>${s.name}</h3><span class="status ${st.open?"":"closed"}"><i></i><span>${st.text}</span></span></div>
    <div class="ad">${esc(s.address)}</div>
    <div class="act"><a class="pri" href="${mapsUrl(s)}" target="_blank" rel="noopener">Itinéraire</a><a href="tel:+${s.phone}">${s.phoneDisplay}</a></div>
    <ul>${hoursList(s)}</ul></div></div>`}).join("");
  $("#infoPay").textContent=CONFIG.payment+".";
  $("#infoPre").textContent=`Jusqu'à ${CONFIG.preorderDays} jours à l'avance : idéal pour Saint-Nicolas, Noël et les fêtes.`;
  document.querySelectorAll("#v-infos [data-lg]").forEach(b=>b.onclick=()=>openLegal(b.dataset.lg));
}
function renderStatus(){const s=openState();$("#status").classList.toggle("closed",!s.open);$("#status span").textContent=`${SHOP(S.shop).name} · ${s.text.replace("Ouvert · ","ouvert ")}`}

/* =====================================================================
   ATELIER — ballotin sur mesure (3 étapes : taille → pralines → récap)
   ===================================================================== */
let B;
const STEPS=["La taille","Les pralines","Votre ballotin"];
const bReset=()=>{B={step:0,size:"g250",pieces:new Array(20).fill(null),layer:0,cv:"all",nonut:false,qty:1,msg:"",busy:false}};bReset();
const bSize=()=>SZ[B.size];
const bCount=()=>B.pieces.filter(Boolean).length;
const bFull=()=>bCount()>=bSize().n;
const perLayer=()=>bSize().cols*bSize().rows;
const nLayers=()=>Math.ceil(bSize().n/perLayer());
const layerDone=i=>B.pieces.slice(i*perLayer(),(i+1)*perLayer()).every(Boolean);
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const cvOk=k=>{const p=PRI[k];return(B.cv==="all"||p.cv===B.cv)&&(!B.nonut||!/N/.test(p.al||""))};
const BACK_IC='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>';
function setSize(id){const old=B.pieces.filter(Boolean);B.size=id;const n=SZ[id].n;B.pieces=new Array(n).fill(null);old.slice(0,n).forEach((k,i)=>B.pieces[i]=k);B.layer=0}

function openAtelier(){const a=$("#atl");if(!a.classList.contains("on")){a.classList.add("on");a.setAttribute("aria-hidden","false");document.documentElement.style.overflow="hidden"}renderAtl()}
function closeAtelier(){const a=$("#atl");if(!a.classList.contains("on"))return;a.classList.remove("on");a.setAttribute("aria-hidden","true");document.documentElement.style.overflow=""}
$("#atlBack").onclick=()=>{if(B.step>0){B.step--;renderAtl()}else go("accueil")};
$("#atlReset").onclick=()=>{if(!bCount()&&B.step===0)return;bReset();renderAtl();toast("On recommence",false)};

function renderAtl(){
  $("#atlStep").textContent=`Étape ${B.step+1} sur 3 · ${STEPS[B.step]}`;
  [...$("#atlDots").children].forEach((d,i)=>d.className=i<B.step?"is-done":i===B.step?"is-cur":"");
  const body=$("#atlBody"),foot=$("#atlFoot");body.className="atl-body"+(B.step===1?" fill":"");
  if(B.step===0){
    body.innerHTML=`<div class="scrl"><div class="lead"><h2>Quelle taille ?</h2><p>Vous choisirez ensuite chaque praline.</p></div>
      <div class="sizes">${SIZES.map(s=>`<button class="sz ${s.id===B.size?"sel":""}" data-sz="${s.id}" aria-pressed="${s.id===B.size}"><span class="ck">${I.check}</span><span class="vis">${boxMini(s.id,[])}</span><b>${s.label}</b><span>${s.sub}</span><em>${fmt(s.price)}</em></button>`).join("")}</div>
      <p class="note-s">Poids indicatif : environ 12 g par praline. Le prix final est confirmé en boutique.</p></div>`;
    foot.innerHTML=`<button class="btn btn-dark" id="atlNext">Choisir mes pralines ${I.arrow}</button>`;
    body.querySelectorAll("[data-sz]").forEach(b=>b.onclick=()=>{if(b.dataset.sz===B.size)return;setSize(b.dataset.sz);
      body.querySelectorAll("[data-sz]").forEach(x=>{const on=x===b;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on)})});
    $("#atlNext").onclick=()=>{B.step=1;renderAtl()};
    return;
  }
  if(B.step===1){
    body.innerHTML=`<div class="fill-top"><div class="bbox" id="bbox"></div><div class="lytabs" id="lytabs"></div>
        <div class="count"><b id="cntT"></b><span id="cntS"></span></div><div class="fillbar" id="fbar"><i></i></div></div>
      <div class="tools" id="tools"></div>
      <div class="scrl" id="bsc"></div>`;
    foot.innerHTML=`<button class="ic-b back" id="atlPrev" aria-label="Changer de taille">${BACK_IC}</button><button class="btn" id="atlNext"></button>`;
    $("#atlPrev").onclick=()=>{B.step=0;renderAtl()};
    $("#atlNext").onclick=()=>{if(!bFull()){const r=bSize().n-bCount();toast(`Encore ${r} praline${r>1?"s":""} à choisir`,false);return}B.step=2;renderAtl();vib(14)};
    drawBox();drawTools();drawGrid();updateFill();
    /* la boîte se fait plus petite quand on parcourt les pralines */
    const sc=$("#bsc"),top=body.querySelector(".fill-top");let cp=false;
    sc.addEventListener("scroll",()=>{const c=sc.scrollTop>24;if(c!==cp){cp=c;top.classList.toggle("compact",c)}},{passive:true});
    return;
  }
  /* récap */
  const g={};B.pieces.forEach(k=>{if(k)g[k]=(g[k]||0)+1});
  body.innerHTML=`<div class="scrl"><div class="recap-box">${boxSVG(B.size,B.pieces,{id:"bxR"})}</div>
    <div class="lead" style="padding-top:6px"><h2>Ballotin ${bSize().label}</h2><p>${bSize().n} pralines · ${fmt(bSize().price)}</p></div>
    <div class="rlist">${Object.entries(g).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<div class="rl">${tile(prImg(k),PRI[k].color)}<span>${esc(PRI[k].full)}</span><b>×${n}</b></div>`).join("")}</div>
    <div class="fld msg"><div class="in"><label for="bMsg">Un petit mot sur la carte ? (optionnel)</label><input id="bMsg" maxlength="140" placeholder="Ex. Joyeux anniversaire Maman !" value="${esc(B.msg)}"></div></div></div>`;
  foot.innerHTML=`<div class="stepper"><button id="aqm" aria-label="Moins">${I.minus}</button><span id="aqv">${B.qty}</span><button id="aqp" aria-label="Plus">${I.plus}</button></div><button class="btn btn-or" id="atlAdd"></button>`;
  const lbl=()=>{$("#aqv").textContent=B.qty;$("#atlAdd").textContent=`Ajouter · ${fmt(bSize().price*B.qty)}`};lbl();
  $("#aqm").onclick=()=>{if(B.qty>1){B.qty--;lbl()}};$("#aqp").onclick=()=>{B.qty++;lbl()};
  $("#bMsg").oninput=e=>B.msg=e.target.value;$("#atlAdd").onclick=addBallotin;
  requestAnimationFrame(()=>setTimeout(()=>{const x=$("#bxR");x&&x.classList.add("closed")},120));
}
/* la boîte : dessinée une fois par étage, puis mise à jour alvéole par alvéole */
function drawBox(){
  $("#bbox").innerHTML=boxSVG(B.size,B.pieces,{layer:B.layer,lid:false,id:"bx"});
  $("#bbox").querySelectorAll(".slot").forEach(g=>g.onclick=()=>removePiece(+g.dataset.i));
  const L=nLayers(),t=$("#lytabs");
  t.style.display=L>1?"":"none";
  t.innerHTML=L>1?Array.from({length:L},(_,i)=>`<button data-ly="${i}" class="${i===B.layer?"on":""} ${layerDone(i)?"ok":""}">Étage ${i+1}</button>`).join(""):"";
  t.querySelectorAll("[data-ly]").forEach(b=>b.onclick=()=>{B.layer=+b.dataset.ly;drawBox()});
}
function setSlot(i,k,anim){
  const g=$(`#bx .slot[data-i="${i}"]`);if(!g)return;
  const old=g.querySelector(".pc");
  if(!k){if(old){old.classList.add("out");setTimeout(()=>old.remove(),200)}return}
  if(old)old.remove();
  const c=g.querySelector("circle"),cx=+c.getAttribute("cx"),cy=+c.getAttribute("cy");
  const im=document.createElementNS("http://www.w3.org/2000/svg","image");
  im.setAttribute("class","pc"+(anim?" drop":""));im.setAttribute("href",prImg(k));
  im.setAttribute("x",cx-23);im.setAttribute("y",cy-23);im.setAttribute("width",46);im.setAttribute("height",46);
  g.appendChild(im);
}
function drawTools(){
  const t=$("#tools");
  t.innerHTML=`${[["all","Tous"],["noir","Noir"],["lait","Lait"],["blanc","Blanc"]].map(([k,l])=>`<button data-cv="${k}" class="${B.cv===k?"on":""}">${l}</button>`).join("")}
    <button id="nonut" class="${B.nonut?"on":""}">Sans fruits à coque</button><span class="sep"></span>
    <button class="mag" id="bAuto">${I.spark}Compléter pour moi</button><button id="bClear">Vider</button>`;
  t.querySelectorAll("[data-cv]").forEach(b=>b.onclick=()=>{B.cv=b.dataset.cv;drawTools();drawGrid()});
  $("#nonut").onclick=()=>{B.nonut=!B.nonut;drawTools();drawGrid()};
  $("#bAuto").onclick=autoFill;
  $("#bClear").onclick=()=>{if(!bCount())return;B.pieces=B.pieces.map(()=>null);B.layer=0;drawBox();updateFill()};
}
function drawGrid(){
  const sc=$("#bsc"),y=sc.scrollTop;
  const html=BALLO_CATS.map(c=>{const L=c.items.filter(i=>cvOk(i.img));return L.length?`<div class="bcat">${c.name}</div><div class="pgrid sm">${L.map(i=>pickCard(i.img)).join("")}</div>`:""}).join("");
  sc.innerHTML=html||`<div class="pempty">Aucune praline avec ces filtres.</div>`;
  sc.scrollTop=y;
  sc.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>addPiece(b.dataset.p,b));
}
function pickCard(k){const p=PRI[k];return `<button class="pr-c" data-p="${k}" aria-label="Ajouter ${esc(p.full)}"><span class="imgw">${tile(prImg(k),p.color,"",p.full)}<span class="add1">${I.plus}</span></span>${p.cv?`<span class="cvt">${p.cv}</span>`:""}<span class="ey">${esc(p.ey)}</span><b>${esc(p.title)}</b></button>`}
function updateFill(){
  if(B.step!==1)return;
  const n=bCount(),N=bSize().n,full=n===N;
  $("#cntT").textContent=full?"C'est complet !":`Ballotin ${bSize().label}`;
  $("#cntS").innerHTML=`<strong>${n}</strong> / ${N} pralines · ${fmt(bSize().price)}`;
  $("#fbar").classList.toggle("full",full);$("#fbar i").style.width=(n/N*100)+"%";
  const nx=$("#atlNext");nx.className="btn "+(full?"btn-or":"btn-dark");nx.innerHTML=full?`Fermer le ballotin ${I.arrow}`:`Encore ${N-n} praline${N-n>1?"s":""}`;
  const cnt={};B.pieces.forEach(k=>{if(k)cnt[k]=(cnt[k]||0)+1});
  $("#bsc").querySelectorAll("[data-p]").forEach(b=>{const q=cnt[b.dataset.p]||0,c=b.querySelector(".cnt");b.classList.toggle("full",full);
    if(q){if(!c)b.querySelector(".imgw").insertAdjacentHTML("beforeend",`<span class="cnt">${q}</span>`);else if(c.textContent!=q)c.textContent=q}else if(c)c.remove()});
  $("#lytabs").querySelectorAll("[data-ly]").forEach((b,i)=>b.classList.toggle("ok",layerDone(i)));
}
function addPiece(k,btn){
  if(B.busy)return;
  const idx=B.pieces.indexOf(null);
  if(idx<0){toast("Ballotin complet : touchez une praline dans la boîte pour la retirer",false);return}
  B.pieces[idx]=k;vib(8);
  const ly=Math.floor(idx/perLayer());if(ly!==B.layer){B.layer=ly;drawBox();setSlot(idx,null);}
  const tgt=$(`#bx .slot[data-i="${idx}"] circle`),src=btn&&btn.querySelector(".tile");
  const done=()=>{setSlot(idx,k,true);updateFill()};
  if(src&&tgt&&document.documentElement.animate&&!matchMedia("(prefers-reduced-motion:reduce)").matches)fly(src,tgt,k,done);else done();
}
function removePiece(i){if(!B.pieces[i])return;B.pieces[i]=null;setSlot(i,null);updateFill();vib(6)}
function autoFill(){
  const pool=BALLO_KEYS.filter(cvOk);if(!pool.length)return;
  const free=B.pieces.map((k,i)=>k?null:i).filter(i=>i!==null);if(!free.length){toast("Le ballotin est déjà complet",false);return}
  const r=rnd(Date.now()%100000),bag=[];free.forEach((i,j)=>{if(j%pool.length===0)bag.push(...[...pool].sort(()=>r()-.5));B.pieces[i]=bag[j]});
  drawBox();updateFill();toast(`${free.length} praline${free.length>1?"s":""} choisie${free.length>1?"s":""} par le chocolatier`)}
function fly(fromEl,toEl,k,done){
  B.busy=true;
  const a=fromEl.getBoundingClientRect(),b=toEl.getBoundingClientRect(),sz=Math.min(a.width,a.height)*.8;
  const el=document.createElement("img");el.src=prImg(k);el.className="fly";el.alt="";
  el.style.cssText=`left:${a.left+(a.width-sz)/2}px;top:${a.top+(a.height-sz)/2}px;width:${sz}px;height:${sz}px`;
  document.body.appendChild(el);
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2),sc=b.width/sz;
  const an=el.animate([{transform:"translate(0,0) scale(1)"},{transform:`translate(${dx*.55}px,${dy*.55-40}px) scale(${(1+sc)/2})`,offset:.6},{transform:`translate(${dx}px,${dy}px) scale(${sc})`}],{duration:380,easing:"cubic-bezier(.45,0,.25,1)"});
  const end=()=>{el.remove();B.busy=false;done()};an.onfinish=end;an.oncancel=end;
}
function compText(pieces){const g={};pieces.forEach(k=>{if(k)g[k]=(g[k]||0)+1});return Object.entries(g).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`${n}× ${prShort(k)}`).join(", ")}
function addBallotin(){
  if(B.busy)return;B.busy=true;
  const s=bSize();
  S.cart.push({id:"atelier",name:`Ballotin ${s.label} · sur mesure`,opts:compText(B.pieces),note:B.msg.trim()?`Carte : « ${B.msg.trim()} »`:"",unit:s.price,qty:B.qty,box:{s:s.id,p:[...B.pieces]}});
  update();toast(`${B.qty>1?B.qty+"× ":""}Ballotin ajouté au panier`);
  bReset();go("accueil");setTimeout(()=>{view="cart";drawCart();openSheet()},320);
}
/* depuis la fiche d'une praline */
function pralineToBallotin(k){
  if(B.step!==1)B.step=1;
  closeSheet();go("atelier");
  setTimeout(()=>{if(bFull()){toast("Votre ballotin est complet",false);return}addPiece(k,null);toast(`${prShort(k)} ajoutée au ballotin`)},330);
}

/* =====================================================================
   FICHES : produit, praline, panier, finaliser
   ===================================================================== */
let view=null;const sheet=$("#sheet");
function openSheet(){$("#scrim").classList.add("open");sheet.classList.add("open");document.documentElement.style.overflow="hidden"}
function closeSheet(){if(typeof stopQR==="function")stopQR();clearInterval(trkTimer);$("#scrim").classList.remove("open");sheet.classList.remove("open");if(!$("#atl").classList.contains("on"))document.documentElement.style.overflow="";view=null}
$("#scrim").onclick=closeSheet;document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
const head=(title,sub)=>`<div class="grab"></div><div class="sh"><div class="tt"><h3>${title}</h3>${sub?`<p>${sub}</p>`:""}</div><button class="x" data-close aria-label="Fermer">${I.x}</button></div>`;
const bindClose=()=>sheet.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeSheet);
(()=>{let y0=null,dy=0;sheet.addEventListener("touchstart",e=>{if(e.target.closest(".fcard")){y0=null;return}const sb=sheet.querySelector(".sb");if(sb&&sb.scrollTop>0&&!e.target.closest(".sh,.grab,.shimg"))return;y0=e.touches[0].clientY;dy=0},{passive:true});
 sheet.addEventListener("touchmove",e=>{if(y0===null)return;dy=e.touches[0].clientY-y0;if(dy>0){sheet.style.transition="none";sheet.style.transform=`translate(-50%,${dy}px)`}},{passive:true});
 sheet.addEventListener("touchend",()=>{if(y0===null)return;sheet.style.transition="";sheet.style.transform="";if(dy>110)closeSheet();y0=null})})();

const AL_L={G:"Gluten",N:"Fruits à coque"};
function openPraline(k){
  const p=PRI[k];view="praline";const cat=PR.find(c=>c.id===p.cat);
  const inBallo=p.cat!=="pdf";
  sheet.innerHTML=`<div class="shimg">${tile(prImg(k),p.color,"",p.full)}<div class="grab"></div><button class="x" data-close aria-label="Fermer">${I.x}</button></div>
    <div class="sh"><div class="tt"><span class="tag">${esc(cat.name)}</span><div class="ey2">${esc(p.ey)}</div><h3 style="margin-top:2px">${esc(p.title)}</h3><p>${esc(p.full)}</p>
      <div class="chipsI">${p.cv?`<span>Chocolat ${p.cv==="lait"?"au lait":p.cv}</span>`:""}${(p.al||"").split("").filter(c=>AL_L[c]).map(c=>`<span class="al">${AL_L[c]}</span>`).join("")}</div></div></div>
    <div class="sb"><p class="note" style="margin-top:4px">${inBallo?"Faite maison dans notre atelier. Ajoutez-la à un ballotin composé par vous : 9, 20, 40, 60 ou 80 pralines.":"Vendues en boîte : voir « Pâtes de fruits » dans la carte."}</p></div>
    <div class="sf">${inBallo?`<button class="btn btn-or" id="toB">Ajouter à mon ballotin</button>`:`<button class="btn btn-dark" id="toF">Voir les pâtes de fruits</button>`}</div>`;
  bindClose();
  const tb=$("#toB");if(tb)tb.onclick=()=>pralineToBallotin(k);
  const tf=$("#toF");if(tf)tf.onclick=()=>{closeSheet();go("c-pdf")};
  openSheet();
}
function openItem(id){
  const it=ITEMS[id];const sel={};let qty=1;(it.groups||[]).forEach(g=>sel[g.id]=g.defaults?[...g.defaults]:[]);view="item";
  const pieces=it.box?presetPieces(it):null;
  const draw=()=>{
    const scroll=sheet.querySelector(".sb")?.scrollTop||0;const note=sheet.querySelector("#iNote")?.value||"";
    const missing=(it.groups||[]).filter(g=>g.required&&!(sel[g.id]||[]).length);
    const sz=it.box&&sel.taille?SIZES.find(s=>s.label===sel.taille[0]):null,sid=sz?sz.id:it.box&&it.box.s;
    const vis=it.box?`<span class="tile" style="--c:${tint("#c9a27e",.45)}">${boxSVG(sid,mixPieces(SZ[sid].n,it.box.mix,it.box.seed||1),{lid:false})}</span>`:media(it);
    sheet.innerHTML=`<div class="shimg">${vis}<div class="grab"></div><button class="x" data-close aria-label="Fermer">${I.x}</button></div>
      <div class="sh"><div class="tt">${it.tag?`<span class="tag ${it.tag==="Populaire"?"":"ex"}">${it.tag}</span>`:""}<h3 style="margin-top:${it.tag?6:0}px">${it.name}</h3>${it.desc?`<p>${it.desc}</p>`:""}<div class="pr">${fmt(unitPrice(it,sel))}</div></div></div>
      <div class="sb">${(it.groups||[]).map(g=>{const v=sel[g.id]||[];const ok=g.required&&v.length;
        return `<div class="grp"><div class="gh"><b>${g.label}</b><span class="${g.required?(ok?"ok":"req"):""}">${g.required?(ok?"✓":"Obligatoire"):"Optionnel"}</span></div>${g.sub?`<div class="gsub">${g.sub}</div>`:""}
        ${g.options.map(op=>{const on=v.includes(op.label);const full=g.type==="multi"&&!on&&v.length>=g.max;
          return `<label class="opt ${full?"off":""}"><span class="l">${op.label}</span>${op.price?`<span class="pp">${op.price>0?"+":""}${fmt(op.price)}</span>`:""}<input type="${g.type==="single"?"radio":"checkbox"}" name="g-${g.id}" data-g="${g.id}" value="${esc(op.label)}" ${on?"checked":""}></label>`}).join("")}</div>`}).join("")}
        ${it.box?`<button class="to-atl" id="toAtl" style="background:var(--dark);color:#fff">${boxSVG("e9",mixPieces(9,"all",9),{lid:false})}<span><b>Envie de choisir vous-même ?</b><span>Composez votre ballotin à l'Atelier</span></span><span class="ar">${I.arrow}</span></button>`:""}
        <div class="grp"><div class="gh"><b>Une précision ?</b><span>Optionnel</span></div><div class="fld" style="margin-top:8px"><div class="in"><label for="iNote">Note pour la boutique</label><input id="iNote" maxlength="80" placeholder="${it.box?"Ex. sans alcool, plutôt noir…":"Ex. pour offrir"}"></div></div></div>
      </div>
      <div class="sf"><div class="stepper"><button id="qm" aria-label="Moins">${I.minus}</button><span id="qv">${qty}</span><button id="qp" aria-label="Plus">${I.plus}</button></div>
        <button class="btn btn-or ${missing.length?"dis":""}" id="addBtn">${missing.length?`Choisissez ${missing[0].label.toLowerCase()}`:`Ajouter · ${fmt(unitPrice(it,sel)*qty)}`}</button></div>`;
    const sbx=sheet.querySelector(".sb"),shi=sheet.querySelector(".shimg");sbx.scrollTop=scroll;sheet.querySelector("#iNote").value=note;bindClose();
    const H0=shi.offsetHeight||220,HMIN=84,shrink=()=>{const h=Math.max(HMIN,H0-sbx.scrollTop);shi.style.height=h+"px";shi.classList.toggle("mini",h<=HMIN+20)};
    sbx.addEventListener("scroll",shrink,{passive:true});shrink();
    sheet.querySelectorAll("input[data-g]").forEach(inp=>inp.onchange=()=>{const g=it.groups.find(x=>x.id===inp.dataset.g);sel[g.id]=g.type==="single"?[inp.value]:(inp.checked?[...sel[g.id],inp.value]:sel[g.id].filter(v=>v!==inp.value));draw()});
    const lbl=()=>{const b=$("#addBtn");if(!b.classList.contains("dis"))b.textContent=`Ajouter · ${fmt(unitPrice(it,sel)*qty)}`;$("#qv").textContent=qty};
    $("#qm").onclick=()=>{if(qty>1){qty--;lbl()}};$("#qp").onclick=()=>{qty++;lbl()};
    const ta=$("#toAtl");if(ta)ta.onclick=()=>{closeSheet();bReset();if(sid&&sid!=="e9")setSize(sid);go("atelier")};
    $("#addBtn").onclick=()=>{
      let o=(it.groups||[]).map(g=>{const v=sel[g.id]||[];if(g.id==="mac"&&!v.length)return"Assortiment du chef";return v.join(", ")}).filter(Boolean).join(" · ");
      const n=$("#iNote").value.trim();const same=S.cart.find(l=>l.id===it.id&&l.opts===o&&l.note===n);
      const box=it.box?{s:sid,p:mixPieces(SZ[sid].n,it.box.mix,it.box.seed||1)}:null;
      if(same)same.qty+=qty;else S.cart.push({id:it.id,name:it.name,opts:o,note:n,unit:unitPrice(it,sel),qty,...(box?{box}:{})});
      closeSheet();update();toast(`${qty>1?qty+"× ":""}${it.name} ajouté`);
    };
  };
  draw();openSheet();
}

function shopSegHTML(){return `<div class="shopseg">${CONFIG.shops.map(s=>`<button data-shop="${s.id}" aria-pressed="${S.shop===s.id}"><b>${s.name}</b><small>${esc(s.address.split(",")[0])}</small></button>`).join("")}</div>`}
function drawCart(){
  const sc=sheet.querySelector(".sb")?.scrollTop||0;const t=totals();
  sheet.innerHTML=head("Votre panier",S.cart.length?`${t.count} article${t.count>1?"s":""}`:"")+`<div class="sb">
    ${S.cart.length?S.cart.map((l,i)=>`<div class="cl"><span class="th">${lineThumb(l)}</span><div class="d"><b>${esc(l.name)}</b>${l.opts?`<small>${esc(l.opts.length>140?l.opts.slice(0,140)+"…":l.opts)}</small>`:""}${l.note?`<small>${esc(l.note)}</small>`:""}<div class="p">${fmt(l.unit*l.qty)}</div></div>
      <div class="qs"><button data-dec="${i}" aria-label="Retirer">${l.qty===1?I.x:I.minus}</button><span>${l.qty}</span><button data-inc="${i}" aria-label="Ajouter">${I.plus}</button></div></div>`).join("")
      :`<div class="empty">${boxSVG("e9",[],{lid:false})}Votre panier est vide.<br><span style="font-size:13.5px">Une petite praline ?</span></div>`}
    ${S.cart.length?`<div class="mc-title">Retrait dans quelle boutique ?</div>${shopSegHTML()}<p class="note">Choisissez le jour et l'heure à l'étape suivante. Paiement en boutique.</p>`:""}
    ${S.cart.length?`<div class="sum" style="margin-top:8px"><div class="t"><span>Total</span><span>${fmt(t.total)}</span></div></div>`:""}
    ${S.cart.length&&PTS.enabled?`<div class="stamps-line"><i>${I.check}</i>${ACC.user?`+${Math.floor(t.total*PTS.perEuro)} points avec votre QR en boutique`:`Connectez-vous pour gagner ${Math.floor(t.total*PTS.perEuro)} points`}</div>`:""}
  </div><div class="sf">${S.cart.length?`<button class="btn btn-or" id="goCo">Continuer · ${fmt(t.total)}</button>`:`<button class="btn btn-dark" id="goMenu">Voir la carte</button>`}</div>`;
  bindClose();
  sheet.querySelectorAll("[data-shop]").forEach(b=>b.onclick=()=>{S.shop=b.dataset.shop;update();renderStatus();renderFooter()});
  sheet.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{S.cart[b.dataset.inc].qty++;update()});
  sheet.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const l=S.cart[b.dataset.dec];l.qty--;if(l.qty<=0)S.cart.splice(b.dataset.dec,1);update()});
  const g=$("#goCo");if(g)g.onclick=openCheckout;const gm=$("#goMenu");if(gm)gm.onclick=()=>{closeSheet();go("menu")};
  sheet.querySelector(".sb").scrollTop=sc;
}
$("#qrBtn").onclick=()=>{
  if(ACC.user&&PTS.enabled){openQR();return}
  view="profile";drawProfile();openSheet();toast(accOn()?"Connectez-vous pour avoir votre QR":"Bientôt disponible",false);
};
$("#openCart").onclick=()=>{view="cart";drawCart();openSheet()};

/* jours et créneaux de retrait */
function days(){const sh=SHOP(S.shop),out=[],d=new Date();
  for(let i=0;i<=CONFIG.preorderDays;i++){const dd=new Date(d);dd.setDate(d.getDate()+i);const h=sh.hours[dd.getDay()];if(!h||CONFIG.closedDates.includes(iso(dd)))continue;
    const ev=CONFIG.events.find(e=>e.md===md(dd));
    out.push({off:i,h,date:dd,top:i===0?"Auj.":i===1?"Demain":DAB[dd.getDay()],num:dd.getDate(),mon:MON[dd.getMonth()],ev:ev&&ev.label,
      label:i===0?"Aujourd'hui":i===1?"Demain":`${DAYS[dd.getDay()]} ${dd.getDate()} ${MON[dd.getMonth()]}`})}
  return out}
function slots(day){const n=nowMin(),op=toMin(day.h[0]),cl=toMin(day.h[1]),st0=CONFIG.slotStep;
  let st=Math.ceil((op+st0)/st0)*st0;if(day.off===0)st=Math.max(st,Math.ceil((n+CONFIG.prepMinutes)/st0)*st0);
  const out=[];for(let m=st;m<=cl-15;m+=st0)out.push(toHM(m));return out}
let co={};
const exLine=e=>S.cart.find(l=>l.id===e.id&&l.opts===(e.opt||"")&&!l.note);
function extrasHTML(){
  const L=EXTRAS.filter(e=>live(ITEMS[e.id])&&(exLine(e)||!S.cart.some(l=>l.id===e.id)));if(!L.length)return"";
  const n=L.reduce((a,e)=>a+(exLine(e)?.qty||0),0);
  return `<div class="drink-up"><div class="du-h"><div><b>${n?"Très bon choix":"Un petit plus ?"}</b><span>${n?`${n} douceur${n>1?"s":""} ajoutée${n>1?"s":""}`:"À glisser dans le sac"}</span></div>${n?`<i class="ok">${I.check}</i>`:""}</div>
    <div class="du-l">${L.map(e=>{const q=exLine(e)?.qty||0,it=ITEMS[e.id];return `<div class="du${q?" on":""}"><button class="du-b" data-ex="${e.id}" aria-label="Ajouter ${esc(e.lab)}">${media(it)}${q?`<span class="q">${q}</span>`:`<span class="p">${I.plus}</span>`}</button><span class="du-n">${e.lab}<br><small style="color:var(--mute)">${fmt(it.price)}</small></span>${q?`<button class="du-m" data-exm="${e.id}" aria-label="Retirer">${I.minus}</button>`:""}</div>`}).join("")}</div></div>`;
}
function addExtra(id,delta){const e=EXTRAS.find(x=>x.id===id),it=ITEMS[id],l=exLine(e);
  if(l){l.qty+=delta;if(l.qty<=0)S.cart.splice(S.cart.indexOf(l),1)}
  else if(delta>0)S.cart.push({id,name:it.name,opts:e.opt||"",note:"",unit:it.price,qty:1,...(it.box?{box:{s:it.box.s,p:presetPieces(it)}}:{})});
  update()}
function openCheckout(){
  if(!S.cart.length)return;view="co";co.d=null;co.s=null;
  let saved={};try{saved=JSON.parse(localStorage.getItem("alchimie-client")||"{}")}catch(e){}
  const vals={cName:saved.name||"",cTel:saved.tel||"",cNote:""};
  const draw=()=>{
    document.querySelectorAll(".fld input,.fld textarea").forEach(x=>vals[x.id]=x.value);
    const t=totals(),D=days();if(co.d===null||!D[co.d]||!slots(D[co.d]).length)co.d=Math.max(0,D.findIndex(d=>slots(d).length));
    const day=D[co.d],SL=day?slots(day):[];if(!SL.includes(co.s))co.s=SL[0]||null;const sh=SHOP(S.shop);
    sheet.innerHTML=head("Finaliser",`Retrait en boutique · ${sh.name}`)+`<div class="sb">
      <span class="lbl" style="margin-top:6px">Boutique</span>${shopSegHTML()}
      <span class="lbl">Jour de retrait</span><div class="chips scroll" id="dayChips">${D.map((d,i)=>`<button class="chip day" data-d="${i}" aria-pressed="${i===co.d}" ${slots(d).length?"":"disabled"}><small>${d.top}</small><b>${d.num}</b><small>${d.mon}</small>${d.ev?`<em>${d.ev}</em>`:""}</button>`).join("")}</div>
      <span class="lbl">Heure de retrait${day?` · ${day.label.toLowerCase()}`:""}</span>
      <div class="chips">${SL.map(s=>`<button class="chip" data-s="${s}" aria-pressed="${s===co.s}">${s}</button>`).join("")||`<span class="note">Aucun créneau disponible.</span>`}</div>
      ${extrasHTML()}
      <label class="gift"><span class="ico">🎁</span><span class="t"><b>C'est pour offrir</b><span>Emballage cadeau, sans supplément</span></span><span class="sw"><input type="checkbox" id="giftChk" ${S.gift?"checked":""} aria-label="C'est pour offrir"><i></i></span></label>
      <span class="lbl">Vos coordonnées</span>
      <div class="fld"><div class="in" id="w-cName"><label for="cName">Nom</label><input id="cName" autocomplete="name" value="${esc(vals.cName)}"></div>
        <div class="in" id="w-cTel"><label for="cTel">Téléphone</label><input id="cTel" type="tel" inputmode="tel" autocomplete="tel" placeholder="04xx xx xx xx" value="${esc(vals.cTel)}"></div>
        <div class="in"><label for="cNote">Note pour la boutique (optionnel)</label><textarea id="cNote" rows="2" placeholder="Ex. je passerai un peu plus tard">${esc(vals.cNote)}</textarea></div></div>
      <div class="recap"><div><span>${t.count} article${t.count>1?"s":""}</span><span>${fmt(t.sub)}</span></div><div class="t"><span>À payer au retrait</span><span>${fmt(t.total)}</span></div></div>
      <p class="note">${CONFIG.payment}. Votre commande arrive directement en boutique : vous suivez sa préparation en direct.</p>
      ${accOn()?"":`<div class="demo"><b>Mode démonstration.</b> Les commandes en ligne ne sont pas encore branchées : rien ne sera envoyé à la boutique.</div>`}
    </div><div class="sf"><button class="btn btn-or ${co.s?"":"dis"}" id="send">Envoyer la commande · ${fmt(t.total)}</button></div>`;
    bindClose();
    const dc=$("#dayChips"),on=dc&&dc.querySelector('[aria-pressed="true"]');if(on)dc.scrollLeft=dayScroll??Math.max(0,on.offsetLeft-20);
    dc&&dc.addEventListener("scroll",()=>dayScroll=dc.scrollLeft,{passive:true});
    sheet.querySelectorAll("[data-shop]").forEach(b=>b.onclick=()=>{S.shop=b.dataset.shop;save();renderStatus();renderFooter();co.d=null;dayScroll=null;redraw()});
    sheet.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{co.d=+b.dataset.d;redraw()});
    sheet.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{co.s=b.dataset.s;sheet.querySelectorAll("[data-s]").forEach(x=>x.setAttribute("aria-pressed",x===b))});
    $("#giftChk").onchange=e=>{S.gift=e.target.checked;save()};
    $("#send").onclick=e=>send(e,D);
    sheet.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>{addExtra(b.dataset.ex,1);redraw()});
    sheet.querySelectorAll("[data-exm]").forEach(b=>b.onclick=()=>{addExtra(b.dataset.exm,-1);redraw()});
  };
  let dayScroll=null;
  const redraw=()=>{const sb=sheet.querySelector(".sb"),y=sb?sb.scrollTop:0,dl=sheet.querySelector(".du-l"),x=dl?dl.scrollLeft:0;draw();const sb2=sheet.querySelector(".sb");if(sb2)sb2.scrollTop=y;const d2=sheet.querySelector(".du-l");if(d2)d2.scrollLeft=x};
  draw();openSheet();
}
async function send(e,D){
  e.preventDefault();
  const v=id=>(document.getElementById(id)?.value||"").trim();
  const name=v("cName"),tel=v("cTel"),note=v("cNote");let ok=true;
  const mark=(id,bad)=>{document.getElementById("w-"+id)?.classList.toggle("bad",bad);if(bad)ok=false};
  mark("cName",!name);mark("cTel",tel.replace(/\D/g,"").length<9);
  if(!ok||!co.s){toast("Complétez les champs en rouge",false);return}
  const btn=e.currentTarget;if(btn.dataset.busy)return;btn.dataset.busy=1;btn.classList.add("dis");btn.textContent="Envoi en cours…";
  try{localStorage.setItem("alchimie-client",JSON.stringify({...getClient(),name,tel}))}catch(err){}
  const t=totals(),day=D[co.d],sh=SHOP(S.shop),when=`${day.label} · ${co.s} · ${sh.name}`;
  const sent=S.cart.map(l=>({id:l.id,name:l.name,opts:l.opts||"",note:l.note||"",unit:l.unit,qty:l.qty,...(l.box?{box:l.box}:{})}));
  let res=null,err=null;
  if(ACC.sb){try{({data:res,error:err}=await ACC.sb.rpc("place_order",{p:{name,phone:tel,mode:"retrait",shop:sh.id,day:iso(day.date),slot:co.s,when,note,gift:!!S.gift,items:sent,subtotal:t.sub,discount:0,total:t.total}}))}catch(x){err=x}}
  else res=demoPlace({name,mode:"retrait",shop:sh.id,when_label:when,total:t.total,items:sent});
  if(err||!res||!res.track){delete btn.dataset.busy;btn.classList.remove("dis");btn.textContent=`Envoyer la commande · ${fmt(t.total)}`;
    const m=String((err&&err.message)||"");toast(/trop de commandes/.test(m)?"Trop de commandes d'affilée, réessayez dans quelques minutes":`Envoi impossible. Réessayez ou appelez le ${sh.phoneDisplay}`,false);console.warn(err);return}
  const rec={num:res.num,ts:Date.now(),when,mode:"retrait",shop:sh.id,total:t.total,items:sent,track:res.track};
  try{const H=JSON.parse(localStorage.getItem("alchimie-orders")||"[]");H.unshift(rec);localStorage.setItem("alchimie-orders",JSON.stringify(H.slice(0,20)))}catch(x){}
  saveTrack({num:res.num,track:res.track,ts:Date.now(),when,shop:sh.id,total:t.total});
  accSaveOrder(rec);
  S.cart=[];S.gift=false;update();
  openTrack(res.track,true);
}

/* ---- mode démo (sans Supabase) : la commande reste sur l'appareil et avance toute seule ---- */
function demoPlace(o){const num="A"+(100+Math.floor(Math.random()*900)),track="DEMO"+Date.now().toString(36).toUpperCase();
  try{const D=JSON.parse(localStorage.getItem("alchimie-demo")||"{}");D[track]={...o,num,created:Date.now()};localStorage.setItem("alchimie-demo",JSON.stringify(D))}catch(e){}
  return{num,track}}
function demoTrack(track){let D={};try{D=JSON.parse(localStorage.getItem("alchimie-demo")||"{}")}catch(e){}const o=D[track];if(!o)return null;
  const s=(Date.now()-o.created)/1000;return{...o,status:s<12?"new":s<30?"prep":s<70?"ready":"done"}}

/* ---- Suivi de commande en direct ---- */
const TRK=[["new","Reçue","La boutique a bien reçu votre commande"],["prep","En préparation","Nos chocolatiers préparent votre commande"],["ready","Prête !","Elle vous attend en boutique"],["done","Récupérée","Bonne dégustation !"]];
const getTracks=()=>{try{return JSON.parse(localStorage.getItem("alchimie-track")||"[]")}catch(e){return[]}};
function saveTrack(t){try{const L=getTracks().filter(x=>x.track!==t.track);L.unshift(t);localStorage.setItem("alchimie-track",JSON.stringify(L.slice(0,10)))}catch(e){}}
function setTrackStatus(track,st){try{const L=getTracks();const x=L.find(y=>y.track===track);if(x){x.status=st;localStorage.setItem("alchimie-track",JSON.stringify(L))}}catch(e){}}
let trkTimer=null,trkLast=null;
async function fetchTrack(track){if(track.startsWith("DEMO"))return demoTrack(track);if(!ACC.sb)return null;try{const {data}=await ACC.sb.rpc("order_track",{p_track:track});return Array.isArray(data)?data[0]:data}catch(e){return null}}
function trackHTML(o,fresh){
  const idx=o.status==="cancelled"?-1:TRK.findIndex(x=>x[0]===o.status),cur=TRK[Math.max(0,idx)],sh=SHOP(o.shop);
  return `<div class="sb"><div class="trk">
    <div class="trk-ic ${o.status}">${o.status==="cancelled"?I.x:o.status==="ready"||o.status==="done"?I.check:'<span class="trk-dot"></span>'}</div>
    <h4>${o.status==="cancelled"?"Commande annulée":fresh?`Merci ${esc((o.name||"").split(" ")[0])} !`:esc(cur[1])}</h4>
    <p>${o.status==="cancelled"?`Contactez la boutique au ${sh.phoneDisplay} si besoin.`:fresh&&o.status==="new"?"Votre commande est arrivée en boutique. Cette page se met à jour toute seule.":o.status==="ready"?`Elle vous attend à ${esc(sh.name)}, ${esc(sh.address.split(",")[0])}.`:esc(cur[2])}</p>
    <div class="num">#${esc(o.num)} · ${esc(o.when_label||"")}</div></div>
    ${o.status!=="cancelled"?`<div class="trk-steps">${TRK.map((x,i)=>`<div class="${i<idx?"ok":i===idx?"cur":""}"><i>${i<idx?I.check:i+1}</i><span><b>${x[1]}</b>${i===idx?`<small>${x[2]}</small>`:""}</span></div>`).join("")}</div>`:""}
    <div class="recap">${(o.items||[]).map(l=>`<div><span>${l.qty}× ${esc(l.name)}${l.opts?`<small style="display:block;color:var(--mute)">${esc(l.opts)}</small>`:""}</span><span>${fmt(l.unit*l.qty)}</span></div>`).join("")}<div class="t"><span>Total · à payer au retrait</span><span>${fmt(+o.total)}</span></div></div>
    ${String(o.track||"").startsWith("DEMO")||!accOn()?`<div class="demo"><b>Démo :</b> la commande n'a pas été envoyée. Les étapes avancent toutes seules pour vous montrer le suivi.</div>`:""}
    <p class="note" style="text-align:center">Une question ? Appelez la boutique au <a href="tel:+${sh.phone}" style="color:var(--or-d);font-weight:650">${sh.phoneDisplay}</a></p></div>
    <div class="sf"><button class="btn btn-light" id="trkClose">Fermer</button></div>`;
}
async function openTrack(track,fresh){
  view="track";clearInterval(trkTimer);trkLast=null;
  const load=async()=>{
    const o=await fetchTrack(track);if(o)o.track=track;
    if(view!=="track")return;
    if(!o){if(!trkLast){sheet.innerHTML=head("Ma commande","")+`<div class="sb"><div class="pempty">Impossible de charger le suivi pour le moment.</div></div>`;bindClose()}return}
    setTrackStatus(track,o.status);
    if(trkLast&&trkLast!==o.status){if(navigator.vibrate)try{navigator.vibrate([30,60,30])}catch(e){}toast(o.status==="ready"?"Votre commande est prête !":"Commande mise à jour")}
    if(trkLast===o.status)return;trkLast=o.status;
    sheet.innerHTML=head("Ma commande",`Retrait · ${SHOP(o.shop).name}`)+trackHTML(o,fresh&&o.status==="new");
    bindClose();$("#trkClose").onclick=closeSheet;renderLive();
    if(o.status==="done"||o.status==="cancelled")clearInterval(trkTimer);
  };
  if(!sheet.classList.contains("open")){sheet.innerHTML=head("Ma commande","")+`<div class="sb"><div class="pempty">Chargement…</div></div>`;bindClose();openSheet()}
  await load();trkTimer=setInterval(()=>{if(view!=="track"||document.hidden)return;load()},track.startsWith("DEMO")?2000:5000);
}
function renderLive(){
  const el=$("#liveOrder");if(!el)return;
  const act=getTracks().filter(t=>Date.now()-t.ts<45*86400e3&&t.status!=="done"&&t.status!=="cancelled");
  if(!act.length){el.innerHTML="";return}
  const t=act[0],st=TRK.find(x=>x[0]===(t.status||"new"))||["","Envoyée"];
  el.innerHTML=`<button class="live-o" data-trk="${esc(t.track)}"><span class="lo-dot ${t.status||"new"}"></span><span><b>Commande #${esc(t.num)} · ${esc(st[1])}</b><span>${esc(t.when)} · touchez pour suivre</span></span><span class="ar">${I.arrow}</span></button>`;
  el.querySelector("[data-trk]").onclick=()=>openTrack(t.track,false);
}
async function refreshLive(){
  const act=getTracks().filter(t=>Date.now()-t.ts<45*86400e3&&t.status!=="done"&&t.status!=="cancelled");
  for(const t of act.slice(0,3)){const o=await fetchTrack(t.track);if(o)setTrackStatus(t.track,o.status)}
  renderLive();
}
setInterval(()=>{if(!document.hidden&&view!=="track")refreshLive()},20000);
