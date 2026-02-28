function renderUtils(filterType){
    const container=document.getElementById("util-container"), grid=document.getElementById("home-utils-grid");
    container.innerHTML="";
    
    const data = UTILS_CONFIG.filter(u => filterType==="Semua" || u.type===filterType).reverse();
    
    data.forEach((u, i)=>{
        const html = `
        <div class="util-card">
            <img class="util-thumb" src="${u.thumb}">
            <div>
                <h4>${u.title}</h4>
                <p style="font-size:11px;color:gray">${u.desc}</p>
                <div class="util-actions">
                    <button onclick="openModal('text','${u.internalPost}','${u.title}')">Info</button>
                    <button onclick="window.open('${u.externalLink}')">Link</button>
                </div>
            </div>
        </div>`;
        container.innerHTML += html;
        
        // Tampilkan 2 alat terpopuler di Home
        if(i<2 && grid && filterType==="Semua") grid.innerHTML += html;
    });
}

function setupUtilFilters(){
    const box = document.getElementById("filter-util"); if(!box) return;
    const types = ["Semua", "Alat", "Plugin", "Addon"];
    box.innerHTML = "";
    types.forEach(t => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.innerText = t;
        if(t==="Semua") btn.classList.add("active");
        btn.onclick = (e) => {
            box.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            renderUtils(t);
        };
        box.appendChild(btn);
    });
}

// Fungsi pembantu untuk dipanggil initApp
function setupFilters(){
    setupPostFilters();
    setupUtilFilters();
}