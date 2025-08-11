import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ShoppingCart, CheckCircle, Zap, Clock } from "lucide-react";
import { shopItems } from "../data/mockData";

const Shop = ({ gameState, updateGameState }) => {
  const [selectedCategory, setSelectedCategory] = useState("equipment");

  const handlePurchase = (item, category) => {
    if (gameState.user.coins >= item.price && !item.owned) {
      const newCoins = gameState.user.coins - item.price;
      
      // Update coins
      updateGameState({
        user: { ...gameState.user, coins: newCoins }
      });
      
      // Mark item as owned (in real app, this would update backend)
      console.log(`Purchased ${item.name} for ${item.price} coins`);
    }
  };

  const canAfford = (price) => gameState.user.coins >= price;

  const ShopCard = ({ item, category }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
            <p className="text-xs text-gray-600 mb-2">{item.effect || item.description}</p>
            
            {/* Item Stats */}
            <div className="flex flex-wrap gap-2 mb-3">
              {item.capacity && (
                <Badge variant="secondary" className="text-xs">
                  {item.capacity} plants
                </Badge>
              )}
              {item.growTime && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Clock size={10} />
                  {Math.floor(item.growTime / 60)}min
                </Badge>
              )}
              {item.value && (
                <Badge variant="secondary" className="text-xs">
                  +{item.value} coins
                </Badge>
              )}
              {item.effect && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Zap size={10} />
                  {item.effect.replace("+", "").replace("%", "%")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">💰</span>
            <span className="font-bold text-gray-800">{item.price}</span>
          </div>
          
          {item.owned ? (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle size={12} className="mr-1" />
              Owned
            </Badge>
          ) : (
            <Button
              onClick={() => handlePurchase(item, category)}
              disabled={!canAfford(item.price)}
              size="sm"
              className={`${
                canAfford(item.price)
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={12} className="mr-1" />
              Buy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart size={20} className="text-blue-600" />
            Equipment Shop
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upgrade your growbox with better equipment and seeds
          </p>
        </CardHeader>
      </Card>

      {/* Shop Categories */}
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="equipment" className="text-xs">Equipment</TabsTrigger>
          <TabsTrigger value="growboxes" className="text-xs">Growboxes</TabsTrigger>
          <TabsTrigger value="seeds" className="text-xs">Seeds</TabsTrigger>
          <TabsTrigger value="soil" className="text-xs">Soil</TabsTrigger>
        </TabsList>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-3">
          <div className="grid gap-3">
            {shopItems.equipment.map((item) => (
              <ShopCard key={item.id} item={item} category="equipment" />
            ))}
          </div>
        </TabsContent>

        {/* Growboxes Tab */}
        <TabsContent value="growboxes" className="space-y-3">
          <div className="grid gap-3">
            {shopItems.growboxes.map((item) => (
              <ShopCard key={item.id} item={item} category="growboxes" />
            ))}
          </div>
        </TabsContent>

        {/* Seeds Tab */}
        <TabsContent value="seeds" className="space-y-3">
          <div className="grid gap-3">
            {shopItems.seeds.map((item) => (
              <ShopCard key={item.id} item={item} category="seeds" />
            ))}
          </div>
        </TabsContent>

        {/* Soil Tab */}
        <TabsContent value="soil" className="space-y-3">
          <div className="grid gap-3">
            {shopItems.soil.map((item) => (
              <ShopCard key={item.id} item={item} category="soil" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Balance Display */}
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Your Balance:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">💰</span>
                <span className="font-bold text-gray-800">{gameState.user.coins}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-500">💎</span>
                <span className="font-bold text-gray-800">{gameState.user.tokens}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shop;