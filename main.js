
class LottoNumber extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'lotto-number');
    const number = this.getAttribute('number');
    wrapper.textContent = number;

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
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);

    this.setNumberColor(parseInt(number, 10), wrapper);
  }

  setNumberColor(number, element) {
    let color;
    if (number <= 10) {
        color = '#fbe400'; // Yellow
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
