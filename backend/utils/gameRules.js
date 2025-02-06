const isSelectedCardOfSameSuit = (hand, card) => {
  let flag = false;
  hand.forEach((cardInHand) => {
    if (cardInHand.suit === card.suit && cardInHand.value === card.value) {
      flag = true;
    }
  });
  return flag;
};

const playBySuit = (playerHand, selectedCard, tableCards) => {
  const suitPlayed = tableCards?.length > 0 ? tableCards[0].suit : null;
  if (suitPlayed) {
    const validCards = playerHand.filter((card) => card.suit === suitPlayed);

    if (
      validCards.length > 0 &&
      isSelectedCardOfSameSuit(validCards, selectedCard)
    ) {
      return selectedCard;
    } else {
      return null;
    }
  } else {
    return selectedCard;
  }
};

const changeIdOfPlayersTurn = (currentPlayerTurnId, allPlayers) => {
  let allPlayersId = [];
  allPlayers.forEach((player) => {
    allPlayersId.push(player.socketId);
  });

  let currentPlayerIndex = allPlayersId.indexOf(currentPlayerTurnId);
  if (currentPlayerIndex === allPlayersId.length - 1) {
    currentPlayerIndex = 0;
  } else {
    currentPlayerIndex += 1;
  }
  return allPlayersId[currentPlayerIndex];
};

const updateTurnInDataBase = async (currentGame) => {
  console.log("turn: ", currentGame.turn);
  try {
    await currentGame.save();
  } catch (error) {
    console.error("Error updating turn:", error);
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
  changeIdOfPlayersTurn,
  updateTurnInDataBase,
};
