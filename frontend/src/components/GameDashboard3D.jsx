import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Droplets, Zap, Clock, Plus, RotateCcw, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { plantTypes } from "../data/mockData";
import GrowBox3D from "./3D/GrowBox3D";

const GameDashboard3D = ({ gameState, updateGameState }) => {
  const [timers, setTimers] = useState({});
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPlantDialog, setShowPlantDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSeedDialog, setShowSeedDialog] = useState(false);
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

  const handlePlantClick = (plantId) => {
    const plant = currentGrowBox.plants.find(p => p.id === plantId);
    setSelectedPlant(plant);
    setShowPlantDialog(true);
  };

  const handleEmptySlotClick = (slotIndex) => {
    setSelectedSlot(slotIndex);
    setShowSeedDialog(true);
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
    setShowPlantDialog(false);
  };

  const handleHarvestPlant = (plantId) => {
    const plant = currentGrowBox.plants.find(p => p.id === plantId);
    if (plant && plant.stage === "ready") {
      const harvestValue = plant.harvestValue || 25;
      const newCoins = gameState.user.coins + harvestValue;
      const newTotalHarvests = gameState.user.totalHarvests + 1;

      const updatedGrowBoxes = gameState.growBoxes.map(growBox => ({
        ...growBox,
        plants: growBox.plants.filter(p => p.id !== plantId)
      }));

      updateGameState({ 
        user: { ...gameState.user, coins: newCoins, totalHarvests: newTotalHarvests },
        growBoxes: updatedGrowBoxes 
      });
      setShowPlantDialog(false);
    }
  };

  const handlePlantSeed = (seedType) => {
    if (selectedSlot !== null && gameState.inventory.seeds[seedType] > 0) {
      const newPlant = {
        id: `plant_${Date.now()}`,
        type: seedType.charAt(0).toUpperCase() + seedType.slice(1),
        stage: "planted",
        progress: 5,
        timeRemaining: plantTypes[seedType].baseGrowTime,
        waterLevel: 100,
        lastWatered: Date.now()
      };

      const updatedGrowBoxes = gameState.growBoxes.map(growBox => ({
        ...growBox,
        plants: [...growBox.plants, newPlant]
      }));

      const updatedInventory = {
        ...gameState.inventory,
        seeds: {
          ...gameState.inventory.seeds,
          [seedType]: gameState.inventory.seeds[seedType] - 1
        }
      };

      updateGameState({ 
        growBoxes: updatedGrowBoxes,
        inventory: updatedInventory
      });
      setShowSeedDialog(false);
      setSelectedSlot(null);
    }
  };

  const getWaterLevelColor = (level) => {
    if (level > 70) return "text-blue-500";
    if (level > 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      {/* 3D Growbox Viewer */}
      <Card className="bg-gradient-to-r from-slate-900 to-gray-900 border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <GrowBox3D 
            gameState={gameState} 
            updateGameState={updateGameState}
            onPlantClick={handlePlantClick}
            onEmptySlotClick={handleEmptySlotClick}
          />
        </CardContent>
      </Card>

      {/* Controls and Info */}
      <div className="flex gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <RotateCcw size={12} />
          <span>Drag to rotate</span>
        </div>
        <div className="flex items-center gap-1">
          <ZoomIn size={12} />
          <span>Scroll to zoom</span>
        </div>
        <div className="flex items-center gap-1">
          <Plus size={12} />
          <span>Click + to plant</span>
        </div>
      </div>

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

      {/* Plant Action Dialog */}
      <Dialog open={showPlantDialog} onOpenChange={setShowPlantDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedPlant && plantTypes[selectedPlant.type.toLowerCase()]?.icon}</span>
              {selectedPlant?.type}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stage:</span>
                  <div className="font-semibold capitalize">{selectedPlant.stage}</div>
                </div>
                <div>
                  <span className="text-gray-600">Progress:</span>
                  <div className="font-semibold">{selectedPlant.progress}%</div>
                </div>
              </div>

              {selectedPlant.stage !== "ready" && (
                <div>
                  <span className="text-gray-600 text-sm">Growth Progress:</span>
                  <Progress value={selectedPlant.progress} className="h-2 mt-1" />
                  <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
                    <Clock size={10} className="mr-1" />
                    {formatTime(timers[selectedPlant.id] || selectedPlant.timeRemaining)}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Water Level:</span>
                <div className="flex items-center gap-1">
                  <Droplets size={12} className={getWaterLevelColor(selectedPlant.waterLevel)} />
                  <span className={`font-medium text-sm ${getWaterLevelColor(selectedPlant.waterLevel)}`}>
                    {selectedPlant.waterLevel}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedPlant.stage === "ready" ? (
                  <Button 
                    onClick={() => handleHarvestPlant(selectedPlant.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    Harvest (+{selectedPlant.harvestValue || 25} coins)
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleWaterPlant(selectedPlant.id)}
                    variant="outline"
                    disabled={selectedPlant.waterLevel > 80}
                    className="flex-1"
                  >
                    {selectedPlant.waterLevel > 80 ? "Well Watered" : "Water Plant"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Seed Selection Dialog */}
      <Dialog open={showSeedDialog} onOpenChange={setShowSeedDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Plant a Seed</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {Object.entries(gameState.inventory.seeds).map(([seedType, count]) => (
              <div key={seedType} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{plantTypes[seedType]?.icon}</span>
                  <div>
                    <div className="font-semibold capitalize">{seedType}</div>
                    <div className="text-xs text-gray-600">
                      {Math.floor(plantTypes[seedType]?.baseGrowTime / 60)}min • +{plantTypes[seedType]?.baseValue} coins
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{count}</div>
                  <Button
                    size="sm"
                    disabled={count === 0}
                    onClick={() => handlePlantSeed(seedType)}
                    className="mt-1"
                  >
                    Plant
                  </Button>
                </div>
              </div>
            ))}
            
            {Object.values(gameState.inventory.seeds).every(count => count === 0) && (
              <div className="text-center text-gray-500 py-4">
                No seeds available. Visit the shop to buy more!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameDashboard3D;