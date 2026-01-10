
class LottoNumber extends HTMLElement {
  static get observedAttributes() {
    return ['number'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('class', 'lotto-number');

    const style = document.createElement('style');
    style.textContent = `
      .lotto-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #ddd;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5em;
          font-weight: bold;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          color: #333;
      }
    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(this.wrapper);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'number') {
      this.render();
    }
  }

  render() {
    const number = this.getAttribute('number');
    if (number) {
        this.wrapper.textContent = number;
        this.setNumberColor(parseInt(number, 10), this.wrapper);
    }
  }

  setNumberColor(number, element) {
    let color;
    let textColor = '#fff'; // Default text color for colored balls
    if (number <= 10) {
        color = '#fbe400'; // Yellow
        textColor = '#333'; // Dark text for yellow
    } else if (number <= 20) {
        color = '#69c8f2'; // Blue
    } else if (number <= 30) {
        color = '#ff7272'; // Red
    } else if (number <= 40) {
        color = '#aaa'; // Grey
    } else {
        color = '#b0d840'; // Green
    }
    element.style.backgroundColor = color;
    element.style.color = textColor;
  }
}

customElements.define('lotto-number', LottoNumber);

// --- DOM Elements ---
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');
const appTitle = document.getElementById('app-title');
const generateBtn = document.getElementById('generate-btn');
const menuTitle = document.getElementById('menu-title');
const menuBtn = document.getElementById('menu-btn');
const contactTitle = document.getElementById('contact-title');
const labelEmail = document.getElementById('label-email');
const labelMessage = document.getElementById('label-message');
const submitBtn = document.getElementById('submit-btn');
const commentsTitle = document.getElementById('comments-title');
const animalTitle = document.getElementById('animal-title');
const animalBtn = document.getElementById('animal-btn');
const webcamContainer = document.getElementById('webcam-container');
const labelContainer = document.getElementById('label-container');
const lottoNumbersContainer = document.getElementById('lotto-numbers-container');

// Description Elements
const lottoDesc = document.getElementById('lotto-desc');
const menuDesc = document.getElementById('menu-desc');
const animalDesc = document.getElementById('animal-desc');
const contactDesc = document.getElementById('contact-desc');
const privacyLink = document.getElementById('privacy-link');

// --- Data & State ---
const translations = {
    en: {
        title: "Lotto Number Generator",
        genBtn: "Generate Numbers",
        lottoDesc: "Generate your lucky 6 numbers (1-45) instantly. Use this tool to get random combinations for your next lottery ticket.",
        menuTitle: "Dinner Menu Recommendation",
        menuBtn: "Suggest Dinner",
        menuDesc: "Can't decide what to eat? Let our randomizer pick a delicious meal for you from various cuisines including Korean, Western, and more.",
        themeDark: "Dark Mode",
        themeLight: "Light Mode",
        langBtn: "한글",
        contactTitle: "Partnership Inquiry",
        contactDesc: "Have suggestions or want to work together? Send us a message.",
        labelEmail: "Your Email:",
        labelMessage: "Message:",
        submitBtn: "Send Message",
        commentsTitle: "Comments",
        animalTitle: "Animal Face Test",
        animalBtn: "Start Test",
        animalDesc: "Does your face look more like a puppy or a cat? AI analyzes your webcam image locally to find out. (No images are saved).",
        privacyLink: "Privacy Policy"
    },
    ko: {
        title: "로또 번호 생성기",
        genBtn: "번호 생성",
        lottoDesc: "1부터 45까지의 숫자 중 행운의 6개 번호를 즉시 생성해 보세요. 다음 로또 당첨을 위한 무작위 조합을 제공합니다.",
        menuTitle: "저녁 메뉴 추천",
        menuBtn: "메뉴 추천",
        menuDesc: "오늘 무엇을 먹을지 고민되시나요? 한식, 양식, 중식 등 다양한 메뉴 중에서 맛있는 식사를 골라드립니다.",
        themeDark: "다크 모드",
        themeLight: "라이트 모드",
        langBtn: "English",
        contactTitle: "제휴 문의",
        contactDesc: "제안하고 싶은 내용이나 협업 문의가 있으신가요? 메시지를 보내주세요.",
        labelEmail: "이메일 주소:",
        labelMessage: "문의 내용:",
        submitBtn: "메시지 보내기",
        commentsTitle: "댓글",
        animalTitle: "동물상 테스트",
        animalBtn: "테스트 시작",
        animalDesc: "내 얼굴은 강아지상일까요, 고양이상일까요? AI가 웹캠을 통해 실시간으로 분석해 드립니다. (이미지는 저장되지 않습니다).",
        privacyLink: "개인정보처리방침"
    }
};

const foods = {
    en: [
        "Pizza 🍕", "Chicken 🍗", "Burger 🍔", "Sushi 🍣", 
        "Pasta 🍝", "Kimchi Stew 🥘", "Bibimbap 🍚", 
        "Tacos 🌮", "Steak 🥩", "Salad 🥗", "Ramen 🍜", 
        "Sandwich 🥪", "Curry 🍛", "Tteokbokki 🍢"
    ],
    ko: [
        "피자 🍕", "치킨 🍗", "햄버거 🍔", "초밥 🍣", 
        "파스타 🍝", "김치찌개 🥘", "비빔밥 🍚", 
        "타코 🌮", "스테이크 🥩", "샐러드 🥗", "라면 🍜", 
        "샌드위치 🥪", "카레 🍛", "떡볶이 🍢"
    ]
};

let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';
let isRunning = false;

// --- Teachable Machine Setup ---
const URL = "https://teachablemachine.withgoogle.com/models/inOwxk_tm/";
let model, webcam, maxPredictions;

// --- Functions ---

function updateUI() {
    const t = translations[currentLang];
    
    // Text Content
    appTitle.textContent = t.title;
    generateBtn.textContent = t.genBtn;
    menuTitle.textContent = t.menuTitle;
    menuBtn.textContent = t.menuBtn;
    langToggleBtn.textContent = t.langBtn;
    contactTitle.textContent = t.contactTitle;
    labelEmail.textContent = t.labelEmail;
    labelMessage.textContent = t.labelMessage;
    submitBtn.textContent = t.submitBtn;
    commentsTitle.textContent = t.commentsTitle;
    animalTitle.textContent = t.animalTitle;
    
    // Description Text Updates
    lottoDesc.textContent = t.lottoDesc;
    menuDesc.textContent = t.menuDesc;
    animalDesc.textContent = t.animalDesc;
    contactDesc.textContent = t.contactDesc;
    privacyLink.textContent = t.privacyLink;

    if (!isRunning) { 
        animalBtn.textContent = t.animalBtn;
    }

    // Theme Button Text
    themeToggleBtn.textContent = currentTheme === 'dark' ? t.themeLight : t.themeDark;

    // Theme Attribute
    document.documentElement.setAttribute('data-theme', currentTheme);
}

async function initAnimalTest() {
    if (isRunning) return;
    isRunning = true;
    animalBtn.disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; 
    webcam = new tmImage.Webcam(200, 200, flip); 
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer.appendChild(webcam.canvas);
    labelContainer.innerHTML = ''; 
    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// --- Event Listeners ---

generateBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while(numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    for (const number of Array.from(numbers).sort((a, b) => a - b)) {
        const lottoNumberElement = document.createElement('lotto-number');
        lottoNumberElement.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoNumberElement);
    }
});

themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    updateUI();
});

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ko' : 'en';
    localStorage.setItem('lang', currentLang);
    updateUI();
});

menuBtn.addEventListener('click', () => {
    const menuResult = document.getElementById('menu-result');
    const currentFoods = foods[currentLang];
    const randomFood = currentFoods[Math.floor(Math.random() * currentFoods.length)];
    menuResult.textContent = randomFood;
    
    // Add a simple animation class
    menuResult.style.animation = 'none';
    menuResult.offsetHeight; /* trigger reflow */
    menuResult.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
});

animalBtn.addEventListener('click', initAnimalTest);

// --- Initial Render ---
updateUI();
