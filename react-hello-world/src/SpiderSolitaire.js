import React, { useState, useEffect, useCallback } from 'react';
import './SpiderSolitaire.css';

const SpiderSolitaire = () => {
  // Game state
  const [cards, setCards] = useState([]);
  const [tableau, setTableau] = useState([]);
  const [stockPile, setStockPile] = useState([]);
  const [foundationPiles, setFoundationPiles] = useState([]);
  const [score, setScore] = useState(500);
  const [difficulty, setDifficulty] = useState(1); // 1, 2, or 4 suits
  const [selectedCards, setSelectedCards] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCards, setDraggedCards] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [theme, setTheme] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [initialGameState, setInitialGameState] = useState(null);

  // Card suits and values
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  // Add window resize listener to update card positions
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render when window is resized to update card positions
      setTableau([...tableau]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tableau]);

  // Create a deck of cards based on difficulty
  const createDeck = useCallback(() => {
    let deck = [];
    const suitCount = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 4;

    // Create 8 full decks (104 cards total)
    for (let d = 0; d < 8; d++) {
      for (let s = 0; s < suitCount; s++) {
        const suit = suits[s];
        for (let v = 0; v < values.length; v++) {
          deck.push({
            id: `${suit}-${values[v]}-${d}`,
            suit,
            value: values[v],
            faceUp: false,
            color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
          });
        }
      }
    }

    return shuffleDeck(deck);
  }, [difficulty]);

  // Shuffle the deck
  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize the game
  const initializeGame = useCallback(() => {
    const deck = createDeck();
    const newTableau = Array(10).fill().map(() => []);

    // Deal cards to tableau
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 6; j++) {
        const card = deck.pop();
        if (j === 5) card.faceUp = true; // Last card is face up
        newTableau[i].push(card);
      }
    }

    for (let i = 4; i < 10; i++) {
      for (let j = 0; j < 5; j++) {
        const card = deck.pop();
        if (j === 4) card.faceUp = true; // Last card is face up
        newTableau[i].push(card);
      }
    }

    // Set up stock pile with remaining cards
    setStockPile(deck);
    setTableau(newTableau);
    setFoundationPiles(Array(8).fill().map(() => []));
    setScore(500);
    setMoveHistory([]);

    // Save initial game state for restart functionality
    setInitialGameState({
      tableau: JSON.parse(JSON.stringify(newTableau)),
      stockPile: JSON.parse(JSON.stringify(deck)),
      score: 500
    });
  }, [createDeck]);

  // Deal cards from stock pile
  const dealCards = () => {
    if (stockPile.length === 0) return;

    // Check if all tableau columns have at least one card
    const emptyColumns = tableau.filter(column => column.length === 0);
    if (emptyColumns.length > 0) {
      alert("You must fill all empty columns before dealing more cards.");
      return;
    }

    const newTableau = [...tableau];
    const newStockPile = [...stockPile];

    // Deal one card to each tableau column
    for (let i = 0; i < 10; i++) {
      if (newStockPile.length > 0) {
        const card = newStockPile.pop();
        card.faceUp = true;
        newTableau[i].push(card);
      }
    }

    setTableau(newTableau);
    setStockPile(newStockPile);
    setScore(prevScore => Math.max(0, prevScore - 10)); // Deduct points for dealing

    // Save move to history
    setMoveHistory(prev => [...prev, {
      type: 'deal',
      tableau: JSON.parse(JSON.stringify(newTableau)),
      stockPile: JSON.parse(JSON.stringify(newStockPile)),
      score: Math.max(0, score - 10)
    }]);

    playSound('deal');
  };

  // Check if a move is valid
  const isValidMove = (cards, targetColumn) => {
    if (tableau[targetColumn].length === 0) {
      // Any card can be placed on an empty column
      return true;
    }

    const targetCard = tableau[targetColumn][tableau[targetColumn].length - 1];
    const movingCard = cards[0];

    // In Spider Solitaire, you can place a card on another if it's one rank lower, regardless of suit
    return (
      targetCard.faceUp && 
      values.indexOf(targetCard.value) === values.indexOf(movingCard.value) + 1
    );
  };

  // Handle card selection/dragging
  const handleCardClick = (columnIndex, cardIndex) => {
    const column = tableau[columnIndex];

    // Can only select face-up cards
    if (!column[cardIndex].faceUp) return;

    // Select all cards from this index to the end of the column
    const selectedCards = column.slice(cardIndex);

    // Check if the selected cards form a valid sequence
    let isValidSequence = true;
    for (let i = 0; i < selectedCards.length - 1; i++) {
      const currentCard = selectedCards[i];
      const nextCard = selectedCards[i + 1];

      if (
        values.indexOf(currentCard.value) !== values.indexOf(nextCard.value) + 1 ||
        currentCard.suit !== nextCard.suit
      ) {
        isValidSequence = false;
        break;
      }
    }

    if (isValidSequence) {
      setSelectedCards({
        cards: selectedCards,
        sourceColumn: columnIndex,
        sourceIndex: cardIndex
      });
    }
  };

  // Handle drag start
  const handleDragStart = (e, columnIndex, cardIndex) => {
    const column = tableau[columnIndex];

    // Can only drag face-up cards
    if (!column[cardIndex].faceUp) {
      e.preventDefault();
      return;
    }

    // Select all cards from this index to the end of the column
    const cardsToMove = column.slice(cardIndex);

    // Check if the selected cards form a valid sequence
    let isValidSequence = true;
    for (let i = 0; i < cardsToMove.length - 1; i++) {
      const currentCard = cardsToMove[i];
      const nextCard = cardsToMove[i + 1];

      if (
        values.indexOf(currentCard.value) !== values.indexOf(nextCard.value) + 1 ||
        currentCard.suit !== nextCard.suit
      ) {
        isValidSequence = false;
        break;
      }
    }

    if (isValidSequence) {
      // Store the drag data
      setIsDragging(true);
      setDraggedCards({
        cards: cardsToMove,
        sourceColumn: columnIndex,
        sourceIndex: cardIndex
      });
      setDragSource(columnIndex);

      // Set data for the drag operation
      e.dataTransfer.setData('text/plain', JSON.stringify({
        sourceColumn: columnIndex,
        sourceIndex: cardIndex
      }));

      // Set a custom drag image if needed
      // This is optional but can improve the user experience
      try {
        const dragImage = e.target.cloneNode(true);
        dragImage.style.opacity = '0.7';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 50, 50);
        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      } catch (err) {
        console.log('Error setting drag image:', err);
      }
    } else {
      e.preventDefault();
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedCards(null);
    setDragSource(null);
  };

  // Handle dropping cards
  const handleDrop = (targetColumnIndex) => {
    // Use draggedCards if available (drag operation), otherwise use selectedCards (click operation)
    const cardData = draggedCards || selectedCards;

    if (!cardData || !cardData.cards || !cardData.cards.length) return;

    const { cards, sourceColumn, sourceIndex } = cardData;

    // Check if the move is valid
    if (isValidMove(cards, targetColumnIndex)) {
      const newTableau = [...tableau];

      // Remove cards from source column
      newTableau[sourceColumn] = newTableau[sourceColumn].slice(0, sourceIndex);

      // If the source column has cards left and the top card is face down, flip it
      if (newTableau[sourceColumn].length > 0 && !newTableau[sourceColumn][newTableau[sourceColumn].length - 1].faceUp) {
        newTableau[sourceColumn][newTableau[sourceColumn].length - 1].faceUp = true;
      }

      // Add cards to target column
      newTableau[targetColumnIndex] = [...newTableau[targetColumnIndex], ...cards];

      // Save the current state to history
      setMoveHistory(prev => [...prev, {
        type: 'move',
        tableau: JSON.parse(JSON.stringify(tableau)),
        stockPile: JSON.parse(JSON.stringify(stockPile)),
        score
      }]);

      // Update tableau and deduct points
      setTableau(newTableau);
      setScore(prevScore => Math.max(0, prevScore - 1));

      // Check for completed sequences
      checkForCompletedSequences(newTableau);

      playSound('move');
    }

    // Reset both selection states
    setSelectedCards(null);
    setDraggedCards(null);
    setIsDragging(false);
  };

  // Check for completed sequences (K-A of same suit)
  const checkForCompletedSequences = (tableauToCheck, recursionDepth = 0) => {
    // Limit recursion depth to prevent infinite recursion
    if (recursionDepth > 10) {
      console.warn('Maximum recursion depth reached in checkForCompletedSequences');
      return;
    }

    const newTableau = [...tableauToCheck];
    let sequencesFound = 0;
    const newFoundationPiles = [...foundationPiles];

    // Check each column for completed sequences
    for (let columnIndex = 0; columnIndex < newTableau.length; columnIndex++) {
      const column = newTableau[columnIndex];

      // Need at least 13 cards to form a sequence
      if (column.length >= 13) {
        // Check for sequences starting from any position in the column
        // Start from the bottom of the column and work upwards
        let i = column.length - 1;

        while (i >= 12) {
          // Check if cards from i-12 to i form a sequence from K to A of the same suit
          let isSequence = true;
          const suit = column[i].suit;

          // Check if the card at position i is a King (starting point of sequence)
          if (column[i].value !== 'K') {
            i--;
            continue;
          }

          // Check the sequence of 13 cards (K to A)
          for (let j = 0; j < 13; j++) {
            const cardIndex = i - j;
            const expectedValue = values[12 - j]; // K, Q, J, 10, ..., A

            if (
              cardIndex < 0 || // Make sure we don't go out of bounds
              !column[cardIndex].faceUp ||
              column[cardIndex].value !== expectedValue ||
              column[cardIndex].suit !== suit
            ) {
              isSequence = false;
              break;
            }
          }

          if (isSequence) {
            // Move sequence to foundation pile
            const sequence = column.splice(i - 12, 13);

            // Find an empty foundation pile
            let foundEmptyPile = false;
            for (let pileIndex = 0; pileIndex < newFoundationPiles.length; pileIndex++) {
              if (newFoundationPiles[pileIndex].length === 0) {
                newFoundationPiles[pileIndex] = sequence;
                foundEmptyPile = true;
                break;
              }
            }

            // If no empty pile was found, add to a new pile
            if (!foundEmptyPile && sequencesFound < 8) {
              newFoundationPiles[sequencesFound] = sequence;
            }

            sequencesFound++;

            // If the column has cards left and the top card is face down, flip it
            if (column.length > 0 && !column[column.length - 1].faceUp) {
              column[column.length - 1].faceUp = true;
            }

            // Award points for completing a sequence
            setScore(prevScore => prevScore + 100);

            playSound('complete');

            // After removing a sequence, we need to adjust our index
            // since the column length has changed
            i = Math.min(i, column.length - 1);
          } else {
            // If no sequence found at this position, move up one card
            i--;
          }
        }
      }
    }

    if (sequencesFound > 0) {
      setTableau(newTableau);
      setFoundationPiles(newFoundationPiles);

      // Check if the game is won
      const totalFoundationCards = newFoundationPiles.reduce((sum, pile) => sum + pile.length, 0);
      if (totalFoundationCards === 104) {
        // Game won!
        playSound('win');
        alert('Congratulations! You won the game!');
      }

      // Check for more sequences with increased recursion depth
      checkForCompletedSequences(newTableau, recursionDepth + 1);
    }
  };

  // Undo the last move
  const undoMove = () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    setTableau(lastMove.tableau);
    setStockPile(lastMove.stockPile);
    setScore(lastMove.score);
    setMoveHistory(prev => prev.slice(0, -1));

    playSound('undo');
  };

  // Provide a hint
  const getHint = () => {
    // Look for valid moves
    for (let sourceCol = 0; sourceCol < tableau.length; sourceCol++) {
      const column = tableau[sourceCol];

      // Skip empty columns
      if (column.length === 0) continue;

      // Check each face-up card in the column
      for (let cardIndex = 0; cardIndex < column.length; cardIndex++) {
        if (!column[cardIndex].faceUp) continue;

        // Check if this card and those after it form a valid sequence
        let isValidSequence = true;
        for (let i = cardIndex; i < column.length - 1; i++) {
          const currentCard = column[i];
          const nextCard = column[i + 1];

          if (
            values.indexOf(currentCard.value) !== values.indexOf(nextCard.value) + 1 ||
            currentCard.suit !== nextCard.suit
          ) {
            isValidSequence = false;
            break;
          }
        }

        if (isValidSequence) {
          const cards = column.slice(cardIndex);

          // Check if these cards can be moved to another column
          for (let targetCol = 0; targetCol < tableau.length; targetCol++) {
            if (targetCol === sourceCol) continue;

            if (isValidMove(cards, targetCol)) {
              // Highlight the source and target
              highlightHint(sourceCol, cardIndex, targetCol);
              return;
            }
          }
        }
      }
    }

    // If no moves found, suggest dealing from stock
    if (stockPile.length > 0) {
      alert('Hint: Deal more cards from the stock pile.');
    } else {
      alert('No valid moves available.');
    }
  };

  // Highlight a hint
  const highlightHint = (sourceCol, cardIndex, targetCol) => {
    // Visual indication of the hint
    alert(`Hint: Move ${tableau[sourceCol][cardIndex].value} of ${tableau[sourceCol][cardIndex].suit} from column ${sourceCol + 1} to column ${targetCol + 1}`);
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // Play sound effects
  const playSound = (soundType) => {
    if (!soundEnabled) return;

    // Create audio elements for each sound type
    const soundMap = {
      'move': 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3',
      'deal': 'https://assets.mixkit.co/sfx/preview/mixkit-poker-card-deck-shuffle-1996.mp3',
      'complete': 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
      'undo': 'https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3',
      'win': 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
      'restart': 'https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-casino-notification-211.mp3'
    };

    if (soundMap[soundType]) {
      try {
        const sound = new Audio(soundMap[soundType]);
        sound.volume = 0.5; // Set volume to 50%
        sound.play().catch(e => console.log('Error playing sound:', e));
      } catch (error) {
        console.log('Error creating audio:', error);
      }
    }
  };

  // Change theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Restart the current game (reset to initial state)
  const restartGame = () => {
    if (!initialGameState) return;

    setTableau(JSON.parse(JSON.stringify(initialGameState.tableau)));
    setStockPile(JSON.parse(JSON.stringify(initialGameState.stockPile)));
    setScore(initialGameState.score);
    setFoundationPiles(Array(8).fill().map(() => []));
    setMoveHistory([]);

    playSound('restart');
  };

  // Calculate responsive offsets based on screen size
  const getResponsiveOffsets = () => {
    const width = window.innerWidth;
    if (width <= 576) {
      return { vertical: 15, horizontal: 3 };
    } else if (width <= 768) {
      return { vertical: 18, horizontal: 4 };
    } else if (width <= 992) {
      return { vertical: 20, horizontal: 4 };
    } else {
      return { vertical: 25, horizontal: 5 };
    }
  };

  // Render card
  const renderCard = (card, columnIndex, cardIndex) => {
    if (!card) return null;

    const isSelected = selectedCards && 
                       selectedCards.sourceColumn === columnIndex && 
                       cardIndex >= selectedCards.sourceIndex;

    // Calculate offsets for better visibility and responsiveness
    const { vertical: verticalOffset, horizontal: horizontalOffset } = getResponsiveOffsets();

    // Limit the maximum offset to prevent cards from going too far
    const maxCards = 13; // Maximum number of cards in a sequence
    const limitedCardIndex = Math.min(cardIndex, maxCards);

    return (
      <div 
        key={card.id}
        className={`card ${card.faceUp ? 'face-up' : 'face-down'} ${card.suit} ${isSelected ? 'selected' : ''} ${theme}`}
        style={{ 
          top: `${limitedCardIndex * verticalOffset}px`,
          left: `${limitedCardIndex * horizontalOffset}px`,
          zIndex: cardIndex // Ensure proper stacking order
        }}
        onClick={() => card.faceUp && handleCardClick(columnIndex, cardIndex)}
        draggable={card.faceUp}
        onDragStart={(e) => card.faceUp && handleDragStart(e, columnIndex, cardIndex)}
        onDragEnd={handleDragEnd}
        data-value={`${card.value}${getSuitSymbol(card.suit)}`}
      >
        {card.faceUp && (
          <>
            <div className="card-value">{card.value}</div>
            <div className="card-suit">{getSuitSymbol(card.suit)}</div>
          </>
        )}
      </div>
    );
  };

  // Get suit symbol
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  return (
    <div className={`spider-solitaire ${theme} ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className="game-header">
        <h1>Spider Solitaire</h1>
        <div className="game-info">
          <div className="score">Score: {score}</div>
          <div className="stock-count">Stock: {stockPile.length} cards</div>
        </div>
        <div className="game-controls">
          <button onClick={initializeGame}>New Game</button>
          <button onClick={restartGame} disabled={!initialGameState}>Restart</button>
          <button onClick={undoMove} disabled={moveHistory.length === 0}>Undo</button>
          <button onClick={getHint}>Hint</button>
          <button onClick={toggleFullScreen}>{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</button>
          <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
            <option value={1}>1 Suit (Easy)</option>
            <option value={2}>2 Suits (Medium)</option>
            <option value={4}>4 Suits (Hard)</option>
          </select>
          <select value={theme} onChange={(e) => changeTheme(e.target.value)}>
            <option value="default">Default Theme</option>
            <option value="dark">Dark Theme</option>
            <option value="light">Light Theme</option>
            <option value="blue">Blue Theme</option>
          </select>
          <button onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? 'Sound: On' : 'Sound: Off'}
          </button>
        </div>
      </div>

      <div className="game-area">
        <div className="foundation-area">
          {foundationPiles.map((pile, index) => (
            <div key={`foundation-${index}`} className="foundation-pile">
              {pile.length > 0 && renderCard(pile[pile.length - 1], -1, -1)}
            </div>
          ))}
        </div>

        <div className="stock-area" onClick={dealCards}>
          {stockPile.length > 0 && (
            <div className="stock-pile">
              <div className="card face-down">
                <div className="card-back"></div>
              </div>
              <div className="stock-count">{stockPile.length}</div>
            </div>
          )}
        </div>

        <div className="tableau-area">
          {tableau.map((column, columnIndex) => (
            <div 
              key={`column-${columnIndex}`} 
              className="tableau-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(columnIndex);
              }}
            >
              {column.length === 0 ? (
                <div className="empty-column" />
              ) : (
                column.map((card, cardIndex) => renderCard(card, columnIndex, cardIndex))
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="game-footer">
        <p>Spider Solitaire - Created with React</p>
      </div>
    </div>
  );
};

export default SpiderSolitaire;
