const playBySuit = (playerHand, playedCards) => {
  const suitPlayed = playedCards.length > 0 ? playedCards[0].suit : null;
  if (suitPlayed) {
    const validCards = playerHand.filter((card) => card.suit === suitPlayed);
    if (validCards.length > 0) {
      return validCards;
    } else {
      return playerHand;
    }
  } else {
    return playerHand;
  }
};

const calculateRoundWinner = (playedCards, firstPlayer) => {
  const winningCard = playedCards.reduce((winner, card) => {
    if (card.value > winner.value) {
      return card;
    }
    return winner;
  }, playedCards[0]);

  const winner = playedCards.find((card) => card === winningCard).playerId;
  return winner;
};

const updateGameState = (gameState, roundWinner) => {
  gameState.points[roundWinner]++;
  gameState.turn = (gameState.turn + 1) % gameState.players.length;
  return gameState;
};

module.exports = {
  playBySuit,
  calculateRoundWinner,
  updateGameState,
};
