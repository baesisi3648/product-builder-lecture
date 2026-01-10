
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

const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggleBtn.textContent = 'Light Mode';
    }
}

themeToggleBtn.addEventListener('click', () => {
    let theme = 'light';
    if (document.documentElement.getAttribute('data-theme') !== 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = 'Light Mode';
        theme = 'dark';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = 'Dark Mode';
    }
    localStorage.setItem('theme', theme);
});
