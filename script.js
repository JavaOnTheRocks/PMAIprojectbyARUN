/* Flip Card Memory Game
   - Generates grids for 4x4, 6x6, 8x8
   - Uses emoji icons for pairs (no external images required)
   - Smooth 3D flip animation with shadow
   - Tracks moves and time; shows a Win overlay
*/

// UI elements
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

// Game state
let gridSize = 4; // default 4x4
let icons = []; // emoji pool
let board = []; // shuffled cards
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let pairCount = 0;

// Timer
let timer = null;
let secondsElapsed = 0;
let timerStarted = false;

// A pool of >=32 distinct emoji icons for up to 8x8 (32 pairs)
const EMOJI_POOL = [
  '🐶','🐱','🦊','🐼','🐨','🦁','🐷','🐸',
  '🐵','🐔','🦉','🐙','🦄','🐝','🦋','🐢',
  '🍎','🍌','🍇','🍓','🍍','🥝','🍉','🍒',
  '⚽','🏀','🏈','🎾','🎲','🎮','🎧','🎸',
  '🚗','✈️','🚀','⏰','🔑','💡','🎁','🔥'
];

// Utility: shuffle array in-place (Fisher-Yates)
function shuffle(array){
  for(let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Format seconds to MM:SS
function formatTime(sec){
  const m = Math.floor(sec/60).toString().padStart(2,'0');
  const s = (sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// Initialize icons pool for the board based on pairCount
function prepareIcons(pairCount){
  if(pairCount > EMOJI_POOL.length) throw new Error('Not enough icons in pool');
  const chosen = EMOJI_POOL.slice(0, pairCount);
  // Duplicate and shuffle
  const pairs = shuffle([...chosen, ...chosen]);
  return pairs;
}

// Start or restart the game using currently selected difficulty
function startGame(){
  // Reset state
  clearInterval(timer);
  timer = null;
  secondsElapsed = 0;
  timerStarted = false;
  moves = 0;
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  // Read difficulty (grid dimension)
  gridSize = parseInt(difficultyEl.value, 10);
  const totalCards = gridSize * gridSize;
  pairCount = totalCards / 2;

  // Generate pairs
  board = prepareIcons(pairCount);
  boardEl.innerHTML = '';

  // Set CSS grid columns dynamically
  boardEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  // Create card elements
  board.forEach((icon, idx) =>{
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.icon = icon;
    card.dataset.index = idx;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back"> <span class="icon">${icon}</span> </div>
      </div>
    `;

    // Click handler
    card.addEventListener('click', onCardClicked);
    boardEl.appendChild(card);
  });

  // Update UI
  movesEl.textContent = moves;
  timerEl.textContent = formatTime(secondsElapsed);
  hideWinOverlay();
}

// Card click handler
function onCardClicked(e){
  const card = e.currentTarget;
  if(lockBoard) return; // prevent interaction while checking
  if(card === firstCard) return; // ignore double click on same card
  if(card.classList.contains('matched')) return; // already matched

  // Start timer on first actual flip
  if(!timerStarted){ startTimer(); timerStarted = true; }

  // Flip visual
  card.classList.add('flipped');

  if(!firstCard){
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true; // lock until we check

  // Count a move when two cards are flipped
  moves += 1;
  movesEl.textContent = moves;

  // Check match
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
  if(isMatch){
    // Mark matched
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs += 1;

    // Clean up references
    resetTurn(true);

    // Win condition
    if(matchedPairs === pairCount){
      endGame();
    }
  } else {
    // Not a match: flip back after a short delay
    setTimeout(()=>{
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn(false);
    }, 800);
  }
}

// Reset variables for next turn
function resetTurn(matched){
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Timer functions
function startTimer(){
  timer = setInterval(()=>{
    secondsElapsed += 1;
    timerEl.textContent = formatTime(secondsElapsed);
  }, 1000);
}

function stopTimer(){
  clearInterval(timer);
  timer = null;
}

// End game - show overlay
function endGame(){
  stopTimer();
  winTime.textContent = formatTime(secondsElapsed);
  winMoves.textContent = moves;
  showWinOverlay();
}

function showWinOverlay(){
  winOverlay.classList.remove('hidden');
}
function hideWinOverlay(){
  winOverlay.classList.add('hidden');
}

// Wire up controls
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

// Start a default game on load
startGame();

// Accessibility: allow Enter/Space to flip when card focused
boardEl.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' '){
    const card = document.activeElement;
    if(card && card.classList.contains('card')) card.click();
  }
});

// Add tabindex to cards dynamically (they are re-created on start)
// We add a simple MutationObserver to set focusable attribute on new cards
const obs = new MutationObserver((mutations)=>{
  mutations.forEach(m =>{
    m.addedNodes.forEach(node =>{
      if(node.nodeType === 1 && node.classList.contains('card')){
        node.setAttribute('tabindex','0');
      }
    });
  });
});
obs.observe(boardEl,{childList:true});
