# Memory Card Game - Test Cases

## 1. Game Initialization Tests

### 1.1 Grid Generation
- [TC-1.1.1] Verify 4x4 grid creates 16 cards
- [TC-1.1.2] Verify 6x6 grid creates 36 cards
- [TC-1.1.3] Verify 8x8 grid creates 64 cards
- [TC-1.1.4] Verify cards are randomly distributed
- [TC-1.1.5] Verify pairs count matches grid size (8, 18, 32 pairs)

### 1.2 Initial State
- [TC-1.2.1] Verify timer starts at 00:00
- [TC-1.2.2] Verify moves counter starts at 0
- [TC-1.2.3] Verify all cards start face-down
- [TC-1.2.4] Verify win overlay is hidden
- [TC-1.2.5] Verify game controls are enabled

## 2. Game Interaction Tests

### 2.1 Card Flipping
- [TC-2.1.1] Verify card flips on click
- [TC-2.1.2] Verify card flips on Enter key
- [TC-2.1.3] Verify card flips on Space key
- [TC-2.1.4] Verify maximum two cards can be flipped simultaneously
- [TC-2.1.5] Verify matched cards remain face-up
- [TC-2.1.6] Verify non-matched cards flip back after delay

### 2.2 Visual Feedback
- [TC-2.2.1] Verify press animation on card click
- [TC-2.2.2] Verify 3D flip animation smoothness
- [TC-2.2.3] Verify emoji sizing in 4x4 grid (55% of tile)
- [TC-2.2.4] Verify emoji sizing in 6x6 grid (55% of tile)
- [TC-2.2.5] Verify emoji sizing in 8x8 grid (75% of tile)
- [TC-2.2.6] Verify card spacing is consistent

## 3. Game Logic Tests

### 3.1 Matching Logic
- [TC-3.1.1] Verify correct pair remains face-up
- [TC-3.1.2] Verify incorrect pair flips back
- [TC-3.1.3] Verify matched cards are non-clickable
- [TC-3.1.4] Verify moves counter increments per pair attempt
- [TC-3.1.5] Verify same card can't be clicked twice

### 3.2 Timer Logic
- [TC-3.2.1] Verify timer starts on first card flip
- [TC-3.2.2] Verify timer format (MM:SS)
- [TC-3.2.3] Verify timer stops on game completion
- [TC-3.2.4] Verify timer resets on game restart
- [TC-3.2.5] Verify timer accuracy over time

## 4. Win Condition Tests

### 4.1 Game Completion
- [TC-4.1.1] Verify win detection when all pairs matched
- [TC-4.1.2] Verify final move count accuracy
- [TC-4.1.3] Verify final time accuracy
- [TC-4.1.4] Verify win overlay display
- [TC-4.1.5] Verify game state frozen after win

### 4.2 Game Reset
- [TC-4.2.1] Verify complete reset on "Play Again"
- [TC-4.2.2] Verify complete reset on "Restart"
- [TC-4.2.3] Verify grid size maintenance on restart
- [TC-4.2.4] Verify new card distribution on reset
- [TC-4.2.5] Verify counter/timer reset

## 5. Accessibility Tests

### 5.1 Keyboard Navigation
- [TC-5.1.1] Verify Tab navigation through all cards
- [TC-5.1.2] Verify Enter/Space activation
- [TC-5.1.3] Verify focus visibility
- [TC-5.1.4] Verify logical tab order
- [TC-5.1.5] Verify keyboard trap prevention

### 5.2 Screen Reader
- [TC-5.2.1] Verify card state announcements
- [TC-5.2.2] Verify match/non-match announcements
- [TC-5.2.3] Verify score/time announcements
- [TC-5.2.4] Verify win state announcement
- [TC-5.2.5] Verify ARIA attributes presence

## 6. Responsive Design Tests

### 6.1 Layout Adaptation
- [TC-6.1.1] Verify mobile layout (320px)
- [TC-6.1.2] Verify tablet layout (768px)
- [TC-6.1.3] Verify desktop layout (1024px+)
- [TC-6.1.4] Verify landscape orientation
- [TC-6.1.5] Verify portrait orientation

### 6.2 Touch Interface
- [TC-6.2.1] Verify touch response
- [TC-6.2.2] Verify tap accuracy
- [TC-6.2.3] Verify touch feedback
- [TC-6.2.4] Verify minimum touch target size
- [TC-6.2.5] Verify gesture prevention

## 7. Performance Tests

### 7.1 Load Time
- [TC-7.1.1] Verify initial load < 2s
- [TC-7.1.2] Verify restart load < 1s
- [TC-7.1.3] Verify animation smoothness
- [TC-7.1.4] Verify memory usage
- [TC-7.1.5] Verify CPU usage

### 7.2 Browser Compatibility
- [TC-7.2.1] Verify Chrome functionality
- [TC-7.2.2] Verify Firefox functionality
- [TC-7.2.3] Verify Safari functionality
- [TC-7.2.4] Verify Edge functionality
- [TC-7.2.5] Verify mobile browser functionality