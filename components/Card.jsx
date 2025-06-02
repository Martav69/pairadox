"use client";
import React from "react";

export default function Card({ id, imageSrc, isFlipped, isMatched, onClickCard }) {
  // Construire dynamiquement la classe pour l'inner
  const innerClassName = [
    "card-inner",
    isFlipped || isMatched ? "flipped" : "not-flipped",
    isMatched ? "matched" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="card-container"
      tabIndex="0" // rend la carte focusable au clavier
      onClick={() => {
        if (isFlipped || isMatched) return;
        onClickCard(id);
      }}
      onKeyDown={(e) => {
        // Permettre “Entrée” ou “Espace” pour retourner la carte
        if ((e.key === "Enter" || e.key === " ") && !isFlipped && !isMatched) {
          e.preventDefault();
          onClickCard(id);
        }
      }}
    >
      <div className={innerClassName}>
        {/* Face avant (l’image) */}
        <div className="card-front">
          <img
            src={imageSrc}
            alt="carte face"
            style={{ width: "80%", height: "80%", objectFit: "cover", borderRadius: "4px" }}
          />
        </div>
        {/* Face arrière (dos de carte) */}
        <div className="card-back" />
      </div>
    </div>
  );
}
