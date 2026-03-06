const bannerConfig = [
    {
        image: "im/1.webp",
        link: "#",
        alt: "#"
    }
];

// --- KONFIGURASI FILE STATIS ---
// --- KONFIGURASI FILE STATIS ---
// path: Lokasi file di server Anda
// path_zip: Jalur folder & nama file yang akan diciptakan di dalam .zip
const assetConfig = [
    {
        path: "file/manifest.json",
        path_zip: "manifest.json"
    },
    {
        path: "file/pack_icon.png",
        path_zip: "pack_icon.png"
    },
    {
        path: "file/velixsaxy.js",
        path_zip: "scripts/class/velixsaxy.js"
    }
];

let Items_rename = {};
let currentSlide = 0;

document.addEventListener('DOMContentLoaded', () => {
    initBanner();
    renderItems();
});

// --- LOGIKA BANNER ---
function initBanner() {
    const wrapper = document.getElementById('slider-wrapper');
    const dotsContainer = document.getElementById('slider-dots');
    if (bannerConfig.length === 0) return;

    bannerConfig.forEach((banner, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide-item';
        slide.innerHTML = `<a href="${banner.link}" target="_blank"><img src="${banner.image}"></a>`;
        wrapper.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % bannerConfig.length;
        goToSlide(currentSlide);
    }, 5000);
}

function goToSlide(index) {
    currentSlide = index;
    document.getElementById('slider-wrapper').style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
}

function sanitizeItemID(el) {
    let val = el.value.toLowerCase().replace(/\s+/g, '_');
    val = val.replace(/[^a-z0-9_:]/g, ''); 
    el.value = val;
}

// --- MANAJEMEN ENTRY ---
function addMaterialField(containerId, value = "") {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'flex-row';
    div.style.marginTop = '8px';
    div.innerHTML = `
        <input type="text" class="material-input" value="${value}" oninput="sanitizeItemID(this)" placeholder="minecraft:item_id">
        <button class="btn btn-danger-small btn-danger" onclick="this.parentElement.remove()">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    `;
    container.appendChild(div);
}

function renderItems() {
    const list = document.getElementById('items-list');
    list.innerHTML = '';
    
    // Sort Entry Terbaru di Atas
    const sorted = Object.entries(Items_rename).sort((a, b) => b[1].entry - a[1].entry);

    sorted.forEach(([key, val]) => {
        const card = document.createElement('div');
        card.className = 'ios-item-card reveal active';
        card.innerHTML = `
            <div class="item-header">
                <div class="item-icon-wrapper">
                    <img src="https://placehold.co/100x100?text=${key.charAt(0).toUpperCase()}" alt="icon">
                </div>
                <div class="item-info">
                    <div class="item-title">${key} <span class="ios-badge blue">#${val.entry}</span></div>
                    <div class="item-subtitle">Result: ${val.result}</div>
                    <div class="ios-badge-container" style="margin-top:5px;">
                        ${val.items.map(i => `<span class="ios-badge gray">${i}</span>`).join('')}
                    </div>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="btn-danger-small btn-warning" onclick="openEditPopup('${key}')">
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button class="btn-danger-small btn-danger" onclick="deleteEntry('${key}')">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
    updateCodePreview();
}

function addNewEntry() {
    // Nama Display (Key) - Tidak di-sanitize agar bisa Besar & Spasi
    const key = document.getElementById('input-key').value.trim();
    const res = document.getElementById('input-result').value;
    const mats = Array.from(document.querySelectorAll('#materials-list .material-input'))
                      .map(i => i.value).filter(v => v !== "");

    if (!key || !res || mats.length === 0) return showPopup("Gagal", "Lengkapi semua data!");

    const nextId = Object.values(Items_rename).length > 0 
        ? Math.max(...Object.values(Items_rename).map(o => o.entry)) + 1 : 0;
    
    Items_rename[key] = { entry: nextId, items: mats, result: res };
    
    // Reset Form
    document.getElementById('input-key').value = '';
    document.getElementById('input-result').value = '';
    document.getElementById('materials-list').innerHTML = `<div class="flex-row"><input type="text" class="material-input" oninput="sanitizeItemID(this)"></div>`;
    
    renderItems();
}

// --- POPUP EDIT & IMPORT ---
function openEditPopup(key) {
    const data = Items_rename[key];
    document.getElementById('edit-old-key').value = key;
    document.getElementById('edit-key').value = key; // Bisa Besar/Spasi
    document.getElementById('edit-result').value = data.result;
    const matList = document.getElementById('edit-materials-list');
    matList.innerHTML = '';
    data.items.forEach(m => addMaterialField('edit-materials-list', m));
    document.getElementById('edit-popup').classList.add('active');
}

function saveEdit() {
    const oldKey = document.getElementById('edit-old-key').value;
    const newKey = document.getElementById('edit-key').value.trim(); // Simpan key baru
    const entryId = Items_rename[oldKey].entry;
    
    delete Items_rename[oldKey];
    Items_rename[newKey] = {
        entry: entryId,
        items: Array.from(document.querySelectorAll('#edit-materials-list .material-input')).map(i => i.value).filter(v => v !== ""),
        result: document.getElementById('edit-result').value
    };
    closeEditPopup();
    renderItems();
}

function closeEditPopup() { document.getElementById('edit-popup').classList.remove('active'); }

function triggerImport() { document.getElementById('file-import').click(); }

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const match = e.target.result.match(/export const Items_rename = ([\s\S]*?);/);
            if (match) {
                Items_rename = new Function(`return ${match[1]}`)();
                renderItems();
                showPopup("Berhasil", "File berhasil dimuat!");
            }
        } catch (err) { showPopup("Error", "Format file salah!"); }
    };
    reader.readAsText(file);
}

// --- SISTEM DOWNLOAD & UI ---
function updateCodePreview() {
    document.getElementById('code-output').textContent = `export const Items_rename = ${JSON.stringify(Items_rename, null, 4)};`;
}

function switchTab(t) {
    document.getElementById('section-generator').style.display = t === 'generator' ? 'block' : 'none';
    document.getElementById('section-code').style.display = t === 'code' ? 'block' : 'none';
    document.querySelectorAll('.tab, .ios-tab').forEach(el => el.classList.remove('active'));
    if(t === 'generator') {
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.getElementById('tab-gen-btn').classList.add('active');
    } else {
        document.querySelectorAll('.tab')[1].classList.add('active');
        document.getElementById('tab-code-btn').classList.add('active');
    }
}

async function downloadAddon() {
    const zip = new JSZip();
    const bp = zip.folder("BP");

    showPopup("Processing", "Sedang mengemas file...");

    // File Statis Berdasarkan Jalur
    for (const a of assetConfig) {
        try {
            const r = await fetch(a.path);
            if(r.ok) bp.file(a.path_zip, await r.blob());
        } catch(e) { console.error("Gagal memuat: " + a.path); }
    }

    // File Hasil Generator
    bp.file("scripts/AnvilRename.js", document.getElementById('code-output').textContent);

    zip.generateAsync({type:"blob"}).then(c => {
        const l = document.createElement('a');
        l.href = URL.createObjectURL(c);
        l.download = "Anvil Rename Addon - Bedrock.mcaddon.zip";
        l.click();
        showPopup("Berhasil", "Addon siap!");
    });
}

function deleteEntry(key) { if(confirm(`Hapus ${key}?`)) { delete Items_rename[key]; renderItems(); } }

function copyCode() {
    navigator.clipboard.writeText(document.getElementById('code-output').textContent);
    showPopup("Berhasil", "Kode disalin!");
}

function showPopup(t, m) {
    document.getElementById('popup-title').textContent = t;
    document.getElementById('popup-msg').textContent = m;
    document.getElementById('popup').classList.add('active');
}
function closePopup() { document.getElementById('popup').classList.remove('active'); }