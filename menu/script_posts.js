function renderPosts(filterType){
    const container=document.getElementById("post-container"), grid=document.getElementById("home-posts-grid");
    container.innerHTML=""; if(filterType==="Semua" && grid) grid.innerHTML="";
    
    const data = POSTS_CONFIG.filter(p => filterType==="Semua" || p.type===filterType).reverse();
    
    data.forEach((p, i)=>{
        const html = `
        <div class="post-card">
            <div class="post-header">
                <img src="${PROFILE_CONFIG.avatar}">
                <div><b>${p.author}</b><div style="font-size:9px;opacity:0.6">${p.date}</div></div>
                <span class="post-badge">${p.type}</span>
            </div>
            <div class="post-txt">${p.content}</div>
            ${p.mediaType==='image' ? `<div class="media-container" onclick="openModal('image','${p.mediaUrl}')"><img src="${p.mediaUrl}"></div>` : ''}
            <div class="post-actions">
                <button class="lk-btn" onclick="this.classList.toggle('active')"><i class="fas fa-heart"></i></button>
                <button class="lk-btn" onclick="this.classList.toggle('active-dl')"><i class="fas fa-thumbs-down"></i></button>
            </div>
        </div>`;
        container.innerHTML += html;
        
        // Render ke grid beranda jika ada media
        if(p.mediaType==="image" && i<6 && grid && filterType==="Semua"){
            grid.innerHTML += `<div class="ig-item" onclick="switchTab('post', document.querySelectorAll('.nav-item')[1])"><img src="${p.mediaUrl}"></div>`;
        }
    });
}

// Inisialisasi Filter Post
function setupPostFilters(){
    const box = document.getElementById("filter-post"); if(!box) return;
    const types = ["Semua", "Update", "Karya", "Tutorial"];
    box.innerHTML = "";
    types.forEach(t => {
        const btn = document.createElement("button");
        btn.className = `filter-btn ${t==="Semua"?"active":""}`;
        btn.innerText = t;
        btn.onclick = (e) => {
            box.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            renderPosts(t);
        };
        box.appendChild(btn);
    });
}