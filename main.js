
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

document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
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

// Theme and Language Logic
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

const translations = {
    en: {
        title: "Lotto Number Generator",
        genBtn: "Generate Numbers",
        menuTitle: "Dinner Menu Recommendation",
        menuBtn: "Suggest Dinner",
        themeDark: "Dark Mode",
        themeLight: "Light Mode",
        langBtn: "한글",
        contactTitle: "Partnership Inquiry",
        labelEmail: "Your Email:",
        labelMessage: "Message:",
        submitBtn: "Send Message",
        commentsTitle: "Comments"
    },
    ko: {
        title: "로또 번호 생성기",
        genBtn: "번호 생성",
        menuTitle: "저녁 메뉴 추천",
        menuBtn: "메뉴 추천",
        themeDark: "다크 모드",
        themeLight: "라이트 모드",
        langBtn: "English",
        contactTitle: "제휴 문의",
        labelEmail: "이메일 주소:",
        labelMessage: "문의 내용:",
        submitBtn: "메시지 보내기",
        commentsTitle: "댓글"
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

// State
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialization
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

    // Theme Button Text
    themeToggleBtn.textContent = currentTheme === 'dark' ? t.themeLight : t.themeDark;

    // Theme Attribute
    document.documentElement.setAttribute('data-theme', currentTheme);
}

// Initial Render
updateUI();

// Event Listeners
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

document.getElementById('menu-btn').addEventListener('click', () => {
    const menuResult = document.getElementById('menu-result');
    const currentFoods = foods[currentLang];
    const randomFood = currentFoods[Math.floor(Math.random() * currentFoods.length)];
    menuResult.textContent = randomFood;
    
    // Add a simple animation class
    menuResult.style.animation = 'none';
    menuResult.offsetHeight; /* trigger reflow */
    menuResult.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
});
