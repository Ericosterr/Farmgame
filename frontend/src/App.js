import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameDashboard from "./components/GameDashboard";
import Shop from "./components/Shop";
import Profile from "./components/Profile";
import Leaderboard from "./components/Leaderboard";
import Navigation from "./components/Navigation";
import { mockGameState } from "./data/mockData";

function App() {
  const [gameState, setGameState] = useState(mockGameState);
  const [currentView, setCurrentView] = useState("game");

  const updateGameState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "game":
        return <GameDashboard gameState={gameState} updateGameState={updateGameState} />;
      case "shop":
        return <Shop gameState={gameState} updateGameState={updateGameState} />;
      case "profile":
        return <Profile gameState={gameState} />;
      case "leaderboard":
        return <Leaderboard gameState={gameState} />;
      default:
        return <GameDashboard gameState={gameState} updateGameState={updateGameState} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-2 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800">GrowBox Farm</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">💰</span>
              <span className="font-semibold text-gray-800">{gameState.user.coins}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-purple-500">💎</span>
              <span className="font-semibold text-gray-800">{gameState.user.tokens}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-16">
          {renderCurrentView()}
        </div>

        {/* Navigation */}
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      </div>
    </div>
  );
}

export default App;