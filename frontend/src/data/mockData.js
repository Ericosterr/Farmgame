// Mock data for the growbox farming game
export const mockGameState = {
  user: {
    id: "user_123",
    name: "GrowMaster",
    level: 5,
    coins: 2500,
    tokens: 150,
    totalHarvests: 89,
    joinedDate: "2024-12-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  
  growBoxes: [
    {
      id: "gb_1",
      type: "Basic Growbox",
      level: 3,
      capacity: 4,
      plants: [
        {
          id: "plant_1",
          type: "Tomato",
          stage: "growing",
          progress: 75,
          timeRemaining: 1800, // seconds
          waterLevel: 60,
          lastWatered: Date.now() - 3600000
        },
        {
          id: "plant_2", 
          type: "Basil",
          stage: "ready",
          progress: 100,
          waterLevel: 80,
          harvestValue: 25
        },
        {
          id: "plant_3",
          type: "Lettuce", 
          stage: "planted",
          progress: 15,
          timeRemaining: 7200,
          waterLevel: 90,
          lastWatered: Date.now() - 1800000
        }
      ],
      equipment: {
        lamp: { type: "LED Pro", level: 2, effect: "+25% growth speed" },
        filter: { type: "Carbon Filter", level: 1, effect: "+15% yield" },
        fan: { type: "Exhaust Pro", level: 1, effect: "+10% plant health" },
        ac: null,
        soil: { type: "Premium Mix", level: 2, effect: "+20% water retention" }
      }
    }
  ],

  inventory: {
    seeds: {
      tomato: 5,
      basil: 8, 
      lettuce: 12,
      pepper: 2,
      herb: 6
    },
    equipment: {
      "Basic Lamp": 1,
      "Water Pump": 1,
      "Grow Tent": 0
    }
  },

  achievements: [
    { id: "first_harvest", name: "First Harvest", description: "Harvest your first plant", completed: true, reward: 50 },
    { id: "green_thumb", name: "Green Thumb", description: "Harvest 10 plants", completed: true, reward: 100 },
    { id: "master_grower", name: "Master Grower", description: "Harvest 50 plants", completed: true, reward: 200 },
    { id: "equipment_collector", name: "Equipment Collector", description: "Own 5 different equipment", completed: false, reward: 150 },
    { id: "speed_grower", name: "Speed Grower", description: "Complete a harvest in under 1 hour", completed: false, reward: 300 }
  ],

  leaderboard: [
    { rank: 1, name: "PlantMaster Pro", level: 15, totalHarvests: 450, coins: 25000 },
    { rank: 2, name: "GreenThumb99", level: 12, totalHarvests: 380, coins: 19500 },
    { rank: 3, name: "HydroExpert", level: 11, totalHarvests: 320, coins: 16800 },
    { rank: 4, name: "GrowMaster", level: 5, totalHarvests: 89, coins: 2500 }, // Current user
    { rank: 5, name: "LeafLover", level: 8, totalHarvests: 180, coins: 8900 },
    { rank: 6, name: "SeedKeeper", level: 6, totalHarvests: 140, coins: 6200 }
  ]
};

export const shopItems = {
  growboxes: [
    { id: "basic_gb", name: "Basic Growbox", price: 500, capacity: 4, owned: true },
    { id: "medium_gb", name: "Medium Growbox", price: 1200, capacity: 8, owned: false },
    { id: "large_gb", name: "Large Growbox", price: 2500, capacity: 12, owned: false },
    { id: "premium_gb", name: "Premium Growbox", price: 5000, capacity: 16, owned: false }
  ],
  
  equipment: [
    { id: "basic_led", name: "LED Light", price: 200, effect: "+15% growth", owned: false },
    { id: "pro_led", name: "LED Pro", price: 450, effect: "+25% growth", owned: true },
    { id: "carbon_filter", name: "Carbon Filter", price: 180, effect: "+15% yield", owned: true },
    { id: "exhaust_fan", name: "Exhaust Fan", price: 150, effect: "+10% health", owned: true },
    { id: "water_pump", name: "Auto Water", price: 300, effect: "Auto watering", owned: false },
    { id: "ac_unit", name: "AC Unit", price: 800, effect: "+30% growth", owned: false }
  ],

  seeds: [
    { id: "tomato", name: "Tomato Seeds", price: 20, growTime: 3600, value: 45 },
    { id: "basil", name: "Basil Seeds", price: 15, growTime: 1800, value: 25 },
    { id: "lettuce", name: "Lettuce Seeds", price: 12, growTime: 2400, value: 30 },
    { id: "pepper", name: "Pepper Seeds", price: 35, growTime: 5400, value: 80 },
    { id: "herb", name: "Herb Mix", price: 25, growTime: 2700, value: 50 }
  ],

  soil: [
    { id: "basic_soil", name: "Basic Soil", price: 30, effect: "Standard growth", owned: true },
    { id: "premium_soil", name: "Premium Mix", price: 60, effect: "+20% water retention", owned: true },
    { id: "hydro_soil", name: "Hydroponic Mix", price: 120, effect: "+35% growth speed", owned: false }
  ]
};

export const plantTypes = {
  tomato: { 
    name: "Tomato", 
    icon: "🍅", 
    stages: ["🌱", "🌿", "🌾", "🍅"],
    baseGrowTime: 3600,
    baseValue: 45
  },
  basil: { 
    name: "Basil", 
    icon: "🌿", 
    stages: ["🌱", "🌿", "🍃", "🌿"],
    baseGrowTime: 1800,
    baseValue: 25
  },
  lettuce: { 
    name: "Lettuce", 
    icon: "🥬", 
    stages: ["🌱", "🌿", "🥬", "🥬"],
    baseGrowTime: 2400,
    baseValue: 30
  },
  pepper: { 
    name: "Pepper", 
    icon: "🌶️", 
    stages: ["🌱", "🌿", "🌾", "🌶️"],
    baseGrowTime: 5400,
    baseValue: 80
  },
  herb: { 
    name: "Herb Mix", 
    icon: "🌿", 
    stages: ["🌱", "🌿", "🍃", "🌿"],
    baseGrowTime: 2700,
    baseValue: 50
  }
};