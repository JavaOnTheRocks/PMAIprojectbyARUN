/*
  Flip Card Memory Game - Refactored
  - Encapsulated as a Game class for clarity and testability
  - Uses pointer events to provide a visible press animation while pressing
  - Cleaner timer, move counting, and win handling
  - Accessibility: keyboard support (Enter/Space) and focusable cards
*/

(function(){
  'use strict';

  // --- Cached DOM nodes ---
  const boardEl = document.getElementById('board');
  const movesEl = document.getElementById('moves');
  const timerEl = document.getElementById('timer');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const difficultyEl = document.getElementById('difficulty');
  const winOverlay = document.getElementById('winOverlay');
  const winTime = document.getElementById('winTime');
  const winMoves = document.getElementById('winMoves');

  // Emoji pool (>= 32 items for 8x8)
  const EMOJI_POOL = [
    '🐶','🐱','🦊','🐼','🐨','🦁','🐷','🐸',
    '🐵','🐔','🦉','🐙','🦄','🐝','🦋','🐢',
    '🍎','🍌','🍇','🍓','🍍','🥝','🍉','🍒',
    '⚽','🏀','🏈','🎾','🎲','🎮','🎧','🎸',
    '🚗','✈️','🚀','⏰','🔑','💡','🎁','🔥'
  ];

  // Simple shuffle (Fisher-Yates)
  function shuffle(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Format time as mm:ss
  function formatTime(seconds){
    const m = Math.floor(seconds / 60).toString().padStart(2,'0');
    const s = (seconds % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  class MemoryGame {
    constructor(root){
      this.root = root;
      this.grid = 4;
      this.pairCount = 8;
      this.deck = [];
      this.first = null;
      this.second = null;
      this.lock = false;
      this.moves = 0;
      this.matched = 0;

      this.timerId = null;
      this.seconds = 0;
      this.timerRunning = false;

      this._bindUI();
    }

    _bindUI(){
      startBtn.addEventListener('click', () => this.start());
      restartBtn.addEventListener('click', () => this.start());
      playAgainBtn.addEventListener('click', () => this.start());

      // Keyboard support on board (Enter / Space)
      boardEl.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){
          const el = document.activeElement;
          if(el && el.classList.contains('card')) el.click();
        }
      });

      // Pointer press visual: add 'pressing' class while pointer is down
      boardEl.addEventListener('pointerdown', (e)=>{
        const card = e.target.closest('.card');
        if(card && !card.classList.contains('flipped') && !card.classList.contains('matched')){
          card.classList.add('pressing');
        }
      });
      document.addEventListener('pointerup', ()=>{
        document.querySelectorAll('.card.pressing').forEach(c=>c.classList.remove('pressing'));
      });
    }

    _createDeck(){
      const total = this.grid * this.grid;
      this.pairCount = total / 2;
      if(this.pairCount > EMOJI_POOL.length) throw new Error('Not enough icons');
      const chosen = EMOJI_POOL.slice(0, this.pairCount);
      this.deck = shuffle([...chosen, ...chosen]);
    }

    start(){
      // reset
      this.stopTimer();
      this.seconds = 0;
      this.timerRunning = false;
      this.moves = 0;
      this.matched = 0;
      this.first = null;
      this.second = null;
      this.lock = false;

      // read grid
      this.grid = parseInt(difficultyEl.value, 10) || 4;
      this._createDeck();

      // render
      this._renderBoard();
      movesEl.textContent = this.moves;
      timerEl.textContent = formatTime(this.seconds);
      this._hideWin();
    }

    _renderBoard(){
      boardEl.innerHTML = '';
      boardEl.style.gridTemplateColumns = `repeat(${this.grid}, 1fr)`;

      this.deck.forEach((icon, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('role','button');
        card.setAttribute('aria-label','Memory card');
        card.setAttribute('tabindex','0');
        card.dataset.icon = icon;
        card.dataset.index = idx;

        card.innerHTML = `
          <div class="card-inner">
            <div class="card-face card-front"></div>
            <div class="card-face card-back"> <span class="icon">${icon}</span> </div>
          </div>`;

        card.addEventListener('click', (ev) => this._onCardClick(ev, card));
        boardEl.appendChild(card);
      });
      // Update icon size once cards are in the DOM
      this._updateIconSize();
      // Recompute on window resize (debounced)
      if(!this._resizeListenerAdded){
        this._resizeListenerAdded = true;
        let timeout = null;
        window.addEventListener('resize', ()=>{
          clearTimeout(timeout);
          timeout = setTimeout(()=> this._updateIconSize(), 150);
        });
      }
    }

    // Compute a suitable icon font-size and depth based on the rendered card size
    _updateIconSize(){
      // find one card to measure; if none exist, skip
      const card = boardEl.querySelector('.card');
      if(!card) return;

      // computed gap between grid items
      const styles = window.getComputedStyle(boardEl);
      const gap = parseFloat(styles.gap) || 0;

      // available width inside the board (clientWidth includes padding)
      const boardWidth = boardEl.clientWidth;
      const cardWidth = (boardWidth - gap * (this.grid - 1)) / this.grid;

      // choose icon size as a fraction of card width - larger ratio for better visibility
      const sizeRatio = this.grid === 8 ? 0.75 : 0.55; // 75% for 8x8, 55% for smaller grids
      const iconSize = Math.max(12, Math.round(cardWidth * sizeRatio));
      const translateZ = Math.max(6, Math.round(iconSize * 0.3)); // slightly deeper 3D effect

      boardEl.style.setProperty('--icon-size', iconSize + 'px');
      boardEl.style.setProperty('--icon-translateZ', translateZ + 'px');
    }

    _onCardClick(e, card){
      if(this.lock) return;
      if(card.classList.contains('matched') || card.classList.contains('flipped')) return;

      // start timer on first interaction
      if(!this.timerRunning){ this._startTimer(); this.timerRunning = true; }

      // remove pressing visual if present
      card.classList.remove('pressing');

      // flip
      card.classList.add('flipped');

      if(!this.first){
        this.first = card;
        return;
      }

      this.second = card;
      this.lock = true;
      this.moves += 1;
      movesEl.textContent = this.moves;

      // check for match
      const match = this.first.dataset.icon === this.second.dataset.icon;
      if(match){
        this.first.classList.add('matched');
        this.second.classList.add('matched');
        this.matched += 1;
        this._resetTurn(true);
        if(this.matched === this.pairCount) this._onWin();
      } else {
        setTimeout(()=>{
          this.first.classList.remove('flipped');
          this.second.classList.remove('flipped');
          this._resetTurn(false);
        }, 900); // slightly longer so user sees cards
      }
    }

    _resetTurn(matched){
      this.first = null;
      this.second = null;
      this.lock = false;
    }

    _startTimer(){
      this.stopTimer();
      this.timerId = setInterval(()=>{
        this.seconds += 1;
        timerEl.textContent = formatTime(this.seconds);
      }, 1000);
    }

    stopTimer(){
      if(this.timerId) clearInterval(this.timerId);
      this.timerId = null;
    }

    _onWin(){
      this.stopTimer();
      winTime.textContent = formatTime(this.seconds);
      winMoves.textContent = this.moves;
      this._showWin();
    }

    _showWin(){ winOverlay.classList.remove('hidden'); }
    _hideWin(){ winOverlay.classList.add('hidden'); }
  }

  // initialize game instance
  const GAME = new MemoryGame(boardEl);
  // start default game
  GAME.start();

})();
