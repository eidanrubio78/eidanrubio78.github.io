(function(){
var T = {
  ca: {
    n_inici:"Inici", n_video:"Vídeo", n_carta:"Carta", n_angles:"Anglès", n_evid:"Evidències",
    h_l1:"Hola,", h_l2:"sóc Eidan", h_fl:"Rubio.",
    eyebrow:"Portfolio digital · IPO1 i Anglès",
    intro:"Em dic <b>Eidan Rubio Valencia</b> i sóc estudiant de SMX a l'<b>Institut Sa Palomera</b>. Visc a <b>Blanes</b>.",
    f_age:"17 anys", f_study:"SMX · Institut Sa Palomera", f_live:"Blanes",
    contact:"Informació de contacte", explore_k:"Explora", explore_t:"El meu portfolio,", explore_f:"pàgina a pàgina.",
    back:"← Tornar", go:"Obrir", pending:"Pendent",
    skip:"Saltar intro", hint:"Scroll",
    c1_k:"01 — Hardware", c1_t:"Tot comença", c1_f:"per dins.",
    c2_k:"02 — Peça a peça", c2_t:"Entendre", c2_f:"cada component.",
    c3_k:"03 — Portfolio", c3_t:"I ara,", c3_f:"el meu treball.",
    l_screen:"Pantalla", l_keys:"Teclat", l_fan:"Ventilador", l_board:"Placa base", l_bat:"Bateria", l_bottom:"Carcassa",
    video_desc:"El meu vídeo d'anàlisi SWOT i els meus objectius SMART.",
    swot_t:"Vídeo d'anàlisi SWOT", swot_d:"Vídeo personal d'anàlisi SWOT del mòdul d'anglès professional.",
    smart_t:"Objectius SMART", g_personal:"Personals", g_prof:"Professionals", g_eng:"Relacionats amb l'anglès",
    carta_desc:"La meva carta de motivació.", carta_card:"Carta de motivació en preparació.",
    cv_desc:"El meu currículum.", cv_card:"CV en preparació.",
    ipo1_t:"Reflexió IPO1", ipo1_d:"Una reflexió per a cada resultat d'aprenentatge (RA) del mòdul Itinerari personal per a l'ocupabilitat.",
    ra_d:"Reflexió i evidències d'aquest resultat d'aprenentatge.",
    ra2_d:"Prevenció de riscos laborals · Pràctica 2: Ergonomia i salut laboral en el sector digital.",
    angles_t:"Reflexió d'anglès professional", angles_d:"Evidències escrites i orals, i expressions formals i informals.",
    evid_t:"Evidències escrites i orals", evid_d:"Les meves evidències escrites i orals, per trimestre.",
    formal_d:"Taula d'expressions formals i informals."
  },
  en: {
    n_inici:"Home", n_video:"Video", n_carta:"Letter", n_angles:"English", n_evid:"Evidence",
    h_l1:"Hi,", h_l2:"I'm Eidan", h_fl:"Rubio.",
    eyebrow:"Digital portfolio · IPO1 & English",
    intro:"My name is <b>Eidan Rubio Valencia</b> and I'm an SMX student at <b>Institut Sa Palomera</b>. I live in <b>Blanes</b>.",
    f_age:"17 years old", f_study:"SMX · Institut Sa Palomera", f_live:"Blanes",
    contact:"Contact information", explore_k:"Explore", explore_t:"My portfolio,", explore_f:"page by page.",
    back:"← Back", go:"Open", pending:"Pending",
    skip:"Skip intro", hint:"Scroll",
    c1_k:"01 — Hardware", c1_t:"It all starts", c1_f:"on the inside.",
    c2_k:"02 — Piece by piece", c2_t:"Understanding", c2_f:"every component.",
    c3_k:"03 — Portfolio", c3_t:"And now,", c3_f:"my work.",
    l_screen:"Screen", l_keys:"Keyboard", l_fan:"Fan", l_board:"Motherboard", l_bat:"Battery", l_bottom:"Chassis",
    video_desc:"My SWOT analysis video and my SMART goals.",
    swot_t:"SWOT analysis video", swot_d:"Personal SWOT analysis video from the professional English module.",
    smart_t:"SMART goals", g_personal:"Personal", g_prof:"Professional", g_eng:"English-related",
    carta_desc:"My motivation letter.", carta_card:"Motivation letter in progress.",
    cv_desc:"My résumé.", cv_card:"CV in progress.",
    ipo1_t:"IPO1 Reflection", ipo1_d:"One reflection for each learning outcome (RA) of the Personal Employability Pathway module.",
    ra_d:"Reflection and evidence for this learning outcome.",
    ra2_d:"Occupational risk prevention · Practice 2: Ergonomics and occupational health in the digital sector.",
    angles_t:"Professional English reflection", angles_d:"Written and oral evidence, and formal and informal expressions.",
    evid_t:"Written and oral evidence", evid_d:"My written and oral evidence, by term.",
    formal_d:"Chart of formal and informal expressions."
  }
};
window.__T = T;
function setLang(l){
  if(!T[l]) l="ca";
  document.documentElement.lang=l;
  document.querySelectorAll("[data-i18n]").forEach(function(e){e.textContent=T[l][e.dataset.i18n];});
  document.querySelectorAll("[data-i18n-html]").forEach(function(e){e.innerHTML=T[l][e.dataset.i18nHtml];});
  document.querySelectorAll(".lang button").forEach(function(b){b.classList.toggle("on",b.dataset.lang===l);});
  try{localStorage.setItem("lang",l);}catch(_){}
}
document.querySelectorAll(".lang button").forEach(function(b){b.addEventListener("click",function(){setLang(b.dataset.lang);});});
var saved=null; try{saved=localStorage.getItem("lang");}catch(_){}
setLang(saved||"ca");

var menu=document.getElementById("menu");
document.getElementById("burger").addEventListener("click",function(){menu.classList.toggle("open");});

var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasG = !!(window.gsap && window.ScrollTrigger);
var lenis = null;
if(hasG) gsap.registerPlugin(ScrollTrigger);
if(!reduce && window.Lenis){
  lenis = new Lenis({lerp:0.09, smoothWheel:true});
  window.__lenis = lenis;
  if(hasG){ lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(function(t){lenis.raf(t*1000);}); gsap.ticker.lagSmoothing(0); }
  else { (function raf(t){lenis.raf(t); requestAnimationFrame(raf);})(); }
}
function scrollToEl(el, immediate){
  if(!el) return;
  if(lenis) lenis.scrollTo(el,{offset:-64, immediate:!!immediate, force:true});
  else window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 64);
}

// same-page anchors + skip intro
document.addEventListener("click",function(e){
  var a=e.target.closest("a[href^='#'], .skip");
  if(!a) return;
  var id = a.classList.contains("skip") ? "#inici" : a.getAttribute("href");
  var el = document.querySelector(id);
  if(el){ e.preventDefault(); menu.classList.remove("open"); scrollToEl(el); history.replaceState(null,"",id); }
});

// page transition (curtain)
var curtain=document.querySelector(".curtain");
document.addEventListener("click",function(e){
  var a=e.target.closest("a[href]");
  if(!a || reduce || !curtain) return;
  var href=a.getAttribute("href");
  if(!href || href.charAt(0)==="#" || a.target==="_blank" || /^(mailto:|tel:|https?:)/.test(href) || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  curtain.classList.remove("leave"); void curtain.offsetWidth; curtain.classList.add("leave");
  setTimeout(function(){ location.href=href; }, 520);
});
window.addEventListener("pageshow",function(ev){ if(ev.persisted && curtain){ curtain.classList.remove("leave"); } });

// card spotlight
document.querySelectorAll(".card").forEach(function(c){
  c.addEventListener("pointermove",function(e){ var r=c.getBoundingClientRect(); c.style.setProperty("--mx",(e.clientX-r.left)+"px"); c.style.setProperty("--my",(e.clientY-r.top)+"px"); });
});

// reveals
if(hasG && !reduce){
  gsap.utils.toArray(".hero .line > span").forEach(function(s,i){
    gsap.from(s,{yPercent:110, duration:1.2, ease:"power4.out", delay:.15+i*.12, scrollTrigger:{trigger:".hero", start:"top 75%", once:true}});
  });
  gsap.utils.toArray("[data-reveal]").forEach(function(el){
    gsap.from(el,{y:36, opacity:0, duration:1, ease:"power3.out", scrollTrigger:{trigger:el, start:"top 90%", once:true}});
  });
  gsap.set(".grid .card",{opacity:0, y:46});
  ScrollTrigger.batch(".grid .card",{start:"top 92%", once:true, onEnter:function(b){ gsap.to(b,{opacity:1, y:0, duration:.9, ease:"power3.out", stagger:.09, overwrite:true}); }});
  if(document.querySelector(".ptitle")) gsap.from(".ptitle",{y:60, opacity:0, duration:1.1, ease:"power4.out", delay:.35});
}

function onReady(){
  if(hasG) ScrollTrigger.refresh();
  if(location.hash && location.hash.length>1){ try{ scrollToEl(document.querySelector(location.hash), true); }catch(_){} }
}
window.addEventListener("intro:gone", function(){ if(hasG) ScrollTrigger.refresh(); });
if(document.readyState==="complete") onReady(); else window.addEventListener("load", onReady);
})();
