let allData = [];
let currentIdx = 0;
const step = 25;
let currentLang = 'kr';
let favorites = JSON.parse(localStorage.getItem('kpopbase_favs')) || [];

const i18n = {
    favTitle: { kr: "즐겨찾기", en: "Favorites", ja: "お気に入り", es: "Favoritos", zh: "收藏" },
    noResults: { kr: "검색 결과가 없습니다.", en: "No results found.", ja: "検索結果がありません.", es: "No se encontraron resultados.", zh: "没有找到结果。" },
    loadMore: { kr: "소속사 더 보기", en: "Load More Agencies", ja: "もっと見る", es: "Cargar más", zh: "加载更多" }
};

// --- Teachable Machine Setup ---
const URL = "https://teachablemachine.withgoogle.com/models/inOwxk_tm/";
let model, webcam, labelContainer, maxPredictions;
let isRunning = false;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        const response = await fetch('agencies.json');
        allData = await response.json();
        setupEventListeners();
        updateStats();
        renderInitial();
        
        // Init Disqus Observer
        initDisqus();
        
        // Init Animal Test Listener
        const animalBtn = document.getElementById('animal-btn');
        if (animalBtn) {
            animalBtn.addEventListener('click', initAnimalTest);
        }

    } catch (e) { console.error("Data load failed", e); }
}

function setupEventListeners() {
    // New Language Button Logic
    const langButtons = document.querySelectorAll('.btn-lang');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.getAttribute('data-lang');
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            updateUI();
            refreshGrids();
        });
    });

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            renderGeneral(allData.slice(currentIdx, currentIdx + step));
            currentIdx += step;
            if (currentIdx >= allData.length) document.getElementById('loadMoreBtn').classList.add('hidden');
            window.scrollBy({ top: 300, behavior: 'smooth' });
        });
    }
}

function renderInitial() {
    renderFavorites();
    renderGeneral(allData.slice(0, step));
    currentIdx = step;
}

function renderFavorites() {
    const favGrid = document.getElementById('favGrid');
    const favSection = document.getElementById('favSection');
    if (!favGrid || !favSection) return;

    const favItems = allData.filter(item => favorites.includes(item.id));
    
    favGrid.innerHTML = '';
    if (favItems.length > 0) {
        favSection.classList.remove('hidden');
        favItems.forEach(item => favGrid.appendChild(createCard(item)));
    } else {
        favSection.classList.add('hidden');
    }
}

function renderGeneral(items, clear = false) {
    const grid = document.getElementById('agencyGrid');
    if (!grid) return;
    
    if (clear) grid.innerHTML = '';
    items.forEach(item => grid.appendChild(createCard(item)));
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = `agency-card ${favorites.includes(item.id) ? 'is-favorite' : ''}`;
    
    const name = item.name[currentLang] || item.name['en'] || item.name['kr'];
    const ceo = item.ceo[currentLang] || item.ceo['en'] || item.ceo['kr'];
    const address = item.address[currentLang] || item.address['en'] || item.address['kr'];
    // Use the specific address for map searches to be more accurate
    const mapQuery = item.address.kr || item.address.en;

    // Prioritize manual image, fallback to YouTube thumbnail
    const thumbUrl = item.image ? item.image : `https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`;

    card.innerHTML = `
        <button class="fav-btn" onclick="toggleFavorite(${item.id})">♥</button>
        <div class="thumb-box" style="background-image: url('${thumbUrl}')"></div>
        <div class="card-info">
            <h3>${name}</h3>
            <p class="ceo-name">CEO: ${ceo}</p>
            <div class="artist-list">
                ${item.artists.slice(0, 4).map(a => `<a href="https://www.google.com/search?q=${encodeURIComponent(a)}" target="_blank" class="artist-tag" style="text-decoration:none;">${a}</a>`).join('')}
            </div>
            <details>
                <summary>Details & Map</summary>
                <div class="map-wrapper">
                    <p style="font-size:0.8rem; margin:0 0 10px;">${address}</p>
                    <div style="display:flex; gap:5px; flex-wrap: wrap;">
                        <a href="https://map.naver.com/v5/search/${encodeURIComponent(mapQuery)}" target="_blank" class="btn-primary" style="font-size:0.7rem; padding:5px 10px; text-decoration:none; background:#03C75A; color:white;">Naver</a>
                        <a href="https://map.kakao.com/link/search/${encodeURIComponent(mapQuery)}" target="_blank" class="btn-primary" style="font-size:0.7rem; padding:5px 10px; text-decoration:none; background:#FEE500; color:black;">Kakao</a>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}" target="_blank" class="btn-primary" style="font-size:0.7rem; padding:5px 10px; text-decoration:none; background:#4285F4; color:white;">Google</a>
                    </div>
                </div>
            </details>
        </div>
    `;
    return card;
}

// Make toggleFavorite global so HTML onclick works
window.toggleFavorite = function(id) {
    if (favorites.includes(id)) { favorites = favorites.filter(f => f !== id); }
    else { favorites.push(id); }
    localStorage.setItem('kpopbase_favs', JSON.stringify(favorites));
    refreshGrids();
};

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const favSection = document.getElementById('favSection');
    const noResults = document.getElementById('noResults');

    if (term) {
        if(loadMoreBtn) loadMoreBtn.classList.add('hidden');
        if(favSection) favSection.classList.add('hidden');
        
        const filtered = allData.filter(item => {
            const n = item.name[currentLang] || "";
            const c = item.ceo[currentLang] || "";
            return n.toLowerCase().includes(term) ||
                   item.artists.some(a => a.toLowerCase().includes(term)) ||
                   c.toLowerCase().includes(term);
        });
        
        renderGeneral(filtered, true);
        if(noResults) {
            noResults.classList.toggle('hidden', filtered.length > 0);
            noResults.textContent = i18n.noResults[currentLang];
        }
    } else {
        if(loadMoreBtn) loadMoreBtn.classList.toggle('hidden', currentIdx >= allData.length);
        renderInitial();
        if(noResults) noResults.classList.add('hidden');
    }
}

function refreshGrids() {
    const searchInput = document.getElementById('searchInput');
    const term = searchInput ? searchInput.value : '';
    if (!term) renderInitial();
    else handleSearch({ target: { value: term } });
}

function updateUI() {
    const favTitle = document.getElementById('favTitle');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if(favTitle) favTitle.textContent = i18n.favTitle[currentLang];
    if(loadMoreBtn) loadMoreBtn.textContent = i18n.loadMore[currentLang];
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

function updateStats() {
    const totalAgencies = document.getElementById('totalAgencies');
    const totalArtists = document.getElementById('totalArtists');
    
    if(totalAgencies) totalAgencies.textContent = allData.length;
    
    const artists = new Set();
    allData.forEach(item => item.artists.forEach(a => artists.add(a)));
    if(totalArtists) totalArtists.textContent = artists.size;
}

// --- Animal Test Functions ---

async function initAnimalTest() {
    if (isRunning) return;
    isRunning = true;
    const btn = document.getElementById('animal-btn');
    if (btn) btn.disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        const webcamContainer = document.getElementById('webcam-container');
        if (webcamContainer) {
            webcamContainer.innerHTML = ''; // clear previous if any
            webcamContainer.appendChild(webcam.canvas);
        }
        
        labelContainer = document.getElementById('label-container');
        if (labelContainer) {
            labelContainer.innerHTML = ''; 
            for (let i = 0; i < maxPredictions; i++) { 
                labelContainer.appendChild(document.createElement("div"));
            }
        }
    } catch (e) {
        console.error("Teachable Machine Init Failed", e);
        isRunning = false;
        if (btn) btn.disabled = false;
        alert("Camera access denied or error loading model.");
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    if (labelContainer) {
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }
}

// --- Disqus ---
function initDisqus() {
    const disqusThread = document.getElementById("disqus_thread");
    if (disqusThread) {
        const disqus_observer = new IntersectionObserver(function(entries) {
            if(entries[0].isIntersecting) {
                (function() {
                    var d = document, s = d.createElement('script');
                    s.src = 'https://product-builder-3.disqus.com/embed.js';
                    s.setAttribute('data-timestamp', +new Date());
                    (d.head || d.body).appendChild(s);
                })();
                disqus_observer.disconnect();
            }
        }, { threshold: [0] });
        disqus_observer.observe(disqusThread);
    }
}