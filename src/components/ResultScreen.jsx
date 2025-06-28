// src/components/ResultScreen.jsx

import React from "react";

export default function ResultScreen({ time, onRestart }) {
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
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>クリア！</h1>
      <p style={{ fontSize: "24px", marginBottom: "40px" }}>
        経過時間: {time.toFixed(2)} 秒
      </p>
      <button
        onClick={onRestart}
        style={{
          padding: "20px 40px",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        タイトルに戻る
      </button>
    </div>
  );
}
