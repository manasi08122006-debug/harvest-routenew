/**
 * Harvest Route - Seed Data (India Regional Agricultural Cluster)
 * Realistic records for local farmers, restaurants, produce, orders, and logistics.
 */

export const INITIAL_DATA = {
  users: [
    {
      id: "usr_rest_1",
      email: "chef@spiceroute.in",
      role: "restaurant",
      name: "Chef Ananya Deshmukh",
      organization: "The Spice Route Bistro",
      phone: "+91 98201 44210",
      address: "Plot 42, High Street, Pune-Mumbai Highway",
      lat: 18.5204,
      lng: 73.8567,
      cuisine: "Regional Indian & Contemporary Kitchen",
      volume: "50-70 crates/week",
      rating: 4.9
    },
    {
      id: "usr_farm_1",
      email: "ramesh@sahyadriagro.in",
      role: "farmer",
      name: "Ramesh Patil",
      organization: "Sahyadri Agro Producer Co.",
      phone: "+91 94220 18452",
      address: "Survey 114, Junnar Valley, Pune District (12 km)",
      lat: 19.2084,
      lng: 73.8767,
      capacity: "2,500 kg/week",
      crops: ["Desi Tomatoes", "Organic Spinach", "Fresh Coriander", "Fresh Mint"],
      onTimeRate: 99.4,
      qualityRating: 4.95,
      completedOrders: 184,
      totalEarnings: 184500.00,
      stripeConnected: true
    },
    {
      id: "usr_farm_2",
      email: "sunita@godavarifresh.in",
      role: "farmer",
      name: "Sunita More",
      organization: "Godavari Fresh Farms",
      phone: "+91 98224 88310",
      address: "Gat 84, Dindori Road, Nashik Cluster (18 km)",
      lat: 19.9975,
      lng: 73.7898,
      capacity: "3,200 kg/week",
      crops: ["Nashik Red Onions", "Crisp Carrots", "Green Capsicum", "Farm Potatoes"],
      onTimeRate: 98.2,
      qualityRating: 4.85,
      completedOrders: 156,
      totalEarnings: 215000.00,
      stripeConnected: true
    },
    {
      id: "usr_farm_3",
      email: "vilas@bhimashankar.in",
      role: "farmer",
      name: "Vilas Shinde",
      organization: "Bhimashankar Organic Cluster",
      phone: "+91 97631 29400",
      address: "Manchar Valley Road, Pune District (15 km)",
      lat: 19.0020,
      lng: 73.9400,
      capacity: "1,400 kg/week",
      crops: ["Spicy Green Chillies", "Fresh Ginger", "Organic Spinach", "Desi Tomatoes"],
      onTimeRate: 98.8,
      qualityRating: 4.90,
      completedOrders: 128,
      totalEarnings: 142000.00,
      stripeConnected: true
    },
    {
      id: "usr_farm_4",
      email: "deepak@krishifpc.in",
      role: "farmer",
      name: "Deepak Kadam",
      organization: "Maharashtra Krishi FPC (Designated Standby)",
      phone: "+91 99215 77201",
      address: "Narayangaon Agricultural Hub, Pune-Nashik Corridor (22 km)",
      lat: 19.1200,
      lng: 73.9800,
      capacity: "6,000 kg/week",
      crops: ["Desi Tomatoes", "Nashik Red Onions", "Farm Potatoes", "Crisp Carrots", "Green Capsicum"],
      onTimeRate: 96.0,
      qualityRating: 4.70,
      completedOrders: 210,
      totalEarnings: 310000.00,
      stripeConnected: true
    }
  ],

  produceCatalog: [
    {
      id: "prod_1",
      name: "Desi Red Tomatoes (गावठी टोमॅटो / देशी टमाटर)",
      category: "Vine Produce",
      unit: "kg",
      description: "Naturally vine-ripened, juicy, high pectin and natural tang. Sourced from morning harvests.",
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_1", farmName: "Sahyadri Agro Producer Co.", price: 38.00, stock: 240, harvestReady: "Today Morning", distance: "12 km" },
        { farmerId: "usr_farm_3", farmName: "Bhimashankar Organic Cluster", price: 40.00, stock: 160, harvestReady: "Today Afternoon", distance: "15 km" },
        { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 36.00, stock: 800, harvestReady: "Available on Call", distance: "22 km" }
      ]
    },
    {
      id: "prod_2",
      name: "Organic Green Spinach (पालक / Palak)",
      category: "Leafy Greens",
      unit: "kg",
      description: "Broad emerald tender leaves, chemical-free irrigation, zero sand grit, packed in aeration crates.",
      imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_1", farmName: "Sahyadri Agro Producer Co.", price: 25.00, stock: 180, harvestReady: "Picked 6 AM Today", distance: "12 km" },
        { farmerId: "usr_farm_3", farmName: "Bhimashankar Organic Cluster", price: 26.00, stock: 120, harvestReady: "Today", distance: "15 km" },
        { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 24.00, stock: 450, harvestReady: "Tomorrow", distance: "22 km" }
      ]
    },
    {
      id: "prod_3",
      name: "Nashik Red Onions (नाशिक कांदा / लाल प्याज)",
      category: "Root Vegetables",
      unit: "kg",
      description: "Lasalgaon grade red onions, cured skin, high pungency, uniform bulb grading (55mm+).",
      imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_2", farmName: "Godavari Fresh Farms", price: 28.00, stock: 650, harvestReady: "Cured & Ready", distance: "18 km" },
        { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 26.50, stock: 1200, harvestReady: "Warehouse Stock", distance: "22 km" }
      ]
    },
    {
      id: "prod_4",
      name: "Crisp Sweet Carrots (गाजर / Gajar)",
      category: "Root Vegetables",
      unit: "kg",
      description: "Tender orange crunchy roots, washed and cleaned, excellent sugar brix for salads and culinary bases.",
      imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_2", farmName: "Godavari Fresh Farms", price: 35.00, stock: 320, harvestReady: "Harvested Today", distance: "18 km" },
        { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 32.00, stock: 600, harvestReady: "Available Daily", distance: "22 km" }
      ]
    },
    {
      id: "prod_5",
      name: "Fresh Coriander Leaves (कोथिंबीर / हरा धनिया)",
      category: "Herbs & Seasoning",
      unit: "kg",
      description: "Deep green aromatic leaves, root washed, packed with natural moisture barrier for maximum shelf life.",
      imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_1", farmName: "Sahyadri Agro Producer Co.", price: 30.00, stock: 95, harvestReady: "Cut to Order", distance: "12 km" },
        { farmerId: "usr_farm_3", farmName: "Bhimashankar Organic Cluster", price: 32.00, stock: 80, harvestReady: "Today Morning", distance: "15 km" }
      ]
    },
    {
      id: "prod_6",
      name: "Shimla Green Capsicum (ढोबळी मिरची / शिमला मिर्च)",
      category: "Vine Produce",
      unit: "kg",
      description: "Thick-walled crunchy bell peppers, uniform 4-lobe shape, sorted for sauteing, roasting, and prep.",
      imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_2", farmName: "Godavari Fresh Farms", price: 45.00, stock: 210, harvestReady: "Fresh Batch", distance: "18 km" },
        { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 42.00, stock: 400, harvestReady: "In Buffer", distance: "22 km" }
      ]
    },
    {
      id: "prod_7",
      name: "Spicy Green Chillies (लवंगी मिरची / हरी मिर्च)",
      category: "Herbs & Seasoning",
      unit: "kg",
      description: "Bright green Lavangi chillies with crisp snap and high heat rating. Free from chemical wash.",
      imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_3", farmName: "Bhimashankar Organic Cluster", price: 55.00, stock: 90, harvestReady: "Today", distance: "15 km" },
        { farmerId: "usr_farm_1", farmName: "Sahyadri Agro Producer Co.", price: 58.00, stock: 60, harvestReady: "Cut Today", distance: "12 km" }
      ]
    },
    {
      id: "prod_8",
      name: "Fresh Mint Leaves (पुदिना / Pudina)",
      category: "Herbs & Seasoning",
      unit: "kg",
      description: "Highly fragrant tender mint shoots, unbruised leaves, ideal for kitchen chutneys, curries, and drinks.",
      imageUrl: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_1", farmName: "Sahyadri Agro Producer Co.", price: 40.00, stock: 75, harvestReady: "Cut 6 AM", distance: "12 km" },
        { farmerId: "usr_farm_3", farmName: "Bhimashankar Organic Cluster", price: 42.00, stock: 50, harvestReady: "Today", distance: "15 km" }
      ]
    },
    {
      id: "prod_9",
      name: "Farm Fresh Potatoes (बटाटा / आलू - Jyoti)",
      category: "Root Vegetables",
      unit: "crate (20 kg)",
      description: "Thin-skinned firm Jyoti potatoes, uniform size, low sugar accumulation, excellent for restaurant prep.",
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_2", farmName: "Godavari Fresh Farms", price: 480.00, stock: 85, harvestReady: "Cured & Ready", distance: "18 km" },
        { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 460.00, stock: 250, harvestReady: "Warehouse Stock", distance: "22 km" }
      ]
    },
    {
      id: "prod_10",
      name: "Fresh Ginger (आले / अदरक)",
      category: "Herbs & Seasoning",
      unit: "kg",
      description: "Firm aromatic rhizomes, washed clean, strong pungency and high juice content.",
      imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
      farmPrices: [
        { farmerId: "usr_farm_3", farmName: "Bhimashankar Organic Cluster", price: 90.00, stock: 110, harvestReady: "Cleaned Roots", distance: "15 km" },
        { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 85.00, stock: 350, harvestReady: "In Storage", distance: "22 km" }
      ]
    }
  ],

  orders: [
    {
      id: "ORD-9402",
      restaurantId: "usr_rest_1",
      restaurantName: "The Spice Route Bistro",
      status: "in_transit",
      stepIndex: 3,
      orderDate: "2026-10-07T08:15:00Z",
      deliveryDate: "Today",
      deliveryTimeSlot: "11:00 AM - 1:00 PM (Kitchen Prep Window)",
      deliveryAddress: "Plot 42, High Street, Pune-Mumbai Highway",
      totalAmount: 3420.00,
      paymentStatus: "paid_online",
      redundancyLevel: "Multi-Farm Supply Redundancy Active",
      routeOptimization: "Route Alpha: Sahyadri Agro (Stop 1) -> Godavari Fresh (Stop 2) -> Bistro Kitchen Gate",
      estimatedArrival: "12:15 PM",
      isRecurring: false,
      contributingFarmers: [
        {
          farmerId: "usr_farm_1",
          farmName: "Sahyadri Agro Producer Co.",
          items: "Desi Tomatoes (40 kg), Fresh Spinach (15 kg), Coriander (5 kg)",
          amount: 2045.00,
          status: "harvested_loaded",
          harvestTimestamp: "07:15 AM"
        },
        {
          farmerId: "usr_farm_2",
          farmName: "Godavari Fresh Farms",
          items: "Nashik Red Onions (30 kg), Capsicum (12 kg)",
          amount: 1375.00,
          status: "harvested_loaded",
          harvestTimestamp: "07:50 AM"
        }
      ],
      itemsList: [
        { name: "Desi Red Tomatoes (गावठी टोमॅटो / देशी टमाटर)", qty: 40, unit: "kg", price: 38.00, allocatedFarm: "Sahyadri Agro Producer Co." },
        { name: "Organic Green Spinach (पालक / Palak)", qty: 15, unit: "kg", price: 25.00, allocatedFarm: "Sahyadri Agro Producer Co." },
        { name: "Fresh Coriander Leaves (कोथिंबीर / हरा धनिया)", qty: 5, unit: "kg", price: 30.00, allocatedFarm: "Sahyadri Agro Producer Co." },
        { name: "Nashik Red Onions (नाशिक कांदा / लाल प्याज)", qty: 30, unit: "kg", price: 28.00, allocatedFarm: "Godavari Fresh Farms" },
        { name: "Shimla Green Capsicum (ढोबळी मिरची / शिमला मिर्च)", qty: 12, unit: "kg", price: 45.00, allocatedFarm: "Godavari Fresh Farms" }
      ]
    }
  ],

  recurringOrders: [
    {
      id: "REC-101",
      restaurantId: "usr_rest_1",
      title: "Tuesday & Friday Morning Pantry Staples",
      frequency: "Weekly (Tue, Fri)",
      deliveryDays: ["Tuesday", "Friday"],
      timeSlot: "10:30 AM",
      items: [
        { produceId: "prod_1", name: "Desi Red Tomatoes", qty: 35, unit: "kg" },
        { produceId: "prod_3", name: "Nashik Red Onions", qty: 25, unit: "kg" },
        { produceId: "prod_2", name: "Organic Green Spinach", qty: 15, unit: "kg" },
        { produceId: "prod_5", name: "Fresh Coriander Leaves", qty: 5, unit: "kg" }
      ],
      active: true,
      nextFulfillment: "Friday Morning"
    }
  ],

  reviews: [
    {
      id: "rev_1",
      orderId: "ORD-9388",
      restaurantName: "The Spice Route Bistro",
      farmerId: "usr_farm_1",
      farmName: "Sahyadri Agro Producer Co.",
      rating: 5,
      comment: "Exceptional morning-picked desi tomatoes. Zero transit damage, excellent flavor and firm skin.",
      date: "2026-10-05"
    }
  ],

  notifications: [
    {
      id: "notif_1",
      userId: "usr_rest_1",
      role: "restaurant",
      title: "Vehicle Out For Delivery",
      message: "Order #ORD-9402 consolidated route has completed pickup at Godavari Fresh. Driver arriving by 12:15 PM.",
      timestamp: "10 mins ago",
      type: "transit",
      channel: "SMS & Portal",
      read: false
    },
    {
      id: "notif_2",
      userId: "usr_farm_1",
      role: "farmer",
      title: "Harvest Allocation Scheduled",
      message: "Order #ORD-9402 allocated 40 kg Desi Tomatoes and 15 kg Spinach. Scheduled for morning dispatch.",
      timestamp: "1 hour ago",
      type: "order_assigned",
      channel: "Portal",
      read: true
    }
  ]
};
