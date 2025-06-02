"use client";
import { useState, useEffect } from "react";
import Card from "./Card";

const allImages = [
  "/images/image1.png",
  "/images/image2.png",
  "/images/image3.png",
  "/images/image4.png",
  "/images/image5.png",
  "/images/image6.png",
  "/images/image7.png",
  "/images/image8.png",
  "/images/image9.png",
  "/images/image10.png",
];

function shuffleArray(array) {
  const newArr = array.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function MemoryBoard() {
  const [level, setLevel] = useState(1);
  const pairsCount = level === 1 ? 3 : level === 2 ? 6 : 10;
  const [deck, setDeck] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [matchesFound, setMatchesFound] = useState(0);

  // États pour la modale
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Génération + mélange du deck
  useEffect(() => {
    const selectedImages = allImages.slice(0, pairsCount);
    let cards = [];
    selectedImages.forEach((imgSrc, idx) => {
      cards.push({ id: idx * 2, imageSrc: imgSrc, pairId: idx });
      cards.push({ id: idx * 2 + 1, imageSrc: imgSrc, pairId: idx });
    });
    cards = shuffleArray(cards);
    setDeck(cards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMatchesFound(0);
    setShowModal(false);
    setModalMessage("");
  }, [level]);

  function handleCardClick(cardId) {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = deck.find((c) => c.id === firstId);
      const secondCard = deck.find((c) => c.id === secondId);

      if (firstCard.pairId === secondCard.pairId) {
        // match trouvé : on déclenche la classe “matched” instantanément
       setTimeout(() => {
       setMatchedCards((prev) => [...prev, firstId, secondId]);
       setMatchesFound((prev) => prev + 1);
       setFlippedCards([]); 
     }, 400); 
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }

  // Fin de niveau → afficher modale
  useEffect(() => {
    if (matchesFound === pairsCount) {
      setTimeout(() => {
        if (level < 3) {
          setModalMessage(`Bravo ! Tu as terminé le niveau ${level} !`);
          setShowModal(true);
        } else {
          setModalMessage("Félicitations ! Tu as terminé le niveau 3 ! Le jeu est terminé.");
          setShowModal(true);
        }
      }, 500);
    }
  }, [matchesFound, pairsCount, level]);

  function reshuffleSameLevel() {
    const selectedImages = allImages.slice(0, pairsCount);
    let cards = [];
    selectedImages.forEach((imgSrc, idx) => {
      cards.push({ id: idx * 2, imageSrc: imgSrc, pairId: idx });
      cards.push({ id: idx * 2 + 1, imageSrc: imgSrc, pairId: idx });
    });
    cards = shuffleArray(cards);
    setDeck(cards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMatchesFound(0);
    setShowModal(false);
    setModalMessage("");
  }

  const columns = level === 1 ? 3 : level === 2 ? 4 : 5;
  const boardStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div>
      <h2>Niveau {level} — Trouve {pairsCount} paires</h2>

      <button className="button" onClick={reshuffleSameLevel}>
        Rejouer le même niveau
      </button>

      <div className="memory-board" style={boardStyle}>
        {deck.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            imageSrc={card.imageSrc}
            isFlipped={flippedCards.includes(card.id)}
            isMatched={matchedCards.includes(card.id)}
            onClickCard={handleCardClick}
          />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalMessage}</h3>
            <p>
              {level < 3
                ? `Prêt pour le niveau ${level + 1} ?`
                : "Merci d'avoir joué à Pairadox !"}
            </p>
            <div className="modal-actions">
              {level < 3 ? (
                <>
                  <button
                    className="button"
                    onClick={() => {
                      setLevel((prev) => prev + 1);
                      setShowModal(false);
                    }}
                  >
                    Niveau suivant
                  </button>
                  <button
                    className="button"
                    onClick={() => {
                      reshuffleSameLevel();
                      setShowModal(false);
                    }}
                  >
                    Rejouer le niveau {level}
                  </button>
                </>
              ) : (
                <button
                  className="button"
                  onClick={() => {
                    setLevel(1);
                    setShowModal(false);
                  }}
                >
                  Rejouer depuis le début
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
