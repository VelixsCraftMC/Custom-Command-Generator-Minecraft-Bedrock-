let lastS=0;const mainC=document.getElementById("scroll-area"),topN=document.getElementById("top-nav"),botN=document.getElementById("bottom-nav"),btnT=document.getElementById("back-to-top");

document.addEventListener("DOMContentLoaded",()=>{
    const e=document.getElementById("boot-screen"),t=document.getElementById("boot-console");
    document.getElementById("boot-logo").src=PROFILE_CONFIG.avatar;
    if(!sessionStorage.getItem("hasB")){
        const o=["System Init...","Loading UI...","Ready!"],n=1500/o.length;
        o.forEach((e,o)=>{setTimeout(()=>{const n=document.createElement("div");n.innerText=`> ${e}`,t.appendChild(n)},o*n)});
        setTimeout(()=>{e.style.opacity="0",setTimeout(()=>{e.style.display="none",sessionStorage.setItem("hasB","1")},500)},2000)
    }else e.style.display="none";
    initApp();
});

function initApp(){
    // Render Profile Discord Style
    document.getElementById("ds-banner").src=PROFILE_CONFIG.banner;
    document.getElementById("ds-deco").src=PROFILE_CONFIG.deco;
    document.getElementById("profile-img").src=PROFILE_CONFIG.avatar;
    document.getElementById("profile-name").innerText=PROFILE_CONFIG.name;
    document.getElementById("profile-bio").innerText=PROFILE_CONFIG.bio;
    document.getElementById("home").style.backgroundImage=`linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('${PROFILE_CONFIG.wallpaper}')`;
    document.getElementById("social-container").innerHTML=`<a href="${PROFILE_CONFIG.socials.youtube}" target="_blank" class="ds-social-btn"><i class="fab fa-youtube"></i></a><a href="${PROFILE_CONFIG.socials.discord}" target="_blank" class="ds-social-btn"><i class="fab fa-discord"></i></a><a href="${PROFILE_CONFIG.socials.whatsapp}" target="_blank" class="ds-social-btn"><i class="fab fa-whatsapp"></i></a>`;
    
    // Panggil fungsi render dari script lain
    if(typeof renderPosts === "function") renderPosts("Semua");
    if(typeof renderUtils === "function") renderUtils("Semua");
    if(typeof setupFilters === "function") setupFilters();
}

function switchTab(e,t){
    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    document.getElementById(e).classList.add("active");
    document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"));
    t.classList.add("active");
    mainC.scrollTo({top:0,behavior:"smooth"});
}

function openModal(t,u,h=""){
    const m=document.getElementById("media-modal"),c=document.getElementById("modal-content");
    m.classList.remove("modal-hidden");
    c.innerHTML = t==="image" ? `<img src="${u}">` : `<div class="text-modal"><h3>${h}</h3><p>${u}</p></div>`;
}

function closeModal(){document.getElementById("media-modal").classList.add("modal-hidden")}
function scrollToTop(){mainC.scrollTo({top:0,behavior:"smooth"})}

mainC.addEventListener("scroll",()=>{
    let s=mainC.scrollTop;
    s>300?btnT.classList.add("show"):btnT.classList.remove("show");
    if(s>lastS&&s>100){topN.classList.add("nav-h");botN.classList.add("nav-b")}
    else{topN.classList.remove("nav-h");botN.classList.remove("nav-b")}
    lastS=s;
});