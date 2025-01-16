class Deck {
  constructor() {
    this.cards = this.initializeDeck();
  }

  initializeDeck() {
    const suits = ["bastoni", "denari", "coppe", "spadi"];
    const values = ["1", "2", "3", "4", "5", "6", "7", "11", "12", "13"];
    const points = [3, 1, 1, 0, 0, 0, 0, 1, 1, 1];
    const trueValue = [8, 10, 9, 1, 2, 3, 4, 5, 6, 7];
    const playerId = "remainingDeck";

    const deck = [];
    for (let suit of suits) {
      for (let i = 0; i < values.length; i++) {
        deck.push({
          suit,
          value: values[i],
          points: points[i],
          trueValue: trueValue[i],
          playerId: playerId,
        });
      }
    }
    return this.shuffle(deck);
  }

  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  deal(numPlayers) {
    const cardsPerPlayer = 10;
    const hands = [];
    const playerCount = parseInt(numPlayers, 10);
    for (let i = 0; i < playerCount; i++) {
      hands.push(this.cards.splice(0, cardsPerPlayer));
    }
    return { hands, remainingDeck: this.cards };
  }
}

module.exports = Deck;
