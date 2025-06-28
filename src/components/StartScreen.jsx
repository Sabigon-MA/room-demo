// src/components/StartScreen.jsx

import React from "react";

export default function StartScreen({ onStart }) {
  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "40px" }}>Maze Game</h1>
      <button
        onClick={onStart}
        style={{
          padding: "20px 40px",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        スタート
      </button>
    </div>
  );
}
