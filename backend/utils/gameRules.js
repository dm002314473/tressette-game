const { forEach } = require("lodash");

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
  const validCards = playedCards.filter(
    (card) => card.suit === playedCards[0].suit
  );

  if (validCards.length == 1) {
    return playedCards[0].playerId;
  } else {
    let highestCard = validCards[0];
    validCards.forEach((card) => {
      if (Number(card.trueValue) > Number(highestCard.trueValue)) {
        highestCard = card;
      }
    });
    return highestCard.playerId;
  }
};

const calculatePoints = (tableCards, players) => {
  let points = 0;
  tableCards.forEach((card) => {
    points += Number(card.points);
  });

  return points;
};

const calculateUltima = (player, players, turn) => {
  if (player.socketId === turn) {
    const index = players.findIndex((p) => p.socketId === player.socketId);

    let points;

    if (index === 0 || index === 2) {
      if (players.length === 4) {
        points = players[0].points + players[1].points;
      } else {
        points = players[0].points;
      }
      return 3 - (points % 3);
    } else {
      if (players.length === 4) {
        points = players[1].points + players[3].points;
      } else {
        points = players[1].points;
      }
      return 3 - (points % 3);
    }
  }

  return 0;
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

const calculateEndPoints = (players) => {
  let points1 = Math.trunc(players[0].points / 3) + " " + players[0].socketId;
  let points2 = Math.trunc(players[1].points / 3) + " " + players[1].socketId;
  if (players.length === 4) {
    let points3 =
      Math.trunc((players[0].points + players[2].points) / 3) +
      " " +
      players[0].socketId +
      " " +
      players[2].socketId;
    let points4 =
      Math.trunc((players[1].points + players[3].points) / 3) +
      " " +
      players[1].socketId +
      " " +
      players[3].socketId;
    return [points1, points2, points3, points4];
  }
  return [points1, points2];
};

const dataForUserUpdate = (player, gameType, players) => {
  const userId = player.userId;
  const username = player.username;
  let win = true;
  let playerPoints;
  let opponentPoints;

  if (gameType === "2") {
    win = !players.some((p) => p.points > player.points);
  } else {
    const index = players.findIndex((p) => p.socketId === player.socketId);
    if (index === 0 || index === 2) {
      playerPoints = players[0].points + players[2].points;
      opponentPoints = players[1].points + players[3].points;
    } else {
      playerPoints = players[1].points + players[3].points;
      opponentPoints = players[0].points + players[2].points;
    }
    if (playerPoints < opponentPoints) {
      win = false;
    }
  }

  return [userId, username, gameType, win];
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
  calculatePoints,
  calculateEndPoints,
  calculateUltima,
  dataForUserUpdate,
};
