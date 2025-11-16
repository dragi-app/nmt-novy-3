// Скрипт для мінігри «Дві істини»

document.addEventListener('DOMContentLoaded', () => {
  // Отримуємо посилання на основні елементи
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-button');
  const gameContainer = document.getElementById('game-container');
  const board = document.getElementById('board');
  const answerOverlay = document.getElementById('answer-overlay');
  const currentPairEl = document.getElementById('current-pair');
  const optionButtons = Array.from(document.querySelectorAll('.option-btn'));
  const explanationEl = document.getElementById('explanation');
  const shieldFill = document.getElementById('shield-fill');
  const shieldText = document.getElementById('shield-text');
  const finishScreen = document.getElementById('finish-screen');

  // Масив пар: текст, правильна відповідь та коротке пояснення
  const pairs = [
    {
      text: 'радості / радости',
      correct: 'обидві',
      explanation: 'У родовому відмінку третьої відміни нормативні обидві форми: радості і радости.'
    },
    {
      text: 'крові / крови',
      correct: 'обидві',
      explanation: 'Слово «кров» у родовому відмінку може мати закінчення -і або -и: крові та крови.'
    },
    {
      text: 'Лондона / Лондону',
      correct: 'обидві',
      explanation: 'Назви міст у родовому відмінку допускають варіанти -а та -у: Лондона і Лондону.'
    },
    {
      text: 'лавреат / лауреат',
      correct: 'обидві',
      explanation: 'У запозичених словах типу «лауреат» новий правопис дозволяє форми лавреат і лауреат.'
    },
    {
      text: 'листу / листа',
      correct: 'лише друга',
      explanation: 'У значенні «письмове послання» родовий відмінок іменника «лист» має форму листа.'
    },
    {
      text: 'сітки / сіті',
      correct: 'лише перша',
      explanation: 'Родовий відмінок слова «сітка» має форму сітки; варіант «сіті» є неправильним.'
    }
  ];

  // Змінні для відстеження стану гри
  let currentIndex = null;
  let answeredCount = 0;

  // Створюємо мерехтливі зірки на фоні
  function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 80;
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starsContainer.appendChild(star);
    }
  }

  // Функція для запуску гри
  function startGame() {
    // Ховаємо стартовий та фінальний екрани
    startScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    // Показуємо ігровий контейнер
    gameContainer.classList.remove('hidden');
    // Очищаємо дошку і створюємо картки-пари
    board.innerHTML = '';
    pairs.forEach((pair, index) => {
      const card = document.createElement('div');
      card.className = 'pair-card';
      card.textContent = pair.text;
      card.dataset.index = index;
      card.addEventListener('click', handlePairClick);
      board.appendChild(card);
    });
    // Скидаємо лічильники
    answeredCount = 0;
    updateShield();
    explanationEl.classList.add('hidden');
    currentIndex = null;
  }

  // Обробник натискання на картку-пару
  function handlePairClick(event) {
    const idx = Number(event.currentTarget.dataset.index);
    const card = event.currentTarget;
    // Якщо для пари вже обрано відповідь — ігноруємо
    if (card.classList.contains('correct') || card.classList.contains('incorrect')) {
      return;
    }
    currentIndex = idx;
    currentPairEl.textContent = pairs[idx].text;
    answerOverlay.classList.remove('hidden');
  }

  // Обробник вибору варіанту
  function handleOptionClick(event) {
    const chosen = event.currentTarget.dataset.value;
    // Переконуємось, що є активна пара
    if (currentIndex === null) return;
    const pairData = pairs[currentIndex];
    const card = board.querySelector(`.pair-card[data-index='${currentIndex}']`);
    // Перевіряємо правильність
    if (chosen === pairData.correct) {
      card.classList.add('correct');
    } else {
      card.classList.add('incorrect');
    }
    // Показуємо пояснення
    explanationEl.textContent = pairData.explanation;
    explanationEl.classList.remove('hidden');
    // Оновлюємо лічильник, якщо вперше відповіли на цю пару
    if (!card.dataset.answered) {
      answeredCount++;
      card.dataset.answered = 'true';
      updateShield();
    }
    // Закриваємо вікно вибору
    answerOverlay.classList.add('hidden');
    currentIndex = null;
    // Якщо усі пари пройдено — завершуємо гру
    if (answeredCount === pairs.length) {
      // Невелика затримка, щоб гравець побачив останнє пояснення
      setTimeout(finishGame, 1200);
    } else {
      // Ховаємо пояснення через певний час
      setTimeout(() => {
        explanationEl.classList.add('hidden');
      }, 1800);
    }
  }

  // Оновлення смуги щита
  function updateShield() {
    const percent = Math.round((answeredCount / pairs.length) * 100);
    shieldFill.style.width = `${percent}%`;
    shieldText.textContent = `${percent}\u00a0%`;
  }

  // Завершення гри
  function finishGame() {
    // Приховуємо ігровий контейнер
    gameContainer.classList.add('hidden');
    // Оновлюємо загальний прогрес (3/9)
    const fill = finishScreen.querySelector('.general-progress-fill');
    const text = finishScreen.querySelector('.general-progress-text');
    if (fill) {
      fill.style.width = `${(3 / 9) * 100}%`;
    }
    if (text) {
      text.innerHTML = `3&nbsp;/&nbsp;9`;
    }
    finishScreen.classList.remove('hidden');
  }

  // Привʼязуємо події
  startButton.addEventListener('click', startGame);
  optionButtons.forEach((btn) => btn.addEventListener('click', handleOptionClick));
  // Створюємо зірки на фоні
  createStars();
});