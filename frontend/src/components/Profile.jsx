import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { User, Trophy, Calendar, TrendingUp } from "lucide-react";

const Profile = ({ gameState }) => {
  const { user, achievements } = gameState;
  const completedAchievements = achievements.filter(a => a.completed);
  const totalRewards = completedAchievements.reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">Level {user.level} Farmer</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Calendar size={12} />
                <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Level Progress</span>
              <span className="text-gray-600">{user.level}/20</span>
            </div>
            <Progress value={(user.level / 20) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{user.coins}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <span className="text-yellow-500">💰</span>
              Total Coins
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{user.tokens}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <span className="text-purple-500">💎</span>
              Premium Tokens
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{user.totalHarvests}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <TrendingUp size={12} />
              Total Harvests
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{completedAchievements.length}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Trophy size={12} />
              Achievements
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy size={18} className="text-amber-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                achievement.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.completed ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {achievement.completed ? '✅' : '🔒'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={achievement.completed ? 'default' : 'secondary'}
                  className={achievement.completed ? 'bg-green-100 text-green-700' : ''}
                >
                  +{achievement.reward} coins
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Total Achievement Rewards */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-200">
        <CardContent className="p-4 text-center">
          <div className="text-lg font-bold text-amber-700 mb-1">
            {totalRewards} Coins Earned
          </div>
          <div className="text-sm text-gray-600">From completed achievements</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;