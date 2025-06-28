// src/App.jsx

import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import ResultScreen from "./components/ResultScreen";

function App() {
  const [screen, setScreen] = useState("start");
  const [time, setTime] = useState(0);

  const handleStart = () => setScreen("game");
  const handleClear = (elapsedTime) => {
    setTime(elapsedTime);
    setScreen("result");
  };
  const handleRestart = () => setScreen("start");

  return (
    <>
      {screen === "start" && <StartScreen onStart={handleStart} />}
      {screen === "game" && <Game onClear={handleClear} />}
      {screen === "result" && (
        <ResultScreen time={time} onRestart={handleRestart} />
      )}
    </>
  );
}

export default App;
