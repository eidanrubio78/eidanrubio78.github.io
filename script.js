const T = {
  ca: {
    n_inici:"Inici", n_video:"Vídeo", n_carta:"Carta", n_angles:"Anglès", n_evid:"Evidències",
    hi:"Hola, sóc",
    intro:"Hola, em dic <b>Eidan Rubio Valencia</b> i sóc estudiant de SMX a l'<b>Institut Sa Palomera</b>. Visc a <b>Blanes</b>.",
    f_age:"17 anys", f_study:"SMX · Institut Sa Palomera", f_live:"Blanes",
    contact:"Informació de contacte", explore:"Explora el portfolio", back:"← Tornar",
    pending:"Pendent",
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
    hi:"Hi, I'm",
    intro:"Hello, my name is <b>Eidan Rubio Valencia</b> and I'm an SMX student at <b>Institut Sa Palomera</b>. I live in <b>Blanes</b>.",
    f_age:"17 years old", f_study:"SMX · Institut Sa Palomera", f_live:"Blanes",
    contact:"Contact information", explore:"Explore the portfolio", back:"← Back",
    pending:"Pending",
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
function setLang(l){
  if(!T[l]) l="ca";
  document.documentElement.lang=l;
  document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=T[l][e.dataset.i18n]);
  document.querySelectorAll("[data-i18n-html]").forEach(e=>e.innerHTML=T[l][e.dataset.i18nHtml]);
  document.querySelectorAll(".lang button").forEach(b=>b.classList.toggle("on",b.dataset.lang===l));
  try{localStorage.setItem("lang",l);}catch(_){}
}
document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
const menu=document.getElementById("menu");
document.getElementById("burger").addEventListener("click",()=>menu.classList.toggle("open"));
let saved=null;try{saved=localStorage.getItem("lang");}catch(_){}
setLang(saved||"ca");
