Flip Card Memory Game
======================

Files:
- `flip card memory game.html` — main HTML file (open this in your browser)
- `styles.css` — styles for the game
- `script.js` — game logic

How to run:
1. Open `d:\DEV\PMAI projct\flip card memory game.html` in your web browser (double-click or right-click -> Open with...).
2. Choose a difficulty (4x4, 6x6, 8x8) and click "Start Game".
3. Click cards to flip. Match pairs to reveal them. Moves and timer are shown.
4. When all pairs are matched, a "You Win" overlay shows time and moves. Click Play Again or Restart Game to play again.

Notes / Implementation details:
- Uses emoji icons, so no external image assets are required.
- Grid is generated dynamically based on selected difficulty.
- Moves increments when two cards are flipped.
- Timer starts on the first card flip.
- Cards use a CSS 3D flip animation and drop shadow.

If you want to use real images instead of emoji, modify `prepareIcons` in `script.js` to return pairs of image URLs and adjust the card markup in `flip card memory game.html` accordingly.
