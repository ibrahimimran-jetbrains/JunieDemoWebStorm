# Spider Solitaire Game

A web-based, interactive clone of the classic Spider Solitaire card game, built with React.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Game Overview

Spider Solitaire is a popular solitaire card game that uses two decks of cards. The goal is to arrange cards in descending order (from King to Ace) of the same suit and move these sequences to the foundation piles.

## Features

- **Game Layout**:
  - Tableau with 10 columns (4 columns with 6 cards, 6 columns with 5 cards)
  - Stock pile with 50 cards
  - 8 foundation piles for completed sequences
  - Scoring system starting at 500 points

- **Difficulty Levels**:
  - 1 Suit (Easy): All cards are of the same suit
  - 2 Suits (Medium): Cards are of two suits
  - 4 Suits (Hard): Cards are of all four suits

- **Game Controls**:
  - New Game: Start a fresh game
  - Undo: Revert the last move
  - Hint: Get suggestions for valid moves
  - Fullscreen: Play in fullscreen mode

- **Visual Customization**:
  - Multiple themes (Default, Dark, Light, Blue)
  - Sound effects (can be toggled on/off)

## How to Play

### Game Rules

1. **Objective**: Create sequences of cards from King to Ace of the same suit and move them to the foundation piles.

2. **Card Movement**:
   - You can move a card or a sequence of cards to another column if the top card of the destination column is one rank higher than the card being moved.
   - In 1-suit mode, any card can be placed on any other card of one rank higher.
   - In 2-suit mode, cards must be of the same color to be placed on each other.
   - In 4-suit mode, cards must be of the same suit to be placed on each other.
   - Any card or sequence can be moved to an empty column.

3. **Dealing Cards**:
   - Click on the stock pile to deal one card to each tableau column.
   - All 10 columns must have at least one card before you can deal more cards.

4. **Completing Sequences**:
   - When you form a sequence from King to Ace of the same suit, it will automatically move to a foundation pile.
   - You earn 100 points for each completed sequence.

5. **Scoring**:
   - Start with 500 points
   - Lose 1 point for each move
   - Lose 10 points for dealing from the stock pile
   - Gain 100 points for each completed sequence

### Controls

- **Card Selection**: Click on a face-up card to select it and all cards below it (if they form a valid sequence).
- **Card Movement**: After selecting cards, click on a destination column to move them.
- **Undo**: Click the Undo button to revert your last move.
- **Hint**: Click the Hint button to get a suggestion for a valid move.
- **New Game**: Click the New Game button to start a fresh game.
- **Difficulty**: Select your preferred difficulty level from the dropdown menu.
- **Theme**: Change the visual theme from the theme dropdown menu.
- **Sound**: Toggle sound effects on/off with the sound button.
- **Fullscreen**: Enter or exit fullscreen mode with the Fullscreen button.

## How to Run the Application

You can run the application using one of the following methods:

1. Using the provided shell script:
   ```
   ./start.sh
   ```
   This script will navigate to the application directory and start the development server.

2. Using npm directly:

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

You should see the Spider Solitaire game interface with cards dealt and ready to play.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
