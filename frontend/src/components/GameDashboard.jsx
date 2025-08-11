import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Droplets, Zap, Clock, Plus } from "lucide-react";
import { plantTypes } from "../data/mockData";

const GameDashboard = ({ gameState, updateGameState }) => {
  const [timers, setTimers] = useState({});
  const currentGrowBox = gameState.growBoxes[0];

  // Timer effect for growing plants
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        currentGrowBox.plants.forEach(plant => {
          if (plant.stage === "growing" && plant.timeRemaining > 0) {
            newTimers[plant.id] = (newTimers[plant.id] || plant.timeRemaining) - 1;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentGrowBox.plants]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWaterPlant = (plantId) => {
    const updatedGrowBoxes = gameState.growBoxes.map(growBox => ({
      ...growBox,
      plants: growBox.plants.map(plant => 
        plant.id === plantId 
          ? { ...plant, waterLevel: Math.min(100, plant.waterLevel + 30), lastWatered: Date.now() }
          : plant
      )
    }));

    updateGameState({ growBoxes: updatedGrowBoxes });
  };

  const handleHarvestPlant = (plantId) => {
    const plant = currentGrowBox.plants.find(p => p.id === plantId);
    if (plant && plant.stage === "ready") {
      const harvestValue = plant.harvestValue || 25;
      const newCoins = gameState.user.coins + harvestValue;
      const newTotalHarvests = gameState.user.totalHarvests + 1;

      // Remove the harvested plant
      const updatedGrowBoxes = gameState.growBoxes.map(growBox => ({
        ...growBox,
        plants: growBox.plants.filter(p => p.id !== plantId)
      }));

      updateGameState({ 
        user: { ...gameState.user, coins: newCoins, totalHarvests: newTotalHarvests },
        growBoxes: updatedGrowBoxes 
      });
    }
  };

  const getPlantEmoji = (plant) => {
    const plantType = plantTypes[plant.type.toLowerCase()];
    if (!plantType) return "🌱";
    
    if (plant.stage === "ready") return plantType.icon;
    
    const stageIndex = Math.floor(plant.progress / 25);
    return plantType.stages[Math.min(stageIndex, plantType.stages.length - 1)];
  };

  const getWaterLevelColor = (level) => {
    if (level > 70) return "text-blue-500";
    if (level > 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Growbox Status */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800">{currentGrowBox.type}</h3>
              <p className="text-sm text-gray-600">Level {currentGrowBox.level} • {currentGrowBox.plants.length}/{currentGrowBox.capacity} plants</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active
            </Badge>
          </div>
          
          {/* Equipment Status */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-yellow-500" />
              <span>{currentGrowBox.equipment.lamp?.type || "No Lamp"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-500">🌀</span>
              <span>{currentGrowBox.equipment.filter?.type || "No Filter"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-500">💨</span>
              <span>{currentGrowBox.equipment.fan?.type || "No Fan"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plant Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: currentGrowBox.capacity }, (_, index) => {
          const plant = currentGrowBox.plants[index];
          
          if (!plant) {
            return (
              <Card key={`empty-${index}`} className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-4 text-center">
                  <Button 
                    variant="ghost" 
                    className="w-full h-24 border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <Plus size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Plant Seed</span>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          }

          const timeRemaining = timers[plant.id] ?? plant.timeRemaining;
          const isReady = plant.stage === "ready" || timeRemaining === 0;

          return (
            <Card key={plant.id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-3">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{getPlantEmoji(plant)}</div>
                  <h4 className="font-semibold text-sm text-gray-800">{plant.type}</h4>
                  <p className="text-xs text-gray-500 capitalize">{plant.stage}</p>
                </div>

                {/* Progress Bar */}
                {!isReady && (
                  <div className="mb-3">
                    <Progress value={plant.progress} className="h-2 mb-1" />
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Clock size={10} className="mr-1" />
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                )}

                {/* Water Level */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-gray-600">Water:</span>
                  <div className="flex items-center gap-1">
                    <Droplets size={12} className={getWaterLevelColor(plant.waterLevel)} />
                    <span className={`font-medium ${getWaterLevelColor(plant.waterLevel)}`}>
                      {plant.waterLevel}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-1">
                  {isReady ? (
                    <Button 
                      onClick={() => handleHarvestPlant(plant.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs py-2"
                    >
                      Harvest (+{plant.harvestValue || 25} coins)
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleWaterPlant(plant.id)}
                      variant="outline"
                      disabled={plant.waterLevel > 80}
                      className="w-full text-xs py-2"
                    >
                      {plant.waterLevel > 80 ? "Well Watered" : "Water Plant"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-amber-600">{gameState.user.level}</div>
              <div className="text-xs text-gray-600">Level</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{gameState.user.totalHarvests}</div>
              <div className="text-xs text-gray-600">Harvests</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{currentGrowBox.plants.filter(p => p.stage === "ready").length}</div>
              <div className="text-xs text-gray-600">Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDashboard;