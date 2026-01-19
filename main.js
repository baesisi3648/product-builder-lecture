let allData = [];
let currentIdx = 0;
const step = 25;
let currentLang = 'kr';
let favorites = JSON.parse(localStorage.getItem('kpopbase_favs')) || [];

const i18n = {
    // Navigation / General
    favTitle: { kr: "즐겨찾기", en: "Favorites", ja: "お気に入り", es: "Favoritos", zh: "收藏" },
    noResults: { kr: "검색 결과가 없습니다.", en: "No results found.", ja: "検索結果がありません。", es: "No se encontraron resultados.", zh: "没有找到结果。" },
    loadMore: { kr: "소속사 더 보기", en: "Load More Agencies", ja: "もっと見る", es: "Cargar más", zh: "加载更多" },
    commentsTitle: { kr: "댓글", en: "Comments", ja: "コメント", es: "Comentarios", zh: "评论" },
    
    // Intro Section
    introTitle: { 
        kr: "KPOPBASE에 오신 것을 환영합니다", 
        en: "Welcome to KPOPBASE",
        ja: "KPOPBASEへようこそ",
        es: "Bienvenido a KPOPBASE",
        zh: "欢迎来到 KPOPBASE"
    },
    introDesc1: { 
        kr: "KPOPBASE는 대한민국 엔터테인먼트 산업에 대한 포괄적인 가이드를 제공합니다. HYBE, SM, JYP, YG와 같은 글로벌 기업부터 미래의 음악을 만들어가는 라이징 레이블까지, 가장 영향력 있는 K-pop 소속사들의 상세 정보를 대화형 지도와 함께 확인해보세요.", 
        en: "KPOPBASE is your comprehensive guide to the South Korean entertainment industry. We provide an interactive map and detailed directory of the most influential K-pop agencies, from global powerhouses like HYBE, SM, JYP, and YG, to rising labels that are shaping the future of music.",
        ja: "KPOPBASEは韓国エンターテインメント業界の総合ガイドです。HYBE、SM、JYP、YGなどの世界的企業から、未来の音楽を形作る注目のレーベルまで、最も影響力のあるK-POP事務所の詳細情報をインタラクティブな地図とともに提供します。",
        es: "KPOPBASE es su guía completa de la industria del entretenimiento de Corea del Sur. Proporcionamos un mapa interactivo y un directorio detallado de las agencias de K-pop más influyentes, desde potencias mundiales como HYBE, SM, JYP y YG, hasta sellos emergentes que están dando forma al futuro de la música.",
        zh: "KPOPBASE 是您了解韩国娱乐产业的综合指南。我们提供互动地图和详尽的 K-pop 经纪公司目录，涵盖 HYBE、SM、JYP 和 YG 等全球巨头，以及正在塑造音乐未来的新兴厂牌。"
    },
    introDesc2: { 
        kr: "소속사의 본사 위치를 탐색하고, 소속 아티스트를 발견하며, CEO 정보를 한곳에서 확인하세요. 좋아하는 그룹이 탄생한 곳이 궁금한 열성 팬이든, 데이터를 찾는 업계 분석가든, KPOPBASE가 여러분을 한류의 중심지로 연결해 드립니다.", 
        en: "Explore company headquarters, discover artist rosters, and check CEO information all in one place. Whether you are a dedicated fan wanting to know where your favorite group was formed, or an industry analyst looking for data, KPOPBASE connects you to the heart of Hallyu.",
        ja: "事務所の本社位置を探索し、所属アーティストを発見し、CEO情報を一か所で確認しましょう。好きなグループが誕生した場所を知りたい熱心なファンでも、データを探している業界アナリストでも、KPOPBASEはあなたを韓流の中心へと繋げます。",
        es: "Explore las sedes de las empresas, descubra las listas de artistas y consulte la información de los directores ejecutivos, todo en un solo lugar. Tanto si eres un fan dedicado que quiere saber dónde se formó su grupo favorito, como si eres un analista de la industria en busca de datos, KPOPBASE te conecta con el corazón del Hallyu.",
        zh: "在一个地方探索公司总部、发现艺人阵容并查看 CEO 信息。无论您是想知道最喜欢的组合在哪里成立的忠实粉丝，还是寻找数据的行业分析师，KPOPBASE 都能将您与韩流的中心连接起来。"
    },

    // Contact Section
    contactTitle: { kr: "제휴 문의", en: "Partnership Inquiry", ja: "提携のお問い合わせ", es: "Consulta de asociación", zh: "合作咨询" },
    contactDesc: { kr: "제안하고 싶은 내용이나 협업 문의가 있으신가요? 메시지를 보내주세요.", en: "Have suggestions or want to work together? Send us a message.", ja: "提案や協力のお問い合わせはありますか？メッセージを送ってください。", es: "¿Tiene sugerencias o quiere trabajar juntos? Envíenos un mensaje.", zh: "有建议或想合作吗？请给我们发消息。" },
    labelEmail: { kr: "이메일 주소:", en: "Your Email:", ja: "メールアドレス:", es: "Su correo electrónico:", zh: "您的电子邮件：" },
    labelMessage: { kr: "문의 내용:", en: "Message:", ja: "メッセージ:", es: "Mensaje:", zh: "留言：" },
    submitBtn: { kr: "메시지 보내기", en: "Send Message", ja: "送信", es: "Enviar mensaje", zh: "发送消息" },

    // FAQ Section
    faqTitle: { kr: "자주 묻는 질문 (FAQ)", en: "FAQ", ja: "よくある質問", es: "Preguntas frecuentes", zh: "常见问题" },
    faqQ1: { kr: "KPOPBASE란 무엇인가요?", en: "What is KPOPBASE?", ja: "KPOPBASEとは何ですか？", es: "¿Qué es KPOPBASE?", zh: "什么是 KPOPBASE？" },
    faqA1: { kr: "KPOPBASE는 K-pop 엔터테인먼트 소속사의 위치, 아티스트, 주요 인사 정보를 쉽게 찾을 수 있도록 돕는 글로벌 디렉토리 서비스입니다.", en: "KPOPBASE is a global directory service that helps users find information about K-pop entertainment agencies, including their location, artists, and key personnel.", ja: "KPOPBASEは、K-POPエンターテインメント事務所の位置、アーティスト、主要人物情報などを簡単に見つけることができるグローバルディレクトリサービスです。", es: "KPOPBASE es un servicio de directorio global que ayuda a los usuarios a encontrar información sobre las agencias de entretenimiento de K-pop, incluida su ubicación, artistas y personal clave.", zh: "KPOPBASE 是一项全球目录服务，旨在帮助用户查找有关 K-pop 娱乐经纪公司的信息，包括其位置、艺人和关键人员。" },
    faqQ4: { kr: "K-pop 4대 기획사는 어디인가요?", en: "What are the Big 4 K-pop agencies?", ja: "K-POPの4大事務所はどこですか？", es: "¿Cuáles son las 4 grandes agencias de K-pop?", zh: "K-pop 四大经纪公司是哪些？" },
    faqA4: { kr: "'4대 기획사'는 하이브(HYBE), SM 엔터테인먼트, JYP 엔터테인먼트, YG 엔터테인먼트를 말합니다. 이들은 세계적으로 인기 있는 K-pop 아티스트들을 다수 관리하고 있습니다.", en: "The 'Big 4' K-pop agencies are considered to be HYBE, SM Entertainment, JYP Entertainment, and YG Entertainment. They manage many of the most popular global K-pop acts.", ja: "「4大事務所」とは、HYBE、SMエンターテインメント、JYPエンターテインメント、YGエンターテインメントを指します。彼らは世界的に人気のあるK-POPアーティストを多数管理しています。", es: "Se considera que las '4 grandes' agencias de K-pop son HYBE, SM Entertainment, JYP Entertainment y YG Entertainment. Gestionan muchos de los actos de K-pop más populares a nivel mundial.", zh: "“四大” K-pop 经纪公司被认为是 HYBE、SM 娱乐、JYP 娱乐和 YG 娱乐。他们管理着许多全球最受欢迎的 K-pop 艺人。" },
    faqQ2: { kr: "정보는 얼마나 정확한가요?", en: "How accurate is the information?", ja: "情報はどのくらい正確ですか？", es: "¿Qué tan precisa es la información?", zh: "信息的准确性如何？" },
    faqA2: { kr: "최신 정보를 유지하기 위해 노력하고 있습니다. 소속사 주소와 아티스트 목록은 정기적으로 검증됩니다.", en: "We strive to keep our database updated with the latest information. Agency addresses and artist rosters are verified regularly.", ja: "最新情報を維持するために努力しています。事務所の住所やアーティストリストは定期的に検証されます。", es: "Nos esforzamos por mantener nuestra base de datos actualizada con la información más reciente. Las direcciones de las agencias y las listas de artistas se verifican regularmente.", zh: "我们努力保持数据库更新最新信息。经纪公司地址和艺人名单会定期核实。" },
    faqQ3: { kr: "이 서비스는 무료인가요?", en: "Is this service free?", ja: "このサービスは無料ですか？", es: "¿Este servicio es gratuito?", zh: "这项服务是免费的吗？" },
    faqA3: { kr: "네, 소속사 지도와 동물상 테스트를 포함한 KPOPBASE의 모든 도구는 완전히 무료입니다.", en: "Yes, all tools on KPOPBASE, including the Agency Map and Animal Face Test, are completely free to use.", ja: "はい、事務所マップや動物顔テストを含むKPOPBASEのすべてのツールは完全に無料です。", es: "Sí, todas las herramientas de KPOPBASE, incluido el mapa de agencias y la prueba de cara de animal, son completamente gratuitas.", zh: "是的，KPOPBASE 上的所有工具，包括经纪公司地图和动物脸测试，都是完全免费使用的。" },

    // Animal Modal
    animalTestBtn: { kr: "🐶 동물상 테스트", en: "🐶 Animal Test", ja: "🐶 動物顔テスト", es: "🐶 Prueba Animal", zh: "🐶 动物脸测试" },
    modalTitle: { kr: "동물상 테스트", en: "Animal Face Test", ja: "動物顔テスト", es: "Prueba de Cara de Animal", zh: "动物脸测试" },
    modalDesc: { kr: "내 얼굴은 강아지상일까요, 고양이상일까요? AI가 웹캠을 통해 실시간으로 분석해 드립니다. (이미지는 저장되지 않습니다).", en: "Does your face look more like a puppy or a cat? AI analyzes your webcam image locally to find out. (No images are saved).", ja: "私の顔は犬顔？猫顔？AIがウェブカメラを通じてリアルタイムで分析します（画像は保存されません）。", es: "¿Tu cara se parece más a la de un cachorro o a la de un gato? La IA analiza la imagen de tu cámara web localmente para averiguarlo. (No se guardan imágenes).", zh: "你的脸更像小狗还是猫？AI 通过本地网络摄像头图像进行分析以找出答案。（不会保存图像）。" },
    animalStartBtn: { kr: "테스트 시작", en: "Start Test", ja: "テスト開始", es: "Iniciar prueba", zh: "开始测试" }
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
        const animalStartBtn = document.getElementById('animalStartBtn');
        if (animalStartBtn) {
            animalStartBtn.addEventListener('click', initAnimalTest);
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

    // Modal Logic
    const animalModal = document.getElementById('animalModal');
    const animalTestBtn = document.getElementById('animalTestBtn');
    const closeAnimalModal = document.getElementById('closeAnimalModal');

    if (animalTestBtn && animalModal) {
        animalTestBtn.addEventListener('click', () => {
            animalModal.classList.remove('hidden');
        });
    }

    if (closeAnimalModal && animalModal) {
        closeAnimalModal.addEventListener('click', () => {
            animalModal.classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === animalModal) {
            animalModal.classList.add('hidden');
        }
    });
}

function renderInitial() {
    renderFavorites();
    renderGeneral(allData.slice(0, step), true);
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
    const ids = [
        'favTitle', 'introTitle', 'introDesc1', 'introDesc2',
        'contactTitle', 'contactDesc', 'labelEmail', 'labelMessage', 'submitBtn',
        'faqTitle', 'faqQ1', 'faqA1', 'faqQ4', 'faqA4', 'faqQ2', 'faqA2', 'faqQ3', 'faqA3',
        'commentsTitle', 'animalTestBtn', 'modalTitle', 'modalDesc', 'animalStartBtn',
        'loadMoreBtn'
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && i18n[id] && i18n[id][currentLang]) {
            el.textContent = i18n[id][currentLang];
        }
    });
    
    // Also update noResults text if visible (handled in search logic, but good to have fallback)
    const noResults = document.getElementById('noResults');
    if (noResults && !noResults.classList.contains('hidden')) {
        noResults.textContent = i18n.noResults[currentLang];
    }
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
    const btn = document.getElementById('animalStartBtn');
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