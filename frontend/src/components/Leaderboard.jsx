import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";

const Leaderboard = ({ gameState }) => {
  const { leaderboard, user } = gameState;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy size={18} className="text-yellow-500" />;
      case 2: return <Medal size={18} className="text-gray-400" />;
      case 3: return <Award size={18} className="text-amber-600" />;
      default: return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
      case 3: return "bg-gradient-to-r from-amber-400 to-amber-500 text-white";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy size={20} className="text-amber-500" />
            Leaderboard
          </CardTitle>
          <p className="text-sm text-gray-600">
            Top farmers in the GrowBox community
          </p>
        </CardHeader>
      </Card>

      {/* Current User Position */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full ${getRankBadge(4)}`}>
                <span className="font-bold">#{4}</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Your Position</div>
                <div className="text-sm text-gray-600">
                  {user.totalHarvests} harvests • {user.coins} coins
                </div>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700">
              You
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.map((player, index) => {
          const isCurrentUser = player.name === user.name;
          
          return (
            <Card 
              key={player.rank} 
              className={`transition-all duration-200 hover:shadow-md ${
                isCurrentUser ? 'ring-2 ring-blue-300 bg-blue-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-10">
                    {getRankIcon(player.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={`${
                      player.rank <= 3 
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {player.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">{player.name}</h4>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Level {player.level}</span>
                      <span>•</span>
                      <span>{player.totalHarvests} harvests</span>
                    </div>
                  </div>

                  {/* Coins */}
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">💰</span>
                      <span className="font-bold text-gray-800">{player.coins.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leaderboard Info */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardContent className="p-4 text-center">
          <div className="text-sm text-gray-600">
            Rankings update every hour based on total coins earned
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Keep harvesting to climb the leaderboard!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;