/**
 * Harvest Route - In-Memory & File-Backed Data Store
 * Provides unified CRUD operations with automatic file synchronization.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { INITIAL_DATA } from "../data/seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, "../data/harvest_route.json");

export class Store {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn("Could not read existing harvest_route.json, using seed data:", err.message);
    }
    // Deep clone seed data
    const initialClone = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData(initialClone);
    return initialClone;
  }

  saveData(dataToSave = this.data) {
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(dataToSave, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing data file:", err.message);
    }
  }

  // Users
  getUsers() { return this.data.users; }
  getUserById(id) { return this.data.users.find(u => u.id === id); }
  getUserByEmail(email) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  createUser(user) {
    const newUser = {
      id: `usr_${user.role}_${Date.now()}`,
      rating: 5.0,
      completedOrders: 0,
      totalEarnings: 0,
      onTimeRate: 100,
      qualityRating: 5.0,
      ...user
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.saveData();
      return this.data.users[idx];
    }
    return null;
  }

  // Farmers
  getFarmers() {
    return this.data.users.filter(u => u.role === "farmer");
  }

  // Produce Catalog
  getProduceCatalog() { return this.data.produceCatalog; }
  addProduceItem(farmerId, itemData) {
    const farmer = this.getUserById(farmerId);
    let item = this.data.produceCatalog.find(p => p.id === itemData.id || p.name.toLowerCase() === itemData.name.toLowerCase());
    
    if (item) {
      // Add or update farm price
      const existingPriceIdx = item.farmPrices.findIndex(fp => fp.farmerId === farmerId);
      const newPriceEntry = {
        farmerId,
        farmName: farmer ? farmer.organization : "Local Farm",
        price: Number(itemData.price),
        stock: Number(itemData.stock),
        harvestReady: itemData.harvestReady || "Available Daily",
        distance: farmer?.address?.match(/\((.*?)\)/)?.[1] || "8.5 mi"
      };

      if (existingPriceIdx !== -1) {
        item.farmPrices[existingPriceIdx] = newPriceEntry;
      } else {
        item.farmPrices.push(newPriceEntry);
      }
    } else {
      // Create new produce catalog item
      item = {
        id: `prod_${Date.now()}`,
        name: itemData.name,
        category: itemData.category || "Seasonal Produce",
        unit: itemData.unit || "kg",
        description: itemData.description || "Freshly harvested locally.",
        imageUrl: itemData.imageUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
        farmPrices: [
          {
            farmerId,
            farmName: farmer ? farmer.organization : "Local Farm",
            price: Number(itemData.price),
            stock: Number(itemData.stock),
            harvestReady: itemData.harvestReady || "Ready for Harvest",
            distance: "7.0 mi"
          }
        ]
      };
      this.data.produceCatalog.push(item);
    }
    this.saveData();
    return item;
  }

  updateFarmerProduceStock(farmerId, produceId, newStock, newPrice) {
    const item = this.data.produceCatalog.find(p => p.id === produceId);
    if (!item) return null;
    const priceEntry = item.farmPrices.find(fp => fp.farmerId === farmerId);
    if (priceEntry) {
      if (newStock !== undefined) priceEntry.stock = Number(newStock);
      if (newPrice !== undefined) priceEntry.price = Number(newPrice);
      this.saveData();
      return priceEntry;
    }
    return null;
  }

  // Orders
  getOrders() { return this.data.orders; }
  getOrderById(id) { return this.data.orders.find(o => o.id === id); }
  getOrdersForUser(userId, role) {
    if (role === "admin") return this.data.orders;
    if (role === "restaurant") return this.data.orders.filter(o => o.restaurantId === userId);
    if (role === "farmer") {
      return this.data.orders.filter(o => 
        o.contributingFarmers?.some(f => f.farmerId === userId) ||
        o.allocations?.some(a => a.farmerId === userId)
      );
    }
    return [];
  }

  createOrder(orderData) {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      stepIndex: 1, // 1: Confirmed, 2: Harvesting, 3: In Transit, 4: Delivered
      status: "confirmed",
      orderDate: new Date().toISOString(),
      paymentStatus: "paid_stripe",
      ...orderData
    };
    this.data.orders.unshift(newOrder);

    // Create notifications for contributing farmers
    newOrder.contributingFarmers?.forEach(f => {
      this.addNotification({
        userId: f.farmerId,
        role: "farmer",
        title: "🌾 New Harvest Match",
        message: `New Order #${newOrder.id} matched! Please harvest: ${f.items}. Scheduled for ${newOrder.deliveryDate}.`,
        type: "order_assigned",
        channel: "SMS & In-App"
      });
    });

    // Create confirmation notification for restaurant
    this.addNotification({
      userId: newOrder.restaurantId,
      role: "restaurant",
      title: "✅ Order Confirmed & Matched",
      message: `Order #${newOrder.id} secured with ${newOrder.contributingFarmers?.length || 2} local farms. Total: $${newOrder.totalAmount}.`,
      type: "order_confirmed",
      channel: "SMS & In-App"
    });

    this.saveData();
    return newOrder;
  }

  updateOrderStatus(orderId, status, stepIndex) {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.status = status;
    if (stepIndex !== undefined) order.stepIndex = stepIndex;

    const statusDescriptions = {
      harvesting: "Farms have commenced morning harvest.",
      in_transit: "Consolidated route is underway. Estimated delivery within 1 hour.",
      delivered: "Produce inspected & successfully delivered to kitchen."
    };

    this.addNotification({
      userId: order.restaurantId,
      role: "restaurant",
      title: `Order #${order.id} is now ${status.replace('_', ' ').toUpperCase()}`,
      message: statusDescriptions[status] || `Status updated to ${status}.`,
      type: `status_${status}`,
      channel: "SMS & In-App"
    });

    this.saveData();
    return order;
  }

  saveOrder(order) {
    const idx = this.data.orders.findIndex(o => o.id === order.id);
    if (idx !== -1) {
      this.data.orders[idx] = order;
      this.saveData();
    }
  }

  // Recurring Orders
  getRecurringOrders(restaurantId) {
    return this.data.recurringOrders.filter(r => r.restaurantId === restaurantId);
  }

  createRecurringOrder(orderData) {
    const newRec = {
      id: `REC-${Math.floor(100 + Math.random() * 900)}`,
      active: true,
      nextFulfillment: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      ...orderData
    };
    this.data.recurringOrders.push(newRec);
    this.saveData();
    return newRec;
  }

  // Reviews
  getReviews() { return this.data.reviews; }
  addReview(reviewData) {
    const review = {
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...reviewData
    };
    this.data.reviews.unshift(review);

    // Update farmer average rating
    const farmer = this.getUserById(review.farmerId);
    if (farmer) {
      const farmerReviews = this.data.reviews.filter(r => r.farmerId === review.farmerId);
      const avgRating = farmerReviews.reduce((sum, r) => sum + r.rating, 0) / farmerReviews.length;
      farmer.qualityRating = Math.round(avgRating * 10) / 10;
    }

    this.saveData();
    return review;
  }

  // Notifications
  getNotifications(userId) {
    return this.data.notifications.filter(n => !userId || n.userId === userId);
  }

  addNotification(notif) {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: "Just now",
      read: false,
      channel: notif.channel || "In-App",
      ...notif
    };
    this.data.notifications.unshift(newNotif);
    this.saveData();
    return newNotif;
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData();
    }
    return notif;
  }

  // Admin & Analytics
  getAnalytics() {
    const orders = this.data.orders;
    const farmers = this.data.users.filter(u => u.role === "farmer");
    const restaurants = this.data.users.filter(u => u.role === "restaurant");
    const totalGmv = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgDeliveryTimeHours = 3.8;
    const onTimeRateAvg = (farmers.reduce((sum, f) => sum + (f.onTimeRate || 95), 0) / (farmers.length || 1)).toFixed(1);

    return {
      totalOrders: orders.length,
      activeFarmers: farmers.length,
      activeRestaurants: restaurants.length,
      totalGmv: Math.round(totalGmv * 100) / 100,
      avgDeliveryTimeHours,
      networkOnTimeRate: `${onTimeRateAvg}%`,
      disputes: this.data.disputes || []
    };
  }
}

export const store = new Store();
