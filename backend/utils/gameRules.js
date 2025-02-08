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
      console.log("selected card is of correct suit");
      return selectedCard;
    } else if (validCards.length == 0) {
      console.log("suit doesnt matter since player have non of given suit");
      return selectedCard;
    } else {
      console.log("select card of correct suit");
      return null;
    }
  } else {
    console.log("table is empty, suit doesnt matter");
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

const updateDataBase = async (currentGame) => {
  console.log("turn: ", currentGame.turn);
  try {
    await currentGame.save();
  } catch (error) {
    console.error("Error updating turn:", error);
  }
};

const calculateRoundWinner = (playedCards) => {
  const validCards = playedCards.filter(
    (card) => card.suit === playedCards[0].suit
  );

  if (validCards.length == 0) {
    return playedCards[0].playerId;
  } else {
    let highestCard = validCards[0];
    validCards.forEach((card) => {
      if (card.trueValue > highestCard.trueValue) {
        highestCard = card;
      }
    });
    return highestCard.playerId;
  }
};

const removeCardFromPlayer = (player, selectedCard) => {
  console.log("Selected: ", selectedCard._id.toString());

  let updatedHand = player.hand.filter((card) => {
    console.log("Card: ", card._id.toString());
    return card._id.toString() !== selectedCard._id.toString();
  });

  console.log("Updated deck: ", updatedHand);
  return updatedHand;
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
  updateDataBase,
  removeCardFromPlayer,
};
