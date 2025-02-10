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
    } else if (validCards.length == 0) {
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

const updateDataBase = async (currentGame) => {
  try {
    await currentGame.save();
  } catch (error) {
    console.error("Error updating turn:", error);
  }
};

const calculateRoundWinner = (playedCards) => {
  playedCards.forEach((card) => {
    console.log(
      `karta na stolu: ${card.value} of ${card.suit} true value ${card.trueValue}`
    );
  });

  const validCards = playedCards.filter(
    (card) => card.suit === playedCards[0].suit
  );

  validCards.forEach((card) => {
    console.log(
      `karta na stolu: ${card.value} of ${card.suit} true value ${card.trueValue}`
    );
  });

  if (validCards.length == 1) {
    console.log(
      `jedina vazeca pobjeduje: ${validCards[0].value} of ${validCards[0].suit} true value ${validCards[0].trueValue}`
    );
    return playedCards[0].playerId;
  } else {
    let highestCard = validCards[0];
    validCards.forEach((card) => {
      if (Number(card.trueValue) > Number(highestCard.trueValue)) {
        highestCard = card;
      }
    });
    console.log(
      `pobjeduje od svih: ${highestCard.value} of ${highestCard.suit} true value ${highestCard.trueValue}`
    );
    return highestCard.playerId;
  }
};

const removeCardFromPlayer = (player, selectedCard) => {
  let updatedHand = player.hand.filter((card) => {
    return card._id.toString() !== selectedCard._id.toString();
  });

  return updatedHand;
};

const dealNewCards = (game, player) => {
  const newCard = game.remainingDeck[game.remainingDeck.length - 1];
  game.remainingDeck.pop();
  newCard.playerId = player.socketId;
  player.hand.push(newCard);
  return player.hand;
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
  dealNewCards,
};
